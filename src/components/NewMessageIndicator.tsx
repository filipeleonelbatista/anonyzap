"use client";
import React from "react";
import { useI18n } from "@/context/LanguageContext";

interface Props {
  count: number;
  onClick: () => void;
}

export function NewMessageIndicator({ count, onClick }: Props) {
  const { t } = useI18n();
  if (count === 0) return null;
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-whatsapp-green text-white text-sm px-4 py-1.5 rounded-full shadow-lg hover:bg-whatsapp-green-dark transition-colors animate-bounce"
    >
      {count} {count !== 1 ? t.indicator.many : t.indicator.one} ↓
    </button>
  );
}
