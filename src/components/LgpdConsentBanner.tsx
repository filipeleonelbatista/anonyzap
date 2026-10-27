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

/**
 * LGPD (Lei 13.709/2018): aviso sobre tratamento de dados no dispositivo e nos servidores.
 * Grava confirmação de ciência em localStorage (não bloqueia uso antes do clique).
 */
export function LgpdConsentBanner() {
  const [visible, setVisible] = useState(false);

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
          Utilizamos armazenamento local no seu navegador (perfil, preferência de tema) e
          tratamos mensagens e mídia de forma temporária nos servidores para o funcionamento
          do chat, conforme nossa{" "}
          <Link
            href="/privacidade"
            className="font-semibold underline decoration-white/70 underline-offset-2 hover:decoration-white"
          >
            Política de Privacidade
          </Link>
          , em conformidade com a{" "}
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
        <button
          type="button"
          onClick={acknowledge}
          className="flex-shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-whatsapp-header shadow-sm transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-whatsapp-header"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
