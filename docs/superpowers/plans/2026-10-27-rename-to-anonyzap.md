# Rename chat-anywhere → anonyzap — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Renomear o projeto de "Chat-Anywhere" para "AnonyZap" em toda a infra (GitHub + Vercel + domínio) e em todo o branding do código.

**Architecture:** Renomeação em duas fases: (1) rebrand de código local, com commits e verificação local (build/lint/testes/grep) antes de qualquer mudança de infra; (2) renomeação de infra — GitHub repo, projeto Vercel, variável de ambiente — seguida de um único push para `main`, que faz o deploy já no nome/domínio novos. Nada é deployado no estado intermediário com nomes mistos.

**Tech Stack:** Next.js ^16 (App Router), TypeScript, Jest + Testing Library, Vercel MCP, GitHub MCP.

**Spec:** Decisões tomadas em conversa com o dono do projeto (2026-10-27):
- Escopo: **tudo** — infra (repo GitHub + projeto Vercel + domínio) e código/branding.
- Domínio: **pode mudar** para `anonyzap.vercel.app`; links antigos de salas quebram (aceito — mensagens expiram em 24h).

## Global Constraints

- Nome de infra/repos/package (minúsculas): `anonyzap`
- Nome de exibição (branding/títulos): `AnonyZap`
- URL padrão nova: `https://anonyzap.vercel.app`
- Chaves de localStorage novas: `anonyzap:user` e `anonyzap:privacy-notice-ack`
- Migração de localStorage: ler chave antiga se a nova não existir, escrever na nova, remover a antiga — NUNCA sobrescrever dados existentes na chave nova
- NÃO renomear `ai_stuff/` nem `docs/superpowers/specs|plans/*` (registros históricos — decisão do planejador)
- NÃO alterar `vercel.json` nem `.env.local.example` (não contêm o nome)
- Commits seguem conventional commits (`feat:`, `chore:`, `docs:`)

## Review Focus

- **Usuário existente perde sessão após renomear chave:** ao abrir o app, usuário registrado deve continuar logado via migração da chave legada → teste no Task 1.
- **Consentimento LGPD reaparece para quem já aceitou:** migração da chave de consentimento → teste no Task 1.
- **Migração nunca destrói dados novos:** se `anonyzap:user` já existe, valor legado é descartado sem sobrescrever → teste no Task 1.
- **URL default esquecida em algum arquivo:** nenhuma ocorrência de `chat-anywhere` pode sobrar em `src/`, `README.md`, `package.json`, `__tests__/` → grep de verificação no Task 5.
- **Deploy quebra por env var desatualizada:** se `NEXT_PUBLIC_BASE_URL` estiver definida no projeto Vercel com o domínio antigo, metadata/OG/robots apontam para o domínio errado → checagem explícita no Task 7.

---

### Task 1: Constantes de storage + migração de chaves legadas

**Files:**
- Modify: `src/context/UserContext.tsx` (linha ~21: `const STORAGE_KEY = "chat-anywhere:user";`)
- Modify: `src/lib/lgpd-consent.ts` (linha 2: `export const LGPD_CONSENT_STORAGE_KEY = "chat-anywhere:privacy-notice-ack";`)
- Create: `src/lib/storage-migration.ts`
- Test: `__tests__/lib/storage-migration.test.ts`

**Interfaces:**
- Produces: `migrateStorageKey(newKey: string, legacyKey: string): string | null` — retorna o valor migrado (string) ou `null`; side effects: escreve `newKey` e remove `legacyKey` quando migra; não toca em nada se `newKey` já existe (retorna o valor novo).

- [ ] **Step 1: Escrever testes falhando em `__tests__/lib/storage-migration.test.ts`**

Casos (usar jsdom `localStorage`, imports via `@/`):
1. migra valor da chave legada quando a nova não existe: localStorage com `chat-anywhere:user` → retorna o valor, `anonyzap:user` passa a conter o valor, `chat-anywhere:user` é removida
2. não sobrescreve a chave nova: ambas presentes → retorna o valor de `anonyzap:user`, legada é removida, valor novo intacto
3. retorna `null` quando nenhuma existe
4. migra consentimento LGPD: `chat-anywhere:privacy-notice-ack` → `anonyzap:privacy-notice-ack` (mesmos casos 1–3 aplicados à segunda chave via o mesmo helper)

- [ ] **Step 2: Rodar teste para confirmar falha**

Run: `npm test -- storage-migration`
Expected: FAIL (módulo `@/lib/storage-migration` não existe)

- [ ] **Step 3: Implementar `src/lib/storage-migration.ts`**

Assinatura conforme Interfaces acima. Leitura com `localStorage.getItem` try/catch (padrão defensivo já usado no projeto), escrita/remove só quando migra.

- [ ] **Step 4: Rodar teste para confirmar passagem**

Run: `npm test -- storage-migration`
Expected: PASS (todos os casos)

- [ ] **Step 5: Consumir o helper em `UserContext.tsx` e `lgpd-consent.ts`**

- `UserContext.tsx`: `STORAGE_KEY = "anonyzap:user"`, `LEGACY_STORAGE_KEY = "chat-anywhere:user"`; na inicialização, `migrateStorageKey(STORAGE_KEY, LEGACY_STORAGE_KEY)` antes da leitura atual.
- `lgpd-consent.ts`: mesma troca com `anonyzap:privacy-notice-ack` / `chat-anywhere:privacy-notice-ack`, respeitando o export constante existente.

- [ ] **Step 6: Rodar todos os testes**

Run: `npm test`
Expected: PASS (incluindo testes existentes)

- [ ] **Step 7: Commit**

```bash
git add src/lib/storage-migration.ts src/context/UserContext.tsx src/lib/lgpd-consent.ts __tests__/lib/storage-migration.test.ts
git commit -m "feat: rename storage keys to anonyzap with legacy migration"
```

### Task 2: Rebrand de SEO/metadata e URLs default

**Files:**
- Modify: `src/app/layout.tsx` (linhas 6, 19–20, 38–41, 48–49, 58, 98, 135, 150)
- Modify: `src/app/manifest.ts` (linhas 5–6)
- Modify: `src/app/opengraph-image.tsx` (linha 5 alt + linha ~50 texto renderizado)
- Modify: `src/app/robots.ts` (linha 3)
- Modify: `src/app/sitemap.ts` (linha 3)
- Modify: `src/app/[roomId]/page.tsx` (linhas 4, 16, 18, 23)
- Modify: `src/app/privacidade/page.tsx` (linhas 4, 9, 27, 45 — copy LGPD)

**Interfaces:**
- Consumes: nada de código; usa os valores do Global Constraints.
- Produces: `BASE_URL` default `https://anonyzap.vercel.app` consistente em todos os 5 arquivos.

- [ ] **Step 1: Substituir todas as ocorrências**

Mapeamento exato:
- `https://chat-anywhere.vercel.app` → `https://anonyzap.vercel.app` (5 arquivos)
- `Chat-Anywhere — Instant Chat Rooms, No Signup Required` → `AnonyZap — Instant Chat Rooms, No Signup Required` (layout: title default, OG title)
- `"%s | Chat-Anywhere"` → `"%s | AnonyZap"` (template)
- `Chat-Anywhere — Instant Chat Rooms` → `AnonyZap — Instant Chat Rooms` (manifest name, OG image alt)
- `short_name: "Chat-Anywhere"` → `"AnonyZap"`
- `Chat-Anywhere — Room #${roomName}` → `AnonyZap — Room #${roomName}` (title + OG + twitter)
- `on Chat-Anywhere` → `on AnonyZap` (descrição da sala)
- Campos `authors/creator/publisher/applicationName/siteName` e JSON-LD (`layout.tsx` linhas 38–41, 48–49, 135, 150): `Chat-Anywhere` → `AnonyZap`
- Texto renderizado em `opengraph-image.tsx` (~linha 50): `Chat-Anywhere` → `AnonyZap`
- Copy de `privacidade/page.tsx`: `Chat-Anywhere` → `AnonyZap` (3 ocorrências, incluindo `serviço <strong>AnonyZap</strong>`)

- [ ] **Step 2: Verificar por grep que não sobrou nada**

Run: `grep -ri "chat.anywhere" src/` (regex `chat.anywhere`)
Expected: nenhuma ocorrência

- [ ] **Step 3: Build de verificação**

Run: `npm run build`
Expected: build OK sem erros de TypeScript

- [ ] **Step 4: Commit**

```bash
git add src/app
git commit -m "feat: rebrand metadata, SEO and base URL to AnonyZap"
```

### Task 3: Copy da UI e User-Agent

**Files:**
- Modify: `src/components/EmptyRoomHints.tsx` (linhas 16, 36)
- Modify: `src/components/HelpModal.tsx` (linhas 12, 72)
- Modify: `src/components/UserRegistrationModal.tsx` (linha 70)
- Modify: `src/app/api/link-preview/route.ts` (linha 22)

- [ ] **Step 1: Substituir textos**

- `EmptyRoomHints.tsx`: fallback da URL → `https://anonyzap.vercel.app`; `Sala #${roomId} — Chat Anywhere` → `Sala #${roomId} — AnonyZap`
- `HelpModal.tsx`: `O que é o Chat-Anywhere?` → `O que é o AnonyZap?`; `Sobre o Chat-Anywhere` → `Sobre o AnonyZap`
- `UserRegistrationModal.tsx`: `Bem-vindo ao Chat-Anywhere!` → `Bem-vindo ao AnonyZap!`
- `link-preview/route.ts`: `"User-Agent": "chat-anywhere/1.0"` → `"anonyzap/1.0"`

- [ ] **Step 2: Verificar e rodar testes**

Run: `npm test`
Expected: PASS (nenhum teste de `__tests__/` referencia o nome antigo — verificado no planejamento; se algum falhar citando o nome, atualizar o teste)

- [ ] **Step 3: Commit**

```bash
git add src/components src/app/api/link-preview/route.ts
git commit -m "feat: rebrand UI copy and user agent to AnonyZap"
```

### Task 4: Arquivos de raiz (package.json, README, AGENTS.md)

**Files:**
- Modify: `package.json` (linha 2: `"name": "chat-anywhere"`)
- Modify: `README.md` (linhas 2, 5, 24, 47, 81–82, 142)
- Modify: `AGENTS.md` (visão geral, comando do cron, chave de localStorage na arquitetura, default de NEXT_PUBLIC_BASE_URL)

- [ ] **Step 1: Atualizar `package.json` e regenerar lockfile**

`"name": "chat-anywhere"` → `"anonyzap"`; depois:

Run: `npm install --package-lock-only`
Expected: `package-lock.json` com `"name": "anonyzap"` nas 2 ocorrências

- [ ] **Step 2: Atualizar README.md**

- Título `Chat-Anywhere 💬` → `AnonyZap 💬`; alt do logo `Chat-Anywhere Logo` → `AnonyZap Logo`
- `**Chat-Anywhere** é uma aplicação` → `**AnonyZap** é uma aplicação`
- Exemplo de URL `https://chat-anywhere.vercel.app/minha-sala` → `https://anonyzap.vercel.app/minha-sala`
- Clone: `https://github.com/filipeleonelbatista/anonyzap.git` + `cd anonyzap`
- Botão Deploy: `repository-url=https://github.com/filipeleonelbatista/anonyzap`

- [ ] **Step 3: Atualizar AGENTS.md**

- Visão geral: nome do projeto → AnonyZap
- Comando do cron e default de `NEXT_PUBLIC_BASE_URL` → `https://anonyzap.vercel.app`
- Chave do localStorage na seção Arquitetura → `anonyzap:user` (mencionar migração da legada)

- [ ] **Step 4: Verificação global e testes**

Run: `grep -ri "chat-anywhere" src/ README.md package.json package-lock.json AGENTS.md __tests__/`
Expected: apenas ocorrências de chave legada em `src/lib/storage-migration.ts`, `src/context/UserContext.tsx`, `src/lib/lgpd-consent.ts` e no teste (intencional — constantes de migração); nenhuma outra

Run: `npm run build && npm run lint && npm test`
Expected: tudo PASS

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json README.md AGENTS.md
git commit -m "docs: rename project to anonyzap in root files"
```

### Task 5: Renomear repo no GitHub + atualizar remote (MCP GitHub)

**Files:** nenhum no repo; operação externa.

**Interfaces:**
- Produces: repo em `github.com/filipeleonelbatista/anonyzap`; remote local `origin` atualizado.

- [ ] **Step 1: Buscar a ferramenta de rename no catálogo do MCP GitHub** (`search({ query: "rename repository update" })`) e renomear `filipeleonelbatista/chat-anywhere` → `anonyzap`
- [ ] **Step 2: Atualizar remote local:**

```bash
git remote set-url origin git@github.com:filipeleonelbatista/anonyzap.git
git remote -v
```
Expected: origin apontando para `anonyzap.git`

- [ ] **Step 3: Verificar que o repo responde no novo nome** (via MCP: get repository `filipeleonelbatista/anonyzap`)

### Task 6: Renomear projeto na Vercel + env var (MCP Vercel)

**Files:** nenhum; operação externa.

**Interfaces:**
- Produces: projeto Vercel `anonyzap`, domínio de produção `anonyzap.vercel.app`.

- [ ] **Step 1: Buscar ferramenta de rename/update project no catálogo do MCP Vercel** e renomear o projeto `chat-anywhere` → `anonyzap`
- [ ] **Step 2: Listar variáveis de ambiente do projeto; se `NEXT_PUBLIC_BASE_URL` existir com valor `https://chat-anywhere.vercel.app`, atualizá-la para `https://anonyzap.vercel.app`. Se não existir, não criar (o default do código já é o novo).**
- [ ] **Step 3: Confirmar que KV e Blob continuam vinculados ao projeto renomeado** (listar stores/marketplace integrations do projeto; os env vars `KV_*` e `BLOB_READ_WRITE_TOKEN` devem seguir presentes)
- [ ] **Step 4: Confirmar que o cron `/api/cron/clean-blobs` permanece configurado** (vem do `vercel.json`, deve sobreviver ao rename)

### Task 7: Push, deploy e verificação ponta a ponta

- [ ] **Step 1: Push para main:**

```bash
git push origin main
```
(uso de MCP GitHub/CLI conforme disponível no momento)

- [ ] **Step 2: Aguardar deploy e verificar:**
- `https://anonyzap.vercel.app` responde (fetch)
- `<title>` contém "AnonyZap" (fetch do HTML)
- `https://anonyzap.vercel.app/manifest.webmanifest` (ou `manifest.ts` rota) contém `AnonyZap`
- OG image renderiza "AnonyZap" (fetch da rota `/opengraph-image`)
- Cron: disparar manualmente `/api/cron/clean-blobs` com `Authorization: Bearer $CRON_SECRET` via curl e conferir resposta 200

- [ ] **Step 3: Verificar redirecionamentos do GitHub:** abrir `https://github.com/filipeleonelbatista/chat-anywhere` — deve redirecionar para o novo nome

### Task 8 (opcional, manual): Renomear pasta local

- [ ] Renomear `C:\projetos\chat-anywhere` → `C:\projetos\anonyzap` (fechar editores/sessões antes; atualizar workdir das sessões do OpenCode). Feito pelo dono, fora do escopo dos MCPs.
