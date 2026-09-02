import type { L } from "@/lib/l10n";
import type { IconCard, ServiceTab } from "@/lib/content/types";

// Ana sayfa ve site geneli içerikler: panelden düzenlenir, site_settings("genel") altında saklanır.

// Dile özel görsel: EN boşsa TR görseli kullanılır (banner üzerinde metin olduğu için ayrı yüklenebilir)
export type LImage = { tr: string | null; en: string | null };

export function pickImage(img: LImage, lang: "tr" | "en"): string | null {
  return img[lang] ?? (lang === "tr" ? img.en : img.tr);
}

export type GeneralSettings = {
  // Banner görseli yazısız; başlık HTML olarak üstüne basılır (satır sonu için \n)
  hero: { desktop: LImage; mobile: LImage; title: L; alt: L };
  // Header altındaki yeşil kayan şerit
  marquee: L;
  features: { title: L; highlight: L; text: L; items: IconCard[] };
  productsSection: { title: L; text: L };
  // Sekmeli "hizmetler" bölümü: her sekmede 3 kart
  services: { title: L; text: L; tabs: ServiceTab[] };
  blogSection: { title: L };
  footer: { tagline: L; sustainability: L };
};

const c = (icon: IconCard["icon"], tr: string, en: string, ttr: string, ten: string): IconCard => ({
  icon,
  title: { tr, en },
  text: { tr: ttr, en: ten },
});

export const defaultGeneralSettings: GeneralSettings = {
  hero: {
    desktop: { tr: "/banner-desktop.jpg", en: "/banner-desktop.jpg" },
    mobile: { tr: "/banner-mobile.jpg", en: "/banner-mobile.jpg" },
    title: { tr: "Sürdürülebilir Ambalaj,\nGüçlü Etki", en: "Sustainable Packaging,\nPowerful Impact" },
    alt: { tr: "Sürdürülebilir Ambalaj, Güçlü Etki", en: "Sustainable Packaging, Powerful Impact" },
  },
  marquee: {
    tr: "Kraftora | Ambalajda doğal güç",
    en: "Kraftora | Natural strength in packaging",
  },
  features: {
    title: {
      tr: "Ürün Ambalajı için en iyi çözümünüz biziz",
      en: "We are your best solution for Product Packaging",
    },
    highlight: { tr: "Ürün Ambalajı", en: "Product Packaging" },
    text: {
      tr: "Hayalinizdeki ambalaja ulaşmak için birden fazla kaynağa gitme derdine son.",
      en: "Never worry about going to multiple sources to get your dream packaging.",
    },
    items: [
      c("user-plus", "Uzman Destek Ekibi", "Dedicated Expert Support",
        "Ürün uzmanlarımızın sınırsız desteğiyle daha bilinçli kararlar verin.",
        "Make more informed decisions with unlimited support from our team of product specialists."),
      c("workflow", "Uçtan Uca Çözüm", "End-to-End Solution",
        "Konseptten kapınıza kadar her adımı biz üstlenerek projenizi kolaylaştırıyoruz.",
        "From concept to your door, we simplify your project by handling everything for you."),
      c("resize", "Özel Ölçü", "Custom Sizing",
        "Ambalajınızın ölçülerini hiçbir sınırlama olmadan ürününüze göre belirleyin.",
        "Fully control the size of your packaging with no limitations to tailor to your product."),
      c("check-circle", "Kraftora Güvencesi", "The Kraftora Promise",
        "Her siparişte en yüksek kalitede ürün ve müşteri deneyimini garanti ediyoruz.",
        "We guarantee the highest quality product and customer experience with every order."),
      c("leaf-pin", "Çevre Dostu Malzemeler", "Eco-Friendly Materials",
        "Kraft kağıdımız %100 geri dönüştürülebilir ve biyolojik olarak çözünür; çevresel ayak izinizi azaltmanıza yardımcı olur.",
        "Our kraft paper is 100% recyclable and biodegradable, helping you reduce your environmental footprint."),
      c("clock", "Hızlı Teslimat", "Fast Turnaround",
        "Verimli üretim sürecimiz sayesinde özel ambalajınız her zaman tam zamanında teslim edilir.",
        "Streamlined production process ensures your custom packaging is delivered on time, every time."),
    ],
  },
  productsSection: {
    title: { tr: "Ürünlerimiz", en: "Our Products" },
    text: { tr: "Markanıza özel kraft ambalaj çözümleri.", en: "Custom kraft packaging tailored to your brand." },
  },
  services: {
    title: {
      tr: "Ambalaj ihtiyaçlarınızı karşılayan hizmetler",
      en: "Services that meet your packaging needs",
    },
    text: {
      tr: "**360° Kraftora yaklaşımımız**, ürünlerinizin ve işletmenizin ihtiyaç duyduğu en iyi ambalaj çözümlerini oluşturmak ve **tam ambalaj başarısına** ulaşmak için gereken tüm hizmetleri sunar.",
      en: "Our **360 Kraftora approach** delivers all the services you need to create the best packaging solutions your products and business needs in order to achieve **total packaging success**.",
    },
    tabs: [
      {
        title: { tr: "Danışmanlık", en: "Consultation" },
        cards: [
          c("user-plus", "Uzman Rehberliği", "Expert Guidance",
            "Ürün ve marka gereksinimlerinize en uygun çözümleri keşfetmek için ambalaj uzmanlarımızla görüşün.",
            "Connect with our packaging specialists to explore the best solutions tailored to your product and brand requirements."),
          c("clipboard", "İhtiyaç Analizi", "Needs Assessment",
            "Ürün ölçülerinizi, sevkiyat gereksinimlerinizi ve pazar konumunuzu analiz ederek en doğru ambalaj stratejisini öneriyoruz.",
            "We analyze your product dimensions, shipping requirements, and market positioning to recommend the perfect packaging strategy."),
          c("leaf-pin", "Malzeme Önerileri", "Material Recommendations",
            "Gramaj, dayanıklılık ve çevresel etki konusunda uzman tavsiyesiyle kraft, geri dönüştürülmüş veya özel kağıtlar arasından seçim yapın.",
            "Choose from kraft, recycled, or specialty papers with expert advice on weight, durability, and environmental impact."),
        ],
      },
      {
        title: { tr: "Tasarım", en: "Design" },
        cards: [
          c("pen", "Özel Tasarım", "Custom Artwork",
            "Tasarım ekibimiz marka kimliğinizi kusursuz yansıtan dikkat çekici görseller ve baskıya hazır dosyalar oluşturur.",
            "Our design team creates eye-catching artwork and print-ready files that perfectly represent your brand identity."),
          c("resize", "Yapısal Tasarım", "Structural Design",
            "Hassas ölçüler, sap yerleşimi ve körük yapılandırmasıyla ürününüz için kusursuz ambalaj yapısını tasarlayın.",
            "Engineer the perfect bag structure with precise measurements, handle placement, and gusset configuration for your product."),
          c("target", "Marka Uyumu", "Brand Alignment",
            "Ambalaj tasarımınızın marka kılavuzunuz, renk paletiniz ve pazarlama hedeflerinizle kusursuz uyum içinde olmasını sağlayın.",
            "Ensure your packaging design aligns seamlessly with your brand guidelines, color palette, and marketing objectives."),
        ],
      },
      {
        title: { tr: "Prototip", en: "Prototype" },
        cards: [
          c("cube", "Numune ve Prototip", "Sampling & Prototyping",
            "Üretime geçmeden önce numunelerle ambalaj ve baskı tasarımlarınızı test edip ince ayar yaparak vizyonunuzu hayata geçirin.",
            "Test and tweak your packaging and artwork designs with samples to bring your vision to life before production."),
          c("check-circle", "Ambalaj Testleri", "Packaging Testing",
            "Düşme ve ezilme gibi kritik testlerle ambalajınızın farklı koşullara dayanıklılığını doğrulayın.",
            "Conduct critical tests like drop and crush tests to ensure your packaging holds up to certain environments."),
          c("document", "Malzeme Optimizasyonu", "Material Optimization",
            "Yapısal mühendislerimizle malzeme kullanımını en aza indirerek gereksiz ambalaj atığını ve maliyetleri azaltın.",
            "Minimize material usage to reduce unnecessary packaging waste and costs with our structural engineers."),
        ],
      },
      {
        title: { tr: "Üretim", en: "Production" },
        cards: [
          c("workflow", "Seri Üretim", "Mass Production",
            "Son teknoloji üretim tesislerimizle ambalajınızı küçük partilerden yüksek hacimli siparişlere ölçeklendirin.",
            "Scale your packaging from small batches to large volume orders with our state-of-the-art manufacturing facilities."),
          c("gauge", "Kalite Kontrol", "Quality Control",
            "Çok aşamalı titiz denetim süreci, her partinin sevkiyattan önce kalite standartlarımızı karşılamasını sağlar.",
            "Rigorous multi-stage inspection process ensures every batch meets our exacting quality standards before shipping."),
          c("clock", "Verimli Üretim", "Efficient Manufacturing",
            "Optimize edilmiş iş akışları ve ileri makine parkuru, kısa teslim süreleriyle tutarlı sonuçlar sunar.",
            "Streamlined workflows and advanced machinery deliver consistent results with optimized turnaround times."),
        ],
      },
      {
        title: { tr: "Lojistik", en: "Logistic" },
        cards: [
          c("truck", "Küresel Sevkiyat", "Global Shipping",
            "Tam takip, gümrük işlemleri ve takviminize uygun esnek sevkiyat seçenekleriyle dünya çapında güvenilir teslimat.",
            "Reliable worldwide delivery with full tracking, customs handling, and flexible shipping options to suit your timeline."),
          c("warehouse", "Depolama", "Warehousing",
            "Envanter yönetimiyle güvenli depolama çözümleri; ambalajınız ihtiyaç duyduğunuz an hazır.",
            "Secure storage solutions with inventory management to ensure your packaging is always ready when you need it."),
          c("globe", "Tedarik Zinciri Yönetimi", "Supply Chain Management",
            "Üretim hattından deponuzun kapısına kadar koordineli planlama ile uçtan uca tedarik zinciri görünürlüğü.",
            "End-to-end supply chain visibility with coordinated scheduling from production floor to your warehouse door."),
        ],
      },
      {
        title: { tr: "Optimizasyon", en: "Optimize" },
        cards: [
          c("chart", "Maliyet Optimizasyonu", "Cost Optimization",
            "Akıllı malzeme seçimi ve toplu üretim stratejileriyle kaliteyi en üst düzeye çıkarırken birim maliyetlerinizi düşürün.",
            "Smart material selection and bulk production strategies to maximize quality while minimizing your per-unit costs."),
          c("leaf-pin", "Sürdürülebilirlik Hedefleri", "Sustainability Goals",
            "Geri dönüştürülebilir malzemeler, soya bazlı mürekkepler ve düşük karbon ayak izi çözümleriyle çevre dostu ambalaja geçin.",
            "Transition to eco-friendly packaging with recyclable materials, soy-based inks, and reduced carbon footprint solutions."),
          c("gear", "Sürekli İyileştirme", "Continuous Improvement",
            "Pazar trendleri ve müşteri beklentilerine ayak uydurmak için ambalajınızı sürekli değerlendirip geliştiriyoruz.",
            "Ongoing evaluation and refinement of your packaging to keep up with market trends and customer expectations."),
        ],
      },
    ],
  },
  blogSection: { title: { tr: "Blog", en: "Blog" } },
  footer: {
    tagline: {
      tr: "Sürdürülebilir Ambalaj Çözümleri\nDoğal Güçle Üretildi",
      en: "Sustainable Packaging Solutions\nCrafted with Natural Strength",
    },
    sustainability: {
      tr: "Tüm ürünlerimiz %100 geri dönüştürülebilir ve biyolojik olarak çözünebilir malzemelerden üretilir.",
      en: "All our products are made from 100% recyclable and biodegradable materials.",
    },
  },
};

// Sekme renkleri (aktif sekme alt çizgisi / kart zemini / kart kenarlığı) — orijinal tasarımdaki sıra
export const SERVICE_TAB_COLORS = [
  { accent: "#2e7d5b", bg: "#edf9f3", border: "rgba(46,125,91,0.08)" },
  { accent: "#2563eb", bg: "#eff6ff", border: "rgba(37,99,235,0.08)" },
  { accent: "#7c3aed", bg: "#f5f3ff", border: "rgba(124,58,237,0.08)" },
  { accent: "#ea580c", bg: "#fff7ed", border: "rgba(234,88,12,0.08)" },
  { accent: "#0891b2", bg: "#ecfeff", border: "rgba(8,145,178,0.08)" },
  { accent: "#dc2626", bg: "#fef2f2", border: "rgba(220,38,38,0.08)" },
];
