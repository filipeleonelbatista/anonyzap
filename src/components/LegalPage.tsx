"use client";
import React from "react";
import Link from "next/link";
import { useI18n } from "@/context/LanguageContext";
import { legalContent } from "@/i18n/legal";
import type { LegalDoc } from "@/i18n/legal";

interface Props {
  doc: LegalDoc;
  /** Cross-link to the companion legal page (terms <-> privacy). */
  other: { href: string; label: string };
}

/**
 * Shared renderer for the legal pages (/privacidade and /termos).
 * Content comes from the LanguageContext locale; same sections in all
 * languages (translated versions carry the "prevails" note).
 */
export function LegalPage({ doc, other }: Props) {
  const { locale } = useI18n();
  return (
    <main
      className="mx-auto max-w-2xl px-4 py-10 text-gray-900 dark:bg-whatsapp-bg-dark dark:text-gray-100"
      style={{ paddingBottom: "max(3rem, var(--lgpd-banner, 0px))" }}
      lang={locale}
    >
      <h1 className="mb-6 text-2xl font-bold text-whatsapp-header dark:text-whatsapp-green">
        {doc.title}
      </h1>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {doc.updated}
      </p>
      <p className="mb-8 text-sm text-gray-600 dark:text-gray-400">
        <Link
          href={other.href}
          className="font-medium text-whatsapp-green-dark underline dark:text-whatsapp-green"
        >
          {other.label}
        </Link>
      </p>

      {doc.sections.map((section) => (
        <section key={section.h} className="mb-8 space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {section.h}
          </h2>
          {section.p?.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
          {section.ul ? (
            <ul className="list-disc space-y-2 pl-5">
              {section.ul.map((item) => (
                <li key={item.slice(0, 40)}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      {doc.prevails ? (
        <p className="mb-8 text-xs italic text-gray-500 dark:text-gray-400">
          {doc.prevails}
        </p>
      ) : null}

      <p className="text-sm text-gray-600 dark:text-gray-400">
        <Link
          href="/"
          className="font-medium text-whatsapp-green-dark underline dark:text-whatsapp-green"
        >
          {doc.back}
        </Link>
      </p>
    </main>
  );
}

export function PrivacyContent() {
  const { locale, t } = useI18n();
  return (
    <LegalPage
      doc={legalContent[locale].privacy}
      other={{ href: "/termos", label: t.banner.termsLink }}
    />
  );
}

export function TermsContent() {
  const { locale, t } = useI18n();
  return (
    <LegalPage
      doc={legalContent[locale].terms}
      other={{ href: "/privacidade", label: t.banner.privacyLink }}
    />
  );
}
