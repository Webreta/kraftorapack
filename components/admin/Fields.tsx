"use client";

import type { L } from "@/lib/l10n";
import { SavedToast } from "./SavedToast";
import { CARD_ICONS, CARD_ICON_LABELS } from "@/components/site/Icon";

// Panel formlarında ortak sınıflar ve iki dilli alan bileşenleri

export const inputCls =
  "w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
export const labelCls = "flex flex-col gap-1 text-sm font-medium text-ink";
export const submitCls =
  "rounded-lg bg-brand-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60";
export const cardCls = "space-y-4 rounded-2xl border border-line bg-white p-5";
export const fileCls = `${inputCls} file:mr-3 file:rounded-md file:border-0 file:bg-brand-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-brand-800`;

export type ActionState = { ok?: boolean; error?: string };

export function FormStatus({
  state,
  pending,
  label = "Kaydet",
}: {
  state: ActionState;
  pending: boolean;
  label?: string;
}) {
  return (
    <>
      <SavedToast show={!!state.ok && !state.error} signal={state} />
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      <button type="submit" disabled={pending} className={submitCls}>
        {pending ? "Kaydediliyor…" : label}
      </button>
    </>
  );
}

const Badge = ({ lang }: { lang: "tr" | "en" }) => (
  <span
    className={`inline-block w-7 shrink-0 rounded px-1 text-center text-[10px] font-bold uppercase ${
      lang === "tr" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
    }`}
  >
    {lang}
  </span>
);

// İki dilli tek satır: name.tr ve name.en alanlarını yan yana basar
export function LInput({
  name,
  label,
  value,
  required,
  placeholder,
}: {
  name: string;
  label: string;
  value?: L;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="grid gap-2 md:grid-cols-2">
        {(["tr", "en"] as const).map((lang) => (
          <label key={lang} className="flex items-center gap-2">
            <Badge lang={lang} />
            <input
              type="text"
              name={`${name}.${lang}`}
              defaultValue={value?.[lang] ?? ""}
              required={required && lang === "tr"}
              placeholder={placeholder}
              className={inputCls}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

// İki dilli çok satır
export function LTextarea({
  name,
  label,
  value,
  rows = 3,
  required,
  hint,
  mono,
}: {
  name: string;
  label: string;
  value?: L;
  rows?: number;
  required?: boolean;
  hint?: string;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      {hint && <p className="text-xs text-muted">{hint}</p>}
      <div className="grid gap-2 md:grid-cols-2">
        {(["tr", "en"] as const).map((lang) => (
          <label key={lang} className="flex items-start gap-2">
            <Badge lang={lang} />
            <textarea
              name={`${name}.${lang}`}
              rows={rows}
              defaultValue={value?.[lang] ?? ""}
              required={required && lang === "tr"}
              className={`${inputCls} ${mono ? "font-mono text-xs" : ""}`}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export function IconSelect({ name, value }: { name: string; value?: string }) {
  return (
    <label className={labelCls}>
      İkon
      <select name={name} defaultValue={value ?? CARD_ICONS[0]} className={inputCls}>
        {CARD_ICONS.map((ic) => (
          <option key={ic} value={ic}>
            {CARD_ICON_LABELS[ic]} ({ic})
          </option>
        ))}
      </select>
    </label>
  );
}

// Mevcut görsel önizlemesi + yeni dosya + kaldır kutusu
export function ImageField({
  name,
  label,
  current,
  aspect = "aspect-[4/3]",
  removable = true,
}: {
  name: string;
  label: string;
  current: string | null | undefined;
  aspect?: string;
  removable?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-ink">{label}</p>
      {current ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current} alt="" className={`${aspect} w-full rounded-xl border border-line bg-card object-contain`} />
          {removable && (
            <label className="flex items-center gap-1.5 text-xs font-medium text-red-600">
              <input type="checkbox" name={`${name}Remove`} className="size-3.5 accent-red-600" />
              Görseli kaldır
            </label>
          )}
        </>
      ) : (
        <div className={`flex ${aspect} w-full items-center justify-center rounded-xl border border-dashed border-line bg-card text-xs font-semibold text-[#999]`}>
          Henüz görsel yok
        </div>
      )}
      <input type="file" name={name} accept=".png,.jpg,.jpeg,.webp,.svg" className={fileCls} />
    </div>
  );
}
