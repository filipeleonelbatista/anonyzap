/**
 * @jest-environment node
 */
// Tests for the [giphy] proxy API route that feeds the GIF picker.
// (server-side test: jsdom has no Request global for NextRequest)
// smallUrl comes from GIPHY fixed_width (grid thumbnail),
// url from downsized_medium (message image); degrades gracefully without key.
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
    const res = await GET(request("mixed"));
    const body = await res.json();
    expect(body.gifs).toHaveLength(1);
    expect(body.gifs[0].id).toBe("abc");
  });

  test("evicts oldest entries beyond the cache cap (bounded memory)", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(giphyPayload),
    });
    const total = 600; // above the cap
    for (let i = 0; i < total; i++) await GET(request(`flood-${i}`));
    expect((global.fetch as jest.Mock).mock.calls.length).toBe(total);
    // the oldest entry was evicted: replaying it must hit GIPHY again
    await GET(request("flood-0"));
    expect((global.fetch as jest.Mock).mock.calls.length).toBe(total + 1);
  });

  test("caches results per query (free beta key: 100 req/hour)", async () => {
    jest.useFakeTimers();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(giphyPayload),
    });
    await GET(request("cache-me"));
    await GET(request("cache-me"));
    expect(global.fetch).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(6 * 60 * 1000); // past the 5-minute TTL
    await GET(request("cache-me"));
    expect(global.fetch).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });
});
