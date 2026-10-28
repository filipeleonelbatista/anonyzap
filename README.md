<p align="center">
  <img src="./public/icon.svg" width="120" height="120" alt="AnonyZap Logo">
</p>

<h1 align="center">AnonyZap 💬</h1>

<p align="center">
  <strong>Chat em tempo real, anônimo e temporário — direto do navegador.</strong>
</p>

<p align="center">
  <a href="#-sobre">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-como-usar">Como usar</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-desenvolvimento">Desenvolvimento</a> •
  <a href="#-deploy">Deploy</a>
</p>

---

## 📋 Sobre

**AnonyZap** é uma aplicação de chat em tempo real que funciona 100% no navegador. Cada URL é uma sala de chat diferente — compartilhe o link com quem quiser conversar. **Sem cadastro, sem dados permanentes, sem rastreamento.**

As mensagens expiram automaticamente após **24 horas**. Seus dados (nome, email, avatar) ficam salvos apenas no seu navegador (localStorage).

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 🚀 **Sem cadastro** | Escolha um nome e avatar para entrar. Não precisa de senha. |
| 🔒 **Privacidade total** | Nenhuma mensagem armazenada permanentemente. Tudo expira em 24h. |
| 🖼️ **Compartilhe imagens** | Envie fotos que ficam disponíveis por 24 horas via Vercel Blob. |
| 🔗 **Links com preview** | Cole um link e veja o preview automático com título, descrição e imagem. |
| 📱 **Salas por URL** | Cada URL é uma sala. Compartilhe o link para convidar. |
| ⚡ **Tempo real** | Mensagens em tempo real via Server-Sent Events (SSE). |
| 🌙 **Modo escuro** | Interface adaptável com suporte a dark mode. |
| 💾 **Sessão persistente** | Seus dados ficam salvos no navegador entre visitas. |

---

## 🎯 Como usar

1. **Acesse** a URL da sala (ex: `https://anonyzap.vercel.app/minha-sala`)
2. **Escolha** um avatar, nome e email
3. **Compartilhe** o link com quem quiser conversar
4. **Pronto!** As mensagens aparecem em tempo real

> 💡 **Dica:** Cada URL diferente cria uma sala nova. Use URLs únicas para conversas diferentes.

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| [Next.js](https://nextjs.org/) | 15 | Framework full-stack com App Router |
| [React](https://react.dev/) | 19 | Biblioteca de UI |
| [TypeScript](https://www.typescriptlang.org/) | 5+ | Tipagem estática |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Estilização utilitária |
| [Vercel KV](https://vercel.com/docs/storage/vercel-kv) | - | Armazenamento temporário de mensagens (Redis) |
| [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) | - | Upload temporário de imagens |
| [Jest](https://jestjs.io/) | 29 | Testes unitários |

---

## 🚀 Desenvolvimento

### Pré-requisitos

- Node.js 20+
- Conta na [Vercel](https://vercel.com) com KV e Blob habilitados

### Instalação

```bash
# Clone o repositório
git clone https://github.com/filipeleonelbatista/anonyzap.git
cd anonyzap

# Instale as dependências
npm install

# Copie as variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas credenciais da Vercel
```

### Variáveis de Ambiente

```env
# Vercel KV (Redis)
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...

# Vercel Blob
BLOB_READ_WRITE_TOKEN=...

# Cron: limpeza de imagens antigas no Blob (`/api/cron/clean-blobs`)
CRON_SECRET=...

# GIF picker (`/api/giphy`) — crie uma chave gratuita em https://developers.giphy.com/
GIPHY_API_KEY=...

# Base URL (opcional, para OG images)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

O histórico de cada sala é uma **janela móvel de 24 horas** por `timestamp` da mensagem (alinhada ao TTL do KV): qualquer pessoa que abrir a mesma sala vê o mesmo recorte das últimas 24h; ao rolar para cima, carrega-se o restante ainda dentro dessa janela.

> ⚠️ **Banco Upstash gratuito deletado** — bancos gratuitos do Upstash são **removidos automaticamente após 14 dias de inatividade**. Sintoma: `getaddrinfo ENOTFOUND <nome>.upstash.io` e erros 500 nas rotas que usam KV. Para restaurar: no console do Upstash, "Restore the Database" recupera os dados dos backups, mas **o banco de destino precisa ser criado antes** para receber os dados restaurados. Depois de restaurar/criar, atualize `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` e `KV_REST_API_READ_ONLY_TOKEN` no ambiente (Vercel/local).

**Presença (balões “entrou / saiu”):** a contagem de abas por usuário usa **Redis** (`SADD`/`SREM` em `room:{roomId}:presence:user:{userId}` com TTL), para que várias instâncias serverless não dupliquem join/leave. O mapa de conexões SSE em memória continua só na instância atual — por exemplo, o modal “Pessoas” (`getRoomUsers`) ainda lista apenas quem está conectado à **mesma** instância; alinhar isso ao Redis pode ser um passo futuro.

O `vercel.json` agenda um cron **todo domingo à meia-noite (UTC)** em `/api/cron/clean-blobs` (`0 0 * * 0`), que remove blobs com prefixo `chat-images/` e idade superior a 24 horas. Na Vercel, defina `CRON_SECRET` no projeto; o cron envia `Authorization: Bearer <CRON_SECRET>` automaticamente. Para testar localmente:

```bash
curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/clean-blobs
```

### Executar

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Testes
npm test

# Lint
npm run lint
```

---

## 🌐 Deploy

O projeto está configurado para deploy na **Vercel** (plano Hobby).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/filipeleonelbatista/anonyzap)

**Passos:**
1. Conecte o repositório na Vercel
2. Adicione as integrações **Vercel KV** e **Vercel Blob**
3. Configure as variáveis de ambiente
4. Deploy automático a cada push na branch `main`

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Feito com 💚 por <a href="https://github.com/filipeleonelbatista">filipeleonelbatista</a>
</p>
