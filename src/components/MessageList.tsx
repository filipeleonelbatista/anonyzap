"use client";
import React, { useRef, useEffect, useCallback } from "react";
import { MessageBubble } from "./MessageBubble";
import { NewMessageIndicator } from "./NewMessageIndicator";
import { useI18n } from "@/context/LanguageContext";
import { EmptyRoomHints } from "./EmptyRoomHints";
import type { Message } from "@/types";

interface Props {
  messages: Message[];
  roomId: string;
  userId: string;
  onLoadOlder: () => void;
  hasMore: boolean;
  loadingOlder: boolean;
  onReply: (message: Message) => void;
}

export function MessageList({
  messages,
  roomId,
  userId,
  onLoadOlder,
  hasMore,
  loadingOlder,
  onReply,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const [isAtBottom, setIsAtBottom] = React.useState(true);
  const [newCount, setNewCount] = React.useState(0);
  const prevLengthRef = useRef(messages.length);
  const newMsgAccumRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Auto-scroll and track unseen messages.
  // setNewCount is intentionally called here to sync accumulated ref to state.
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
      newMsgAccumRef.current = 0;
    } else if (messages.length > prevLengthRef.current) {
      newMsgAccumRef.current +=
        messages.length - prevLengthRef.current;
    }
    prevLengthRef.current = messages.length;
    setNewCount(newMsgAccumRef.current);
  }, [messages.length, isAtBottom, scrollToBottom]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setIsAtBottom(atBottom);
    if (atBottom) {
      newMsgAccumRef.current = 0;
      setNewCount(0);
    }
    if (el.scrollTop < 50 && hasMore && !loadingOlder) {
      onLoadOlder();
    }
  }, [hasMore, loadingOlder, onLoadOlder]);

  const scrollToMessage = useCallback((messageId: string) => {
    const el = document.getElementById(`msg-${messageId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-whatsapp-green", "ring-opacity-50");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-whatsapp-green", "ring-opacity-50");
      }, 1500);
    }
  }, []);

  const showEmptyHints =
    messages.length === 0 && !loadingOlder && roomId.length > 0;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-2"
    >
      {loadingOlder && (
        <div className="py-2 text-center">
          <span className="text-sm text-gray-400">
            {t.list.loadingOlder}
          </span>
        </div>
      )}
      {showEmptyHints ? (
        <>
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8 min-h-[min(28rem,65vh)]">
            <EmptyRoomHints roomId={roomId} />
          </div>
          <div ref={bottomRef} className="h-0 shrink-0" />
        </>
      ) : (
        <>
          <div className="flex flex-1 flex-col space-y-1">
            {messages.map((msg) => (
              <div key={msg.id} id={`msg-${msg.id}`}>
                <MessageBubble
                  message={msg}
                  isOwn={msg.senderId === userId}
                  onReply={onReply}
                  scrollToMessage={scrollToMessage}
                />
              </div>
            ))}
          </div>
          <div ref={bottomRef} />
        </>
      )}
      <NewMessageIndicator count={newCount} onClick={scrollToBottom} />
    </div>
  );
}
