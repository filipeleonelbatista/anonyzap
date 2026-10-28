"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/context/LanguageContext";

/**
 * Fullscreen gate shown while reading persisted user from localStorage.
 */
export function UserAuthLoadingScreen() {
  const { t } = useI18n();
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-whatsapp-bg dark:bg-whatsapp-bg-dark px-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <img
        src="/icon.svg"
        alt=""
        width={120}
        height={120}
        className="h-28 w-28 select-none drop-shadow-md sm:h-32 sm:w-32"
        decoding="async"
      />
      <span className="sr-only">{t.auth.loading}</span>
      <Loader2
        className="h-10 w-10 shrink-0 animate-spin text-whatsapp-green dark:text-green-400"
        strokeWidth={2}
        aria-hidden
      />
    </div>
  );
}
