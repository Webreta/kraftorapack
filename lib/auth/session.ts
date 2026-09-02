import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";

const COOKIE_NAME = "session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 gün
const RENEW_THRESHOLD_MS = 15 * 24 * 60 * 60 * 1000; // 15 günden az kaldıysa uzat

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  permissions: string[];
};

// Panel sekmeleri; editör rolündeki kullanıcılar yalnızca izinli olduklarına girer
export const ADMIN_SECTIONS = [
  { key: "genel", label: "Ana Sayfa", route: "/admin" },
  { key: "hakkimizda", label: "Hakkımızda", route: "/admin/hakkimizda" },
  { key: "urunler", label: "Ürünler", route: "/admin/urunler" },
  { key: "galeri", label: "Galeri", route: "/admin/galeri" },
  { key: "blog", label: "Blog", route: "/admin/blog" },
  { key: "iletisim", label: "İletişim", route: "/admin/iletisim" },
  { key: "teknik", label: "Teknik", route: "/admin/teknik" },
] as const;

export type AdminSection = (typeof ADMIN_SECTIONS)[number]["key"];

// Süper admin: tüm yetkilere sahiptir ve hiçbir kullanıcı tarafından silinemez
export const SUPER_ADMIN_EMAIL = "webreta.digital@gmail.com";

export function canAccess(user: SessionUser, section: AdminSection) {
  return user.role === "admin" || user.permissions.includes(section);
}

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sessions).values({
    id: hashToken(token),
    userId,
    expiresAt,
  });
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  }
  jar.delete(COOKIE_NAME);
}

export async function destroyAllSessions(userId: string) {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

// Aynı render ağacında tekrar tekrar çağrılabilir — tek DB sorgusu atar.
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const rows = await db
    .select({
      sessionId: sessions.id,
      expiresAt: sessions.expiresAt,
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      permissions: users.permissions,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, hashToken(token)))
    .limit(1);

  const row = rows[0];
  if (!row) return null;
  if (row.expiresAt.getTime() < Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, row.sessionId));
    return null;
  }

  // Süresi yaklaşan oturumu sessizce uzat
  if (row.expiresAt.getTime() - Date.now() < RENEW_THRESHOLD_MS) {
    const newExpiry = new Date(Date.now() + SESSION_TTL_MS);
    await db
      .update(sessions)
      .set({ expiresAt: newExpiry })
      .where(eq(sessions.id, row.sessionId));
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    permissions: row.permissions ?? [],
  };
});

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/giris");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  return user;
}

// İlgili sekmeye erişim yetkisi ister; yoksa erişebildiği ilk sekmeye yönlendirir
export async function requireSection(
  section: AdminSection
): Promise<SessionUser> {
  const user = await requireUser();
  if (canAccess(user, section)) return user;
  const first = ADMIN_SECTIONS.find((s) => canAccess(user, s.key));
  redirect(first ? first.route : "/");
}
