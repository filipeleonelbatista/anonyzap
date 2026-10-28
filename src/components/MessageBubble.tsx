"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Clock, Check, CheckCircle2, ChevronDown, X } from "lucide-react";
import { ImageLightbox } from "@/components/ImageLightbox";
import { PreviewPlaceholder } from "@/components/PreviewPlaceholder";
import type { Message, Reaction, ReplyTo } from "@/types";
import { REACTION_EMOJIS } from "@/types";
import { formatTimestamp } from "@/utils/formatting";
import { useRoom } from "@/context/RoomContext";
import { useI18n } from "@/context/LanguageContext";

const URL_REGEX = /(https?:\/\/[^\s<]+[^\s<.,;:!?)\]}>])/g;

function ClockIcon() {
  return <Clock className="w-3.5 h-3.5 text-gray-400" />;
}

function SingleCheckIcon() {
  return <Check className="w-3.5 h-3.5 text-gray-400" />;
}

function DoubleCheckIcon() {
  return <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />;
}

function linkify(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(URL_REGEX.source, "g");
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[1]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800"
      >
        {match[1]}
      </a>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

function aggregateReactions(reactions: Reaction[]) {
  const map = new Map<
    string,
    {
      emoji: string;
      entries: { userId: string; userName: string }[];
    }
  >();
  for (const r of reactions) {
    const existing = map.get(r.emoji);
    const row = {
      userId: r.userId,
      userName: (r.userName && r.userName.trim()) || "—",
    };
    if (existing) {
      existing.entries.push(row);
    } else {
      map.set(r.emoji, { emoji: r.emoji, entries: [row] });
    }
  }
  const order = new Map<string, number>(
    REACTION_EMOJIS.map((e, i) => [e, i]) as [string, number][]
  );
  return Array.from(map.values())
    .map((g) => ({
      emoji: g.emoji,
      count: g.entries.length,
      entries: g.entries,
    }))
    .sort((a, b) => {
      const ia = order.has(a.emoji) ? order.get(a.emoji)! : 99;
      const ib = order.has(b.emoji) ? order.get(b.emoji)! : 99;
      if (ia !== ib) return ia - ib;
      return a.emoji.localeCompare(b.emoji);
    });
}

interface Props {
  message: Message;
  isOwn: boolean;
  onReply: (message: Message) => void;
  scrollToMessage: (messageId: string) => void;
}

export function MessageBubble({ message, isOwn, onReply, scrollToMessage }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [reactionModalOpen, setReactionModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { reactToMessage, deleteMessage } = useRoom();
  const { t, locale } = useI18n();
  const menuRef = useRef<HTMLDivElement>(null);

  const reactionGroups = useMemo(
    () =>
      message.reactions?.length
        ? aggregateReactions(message.reactions)
        : [],
    [message.reactions]
  );
  const reactionTotal = message.reactions?.length ?? 0;

  const positioningRef = useRef(true);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setEmojiPickerOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) setReactionModalOpen(false);
  }, [menuOpen]);

  useEffect(() => {
    if (!reactionModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setReactionModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "unset";
    };
  }, [reactionModalOpen]);

  // Adjust dropdown position to stay within viewport
  useEffect(() => {
    if (!menuOpen) {
      positioningRef.current = true;
      return;
    }
    const el = menuRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    el.style.right = "";
    el.style.left = "";
    el.style.top = "";
    el.style.bottom = "";

    if (rect.right > window.innerWidth) {
      el.style.right = "auto";
      el.style.left = "0";
    }
    if (rect.bottom > window.innerHeight) {
      el.style.top = "auto";
      el.style.bottom = "calc(100% + 8px)";
    }
  }, [menuOpen]);

  if (message.type === "system" && message.presence) {
    const line =
      message.presence === "join"
        ? `${message.senderName} ${t.bubble.joined}`
        : `${message.senderName} ${t.bubble.left}`;
    return (
      <div className="flex justify-center py-1">
        <div
          className="max-w-[min(90%,32rem)] rounded-lg border border-gray-200/90 bg-white px-3 py-2 text-center text-xs leading-snug text-gray-600 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          role="status"
        >
          {line}
        </div>
      </div>
    );
  }

  const hasReactions =
    !message.deleted &&
    Boolean(message.reactions?.length);

  return (
    <>
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} items-end gap-2 ${hasReactions ? "mb-9" : "mb-2"}`}
    >
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-lg flex-shrink-0">
          {message.senderAvatar}
        </div>
      )}
       <div
         className={`max-w-[80%] min-w-[230px] relative overflow-visible rounded-lg px-3 py-2 shadow-sm ${
           isOwn
             ? "bg-whatsapp-bubble dark:bg-[#005C4B] rounded-br-sm"
             : "bg-white dark:bg-gray-700 rounded-bl-sm"
         }`}
       >
        {!isOwn && (
          <p className="text-xs font-semibold text-whatsapp-green-dark dark:text-whatsapp-green mb-1">
            {message.senderName}
          </p>
        )}

        {/* Reply preview */}
        {message.replyTo && (
          <div
            className="flex items-stretch gap-2 mb-2 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); scrollToMessage(message.replyTo!.messageId); }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); scrollToMessage(message.replyTo!.messageId); } }}
          >
            <div className={`w-1 rounded-full flex-shrink-0 ${
              message.replyTo.deleted
                ? "bg-gray-300 dark:bg-gray-500"
                : "bg-whatsapp-green dark:bg-green-400"
            }`} />
            <div className="flex-1 min-w-0 bg-black/5 dark:bg-white/10 rounded p-1.5">
              <p className="text-xs font-semibold text-whatsapp-green-dark dark:text-whatsapp-green truncate">
                {message.replyTo.senderName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {message.replyTo.deleted ? (
                  <span className="italic">{t.bubble.deletedShort}</span>
                ) : (
                  message.replyTo.content
                )}
              </p>
            </div>
          </div>
        )}

        {/* Caret menu */}
        <div className="absolute top-1 right-1">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label={t.bubble.menu}
            aria-expanded={menuOpen}
          >
            <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute top-6 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700 py-1 min-w-[150px]"
            >
              <button
                onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                😊 {t.bubble.react}
              </button>

              <button
                onClick={() => {
                  onReply(message);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                ↩ {t.bubble.reply}
              </button>

              {emojiPickerOpen && (
                <div className="flex gap-1 px-3 py-2 border-t dark:border-gray-700">
                  {REACTION_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        reactToMessage(message.id, emoji);
                        setMenuOpen(false);
                        setEmojiPickerOpen(false);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {isOwn && (
                <button
                  onClick={() => {
                    deleteMessage(message.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  🗑 {t.bubble.delete}
                </button>
              )}
            </div>
          )}
        </div>

        {message.deleted ? (
          <div className="italic text-gray-400 dark:text-gray-500 text-sm py-3 text-center">
            {t.bubble.deletedLong}
          </div>
        ) : (
          <>
            {message.type === "image" && message.imageUrl && (
              <img
                src={message.imageUrl}
                alt={t.bubble.sharedImage}
                className="max-w-[320px] rounded-lg mb-1 cursor-pointer"
                onClick={() => setLightboxOpen(true)}
              />
            )}
            {message.type === "link" && message.linkPreview && (
              <a
                href={message.linkPreview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block max-w-[320px] mb-1 border rounded-lg overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {message.linkPreview.image ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={message.linkPreview.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <PreviewPlaceholder className="aspect-video" />
                )}
                <div className="p-2">
                  <p className="text-sm font-semibold truncate">
                    {message.linkPreview.title}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {message.linkPreview.description}
                  </p>
                </div>
              </a>
            )}
            <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
              {linkify(message.content)}
            </p>
          </>
        )}

        <div className="relative mt-1">
          <div className="flex w-full justify-end items-center gap-1">
            <span className="text-[10px] text-gray-400">
              {formatTimestamp(message.timestamp, locale)}
            </span>
            {isOwn && message.status === "pending" && <ClockIcon />}
            {isOwn && message.status === "sent" && <SingleCheckIcon />}
            {isOwn && message.status === "delivered" && <DoubleCheckIcon />}
          </div>
          {hasReactions && reactionGroups.length > 0 && (
            <div
              className={`pointer-events-none absolute top-full z-10 translate-y-0.5 ${
                isOwn ? "right-[-2]" : "right-[-2]"
              }`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  setEmojiPickerOpen(false);
                  setReactionModalOpen(true);
                }}
                className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white py-0.5 pl-0.5 pr-2 shadow-lg transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                aria-haspopup="dialog"
                aria-expanded={reactionModalOpen}
                aria-label={`${t.bubble.reactionsLabel}: ${reactionTotal} ${t.bubble.reactionsTotal}`}
              >
                <span className="flex items-center pl-0.5">
                  {reactionGroups.map((g, idx) => (
                    <span
                      key={g.emoji}
                      className={`mt-0.5 relative shrink-0 select-none bg-transparent text-[17px] leading-none ${
                        idx > 0 ? "-ml-1.5" : ""
                      }`}
                      style={{ zIndex: reactionGroups.length - idx }}
                      aria-hidden
                    >
                      {g.emoji}
                    </span>
                  ))}
                </span>
                <span className="text-xs font-semibold tabular-nums text-gray-600 dark:text-gray-300">
                  {reactionTotal}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

    {lightboxOpen && message.imageUrl && (
      <ImageLightbox src={message.imageUrl} onClose={() => setLightboxOpen(false)} />
    )}

    {reactionModalOpen &&
      typeof document !== "undefined" &&
      createPortal(
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={() => setReactionModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reaction-modal-title"
            className="max-h-[80dvh] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <h2
                id="reaction-modal-title"
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                {t.bubble.reactionsTitle}
              </h2>
              <button
                type="button"
                onClick={() => setReactionModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={t.profile.close}
              >
                <X className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>
            <div className="max-h-[calc(80dvh-5rem)] overflow-y-auto px-4 py-3">
              {reactionGroups.map((group) => (
                <section key={group.emoji} className="mb-5 last:mb-0">
                  <h3 className="mb-2 flex items-center gap-2 border-b border-gray-100 pb-2 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                    <span className="text-xl leading-none" aria-hidden>
                      {group.emoji}
                    </span>
                    <span className="font-normal text-gray-500 dark:text-gray-400">
                      ({group.count})
                    </span>
                  </h3>
                  <ul className="space-y-2">
                    {group.entries.map((row) => (
                      <li
                        key={`${group.emoji}-${row.userId}`}
                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <span className="text-base leading-none" aria-hidden>
                          {group.emoji}
                        </span>
                        <span className="min-w-0 truncate">{row.userName}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
