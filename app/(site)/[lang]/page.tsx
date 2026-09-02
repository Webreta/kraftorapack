import Link from "next/link";
import { Marquee } from "@/components/site/Marquee";
import { CardIcon, Icon } from "@/components/site/Icon";
import { ProductCard } from "@/components/site/ProductCard";
import { BlogCard } from "@/components/site/BlogCard";
import { ServicesTabs } from "@/components/site/ServicesTabs";
import { Inline } from "@/components/site/RichText";
import { getGeneralSettings } from "@/lib/data/settings";
import { pickImage } from "@/lib/settings/genel";
import { getPublishedPosts, getPublishedProducts, postSlug, productSlug } from "@/lib/data/content";
import { formatDate, getDict, href } from "@/lib/i18n";
import { t } from "@/lib/l10n";
import { resolveLang } from "@/lib/lang";

// Başlıktaki vurgulanan ifadeyi yeşil renkte gösterir
function Highlighted({ title, highlight }: { title: string; highlight: string }) {
  const h = highlight.trim();
  const idx = h ? title.indexOf(h) : -1;
  if (idx < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, idx)}
      <span className="text-brand-500">{h}</span>
      {title.slice(idx + h.length)}
    </>
  );
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await resolveLang(params);
  const d = getDict(lang);
  const [general, products, posts] = await Promise.all([
    getGeneralSettings(),
    getPublishedProducts(),
    getPublishedPosts(3),
  ]);
  const homeProducts = products.filter((p) => p.showOnHome);
  const heroDesktop = pickImage(general.hero.desktop, lang);
  const heroMobile = pickImage(general.hero.mobile, lang);

  return (
    <>
      {/* Hero: masaüstünde geniş, mobilde kare banner; dile göre ayrı görsel */}
      <section>
        {heroDesktop && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroDesktop}
            alt={t(general.hero.alt, lang)}
            fetchPriority="high"
            className="hidden w-full md:block"
          />
        )}
        {heroMobile && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroMobile}
            alt={t(general.hero.alt, lang)}
            fetchPriority="high"
            className="w-full md:hidden"
          />
        )}
      </section>

      <Marquee text={t(general.marquee, lang)} />

      {/* Öne çıkan özellikler */}
      <section className="mx-auto max-w-[1200px] px-5 py-[60px]">
        <h2 className="mb-2 text-[26px] font-extrabold leading-tight text-ink md:text-[32px]">
          <Highlighted title={t(general.features.title, lang)} highlight={t(general.features.highlight, lang)} />
        </h2>
        <p className="mb-10 max-w-[600px] text-[16px] leading-relaxed text-soft">
          {t(general.features.text, lang)}
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {general.features.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl bg-card px-6 py-7">
              <CardIcon name={item.icon} className="size-14 shrink-0 text-brand-500" />
              <div>
                <h3 className="mb-1.5 text-[17px] font-bold leading-snug text-ink">{t(item.title, lang)}</h3>
                <p className="text-[14px] leading-relaxed text-soft">{t(item.text, lang)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ürünler */}
      <section className="bg-section py-[30px]">
        <div className="mx-auto max-w-[1240px] px-5">
          <div className="pb-8 pt-2 text-center">
            <h2 className="text-[30px] font-bold text-ink md:text-[34px]">
              {t(general.productsSection.title, lang)}
            </h2>
            <p className="mt-2 text-[16px] text-ink">{t(general.productsSection.text, lang)}</p>
          </div>
          <div className="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
            {homeProducts.map((p) => (
              <ProductCard
                key={p.id}
                href={href(lang, "urunler", productSlug(p, lang))}
                image={p.images[0] ?? null}
                title={t(p.title, lang)}
                text={t(p.cardText, lang)}
              />
            ))}
          </div>
          <div className="mt-8 text-right">
            <Link
              href={href(lang, "urunler")}
              className="inline-flex items-center gap-1 rounded-[10px] border-2 border-brand-600 px-[50px] py-2 text-[13.5px] font-bold text-brand-600 transition hover:bg-brand-600 hover:text-white"
            >
              {d.allProducts}
              <Icon name="chevron-right" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Hizmetler */}
      <section className="mx-auto max-w-[1200px] px-5 pb-[70px] pt-[40px] text-center">
        <h2 className="mb-3 text-[28px] font-extrabold leading-tight text-ink md:text-[34px]">
          {t(general.services.title, lang)}
        </h2>
        <p className="mx-auto mb-9 max-w-[680px] text-[16px] leading-relaxed text-muted">
          <Inline text={t(general.services.text, lang)} />
        </p>
        <ServicesTabs
          tabs={general.services.tabs.map((tab) => ({
            title: t(tab.title, lang),
            cards: tab.cards.map((c) => ({
              icon: c.icon,
              title: t(c.title, lang),
              text: t(c.text, lang),
            })),
          }))}
        />
      </section>

      {/* Blog */}
      {posts.length > 0 && (
        <section className="py-[30px]">
          <div className="mx-auto max-w-[1240px] px-5">
            <h2 className="mb-5 text-center text-[24px] font-semibold text-[#444]">
              {t(general.blogSection.title, lang)}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <BlogCard
                  key={p.id}
                  href={href(lang, "blog", postSlug(p, lang))}
                  image={p.cover}
                  title={t(p.title, lang)}
                  excerpt={t(p.excerpt, lang)}
                  date={formatDate(p.date, lang)}
                  readLabel={d.readPost}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
