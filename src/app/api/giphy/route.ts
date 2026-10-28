// Proxy to the GIPHY REST API (search when ?q= is present, trending otherwise).
// Keeps GIPHY_API_KEY server-side so client bundles never see it.
// JSDoc: results feed the GIF picker; sent messages reference the GIPHY URL
// directly (no upload), mirroring the blob image path's shape.
import { NextRequest, NextResponse } from "next/server";
import type { GifResult } from "@/types";

export const dynamic = "force-dynamic";

// Cache key: a free GIPHY Beta key is rate-limited to 100 requests/hour,
// so identical queries (and trending) are served from a per-instance cache.
const CACHE_TTL_MS = 5 * 60 * 1000;
// Bounded: q is attacker-controlled on a public route — never grow unbounded.
const CACHE_MAX_ENTRIES = 500;
const giphyCache = new Map<string, { gifs: GifResult[]; at: number }>();

interface GiphyImage {
  url?: string;
}

interface GiphyGif {
  id?: string;
  title?: string;
  images?: { fixed_width?: GiphyImage; downsized_medium?: GiphyImage };
}

// console log prefix: [giphy]

export async function GET(request: NextRequest) {
  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GIPHY_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const q = request.nextUrl.searchParams.get("q") ?? "";
  const base = q.trim()
    ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(q.trim())}`
    : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}`;
  const url = `${base}&limit=24&rating=g&fields=id,title,images.fixed_width,images.downsized_medium`;

  const cacheKey = q.trim().toLowerCase();
  const cached = giphyCache.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return NextResponse.json({ gifs: cached.gifs });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Giphy API returned ${res.status}`);
    }

    const { data } = (await res.json()) as { data?: GiphyGif[] };
    const gifs: GifResult[] = (data ?? [])
      .map((gif) => ({
        id: gif.id ?? "",
        title: gif.title ?? "",
        smallUrl: gif.images?.fixed_width?.url ?? "",
        url: gif.images?.downsized_medium?.url ?? "",
      }))
      .filter((gif) => gif.id && gif.smallUrl && gif.url);

    giphyCache.set(cacheKey, { gifs, at: Date.now() });
    if (giphyCache.size > CACHE_MAX_ENTRIES) {
      // Map preserves insertion order: the first key is the oldest entry.
      for (const oldest of giphyCache.keys()) {
        giphyCache.delete(oldest);
        break;
      }
    }
    return NextResponse.json({ gifs });
  } catch (error) {
    console.error("[giphy]", error);
    return NextResponse.json(
      { error: "Failed to fetch GIFs" },
      { status: 502 }
    );
  }
}
