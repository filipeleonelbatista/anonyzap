"use client";
import React, { useEffect, useState } from "react";
import { PreviewPlaceholder } from "@/components/PreviewPlaceholder";

interface PreviewData {
  title: string;
  description: string;
  image?: string;
}

interface Props {
  url: string;
}

export function LinkPreview({ url }: Props) {
  const [preview, setPreview] = useState<PreviewData | null>(null);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    fetch("/api/link-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setPreview(data);
      })
      .catch(() => {
        // Keep previous preview on error
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (!preview) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-2 p-2 mt-1 bg-gray-50 dark:bg-gray-800 rounded-lg border text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      {preview.image ? (
        <img
          src={preview.image}
          alt=""
          className="w-12 h-12 rounded object-cover flex-shrink-0"
        />
      ) : (
        <PreviewPlaceholder className="w-12 h-12 rounded flex-shrink-0" />
      )}
      <div className="min-w-0">
        <p className="font-semibold truncate">{preview.title}</p>
        <p className="text-gray-500 line-clamp-1">{preview.description}</p>
      </div>
    </a>
  );
}
