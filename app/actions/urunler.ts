"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, ne, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireSection } from "@/lib/auth/session";
import { readBool, readL, readStr } from "@/lib/form";
import { slugify } from "@/lib/text";
import { IMAGE_EXTENSIONS, removeUploadedFile, saveUploadedFile } from "@/lib/uploads";
import type { ProductQuote, ProductSection } from "@/lib/content/types";

const DIR = "urunler";
const MAX_IMAGES = 3;

const lSchema = z.object({ tr: z.string().trim(), en: z.string().trim() });

const sectionSchema = z.object({
  title: lSchema,
  text: lSchema,
  image: z.string().nullable(),
});

const quoteSchema = z.object({
  title: lSchema,
  fields: z.array(z.object({ key: z.string().trim().min(1), label: lSchema })),
  options: z.array(z.object({ key: z.string().trim().min(1), label: lSchema })),
});

function revalidateProduct() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/urunler");
}

// Aynı slug başka üründe varsa sonuna sayı ekler
async function uniqueSlug(base: string, column: "slug" | "slugEn", excludeId?: number) {
  let slug = base || "urun";
  for (let n = 2; ; n++) {
    const col = column === "slug" ? products.slug : products.slugEn;
    const rows = await db
      .select({ id: products.id })
      .from(products)
      .where(excludeId ? and(eq(col, slug), ne(products.id, excludeId)) : eq(col, slug))
      .limit(1);
    if (rows.length === 0) return slug;
    slug = `${base}-${n}`;
  }
}

export type SaveProductState = { error?: string };

export async function saveProduct(_prev: SaveProductState, formData: FormData): Promise<SaveProductState> {
  await requireSection("urunler");

  const id = Number(formData.get("id")) || undefined;
  const title = readL(formData, "title");
  if (title.tr.length < 2) return { error: "Türkçe ürün adı gerekli." };
  if (!title.en) title.en = title.tr;

  let sectionsRaw: unknown;
  let quoteRaw: unknown;
  let keepImages: string[];
  try {
    sectionsRaw = JSON.parse(readStr(formData, "sections") || "[]");
    quoteRaw = JSON.parse(readStr(formData, "quote") || "{}");
    const raw = JSON.parse(readStr(formData, "keepImages") || "[]");
    keepImages = Array.isArray(raw) ? raw.filter((p) => typeof p === "string") : [];
  } catch {
    return { error: "Form verisi okunamadı." };
  }
  const sectionsParsed = z.array(sectionSchema).safeParse(sectionsRaw);
  const quoteParsed = quoteSchema.safeParse(quoteRaw);
  if (!sectionsParsed.success) return { error: "Bölümler okunamadı." };
  if (!quoteParsed.success) return { error: "Teklif formu alanları okunamadı (her alanın anahtarı dolu olmalı)." };

  const fields = {
    title,
    cardText: readL(formData, "cardText"),
    listText: readL(formData, "listText"),
    intro: readL(formData, "intro"),
    showOnHome: readBool(formData, "showOnHome"),
    published: readBool(formData, "published"),
  };

  // Mevcut kayıt (görselleri ve slug'ı için)
  const existing = id
    ? (await db.select().from(products).where(eq(products.id, id)).limit(1))[0]
    : undefined;
  if (id && !existing) return { error: "Ürün bulunamadı." };

  // Slug'lar: boşsa başlıktan üretilir
  const slugBase = slugify(readStr(formData, "slug") || title.tr);
  const slugEnBase = slugify(readStr(formData, "slugEn") || title.en || title.tr);
  const slug = await uniqueSlug(slugBase, "slug", id);
  const slugEn = await uniqueSlug(slugEnBase, "slugEn", id);

  // Ürün görselleri: tutulanlar + yeni yüklenenler (en fazla 3)
  const kept = (existing?.images ?? []).filter((p) => keepImages.includes(p));
  const newFiles = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0 && !!f.name);
  if (kept.length + newFiles.length > MAX_IMAGES) {
    return { error: `En fazla ${MAX_IMAGES} ürün görseli eklenebilir.` };
  }
  const uploaded: string[] = [];
  for (const file of newFiles) {
    const up = await saveUploadedFile(file, DIR, IMAGE_EXTENSIONS);
    if (!up.ok) return { error: up.error };
    if (up.publicPath) uploaded.push(up.publicPath);
  }
  for (const p of existing?.images ?? []) {
    if (!kept.includes(p)) await removeUploadedFile(p, DIR);
  }
  const images = [...kept, ...uploaded];

  // Bölüm görselleri: sectionImage.<i> dosyası geldiyse o kullanılır
  const sections: ProductSection[] = [];
  for (let i = 0; i < sectionsParsed.data.length; i++) {
    const s = sectionsParsed.data[i];
    let image = s.image;
    const up = await saveUploadedFile(formData.get(`sectionImage.${i}`), DIR, IMAGE_EXTENSIONS);
    if (!up.ok) return { error: up.error };
    if (up.publicPath) image = up.publicPath;
    sections.push({ title: s.title, text: s.text, image });
  }
  // Artık kullanılmayan yüklenmiş bölüm görsellerini sil (ürün görselleriyle ortak olanlar hariç)
  const stillUsed = new Set([...images, ...sections.map((s) => s.image).filter(Boolean)]);
  for (const s of existing?.sections ?? []) {
    if (s.image && !stillUsed.has(s.image)) await removeUploadedFile(s.image, DIR);
  }

  const quote: ProductQuote = quoteParsed.data;

  let savedId: number;
  if (existing) {
    await db
      .update(products)
      .set({ ...fields, slug, slugEn, images, sections, quote, updatedAt: new Date() })
      .where(eq(products.id, existing.id));
    savedId = existing.id;
  } else {
    const maxRow = await db
      .select({ max: sql<number>`coalesce(max(${products.sortOrder}), -1)` })
      .from(products);
    const inserted = await db
      .insert(products)
      .values({ ...fields, slug, slugEn, images, sections, quote, sortOrder: (maxRow[0]?.max ?? -1) + 1 })
      .returning({ id: products.id });
    savedId = inserted[0].id;
  }

  revalidateProduct();
  redirect(`/admin/urunler/${savedId}?kaydedildi=1`);
}

export async function deleteProduct(formData: FormData) {
  await requireSection("urunler");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  const row = rows[0];
  if (!row) return;
  for (const p of row.images) await removeUploadedFile(p, DIR);
  for (const s of row.sections) await removeUploadedFile(s.image, DIR);
  await db.delete(products).where(eq(products.id, id));
  revalidateProduct();
}

export async function toggleProductPublished(formData: FormData) {
  await requireSection("urunler");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  const rows = await db.select({ published: products.published }).from(products).where(eq(products.id, id)).limit(1);
  if (!rows[0]) return;
  await db.update(products).set({ published: !rows[0].published, updatedAt: new Date() }).where(eq(products.id, id));
  revalidateProduct();
}

export async function toggleProductHome(formData: FormData) {
  await requireSection("urunler");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  const rows = await db.select({ showOnHome: products.showOnHome }).from(products).where(eq(products.id, id)).limit(1);
  if (!rows[0]) return;
  await db.update(products).set({ showOnHome: !rows[0].showOnHome, updatedAt: new Date() }).where(eq(products.id, id));
  revalidateProduct();
}

// Sürükle-bırak sonrası yeni sıralamayı kaydeder
export async function reorderProducts(ids: number[]) {
  await requireSection("urunler");
  if (!Array.isArray(ids)) return;
  for (let i = 0; i < ids.length; i++) {
    const id = Number(ids[i]);
    if (!Number.isInteger(id)) continue;
    await db.update(products).set({ sortOrder: i, updatedAt: new Date() }).where(eq(products.id, id));
  }
  revalidateProduct();
}

// Kullanılmıyor ama drizzle `or` importunu tip için tutar
void or;
