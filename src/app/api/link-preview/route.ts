import { NextRequest, NextResponse } from "next/server";

interface PreviewData {
  url: string;
  title: string;
  description: string;
  image?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "anonyzap/1.0" },
    });
    clearTimeout(timeout);

    const html = await res.text();
    const preview: PreviewData = {
      url,
      title:
        extractMeta(html, "og:title") || extractTitle(html) || url,
      description:
        extractMeta(html, "og:description") ||
        extractMeta(html, "description") ||
        "",
      image: extractMeta(html, "og:image") || undefined,
    };

    return NextResponse.json(preview);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch preview" },
      { status: 502 }
    );
  }
}

function extractMeta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title>([^<]+)<\/title>/i);
  return match ? match[1] : null;
}
