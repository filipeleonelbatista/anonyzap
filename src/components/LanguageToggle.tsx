"use client";
import React, { useState, useRef, useEffect } from "react";
import { Check, Languages } from "lucide-react";
import { useI18n } from "@/context/LanguageContext";
import type { Locale } from "@/context/LanguageContext";

// Options are shown in their own language (standard practice), no translation needed.
const OPTIONS: { id: Locale; label: string }[] = [
  { id: "pt-BR", label: "Português" },
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
];

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onOutsideClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onOutsideClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 text-white transition-colors"
        aria-label="Idioma / Language"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Idioma / Language"
      >
        <Languages className="w-[18px] h-[18px]" strokeWidth={2} />
      </button>
      {open ? (
        <div
          role="menu"
          aria-label="Idioma / Language"
          className="absolute right-0 top-10 z-50 min-w-[150px] rounded-lg border bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          {OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="menuitemradio"
              aria-checked={locale === id}
              onClick={() => {
                setLocale(id);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-sm text-gray-800 transition-colors hover:bg-black/5 dark:text-gray-100 dark:hover:bg-white/10"
            >
              {label}
              {locale === id ? (
                <Check className="h-4 w-4 text-whatsapp-green" strokeWidth={2} />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
