import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Marquee } from "@/components/site/Marquee";
import { QuoteModal } from "@/components/site/QuoteModal";
import { getGeneralSettings } from "@/lib/data/settings";
import { findProductBySlug, productSlug } from "@/lib/data/content";
import { getDict, href } from "@/lib/i18n";
import { t } from "@/lib/l10n";
import { resolveLang } from "@/lib/lang";

type Params = Promise<{ lang: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const product = await findProductBySlug(slug);
  if (!product) return {};
  return { title: t(product.title, lang), description: t(product.intro, lang) };
}

export default async function ProductPage({ params }: { params: Params }) {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const product = await findProductBySlug(slug);
  if (!product || !product.published) notFound();

  // Dil değiştirme bağlantısı diğer dilin slug'ıyla gelmiş olabilir → canonical adrese yönlendir
  const canonical = productSlug(product, lang);
  if (canonical !== slug) redirect(href(lang, "urunler", canonical));

  const d = getDict(lang);
  const general = await getGeneralSettings();
  const title = t(product.title, lang);
  const hero = product.images[0] ?? null;
  const thumbs = product.images.slice(0, 3);
  const quoteTitle = t(product.quote.title, lang) || `${title} - ${d.form.inquiry}`;

  return (
    <>
      <div className="h-px w-full bg-[#036e3c]" />
      <section className="mx-auto max-w-[1240px] px-5 pb-12 pt-10">
        <div className="grid gap-8 md:grid-cols-12 md:gap-[30px]">
          <div className="md:col-span-5">
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[12px] bg-white p-6 shadow-box-2">
              {hero && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={hero} alt={title} className="h-full w-full object-contain" fetchPriority="high" />
              )}
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="grid grid-cols-3 gap-[15px] sm:grid-cols-4">
              {thumbs.map((img, i) => (
                <div
                  key={i}
                  className="product-media aspect-square overflow-hidden rounded-[10%] shadow-box-2 transition hover:shadow-box-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${title} ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <h1 className="mt-8 text-[26px] font-bold leading-tight text-ink md:text-[30px]">{title}</h1>
            <p className="mt-3 text-[16px] leading-[1.6] text-body">{t(product.intro, lang)}</p>
            <div className="mt-5">
              <QuoteModal
                lang={lang}
                form={d.form}
                buttonLabel={d.sendQuote}
                quote={{
                  product: title,
                  title: quoteTitle,
                  fields: product.quote.fields.map((f) => ({ key: f.key, label: t(f.label, lang) })),
                  options: product.quote.options.map((o) => ({ key: o.key, label: t(o.label, lang) })),
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <Marquee text={t(general.marquee, lang)} />

      {product.sections.length > 0 && (
        <section className="mx-auto max-w-[1240px] px-5 py-12">
          {product.sections.map((s, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={i}
                className="mb-10 grid items-center gap-6 last:mb-0 md:grid-cols-12 md:gap-[30px]"
              >
                <div className={`md:col-span-5 ${reverse ? "md:order-2" : ""}`}>
                  <div className="overflow-hidden rounded-[12px] bg-white shadow-box-1">
                    <div className="product-media aspect-[4/3]">
                      {s.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={s.image}
                          alt={t(s.title, lang)}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className={`md:col-span-7 ${reverse ? "md:order-1 md:text-right" : ""}`}>
                  <h3 className="mb-3 text-[22px] font-bold leading-snug text-brand-700">{t(s.title, lang)}</h3>
                  <p className="text-[15px] leading-[1.7] text-body">{t(s.text, lang)}</p>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </>
  );
}
