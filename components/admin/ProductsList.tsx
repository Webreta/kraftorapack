"use client";

import Link from "next/link";
import { deleteProduct, reorderProducts, toggleProductHome, toggleProductPublished } from "@/app/actions/urunler";
import { SortableList } from "./SortableList";

export type ProductListItem = {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  published: boolean;
  showOnHome: boolean;
};

const btn =
  "whitespace-nowrap rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand-500 hover:text-brand-700";

export function ProductsList({ items }: { items: ProductListItem[] }) {
  return (
    <SortableList
      items={items}
      onReorder={reorderProducts}
      emptyText="Henüz ürün yok."
      render={(p) => (
        <>
          <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-line bg-card">
            {p.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{p.title}</p>
            <p className="truncate text-xs text-muted">/urunler/{p.slug}</p>
          </div>
          {p.published ? (
            <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">Yayında</span>
          ) : (
            <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-500">Taslak</span>
          )}
          {p.showOnHome && (
            <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">Ana sayfa</span>
          )}
          <div className="flex shrink-0 items-center gap-2">
            <Link href={`/admin/urunler/${p.id}`} className={btn}>
              Düzenle
            </Link>
            <form action={toggleProductHome}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" className={btn}>
                {p.showOnHome ? "Ana sayfadan kaldır" : "Ana sayfaya ekle"}
              </button>
            </form>
            <form action={toggleProductPublished}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" className={btn}>
                {p.published ? "Yayından kaldır" : "Yayınla"}
              </button>
            </form>
            <form
              action={deleteProduct}
              onSubmit={(e) => {
                if (!window.confirm(`"${p.title}" ürünü kalıcı olarak silinecek. Emin misiniz?`)) e.preventDefault();
              }}
            >
              <input type="hidden" name="id" value={p.id} />
              <button
                type="submit"
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                Sil
              </button>
            </form>
          </div>
        </>
      )}
    />
  );
}
