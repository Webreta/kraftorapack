"use client";

import { useActionState, useState } from "react";
import { saveProduct, type SaveProductState } from "@/app/actions/urunler";
import type { Product, ProductQuote, ProductSection, QuoteField, QuoteOption } from "@/lib/content/types";
import { emptyL, type L } from "@/lib/l10n";
import { cardCls, fileCls, inputCls, labelCls, LInput, LTextarea, submitCls } from "./Fields";

type Initial = Omit<Product, "sortOrder">;

const emptySection = (): ProductSection => ({ title: emptyL(), text: emptyL(), image: null });
const newKey = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 7)}`;

// Bölüm / teklif alanları gibi dinamik listeler React state'inde tutulur,
// gönderimde JSON olarak gizli alanla server action'a gider.
export function ProductForm({ initial }: { initial?: Initial }) {
  const [state, action, pending] = useActionState<SaveProductState, FormData>(saveProduct, {});
  const [keepImages, setKeepImages] = useState<string[]>(initial?.images ?? []);
  const [sections, setSections] = useState<ProductSection[]>(initial?.sections ?? []);
  const [quote, setQuote] = useState<ProductQuote>(
    initial?.quote ?? { title: emptyL(), fields: [], options: [] }
  );

  const setL = <T,>(list: T[], i: number, patch: Partial<T>, set: (v: T[]) => void) =>
    set(list.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  const LPair = ({
    value,
    onChange,
    placeholder,
    textarea,
  }: {
    value: L;
    onChange: (v: L) => void;
    placeholder?: string;
    textarea?: boolean;
  }) => (
    <div className="grid gap-2 md:grid-cols-2">
      {(["tr", "en"] as const).map((lang) => (
        <label key={lang} className="flex items-start gap-2">
          <span
            className={`mt-2 inline-block w-7 shrink-0 rounded px-1 text-center text-[10px] font-bold uppercase ${
              lang === "tr" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
            }`}
          >
            {lang}
          </span>
          {textarea ? (
            <textarea
              rows={3}
              value={value[lang]}
              placeholder={placeholder}
              onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
              className={inputCls}
            />
          ) : (
            <input
              type="text"
              value={value[lang]}
              placeholder={placeholder}
              onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
              className={inputCls}
            />
          )}
        </label>
      ))}
    </div>
  );

  return (
    <form action={action} className="space-y-6">
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="keepImages" value={JSON.stringify(keepImages)} />
      <input type="hidden" name="sections" value={JSON.stringify(sections)} />
      <input type="hidden" name="quote" value={JSON.stringify(quote)} />

      {/* Temel bilgiler */}
      <div className={cardCls}>
        <h2 className="text-base font-bold text-ink">Temel Bilgiler</h2>
        <LInput name="title" label="Ürün adı" value={initial?.title} required />
        <div className="grid gap-3 md:grid-cols-2">
          <label className={labelCls}>
            Türkçe adres (slug) — boş bırakılırsa addan üretilir
            <input type="text" name="slug" defaultValue={initial?.slug ?? ""} placeholder="pizza-kutusu" className={inputCls} />
          </label>
          <label className={labelCls}>
            İngilizce adres (slug)
            <input type="text" name="slugEn" defaultValue={initial?.slugEn ?? ""} placeholder="pizza-box" className={inputCls} />
          </label>
        </div>
        <LTextarea name="cardText" label="Ana sayfa kartı açıklaması" value={initial?.cardText} rows={2} />
        <LInput name="listText" label="Ürünler sayfası kısa açıklaması" value={initial?.listText} />
        <LTextarea name="intro" label="Detay sayfası giriş metni" value={initial?.intro} rows={3} required />
        <div className="flex flex-wrap gap-6 text-sm text-ink">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="showOnHome" defaultChecked={initial?.showOnHome ?? true} className="size-4 accent-brand-600" />
            Ana sayfada göster
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="published" defaultChecked={initial?.published ?? true} className="size-4 accent-brand-600" />
            Yayında
          </label>
        </div>
      </div>

      {/* Görseller */}
      <div className={cardCls}>
        <h2 className="text-base font-bold text-ink">Ürün Görselleri (en fazla 3, ilki ana görsel)</h2>
        {keepImages.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {keepImages.map((img, i) => (
              <div key={img} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="aspect-square w-full rounded-xl border border-line bg-card object-cover" />
                {i === 0 && (
                  <span className="absolute left-2 top-2 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    Ana
                  </span>
                )}
                <div className="mt-1 flex gap-1">
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...keepImages];
                        [next[i - 1], next[i]] = [next[i], next[i - 1]];
                        setKeepImages(next);
                      }}
                      className="rounded border border-line px-2 py-0.5 text-xs"
                    >
                      ← Öne al
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setKeepImages(keepImages.filter((x) => x !== img))}
                    className="rounded border border-red-200 px-2 py-0.5 text-xs text-red-600"
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {keepImages.length < 3 && (
          <input type="file" name="images" multiple accept=".png,.jpg,.jpeg,.webp" className={fileCls} />
        )}
        <p className="text-xs text-muted">Kare (1:1) görseller önerilir; açık zemin üzerinde ürün mockup&apos;ı.</p>
      </div>

      {/* Detay bölümleri */}
      <div className={cardCls}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">Detay Bölümleri (görsel + başlık + metin)</h2>
          <button
            type="button"
            onClick={() => setSections([...sections, emptySection()])}
            className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-brand-500"
          >
            + Bölüm ekle
          </button>
        </div>
        {sections.length === 0 && <p className="text-sm text-muted">Henüz bölüm yok.</p>}
        {sections.map((s, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-line bg-card/60 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-[#999]">
                Bölüm {i + 1} — görsel {i % 2 === 0 ? "solda" : "sağda"}
              </p>
              <button
                type="button"
                onClick={() => setSections(sections.filter((_, j) => j !== i))}
                className="text-xs font-semibold text-red-600"
              >
                Kaldır
              </button>
            </div>
            <span className="text-sm font-medium text-ink">Başlık</span>
            <LPair value={s.title} onChange={(v) => setL(sections, i, { title: v }, setSections)} />
            <span className="text-sm font-medium text-ink">Metin</span>
            <LPair value={s.text} onChange={(v) => setL(sections, i, { text: v }, setSections)} textarea />
            <div className="grid items-start gap-3 md:grid-cols-[200px_1fr]">
              {s.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.image} alt="" className="aspect-[4/3] w-full rounded-lg border border-line bg-card object-cover" />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-line text-xs text-[#999]">
                  Görsel yok
                </div>
              )}
              <div className="space-y-2">
                <label className={labelCls}>
                  Ürün görsellerinden seç
                  <select
                    value={s.image ?? ""}
                    onChange={(e) => setL(sections, i, { image: e.target.value || null }, setSections)}
                    className={inputCls}
                  >
                    <option value="">— Seçilmedi —</option>
                    {keepImages.map((img, j) => (
                      <option key={img} value={img}>
                        Ürün görseli {j + 1}
                      </option>
                    ))}
                    {s.image && !keepImages.includes(s.image) && <option value={s.image}>Yüklenen görsel</option>}
                  </select>
                </label>
                <label className={labelCls}>
                  veya yeni görsel yükle
                  <input type="file" name={`sectionImage.${i}`} accept=".png,.jpg,.jpeg,.webp" className={fileCls} />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Teklif formu */}
      <div className={cardCls}>
        <h2 className="text-base font-bold text-ink">Teklif Formu</h2>
        <p className="text-xs text-muted">
          Malzeme, baskı, yüzey işlemi, adet ve kullanım türü seçimleri her üründe sabittir. Buradan ürüne özel
          ölçü alanlarını ve ek seçenekleri tanımlayın.
        </p>
        <span className="text-sm font-medium text-ink">Form başlığı (boşsa &quot;Ürün adı - Teklif Formu&quot;)</span>
        <LPair value={quote.title} onChange={(v) => setQuote({ ...quote, title: v })} />

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-ink">Ölçü alanları (metin girişi, zorunlu)</span>
          <button
            type="button"
            onClick={() =>
              setQuote({ ...quote, fields: [...quote.fields, { key: newKey("olcu"), label: emptyL() }] })
            }
            className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-brand-500"
          >
            + Alan ekle
          </button>
        </div>
        {quote.fields.map((f: QuoteField, i) => (
          <div key={f.key} className="flex items-start gap-2">
            <div className="flex-1">
              <LPair
                value={f.label}
                placeholder="Uzunluk (cm)"
                onChange={(v) =>
                  setQuote({ ...quote, fields: quote.fields.map((x, j) => (j === i ? { ...x, label: v } : x)) })
                }
              />
            </div>
            <button
              type="button"
              onClick={() => setQuote({ ...quote, fields: quote.fields.filter((_, j) => j !== i) })}
              className="mt-2 text-xs font-semibold text-red-600"
            >
              Sil
            </button>
          </div>
        ))}

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-ink">Ek seçenekler (onay kutusu)</span>
          <button
            type="button"
            onClick={() =>
              setQuote({ ...quote, options: [...quote.options, { key: newKey("secenek"), label: emptyL() }] })
            }
            className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-brand-500"
          >
            + Seçenek ekle
          </button>
        </div>
        {quote.options.map((o: QuoteOption, i) => (
          <div key={o.key} className="flex items-start gap-2">
            <div className="flex-1">
              <LPair
                value={o.label}
                placeholder="Yaldız Baskı"
                onChange={(v) =>
                  setQuote({ ...quote, options: quote.options.map((x, j) => (j === i ? { ...x, label: v } : x)) })
                }
              />
            </div>
            <button
              type="button"
              onClick={() => setQuote({ ...quote, options: quote.options.filter((_, j) => j !== i) })}
              className="mt-2 text-xs font-semibold text-red-600"
            >
              Sil
            </button>
          </div>
        ))}
      </div>

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className={submitCls}>
        {pending ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </form>
  );
}
