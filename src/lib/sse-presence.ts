import { kv } from "@/lib/kv";

/**
 * TTL on `room:{roomId}:presence:user:{userId}` (SET of connection ids).
 * Refreshed on each connect/disconnect so abandoned keys eventually expire if cancel never runs.
 */
const PRESENCE_USER_SET_TTL_SEC = 172800; // 48h

const REGISTER_TAB_LUA = `
local key = KEYS[1]
local member = ARGV[1]
local ttl = tonumber(ARGV[2])
redis.call('SADD', key, member)
redis.call('EXPIRE', key, ttl)
return redis.call('SCARD', key)
`;

const UNREGISTER_TAB_LUA = `
local key = KEYS[1]
local member = ARGV[1]
local ttl = tonumber(ARGV[2])
redis.call('SREM', key, member)
local n = redis.call('SCARD', key)
if n == 0 then
  redis.call('DEL', key)
else
  redis.call('EXPIRE', key, ttl)
end
return n
`;

function presenceUserSetKey(roomId: string, userId: string): string {
  return `room:${roomId}:presence:user:${userId}`;
}

/**
 * Registers one SSE tab in Redis. Returns the number of tabs for this user in the room after add.
 * First tab → return value `1` (emit join). Safe across serverless instances.
 */
export async function registerSseTab(
  roomId: string,
  userId: string,
  clientId: string
): Promise<number> {
  const key = presenceUserSetKey(roomId, userId);
  const raw = await kv.eval(REGISTER_TAB_LUA, [key], [
    clientId,
    String(PRESENCE_USER_SET_TTL_SEC),
  ]);
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Removes one SSE tab from Redis. Returns remaining tab count for this user in the room.
 * Zero → emit leave.
 */
export async function unregisterSseTab(
  roomId: string,
  userId: string,
  clientId: string
): Promise<number> {
  const key = presenceUserSetKey(roomId, userId);
  const raw = await kv.eval(UNREGISTER_TAB_LUA, [key], [
    clientId,
    String(PRESENCE_USER_SET_TTL_SEC),
  ]);
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) ? n : 0;
}
