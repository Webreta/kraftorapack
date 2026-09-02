import Link from "next/link";
import { requireSection } from "@/lib/auth/session";
import { getAllProducts } from "@/lib/data/content";
import { ProductsList } from "@/components/admin/ProductsList";
import { SavedToast } from "@/components/admin/SavedToast";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ kaydedildi?: string }>;
}) {
  await requireSection("urunler");
  const saved = (await searchParams).kaydedildi === "1";
  const rows = await getAllProducts();
  const items = rows.map((p) => ({
    id: p.id,
    title: p.title.tr || p.title.en,
    slug: p.slug,
    image: p.images[0] ?? null,
    published: p.published,
    showOnHome: p.showOnHome,
  }));

  return (
    <div className="max-w-5xl">
      <SavedToast show={saved} clearQuery />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-ink">Ürünler</h1>
        <Link
          href="/admin/urunler/yeni"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          + Yeni Ürün
        </Link>
      </div>
      <p className="mt-1 text-sm text-muted">Sürükleyerek sıralayın; sıra ana sayfada ve ürünler sayfasında geçerlidir.</p>
      <div className="mt-6">
        <ProductsList key={JSON.stringify(items)} items={items} />
      </div>
    </div>
  );
}
