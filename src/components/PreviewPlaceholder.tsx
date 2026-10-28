"use client";
import { Link as LinkIcon } from "lucide-react";

/**
 * Default block shown in place of the image when a link preview
 * has no OG image.
 */
export function PreviewPlaceholder({ className }: { className: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-gray-200 dark:bg-gray-600 ${className}`}
    >
      <LinkIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" aria-hidden />
    </div>
  );
}
