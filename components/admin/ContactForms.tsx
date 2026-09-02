"use client";

import { useActionState } from "react";
import type { ContactSettings } from "@/lib/settings/iletisim";
import { saveContactPage, saveContactSettings } from "@/app/actions/iletisim";
import { cardCls, FormStatus, inputCls, labelCls, LInput, LTextarea, type ActionState } from "./Fields";

export function ContactSettingsForm({ initial }: { initial: ContactSettings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveContactSettings, {});
  return (
    <form action={action} className={cardCls}>
      <div className="grid gap-3 md:grid-cols-3">
        <label className={labelCls}>
          E-posta
          <input type="email" name="email" required defaultValue={initial.email} className={inputCls} />
        </label>
        <label className={labelCls}>
          Telefon (görünen)
          <input type="text" name="phone" required defaultValue={initial.phone} className={inputCls} />
        </label>
        <label className={labelCls}>
          Telefon (tel: bağlantısı, yalnızca rakam)
          <input type="text" name="phoneHref" required defaultValue={initial.phoneHref} placeholder="+905337710892" className={inputCls} />
        </label>
      </div>
      <LTextarea name="address" label="Adres" value={initial.address} rows={2} />
      <LInput name="hours" label="Çalışma saatleri" value={initial.hours} />
      <LInput name="replyNote" label="E-posta notu (örn. 24 saat içinde yanıt veriyoruz)" value={initial.replyNote} />
      <LInput name="location" label="Footer konum satırı" value={initial.location} />
      <div className="grid gap-3 md:grid-cols-2">
        {(
          [
            ["facebook", "Facebook"],
            ["instagram", "Instagram"],
            ["x", "X (Twitter)"],
            ["linkedin", "LinkedIn"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className={labelCls}>
            {label}
            <input type="text" name={key} defaultValue={initial.social[key]} placeholder="https://..." className={inputCls} />
          </label>
        ))}
      </div>
      <p className="text-xs text-muted">Boş bırakılan sosyal medya hesapları sitede gösterilmez.</p>
      <label className={labelCls}>
        Google Haritalar embed adresi (iframe src)
        <input type="text" name="mapEmbed" defaultValue={initial.mapEmbed} className={`${inputCls} font-mono text-xs`} />
      </label>
      <FormStatus state={state} pending={pending} />
    </form>
  );
}

export function ContactPageForm({ initial }: { initial: ContactSettings["page"] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveContactPage, {});
  return (
    <form action={action} className={cardCls}>
      <LInput name="title" label="Sayfa başlığı" value={initial.title} required />
      <LTextarea name="subtitle" label="Alt metin" value={initial.subtitle} rows={2} />
      <div className="grid gap-3 md:grid-cols-2">
        <LInput name="officeTitle" label="Ofis kartı başlığı" value={initial.officeTitle} />
        <LInput name="phoneTitle" label="Telefon kartı başlığı" value={initial.phoneTitle} />
        <LInput name="emailTitle" label="E-posta kartı başlığı" value={initial.emailTitle} />
        <LInput name="followTitle" label="Sosyal medya kartı başlığı" value={initial.followTitle} />
      </div>
      <LTextarea name="followText" label="Sosyal medya kartı metni" value={initial.followText} rows={2} />
      <LInput name="formTitle" label="Form başlığı" value={initial.formTitle} />
      <LTextarea name="formText" label="Form alt metni" value={initial.formText} rows={2} />
      <LInput name="ctaTitle" label="Alt kutu başlığı" value={initial.ctaTitle} />
      <LTextarea name="ctaText" label="Alt kutu metni" value={initial.ctaText} rows={2} />
      <FormStatus state={state} pending={pending} />
    </form>
  );
}
