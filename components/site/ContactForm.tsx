"use client";

import { useActionState } from "react";
import { submitContact, type FormState } from "@/app/actions/forms";
import type { Dict } from "@/lib/i18n";
import type { Lang } from "@/lib/l10n";

export const fieldCls =
  "w-full rounded-md border border-[#ddd] bg-white px-3 py-2.5 text-[14px] text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15";
export const labelCls = "mb-1.5 block text-[13px] font-semibold text-ink";

export function Req({ label }: { label: string }) {
  return (
    <span className="ml-1 text-red-600" aria-label={label}>
      *
    </span>
  );
}

export function ContactForm({ lang, form }: { lang: Lang; form: Dict["form"] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitContact, {});

  if (state.ok) {
    return (
      <div className="rounded-lg bg-white px-5 py-8 text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-6">
            <path d="m5 13 4 4L19 7" />
          </svg>
        </div>
        <p className="text-[15px] font-semibold text-ink">{form.success}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="lang" value={lang} />
      {/* Bot tuzağı */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="c-name">
            {form.name}
            <Req label={form.required} />
          </label>
          <input id="c-name" name="name" type="text" required className={fieldCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="c-last">
            {form.lastName}
            <Req label={form.required} />
          </label>
          <input id="c-last" name="lastName" type="text" required className={fieldCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="c-email">
            {form.email}
            <Req label={form.required} />
          </label>
          <input id="c-email" name="email" type="email" required className={fieldCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="c-phone">
            {form.phone}
            <Req label={form.required} />
          </label>
          <input id="c-phone" name="phone" type="tel" required className={fieldCls} />
        </div>
      </div>
      <div>
        <label className={labelCls} htmlFor="c-message">
          {form.message}
          <Req label={form.required} />
        </label>
        <textarea id="c-message" name="message" rows={4} required className={fieldCls} />
      </div>
      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-500 px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        {pending ? form.sending : form.send}
      </button>
    </form>
  );
}
