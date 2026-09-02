"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSection } from "@/lib/auth/session";
import { getTechnicalSettings, saveSetting } from "@/lib/data/settings";
import { readL } from "@/lib/form";
import { removeUploadedFile, saveUploadedFile } from "@/lib/uploads";
import { sendTestMail } from "@/lib/mailer";
import type { ActionState } from "@/components/admin/Fields";

const KEY = "teknik";

function revalidateTechnical() {
  // headCode/favicon/SEO kök layout'ta kullanılıyor: tüm site etkilenir
  revalidatePath("/", "layout");
  revalidatePath("/admin/teknik");
}

export async function saveHeadCode(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("teknik");
  const headCode = String(formData.get("headCode") ?? "").trim();
  const current = await getTechnicalSettings();
  await saveSetting(KEY, { ...current, headCode });
  revalidateTechnical();
  return { ok: true };
}

const smtpSchema = z.object({
  host: z.string().trim(),
  port: z.coerce.number().int().min(1).max(65535),
  user: z.string().trim(),
  pass: z.string(),
  from: z.string().trim(),
  mailTo: z.string().trim(),
});

export async function saveSmtp(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("teknik");
  const parsed = smtpSchema.safeParse({
    host: formData.get("host") ?? "",
    port: formData.get("port") || 587,
    user: formData.get("user") ?? "",
    pass: formData.get("pass") ?? "",
    from: formData.get("from") ?? "",
    mailTo: formData.get("mailTo") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formu kontrol edin." };
  const { mailTo, ...smtp } = parsed.data;
  const current = await getTechnicalSettings();
  // Şifre boş bırakıldıysa mevcut şifre korunur
  const pass = smtp.pass === "" ? current.smtp.pass : smtp.pass;
  await saveSetting(KEY, { ...current, smtp: { ...smtp, pass }, mailTo });
  revalidateTechnical();
  return { ok: true };
}

export async function sendSmtpTest(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("teknik");
  const parsed = z.string().trim().email("Geçerli bir e-posta adresi girin").safeParse(formData.get("to") ?? "");
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Adresi kontrol edin." };
  try {
    await sendTestMail(parsed.data);
    return { ok: true };
  } catch (err) {
    const detail = err instanceof Error ? err.message : "bilinmeyen hata";
    return { error: `Gönderim başarısız: ${detail}` };
  }
}

const FAVICON_EXTENSIONS = new Set(["ico", "png", "svg"]);

export async function saveFavicon(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("teknik");
  const upload = await saveUploadedFile(formData.get("favicon"), "teknik", FAVICON_EXTENSIONS);
  if (!upload.ok) return { error: upload.error };
  const removeFavicon = formData.get("removeFavicon") === "on";
  const current = await getTechnicalSettings();
  let favicon = current.favicon;
  if (upload.publicPath) {
    await removeUploadedFile(favicon, "teknik");
    favicon = upload.publicPath;
  } else if (removeFavicon) {
    await removeUploadedFile(favicon, "teknik");
    favicon = null;
  } else {
    return { error: "Favicon dosyası seçin (.ico, .png veya .svg)." };
  }
  await saveSetting(KEY, { ...current, favicon });
  revalidateTechnical();
  return { ok: true };
}

export async function saveSeo(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("teknik");
  const title = readL(formData, "title");
  const description = readL(formData, "description");
  if (title.tr.length < 3) return { error: "Türkçe site başlığı gerekli." };
  if (description.tr.length < 10) return { error: "Türkçe açıklama en az 10 karakter olmalı." };
  const current = await getTechnicalSettings();
  await saveSetting(KEY, { ...current, seo: { title, description } });
  revalidateTechnical();
  return { ok: true };
}

export async function saveIndexing(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("teknik");
  const noindex = formData.get("noindex") === "on";
  const current = await getTechnicalSettings();
  await saveSetting(KEY, { ...current, noindex });
  revalidateTechnical();
  revalidatePath("/robots.txt");
  return { ok: true };
}

const sitemapSchema = z.array(
  z.string().trim().regex(/^\/[^\s]*$/, "Yollar / ile başlamalı ve boşluk içermemeli")
);

export async function saveSitemap(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("teknik");
  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("paths") ?? "[]"));
  } catch {
    return { error: "Sitemap listesi okunamadı." };
  }
  const parsed = sitemapSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Listeyi kontrol edin." };
  const current = await getTechnicalSettings();
  await saveSetting(KEY, { ...current, sitemap: [...new Set(parsed.data)] });
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/teknik");
  return { ok: true };
}
