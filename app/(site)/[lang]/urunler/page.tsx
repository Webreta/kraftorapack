import type { Metadata } from "next";
import { Marquee } from "@/components/site/Marquee";
import { PageIntro } from "@/components/site/PageIntro";
import { ProductCard } from "@/components/site/ProductCard";
import { getGeneralSettings, getPagesSettings } from "@/lib/data/settings";
import { getPublishedProducts, productSlug } from "@/lib/data/content";
import { getDict, href } from "@/lib/i18n";
import { t } from "@/lib/l10n";
import { resolveLang } from "@/lib/lang";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await resolveLang(params);
  return { title: getDict(lang).nav.products };
}

export default async function ProductsPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await resolveLang(params);
  const d = getDict(lang);
  const [pages, general, products] = await Promise.all([
    getPagesSettings(),
    getGeneralSettings(),
    getPublishedProducts(),
  ]);

  return (
    <>
      <div className="h-px w-full bg-[#76be43]" />
      <Marquee text={t(general.marquee, lang)} />
      <div className="mx-auto max-w-[1240px] px-5 pb-16">
        <PageIntro title={t(pages.products.title, lang)} subtitle={t(pages.products.subtitle, lang)} />
        <div className="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              href={href(lang, "urunler", productSlug(p, lang))}
              image={p.images[0] ?? null}
              title={t(p.title, lang)}
              text={t(p.listText, lang)}
              buttonLabel={d.viewProduct}
            />
          ))}
        </div>
      </div>
    </>
  );
}
