// İki dilli metin: sitenin ana dili Türkçe, ikinci dili İngilizce.
// Panelde her metin alanı TR / EN olarak yan yana düzenlenir.

export type Lang = "tr" | "en";
export const LANGS: Lang[] = ["tr", "en"];
export const DEFAULT_LANG: Lang = "tr";

export type L = { tr: string; en: string };

export const emptyL = (): L => ({ tr: "", en: "" });

// İstenen dildeki metni döner; boşsa diğer dile düşer (çeviri girilmemiş alanlar boş kalmasın)
export function t(value: L | undefined | null, lang: Lang): string {
  if (!value) return "";
  const v = value[lang]?.trim();
  if (v) return v;
  return (lang === "tr" ? value.en : value.tr) ?? "";
}

export function isLang(value: unknown): value is Lang {
  return value === "tr" || value === "en";
}
