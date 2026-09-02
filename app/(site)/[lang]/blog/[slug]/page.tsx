import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { RichText } from "@/components/site/RichText";
import { Icon } from "@/components/site/Icon";
import { findPostBySlug, getPublishedPosts, postSlug } from "@/lib/data/content";
import { formatDate, getDict, href } from "@/lib/i18n";
import { t } from "@/lib/l10n";
import { resolveLang } from "@/lib/lang";

type Params = Promise<{ lang: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const post = await findPostBySlug(slug);
  if (!post) return {};
  return { title: t(post.title, lang), description: t(post.excerpt, lang) };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const lang = await resolveLang(params);
  const { slug } = await params;
  const post = await findPostBySlug(slug);
  if (!post || !post.published) notFound();

  const canonical = postSlug(post, lang);
  if (canonical !== slug) redirect(href(lang, "blog", canonical));

  const d = getDict(lang);
  const others = (await getPublishedPosts()).filter((p) => p.id !== post.id).slice(0, 4);
  const title = t(post.title, lang);

  return (
    <article>
      {/* Kapak: fotoğraf üstüne başlık */}
      <div
        className="relative flex min-h-[320px] items-end bg-[#333] bg-cover bg-center md:min-h-[380px]"
        style={post.cover ? { backgroundImage: `url("${post.cover}")` } : undefined}
      >
        <div className="post-hero-overlay absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[1240px] px-5 pb-10 pt-16 md:px-[60px]">
          <span className="inline-block rounded-full bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
            {d.nav.blog}
          </span>
          <h1 className="mt-4 max-w-[640px] text-[26px] font-bold leading-tight text-white md:text-[34px]">
            {title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] text-white/90">
            <span>{formatDate(post.date, lang)}</span>
            <span className="text-white/50">•</span>
            <span className="flex items-center gap-1">
              <Icon name="user" className="size-3.5" />
              admin
            </span>
            <span className="text-white/50">•</span>
            <span className="flex items-center gap-1">
              <Icon name="clock" className="size-3.5" />
              {post.readMinutes} {d.minRead}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-5 py-10 md:px-[60px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rounded-[14px] border border-line bg-white p-6 md:p-10">
            <RichText text={t(post.body, lang)} />
          </div>
          <aside className="space-y-6">
            {others.length > 0 && (
              <div className="rounded-[14px] border border-line bg-white p-5">
                <h4 className="border-b-2 border-ink pb-3 text-[14px] font-bold text-ink">{d.otherPosts}</h4>
                <ul className="mt-4 space-y-4">
                  {others.map((o) => (
                    <li key={o.id}>
                      <Link
                        href={href(lang, "blog", postSlug(o, lang))}
                        className="flex items-start gap-3 group"
                      >
                        <div className="size-12 shrink-0 overflow-hidden rounded-md bg-card">
                          {o.cover && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={o.cover} alt="" loading="lazy" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink group-hover:text-brand-700">
                            {t(o.title, lang)}
                          </p>
                          <p className="mt-1 text-[11px] text-[#888]">{formatDate(o.date, lang)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link
              href={href(lang, "blog")}
              className="flex items-center justify-center gap-1 rounded-[14px] border border-line bg-white px-5 py-4 text-[13px] font-semibold text-ink transition hover:border-ink"
            >
              <Icon name="chevron-right" className="size-3.5 rotate-180" />
              {d.nav.blog}
            </Link>
          </aside>
        </div>
      </div>
    </article>
  );
}
