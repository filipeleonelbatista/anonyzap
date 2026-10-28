"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  LGPD_BANNER_CSS_VAR,
  LGPD_BANNER_SPACER,
  LGPD_CONSENT_LEGACY_KEY,
  LGPD_CONSENT_STORAGE_KEY,
} from "@/lib/lgpd-consent";
import { migrateStorageKey } from "@/lib/storage-migration";
import { useI18n } from "@/context/LanguageContext";
import type { Locale } from "@/context/LanguageContext";

const LOCALES: { id: Locale; label: string }[] = [
  { id: "pt-BR", label: "PT" },
  { id: "en", label: "EN" },
  { id: "es", label: "ES" },
];

/**
 * LGPD (Lei 13.709/2018): aviso sobre tratamento de dados no dispositivo e nos servidores.
 * Grava confirmação de ciência em localStorage (não bloqueia uso antes do clique).
 */
export function LgpdConsentBanner() {
  const [visible, setVisible] = useState(false);
  const { locale, setLocale, t } = useI18n();

  useEffect(() => {
    try {
      const ack = migrateStorageKey(
        LGPD_CONSENT_STORAGE_KEY,
        LGPD_CONSENT_LEGACY_KEY
      );
      if (!ack) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) {
      document.documentElement.style.removeProperty(LGPD_BANNER_CSS_VAR);
      return;
    }
    document.documentElement.style.setProperty(LGPD_BANNER_CSS_VAR, LGPD_BANNER_SPACER);
    return () => {
      document.documentElement.style.removeProperty(LGPD_BANNER_CSS_VAR);
    };
  }, [visible]);

  const acknowledge = useCallback(() => {
    try {
      localStorage.setItem(
        LGPD_CONSENT_STORAGE_KEY,
        JSON.stringify({ v: 1, at: new Date().toISOString() })
      );
    } catch {
      // still hide banner; user has acknowledged in-session
    }
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
      <div
        role="region"
        aria-label="Aviso sobre dados pessoais (LGPD)"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-whatsapp-header px-3 py-3 text-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] dark:border-white/10"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-xs leading-relaxed text-white/95 sm:text-sm">
            {t.banner.intro}{" "}
            <Link
              href="/privacidade"
              className="font-semibold underline decoration-white/70 underline-offset-2 hover:decoration-white"
            >
              {t.banner.privacyLink}
            </Link>{" "}
            {t.banner.and}{" "}
            <Link
              href="/termos"
              className="font-semibold underline decoration-white/70 underline-offset-2 hover:decoration-white"
            >
              {t.banner.termsLink}
            </Link>
            {t.banner.compliance}
            <a
              href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline decoration-white/70 underline-offset-2 hover:decoration-white"
            >
              LGPD
            </a>
            .
          </p>
          <div className="flex flex-shrink-0 items-center gap-2">
            <div
              role="group"
              aria-label="Language / Idioma"
              className="flex items-center gap-1"
            >
              {LOCALES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLocale(id)}
                  aria-pressed={locale === id}
                  className={`rounded px-1.5 py-1 text-xs font-semibold transition ${
                    locale === id
                      ? "bg-white/25 underline"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={acknowledge}
              className="flex-shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-whatsapp-header shadow-sm transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-whatsapp-header"
            >
              {t.banner.acknowledge}
            </button>
          </div>
        </div>
      </div>
    );
}
