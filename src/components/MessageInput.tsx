"use client";
import React, { useState, useRef } from "react";
import { ImagePlus, Send, X } from "lucide-react";
import { LinkPreview } from "./LinkPreview";
import { GifPicker } from "./GifPicker";
import { useLinkDetection } from "@/hooks/useLinkDetection";
import { isValidFileType, isValidFileSize } from "@/utils/validation";
import { useI18n } from "@/context/LanguageContext";
import type { LinkPreview as LinkPreviewType, ReplyTo } from "@/types";

interface Props {
  onSend: (content: string, linkPreview?: LinkPreviewType) => void;
  onSendImage: (file: File) => void;
  onSendGif: (gifUrl: string) => void;
  disabled?: boolean;
  replyingTo?: ReplyTo | null;
  onCancelReply?: () => void;
  /** Server-computed: env IS_GIF_ENABLED set AND GIPHY_API_KEY configured. */
  gifEnabled?: boolean;
}

export function MessageInput({ onSend, onSendImage, onSendGif, disabled, replyingTo, onCancelReply, gifEnabled }: Props) {
  const [text, setText] = useState("");
  const { links, detectLinks, clearLinks } = useLinkDetection();
  const { t } = useI18n();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || disabled) return;

    let linkPreviewData: LinkPreviewType | undefined;
    if (links.length > 0) {
      try {
        const res = await fetch("/api/link-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: links[0].url }),
        });
        const data = await res.json();
        if (data.title) {
          linkPreviewData = { url: links[0].url, ...data };
        }
      } catch {}
    }

    onSend(text.trim(), linkPreviewData);
    setText("");
    clearLinks();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitAndReset();
    }
  };

  const adjustHeight = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    detectLinks(e.target.value);
    requestAnimationFrame(adjustHeight);
  };

  const handleSubmitAndReset = (e?: React.FormEvent) => {
    handleSubmit(e);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) el.style.height = "auto";
    });
  };

  const handleImageButtonClick = () => {
    if (disabled) return;
    imageInputRef.current?.click();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!isValidFileType(file)) {
      alert(t.input.invalidFileType);
      return;
    }
    if (!isValidFileSize(file)) {
      alert(t.input.fileTooLarge);
      return;
    }
    onSendImage(file);
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {replyingTo && (
        <div className="w-[95%] mb-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 flex items-center gap-2 text-sm border-l-4 border-whatsapp-green">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-whatsapp-green-dark dark:text-whatsapp-green truncate">
              {replyingTo.senderName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {replyingTo.content}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onCancelReply?.()}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex-shrink-0"
            aria-label={t.input.cancelReply}
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      )}
      {links.length > 0 && (
        <div className="w-[95%] mb-1">
          <LinkPreview url={links[0].url} />
        </div>
      )}
      <form
        onSubmit={handleSubmitAndReset}
        className="w-[95%]"
      >
        <div className="flex items-end gap-0 bg-white dark:bg-gray-800 rounded-[28px] px-1 py-0.5 shadow-lg mb-3 relative">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleImageButtonClick}
            disabled={disabled}
            className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex-shrink-0 mb-[1.8px] disabled:opacity-40 disabled:pointer-events-none"
            aria-label={t.input.addImage}
          >
            <ImagePlus className="w-6 h-6" strokeWidth={2} />
          </button>
          {gifEnabled && (
            <GifPicker onPick={onSendGif} disabled={disabled} />
          )}
          <div className="flex-1 relative min-w-0">
            <textarea
              ref={inputRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder={t.input.placeholder}
              rows={1}
              className="w-full resize-none px-3 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none overflow-y-auto text-sm leading-5"
              disabled={disabled}
            />
          </div>
          <button
            type="submit"
            disabled={!text.trim() || disabled}
            className="w-12 h-12 flex items-center justify-center bg-whatsapp-green hover:bg-whatsapp-green-dark disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-full transition-colors flex-shrink-0 mb-[1.8px]"
            aria-label={t.input.send}
          >
            <Send className="w-6 h-6" strokeWidth={2} />
          </button>
        </div>
      </form>
    </div>
  );
}
