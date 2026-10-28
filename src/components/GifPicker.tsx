"use client";
// I'm using the GIF picker popover, styled after the iMessage one: a pill
// button next to the image button opens a balloon over the input with a
// search field and preloaded (trending) GIFs from GIPHY.
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { GifResult } from "@/types";
import { useI18n } from "@/context/LanguageContext";

interface Props {
  onPick: (gifUrl: string) => void;
  disabled?: boolean;
}

const SEARCH_DEBOUNCE_MS = 300;

export function GifPicker({ onPick, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [loading, setLoading] = useState(false);
  // Race guard: only the most recent request's answer is applied.
  const requestIdRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  // Fetch once per query change (query checked against shared trending).
  const fetchGifs = useCallback(async (search: string, id: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/giphy${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ""}`
      );
      const data = (await res.json()) as { gifs?: GifResult[] };
      if (id === requestIdRef.current) {
        setGifs(res.ok ? data.gifs ?? [] : []);
      }
    } catch {
      if (id === requestIdRef.current) setGifs([]);
    } finally {
      if (id === requestIdRef.current) setLoading(false);
    }
  }, []);

  // Re-fetch whenever the (debounced) query changes while the picker is open.
  useEffect(() => {
    if (!open) return;
    const id = ++requestIdRef.current;
    const timer = setTimeout(() => void fetchGifs(query, id), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [open, query, fetchGifs]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setGifs([]);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open, close]);

  return (
    <div ref={rootRef} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        disabled={disabled}
        className="h-7 self-center mb-[10px] px-2.5 rounded-full border border-gray-300 dark:border-gray-600 text-[11px] font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        aria-label="GIF"
      >
        GIF
      </button>
      {open && (
        <div
          data-testid="gif-popover"
          className="absolute bottom-full mb-2 left-0 w-[320px] max-h-[380px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl p-2 flex flex-col z-50"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && close()}
            placeholder={t.input.searchGifs}
            className="rounded-full border-2 border-whatsapp-green px-3 py-1.5 text-sm mb-2 bg-transparent text-gray-900 dark:text-white outline-none placeholder-gray-400 dark:placeholder-gray-500"
          />
          <div className="overflow-y-auto grid grid-cols-2 gap-1.5">
            {gifs.map((gif) => (
              <button
                key={gif.id}
                type="button"
                className="p-0 border-0 bg-transparent cursor-pointer"
                onClick={() => {
                  onPick(gif.url);
                  close();
                }}
              >
                <img
                  src={gif.smallUrl}
                  alt={gif.title}
                  className="block w-full max-h-[120px] object-cover rounded-lg"
                />
              </button>
            ))}
            {gifs.length === 0 && (
              <span className="col-span-2 text-xs text-gray-500 dark:text-gray-400 p-2 text-center">
                {loading ? "…" : t.input.noGifs}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
