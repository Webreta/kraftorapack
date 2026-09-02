import { notFound } from "next/navigation";
import { requireSection } from "@/lib/auth/session";
import { getPostById } from "@/lib/data/content";
import { BlogForm } from "@/components/admin/BlogForm";
import { SavedToast } from "@/components/admin/SavedToast";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kaydedildi?: string }>;
}) {
  await requireSection("blog");
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const saved = (await searchParams).kaydedildi === "1";
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div className="max-w-5xl">
      <SavedToast show={saved} clearQuery />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Yazıyı Düzenle</h1>
        <a
          href={`/blog/${post.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-brand-600 hover:underline"
        >
          Sitede görüntüle ↗
        </a>
      </div>
      <div className="mt-6">
        <BlogForm key={`${post.id}-${post.cover ?? ""}`} initial={post} />
      </div>
    </div>
  );
}
