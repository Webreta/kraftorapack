import { notFound } from "next/navigation";
import { requireSection } from "@/lib/auth/session";
import { getProductById } from "@/lib/data/content";
import { ProductForm } from "@/components/admin/ProductForm";
import { SavedToast } from "@/components/admin/SavedToast";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kaydedildi?: string }>;
}) {
  await requireSection("urunler");
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const saved = (await searchParams).kaydedildi === "1";
  const item = await getProductById(id);
  if (!item) notFound();

  return (
    <div className="max-w-5xl">
      <SavedToast show={saved} clearQuery />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Ürünü Düzenle</h1>
        <a
          href={`/urunler/${item.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-brand-600 hover:underline"
        >
          Sitede görüntüle ↗
        </a>
      </div>
      <div className="mt-6">
        <ProductForm key={item.id} initial={item} />
      </div>
    </div>
  );
}
