"use client";

import { useActionState } from "react";
import type { GeneralSettings } from "@/lib/settings/genel";
import type { PagesSettings } from "@/lib/settings/sayfalar";
import type { LegalSettings } from "@/lib/settings/yasal";
import type { IconCard } from "@/lib/content/types";
import {
  saveFeatures,
  saveHero,
  saveLegal,
  savePageTexts,
  saveSectionTexts,
  saveServices,
} from "@/app/actions/genel";
import {
  cardCls,
  FormStatus,
  IconSelect,
  ImageField,
  LInput,
  LTextarea,
  type ActionState,
} from "./Fields";

function CardFields({ prefix, card, index }: { prefix: string; card: IconCard; index: number }) {
  return (
    <div className="space-y-3 rounded-xl border border-line bg-card/60 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-[#999]">Kart {index + 1}</p>
        <div className="w-56">
          <IconSelect name={`${prefix}.icon`} value={card.icon} />
        </div>
      </div>
      <LInput name={`${prefix}.title`} label="Başlık" value={card.title} required />
      <LTextarea name={`${prefix}.text`} label="Metin" value={card.text} rows={2} />
    </div>
  );
}

export function HeroForm({ initial }: { initial: GeneralSettings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveHero, {});
  return (
    <form action={action} className={cardCls}>
      <p className="text-xs text-muted">
        Banner üzerinde metin bulunduğu için her dil için ayrı görsel yüklenebilir. İngilizce görsel boşsa
        Türkçe görsel gösterilir.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <ImageField name="desktop.tr" label="Masaüstü banner — TR (2560×600 önerilir)" current={initial.hero.desktop.tr} aspect="aspect-[2560/600]" />
        <ImageField name="desktop.en" label="Masaüstü banner — EN" current={initial.hero.desktop.en} aspect="aspect-[2560/600]" />
        <ImageField name="mobile.tr" label="Mobil banner — TR (1080×1080 önerilir)" current={initial.hero.mobile.tr} aspect="aspect-square" />
        <ImageField name="mobile.en" label="Mobil banner — EN" current={initial.hero.mobile.en} aspect="aspect-square" />
      </div>
      <LInput name="alt" label="Banner alternatif metni (erişilebilirlik / SEO)" value={initial.hero.alt} />
      <LInput name="marquee" label="Yeşil kayan şerit metni" value={initial.marquee} />
      <FormStatus state={state} pending={pending} />
    </form>
  );
}

export function FeaturesForm({ initial }: { initial: GeneralSettings["features"] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveFeatures, {});
  return (
    <form action={action} className={cardCls}>
      <LInput name="title" label="Başlık" value={initial.title} required />
      <LInput
        name="highlight"
        label="Başlıkta yeşil vurgulanacak ifade (başlığın içinde birebir geçmeli)"
        value={initial.highlight}
      />
      <LTextarea name="text" label="Alt metin" value={initial.text} rows={2} />
      <div className="grid gap-4 lg:grid-cols-2">
        {initial.items.map((card, i) => (
          <CardFields key={i} prefix={`items.${i}`} card={card} index={i} />
        ))}
      </div>
      <FormStatus state={state} pending={pending} />
    </form>
  );
}

export function SectionTextsForm({ initial }: { initial: GeneralSettings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSectionTexts, {});
  return (
    <form action={action} className={cardCls}>
      <LInput name="productsTitle" label="Ürünler bölümü başlığı" value={initial.productsSection.title} required />
      <LInput name="productsText" label="Ürünler bölümü alt metni" value={initial.productsSection.text} />
      <LInput name="blogTitle" label="Blog bölümü başlığı" value={initial.blogSection.title} required />
      <LTextarea
        name="tagline"
        label="Footer sloganı"
        value={initial.footer.tagline}
        rows={2}
        hint="Satır sonu için Enter kullanın; her satır ayrı basılır."
      />
      <LTextarea name="sustainability" label="Footer sürdürülebilirlik metni" value={initial.footer.sustainability} rows={2} />
      <FormStatus state={state} pending={pending} />
    </form>
  );
}

export function ServicesForm({ initial }: { initial: GeneralSettings["services"] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveServices, {});
  return (
    <form action={action} className={cardCls}>
      <LInput name="title" label="Başlık" value={initial.title} required />
      <LTextarea
        name="text"
        label="Alt metin"
        value={initial.text}
        rows={2}
        hint="**iki yıldız** arasındaki ifadeler kalın basılır."
      />
      <div className="space-y-6">
        {initial.tabs.map((tab, ti) => (
          <div key={ti} className="rounded-2xl border border-line p-4">
            <LInput name={`tabs.${ti}.title`} label={`${ti + 1}. Sekme başlığı`} value={tab.title} required />
            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              {tab.cards.map((card, ci) => (
                <CardFields key={ci} prefix={`tabs.${ti}.cards.${ci}`} card={card} index={ci} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <FormStatus state={state} pending={pending} />
    </form>
  );
}

export function PageTextsForm({ initial }: { initial: PagesSettings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(savePageTexts, {});
  return (
    <form action={action} className={cardCls}>
      <p className="text-xs font-bold uppercase tracking-wider text-[#999]">Ürünler sayfası</p>
      <LInput name="productsTitle" label="Başlık" value={initial.products.title} required />
      <LTextarea name="productsSubtitle" label="Alt metin" value={initial.products.subtitle} rows={2} />
      <p className="pt-2 text-xs font-bold uppercase tracking-wider text-[#999]">Galeri sayfası</p>
      <LInput name="galleryTitle" label="Başlık" value={initial.gallery.title} required />
      <LTextarea name="gallerySubtitle" label="Alt metin" value={initial.gallery.subtitle} rows={2} />
      <LInput name="galleryCtaTitle" label="Alt kutu başlığı" value={initial.gallery.ctaTitle} />
      <LTextarea name="galleryCtaText" label="Alt kutu metni" value={initial.gallery.ctaText} rows={2} />
      <p className="pt-2 text-xs font-bold uppercase tracking-wider text-[#999]">Blog sayfası</p>
      <LInput name="blogTitle" label="Başlık" value={initial.blog.title} required />
      <LTextarea name="blogSubtitle" label="Alt metin" value={initial.blog.subtitle} rows={2} />
      <FormStatus state={state} pending={pending} />
    </form>
  );
}

export function LegalForm({ initial }: { initial: LegalSettings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveLegal, {});
  return (
    <form action={action} className={cardCls}>
      <p className="text-xs text-muted">
        Metinlerde boş satır paragraf ayırır, &quot;## &quot; ile başlayan satır alt başlık olur,
        &quot;- &quot; ile başlayan satırlar madde listesi oluşturur.
      </p>
      {initial.docs.map((doc) => (
        <div key={doc.slug} className="space-y-3 rounded-xl border border-line p-4">
          <LInput name={`${doc.slug}.title`} label="Sayfa başlığı" value={doc.title} required />
          <LTextarea name={`${doc.slug}.body`} label="İçerik" value={doc.body} rows={10} />
        </div>
      ))}
      <FormStatus state={state} pending={pending} />
    </form>
  );
}
