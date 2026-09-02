"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { requireSection } from "@/lib/auth/session";
import { readBool, readL, readStr } from "@/lib/form";
import { estimateReadMinutes, slugify } from "@/lib/text";
import { IMAGE_EXTENSIONS, removeUploadedFile, saveUploadedFile } from "@/lib/uploads";

const DIR = "blog";

function revalidate() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/blog");
}

async function uniqueSlug(base: string, column: "slug" | "slugEn", excludeId?: number) {
  let slug = base || "yazi";
  for (let n = 2; ; n++) {
    const col = column === "slug" ? blogPosts.slug : blogPosts.slugEn;
    const rows = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(excludeId ? and(eq(col, slug), ne(blogPosts.id, excludeId)) : eq(col, slug))
      .limit(1);
    if (rows.length === 0) return slug;
    slug = `${base}-${n}`;
  }
}

export type SavePostState = { error?: string };

export async function savePost(_prev: SavePostState, formData: FormData): Promise<SavePostState> {
  await requireSection("blog");

  const id = Number(formData.get("id")) || undefined;
  const title = readL(formData, "title");
  if (title.tr.length < 3) return { error: "Türkçe başlık gerekli." };
  if (!title.en) title.en = title.tr;
  const body = readL(formData, "body");
  if (body.tr.length < 20) return { error: "Türkçe içerik çok kısa." };
  const date = readStr(formData, "date");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Geçerli bir tarih seçin." };

  const existing = id ? (await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1))[0] : undefined;
  if (id && !existing) return { error: "Yazı bulunamadı." };

  const slug = await uniqueSlug(slugify(readStr(formData, "slug") || title.tr), "slug", id);
  const slugEn = await uniqueSlug(slugify(readStr(formData, "slugEn") || title.en), "slugEn", id);

  let cover = existing?.cover ?? null;
  const up = await saveUploadedFile(formData.get("cover"), DIR, IMAGE_EXTENSIONS);
  if (!up.ok) return { error: up.error };
  if (up.publicPath) {
    await removeUploadedFile(cover, DIR);
    cover = up.publicPath;
  } else if (readBool(formData, "coverRemove")) {
    await removeUploadedFile(cover, DIR);
    cover = null;
  }

  const readRaw = Number(formData.get("readMinutes"));
  const readMinutes = Number.isInteger(readRaw) && readRaw > 0 ? readRaw : estimateReadMinutes(body.tr);

  const values = {
    title,
    slug,
    slugEn,
    excerpt: readL(formData, "excerpt"),
    body,
    cover,
    date,
    readMinutes,
    published: readBool(formData, "published"),
  };

  let savedId: number;
  if (existing) {
    await db.update(blogPosts).set({ ...values, updatedAt: new Date() }).where(eq(blogPosts.id, existing.id));
    savedId = existing.id;
  } else {
    const inserted = await db.insert(blogPosts).values(values).returning({ id: blogPosts.id });
    savedId = inserted[0].id;
  }
  revalidate();
  redirect(`/admin/blog/${savedId}?kaydedildi=1`);
}

export async function deletePost(formData: FormData) {
  await requireSection("blog");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  const rows = await db.select({ cover: blogPosts.cover }).from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  await removeUploadedFile(rows[0]?.cover, DIR);
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  revalidate();
}

export async function togglePostPublished(formData: FormData) {
  await requireSection("blog");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  const rows = await db.select({ published: blogPosts.published }).from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  if (!rows[0]) return;
  await db.update(blogPosts).set({ published: !rows[0].published, updatedAt: new Date() }).where(eq(blogPosts.id, id));
  revalidate();
}
