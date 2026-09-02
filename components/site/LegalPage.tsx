import type { Metadata } from "next";
import { Marquee } from "@/components/site/Marquee";
import { PageIntro } from "@/components/site/PageIntro";
import { RichText } from "@/components/site/RichText";
import { getGeneralSettings, getLegalSettings } from "@/lib/data/settings";
import { t } from "@/lib/l10n";
import { resolveLang } from "@/lib/lang";
import type { LegalSlug } from "@/lib/settings/yasal";

type Params = Promise<{ lang: string }>;

export async function legalMetadata(slug: LegalSlug, params: Params): Promise<Metadata> {
  const lang = await resolveLang(params);
  const legal = await getLegalSettings();
  const doc = legal.docs.find((x) => x.slug === slug);
  return { title: doc ? t(doc.title, lang) : undefined, robots: { index: false, follow: true } };
}

// KVKK / Gizlilik / Çerez sayfalarının ortak görünümü
export async function LegalPage({ slug, params }: { slug: LegalSlug; params: Params }) {
  const lang = await resolveLang(params);
  const [legal, general] = await Promise.all([getLegalSettings(), getGeneralSettings()]);
  const doc = legal.docs.find((x) => x.slug === slug);
  if (!doc) return null;
  return (
    <>
      <Marquee text={t(general.marquee, lang)} />
      <div className="mx-auto max-w-[820px] px-5 pb-16">
        <PageIntro title={t(doc.title, lang)} />
        <RichText text={t(doc.body, lang)} />
      </div>
    </>
  );
}
