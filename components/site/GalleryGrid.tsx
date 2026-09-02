"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

export type GalleryItem = { src: string; alt: string };

// 3 sütunlu galeri; tıklanan görsel tam ekran karartma üzerinde açılır
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? null : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? null : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, items.length]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((it, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            className="group block aspect-[16/10] w-full overflow-hidden rounded-lg bg-card"
            aria-label={it.alt || `Görsel ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={it.src}
              alt={it.alt}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>

      {open !== null && items[open] && (
        <div
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/90 p-5"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute right-6 top-5 text-white/90 hover:text-white"
            aria-label="Kapat"
            onClick={() => setOpen(null)}
          >
            <Icon name="close" className="size-8" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={items[open].src}
            alt={items[open].alt}
            className="max-h-[90vh] max-w-[95vw] rounded-md object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
