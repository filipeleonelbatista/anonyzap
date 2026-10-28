# GIF Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Um botão "GIF" ao lado do botão de imagem que abre um balão (popover) sobre o input, com campo de pesquisa e GIFs pré-carregados (GIPHY), e o GIF selecionado é enviado como mensagem de imagem.

**Architecture:** Rota de proxy GET `/api/giphy` (chama `search` ou `trending` do GIPHY, chave secreta no servidor, padrão igual a `/api/link-preview`) alimenta um componente `GifPicker` (popover com input de busca debounced de 300ms, grade 2 colunas). O GIF escolhido reutiliza o caminho de imagem existente **sem upload**: `sendMessage("", { imageUrl })` → mensagem `type: "image"` → `MessageBubble` já renderiza com `max-w-[320px]` (requisito do preview atendido sem nenhuma mudança lá) e o lightbox funciona de graça.

**Tech Stack:** fetch nativo (sem SDK do GIPHY), React 19, Tailwind, Jest + Testing Library.

**Spec:** Conversa do usuário (2026-10-27) + screenshot do seletor estilo iMessage: botão GIF ao lado do botão de imagem, balão sobre o input com campo de pesquisa e GIFs pré-carregados, preview da mensagem dentro de 320px.

## Global Constraints

- TypeScript strict; aspas duplas, ponto-e-vírgula, 2 espaços.
- Export nomeado para componentes (`GifPicker`); path alias `@/` → `src/`.
- API route: `export const dynamic = "force-dynamic"`; erros retornam `NextResponse.json({ error }, { status })` (padrão de `/api/link-preview`).
- Logs com prefixo de módulo: `"[giphy]"`.
- Sem dependências novas (fetch direto na API do GIPHY).
- GIF do GIPHY vai como `type: "image"` com `imageUrl` — a API POST já aceita `imageUrl` (ver `src/app/api/rooms/[roomId]/messages/route.ts:89`).
- Chave: `GIPHY_API_KEY` (server-side, **sem** `NEXT_PUBLIC_`); requisições GIPHY com `rating=g` e `limit=24`.
- **Nenhuma mudança em `MessageBubble.tsx` / `next.config.mjs`** — o bubble usa `<img>` plano (não `next/image`), então URLs de `media.giphy.com` funcionam sem config, e o preview já é `max-w-[320px]` (`MessageBubble.tsx:324`).

## Review Focus

- `GIPHY_API_KEY` ausente → rota responde JSON `{ error }` 500 e o picker mostra estado vazio, não crash. Teste: Task 1, `returns 500 when GIPHY_API_KEY is not set`.
- Corrida de respostas de busca (usuário digita rápido; resposta antiga chega depois) → só o resultado da última query é aplicado. Teste: Task 2, `renders only the latest query result`.
- Busca sem resultados → mensagem visível (`input.noGifs`), não crash nem lista fantasma. Teste: Task 2, `shows empty state when search has no results`.
- Enviar GIF com texto já digitado no textarea → o GIF vai como mensagem de imagem separada e o **texto permanece** no campo. Verificação manual (Task 3).
- GIF recebido abre no lightbox → mesma caixa das imagens por upload; nenhum código novo, verificação manual (Task 3).

---

### Task 1: Proxy API `/api/giphy` + tipo `GifResult` + env

**Files:**
- Modify: `src/types/index.ts` (adicionar `GifResult`)
- Create: `src/app/api/giphy/route.ts`
- Modify: `.env.local.example` (adicionar `GIPHY_API_KEY`)
- Modify: `README.md` (seção Variáveis de Ambiente: 1 linha descrevendo `GIPHY_API_KEY` com link `https://developers.giphy.com/`)
- Test: `__tests__/api/giphy.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `GifResult` em `src/types/index.ts`:

```ts
export interface GifResult {
  id: string;
  title: string;
  /** Thumbnail para a grade do picker (GIPHY fixed_width). */
  smallUrl: string;
  /** GIF completo enviado na mensagem (GIPHY downsized_medium). */
  url: string;
}
```

- Produces: `GET /api/giphy?q=<termo>` → `200 { gifs: GifResult[] }`; **sem** `q` (ou só espaços) → trending; sem `GIPHY_API_KEY` → 500 `{ error }`; upstream falho/timeout → 502 `{ error }`.

- [ ] **Step 1: Write the failing test**

```ts
// __tests__/api/giphy.test.ts
import { GET } from "@/app/api/giphy/route";
import { NextRequest } from "next/server";

const request = (q?: string) =>
  new NextRequest(`http://localhost:3000/api/giphy${q ? `?q=${q}` : ""}`);

const giphyPayload = {
  data: [
    {
      id: "abc",
      title: "Wow",
      images: {
        fixed_width: { url: "https://media.giphy.com/abc/giphy.gif?small" },
        downsized_medium: { url: "https://media.giphy.com/abc/giphy.gif?big" },
      },
    },
  ],
};

describe("[giphy] /api/giphy", () => {
  const oldKey = process.env.GIPHY_API_KEY;
  beforeEach(() => {
    process.env.GIPHY_API_KEY = "test-key";
    global.fetch = jest.fn();
  });
  afterEach(() => {
    process.env.GIPHY_API_KEY = oldKey;
    jest.restoreAllMocks();
  });

  test("maps GIFs to GifResult (smallUrl=fixed_width, url=downsized_medium)", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(giphyPayload),
    });
    const res = await GET(request("wow"));
    expect(res.status).toBe(200);
    expect((await res.json()).gifs).toEqual([
      { id: "abc", title: "Wow", smallUrl: "https://media.giphy.com/abc/giphy.gif?small", url: "https://media.giphy.com/abc/giphy.gif?big" },
    ]);
  });

  test("no q hits the trending endpoint with api_key, rating g and limit 24", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
    await GET(request());
    const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain("/v1/gifs/trending");
    expect(url).toContain("api_key=test-key");
    expect(url).toContain("rating=g");
    expect(url).toContain("limit=24");
  });

  test("returns 500 when GIPHY_API_KEY is not set", async () => {
    delete process.env.GIPHY_API_KEY;
    const res = await GET(request("wow"));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBeDefined();
  });

  test("filters out GIFs missing renditions", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [giphyPayload.data[0], { id: "bad", title: "", images: {} }],
        }),
    });
    const res = await GET(request("wow"));
    const body = await res.json();
    expect(body.gifs).toHaveLength(1);
    expect(body.gifs[0].id).toBe("abc");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest __tests__/api/giphy.test.ts`
Expected: FAIL — módulo `@/app/api/giphy/route` não existe.

- [ ] **Step 3: Implement**

Em `src/types/index.ts`, adicionar `GifResult` (versão do bloco Interfaces acima) perto de `LinkPreview`.

Em `src/app/api/giphy/route.ts`, seguindo o molde de `src/app/api/link-preview/route.ts`:

```ts
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "GIPHY_API_KEY is not configured" }, { status: 500 });
  // endpoint = busca se q (trim) não vazio, senão trending
  const base = q.trim()
    ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(q.trim())}`
    : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}`;
  // url = base + "&limit=24&rating=g&fields=id,title,images.fixed_width,images.downsized_medium"
  // fetch com AbortController de 5000ms (como link-preview); !res.ok/erro → console.error("[giphy]", ...)
  // e 502 JSON; mapear data → GifResult, filtrar itens sem renditions, retornar { gifs }.
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest __tests__/api/giphy.test.ts`
Expected: 4 PASS.

- [ ] **Step 5: Adicionar `GIPHY_API_KEY=` em `.env.local.example` e a linha correspondente na seção de variáveis do README.**

(*) Obs: o usuário precisa criar a própria chave em developers.giphy.com — mencionar isso na linha do README.

- [ ] **Step 6: Commit**

```bash
git add src/types/index.ts src/app/api/giphy/route.ts .env.local.example README.md __tests__/api/giphy.test.ts
git commit -m "feat: giphy proxy API for gif picker"
```

---

### Task 2: Componente `GifPicker` (balão + busca + grade)

**Files:**
- Create: `src/components/GifPicker.tsx`
- Modify: `src/i18n/messages.ts` (chaves `input.searchGifs` e `input.noGifs` nos 3 dicionários)
- Test: `__tests__/components/GifPicker.test.tsx`

**Interfaces:**
- Consumes: `GET /api/giphy` (Task 1), `GifResult` (`@/types`), `useI18n` (`@/context/LanguageContext`).
- Produces:

```ts
interface GifPickerProps {
  /** Chamada com a URL completa (downsized_medium) do GIF escolhido. */
  onPick: (gifUrl: string) => void;
  disabled?: boolean;
}
export function GifPicker({ onPick, disabled }: GifPickerProps): JSX.Element
```

- Comportamento: botão pill "GIF" estilo iMessage (`h-7 px-2.5 rounded-full border border-gray-300 dark:border-gray-600 text-[11px] font-bold text-gray-700 dark:text-gray-200`, alinhado ao centro do form com `self-center mb-[10px]`, `type="button"`, desabilitado junto do input). Clique alterna o popover: `absolute bottom-full mb-2 left-0 w-[320px] max-h-[380px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl p-2 flex flex-col z-50` dentro do container `relative` existente do `MessageInput`. Conteúdo: input de busca (`rounded-full border-2 border-whatsapp-green px-3 py-1.5 text-sm mb-2`, placeholder `t.input.searchGifs`) + `overflow-y-auto grid grid-cols-2 gap-1.5`; cada item `<img src={smallUrl} alt={title} className="w-full max-h-[120px] object-cover rounded-lg cursor-pointer" onClick={() => onPick(gif.url)} />`.
- Estado ao abrir: reset de `query`/`gifs`/`loading` e fetch de trending. Estado ao fechar: reset total. Fechar via `Escape` (`onKeyDown` no input) e clique fora (`useEffect` com `document` mousedown quando aberto).
- Busca: debounce 300ms no `query`; query vazia → trending (mesmo fetch). Race guard: `useRef` guarda um id incrementado por requisição iniciada; a resposta só é aplicada se o id ainda é o mais recente. Erro de fetch → `setGifs([])` (estado vazio cobre).

- [ ] **Step 1: Write the failing test**

```ts
// __tests__/components/GifPicker.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { LanguageProvider } from "@/context/LanguageContext";
import { GifPicker } from "@/components/GifPicker";
import type { GifResult } from "@/types";

const gif: GifResult = { id: "abc", title: "Wow", smallUrl: "https://media.giphy.com/s.gif", url: "https://media.giphy.com/big.gif" };
const cats: GifResult = { id: "def", title: "Cats", smallUrl: "https://media.giphy.com/cats.s.gif", url: "https://media.giphy.com/cats.gif" };
let onPick: jest.Mock;

// fake timers: debounce + fetch promises resolvidos por microtask via waitFor (RTL auto-avança)
describe("GifPicker", () => {
  beforeEach(() => {
    onPick = jest.fn();
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ gifs: [gif] }) });
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  const open = () => {
    render(<LanguageProvider><GifPicker onPick={onPick} /></LanguageProvider>);
    fireEvent.click(screen.getByRole("button", { name: /gif/i }));
    return screen;
  };

  test("opens the popover with a search field and preloaded gifs", async () => {
    open();
    expect(screen.getByPlaceholderText(/pesquisar|search/i)).toBeInTheDocument();
    await waitFor(() => {
      const img = screen.getByAltText("Wow") as HTMLImageElement;
      expect(img.src).toBe("https://media.giphy.com/s.gif");
    });
  });

  test("clicking a gif calls onPick with the full url and closes the popover", async () => {
    open();
    await waitFor(() => screen.getByAltText("Wow"));
    fireEvent.click(screen.getByAltText("Wow"));
    expect(onPick).toHaveBeenCalledWith("https://media.giphy.com/big.gif");
    await waitFor(() => expect(screen.queryByPlaceholderText(/pesquisar|search/i)).not.toBeInTheDocument());
  });

  test("debounces search by 300ms", async () => {
    open();
    await waitFor(() => screen.getByAltText("Wow"));
    const input = screen.getByPlaceholderText(/pesquisar|search/i);
    const trendingCalls = (global.fetch as jest.Mock).mock.calls.length;
    fireEvent.change(input, { target: { value: "cats" } });
    jest.advanceTimersByTime(250);
    expect((global.fetch as jest.Mock).mock.calls.length).toBe(trendingCalls); // nada em 250ms
    await act(async () => jest.advanceTimersByTimeAsync(100)); // completa os 300ms
    expect((global.fetch as jest.Mock).mock.calls.length).toBe(trendingCalls + 1);
  });

  test("renders only the latest query result", async () => {
    open();
    await waitFor(() => screen.getByAltText("Wow"));
    let resolveSlow!: (r: { ok: boolean; json: () => Promise<{ gifs: GifResult[] }> }) => void;
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => new Promise((resolve) => { resolveSlow = resolve; })) // resposta "ca": lenta
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ gifs: [cats] }) }); // resposta "cats": rápida
    const input = screen.getByPlaceholderText(/pesquisar|search/i);
    fireEvent.change(input, { target: { value: "ca" } });
    await act(async () => jest.advanceTimersByTimeAsync(300));
    fireEvent.change(input, { target: { value: "cats" } });
    await act(async () => jest.advanceTimersByTimeAsync(300));
    await waitFor(() => screen.getByAltText("Cats")); // resultado da ÚLTIMA query visível
    await act(async () => resolveSlow({ ok: true, json: () => Promise.resolve({ gifs: [{ ...gif, id: "old", title: "Old" }] }) }));
    expect(screen.queryByAltText("Old")).not.toBeInTheDocument(); // resposta atrasada não sobrescreve
  });

  test("shows empty state when search has no results", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve({ gifs: [] }) });
    open();
    await waitFor(() => expect(screen.getByText(/no gifs/i)).toBeInTheDocument());
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest __tests__/components/GifPicker.test.tsx`
Expected: FAIL — `GifPicker` não existe.

- [ ] **Step 3: Implement `GifPicker` conforme Interfaces**

Detalhes i18n: adicionar ao type `Messages.input` (linha ~35) `searchGifs: string;` e `noGifs: string;`, e nos três dicionários abaixo de `addImage`: `ptBR` → `"Pesquisar GIFs em GIPHY"` / `"Nenhum GIF"`, `en` → `"Search GIFs in GIPHY"` / `"No GIFs found"`, `es` → `"Buscar GIFs en GIPHY"` / `"Sin GIFs"`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest __tests__/components/GifPicker.test.tsx`
Expected: 5 PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/GifPicker.tsx src/i18n/messages.ts __tests__/components/GifPicker.test.tsx
git commit -m "feat: gif picker popover with giphy search"
```

---

### Task 3: Wiring em `MessageInput` + `ChatInterface` + verificação

**Files:**
- Modify: `src/components/MessageInput.tsx` (props em ~10-16; render do picker em ~137-145)
- Modify: `src/components/ChatInterface.tsx` (novo handler perto de ~89-106; prop em ~195-201)

**Interfaces:**
- Consumes: `GifPicker` (Task 2), `sendMessage` do `RoomContext` (assinatura existente `(content, opts?: { imageUrl?: string; ... })`).
- Produces: nova prop **obrigatória** de `MessageInput`:

```ts
onSendGif: (gifUrl: string) => void;
```

- Em `ChatInterface`: `const handleSendGif = useCallback((gifUrl: string) => sendMessage("", { imageUrl: gifUrl }), [sendMessage]);` — **sem** `replyTo` (mesma regra do upload de imagem, `ChatInterface.tsx:102`). No JSX: `<MessageInput ... onSendGif={handleSendGif} />`.
- Em `MessageInput`: props ganham `onSendGif`; renderizar `<GifPicker onPick={onSendGif} disabled={disabled} />` imediatamente após o botão `ImagePlus` (linhas 137-145), dentro do container `relative` do form. Enviar GIF **não** limpa `text` nem `clearLinks`.

- [ ] **Step 1: Implementar o wiring conforme Interfaces.** (Sem teste novo: o picker é coberto no Task 2 e o POST com `imageUrl` é o caminho já exercido pelo upload de imagem.)

- [ ] **Step 2: Suíte completa + lint + build**

Run: `npm test && npm run lint && npm run build`
Expected: tudo PASS, 0 erro.

- [ ] **Step 3: Verificação manual (`npm run dev`)**

1. Clique no botão GIF → balão abre acima do input com GIFs trending pré-carregados.
2. Digitou "cats" → resultados mudam após ~300ms de pausa.
3. Clicar num GIF → mensagem de imagem aparece, balão fecha, **texto digitado permanece** no textarea.
4. Preview da mensagem no chat respeitando largura (`max-w-[320px]` intacta).
5. Clicar no GIF recebido abre o lightbox.

- [ ] **Step 4: Commit**

```bash
git add src/components/MessageInput.tsx src/components/ChatInterface.tsx
git commit -m "feat: wire gif picker into message input"
```

---

## Fora de escopo (explícito)

- Scroll infinito / paginação no picker (24 GIFs por resposta são suficientes).
- Favoritos, stickers/clips, badge de atribuição GIPHY, `lang` por idioma do usuário.
- Reupload do GIF para o Vercel Blob (URL do GIPHY é estável e evita upload/custo desnecessários).
- Rate limiting do `/api/giphy` (mesmo nível de exposição que `/api/link-preview`).
- SDK `@giphy/js-fetch-api` / `@giphy/react-components` (dependências extras por ~40 linhas de fetch).
