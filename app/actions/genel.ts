"use server";

import { revalidatePath } from "next/cache";
import { requireSection } from "@/lib/auth/session";
import { getGeneralSettings, getLegalSettings, getPagesSettings, saveSetting } from "@/lib/data/settings";
import { readBool, readL } from "@/lib/form";
import { IMAGE_EXTENSIONS, removeUploadedFile, saveUploadedFile } from "@/lib/uploads";
import type { ActionState } from "@/components/admin/Fields";
import type { IconCard } from "@/lib/content/types";
import type { CardIconName } from "@/components/site/Icon";
import type { LegalSlug } from "@/lib/settings/yasal";

const DIR = "genel";

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

function readCard(formData: FormData, prefix: string): IconCard {
  return {
    icon: String(formData.get(`${prefix}.icon`) ?? "check-circle") as CardIconName,
    title: readL(formData, `${prefix}.title`),
    text: readL(formData, `${prefix}.text`),
  };
}

// ---------- Hero + şerit ----------

export async function saveHero(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("genel");
  const current = await getGeneralSettings();
  const hero = {
    desktop: { ...current.hero.desktop },
    mobile: { ...current.hero.mobile },
    alt: readL(formData, "alt"),
  };

  // Dört görsel: masaüstü/mobil × TR/EN. Alan adları: desktop.tr, mobile.en ...
  for (const key of ["desktop", "mobile"] as const) {
    for (const lang of ["tr", "en"] as const) {
      const field = `${key}.${lang}`;
      const upload = await saveUploadedFile(formData.get(field), DIR, IMAGE_EXTENSIONS);
      if (!upload.ok) return { error: upload.error };
      const other = hero[key][lang === "tr" ? "en" : "tr"];
      if (upload.publicPath) {
        // Aynı dosya diğer dilde de kullanılıyorsa silme
        if (hero[key][lang] !== other) await removeUploadedFile(hero[key][lang], DIR);
        hero[key][lang] = upload.publicPath;
      } else if (readBool(formData, `${field}Remove`)) {
        if (hero[key][lang] !== other) await removeUploadedFile(hero[key][lang], DIR);
        hero[key][lang] = null;
      }
    }
  }

  const marquee = readL(formData, "marquee");
  await saveSetting("genel", { ...current, hero, marquee });
  revalidateAll();
  return { ok: true };
}

// ---------- Öne çıkan özellikler ----------

export async function saveFeatures(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("genel");
  const current = await getGeneralSettings();
  const title = readL(formData, "title");
  if (!title.tr) return { error: "Türkçe başlık gerekli." };
  const items = current.features.items.map((_, i) => readCard(formData, `items.${i}`));
  await saveSetting("genel", {
    ...current,
    features: {
      title,
      highlight: readL(formData, "highlight"),
      text: readL(formData, "text"),
      items,
    },
  });
  revalidateAll();
  return { ok: true };
}

// ---------- Ürünler bölümü + blog başlığı + footer ----------

export async function saveSectionTexts(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("genel");
  const current = await getGeneralSettings();
  await saveSetting("genel", {
    ...current,
    productsSection: { title: readL(formData, "productsTitle"), text: readL(formData, "productsText") },
    blogSection: { title: readL(formData, "blogTitle") },
    footer: { tagline: readL(formData, "tagline"), sustainability: readL(formData, "sustainability") },
  });
  revalidateAll();
  return { ok: true };
}

// ---------- Hizmet sekmeleri ----------

export async function saveServices(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("genel");
  const current = await getGeneralSettings();
  const tabs = current.services.tabs.map((tab, ti) => ({
    title: readL(formData, `tabs.${ti}.title`),
    cards: tab.cards.map((_, ci) => readCard(formData, `tabs.${ti}.cards.${ci}`)),
  }));
  await saveSetting("genel", {
    ...current,
    services: { title: readL(formData, "title"), text: readL(formData, "text"), tabs },
  });
  revalidateAll();
  return { ok: true };
}

// ---------- Sayfa başlıkları (Ürünler / Galeri / Blog) ----------

export async function savePageTexts(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("genel");
  const current = await getPagesSettings();
  await saveSetting("sayfalar", {
    ...current,
    products: { title: readL(formData, "productsTitle"), subtitle: readL(formData, "productsSubtitle") },
    gallery: {
      title: readL(formData, "galleryTitle"),
      subtitle: readL(formData, "gallerySubtitle"),
      ctaTitle: readL(formData, "galleryCtaTitle"),
      ctaText: readL(formData, "galleryCtaText"),
    },
    blog: { title: readL(formData, "blogTitle"), subtitle: readL(formData, "blogSubtitle") },
  });
  revalidateAll();
  return { ok: true };
}

// ---------- Yasal sayfalar ----------

export async function saveLegal(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSection("genel");
  const current = await getLegalSettings();
  const docs = current.docs.map((doc) => ({
    slug: doc.slug as LegalSlug,
    title: readL(formData, `${doc.slug}.title`),
    body: readL(formData, `${doc.slug}.body`),
  }));
  await saveSetting("yasal", { docs });
  revalidateAll();
  return { ok: true };
}
