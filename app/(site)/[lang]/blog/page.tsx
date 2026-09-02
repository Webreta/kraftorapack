import type { Metadata } from "next";
import { Marquee } from "@/components/site/Marquee";
import { BlogCard } from "@/components/site/BlogCard";
import { getGeneralSettings, getPagesSettings } from "@/lib/data/settings";
import { getPublishedPosts, postSlug } from "@/lib/data/content";
import { formatDate, getDict, href } from "@/lib/i18n";
import { t } from "@/lib/l10n";
import { resolveLang } from "@/lib/lang";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await resolveLang(params);
  return { title: getDict(lang).nav.blog };
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await resolveLang(params);
  const d = getDict(lang);
  const [pages, general, posts] = await Promise.all([
    getPagesSettings(),
    getGeneralSettings(),
    getPublishedPosts(),
  ]);

  return (
    <>
      <Marquee text={t(general.marquee, lang)} />
      <div className="mx-auto max-w-[1240px] px-5 pb-16">
        <div className="mx-auto max-w-[820px] px-2 pb-10 pt-12 text-center">
          <h1 className="text-[30px] font-bold text-ink md:text-[34px]">{t(pages.blog.title, lang)}</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-body">{t(pages.blog.subtitle, lang)}</p>
        </div>
        {posts.length === 0 ? (
          <p className="py-10 text-center text-muted">{d.noPosts}</p>
        ) : (
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
        )}
      </div>
    </>
  );
}
