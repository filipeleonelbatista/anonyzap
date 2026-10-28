import type { Metadata } from "next";
import { PrivacyContent } from "@/components/LegalPage";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://anonyzap.vercel.app";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o AnonyZap trata dados pessoais em conformidade com a LGPD (Lei 13.709/2018) e o GDPR (Regulamento UE 2016/679).",
  alternates: {
    canonical: `${BASE_URL}/privacidade`,
  },
  robots: { index: true, follow: true },
};

export default function PrivacidadePage() {
  return <PrivacyContent />;
}
