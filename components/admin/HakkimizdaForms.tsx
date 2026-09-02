"use client";

import { useActionState } from "react";
import type { AboutBlock, AboutSettings } from "@/lib/settings/hakkimizda";
import { saveAboutBlocks, saveAboutIntro, saveAboutWhy } from "@/app/actions/hakkimizda";
import { cardCls, FormStatus, IconSelect, ImageField, LInput, LTextarea, type ActionState } from "./Fields";

export function AboutIntroForm({ initial }: { initial: AboutSettings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveAboutIntro, {});
  return (
    <form action={action} className={cardCls}>
      <LInput name="title" label="Sayfa başlığı" value={initial.title} required />
      <LTextarea name="subtitle" label="Alt metin" value={initial.subtitle} rows={2} />
      <p className="pt-2 text-xs font-bold uppercase tracking-wider text-[#999]">Sayfa sonundaki çağrı kutusu</p>
      <LInput name="ctaTitle" label="Başlık" value={initial.cta.title} />
      <LTextarea name="ctaText" label="Metin" value={initial.cta.text} rows={2} />
      <FormStatus state={state} pending={pending} />
    </form>
  );
}

function BlockFields({ prefix, block, label }: { prefix: string; block: AboutBlock; label: string }) {
  return (
    <div className="space-y-3 rounded-xl border border-line p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-[#999]">{label}</p>
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-3">
          <LInput name={`${prefix}.eyebrow`} label="Üst etiket" value={block.eyebrow} />
          <LInput name={`${prefix}.title`} label="Başlık" value={block.title} required />
          <LTextarea name={`${prefix}.text1`} label="1. Paragraf" value={block.text1} rows={3} />
          <LTextarea name={`${prefix}.text2`} label="2. Paragraf" value={block.text2} rows={3} />
        </div>
        <ImageField name={`${prefix}.image`} label="Görsel" current={block.image} />
      </div>
    </div>
  );
}

export function AboutBlocksForm({ initial }: { initial: AboutSettings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveAboutBlocks, {});
  return (
    <form action={action} className={cardCls}>
      <BlockFields prefix="story" block={initial.story} label="Hikayemiz (görsel solda)" />
      <BlockFields prefix="mission" block={initial.mission} label="Misyonumuz (görsel sağda)" />
      <FormStatus state={state} pending={pending} />
    </form>
  );
}

export function AboutWhyForm({ initial }: { initial: AboutSettings["why"] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveAboutWhy, {});
  return (
    <form action={action} className={cardCls}>
      <LInput name="eyebrow" label="Üst etiket" value={initial.eyebrow} />
      <LInput name="title" label="Başlık" value={initial.title} required />
      <LTextarea name="text" label="Alt metin" value={initial.text} rows={2} />
      <div className="grid gap-4 lg:grid-cols-2">
        {initial.cards.map((card, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-line bg-card/60 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-[#999]">Kart {i + 1}</p>
              <div className="w-56">
                <IconSelect name={`cards.${i}.icon`} value={card.icon} />
              </div>
            </div>
            <LInput name={`cards.${i}.title`} label="Başlık" value={card.title} required />
            <LTextarea name={`cards.${i}.text`} label="Metin" value={card.text} rows={2} />
          </div>
        ))}
      </div>
      <FormStatus state={state} pending={pending} />
    </form>
  );
}
