import { requireSection } from "@/lib/auth/session";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  await requireSection("urunler");
  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-ink">Yeni Ürün</h1>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
