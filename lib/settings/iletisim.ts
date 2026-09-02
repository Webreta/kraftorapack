import type { L } from "@/lib/l10n";

// İletişim bilgileri ve İletişim sayfası metinleri: site_settings("iletisim")

export type ContactSettings = {
  email: string;
  phone: string;
  // tel: bağlantısı için yalnızca rakamlar (+ ile)
  phoneHref: string;
  address: L;
  hours: L;
  replyNote: L;
  // Footer'daki kısa konum satırı
  location: L;
  social: { facebook: string; instagram: string; x: string; linkedin: string };
  mapEmbed: string;
  page: {
    title: L;
    subtitle: L;
    officeTitle: L;
    phoneTitle: L;
    emailTitle: L;
    followTitle: L;
    followText: L;
    formTitle: L;
    formText: L;
    ctaTitle: L;
    ctaText: L;
  };
};

export const defaultContactSettings: ContactSettings = {
  email: "info@kraftorapack.com",
  phone: "+90 533 771 08 92",
  phoneHref: "+905337710892",
  address: {
    tr: "Kraftora Ambalaj Çözümleri, Alsancak, Kıbrıs Şehitleri Cad. No:42 Konak, İzmir 35220, Türkiye",
    en: "Kraftora Packaging Solutions, Alsancak, Kıbrıs Şehitleri Cad. No:42 Konak, İzmir 35220, Turkey",
  },
  hours: { tr: "Pzt – Cum, 09:00 – 18:00", en: "Mon – Fri, 09:00 – 18:00" },
  replyNote: { tr: "24 saat içinde yanıt veriyoruz", en: "We reply within 24 hours" },
  location: { tr: "İzmir Türkiye", en: "İzmir Turkey" },
  social: { facebook: "#", instagram: "#", x: "#", linkedin: "" },
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49919.44397349842!2d27.0834!3d38.4237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bbd862a762cacd%3A0x628cbba1c6dfe46e!2zxLB6bWly!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str",
  page: {
    title: { tr: "Bize Ulaşın", en: "Get in Touch" },
    subtitle: {
      tr: "Sizden haber almaktan mutluluk duyarız. Ürünlerimiz, fiyatlandırma ya da başka bir konuda sorunuz varsa ekibimiz yardıma hazır.",
      en: "We’d love to hear from you. Whether you have a question about our products, pricing, or anything else — our team is ready to help.",
    },
    officeTitle: { tr: "Ofisimiz", en: "Our Office" },
    phoneTitle: { tr: "Telefon", en: "Phone" },
    emailTitle: { tr: "E-posta", en: "Email" },
    followTitle: { tr: "Bizi Takip Edin", en: "Follow Us" },
    followText: {
      tr: "Yeni ürünler ve ilham veren içerikler için sosyal medya hesaplarımızı takip edin.",
      en: "Stay updated on new products and inspiration on our social channels.",
    },
    formTitle: { tr: "Bize Mesaj Gönderin", en: "Send Us a Message" },
    formText: {
      tr: "Aşağıdaki formu doldurun, en kısa sürede size dönüş yapalım.",
      en: "Fill out the form below and we’ll get back to you as soon as possible.",
    },
    ctaTitle: { tr: "Özel Ambalaj Teklifi mi Gerekiyor?", en: "Need a Custom Packaging Quote?" },
    ctaText: {
      tr: "Ürün yelpazemize göz atın ve herhangi bir ürün sayfasından doğrudan size özel teklif isteyin.",
      en: "Browse our product range and request a tailored quote directly from any product page.",
    },
  },
};
