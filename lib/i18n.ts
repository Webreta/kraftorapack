import type { Lang } from "@/lib/l10n";

// Sayfa rotaları: klasör adları Türkçe (app/(site)/[lang]/<tr>), İngilizce
// adresler middleware tarafından Türkçe klasöre rewrite edilir.
export const ROUTES = {
  home: { tr: "", en: "" },
  hakkimizda: { tr: "hakkimizda", en: "about-us" },
  urunler: { tr: "urunler", en: "products" },
  galeri: { tr: "galeri", en: "gallery" },
  blog: { tr: "blog", en: "blog" },
  iletisim: { tr: "iletisim", en: "contact" },
  kvkk: { tr: "kvkk", en: "kvkk" },
  gizlilik: { tr: "gizlilik-politikasi", en: "privacy-policy" },
  cerez: { tr: "cerez-politikasi", en: "cookie-policy" },
} as const;

export type RouteKey = keyof typeof ROUTES;

// Dile göre tam adres: TR öneksiz (/urunler), EN /en önekli (/en/products)
export function href(lang: Lang, key: RouteKey, rest?: string): string {
  const prefix = lang === "en" ? "/en" : "";
  const seg = ROUTES[key][lang];
  const path = [seg, rest].filter(Boolean).join("/");
  return `${prefix}/${path}` || "/";
}

// İngilizce ilk segmenti Türkçe klasör adına çevirir (middleware için)
export function enSegmentToTr(seg: string): string | null {
  for (const r of Object.values(ROUTES)) {
    if (r.en && r.en === seg) return r.tr;
  }
  return null;
}

export function trSegmentToEn(seg: string): string | null {
  for (const r of Object.values(ROUTES)) {
    if (r.tr && r.tr === seg) return r.en;
  }
  return null;
}

// Aynı sayfanın diğer dildeki adresi (dinamik slug'lar sayfa tarafında düzeltilir)
export function alternatePath(pathname: string, target: Lang): string {
  const clean = pathname.replace(/^\/en(?=\/|$)/, "");
  const parts = clean.split("/").filter(Boolean);
  if (parts.length === 0) return target === "en" ? "/en" : "/";
  const [first, ...rest] = parts;
  let seg: string | null = first;
  if (target === "en") seg = trSegmentToEn(first) ?? first;
  else seg = first; // Türkçe klasör adları zaten canonical
  const path = [seg, ...rest].join("/");
  return target === "en" ? `/en/${path}` : `/${path}`;
}

// Arayüz metinleri (menü, buton, form etiketleri). İçerik metinleri DB'den gelir.
export const dict = {
  tr: {
    nav: {
      home: "Ana Sayfa",
      about: "Hakkımızda",
      products: "Ürünler",
      gallery: "Galeri",
      blog: "Blog",
      contact: "İletişim",
    },
    menu: "Menü",
    allProducts: "Tüm Ürünler",
    viewProduct: "Ürünü İncele",
    viewProducts: "Ürünleri İncele",
    contactUs: "Bize Ulaşın",
    sendQuote: "Teklif İste",
    readPost: "Yazıyı Okuyun",
    minRead: "dk okuma",
    otherPosts: "Diğer Yazılar",
    noPosts: "Henüz blog yazısı yok.",
    footer: {
      contact: "İletişim",
      siteMap: "Site Haritası",
      sustainability: "Sürdürülebilirlik",
      rights: "Tüm hakları saklıdır.",
      designedBy: "Tasarım",
      legal: "Yasal",
    },
    form: {
      name: "Ad",
      lastName: "Soyad",
      fullName: "Ad Soyad",
      email: "E-posta Adresi",
      phone: "Telefon Numarası",
      company: "Firma Adı",
      message: "Mesajınız",
      notes: "Ek Notlar",
      send: "Gönder",
      sending: "Gönderiliyor…",
      success: "Mesajınız alındı. En kısa sürede size dönüş yapacağız.",
      quoteSuccess: "Teklif talebiniz alındı. Ekibimiz en kısa sürede sizinle iletişime geçecek.",
      required: "zorunlu",
      select: "-- Seçiniz --",
      material: "Malzeme",
      print: "Baskı",
      finishing: "Yüzey İşlemi",
      additionalOptions: "Ek Seçenekler",
      quantity: "Adet",
      usage: "Kullanım Türü",
      close: "Kapat",
      inquiry: "Teklif Formu",
      materials: ["Kraft Karton", "Beyaz Karton, Oluklu Kraft", "Mikro Dalga (Micro-Flute)", "Danışmanlık İstiyorum"],
      prints: ["Baskısız", "1 Renk", "2 Renk", "Tam Renk (CMYK)", "Danışmanlık İstiyorum"],
      finishings: ["Yok", "Mat Selefon", "Parlak Selefon", "UV Lak", "Danışmanlık İstiyorum"],
      quantities: ["500", "1000", "2500", "5000", "10000", "25000+"],
      usages: ["Yerinde Tüketim", "Paket Servis", "Kurye Teslimat", "Hepsi"],
    },
    cookie: {
      text: "Sitemiz, düzgün çalışması için yalnızca zorunlu çerezleri kullanır. Detaylar için",
      link: "Çerez Politikamızı",
      after: "inceleyebilirsiniz.",
      accept: "Kabul Et",
    },
    notFound: {
      title: "Sayfa bulunamadı",
      text: "Aradığınız sayfa taşınmış ya da kaldırılmış olabilir.",
      home: "Ana sayfaya dön",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      products: "Products",
      gallery: "Gallery",
      blog: "Blog",
      contact: "Contact",
    },
    menu: "Menu",
    allProducts: "All Products",
    viewProduct: "View Product",
    viewProducts: "View Products",
    contactUs: "Contact Us",
    sendQuote: "Send a Quote",
    readPost: "Read Article",
    minRead: "min read",
    otherPosts: "Other Posts",
    noPosts: "No blog posts yet.",
    footer: {
      contact: "Contact",
      siteMap: "Site Map",
      sustainability: "Sustainability",
      rights: "All rights reserved.",
      designedBy: "Designed by",
      legal: "Legal",
    },
    form: {
      name: "Name",
      lastName: "Last Name",
      fullName: "Full Name",
      email: "E-mail Address",
      phone: "Telephone Number",
      company: "Company Name",
      message: "Your Message",
      notes: "Additional Notes",
      send: "Send",
      sending: "Sending…",
      success: "Thank you! Your message has been received. We will get back to you shortly.",
      quoteSuccess: "Your quote request has been received. Our team will contact you shortly.",
      required: "required",
      select: "-- Select --",
      material: "Material",
      print: "Print",
      finishing: "Finishing",
      additionalOptions: "Additional Options",
      quantity: "Quantity",
      usage: "Usage Type",
      close: "Close",
      inquiry: "Inquiry Form",
      materials: ["Kraft Cardboard", "White Cardboard, Corrugated Kraft", "Micro-Flute", "Need Consultation"],
      prints: ["No Print", "1 Color", "2 Colors", "Full Color (CMYK)", "Need Consultation"],
      finishings: ["None", "Matte Lamination", "Gloss Lamination", "UV Coating", "Need Consultation"],
      quantities: ["500", "1000", "2500", "5000", "10000", "25000+"],
      usages: ["Dine-in", "Takeaway", "Delivery", "All of the above"],
    },
    cookie: {
      text: "This website uses only essential cookies to function properly. See our",
      link: "Cookie Policy",
      after: "for details.",
      accept: "Accept",
    },
    notFound: {
      title: "Page not found",
      text: "The page you are looking for may have been moved or removed.",
      home: "Back to home",
    },
  },
} as const;

export type Dict = (typeof dict)["tr"];

export function getDict(lang: Lang): Dict {
  return dict[lang] as Dict;
}

export function formatDate(date: string | Date, lang: Lang) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
