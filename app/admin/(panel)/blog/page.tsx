import Link from "next/link";
import { requireSection } from "@/lib/auth/session";
import { getAllPosts } from "@/lib/data/content";
import { deletePost, togglePostPublished } from "@/app/actions/blog";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { SavedToast } from "@/components/admin/SavedToast";

const btn =
  "whitespace-nowrap rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand-500 hover:text-brand-700";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ kaydedildi?: string }>;
}) {
  await requireSection("blog");
  const saved = (await searchParams).kaydedildi === "1";
  const posts = await getAllPosts();

  return (
    <div className="max-w-5xl">
      <SavedToast show={saved} clearQuery />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-ink">Blog</h1>
        <Link
          href="/admin/blog/yeni"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          + Yeni Yazı
        </Link>
      </div>
      <div className="mt-6 space-y-2">
        {posts.length === 0 && (
          <p className="rounded-2xl border border-line bg-white p-6 text-center text-sm text-muted">Henüz yazı yok.</p>
        )}
        {posts.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white px-3 py-2.5">
            <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-line bg-card">
              {p.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{p.title.tr || p.title.en}</p>
              <p className="truncate text-xs text-muted">
                {p.date} · /blog/{p.slug}
              </p>
            </div>
            {p.published ? (
              <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">Yayında</span>
            ) : (
              <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-500">Taslak</span>
            )}
            <div className="flex shrink-0 items-center gap-2">
              <Link href={`/admin/blog/${p.id}`} className={btn}>
                Düzenle
              </Link>
              <form action={togglePostPublished}>
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" className={btn}>
                  {p.published ? "Yayından kaldır" : "Yayınla"}
                </button>
              </form>
              <form action={deletePost}>
                <input type="hidden" name="id" value={p.id} />
                <ConfirmSubmit
                  label="Sil"
                  message={`"${p.title.tr}" yazısı kalıcı olarak silinecek. Emin misiniz?`}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                />
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
