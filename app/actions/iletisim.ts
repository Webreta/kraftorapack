"use server";

import { revalidatePath } from "next/cache";
import { eq, not } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { requireSection } from "@/lib/auth/session";
import { getContactSettings, saveSetting } from "@/lib/data/settings";
import { readL, readStr } from "@/lib/form";
import type { ActionState } from "@/components/admin/Fields";

function revalidate() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/iletisim");
}

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || v === "#" || /^https?:\/\//.test(v), "Bağlantı https:// ile başlamalı");

export async function saveContactSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("iletisim");
  const schema = z.object({
    email: z.string().trim().email("Geçerli bir e-posta girin"),
    phone: z.string().trim().min(5, "Telefon gerekli"),
    phoneHref: z.string().trim().regex(/^\+?[0-9]{7,15}$/, "tel: bağlantısı yalnızca rakamlardan oluşmalı (+905...)"),
    mapEmbed: z.string().trim(),
    facebook: optionalUrl,
    instagram: optionalUrl,
    x: optionalUrl,
    linkedin: optionalUrl,
  });
  const parsed = schema.safeParse({
    email: readStr(formData, "email"),
    phone: readStr(formData, "phone"),
    phoneHref: readStr(formData, "phoneHref"),
    mapEmbed: readStr(formData, "mapEmbed"),
    facebook: readStr(formData, "facebook"),
    instagram: readStr(formData, "instagram"),
    x: readStr(formData, "x"),
    linkedin: readStr(formData, "linkedin"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formu kontrol edin." };

  const current = await getContactSettings();
  const { facebook, instagram, x, linkedin, ...rest } = parsed.data;
  await saveSetting("iletisim", {
    ...current,
    ...rest,
    address: readL(formData, "address"),
    hours: readL(formData, "hours"),
    replyNote: readL(formData, "replyNote"),
    location: readL(formData, "location"),
    social: { facebook, instagram, x, linkedin },
  });
  revalidate();
  return { ok: true };
}

export async function saveContactPage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("iletisim");
  const current = await getContactSettings();
  const keys = Object.keys(current.page) as (keyof typeof current.page)[];
  const page = Object.fromEntries(keys.map((k) => [k, readL(formData, k)])) as typeof current.page;
  await saveSetting("iletisim", { ...current, page });
  revalidate();
  return { ok: true };
}

// ---------- Gelen mesajlar ----------

export async function toggleRead(formData: FormData) {
  await requireSection("iletisim");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await db.update(submissions).set({ read: not(submissions.read) }).where(eq(submissions.id, id));
  revalidatePath("/admin/iletisim");
}

export async function deleteSubmission(formData: FormData) {
  await requireSection("iletisim");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await db.delete(submissions).where(eq(submissions.id, id));
  revalidatePath("/admin/iletisim");
}
