import type { Metadata } from "next";
import { Marquee } from "@/components/site/Marquee";
import { PageIntro } from "@/components/site/PageIntro";
import { CtaBox } from "@/components/site/CtaBox";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { getGeneralSettings, getPagesSettings } from "@/lib/data/settings";
import { getGalleryImages } from "@/lib/data/content";
import { getDict, href } from "@/lib/i18n";
import { t } from "@/lib/l10n";
import { resolveLang } from "@/lib/lang";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await resolveLang(params);
  return { title: getDict(lang).nav.gallery };
}

export default async function GalleryPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await resolveLang(params);
  const d = getDict(lang);
  const [pages, general, images] = await Promise.all([
    getPagesSettings(),
    getGeneralSettings(),
    getGalleryImages(),
  ]);

  return (
    <>
      <Marquee text={t(general.marquee, lang)} />
      <div className="mx-auto max-w-[1200px] px-5">
        <PageIntro title={t(pages.gallery.title, lang)} subtitle={t(pages.gallery.subtitle, lang)} narrow />
        <GalleryGrid items={images.map((g) => ({ src: g.image, alt: t(g.alt, lang) || "Kraftora" }))} />
        <div className="mb-[60px] mt-10">
          <CtaBox
            title={t(pages.gallery.ctaTitle, lang)}
            text={t(pages.gallery.ctaText, lang)}
            primary={{ label: d.contactUs, href: href(lang, "iletisim") }}
            secondary={{ label: d.viewProducts, href: href(lang, "urunler") }}
            layout="column"
          />
        </div>
      </div>
    </>
  );
}
