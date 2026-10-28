"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { HelpCircle, Users, Share2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { RoomProvider } from "@/context/RoomContext";
import { useRoom } from "@/context/RoomContext";
import { useI18n } from "@/context/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";
import { UserRegistrationModal } from "./UserRegistrationModal";
import { UserAuthLoadingScreen } from "./UserAuthLoadingScreen";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ConnectionStatus } from "./ConnectionStatus";
import { HelpModal } from "./HelpModal";
import { ThemeToggle } from "./ThemeToggle";
import { PeopleModal } from "./PeopleModal";
import { EditProfileModal } from "./EditProfileModal";
import type { LinkPreview, Message, ReplyTo } from "@/types";

interface Props {
  roomId: string;
  /** Server-computed: env IS_GIF_ENABLED set AND GIPHY_API_KEY configured. */
  gifEnabled?: boolean;
}

function ChatContent({ roomId, gifEnabled }: Props) {
  const { user, updateProfile } = useUser();
  const { t } = useI18n();
  const [helpOpen, setHelpOpen] = useState(false);
  const [peopleOpen, setPeopleOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const {
    messages,
    status,
    sendMessage,
    loadOlderMessages,
    hasMoreMessages,
    loadingOlder,
  } = useRoom();

  const [replyingTo, setReplyingTo] = useState<ReplyTo | null>(null);
  const [shareToastVisible, setShareToastVisible] = useState(false);
  const shareToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (shareToastTimerRef.current) {
        clearTimeout(shareToastTimerRef.current);
      }
    };
  }, []);

  const showShareToast = useCallback(() => {
    if (shareToastTimerRef.current) {
      clearTimeout(shareToastTimerRef.current);
    }
    setShareToastVisible(true);
    shareToastTimerRef.current = setTimeout(() => {
      setShareToastVisible(false);
      shareToastTimerRef.current = null;
    }, 3500);
  }, []);

  const handleShareRoom = useCallback(async () => {
    const url = `${window.location.origin}/${encodeURIComponent(roomId)}`;
    try {
      await navigator.clipboard.writeText(url);
      showShareToast();
    } catch {
      window.prompt(t.header.copyPrompt, url);
    }
  }, [roomId, showShareToast, t]);

  const handleReply = useCallback((message: Message) => {
    setReplyingTo({
      messageId: message.id,
      senderName: message.senderName,
      content: message.content.slice(0, 80),
    });
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  const handleSend = useCallback((content: string, linkPreview?: LinkPreview) => {
    sendMessage(content, { linkPreview, replyTo: replyingTo ?? undefined });
    setReplyingTo(null);
  }, [replyingTo, sendMessage]);

  const handleSendImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || res.statusText);
      }
      const { url } = (await res.json()) as { url: string };
      sendMessage("", { imageUrl: url });
    } catch {
      alert(t.header.imageError);
    }
  };

  // GIFs referenced by GIPHY URL only (no upload), same image path as uploads.
  const handleSendGif = useCallback(
    (gifUrl: string) => {
      sendMessage("", { imageUrl: gifUrl });
    },
    [sendMessage]
  );

  const statusLabel =
    status.type === "connected"
      ? t.status.connected
      : status.type === "reconnecting"
        ? t.status.reconnecting
        : t.status.disconnected;

  return (
    <div
      className="flex flex-col h-full w-full mx-auto max-w-3xl lg:max-w-none shadow-2xl relative bg-whatsapp-bg dark:bg-whatsapp-bg-dark"
      style={{
        paddingBottom:
          "calc(env(safe-area-inset-bottom, 0px) + var(--lgpd-banner, 0px))",
      }}
    >
      {/* Header */}
      <div className="chat-header flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setEditProfileOpen(true)}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-xl transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            aria-label={t.header.editProfileAria}
            title={t.header.editProfile}
          >
            {user!.avatar}
          </button>
          <div className="min-w-0">
            <h1 className="font-semibold text-sm truncate">#{roomId}</h1>
            <div
              className="flex items-center gap-1.5 cursor-default"
              title={statusLabel}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  status.type === "connected"
                    ? "bg-green-500"
                    : status.type === "reconnecting"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />
              <p className="text-xs opacity-80 truncate">{user!.name}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => void handleShareRoom()}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
            aria-label={t.header.shareAria}
            title={t.header.shareTitle}
          >
            <Share2 className="h-[18px] w-[18px]" strokeWidth={2} />
          </button>
          <button
            onClick={() => setPeopleOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 text-white transition-colors"
            aria-label={t.header.peopleAria}
            title={t.header.peopleTitle}
          >
            <Users className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>
          <button
            onClick={() => setHelpOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 text-white transition-colors"
            aria-label={t.header.helpAria}
            title={t.header.helpTitle}
          >
            <HelpCircle className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>
        </div>
      </div>
      {/* Messages */}
      <MessageList
        messages={messages}
        roomId={roomId}
        userId={user!.id}
        onLoadOlder={loadOlderMessages}
        hasMore={hasMoreMessages}
        loadingOlder={loadingOlder}
        onReply={handleReply}
      />
      {/* Input */}
      <MessageInput
        onSend={handleSend}
        onSendImage={handleSendImage}
        onSendGif={handleSendGif}
        gifEnabled={gifEnabled}
        disabled={status.type === "disconnected"}
        replyingTo={replyingTo}
        onCancelReply={handleCancelReply}
      />
      {/* Help Modal */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      {/* People Modal */}
      <PeopleModal
        roomId={roomId}
        isOpen={peopleOpen}
        onClose={() => setPeopleOpen(false)}
      />
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        user={user!}
        onSave={(name, avatar) => {
          updateProfile(name, avatar);
          setEditProfileOpen(false);
        }}
      />
      {shareToastVisible ? (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed bottom-24 left-1/2 z-[60] max-w-[min(90vw,20rem)] -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm text-white shadow-lg dark:bg-gray-100 dark:text-gray-900"
        >
          {t.header.shareToast}
        </div>
      ) : null}
    </div>
  );
}

export function ChatInterface({ roomId }: Props) {
  const { user, register, isRegistered, isAuthReady } = useUser();

  const handleRegister = (
    name: string,
    email: string,
    avatar: string
  ) => {
    register(name, email, avatar);
  };

  if (!isAuthReady) {
    return <UserAuthLoadingScreen />;
  }

  if (!isRegistered || !user) {
    return (
      <UserRegistrationModal roomId={roomId} onRegister={handleRegister} />
    );
  }

  return (
    <RoomProvider
      roomId={roomId}
      userId={user.id}
      userName={user.name}
      userAvatar={user.avatar}
    >
      <ChatContent roomId={roomId} />
    </RoomProvider>
  );
}
