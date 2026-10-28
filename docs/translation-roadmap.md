# Roadmap de Tradução — pt-BR → Inglês & Espanhol (AnonyZap)

> Criado em 2026-10-27 (rev. 2: abordagem **sem rotas de locale**). Meta: oferecer o app e os documentos legais em **pt-BR, EN e ES**, mantendo pt-BR como idioma padrão, **sem mudar nenhuma URL** (`/`, `/{roomId}`, `/privacidade`, `/termos` permanecem como estão).

## Abordagem escolhida: `LanguageContext` (client-side)

Um `LanguageContext` em `src/context/`, no padrão dos existentes (`UserContext`, `RoomContext`):

- **Estado:** `locale` (`"pt-BR" | "en" | "es"`) + `setLocale()`.
- **Persistência:** hook existente `useLocalStorage`, chave `anonyzap:locale` — mesmo padrão do tema e do perfil.
- **Detecção inicial (1ª visita, sem preferência salva):** `navigator.language` → prefixos `es` → `es`, `pt` → `pt-BR`, senão mantém **pt-BR** (público principal; inglês fica só por escolha manual, evitando surpresa para brasileiros com navegador em EN).
- **Dicionários:** objetos TS em `src/i18n/` (`pt-BR.ts`, `en.ts`, `es.ts`) — **sem dependência nova** (nada de `next-intl`/`react-i18next`; o app tem pouco texto e os dicionários são digitados e verificáveis pelo compilador).
- **Consumo:** hook `useI18n()` (thin wrapper do `useContext`) expondo `{ locale, setLocale, t }`.
- **Troca de idioma:** seletor no `LgpdConsentBanner` (os legais) e num canto discreto da `ChatInterface`.
- **Provider:** dentro de `UserProvider` na árvore do layout, antes de `ChatInterface` e das páginas legais.

### Trade-off aceito (SEO)
Conteúdo trocado no cliente sob a mesma URL: buscadores indexam apenas pt-BR; sem hreflang. Para chat anônimo por link compartilhado, isso é aceitável. Se um dia SEO multilíngue importar, aí sim migrar para `/[locale]/...`.

## Escopo do que precisa ser traduzido

| Camada | Itens | Tamanho estimado |
|---|---|---|
| Páginas legais | `/privacidade`, `/termos` | ~2.500 palavras cada (3 idiomas) |
| Componentes UI (16) | `ChatInterface`, `MessageList`, `MessageBubble`, `MessageInput`, `ConnectionStatus`, `UserRegistrationModal`, `LgpdConsentBanner`, etc. | médio (strings espalhadas) |
| Contextos / hooks | `UserContext`, `RoomContext`, `useSSE` (mensagens de status/erro) | pequeno |
| Página `/` | texto do redirect/landing | mínimo |
| Fora de escopo | mensagens dos usuários (são conteúdo), `metadata`/JSON-LD/sitemap (ficam pt-BR — decisão do trade-off acima), código/comentários, README | — |

> Nota sobre erros de API: as respostas das rotas continuam com mensagens em inglês (convenção do repo). A UI localiza o que o usuário vê via códigos de erro, não via texto do servidor. Se depois isso incomodar, localiza-se por header `Accept-Language` — mas não faz parte deste roadmap.

## Fases

### Fase 1 — Infra do contexto (sem mudança visível na UI)
- Criar `src/context/LanguageContext.tsx` + `src/i18n/{pt-BR,en,es}.ts` (só com as chaves já usadas no banner LGPD, para validar o mecanismo).
- Seletor de idioma no `LgpdConsentBanner`.
- Critério de aceite: trocar idioma persiste após reload (`anonyzap:locale`); `npm test` e build verdes.

### Fase 2 — Documentos legais EN/ES
- Traduzir `/privacidade` e `/termos` usando o contexto (mesma URL, conteúdo por `locale`).
- Rodapé nas versões EN/ES: "In case of discrepancy, the Portuguese version prevails." / "En caso de discrepancia, prevalece la versión en portugués."
- Citações legais (LGPD Art. 6º/7º/18, GDPR Art. 5º/6º/8º/18/21) ficam idênticas nos 3 idiomas — são referências jurídicas, não se traduzem.
- Critério de aceite: as 3 versões têm as mesmas seções; trocar idioma na página legal funciona sem reload.

### Fase 3 — i18n da UI
- Migrar os 16 componentes + hooks para `t()`; preencher dicionários EN e ES por completo.
- Inclui modal de registro, estados de conexão, labels de reação/delete, datas (`Intl.DateTimeFormat` com o `locale` — nativo, zero deps).
- Critério de aceite: fluxo completo (entrar em sala, enviar, reagir, deletar, dark mode, SSE reconectando) correto nos 3 idiomas.

### Fase 4 — Testes e acabamento
- Ajustar testes existentes que assertem texto fixo em pt-BR (assert sobre chave de mensagem, não string).
- Teste novo: troca de idioma persiste e propaga para componentes legais.
- Critério de aceite: `npm test`, `npm run lint` e `npm run build` verdes.

## Notas legais (transversais)

- LGPD exige que o titular **compreenda** o aviso de consentimento: por isso o seletor de idioma entra no próprio banner (Fase 1) e os legais são traduzidos antes da UI (Fase 2).
- `metadata` (título/descrição, usada por buscadores) permanece pt-BR; usuários veem o conteúdo localizado na página.

## Ordem sugerida

1 → 2 (~1 dia, compliance imediato) → 3 → 4. A Fase 1 sozinha já valida o mecanismo end-to-end com risco zero para as rotas.
