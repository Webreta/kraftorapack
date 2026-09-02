"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { addGalleryImages, deleteGalleryImage, reorderGallery } from "@/app/actions/galeri";
import type { GalleryImage } from "@/lib/content/types";
import { cardCls, fileCls, FormStatus, LInput, type ActionState } from "./Fields";
import { SavedToast } from "./SavedToast";

export function GalleryUploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<ActionState, FormData>(addGalleryImages, {});
  useEffect(() => {
    if (state.ok && !pending) formRef.current?.reset();
  }, [state, pending]);
  return (
    <form ref={formRef} action={action} className={cardCls}>
      <label className="flex flex-col gap-1 text-sm font-medium text-ink">
        Görseller (birden fazla seçilebilir)
        <input type="file" name="images" multiple required accept=".png,.jpg,.jpeg,.webp" className={fileCls} />
      </label>
      <LInput name="alt" label="Alternatif metin (tüm seçilenlere uygulanır, isteğe bağlı)" />
      <FormStatus state={state} pending={pending} label="Yükle" />
    </form>
  );
}

// Görsel ızgarası: sürükle-bırak ile sıralama, tek tıkla silme
export function GalleryGridManager({ items }: { items: GalleryImage[] }) {
  const [list, setList] = useState(items);
  const [drag, setDrag] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const [saved, setSaved] = useState(0);
  const [, startTransition] = useTransition();

  if (list.length === 0) {
    return <p className="rounded-2xl border border-line bg-white p-6 text-center text-sm text-muted">Henüz görsel yok.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      <SavedToast show={saved > 0} label="Sıralama kaydedildi" signal={saved} />
      {list.map((g, i) => (
        <div
          key={g.id}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.effectAllowed = "move";
            setDrag(i);
          }}
          onDragOver={(e) => {
            if (drag !== null) {
              e.preventDefault();
              setOver(i);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (drag !== null && drag !== i) {
              const next = [...list];
              const [moved] = next.splice(drag, 1);
              next.splice(i, 0, moved);
              setList(next);
              setSaved((c) => c + 1);
              startTransition(() => reorderGallery(next.map((x) => x.id)));
            }
            setDrag(null);
            setOver(null);
          }}
          onDragEnd={() => {
            setDrag(null);
            setOver(null);
          }}
          className={`group relative cursor-grab overflow-hidden rounded-xl border bg-white transition active:cursor-grabbing ${
            over === i ? "border-brand-400 ring-2 ring-brand-200" : "border-line"
          } ${drag === i ? "opacity-50" : ""}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={g.image} alt={g.alt.tr} className="aspect-[16/10] w-full object-cover" />
          <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {i + 1}
          </span>
          <form
            action={deleteGalleryImage}
            onSubmit={(e) => {
              if (!window.confirm("Bu görsel kalıcı olarak silinecek. Emin misiniz?")) e.preventDefault();
            }}
            className="absolute right-2 top-2"
          >
            <input type="hidden" name="id" value={g.id} />
            <button
              type="submit"
              className="rounded bg-white/90 px-2 py-0.5 text-[11px] font-bold text-red-600 opacity-0 shadow transition group-hover:opacity-100"
            >
              Sil
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
