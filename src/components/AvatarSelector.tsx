"use client";
import React from "react";
import { useI18n } from "@/context/LanguageContext";

const AVATARS = [
  "😀", "😎", "🤩", "😺", "🦊", "🐼",
  "🐨", "🦁", "🐯", "🐸", "🦄", "🐙",
];

interface Props {
  selected: string;
  onSelect: (avatar: string) => void;
}

export function AvatarSelector({ selected, onSelect }: Props) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
      {AVATARS.map((avatar) => (
        <button
          key={avatar}
          type="button"
          onClick={() => onSelect(avatar)}
          className={`text-2xl sm:text-3xl w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all ${
            selected === avatar
              ? "ring-2 ring-whatsapp-green scale-110 bg-gray-100 dark:bg-gray-600"
              : "hover:bg-gray-100 dark:hover:bg-gray-600"
          }`}
          aria-label={`${t.avatar.select} ${avatar}`}
        >
          {avatar}
        </button>
      ))}
    </div>
  );
}
