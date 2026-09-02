import { requireSection } from "@/lib/auth/session";
import { BlogForm } from "@/components/admin/BlogForm";

export default async function NewPostPage() {
  await requireSection("blog");
  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-ink">Yeni Yazı</h1>
      <div className="mt-6">
        <BlogForm />
      </div>
    </div>
  );
}
