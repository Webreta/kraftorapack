"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { hash } from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireAdmin, destroyAllSessions, ADMIN_SECTIONS, SUPER_ADMIN_EMAIL } from "@/lib/auth/session";

const sectionKeys = ADMIN_SECTIONS.map((s) => s.key);

const createSchema = z
  .object({
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Kullanıcı adı en az 3 karakter olmalı")
      .regex(/^[a-z0-9@._-]+$/, "Kullanıcı adı boşluk ve Türkçe karakter içermemeli"),
    name: z.string().trim().min(2, "Ad gerekli"),
    password: z.string().min(4, "Şifre en az 4 karakter olmalı"),
    role: z.enum(["admin", "editor"]),
    permissions: z
      .array(z.string())
      .transform((arr) => arr.filter((p) => sectionKeys.includes(p as (typeof sectionKeys)[number]))),
  })
  .refine((v) => v.role === "admin" || v.permissions.length > 0, {
    message: "Editör için en az bir sekme yetkisi seçin",
    path: ["permissions"],
  });

export type UserState = { ok?: boolean; error?: string };

export async function createUser(_prev: UserState, formData: FormData): Promise<UserState> {
  await requireAdmin();
  const parsed = createSchema.safeParse({
    username: formData.get("username"),
    name: formData.get("name"),
    password: formData.get("password"),
    role: formData.get("role"),
    permissions: formData.getAll("permissions").map(String),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formu kontrol edin." };
  const { username, name, password, role, permissions } = parsed.data;

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, username)).limit(1);
  if (existing.length > 0) return { error: "Bu kullanıcı adı zaten kullanımda." };

  const passwordHash = await hash(password, 12);
  await db.insert(users).values({
    email: username,
    name,
    passwordHash,
    role,
    // Admin her sekmeye erişir; izin listesi yalnızca editörler için anlamlı
    permissions: role === "admin" ? [] : permissions,
  });
  revalidatePath("/admin/teknik");
  return { ok: true };
}

export async function deleteUser(formData: FormData) {
  const current = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id || id === current.id) return;
  // Süper admin hiçbir koşulda silinemez
  const target = await db.select({ email: users.email }).from(users).where(eq(users.id, id)).limit(1);
  if (!target[0] || target[0].email === SUPER_ADMIN_EMAIL) return;
  await destroyAllSessions(id);
  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/admin/teknik");
}
