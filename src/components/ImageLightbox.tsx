"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Minus, Plus, X } from "lucide-react";
import { useI18n } from "@/context/LanguageContext";

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.5;

interface Props {
  src: string;
  onClose: () => void;
}

/**
 * Fullscreen image viewer: zoom in/out buttons (mobile + desktop),
 * drag-to-pan while zoomed, Escape or backdrop click to close.
 */
export function ImageLightbox({ src, onClose }: Props) {
  const [scale, setScale] = useState(MIN_SCALE);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const { t } = useI18n();
  const imgRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef({ x: 0, y: 0, ox: 0, oy: 0, moved: false });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const clampOffset = (next: { x: number; y: number }, s: number) => {
    const img = imgRef.current;
    if (!img || s <= MIN_SCALE) return { x: 0, y: 0 };
    // transform does not change layout size, so offsetWidth/Height is the unzoomed size
    const maxX = (img.offsetWidth * (s - MIN_SCALE)) / 2;
    const maxY = (img.offsetHeight * (s - MIN_SCALE)) / 2;
    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    };
  };

  const zoom = (direction: 1 | -1) => {
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + direction * ZOOM_STEP));
    setScale(next);
    if (next === MIN_SCALE) setOffset({ x: 0, y: 0 });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[230] bg-black touch-none select-none"
      role="dialog"
      aria-modal="true"
      aria-label={t.lightbox.title}
      onClick={(e) => {
        if (e.target === e.currentTarget && !dragRef.current.moved) onClose();
      }}
      onPointerDown={(e) => {
        dragRef.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y, moved: false };
      }}
      onPointerMove={(e) => {
        const d = dragRef.current;
        if (!dragging) return;
        if (Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) > 5) d.moved = true;
        setOffset(clampOffset({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) }, scale));
      }}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <img
        ref={imgRef}
        src={src}
        alt=""
        draggable={false}
        className="absolute inset-0 m-auto max-w-[92vw] max-h-[85dvh] object-contain cursor-grab active:cursor-grabbing"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transition: dragging ? "none" : "transform 150ms ease",
        }}
        onPointerDown={(e) => {
          if (scale > MIN_SCALE) {
            e.stopPropagation();
            dragRef.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y, moved: false };
            setDragging(true);
          }
        }}
      />
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
        aria-label={t.profile.close}
      >
        <X className="h-6 w-6" strokeWidth={2.5} />
      </button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 p-1.5">
        <button
          type="button"
          onClick={() => zoom(-1)}
          disabled={scale <= MIN_SCALE}
          className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 disabled:opacity-40"
          aria-label={t.lightbox.zoomOut}
        >
          <Minus className="h-5 w-5" strokeWidth={2.5} />
        </button>
        <span
          className="w-14 text-center text-sm font-semibold tabular-nums text-white"
          aria-live="polite"
        >
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={() => zoom(1)}
          disabled={scale >= MAX_SCALE}
          className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 disabled:opacity-40"
          aria-label={t.lightbox.zoomIn}
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>
    </div>,
    document.body
  );
}
