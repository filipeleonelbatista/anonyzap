"use client";

import { useCallback, useState } from "react";
import { Share2, Heart, Reply } from "lucide-react";
import { useI18n } from "@/context/LanguageContext";

function buildRoomUrl(roomId: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/${encodeURIComponent(roomId)}`;
  }
  const base =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ??
    "https://anonyzap.vercel.app";
  return `${base}/${encodeURIComponent(roomId)}`;
}

const cardBase =
  "w-full max-w-sm rounded-xl border border-gray-200/90 bg-white px-4 py-3 text-center shadow-sm dark:border-gray-600 dark:bg-gray-800";

interface Props {
  roomId: string;
}

export function EmptyRoomHints({ roomId }: Props) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const handleShare = useCallback(async () => {
    const url = buildRoomUrl(roomId);
    const fullText = `${t.empty.inviteMessage}\n\n${url}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: `${t.empty.shareTitle} #${roomId} — AnonyZap`,
          text: `${t.empty.inviteMessage}\n${url}`,
        });
        return;
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt(t.empty.copyPrompt, fullText);
    }
  }, [roomId, t]);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <button
        type="button"
        onClick={handleShare}
        className={`${cardBase} flex cursor-pointer flex-col items-center gap-2 transition hover:bg-gray-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp-green dark:hover:bg-white/5`}
        aria-label={t.empty.inviteAria}
      >
        <Share2
          className="h-8 w-8 text-whatsapp-green dark:text-whatsapp-green"
          strokeWidth={2}
          aria-hidden
        />
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {t.empty.invite}
        </span>
        {copied ? (
          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            {t.empty.copied}
          </span>
        ) : null}
      </button>

      <div
        className={`${cardBase} flex flex-col items-center gap-2`}
        role="note"
      >
        <Heart
          className="h-8 w-8 text-whatsapp-green dark:text-whatsapp-green"
          strokeWidth={2}
          aria-hidden
        />
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {t.empty.react}
        </p>
      </div>

      <div
        className={`${cardBase} flex flex-col items-center gap-2`}
        role="note"
      >
        <Reply
          className="h-8 w-8 text-whatsapp-green dark:text-whatsapp-green"
          strokeWidth={2}
          aria-hidden
        />
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {t.empty.reply}
        </p>
      </div>
    </div>
  );
}
