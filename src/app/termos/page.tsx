import type { Metadata } from "next";
import { TermsContent } from "@/components/LegalPage";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://anonyzap.vercel.app";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Condições de uso do AnonyZap em conformidade com a LGPD (Lei 13.709/2018), o GDPR (Regulamento UE 2016/679) e leis similares de proteção de dados.",
  alternates: {
    canonical: `${BASE_URL}/termos`,
  },
  robots: { index: true, follow: true },
};

export default function TermosPage() {
  return <TermsContent />;
}
