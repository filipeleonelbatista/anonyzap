import type { Metadata } from "next";
import Link from "next/link";

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
  return (
    <main
      className="mx-auto max-w-2xl px-4 py-10 text-gray-900 dark:bg-whatsapp-bg-dark dark:text-gray-100"
      style={{ paddingBottom: "max(3rem, var(--lgpd-banner, 0px))" }}
    >
      <h1 className="mb-6 text-2xl font-bold text-whatsapp-header dark:text-whatsapp-green">
        Termos de Uso
      </h1>
      <p className="mb-8 text-sm text-gray-600 dark:text-gray-400">
        Última atualização: outubro de 2026. Estes termos regem o uso do serviço{" "}
        <strong>AnonyZap</strong>, um chat anônimo e temporário acessível pelo navegador. Ao
        acessar ou usar o serviço, você concorda com estes Termos e com nossa{" "}
        <Link
          href="/privacidade"
          className="font-medium text-whatsapp-green-dark underline dark:text-whatsapp-green"
        >
          Política de Privacidade
        </Link>
        .
      </p>

      <section className="mb-8 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          1. Aceitação
        </h2>
        <p>
          Ao utilizar o AnonyZap, você declara ter lido e aceitado estes Termos. Se você não
          concorda com qualquer condição, não utilize o serviço. O operador da instância
          utilizada é responsável pela operação e pode definir regras adicionais.
        </p>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          2. Natureza do serviço
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Cada URL é uma sala de chat independente; qualquer pessoa com o link pode entrar,
            sem cadastro.
          </li>
          <li>
            Mensagens e imagens <strong>expiram automaticamente em cerca de 24 horas</strong>{" "}
            e não são mantidas de forma permanente.
          </li>
          <li>
            Não há moderação ativa do conteúdo em tempo real; as salas não têm senha e o link
            compartilhado é o mecanismo de acesso.
          </li>
        </ul>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          3. Uso aceitável
        </h2>
        <p>
          Você se compromete a <strong>não</strong> usar o serviço para:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            publicar ou transmitir conteúdo ilegal, difamatório, assediante, violento,
            pornográfico envolvendo menores, ou que viole direitos de terceiros (inclusive
            direitos autorais e de imagem);
          </li>
          <li>
            praticar assédio, ameaças, discurso de ódio, discriminação ou impersonação;
          </li>
          <li>
            disseminar malware, spam, phishing, tentar quebrar a segurança do serviço ou
            sobrecarregá-lo artificialmente (scraping em massa, bots);
          </li>
          <li>
            violar leis aplicáveis, incluindo as leis de proteção de dados da sua jurisdição
            e dos seus interlocutores.
          </li>
        </ul>
        <p>
          O uso que viole estes termos pode resultar em bloqueio de acesso e, quando exigido
          por lei, cooperação com autoridades competentes nos limites do que o serviço
          armazena (conteúdo temporário e sem rastreio de identidade).
        </p>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          4. Dados pessoais, anonimato e menores de idade
        </h2>
        <p>
          O serviço foi desenhado para minimizar dados: seu nome e avatar são escolhidos por
          você e ficam apenas no seu navegador; mensagens expiram em 24 horas. O e-mail é
          opcional e não é usado para contato nem verificação. O serviço{" "}
          <strong>não é dirigido a menores de 13 anos</strong> (ou idade mínima superior
          exigida pela legislação local, como 14/16 anos em alguns países da UE, quando exigido
          pelo consentimento parental — Art. 8º do GDPR / Art. 14 da LGPD): se você é menor
          dessa idade, não utilize o serviço sem autorização e supervisão de seu responsável
          legal.
        </p>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          5. Responsabilidade pelo conteúdo
        </h2>
        <p>
          O conteúdo das conversas é de responsabilidade exclusiva de quem o envia. O
          serviço atua como mero condutor técnico, sem obrigação de monitorar mensagens, e
          não garante a veracidade, legalidade ou qualidade do conteúdo publicado pelos
          usuários. Se você encontrar conteúdo ilegal, denuncie às autoridades competentes e,
          quando possível, ao canal de contato do operador da instância.
        </p>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          6. Disponibilidade e limitação de responsabilidade
        </h2>
        <p>
          O serviço é fornecido <strong>"no estado em que se encontra"</strong>, sem
          garantias de disponibilidade contínua, ausência de erros ou adequação a uma
          finalidade específica. Nos limites da lei aplicável, o operador não responde por
          danos indiretos ou perda de dados decorrentes do uso do serviço — incluindo a
          natureza temporária das mensagens, que não devem ser usadas para registrar
          informações de valor permanente. Nada aqui limita responsabilidade que não possa ser
          excluída por lei (ex.: dolo ou responsabilidade extracontratual perante consumidores
          nos termos do Código de Defesa do Consumidor e do direito da UE).
        </p>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          7. Alterações dos termos
        </h2>
        <p>
          Estes termos podem ser atualizados; a data de "última atualização" no topo indica a
          versão vigente. Alterações relevantes podem ser sinalizadas na interface do
          serviço. O uso continuado após a publicação equivale à aceitação da versão
          atualizada.
        </p>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          8. Legislação aplicável e foro
        </h2>
        <p>
          Para usuários no Brasil, aplicam-se as leis brasileiras, elegendo-se o foro do
          domicílio do usuário para dirimir controvérsias (CDC, Art. 42, parágrafo único).
          Para usuários na UE/EEE, aplicam-se as leis do Estado-membro de residência habitual
          do usuário consumidor, sem prejuízo das proteções irrenunciáveis do direito local.
          Usuários de outras jurisdições mantêm os direitos mínimos garantidos pelas leis
          aplicáveis de seu país.
        </p>
      </section>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        <Link
          href="/"
          className="font-medium text-whatsapp-green-dark underline dark:text-whatsapp-green"
        >
          Voltar ao início
        </Link>
      </p>
    </main>
  );
}
