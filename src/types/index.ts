export type MessageType = "text" | "image" | "link" | "system";

/** When `type` is `system`, indicates join/leave for the room. */
export type PresenceKind = "join" | "leave";

export type MessageStatus = "pending" | "sent" | "delivered";

export const REACTION_EMOJIS = ["❤️", "😂", "😨", "😡", "🤔"] as const;

export type ReactionEmoji = typeof REACTION_EMOJIS[number];

export interface Reaction {
  emoji: ReactionEmoji;
  userId: string;
  userName: string;
}

export interface LinkPreview {
  url: string;
  title: string;
  description: string;
  image?: string;
}

export interface GifResult {
  id: string;
  title: string;
  /** Thumbnail for the picker grid (GIPHY fixed_width). */
  smallUrl: string;
  /** Full GIF URL sent in the message (GIPHY downsized_medium). */
  url: string;
}

export interface ReplyTo {
  messageId: string;
  senderName: string;
  content: string;
  deleted?: boolean;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: MessageType;
  /** Set when `type` is `system` (join/leave balloons). */
  presence?: PresenceKind;
  imageUrl?: string;
  linkPreview?: LinkPreview;
  status: MessageStatus;
  reactions?: Reaction[];
  replyTo?: ReplyTo;
  deleted?: boolean;
  timestamp: number;
  createdAt: string;
}

export type SSEAction =
  | { action: "message"; message: Message; tempId?: string }
  | { action: "react"; messageId: string; reactions: Reaction[] }
  | { action: "delete"; messageId: string };

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: number;
}

export interface ConnectionStatus {
  type: "connected" | "reconnecting" | "disconnected";
  message?: string;
}
