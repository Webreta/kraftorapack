"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { submitQuote, type FormState } from "@/app/actions/forms";
import type { Dict } from "@/lib/i18n";
import type { Lang } from "@/lib/l10n";
import { Icon } from "./Icon";
import { fieldCls, labelCls, Req } from "./ContactForm";

export type QuoteView = {
  product: string;
  title: string;
  fields: { key: string; label: string }[];
  options: { key: string; label: string }[];
};

// Ürün sayfasındaki "Teklif İste" butonu ve açılan form penceresi
export function QuoteModal({
  lang,
  form,
  quote,
  buttonLabel,
}: {
  lang: Lang;
  form: Dict["form"];
  quote: QuoteView;
  buttonLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<FormState, FormData>(submitQuote, {});

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const selectCls = `${fieldCls} appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")] bg-[length:18px] bg-[right_8px_center] bg-no-repeat pr-8`;

  const Select = ({
    name,
    label,
    options,
    required,
  }: {
    name: string;
    label: string;
    options: readonly string[];
    required?: boolean;
  }) => (
    <div>
      <label className={labelCls} htmlFor={`q-${name}`}>
        {label}
        {required && <Req label={form.required} />}
      </label>
      <input type="hidden" name={`label:${name}`} value={label} />
      <select id={`q-${name}`} name={name} required={required} className={selectCls} defaultValue="">
        <option value="">{form.select}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md border-2 border-brand-600 bg-white px-5 py-2 text-[13.5px] font-semibold text-brand-600 transition hover:bg-brand-600 hover:text-white"
      >
        {buttonLabel}
        <Icon name="chevron-right" className="size-3.5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-4 md:py-10"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={quote.title}
        >
          <div
            className="relative w-full max-w-[600px] rounded-lg bg-white p-6 shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between">
              <Image src="/logo.png" alt="Kraftora" width={800} height={176} className="h-auto w-[150px]" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={form.close}
                className="-mr-2 -mt-2 p-2 text-[#777] hover:text-ink"
              >
                <Icon name="close" className="size-6" />
              </button>
            </div>
            <h3 className="mb-5 text-[20px] font-bold text-ink">{quote.title}</h3>

            {state.ok ? (
              <div className="rounded-lg bg-brand-50 px-5 py-8 text-center">
                <p className="text-[15px] font-semibold text-brand-900">{form.quoteSuccess}</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-5 rounded-md bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white"
                >
                  {form.close}
                </button>
              </div>
            ) : (
              <form action={action} className="space-y-4" noValidate>
                <input type="hidden" name="lang" value={lang} />
                <input type="hidden" name="product" value={quote.product} />
                <div className="hidden" aria-hidden="true">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                {quote.fields.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-3">
                    {quote.fields.map((f) => (
                      <div key={f.key}>
                        <label className={labelCls} htmlFor={`q-${f.key}`}>
                          {f.label}
                          <Req label={form.required} />
                        </label>
                        <input type="hidden" name={`label:${f.key}`} value={f.label} />
                        <input id={`q-${f.key}`} name={f.key} type="text" required className={fieldCls} />
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-3">
                  <Select name="material" label={form.material} options={form.materials} required />
                  <Select name="print" label={form.print} options={form.prints} required />
                  <Select name="finishing" label={form.finishing} options={form.finishings} required />
                </div>

                {quote.options.length > 0 && (
                  <div>
                    <p className={labelCls}>{form.additionalOptions}</p>
                    <input type="hidden" name="label:options" value={form.additionalOptions} />
                    <div className="flex flex-wrap gap-2">
                      {quote.options.map((o) => (
                        <label
                          key={o.key}
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-[#ddd] bg-white px-3 py-2 text-[13px] font-semibold text-ink has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
                        >
                          <input type="checkbox" name="options" value={o.label} className="size-3.5 accent-brand-600" />
                          {o.label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <Select name="quantity" label={form.quantity} options={form.quantities} required />
                <Select name="usage" label={form.usage} options={form.usages} />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls} htmlFor="q-name">
                      {form.fullName}
                      <Req label={form.required} />
                    </label>
                    <input id="q-name" name="name" type="text" required className={fieldCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="q-email">
                      {form.email}
                      <Req label={form.required} />
                    </label>
                    <input id="q-email" name="email" type="email" required className={fieldCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="q-phone">
                      {form.phone}
                      <Req label={form.required} />
                    </label>
                    <input id="q-phone" name="phone" type="tel" required className={fieldCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="q-company">
                      {form.company}
                    </label>
                    <input id="q-company" name="company" type="text" className={fieldCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls} htmlFor="q-notes">
                    {form.notes}
                  </label>
                  <textarea id="q-notes" name="notes" rows={3} className={fieldCls} />
                </div>

                {state.error && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
                )}
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-md bg-brand-500 px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60 sm:w-auto"
                >
                  {pending ? form.sending : form.send}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
