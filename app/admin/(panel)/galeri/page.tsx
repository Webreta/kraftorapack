import { requireSection } from "@/lib/auth/session";
import { getGalleryImages } from "@/lib/data/content";
import { GalleryGridManager, GalleryUploadForm } from "@/components/admin/GalleryManager";

export default async function AdminGalleryPage() {
  await requireSection("galeri");
  const images = await getGalleryImages();

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-ink">Galeri</h1>
      <p className="mt-1 text-sm text-muted">
        Görseller sitede 3 sütunlu ızgarada gösterilir. Sürükleyerek sıralayabilirsiniz.
      </p>
      <div className="mt-6 space-y-8">
        <section>
          <h2 className="mb-3 text-lg font-bold text-ink">Görsel Yükle</h2>
          <GalleryUploadForm />
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-ink">Görseller ({images.length})</h2>
          <GalleryGridManager key={images.map((g) => g.id).join(",")} items={images} />
        </section>
      </div>
    </div>
  );
}
