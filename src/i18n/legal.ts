/**
 * Legal pages content (privacy policy and terms of use) in the 3 supported
 * locales. pt-BR is the reference version: translated versions carry a
 * "prevails" note pointing back to it (see LegalDoc.prevails).
 * Keep sections aligned across locales — same order, same content.
 */
export interface LegalSection {
  h: string;
  p?: string[];
  ul?: string[];
}

export interface LegalDoc {
  title: string;
  updated: string;
  intro: string[];
  sections: LegalSection[];
  /** Only on translated versions: Portuguese version prevails. */
  prevails?: string;
  back: string;
}

export type LegalLocale = "pt-BR" | "en" | "es";

export const legalContent: Record<
  LegalLocale,
  { privacy: LegalDoc; terms: LegalDoc }
> = {
  "pt-BR": {
    privacy: {
      title: "Política de Privacidade",
      updated:
        "Última atualização: outubro de 2026. Este documento descreve o tratamento de dados no serviço AnonyZap, em alinhamento com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD) e, para usuários na União Europeia e no Reino Unido, com o Regulamento Geral de Proteção de Dados (Regulamento (UE) 2016/679 — GDPR). Aos demais usuários, aplicam-se princípios equivalentes nos limites das leis de proteção de dados de suas jurisdições (ex.: CCPA/CPRA na Califórnia, PIPEDA no Canadá).",
      intro: [],
      sections: [
        {
          h: "1. Quem é responsável pelo tratamento",
          p: [
            "O tratamento dos dados ocorre em favor da operação do aplicativo web AnonyZap (incluindo instâncias hospedadas pelo operador do site). Para exercer seus direitos previstos na LGPD ou no GDPR, utilize o canal de contato divulgado pelo operador da instância que você utiliza (por exemplo, repositório ou página de contato do projeto).",
          ],
        },
        {
          h: "2. Quais dados coletamos e onde",
          ul: [
            "Dados no seu navegador (armazenamento local): ao usar o chat, você informa nome, e-mail e escolhe um avatar. Essas informações ficam gravadas no localStorage do seu dispositivo para reconhecer sua sessão entre visitas. Também pode ser armazenada a preferência de tema claro/escuro.",
            "Dados no servidor (temporários): mensagens de texto, metadados necessários ao chat (como identificação da sala e do remetente na conversa), pré-visualizações de links e arquivos de imagem enviados são tratados temporariamente na infraestrutura do serviço (por exemplo, armazenamento em cache/objeto) para viabilizar a conversa em tempo real.",
          ],
        },
        {
          h: "3. Finalidades e bases legais (LGPD e GDPR)",
          p: [
            "Os dados são tratados para execução do serviço de mensagens solicitado por você (base legal: execução de contrato/serviço solicitado — Art. 7º, V da LGPD; Art. 6º, 1(b) do GDPR), cumprimento de obrigação legal/regulatória quando aplicável, e legítimo interesse na segurança e melhoria do serviço (Art. 7º, IX da LGPD; Art. 6º, 1(f) do GDPR), sempre observando os princípios da LGPD (Art. 6º) e do GDPR (Art. 5º).",
          ],
        },
        {
          h: "4. Prazo de conservação",
          p: [
            "O conteúdo das conversas e mídias associadas seguem política de expiração automática (por exemplo, remoção após cerca de 24 horas), conforme a configuração da instância. Os dados mantidos apenas no seu navegador permanecem até você limpar o armazenamento do site ou usar as funções da aplicação para encerrar/apagar a sessão local, quando disponíveis.",
          ],
        },
        {
          h: "5. Compartilhamento",
          p: [
            "Não vendemos dados pessoais. O processamento pode envolver suboperadores de infraestrutura (hospedagem, CDN, provedores de armazenamento temporário) na medida necessária para operar o serviço.",
          ],
        },
        {
          h: "6. Seus direitos (Art. 18 da LGPD)",
          p: [
            "Entre outros, você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade (quando aplicável), eliminação de dados desnecessários, informação sobre compartilhamentos e revogação do consentimento, quando o tratamento depender dele. Para dados apenas locais, parte desses direitos pode ser exercida diretamente nas configurações do navegador (limpar dados do site). Usuários da UE/EEE podem ainda solicitar a limitação do tratamento (Art. 18 do GDPR), opor-se a tratamento baseado em interesse legítimo (Art. 21) e apresentar reclamação à autoridade de controle do seu país de residência (no Brasil, a ANPD — Autoridade Nacional de Proteção de Dados).",
          ],
        },
        {
          h: "7. Segurança",
          p: [
            "Adotamos medidas técnicas e administrativas aptas a proteger os dados pessoais contra acessos não autorizados e situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão.",
          ],
        },
        {
          h: "8. Transferência internacional e operadores",
          p: [
            "A infraestrutura do serviço (hospedagem, armazenamento temporário e CDN) pode operar fora do seu país de origem, inclusive fora da UE. Quando dados pessoais de usuários da UE/EEE forem transferidos para fora do EEE, isso ocorre com salvaguardas adequadas, como Cláusulas Contratuais Padrão da Comissão Europeia. Operadores envolvidos incluem a plataforma de hospedagem Vercel, Inc. e provedores de armazenamento temporário (Redis/blob) contratados para operar o serviço.",
          ],
        },
        {
          h: "9. Menores de idade",
          p: [
            "O serviço não é dirigido a crianças e não coletamos intencionalmente dados de menores de 13 anos (ou da idade mínima definida pela legislação local). Se você é responsável legal e acredita que uma criança nos forneceu dados, entre em contato pelo canal divulgado pelo operador da instância para que sejam eliminados.",
          ],
        },
      ],
      back: "Voltar ao início",
    },
    terms: {
      title: "Termos de Uso",
      updated:
        "Última atualização: outubro de 2026. Estes termos regem o uso do serviço AnonyZap, um chat anônimo e temporário acessível pelo navegador. Ao acessar ou usar o serviço, você concorda com estes Termos e com nossa Política de Privacidade.",
      intro: [],
      sections: [
        {
          h: "1. Aceitação",
          p: [
            "Ao utilizar o AnonyZap, você declara ter lido e aceitado estes Termos. Se você não concorda com qualquer condição, não utilize o serviço. O operador da instância utilizada é responsável pela operação e pode definir regras adicionais.",
          ],
        },
        {
          h: "2. Natureza do serviço",
          ul: [
            "Cada URL é uma sala de chat independente; qualquer pessoa com o link pode entrar, sem cadastro.",
            "Mensagens e imagens expiram automaticamente em cerca de 24 horas e não são mantidas de forma permanente.",
            "Não há moderação ativa do conteúdo em tempo real; as salas não têm senha e o link compartilhado é o mecanismo de acesso.",
          ],
        },
        {
          h: "3. Uso aceitável",
          p: ["Você se compromete a não usar o serviço para:"],
          ul: [
            "publicar ou transmitir conteúdo ilegal, difamatório, assediante, violento, pornográfico envolvendo menores, ou que viole direitos de terceiros (inclusive direitos autorais e de imagem);",
            "praticar assédio, ameaças, discurso de ódio, discriminação ou impersonação;",
            "disseminar malware, spam, phishing, tentar quebrar a segurança do serviço ou sobrecarregá-lo artificialmente (scraping em massa, bots);",
            "violar leis aplicáveis, incluindo as leis de proteção de dados da sua jurisdição e dos seus interlocutores.",
          ],
        },
        {
          h: "4. Dados pessoais, anonimato e menores de idade",
          p: [
            "O serviço foi desenhado para minimizar dados: seu nome e avatar são escolhidos por você e ficam apenas no seu navegador; mensagens expiram em 24 horas. O e-mail é opcional e não é usado para contato nem verificação. O serviço não é dirigido a menores de 13 anos (ou idade mínima superior exigida pela legislação local, como 14/16 anos em alguns países da UE, quando exigido pelo consentimento parental — Art. 8º do GDPR / Art. 14 da LGPD): se você é menor dessa idade, não utilize o serviço sem autorização e supervisão de seu responsável legal.",
          ],
        },
        {
          h: "5. Responsabilidade pelo conteúdo",
          p: [
            "O conteúdo das conversas é de responsabilidade exclusiva de quem o envia. O serviço atua como mero condutor técnico, sem obrigação de monitorar mensagens, e não garante a veracidade, legalidade ou qualidade do conteúdo publicado pelos usuários. Se você encontrar conteúdo ilegal, denuncie às autoridades competentes e, quando possível, ao canal de contato do operador da instância.",
          ],
        },
        {
          h: "6. Disponibilidade e limitação de responsabilidade",
          p: [
            "O serviço é fornecido \"no estado em que se encontra\", sem garantias de disponibilidade contínua, ausência de erros ou adequação a uma finalidade específica. Nos limites da lei aplicável, o operador não responde por danos indiretos ou perda de dados decorrentes do uso do serviço — incluindo a natureza temporária das mensagens, que não devem ser usadas para registrar informações de valor permanente. Nada aqui limita responsabilidade que não possa ser excluída por lei (ex.: dolo ou responsabilidade extracontratual perante consumidores nos termos do Código de Defesa do Consumidor e do direito da UE).",
          ],
        },
        {
          h: "7. Alterações dos termos",
          p: [
            "Estes termos podem ser atualizados; a data de \"última atualização\" no topo indica a versão vigente. Alterações relevantes podem ser sinalizadas na interface do serviço. O uso continuado após a publicação equivale à aceitação da versão atualizada.",
          ],
        },
        {
          h: "8. Legislação aplicável e foro",
          p: [
            "Para usuários no Brasil, aplicam-se as leis brasileiras, elegendo-se o foro do domicílio do usuário para dirimir controvérsias (CDC, Art. 42, parágrafo único). Para usuários na UE/EEE, aplicam-se as leis do Estado-membro de residência habitual do usuário consumidor, sem prejuízo das proteções irrenunciáveis do direito local. Usuários de outras jurisdições mantêm os direitos mínimos garantidos pelas leis aplicáveis de seu país.",
          ],
        },
      ],
      back: "Voltar ao início",
    },
  },
  en: {
    privacy: {
      title: "Privacy Policy",
      updated:
        "Last updated: October 2026. This document describes how data is handled in the AnonyZap service, in line with the Brazilian General Data Protection Law (Law No. 13,709/2018 — LGPD) and, for users in the European Union and the United Kingdom, with the General Data Protection Regulation (Regulation (EU) 2016/679 — GDPR). Users in other jurisdictions get equivalent protections within the limits of their local data-protection laws (e.g., CCPA/CPRA in California, PIPEDA in Canada).",
      intro: [],
      sections: [
        {
          h: "1. Who is responsible for processing",
          p: [
            "Data is processed to operate the AnonyZap web app (including instances hosted by the site operator). To exercise your rights under the LGPD or the GDPR, use the contact channel published by the operator of the instance you use (for example, the project repository or contact page).",
          ],
        },
        {
          h: "2. What data we collect and where",
          ul: [
            "Data in your browser (local storage): when you use the chat, you provide a name, email and avatar. This information is stored in your browser's localStorage to recognize your session across visits. Your light/dark theme preference may also be stored.",
            "Data on the server (temporary): text messages, chat metadata (such as room and sender identification), link previews and uploaded image files are processed temporarily on the service infrastructure (for example, cache/object storage) to enable the real-time conversation.",
          ],
        },
        {
          h: "3. Purposes and legal bases (LGPD and GDPR)",
          p: [
            "Data is processed to provide the messaging service you requested (legal basis: performance of the requested service — Art. 7, V of the LGPD; Art. 6(1)(b) of the GDPR), to comply with legal or regulatory obligations where applicable, and in the legitimate interest of the security and improvement of the service (Art. 7, IX of the LGPD; Art. 6(1)(f) of the GDPR), always observing the principles of the LGPD (Art. 6) and of the GDPR (Art. 5).",
          ],
        },
        {
          h: "4. Retention period",
          p: [
            "Conversation content and associated media follow an automatic expiration policy (for example, removal after about 24 hours), according to the instance configuration. Data kept only in your browser remains until you clear the site's storage or use the app's functions to end/delete the local session, when available.",
          ],
        },
        {
          h: "5. Sharing",
          p: [
            "We do not sell personal data. Processing may involve infrastructure sub-processors (hosting, CDN, temporary storage providers) to the extent necessary to operate the service.",
          ],
        },
        {
          h: "6. Your rights (Art. 18 of the LGPD)",
          p: [
            "Among others, you may request confirmation of processing, access, correction, anonymization, portability (where applicable), deletion of unnecessary data, information about sharing, and withdrawal of consent where processing depends on it. For browser-only data, part of these rights can be exercised directly in your browser settings (clear site data). Users in the EU/EEA may also request restriction of processing (Art. 18 of the GDPR), object to processing based on legitimate interest (Art. 21) and lodge a complaint with the supervisory authority of their country of residence (in Brazil, the ANPD — National Data Protection Authority).",
          ],
        },
        {
          h: "7. Security",
          p: [
            "We adopt technical and administrative measures suitable to protect personal data against unauthorized access and accidental or unlawful situations of destruction, loss, alteration, communication or diffusion.",
          ],
        },
        {
          h: "8. International transfer and operators",
          p: [
            "The service infrastructure (hosting, temporary storage and CDN) may operate outside your country of origin, including outside the EU. When personal data of EU/EEA users is transferred outside the EEA, it happens with adequate safeguards, such as the European Commission's Standard Contractual Clauses. Operators involved include the hosting platform Vercel, Inc. and temporary storage providers (Redis/blob) contracted to run the service.",
          ],
        },
        {
          h: "9. Minors",
          p: [
            "The service is not directed at children and we do not knowingly collect data from anyone under 13 (or the higher minimum age set by local law). If you are a legal guardian and believe a child provided us with data, contact the channel published by the instance operator so it can be deleted.",
          ],
        },
      ],
      prevails:
        "In case of discrepancy, the Portuguese version prevails.",
      back: "Back to home",
    },
    terms: {
      title: "Terms of Use",
      updated:
        "Last updated: October 2026. These terms govern the use of the AnonyZap service, an anonymous and temporary chat accessible via the browser. By accessing or using the service, you agree to these Terms and to our Privacy Policy.",
      intro: [],
      sections: [
        {
          h: "1. Acceptance",
          p: [
            "By using AnonyZap you declare that you have read and accept these Terms. If you disagree with any condition, do not use the service. The operator of the instance you use is responsible for its operation and may set additional rules.",
          ],
        },
        {
          h: "2. Nature of the service",
          ul: [
            "Each URL is an independent chat room; anyone with the link can join, with no signup.",
            "Messages and images expire automatically after about 24 hours and are not kept permanently.",
            "There is no active real-time content moderation; rooms have no password and the shared link is the access mechanism.",
          ],
        },
        {
          h: "3. Acceptable use",
          p: ["You agree not to use the service to:"],
          ul: [
            "publish or transmit illegal, defamatory, harassing or violent content, child sexual abuse material, or content that infringes third-party rights (including copyright and image rights);",
            "practice harassment, threats, hate speech, discrimination or impersonation;",
            "spread malware, spam or phishing, attempt to break the service's security or artificially overload it (mass scraping, bots);",
            "violate applicable laws, including the data-protection laws of your jurisdiction and of your conversation partners.",
          ],
        },
        {
          h: "4. Personal data, anonymity and minors",
          p: [
            "The service is designed to minimize data: your name and avatar are chosen by you and stay only in your browser; messages expire after 24 hours. Email is optional and is not used for contact or verification. The service is not directed at minors under 13 (or the higher minimum age required by local law, such as 14/16 in some EU countries where parental consent applies — Art. 8 GDPR / Art. 14 LGPD): if you are below that age, do not use the service without authorization and supervision from your legal guardian.",
          ],
        },
        {
          h: "5. Content responsibility",
          p: [
            "Chat content is the sole responsibility of whoever sends it. The service acts as a mere technical conduit, with no duty to monitor messages, and does not guarantee the accuracy, legality or quality of user-published content. If you find illegal content, report it to the competent authorities and, where possible, to the contact channel of the instance operator.",
          ],
        },
        {
          h: "6. Availability and limitation of liability",
          p: [
            "The service is provided \"as is\", with no guarantee of continuous availability, absence of errors or fitness for a particular purpose. To the extent permitted by applicable law, the operator is not liable for indirect damages or data loss resulting from use of the service — including the temporary nature of messages, which must not be used to record information of permanent value. Nothing here limits liability that cannot be excluded by law (for example, intentional conduct or tort liability towards consumers under the Brazilian Consumer Protection Code and EU law).",
          ],
        },
        {
          h: "7. Changes to these terms",
          p: [
            "These terms may be updated; the \"last updated\" date at the top indicates the current version. Relevant changes may be flagged in the service interface. Continued use after publication amounts to acceptance of the updated version.",
          ],
        },
        {
          h: "8. Governing law and venue",
          p: [
            "For users in Brazil, Brazilian law applies, with the venue of the user's domicile chosen to settle disputes (CDC, Art. 42, sole paragraph). For users in the EU/EEA, the laws of the Member State of the consumer user's habitual residence apply, without prejudice to non-waivable local protections. Users in other jurisdictions keep the minimum rights guaranteed by their applicable laws.",
          ],
        },
      ],
      prevails:
        "In case of discrepancy, the Portuguese version prevails.",
      back: "Back to home",
    },
  },
  es: {
    privacy: {
      title: "Política de Privacidad",
      updated:
        "Última actualización: octubre de 2026. Este documento describe el tratamiento de datos en el servicio AnonyZap, en alineación con la Ley General de Protección de Datos Personales (Ley n.º 13.709/2018 — LGPD) y, para usuarios de la Unión Europea y del Reino Unido, con el Reglamento General de Protección de Datos (Reglamento (UE) 2016/679 — GDPR). A los demás usuarios se aplican principios equivalentes según los límites de las leyes de protección de datos de sus jurisdicciones (p. ej., CCPA/CPRA en California, PIPEDA en Canadá).",
      intro: [],
      sections: [
        {
          h: "1. Quién es responsable del tratamiento",
          p: [
            "El tratamiento de datos se realiza para operar la aplicación web AnonyZap (incluidas las instancias alojadas por el operador del sitio). Para ejercer tus derechos conforme a la LGPD o al GDPR, utiliza el canal de contacto divulgado por el operador de la instancia que uses (por ejemplo, el repositorio o la página de contacto del proyecto).",
          ],
        },
        {
          h: "2. Qué datos recopilamos y dónde",
          ul: [
            "Datos en tu navegador (almacenamiento local): al usar el chat, informas nombre, email y eliges un avatar. Esta información queda guardada en el localStorage de tu dispositivo para reconocer tu sesión entre visitas. También se puede guardar la preferencia de tema claro/oscuro.",
            "Datos en el servidor (temporales): los mensajes de texto, los metadatos necesarios para el chat (como la identificación de la sala y del remitente), las vistas previas de enlaces y las imágenes enviadas se tratan temporalmente en la infraestructura del servicio (por ejemplo, caché/almacenamiento de objetos) para viabilizar la conversación en tiempo real.",
          ],
        },
        {
          h: "3. Finalidades y bases legales (LGPD y GDPR)",
          p: [
            "Los datos se tratan para ejecutar el servicio de mensajería solicitado por ti (base legal: ejecución del servicio solicitado — Art. 7, V de la LGPD; Art. 6.1.b del GDPR), para cumplir obligaciones legales/regulatorias cuando aplique, y por interés legítimo en la seguridad y mejora del servicio (Art. 7, IX de la LGPD; Art. 6.1.f del GDPR), observando siempre los principios de la LGPD (Art. 6) y del GDPR (Art. 5).",
          ],
        },
        {
          h: "4. Plazo de conservación",
          p: [
            "El contenido de las conversaciones y los archivos asociados siguen una política de expiración automática (por ejemplo, eliminación tras unas 24 horas), según la configuración de la instancia. Los datos mantenidos solo en tu navegador permanecen hasta que borres el almacenamiento del sitio o uses las funciones de la aplicación para cerrar/borrar la sesión local, cuando estén disponibles.",
          ],
        },
        {
          h: "5. Compartición",
          p: [
            "No vendemos datos personales. El tratamiento puede involucrar subencargados de infraestructura (hosting, CDN, proveedores de almacenamiento temporal) en la medida necesaria para operar el servicio.",
          ],
        },
        {
          h: "6. Tus derechos (Art. 18 de la LGPD)",
          p: [
            "Entre otros, puedes solicitar confirmación del tratamiento, acceso, rectificación, anonimización, portabilidad (cuando aplique), eliminación de datos innecesarios, información sobre compartición y revocación del consentimiento, cuando el tratamiento dependa de él. Para datos solo locales, parte de estos derechos se puede ejercer directamente en la configuración del navegador (borrar datos del sitio). Los usuarios de la UE/EEE también pueden solicitar la limitación del tratamiento (Art. 18 del GDPR), oponerse al tratamiento basado en interés legítimo (Art. 21) y presentar una reclamación ante la autoridad de control de su país de residencia (en Brasil, la ANPD — Autoridad Nacional de Protección de Datos).",
          ],
        },
        {
          h: "7. Seguridad",
          p: [
            "Adoptamos medidas técnicas y administrativas adecuadas para proteger los datos personales contra accesos no autorizados y situaciones accidentales o ilícitas de destrucción, pérdida, alteración, comunicación o difusión.",
          ],
        },
        {
          h: "8. Transferencia internacional y operadores",
          p: [
            "La infraestructura del servicio (hosting, almacenamiento temporal y CDN) puede operar fuera de tu país de origen, incluso fuera de la UE. Cuando se transfieran datos personales de usuarios de la UE/EEE fuera del EEE, se hace con salvaguardas adecuadas, como las Cláusulas Contractuales Tipo de la Comisión Europea. Entre los operadores involucrados están la plataforma de hosting Vercel, Inc. y los proveedores de almacenamiento temporal (Redis/blob) contratados para operar el servicio.",
          ],
        },
        {
          h: "9. Menores de edad",
          p: [
            "El servicio no está dirigido a niños y no recopilamos intencionalmente datos de menores de 13 años (o de la edad mínima superior exigida por la legislación local). Si eres responsable legal y crees que un niño nos proporcionó datos, contacta el canal divulgado por el operador de la instancia para que sean eliminados.",
          ],
        },
      ],
      prevails:
        "En caso de discrepancia, prevalece la versión en portugués.",
      back: "Volver al inicio",
    },
    terms: {
      title: "Términos de Uso",
      updated:
        "Última actualización: octubre de 2026. Estos términos regulan el uso del servicio AnonyZap, un chat anónimo y temporal accesible desde el navegador. Al acceder o usar el servicio, aceptas estos Términos y nuestra Política de Privacidad.",
      intro: [],
      sections: [
        {
          h: "1. Aceptación",
          p: [
            "Al utilizar AnonyZap, declaras haber leído y aceptado estos Términos. Si no estás de acuerdo con alguna condición, no utilices el servicio. El operador de la instancia utilizada es responsable de la operación y puede definir reglas adicionales.",
          ],
        },
        {
          h: "2. Naturaleza del servicio",
          ul: [
            "Cada URL es una sala de chat independiente; cualquier persona con el enlace puede entrar, sin registro.",
            "Los mensajes e imágenes expiran automáticamente en unas 24 horas y no se conservan de forma permanente.",
            "No hay moderación activa del contenido en tiempo real; las salas no tienen contraseña y el enlace compartido es el mecanismo de acceso.",
          ],
        },
        {
          h: "3. Uso aceptable",
          p: ["Te comprometes a no usar el servicio para:"],
          ul: [
            "publicar o transmitir contenido ilegal, difamatorio, acosador o violento, material de abuso sexual infantil, o contenido que viole derechos de terceros (incluidos derechos de autor y de imagen);",
            "practicar acoso, amenazas, discurso de odio, discriminación o suplantación de identidad;",
            "difundir malware, spam o phishing, intentar quebrar la seguridad del servicio o sobrecargarlo artificialmente (scraping masivo, bots);",
            "violar las leyes aplicables, incluidas las leyes de protección de datos de tu jurisdicción y la de tus interlocutores.",
          ],
        },
        {
          h: "4. Datos personales, anonimato y menores de edad",
          p: [
            "El servicio está diseñado para minimizar los datos: tu nombre y avatar son elegidos por ti y quedan solo en tu navegador; los mensajes expiran en 24 horas. El email es opcional y no se usa para contacto ni verificación. El servicio no está dirigido a menores de 13 años (o la edad mínima superior exigida por la legislación local, como 14/16 años en algunos países de la UE, cuando aplica el consentimiento parental — Art. 8 del GDPR / Art. 14 de la LGPD): si eres menor de esa edad, no utilices el servicio sin autorización y supervisión de tu representante legal.",
          ],
        },
        {
          h: "5. Responsabilidad por el contenido",
          p: [
            "El contenido de las conversaciones es responsabilidad exclusiva de quien lo envía. El servicio actúa como mero conductor técnico, sin obligación de monitorear mensajes, y no garantiza la veracidad, legalidad o calidad del contenido publicado por los usuarios. Si encuentras contenido ilegal, denúncialo a las autoridades competentes y, cuando sea posible, al canal de contacto del operador de la instancia.",
          ],
        },
        {
          h: "6. Disponibilidad y limitación de responsabilidad",
          p: [
            "El servicio se proporciona \"tal cual\", sin garantías de disponibilidad continua, ausencia de errores o idoneidad para un propósito específico. En los límites de la ley aplicable, el operador no responde por daños indirectos o pérdida de datos derivados del uso del servicio — incluida la naturaleza temporal de los mensajes, que no deben usarse para registrar información de valor permanente. Nada aquí limita la responsabilidad que no pueda excluirse por ley (p. ej., dolo o responsabilidad extracontractual frente a consumidores según el Código de Defensa del Consumidor y el derecho de la UE).",
          ],
        },
        {
          h: "7. Alteraciones de los términos",
          p: [
            "Estos términos pueden actualizarse; la fecha de \"última actualización\" en la parte superior indica la versión vigente. Los cambios relevantes pueden señalarse en la interfaz del servicio. El uso continuado tras la publicación equivale a la aceptación de la versión actualizada.",
          ],
        },
        {
          h: "8. Legislación aplicable y fuero",
          p: [
            "Para usuarios en Brasil se aplican las leyes brasileñas, eligiéndose el fuero del domicilio del usuario para dirimir controversias (CDC, Art. 42, párrafo único). Para usuarios de la UE/EEE se aplican las leyes del Estado miembro de residencia habitual del usuario consumidor, sin perjuicio de las protecciones irrenunciables del derecho local. Los usuarios de otras jurisdicciones conservan los derechos mínimos garantizados por las leyes aplicables de su país.",
          ],
        },
      ],
      prevails:
        "En caso de discrepancia, prevalece la versión en portugués.",
      back: "Volver al inicio",
    },
  },
};
