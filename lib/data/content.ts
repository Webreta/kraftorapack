import "server-only";
import { asc, desc, eq, or } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts, galleryImages, products } from "@/db/schema";
import type { Lang } from "@/lib/l10n";
import type { BlogPost, GalleryImage, Product } from "@/lib/content/types";

// ---------- Ürünler ----------

function toProduct(row: typeof products.$inferSelect): Product {
  return {
    id: row.id,
    slug: row.slug,
    slugEn: row.slugEn,
    title: row.title,
    cardText: row.cardText,
    listText: row.listText,
    intro: row.intro,
    images: row.images,
    sections: row.sections,
    quote: row.quote,
    showOnHome: row.showOnHome,
    sortOrder: row.sortOrder,
    published: row.published,
  };
}

export async function getPublishedProducts(): Promise<Product[]> {
  try {
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.published, true))
      .orderBy(asc(products.sortOrder), asc(products.id));
    return rows.map(toProduct);
  } catch (err) {
    console.warn("Ürünler okunamadı:", err);
    return [];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await db
    .select()
    .from(products)
    .orderBy(asc(products.sortOrder), asc(products.id));
  return rows.map(toProduct);
}

export async function getProductById(id: number): Promise<Product | null> {
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return rows[0] ? toProduct(rows[0]) : null;
}

// Verilen slug'ı iki dilde de arar; dil değiştirme bağlantıları diğer dilin
// slug'ıyla gelebilir, sayfa kendi canonical adresine yönlendirir.
export async function findProductBySlug(slug: string): Promise<Product | null> {
  const rows = await db
    .select()
    .from(products)
    .where(or(eq(products.slug, slug), eq(products.slugEn, slug)))
    .limit(1);
  return rows[0] ? toProduct(rows[0]) : null;
}

export const productSlug = (p: Pick<Product, "slug" | "slugEn">, lang: Lang) =>
  lang === "en" ? p.slugEn : p.slug;

// ---------- Blog ----------

function toPost(row: typeof blogPosts.$inferSelect): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    slugEn: row.slugEn,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    cover: row.cover,
    date: row.date,
    readMinutes: row.readMinutes,
    published: row.published,
  };
}

export async function getPublishedPosts(limit?: number): Promise<BlogPost[]> {
  try {
    const q = db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.date), desc(blogPosts.id));
    const rows = limit ? await q.limit(limit) : await q;
    return rows.map(toPost);
  } catch (err) {
    console.warn("Blog yazıları okunamadı:", err);
    return [];
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const rows = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.date), desc(blogPosts.id));
  return rows.map(toPost);
}

export async function getPostById(id: number): Promise<BlogPost | null> {
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return rows[0] ? toPost(rows[0]) : null;
}

export async function findPostBySlug(slug: string): Promise<BlogPost | null> {
  const rows = await db
    .select()
    .from(blogPosts)
    .where(or(eq(blogPosts.slug, slug), eq(blogPosts.slugEn, slug)))
    .limit(1);
  return rows[0] ? toPost(rows[0]) : null;
}

export const postSlug = (p: Pick<BlogPost, "slug" | "slugEn">, lang: Lang) =>
  lang === "en" ? p.slugEn : p.slug;

// ---------- Galeri ----------

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const rows = await db
      .select()
      .from(galleryImages)
      .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.id));
    return rows.map((r) => ({ id: r.id, image: r.image, alt: r.alt, sortOrder: r.sortOrder }));
  } catch (err) {
    console.warn("Galeri okunamadı:", err);
    return [];
  }
}
