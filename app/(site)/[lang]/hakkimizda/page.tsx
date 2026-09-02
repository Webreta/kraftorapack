import type { Metadata } from "next";
import { Marquee } from "@/components/site/Marquee";
import { PageIntro } from "@/components/site/PageIntro";
import { CtaBox } from "@/components/site/CtaBox";
import { CardIcon } from "@/components/site/Icon";
import { getAboutSettings, getGeneralSettings } from "@/lib/data/settings";
import { getDict, href } from "@/lib/i18n";
import { t } from "@/lib/l10n";
import { resolveLang } from "@/lib/lang";
import type { AboutBlock } from "@/lib/settings/hakkimizda";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await resolveLang(params);
  return { title: getDict(lang).nav.about };
}

function Block({ block, lang, reverse }: { block: AboutBlock; lang: "tr" | "en"; reverse?: boolean }) {
  return (
    <div className="mb-[60px] grid items-center gap-8 md:mb-[70px] md:grid-cols-2 md:gap-[50px]">
      <div className={reverse ? "md:order-2" : ""}>
        {block.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={block.image}
            alt={t(block.title, lang)}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />
        )}
      </div>
      <div className={reverse ? "md:order-1" : ""}>
        <p className="mb-1.5 text-[14px] font-semibold uppercase tracking-[1px] text-brand-500">
          {t(block.eyebrow, lang)}
        </p>
        <h2 className="mb-4 text-[26px] font-extrabold leading-tight text-ink md:text-[30px]">
          {t(block.title, lang)}
        </h2>
        <p className="mb-3.5 text-[15px] leading-[1.7] text-muted">{t(block.text1, lang)}</p>
        {t(block.text2, lang) && (
          <p className="text-[15px] leading-[1.7] text-muted">{t(block.text2, lang)}</p>
        )}
      </div>
    </div>
  );
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await resolveLang(params);
  const d = getDict(lang);
  const [about, general] = await Promise.all([getAboutSettings(), getGeneralSettings()]);

  return (
    <>
      <Marquee text={t(general.marquee, lang)} />
      <div className="mx-auto max-w-[1200px] px-5">
        <PageIntro title={t(about.title, lang)} subtitle={t(about.subtitle, lang)} />

        <Block block={about.story} lang={lang} />
        <Block block={about.mission} lang={lang} reverse />

        <div className="mb-[60px] text-center md:mb-[70px]">
          <p className="mb-1.5 text-[14px] font-semibold uppercase tracking-[1px] text-brand-500">
            {t(about.why.eyebrow, lang)}
          </p>
          <h2 className="mb-3 text-[26px] font-extrabold leading-tight text-ink md:text-[30px]">
            {t(about.why.title, lang)}
          </h2>
          <p className="mx-auto mb-9 max-w-[560px] text-[15px] leading-relaxed text-muted">
            {t(about.why.text, lang)}
          </p>
          <div className="grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
            {about.why.cards.map((card, i) => (
              <div key={i} className="rounded-xl border border-brand-500/10 bg-card px-7 py-8">
                <CardIcon name={card.icon} className="mb-[18px] size-12 text-brand-500" />
                <h3 className="mb-2 text-[18px] font-bold leading-snug text-ink">{t(card.title, lang)}</h3>
                <p className="text-[14px] leading-[1.65] text-muted">{t(card.text, lang)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-[60px]">
          <CtaBox
            title={t(about.cta.title, lang)}
            text={t(about.cta.text, lang)}
            primary={{ label: d.viewProducts, href: href(lang, "urunler") }}
            secondary={{ label: d.contactUs, href: href(lang, "iletisim") }}
          />
        </div>
      </div>
    </>
  );
}
