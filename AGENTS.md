# AGENTS.md — Chat-Anywhere

Contexto e convenções para agentes de IA trabalhando neste repositório.

## Visão geral

**Chat-Anywhere 💬 → AnonyZap 💬** (renomeado em 2026-10-27) — aplicação de chat em tempo real, **anônimo e temporário**, 100% no navegador. Cada URL é uma sala de chat diferente (`/{roomId}`); compartilhe o link para convidar. Sem cadastro (apenas nome, avatar e email), sem dados permanentes, sem rastreamento.

- Mensagens **expiram em 24 horas**; dados do usuário ficam apenas no `localStorage`.
- Tempo real via **SSE**, envio de imagens (Vercel Blob), preview de links, reações, reply, delete, dark mode, banner LGPD.
- Deploy na **Vercel** (plano Hobby) via push na branch `main`.
- README e UI em **pt-BR**; código, comentários e metadata do site em **inglês**.

## Stack

- **Node.js 20+** / **TypeScript strict** (^5.4)
- **Next.js ^16** (App Router) + **React 19**
- **@vercel/kv** (Redis) — armazenamento temporário de mensagens (TTL 24h)
- **@vercel/blob** — upload temporário de imagens
- **Tailwind CSS ^3.4** (`darkMode: "class"`, paleta customizada estilo WhatsApp: `#25D366`, `#111B21`, `#DCF8C6`…)
- **Jest 29** + Testing Library (jsdom) para testes
- **ESLint 9** (flat config) + `eslint-config-next`
- `lucide-react`, `uuid`

> ⚠️ O README diz "Next.js 15" — está desatualizado; a versão real no `package.json` é `^16.0.0`.

## Comandos

| Comando | Descrição |
|---|---|
| `npm run dev` | Dev server (bind em `0.0.0.0`, acessível pela rede local) |
| `npm run build` | Build de produção |
| `npm start` | Servir build de produção |
| `npm run lint` | ESLint (`next lint`) |
| `npm test` | Jest (todos os testes) |
| `npm run test:watch` | Jest em modo watch |

Testar cron localmente: `curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/clean-blobs`

## Estrutura

```
src/
├── app/
│   ├── layout.tsx                 # Root layout: metadata/SEO/PWA, JSON-LD, script anti-flash de tema, banner LGPD
│   ├── page.tsx                   # "/" gera roomId aleatório e redireciona para /{roomId}
│   ├── privacidade/               # Política de privacidade
│   ├── [roomId]/                  # Sala: page.tsx (server) + room-client.tsx (client)
│   └── api/
│       ├── rooms/[roomId]/
│       │   ├── messages/          # GET (histórico + paginação) / POST (enviar)
│       │   ├── messages/[messageId]/react/    # POST (reações)
│       │   ├── messages/[messageId]/delete/   # POST (soft delete)
│       │   ├── sse/               # GET (stream SSE)
│       │   └── users/             # GET (usuários conectados na instância)
│       ├── upload/image/          # POST (multipart → Vercel Blob)
│       ├── link-preview/          # POST (scraping OG meta, timeout 5s)
│       └── cron/clean-blobs/      # GET (protegido por CRON_SECRET)
├── components/    # 16 componentes (ChatInterface, MessageList, MessageBubble, MessageInput, etc.)
├── context/       # UserContext (sessão em localStorage) / RoomContext (mensagens, SSE, paginação)
├── hooks/         # useSSE, useLocalStorage, useLinkDetection
├── lib/           # kv.ts, sse.ts, sse-presence.ts, presence.ts, room-history.ts, blob.ts, blob-cleanup.ts, lgpd-consent.ts
├── types/         # Message, User, SSEAction, Reaction, LinkPreview, ReplyTo…
└── utils/         # formatting.ts, sanitize.ts, validation.ts
__tests__/         # Espelha src/: components/, hooks/, utils/
docs/superpowers/  # specs e plans de design datados
```

## Ambiente

Copiar `.env.local.example` → `.env.local` e preencher com credenciais da Vercel (KV + Blob habilitados no projeto):

```env
KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN, KV_REST_API_READ_ONLY_TOKEN
BLOB_READ_WRITE_TOKEN
CRON_SECRET   # usado pelo /api/cron/clean-blobs (Bearer)
# Opcional: NEXT_PUBLIC_BASE_URL (default: https://anonyzap.vercel.app)
```

`next.config.mjs` permite imagens apenas de `https://*.public.blob.vercel-storage.com`.

## Arquitetura (resumo)

1. `/` gera um roomId no formato `adjective-noun-number` (`generateRoomId()` em `src/utils/formatting.ts`) e redireciona.
2. `/{roomId}` → `UserProvider` (sessão persistida em `localStorage`, chave `anonyzap:user`, migrada da legada `chat-anywhere:user` via `src/lib/storage-migration.ts`) → `ChatInterface`.
3. **RoomContext** faz envio otimista (mensagem `pending` com `tempId` = `crypto.randomUUID()`, substituída pelo broadcast SSE), paginação para cima (`?before=<ts>&limit=`), reagir, deletar.
4. **useSSE** conecta em `/api/rooms/{roomId}/sse` com reconexão por backoff exponencial (máx. 10 tentativas, delay até 30s); expõe `ConnectionStatus`.
5. **Mensagens no KV:** `zadd` em `room:{roomId}:messages` (score = timestamp) + `hset` em `message:{id}`, ambos com `MESSAGE_TTL = 86400`s.
6. **Reações atômicas via Lua** (`APPLY_REACTION_LUA`): 1 reação por usuário; mesmo emoji remove, emoji diferente substitui.
7. **Presença:** `registerSseTab` (Redis `SADD`/`SREM` com Lua, TTL 48h) conta abas; join/leave emitidos só quando contagem chega a 1/0 (multitab-safe e cross-instance).

### Limitações / pegadinhas conhecidas

- **Constantes críticas sincronizadas:** `MESSAGE_TTL = 86400` (`src/lib/kv.ts`) ↔ `ROOM_HISTORY_MS` (`src/lib/room-history.ts`). Mudar a janela de 24h exige alterar **os dois**.
- Mensagens `type: "system"` **não podem ser criadas via POST** da API (rejeitadas com 400) — só internamente via `broadcastPresence`.
- POST de mensagens exige header **`x-user-id`** (401 sem ele).
- O mapa de clientes SSE é **em memória por instância** — a lista "Pessoas" (`getRoomUsers`) só reflete conexões da mesma instância serverless; a presença join/leave é cross-instance via Redis.
- Upload de imagem: apenas jpeg/png/gif/webp, máx 5MB, caminho `chat-images/` com sufixo aleatório.
- Cron de limpeza de blobs: semanal (`0 0 * * 0` no `vercel.json`), apaga blobs `chat-images/` com mais de 24h.

## Convenções de código

- **TypeScript strict**; aspas duplas, ponto-e-vírgula, indentação de 2 espaços.
- **Path alias `@/*` → `./src/*`** (mapeado também no Jest via `moduleNameMapper`).
- ESLint flat config: `eslint-config-next/core-web-vitals` + `/typescript`.
- Componentes em **PascalCase com export nomeado** (exceção: páginas podem ter default export por exigência do Next); hooks em camelCase.
- JSDoc em funções de lib com regras de negócio (ex.: notas "keep in sync with MESSAGE_TTL").
- Rotas de API usam `export const dynamic = "force-dynamic"` e `maxDuration` quando necessário; erros retornam `NextResponse.json({ error }, { status })` com 400/401/403/404/500.
- Logs com prefixo de módulo entre colchetes: `"[cron/clean-blobs]"`, `"[sse]"`, `"[react]"`.
- **Commits:** conventional commits (`feat:`, `fix:`, `chore:`).

## Testes

- Jest 29 + ts-jest + jsdom + Testing Library, config em `jest.config.js`.
- Testes em `__tests__/` espelhando `src/`: `components/MessageBubble.test.tsx`, `hooks/useLocalStorage.test.ts`, `utils/{formatting,sanitize,validation}.test.ts`.
- Imports de teste usam o alias `@/`. Em ambiente jsdom, `EventSource` é `undefined` e o `useSSE` pula a conexão (comportamento esperado nos testes).

## Documentação de apoio

- `README.md` — fonte principal (pt-BR).
- `docs/superpowers/specs/` — specs de design aprovadas (arquitetura, data models, fluxos, estratégia de erros).
- `docs/superpowers/plans/` — planos de implementação correspondentes (reply-to-message, reactions-and-delete, message-status).
- `ai_stuff/` — rascunhos de sessões de IA; material bruto, não essencial.
