"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { isLang } from "@/lib/l10n";

export type FormState = { ok?: boolean; error?: string };

const ERR = {
  tr: {
    name: "Adınızı yazın",
    email: "Geçerli bir e-posta girin",
    message: "Mesajınız çok kısa",
    phone: "Telefon numaranızı yazın",
    generic: "Formu kontrol edin.",
    rate: "Çok fazla gönderim yaptınız. Lütfen daha sonra deneyin.",
  },
  en: {
    name: "Please enter your name",
    email: "Enter a valid e-mail address",
    message: "Your message is too short",
    phone: "Please enter your phone number",
    generic: "Please check the form.",
    rate: "Too many submissions. Please try again later.",
  },
};

async function clientIp() {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

// ---------- İletişim formu ----------

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  // Bot tuzağı: gizli alan doluysa sessizce başarılı gibi davran
  if (formData.get("website")) return { ok: true };

  const langRaw = String(formData.get("lang") ?? "tr");
  const lang = isLang(langRaw) ? langRaw : "tr";
  const e = ERR[lang];

  const schema = z.object({
    name: z.string().trim().min(2, e.name).max(120),
    lastName: z.string().trim().max(120).optional(),
    email: z.string().trim().toLowerCase().email(e.email),
    phone: z.string().trim().min(5, e.phone).max(40),
    message: z.string().trim().min(10, e.message).max(4000),
  });

  const parsed = schema.safeParse({
    name: formData.get("name"),
    lastName: formData.get("lastName") || undefined,
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? e.generic };
  }

  if (!checkRateLimit(`contact:${await clientIp()}`)) {
    return { error: e.rate };
  }

  const { name, lastName, email, phone, message } = parsed.data;
  const fullName = [name, lastName].filter(Boolean).join(" ");
  await db.insert(submissions).values({
    kind: "contact",
    name: fullName,
    email,
    phone,
    message,
    lang,
  });

  // E-posta bildirimi (SMTP ayarlıysa); hata mesaj kaydını engellemesin
  try {
    const { sendNotification } = await import("@/lib/mailer");
    await sendNotification({
      subject: `İletişim formu: ${fullName}`,
      replyTo: email,
      lines: [`Ad Soyad: ${fullName}`, `E-posta: ${email}`, `Telefon: ${phone}`, `Dil: ${lang}`, "", message],
    });
  } catch (err) {
    console.error("İletişim e-postası gönderilemedi:", err);
  }

  return { ok: true };
}

// ---------- Ürün teklif formu ----------

export async function submitQuote(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("website")) return { ok: true };

  const langRaw = String(formData.get("lang") ?? "tr");
  const lang = isLang(langRaw) ? langRaw : "tr";
  const e = ERR[lang];

  const schema = z.object({
    product: z.string().trim().min(1).max(200),
    name: z.string().trim().min(2, e.name).max(120),
    email: z.string().trim().toLowerCase().email(e.email),
    phone: z.string().trim().min(5, e.phone).max(40),
    company: z.string().trim().max(200).optional(),
    notes: z.string().trim().max(4000).optional(),
  });

  const parsed = schema.safeParse({
    product: formData.get("product"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company") || undefined,
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? e.generic };
  }

  if (!checkRateLimit(`quote:${await clientIp()}`)) {
    return { error: e.rate };
  }

  // Sabit alanlar dışındaki her şey (ölçüler, malzeme, seçenekler...) meta'ya yazılır.
  // Alan etiketleri panelde okunabilir olsun diye "label:<ad>" girdileriyle gelir.
  const skip = new Set(["product", "name", "email", "phone", "company", "notes", "lang", "website"]);
  const meta: Record<string, string> = { product: parsed.data.product };
  const labels: Record<string, string> = { product: lang === "tr" ? "Ürün" : "Product" };
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") continue;
    if (key.startsWith("label:")) {
      labels[key.slice(6)] = value;
      continue;
    }
    if (skip.has(key) || !value.trim()) continue;
    const prev = meta[key];
    meta[key] = prev ? `${prev}, ${value.trim()}` : value.trim();
  }
  // Etiketli anahtarları okunabilir ada çevir
  const readable: Record<string, string> = {};
  for (const [k, v] of Object.entries(meta)) {
    readable[labels[k] ?? k] = v.slice(0, 500);
  }
  if (parsed.data.company) readable[lang === "tr" ? "Firma" : "Company"] = parsed.data.company;

  await db.insert(submissions).values({
    kind: "quote",
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    message: parsed.data.notes ?? "",
    meta: readable,
    lang,
  });

  try {
    const { sendNotification } = await import("@/lib/mailer");
    await sendNotification({
      subject: `Teklif talebi: ${parsed.data.product} — ${parsed.data.name}`,
      replyTo: parsed.data.email,
      lines: [
        `Ad Soyad: ${parsed.data.name}`,
        `E-posta: ${parsed.data.email}`,
        `Telefon: ${parsed.data.phone}`,
        `Dil: ${lang}`,
        "",
        ...Object.entries(readable).map(([k, v]) => `${k}: ${v}`),
        "",
        parsed.data.notes ?? "",
      ],
    });
  } catch (err) {
    console.error("Teklif e-postası gönderilemedi:", err);
  }

  return { ok: true };
}
