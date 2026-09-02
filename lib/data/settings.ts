import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { defaultGeneralSettings, type GeneralSettings } from "@/lib/settings/genel";
import { defaultAboutSettings, type AboutSettings } from "@/lib/settings/hakkimizda";
import { defaultContactSettings, type ContactSettings } from "@/lib/settings/iletisim";
import { defaultPagesSettings, type PagesSettings } from "@/lib/settings/sayfalar";
import { defaultTechnicalSettings, type TechnicalSettings } from "@/lib/settings/teknik";
import { defaultLegalSettings, type LegalSettings } from "@/lib/settings/yasal";

// Kayıtlı değerle varsayılanı bölüm bazında birleştirir: eski kayıtlarda
// eksik bölüm varsa varsayılan kullanılır, diziler kayıtlı haliyle alınır.
function merge<T extends object>(defaults: T, stored: Partial<T> | undefined): T {
  if (!stored) return defaults;
  const out = { ...defaults } as Record<string, unknown>;
  for (const [k, v] of Object.entries(stored)) {
    const d = (defaults as Record<string, unknown>)[k];
    if (
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      d &&
      typeof d === "object" &&
      !Array.isArray(d)
    ) {
      out[k] = merge(d as object, v as object);
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out as T;
}

async function readSetting<T extends object>(key: string, defaults: T): Promise<T> {
  let rows;
  try {
    rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);
  } catch (err) {
    // Build sırasında (statik sayfa üretimi) veritabanına erişilemeyebilir;
    // varsayılanlarla devam edilir, çalışma anında gerçek değerler okunur.
    console.warn(`Ayar okunamadı (${key}), varsayılanlar kullanılıyor:`, err);
    return defaults;
  }
  if (!rows[0]) return defaults;
  return merge(defaults, rows[0].value as Partial<T>);
}

export async function saveSetting(key: string, value: object) {
  await db
    .insert(siteSettings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value, updatedAt: new Date() },
    });
}

export const getGeneralSettings = () =>
  readSetting<GeneralSettings>("genel", defaultGeneralSettings);
export const getAboutSettings = () =>
  readSetting<AboutSettings>("hakkimizda", defaultAboutSettings);
export const getContactSettings = () =>
  readSetting<ContactSettings>("iletisim", defaultContactSettings);
export const getPagesSettings = () =>
  readSetting<PagesSettings>("sayfalar", defaultPagesSettings);
export const getTechnicalSettings = () =>
  readSetting<TechnicalSettings>("teknik", defaultTechnicalSettings);
export const getLegalSettings = () =>
  readSetting<LegalSettings>("yasal", defaultLegalSettings);
