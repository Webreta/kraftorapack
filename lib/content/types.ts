import type { L } from "@/lib/l10n";
import type { CardIconName } from "@/components/site/Icon";

// ---------- Ürünler ----------

// Ürün detay sayfasındaki görsel + metin bloğu (sırayla sol/sağ yerleşir)
export type ProductSection = { title: L; text: L; image: string | null };

// Teklif formundaki ölçü alanları (metin girişi) ve ek seçenekler (onay kutusu)
export type QuoteField = { key: string; label: L };
export type QuoteOption = { key: string; label: L };

export type ProductQuote = {
  title: L;
  fields: QuoteField[];
  options: QuoteOption[];
};

export type Product = {
  id: number;
  slug: string;
  slugEn: string;
  title: L;
  cardText: L;
  listText: L;
  intro: L;
  images: string[];
  sections: ProductSection[];
  quote: ProductQuote;
  showOnHome: boolean;
  sortOrder: number;
  published: boolean;
};

// ---------- Blog ----------

export type BlogPost = {
  id: number;
  slug: string;
  slugEn: string;
  title: L;
  excerpt: L;
  // Düz metin: boş satırla ayrılan paragraflar, "## " ile başlayan satırlar alt başlık
  body: L;
  cover: string | null;
  date: string;
  readMinutes: number;
  published: boolean;
};

// ---------- Galeri ----------

export type GalleryImage = {
  id: number;
  image: string;
  alt: L;
  sortOrder: number;
};

// ---------- Ana sayfa kartları ----------

export type IconCard = { icon: CardIconName; title: L; text: L };
export type ServiceTab = { title: L; cards: IconCard[] };
