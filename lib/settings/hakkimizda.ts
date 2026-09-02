import type { L } from "@/lib/l10n";
import type { IconCard } from "@/lib/content/types";

// Hakkımızda sayfası: panelden düzenlenir, site_settings("hakkimizda") altında saklanır.

export type AboutBlock = { eyebrow: L; title: L; text1: L; text2: L; image: string | null };

export type AboutSettings = {
  title: L;
  subtitle: L;
  story: AboutBlock;
  mission: AboutBlock;
  why: { eyebrow: L; title: L; text: L; cards: IconCard[] };
  cta: { title: L; text: L };
};

export const defaultAboutSettings: AboutSettings = {
  title: { tr: "Ambalajda Doğal Güç", en: "Natural Strength in Packaging" },
  subtitle: {
    tr: "Ürünlerinizi koruyan, markanızı yükselten ve gezegene saygı duyan sürdürülebilir, özel kraft ambalaj çözümleri üretiyoruz.",
    en: "We craft sustainable, custom kraft packaging solutions that protect your products, elevate your brand, and respect the planet.",
  },
  story: {
    eyebrow: { tr: "Hikayemiz", en: "Our Story" },
    title: { tr: "Güvenilir Ambalaj Ortağınız", en: "Your Trusted Packaging Partner" },
    text1: {
      tr: "Kraftora net bir misyonla kuruldu: işletmelere tasarımdan ve dayanıklılıktan ödün vermeyen, yüksek kaliteli ve çevre dostu kraft ambalajlar sunmak.",
      en: "Kraftora was founded with a clear mission: to provide businesses with high-quality, eco-friendly kraft packaging that doesn’t compromise on design or durability.",
    },
    text2: {
      tr: "Bugün gıda servisi, perakende, e-ticaret ve daha pek çok sektördeki müşterilerimize, her markanın kendine özgü ihtiyaçlarına tam uyumlu özel ambalaj çözümleri sunuyoruz. Konseptten teslimata kadar her adımı titizlikle yönetiyoruz.",
      en: "Today, we serve clients across food service, retail, e-commerce, and beyond — delivering custom packaging solutions that are fully tailored to each brand’s unique needs. From concept to delivery, we handle every step with precision and care.",
    },
    image: "/hakkimizda/hikayemiz.jpg",
  },
  mission: {
    eyebrow: { tr: "Misyonumuz", en: "Our Mission" },
    title: { tr: "Markanız ve Gezegen İçin Üretildi", en: "Built for Your Brand and the Planet" },
    text1: {
      tr: "İyi bir ambalajın korumaktan fazlasını yapması gerektiğine inanıyoruz: hikayenizi anlatmalı, unutulmaz bir deneyim yaratmalı ve çevrede iz bırakmamalı.",
      en: "We believe great packaging should do more than protect — it should tell your story, create a memorable experience, and leave no trace on the environment.",
    },
    text2: {
      tr: "Ürettiğimiz her ürün, sürdürülebilir kaynaklardan elde edilen, tamamen geri dönüştürülebilir kraft kağıttan yapılır. Modern baskı teknolojisini çevre bilinçli malzemelerle birleştirerek müşterilerinizin seveceği ve gezegenin size teşekkür edeceği ambalajlar üretiyoruz.",
      en: "Every product we make is crafted from sustainably sourced, fully recyclable kraft paper. We combine modern printing technology with eco-conscious materials to deliver packaging that your customers will love and the planet will thank you for.",
    },
    image: "/hakkimizda/misyonumuz.jpg",
  },
  why: {
    eyebrow: { tr: "Neden Kraftora", en: "Why Kraftora" },
    title: { tr: "Bizi Farklı Kılan Nedir", en: "What Sets Us Apart" },
    text: {
      tr: "Biz yalnızca kutu ve çanta üretmiyoruz; kalite, şeffaflık ve yenilik üzerine kurulu ambalaj ortaklıkları inşa ediyoruz.",
      en: "We don’t just make boxes and bags — we build packaging partnerships rooted in quality, transparency, and innovation.",
    },
    cards: [
      {
        icon: "resize",
        title: { tr: "Tamamen Özel", en: "Fully Custom" },
        text: {
          tr: "Her ürün tam olarak sizin özelliklerinize göre üretilir: ölçü, malzeme, baskı ve yüzey işlemi. Şablon yok, sınır yok.",
          en: "Every product is tailored to your exact specifications — dimensions, material, print, and finish. No templates, no limits.",
        },
      },
      {
        icon: "check-circle",
        title: { tr: "Kalite Garantisi", en: "Quality Guaranteed" },
        text: {
          tr: "Çok aşamalı kalite kontrol, her partinin tesisimizden çıkmadan önce en yüksek standartları karşılamasını sağlar.",
          en: "Multi-stage quality control ensures every batch meets the highest standards before it leaves our facility.",
        },
      },
      {
        icon: "leaf-pin",
        title: { tr: "%100 Çevre Dostu", en: "100% Eco-Friendly" },
        text: {
          tr: "Tüm malzemeler geri dönüştürülebilir, biyolojik olarak çözünür ve sürdürülebilir kaynaklıdır; müşterilerinizin ve gezegenin takdir edeceği ambalajlar.",
          en: "All materials are recyclable, biodegradable, and sustainably sourced — packaging that your customers and the planet appreciate.",
        },
      },
      {
        icon: "clock",
        title: { tr: "Hızlı Teslimat", en: "Fast Turnaround" },
        text: {
          tr: "Verimli üretim ve lojistik sayesinde ambalajınız her seferinde planlanan zamanda teslim edilir; gecikme yok, bahane yok.",
          en: "Streamlined production and logistics ensure your packaging is delivered on schedule, every time — no delays, no excuses.",
        },
      },
      {
        icon: "user-plus",
        title: { tr: "Özel Destek", en: "Dedicated Support" },
        text: {
          tr: "Kişisel ambalaj uzmanınız ilk görüşmeden son teslimata kadar tüm süreçte size rehberlik eder.",
          en: "A personal packaging specialist guides you through the entire process — from first consultation to final delivery.",
        },
      },
      {
        icon: "truck",
        title: { tr: "Küresel Teslimat", en: "Global Delivery" },
        text: {
          tr: "30'dan fazla ülkeye tam lojistik destek, gümrük işlemleri ve her siparişte gerçek zamanlı takip ile sevkiyat yapıyoruz.",
          en: "We ship to over 30 countries with full logistics support, customs handling, and real-time tracking on every order.",
        },
      },
    ],
  },
  cta: {
    title: {
      tr: "Kusursuz Ambalajınızı Oluşturmaya Hazır mısınız?",
      en: "Ready to Build Your Perfect Packaging?",
    },
    text: {
      tr: "Ürünlerimize göz atın ya da bize ulaşın; markanız için ideal çözümü birlikte bulalım.",
      en: "Browse our products or get in touch — we’ll help you find the ideal solution for your brand.",
    },
  },
};
