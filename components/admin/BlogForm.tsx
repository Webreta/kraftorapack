"use client";

import { useActionState } from "react";
import { savePost, type SavePostState } from "@/app/actions/blog";
import type { BlogPost } from "@/lib/content/types";
import { cardCls, ImageField, inputCls, labelCls, LInput, LTextarea, submitCls } from "./Fields";

export function BlogForm({ initial }: { initial?: BlogPost }) {
  const [state, action, pending] = useActionState<SavePostState, FormData>(savePost, {});
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="space-y-6">
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <div className={cardCls}>
        <LInput name="title" label="Başlık" value={initial?.title} required />
        <div className="grid gap-3 md:grid-cols-2">
          <label className={labelCls}>
            Türkçe adres (slug) — boşsa başlıktan üretilir
            <input type="text" name="slug" defaultValue={initial?.slug ?? ""} className={inputCls} />
          </label>
          <label className={labelCls}>
            İngilizce adres (slug)
            <input type="text" name="slugEn" defaultValue={initial?.slugEn ?? ""} className={inputCls} />
          </label>
        </div>
        <LTextarea name="excerpt" label="Özet (kartlarda görünür)" value={initial?.excerpt} rows={2} />
        <div className="grid gap-3 md:grid-cols-3">
          <label className={labelCls}>
            Tarih
            <input type="date" name="date" required defaultValue={initial?.date ?? today} className={inputCls} />
          </label>
          <label className={labelCls}>
            Okuma süresi (dk) — boşsa hesaplanır
            <input type="number" name="readMinutes" min={1} defaultValue={initial?.readMinutes ?? ""} className={inputCls} />
          </label>
          <label className="flex items-center gap-2 self-end pb-2 text-sm text-ink">
            <input type="checkbox" name="published" defaultChecked={initial?.published ?? true} className="size-4 accent-brand-600" />
            Yayında
          </label>
        </div>
      </div>

      <div className={cardCls}>
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <LTextarea
            name="body"
            label="İçerik"
            value={initial?.body}
            rows={22}
            required
            hint='Boş satır paragraf ayırır. "## " ile başlayan satır alt başlık, "- " ile başlayan satırlar madde listesi, **iki yıldız** arası kalın olur.'
          />
          <ImageField name="cover" label="Kapak görseli (16:9 önerilir)" current={initial?.cover} aspect="aspect-video" />
        </div>
      </div>

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className={submitCls}>
        {pending ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </form>
  );
}
