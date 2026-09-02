"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { requireSection } from "@/lib/auth/session";
import { readL } from "@/lib/form";
import { IMAGE_EXTENSIONS, removeUploadedFile, saveUploadedFile } from "@/lib/uploads";
import type { ActionState } from "@/components/admin/Fields";

const DIR = "galeri";

function revalidate() {
  revalidatePath("/galeri");
  revalidatePath("/en/galeri");
  revalidatePath("/admin/galeri");
}

export async function addGalleryImages(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("galeri");
  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0 && !!f.name);
  if (files.length === 0) return { error: "En az bir görsel seçin." };
  const alt = readL(formData, "alt");

  const maxRow = await db
    .select({ max: sql<number>`coalesce(max(${galleryImages.sortOrder}), -1)` })
    .from(galleryImages);
  let order = (maxRow[0]?.max ?? -1) + 1;

  for (const file of files) {
    const up = await saveUploadedFile(file, DIR, IMAGE_EXTENSIONS);
    if (!up.ok) return { error: up.error };
    if (!up.publicPath) continue;
    await db.insert(galleryImages).values({ image: up.publicPath, alt, sortOrder: order++ });
  }
  revalidate();
  return { ok: true };
}

export async function deleteGalleryImage(formData: FormData) {
  await requireSection("galeri");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  const rows = await db.select().from(galleryImages).where(eq(galleryImages.id, id)).limit(1);
  if (!rows[0]) return;
  await removeUploadedFile(rows[0].image, DIR);
  await db.delete(galleryImages).where(eq(galleryImages.id, id));
  revalidate();
}

export async function reorderGallery(ids: number[]) {
  await requireSection("galeri");
  if (!Array.isArray(ids)) return;
  for (let i = 0; i < ids.length; i++) {
    const id = Number(ids[i]);
    if (!Number.isInteger(id)) continue;
    await db.update(galleryImages).set({ sortOrder: i }).where(eq(galleryImages.id, id));
  }
  revalidate();
}
