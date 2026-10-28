// Proxy to the GIPHY REST API (search when ?q= is present, trending otherwise).
// Keeps GIPHY_API_KEY server-side so client bundles never see it.
// JSDoc: results feed the GIF picker; sent messages reference the GIPHY URL
// directly (no upload), mirroring the blob image path's shape.
import { NextRequest, NextResponse } from "next/server";
import type { GifResult } from "@/types";

export const dynamic = "force-dynamic";

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

    return NextResponse.json({ gifs });
  } catch (error) {
    console.error("[giphy]", error);
    return NextResponse.json(
      { error: "Failed to fetch GIFs" },
      { status: 502 }
    );
  }
}
