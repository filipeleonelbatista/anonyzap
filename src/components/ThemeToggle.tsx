"use client";
import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/context/LanguageContext";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  };

  return (
    <button
      onClick={toggle}
      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 text-white transition-colors text-sm"
      aria-label={dark ? t.theme.light : t.theme.dark}
      title={dark ? t.theme.light : t.theme.dark}
    >
      {dark ? (
        <Sun className="w-[18px] h-[18px]" strokeWidth={2} />
      ) : (
        <Moon className="w-[18px] h-[18px]" strokeWidth={2} />
      )}
    </button>
  );
}
