/**
 * Dictionaries for UI i18n. pt-BR is the source of truth for the shape;
 * en and es must declare the same keys (enforced by the `Messages` type).
 * Keep in sync with the locales in LanguageContext.
 */
interface Messages {
  banner: {
    regionAria: string;
    intro: string;
    privacyLink: string;
    and: string;
    termsLink: string;
    compliance: string;
    acknowledge: string;
  };
  status: {
    connected: string;
    reconnecting: string;
    disconnected: string;
  };
  header: {
    editProfileAria: string;
    editProfile: string;
    shareAria: string;
    shareTitle: string;
    peopleAria: string;
    peopleTitle: string;
    helpAria: string;
    helpTitle: string;
    shareToast: string;
    imageError: string;
    copyPrompt: string;
  };
  input: {
    placeholder: string;
    addImage: string;
    searchGifs: string;
    noGifs: string;
    cancelReply: string;
    send: string;
    invalidFileType: string;
    fileTooLarge: string;
  };
  list: {
    loadingOlder: string;
  };
  empty: {
    inviteMessage: string;
    inviteAria: string;
    invite: string;
    copied: string;
    react: string;
    reply: string;
    shareTitle: string;
    copyPrompt: string;
  };
  bubble: {
    deletedShort: string;
    deletedLong: string;
    menu: string;
    react: string;
    reply: string;
    delete: string;
    reactionsLabel: string;
    reactionsTotal: string;
    reactionsTitle: string;
    joined: string;
    left: string;
    sharedImage: string;
  };
  people: {
    title: string;
    loading: string;
    empty: string;
    online: string;
  };
  help: {
    title: string;
    subtitle: string;
    noSignup: string;
    private: string;
    images: string;
    duration: string;
    close: string;
    faq: { q: string; a: string }[];
  };
  register: {
    welcome: string;
    joinRoom: string;
    formHint: string;
    avatarLabel: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    fNoSignup: string;
    fPrivacy: string;
    fImages: string;
    fLinks: string;
    fRooms: string;
  };
  profile: {
    title: string;
    close: string;
    emailLabel: string;
    emailImmutable: string;
    avatarLabel: string;
    nameLabel: string;
    namePlaceholder: string;
    cancel: string;
    save: string;
  };
  validation: {
    name: string;
    email: string;
    avatar: string;
  };
  auth: {
    loading: string;
  };
  indicator: {
    one: string;
    many: string;
  };
  avatar: {
    select: string;
  };
  theme: {
    light: string;
    dark: string;
  };
  lightbox: {
    title: string;
    close: string;
    zoomOut: string;
    zoomIn: string;
  };
}

const ptBR: Messages = {
  banner: {
    regionAria: "Aviso sobre dados pessoais (LGPD)",
    intro:
      "Utilizamos armazenamento local no seu navegador (perfil, preferência de tema) e tratamos mensagens e mídia de forma temporária nos servidores para o funcionamento do chat, conforme nossa ",
    privacyLink: "Política de Privacidade",
    and: "e",
    termsLink: "Termos de Uso",
    compliance: ", em conformidade com a ",
    acknowledge: "Entendi",
  },
  status: {
    connected: "Conectado",
    reconnecting: "Reconectando...",
    disconnected: "Desconectado",
  },
  header: {
    editProfileAria: "Editar nome e avatar",
    editProfile: "Editar perfil",
    shareAria: "Compartilhar link da sala",
    shareTitle: "Copiar link da sala",
    peopleAria: "Pessoas na sala",
    peopleTitle: "Pessoas na sala",
    helpAria: "Ajuda",
    helpTitle: "Como funciona",
    shareToast: "Link da sala copiado para a área de transferência.",
    imageError: "Falha ao enviar imagem. Tente novamente.",
    copyPrompt: "Copie o link da sala:",
  },
  input: {
    placeholder: "Digite uma mensagem",
    addImage: "Adicionar imagem",
    searchGifs: "Pesquisar GIFs em GIPHY",
    noGifs: "Nenhum GIF",
    cancelReply: "Cancelar reply",
    send: "Enviar mensagem",
    invalidFileType: "Tipo de arquivo inválido. Use JPG, PNG, GIF ou WebP.",
    fileTooLarge: "Arquivo muito grande. Máximo 5 MB.",
  },
  list: {
    loadingOlder: "Carregando mensagens anteriores...",
  },
  empty: {
    inviteMessage: "entre no meu anonyzap para conversarmos",
    inviteAria: "Compartilhar link da sala com uma mensagem de convite",
    invite: "Convidar amigos",
    copied: "Copiado! Cole no WhatsApp ou onde quiser.",
    react: "Reaja a mensagens",
    reply: "Responda mensagens",
    shareTitle: "Sala",
    copyPrompt: "Copie o convite:",
  },
  bubble: {
    deletedShort: "mensagem apagada",
    deletedLong: "mensagem apagada pelo usuario",
    menu: "Menu",
    react: "Reagir",
    reply: "Responder",
    delete: "Excluir",
    reactionsLabel: "Reações",
    reactionsTotal: "no total",
    reactionsTitle: "Reações",
    joined: "entrou na conversa",
    left: "saiu da conversa",
    sharedImage: "Imagem compartilhada",
  },
  people: {
    title: "Pessoas na sala",
    loading: "Carregando...",
    empty: "Ninguém conectado no momento",
    online: "Online",
  },
  help: {
    title: "Sobre o AnonyZap",
    subtitle: "Chat em tempo real, anônimo e temporário",
    noSignup: "Sem cadastro",
    private: "Privado",
    images: "Imagens",
    duration: "24h de duração",
    close: "Entendi!",
    faq: [
      {
        q: "O que é o AnonyZap?",
        a: "É um chat em tempo real que funciona direto do navegador. Cada URL é uma sala de chat diferente — compartilhe o link com quem quiser conversar.",
      },
      {
        q: "Preciso criar conta?",
        a: "Não! Basta escolher um nome, email e avatar. Seus dados ficam salvos apenas no seu navegador (localStorage).",
      },
      {
        q: "Por quanto tempo as mensagens ficam salvas?",
        a: "As mensagens expiram automaticamente após 24 horas. Nada é armazenado permanentemente.",
      },
      {
        q: "Posso enviar imagens?",
        a: "Sim! Use o botão de imagem ao lado do campo de mensagem. As imagens também expiram em 24 horas.",
      },
      {
        q: "Meus dados estão seguros?",
        a: "Sim. Seu nome, email e avatar ficam apenas no seu navegador. Não temos acesso a esses dados. As salas não são listadas publicamente.",
      },
      {
        q: "Como convido alguém?",
        a: "Copie a URL da sala (o link da página) e envie para quem quiser. Cada URL é uma sala única.",
      },
    ],
  },
  register: {
    welcome: "Bem-vindo ao AnonyZap!",
    joinRoom: "Entrar na sala",
    formHint: "Preencha os dados abaixo para começar a conversar.",
    avatarLabel: "Escolha seu avatar",
    nameLabel: "Nome",
    namePlaceholder: "Seu nome",
    emailLabel: "Email",
    emailPlaceholder: "seu@email.com",
    submit: "Entrar no Chat",
    fNoSignup: "Sem cadastro",
    fPrivacy: "Privacidade total",
    fImages: "Compartilhe imagens",
    fLinks: "Links com preview",
    fRooms: "Salas por URL",
  },
  profile: {
    title: "Editar perfil",
    close: "Fechar",
    emailLabel: "Email:",
    emailImmutable: "(não pode ser alterado aqui)",
    avatarLabel: "Avatar",
    nameLabel: "Nome",
    namePlaceholder: "Seu nome",
    cancel: "Cancelar",
    save: "Salvar",
  },
  validation: {
    name: "Nome deve ter entre 2 e 50 caracteres",
    email: "Insira um email válido",
    avatar: "Selecione um avatar",
  },
  auth: {
    loading: "Carregando",
  },
  indicator: {
    one: "nova mensagem",
    many: "novas mensagens",
  },
  avatar: {
    select: "Selecionar avatar",
  },
  theme: {
    light: "Modo claro",
    dark: "Modo escuro",
  },
  lightbox: {
    title: "Imagem em tela cheia",
    close: "Fechar",
    zoomOut: "Reduzir zoom",
    zoomIn: "Aumentar zoom",
  },
};

const en: Messages = {
  banner: {
    regionAria: "Personal data notice (LGPD)",
    intro:
      "We use local storage in your browser (profile, theme preference) and process messages and media temporarily on our servers for the chat to work, as described in our ",
    privacyLink: "Privacy Policy",
    and: "and",
    termsLink: "Terms of Use",
    compliance: ", in compliance with the ",
    acknowledge: "Got it",
  },
  status: {
    connected: "Connected",
    reconnecting: "Reconnecting...",
    disconnected: "Disconnected",
  },
  header: {
    editProfileAria: "Edit name and avatar",
    editProfile: "Edit profile",
    shareAria: "Share room link",
    shareTitle: "Copy room link",
    peopleAria: "People in the room",
    peopleTitle: "People in the room",
    helpAria: "Help",
    helpTitle: "How it works",
    shareToast: "Room link copied to the clipboard.",
    imageError: "Failed to send image. Please try again.",
    copyPrompt: "Copy the room link:",
  },
  input: {
    placeholder: "Type a message",
    addImage: "Add image",
    searchGifs: "Search GIFs in GIPHY",
    noGifs: "No GIFs found",
    cancelReply: "Cancel reply",
    send: "Send message",
    invalidFileType: "Invalid file type. Use JPG, PNG, GIF or WebP.",
    fileTooLarge: "File too large. Maximum 5 MB.",
  },
  list: {
    loadingOlder: "Loading older messages...",
  },
  empty: {
    inviteMessage: "join my anonyzap so we can chat",
    inviteAria: "Share the room link with an invite message",
    invite: "Invite friends",
    copied: "Copied! Paste it on WhatsApp or anywhere you like.",
    react: "React to messages",
    reply: "Reply to messages",
    shareTitle: "Room",
    copyPrompt: "Copy the invite:",
  },
  bubble: {
    deletedShort: "deleted message",
    deletedLong: "message deleted by user",
    menu: "Menu",
    react: "React",
    reply: "Reply",
    delete: "Delete",
    reactionsLabel: "Reactions",
    reactionsTotal: "in total",
    reactionsTitle: "Reactions",
    joined: "joined the conversation",
    left: "left the conversation",
    sharedImage: "Shared image",
  },
  people: {
    title: "People in the room",
    loading: "Loading...",
    empty: "Nobody connected right now",
    online: "Online",
  },
  help: {
    title: "About AnonyZap",
    subtitle: "Real-time, anonymous and temporary chat",
    noSignup: "No signup",
    private: "Private",
    images: "Images",
    duration: "Lasts 24h",
    close: "Got it!",
    faq: [
      {
        q: "What is AnonyZap?",
        a: "It's a real-time chat that works straight from the browser. Each URL is a different chat room — share the link with anyone you want to talk to.",
      },
      {
        q: "Do I need to create an account?",
        a: "No! Just pick a name, email and avatar. Your data is saved only in your browser (localStorage).",
      },
      {
        q: "How long are messages kept?",
        a: "Messages expire automatically after 24 hours. Nothing is stored permanently.",
      },
      {
        q: "Can I send images?",
        a: "Yes! Use the image button next to the message field. Images also expire after 24 hours.",
      },
      {
        q: "Is my data safe?",
        a: "Yes. Your name, email and avatar stay only in your browser. We have no access to that data. Rooms are not listed publicly.",
      },
      {
        q: "How do I invite someone?",
        a: "Copy the room URL (the page link) and send it to whoever you want. Each URL is a unique room.",
      },
    ],
  },
  register: {
    welcome: "Welcome to AnonyZap!",
    joinRoom: "Join room",
    formHint: "Fill in the details below to start chatting.",
    avatarLabel: "Choose your avatar",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    submit: "Join Chat",
    fNoSignup: "No signup",
    fPrivacy: "Total privacy",
    fImages: "Share images",
    fLinks: "Link previews",
    fRooms: "Rooms by URL",
  },
  profile: {
    title: "Edit profile",
    close: "Close",
    emailLabel: "Email:",
    emailImmutable: "(cannot be changed here)",
    avatarLabel: "Avatar",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    cancel: "Cancel",
    save: "Save",
  },
  validation: {
    name: "Name must be between 2 and 50 characters",
    email: "Enter a valid email",
    avatar: "Select an avatar",
  },
  auth: {
    loading: "Loading",
  },
  indicator: {
    one: "new message",
    many: "new messages",
  },
  avatar: {
    select: "Select avatar",
  },
  theme: {
    light: "Light mode",
    dark: "Dark mode",
  },
  lightbox: {
    title: "Full-screen image",
    close: "Close",
    zoomOut: "Zoom out",
    zoomIn: "Zoom in",
  },
};

const es: Messages = {
  banner: {
    regionAria: "Aviso sobre datos personales (LGPD)",
    intro:
      "Utilizamos almacenamiento local en tu navegador (perfil, preferencia de tema) y tratamos mensajes y multimedia temporalmente en los servidores para el funcionamiento del chat, conforme nuestra ",
    privacyLink: "Política de Privacidad",
    and: "y",
    termsLink: "Términos de Uso",
    compliance: ", en conformidad con la ",
    acknowledge: "Entendido",
  },
  status: {
    connected: "Conectado",
    reconnecting: "Reconectando...",
    disconnected: "Desconectado",
  },
  header: {
    editProfileAria: "Editar nombre y avatar",
    editProfile: "Editar perfil",
    shareAria: "Compartir enlace de la sala",
    shareTitle: "Copiar enlace de la sala",
    peopleAria: "Personas en la sala",
    peopleTitle: "Personas en la sala",
    helpAria: "Ayuda",
    helpTitle: "Cómo funciona",
    shareToast: "Enlace de la sala copiado al portapapeles.",
    imageError: "Error al enviar la imagen. Inténtalo de nuevo.",
    copyPrompt: "Copia el enlace de la sala:",
  },
  input: {
    placeholder: "Escribe un mensaje",
    addImage: "Agregar imagen",
    searchGifs: "Buscar GIFs en GIPHY",
    noGifs: "Sin GIFs",
    cancelReply: "Cancelar respuesta",
    send: "Enviar mensaje",
    invalidFileType: "Tipo de archivo inválido. Usa JPG, PNG, GIF o WebP.",
    fileTooLarge: "Archivo demasiado grande. Máximo 5 MB.",
  },
  list: {
    loadingOlder: "Cargando mensajes anteriores...",
  },
  empty: {
    inviteMessage: "entra en mi anonyzap para conversar",
    inviteAria: "Compartir el enlace de la sala con un mensaje de invitación",
    invite: "Invitar amigos",
    copied: "¡Copiado! Pégalo en WhatsApp o donde quieras.",
    react: "Reacciona a los mensajes",
    reply: "Responde mensajes",
    shareTitle: "Sala",
    copyPrompt: "Copia la invitación:",
  },
  bubble: {
    deletedShort: "mensaje eliminado",
    deletedLong: "mensaje eliminado por el usuario",
    menu: "Menú",
    react: "Reaccionar",
    reply: "Responder",
    delete: "Eliminar",
    reactionsLabel: "Reacciones",
    reactionsTotal: "en total",
    reactionsTitle: "Reacciones",
    joined: "entró en la conversación",
    left: "salió de la conversación",
    sharedImage: "Imagen compartida",
  },
  people: {
    title: "Personas en la sala",
    loading: "Cargando...",
    empty: "Nadie conectado en este momento",
    online: "En línea",
  },
  help: {
    title: "Sobre AnonyZap",
    subtitle: "Chat en tiempo real, anónimo y temporal",
    noSignup: "Sin registro",
    private: "Privado",
    images: "Imágenes",
    duration: "Dura 24 h",
    close: "¡Entendido!",
    faq: [
      {
        q: "¿Qué es AnonyZap?",
        a: "Es un chat en tiempo real que funciona directamente en el navegador. Cada URL es una sala de chat diferente — comparte el enlace con quien quieras conversar.",
      },
      {
        q: "¿Necesito crear una cuenta?",
        a: "¡No! Solo elige un nombre, email y avatar. Tus datos se guardan únicamente en tu navegador (localStorage).",
      },
      {
        q: "¿Cuánto tiempo se guardan los mensajes?",
        a: "Los mensajes expiran automáticamente después de 24 horas. Nada se almacena permanentemente.",
      },
      {
        q: "¿Puedo enviar imágenes?",
        a: "¡Sí! Usa el botón de imagen junto al campo de mensaje. Las imágenes también expiran en 24 horas.",
      },
      {
        q: "¿Mis datos están seguros?",
        a: "Sí. Tu nombre, email y avatar quedan solo en tu navegador. No tenemos acceso a esos datos. Las salas no se listan públicamente.",
      },
      {
        q: "¿Cómo invito a alguien?",
        a: "Copia la URL de la sala (el enlace de la página) y envíasela a quien quieras. Cada URL es una sala única.",
      },
    ],
  },
  register: {
    welcome: "¡Bienvenido a AnonyZap!",
    joinRoom: "Entrar en la sala",
    formHint: "Rellena los datos a continuación para empezar a conversar.",
    avatarLabel: "Elige tu avatar",
    nameLabel: "Nombre",
    namePlaceholder: "Tu nombre",
    emailLabel: "Email",
    emailPlaceholder: "tu@email.com",
    submit: "Entrar al Chat",
    fNoSignup: "Sin registro",
    fPrivacy: "Privacidad total",
    fImages: "Comparte imágenes",
    fLinks: "Links con vista previa",
    fRooms: "Salas por URL",
  },
  profile: {
    title: "Editar perfil",
    close: "Cerrar",
    emailLabel: "Email:",
    emailImmutable: "(no se puede cambiar aquí)",
    avatarLabel: "Avatar",
    nameLabel: "Nombre",
    namePlaceholder: "Tu nombre",
    cancel: "Cancelar",
    save: "Guardar",
  },
  validation: {
    name: "El nombre debe tener entre 2 y 50 caracteres",
    email: "Ingresa un email válido",
    avatar: "Selecciona un avatar",
  },
  auth: {
    loading: "Cargando",
  },
  indicator: {
    one: "mensaje nuevo",
    many: "mensajes nuevos",
  },
  avatar: {
    select: "Seleccionar avatar",
  },
  theme: {
    light: "Modo claro",
    dark: "Modo oscuro",
  },
  lightbox: {
    title: "Imagen a pantalla completa",
    close: "Cerrar",
    zoomOut: "Reducir zoom",
    zoomIn: "Ampliar zoom",
  },
};

export const dictionaries: Record<"pt-BR" | "en" | "es", Messages> = {
  "pt-BR": ptBR,
  en,
  es,
};
