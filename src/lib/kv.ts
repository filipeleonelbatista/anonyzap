import { createClient } from "@vercel/kv";
import { ROOM_HISTORY_MS } from "@/lib/room-history";

// The Vercel/Upstash integration injects env names prefixed with the store name (KV_ANONYZAP_*).
// Fall back to the standard names so deployments using plain KV_* still work.
const kv = createClient({
  url: process.env.KV_ANONYZAP_KV_REST_API_URL ?? process.env.KV_REST_API_URL!,
  token: process.env.KV_ANONYZAP_KV_REST_API_TOKEN ?? process.env.KV_REST_API_TOKEN!,
});

export { kv };
import type {
  LinkPreview,
  Message,
  MessageStatus,
  Reaction,
  ReplyTo,
} from "@/types";

/** Seconds; keep in sync with {@link ROOM_HISTORY_MS}. */
const MESSAGE_TTL = 86400; // 24 hours in seconds

/**
 * Atomic read–modify–write for reactions (avoids lost updates when two users react at once).
 * Rules: at most one reaction per userId; same emoji again removes; different emoji replaces that user's row.
 */
const APPLY_REACTION_LUA = `
local key = KEYS[1]
local msgRoom = redis.call('HGET', key, 'roomId')
if (not msgRoom) or (msgRoom ~= ARGV[4]) then
  return redis.error_reply('ERR_MESSAGE_NOT_FOUND')
end

local raw = redis.call('HGET', key, 'reactions')
local reactions = {}
if raw and raw ~= '' and raw ~= 'null' then
  local ok, decoded = pcall(cjson.decode, raw)
  if ok and type(decoded) == 'table' then
    reactions = decoded
  end
end

local userId = ARGV[1]
local userName = ARGV[2]
local emoji = ARGV[3]

local idx = nil
for i, r in ipairs(reactions) do
  if type(r) == 'table' and r.userId == userId then
    idx = i
    break
  end
end

if idx ~= nil then
  if reactions[idx].emoji == emoji then
    table.remove(reactions, idx)
  else
    reactions[idx].emoji = emoji
    reactions[idx].userName = userName
  end
else
  table.insert(reactions, {
    userId = userId,
    userName = userName,
    emoji = emoji,
  })
end

local out = cjson.encode(reactions)
redis.call('HSET', key, 'reactions', out)
return out
`;

export async function applyReactionAtomic(
  roomId: string,
  messageId: string,
  userId: string,
  userName: string,
  emoji: string
): Promise<
  | { ok: true; reactions: Reaction[] }
  | { ok: false; notFound: true }
  | { ok: false; error: string }
> {
  const key = `message:${messageId}`;
  try {
    const raw = await kv.eval(APPLY_REACTION_LUA, [key], [
      userId,
      userName,
      emoji,
      roomId,
    ]);
    const str = typeof raw === "string" ? raw : JSON.stringify(raw);
    const reactions = parseReactions(str);
    return { ok: true, reactions };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("ERR_MESSAGE_NOT_FOUND")) {
      return { ok: false, notFound: true };
    }
    return { ok: false, error: msg };
  }
}

function parseReactions(raw: string | undefined): Reaction[] {
  if (!raw || raw === "") return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const out: Reaction[] = [];
    for (const r of parsed) {
      if (
        r != null &&
        typeof r === "object" &&
        typeof (r as Reaction).userId === "string" &&
        typeof (r as Reaction).emoji === "string"
      ) {
        out.push({
          emoji: (r as Reaction).emoji,
          userId: (r as Reaction).userId,
          userName:
            typeof (r as Reaction).userName === "string"
              ? (r as Reaction).userName
              : "",
        });
      }
    }
    // One reaction per user; keep last if duplicates exist in storage
    const byUser = new Map<string, Reaction>();
    for (const r of out) {
      byUser.set(r.userId, r);
    }
    return [...byUser.values()];
  } catch {
    return [];
  }
}

function parseLinkPreview(raw: string | undefined): LinkPreview | undefined {
  if (!raw || raw === "") return undefined;
  try {
    const parsed = JSON.parse(raw) as LinkPreview;
    if (parsed && typeof parsed === "object" && typeof parsed.url === "string") {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

function parseReplyTo(raw: string | undefined): ReplyTo | undefined {
  if (!raw || raw === "") return undefined;
  try {
    const parsed = JSON.parse(raw) as ReplyTo;
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.messageId === "string"
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

function fieldsToMessage(fields: Record<string, string>): Message | null {
  if (!fields.id || !fields.roomId) return null;
  const type = fields.type as Message["type"];
  if (type === "system") {
    const p = fields.presence;
    if (p !== "join" && p !== "leave") return null;
  }
  return {
    id: fields.id,
    roomId: fields.roomId,
    senderId: fields.senderId,
    senderName: fields.senderName,
    senderAvatar: fields.senderAvatar,
    content: fields.content,
    type,
    ...(fields.presence === "join" || fields.presence === "leave"
      ? { presence: fields.presence as Message["presence"] }
      : {}),
    imageUrl: fields.imageUrl,
    linkPreview: parseLinkPreview(fields.linkPreview),
    status: (fields.status as MessageStatus) || "sent",
    reactions: parseReactions(fields.reactions),
    replyTo: parseReplyTo(fields.replyTo),
    deleted: fields.deleted === "true",
    timestamp: Number(fields.timestamp),
    createdAt: fields.createdAt,
  };
}

export interface StoredMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: "text" | "image" | "link" | "system";
  presence?: "join" | "leave";
  imageUrl?: string;
  linkPreview?: {
    url: string;
    title: string;
    description: string;
    image?: string;
  };
  reactions?: Reaction[];
  replyTo?: ReplyTo;
  timestamp: number;
  createdAt: string;
}

export async function saveMessage(roomId: string, message: Message): Promise<void> {
  const messagesKey = `room:${roomId}:messages`;
  const messageKey = `message:${message.id}`;
  const data: Record<string, string | number> = {
    id: message.id,
    roomId: message.roomId,
    senderId: message.senderId,
    senderName: message.senderName,
    senderAvatar: message.senderAvatar,
    content: message.content,
    type: message.type,
    timestamp: message.timestamp,
    createdAt: message.createdAt,
    status: message.status,
  };
  if (message.imageUrl != null && message.imageUrl !== "") {
    data.imageUrl = message.imageUrl;
  }
  if (message.linkPreview != null) {
    data.linkPreview = JSON.stringify(message.linkPreview);
  }
  if (message.replyTo != null) {
    data.replyTo = JSON.stringify(message.replyTo);
  }
  if (message.reactions != null && message.reactions.length > 0) {
    data.reactions = JSON.stringify(message.reactions);
  }
  if (message.deleted === true) {
    data.deleted = "true";
  }
  if (message.type === "system" && message.presence) {
    data.presence = message.presence;
  }

  await Promise.all([
    kv.zadd(messagesKey, { score: message.timestamp, member: message.id }),
    kv.hset(messageKey, data as Record<string, unknown>),
    kv.expire(messagesKey, MESSAGE_TTL),
    kv.expire(messageKey, MESSAGE_TTL),
  ]);
}

export async function updateMessage(
  roomId: string,
  messageId: string,
  fields: Record<string, unknown>
): Promise<void> {
  const messageKey = `message:${messageId}`;
  await kv.hset(
    messageKey,
    Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v != null)
    )
  );
}

async function fetchMessagesByIds(
  messageIds: string[]
): Promise<Message[]> {
  if (messageIds.length === 0) return [];
  const keys = messageIds.map((id) => `message:${id}`);
  const results = await Promise.all(
    keys.map((key) => kv.hgetall(key))
  );
  return results
    .filter(
      (r): r is Record<string, string> =>
        r != null && Object.keys(r as object).length > 0
    )
    .map((r) => fieldsToMessage(r as Record<string, string>))
    .filter((m): m is Message => m != null);
}

/** Newest `limit` messages whose score is still inside the rolling 24h window. */
export async function getLatestMessagesInWindow(
  roomId: string,
  limit: number,
  now?: number
): Promise<Message[]> {
  const t = now ?? Date.now();
  const minScore = t - ROOM_HISTORY_MS;
  const messagesKey = `room:${roomId}:messages`;
  const messageIds = await kv.zrange(messagesKey, minScore, "+inf", {
    byScore: true,
    rev: true,
    offset: 0,
    count: limit,
  });
  const messages = await fetchMessagesByIds(messageIds as string[]);
  return messages
    .filter((m) => m.timestamp >= minScore)
    .sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Next older page strictly before `oldestLoadedTimestamp` (client passes min ts in view),
 * still within the rolling 24h window.
 */
export async function getOlderMessagesInWindow(
  roomId: string,
  oldestLoadedTimestamp: number,
  limit: number,
  now?: number
): Promise<Message[]> {
  const t = now ?? Date.now();
  const minScore = t - ROOM_HISTORY_MS;
  const maxScore = oldestLoadedTimestamp - 1;
  if (maxScore < minScore) return [];
  const messagesKey = `room:${roomId}:messages`;
  const messageIds = await kv.zrange(messagesKey, minScore, maxScore, {
    byScore: true,
    rev: true,
    offset: 0,
    count: limit,
  });
  const messages = await fetchMessagesByIds(messageIds as string[]);
  return messages
    .filter((m) => m.timestamp >= minScore)
    .sort((a, b) => a.timestamp - b.timestamp);
}

/** Load a single message by id and ensure it belongs to the room. */
export async function getMessageForRoom(
  roomId: string,
  messageId: string
): Promise<Message | null> {
  const raw = await kv.hgetall(`message:${messageId}`);
  if (raw == null || Object.keys(raw).length === 0) return null;
  const message = fieldsToMessage(raw as Record<string, string>);
  if (!message || message.roomId !== roomId) return null;
  return message;
}

export async function deleteRoomMessages(
  roomId: string
): Promise<void> {
  const messagesKey = `room:${roomId}:messages`;
  const messageIds = await kv.zrange(messagesKey, 0, -1);
  if (messageIds.length > 0) {
    const keys = messageIds.map((id) => `message:${id}`);
    await Promise.all([
      kv.del(messagesKey),
      ...keys.map((k) => kv.del(k)),
    ]);
  }
}
