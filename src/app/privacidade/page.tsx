import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://anonyzap.vercel.app";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o AnonyZap trata dados pessoais em conformidade com a LGPD (Lei 13.709/2018).",
  alternates: {
    canonical: `${BASE_URL}/privacidade`,
  },
  robots: { index: true, follow: true },
};

export default function PrivacidadePage() {
  return (
    <main
      className="mx-auto max-w-2xl px-4 py-10 text-gray-900 dark:bg-whatsapp-bg-dark dark:text-gray-100"
      style={{ paddingBottom: "max(3rem, var(--lgpd-banner, 0px))" }}
    >
      <h1 className="mb-6 text-2xl font-bold text-whatsapp-header dark:text-whatsapp-green">
        Política de Privacidade
      </h1>
      <p className="mb-8 text-sm text-gray-600 dark:text-gray-400">
        Última atualização: maio de 2026. Este documento descreve o tratamento de dados no
        serviço <strong>AnonyZap</strong>, em alinhamento com a Lei Geral de Proteção de
        Dados Pessoais (
        <a
          href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"
          className="text-whatsapp-green-dark underline dark:text-whatsapp-green"
          target="_blank"
          rel="noopener noreferrer"
        >
          Lei nº 13.709/2018 — LGPD
        </a>
        ).
      </p>

      <section className="mb-8 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          1. Quem é responsável pelo tratamento
        </h2>
        <p>
          O tratamento dos dados ocorre em favor da operação do aplicativo web AnonyZap
          (incluindo instâncias hospedadas pelo operador do site). Para exercer seus direitos
          previstos na LGPD, utilize o canal de contato divulgado pelo operador da instância
          que você utiliza (por exemplo, repositório ou página de contato do projeto).
        </p>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          2. Quais dados coletamos e onde
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Dados no seu navegador (armazenamento local):</strong> ao usar o chat,
            você informa nome, e-mail e escolhe um avatar. Essas informações ficam gravadas
            no <em>localStorage</em> do seu dispositivo para reconhecer sua sessão entre
            visitas. Também pode ser armazenada a preferência de tema claro/escuro.
          </li>
          <li>
            <strong>Dados no servidor (temporários):</strong> mensagens de texto, metadados
            necessários ao chat (como identificação da sala e do remetente na conversa),
            pré-visualizações de links e arquivos de imagem enviados são tratados
            temporariamente na infraestrutura do serviço (por exemplo, armazenamento em cache
            / objeto) para viabilizar a conversa em tempo real.
          </li>
        </ul>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          3. Finalidades e bases legais (LGPD)
        </h2>
        <p>
          Os dados são tratados para execução do serviço de mensagens solicitado por você,
          cumprimento de obrigação legal/regulatória quando aplicável, e legítimo interesse
          na segurança e melhoria do serviço, sempre observando os princípios da LGPD (Art.
          6º).
        </p>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          4. Prazo de conservação
        </h2>
        <p>
          O conteúdo das conversas e mídias associadas seguem política de expiração
          automática (por exemplo, remoção após cerca de 24 horas), conforme a configuração
          da instância. Os dados mantidos apenas no seu navegador permanecem até você limpar o
          armazenamento do site ou usar as funções da aplicação para encerrar / apagar a
          sessão local, quando disponíveis.
        </p>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          5. Compartilhamento
        </h2>
        <p>
          Não vendemos dados pessoais. O processamento pode envolver suboperadores de
          infraestrutura (hospedagem, CDN, provedores de armazenamento temporário) na medida
          necessária para operar o serviço.
        </p>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          6. Seus direitos (Art. 18 da LGPD)
        </h2>
        <p>
          Entre outros, você pode solicitar confirmação de tratamento, acesso, correção,
          anonimização, portabilidade (quando aplicável), eliminação de dados desnecessários,
          informação sobre compartilhamentos e revogação do consentimento, quando o
          tratamento depender dele. Para dados apenas locais, parte desses direitos pode ser
          exercida diretamente nas configurações do navegador (limpar dados do site).
        </p>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          7. Segurança
        </h2>
        <p>
          Adotamos medidas técnicas e administrativas aptas a proteger os dados pessoais
          contra acessos não autorizados e situações acidentais ou ilícitas de destruição,
          perda, alteração, comunicação ou difusão.
        </p>
      </section>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        <Link href="/" className="font-medium text-whatsapp-green-dark underline dark:text-whatsapp-green">
          Voltar ao início
        </Link>
      </p>
    </main>
  );
}
