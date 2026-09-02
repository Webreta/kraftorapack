import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { blogPosts, galleryImages, products } from "./schema";
import type { L } from "@/lib/l10n";
import type { ProductQuote, ProductSection } from "@/lib/content/types";

// Başlangıç içeriği: kraftorapack.com'daki ürünler, blog yazıları ve galeri.
// Yalnızca boş tablolara yazar; mevcut kayıtlara dokunmaz.

const L = (tr: string, en: string): L => ({ tr, en });

// ---------- Teklif formu yardımcıları ----------

const DIM = {
  length: L("Uzunluk (cm)", "Length (cm)"),
  width: L("Genişlik (cm)", "Width (cm)"),
  height: L("Yükseklik (cm)", "Height (cm)"),
  diameter: L("Çap (cm)", "Diameter (cm)"),
  depth: L("Derinlik (cm)", "Depth (cm)"),
  gusset: L("Derinlik / Körük (cm)", "Depth/Gusset (cm)"),
  slots: L("Yuva Sayısı", "Slots"),
  volume: L("Hacim / Porsiyon", "Volume"),
  boxLength: L("Kutu Uzunluğu (cm)", "Box Length (cm)"),
  boxWidth: L("Kutu Genişliği (cm)", "Box Width (cm)"),
  dividerHeight: L("Bölme Yüksekliği (cm)", "Divider Height (cm)"),
};

const OPT = {
  foil: L("Yaldız Baskı", "Foil Stamping"),
  emboss: L("Kabartma", "Embossing"),
  deboss: L("Gofre (Çukur Baskı)", "Debossing"),
  grease: L("Yağ Geçirmez Kaplama", "Grease-Proof Coating"),
  vent: L("Havalandırma Delikleri", "Ventilation Holes"),
  easyLock: L("Kolay Kilit Kapak", "Easy-Lock Closure"),
  lid: L("Kapak İsteniyor", "Lid Required"),
  lining: L("Yağ Geçirmez Astar", "Grease-Proof Lining"),
  wireLock: L("Tel Kilit Sap", "Wire Lock Handle"),
  sticker: L("Etiket Mühür", "Sticker Seal"),
  reinforcedBottom: L("Güçlendirilmiş Taban", "Reinforced Bottom"),
  lamination: L("Selefon", "Lamination"),
  interlock: L("Geçmeli Yuvalar", "Interlocking Slots"),
  edges: L("Güçlendirilmiş Kenarlar", "Reinforced Edges"),
  cells: L("Özel Hücre Ölçüleri", "Custom Cell Sizes"),
  handHoles: L("El Delikleri", "Hand Holes"),
  corners: L("Güçlendirilmiş Köşeler", "Reinforced Corners"),
  stacking: L("İstifleme Dayanım Testi", "Stacking Strength Test"),
  pallet: L("Palete Uygun Ölçü", "Pallet-Ready Sizing"),
};

const STD_OPTS = [OPT.foil, OPT.emboss, OPT.deboss, OPT.grease];

function quote(title: L, fields: L[], options: L[]): ProductQuote {
  return {
    title,
    fields: fields.map((label, i) => ({ key: `olcu-${i + 1}`, label })),
    options: options.map((label, i) => ({ key: `secenek-${i + 1}`, label })),
  };
}

type SeedProduct = {
  slug: string;
  slugEn: string;
  file: string;
  title: L;
  cardText: L;
  listText: L;
  intro: L;
  sections: [L, L, L, L];
  quote: ProductQuote;
  showOnHome: boolean;
};

const P: SeedProduct[] = [
  {
    slug: "pizza-kutusu",
    slugEn: "pizza-box",
    file: "pizza-box",
    title: L("Kraft Pizza Kutusu", "Kraft Pizza Box"),
    cardText: L(
      "Fırından kapıya kadar hamuru çıtır tutan havalandırmalı, tamamen özel baskılı pizza kutuları.",
      "Ventilated pizza boxes that keep crusts crispy from oven to doorstep, with full custom printing."
    ),
    listText: L("Özel baskılı, havalandırmalı pizza ambalajı.", "Custom printed, ventilated pizza packaging."),
    intro: L(
      "Kraftora pizza kutuları gıdaya uygun kraft kartondan üretilir. Özel tam renkli baskı, ölçüye özel üretim ve havalandırma tasarımıyla pizzanız taze, markanız akılda kalır.",
      "Kraftora pizza boxes are made from food-safe kraft cardboard. With custom full-color printing, tailored sizing, and ventilation design, your pizza stays fresh and your brand stays memorable."
    ),
    sections: [
      L("Tasarımla Gelen Tazelik", "Freshness by Design"),
      L(
        "Pizza kutularımız teslimat ve istifleme sırasında formunu koruyan dayanıklı bir yapıya sahiptir. Entegre havalandırma sistemi nem birikimini önleyerek hamurun fırından kapıya kadar çıtır kalmasını sağlar.",
        "Our pizza boxes feature a durable structure that maintains its shape during delivery and stacking. The built-in ventilation system prevents moisture buildup, keeping your crust crispy from oven to doorstep."
      ),
      L("Çevre Dostu ve Dayanıklı", "Eco-Friendly & Durable"),
      L(
        "%100 geri dönüştürülebilir ve biyolojik olarak çözünebilir malzemelerden üretilen pizza kutularımız, çevreye duyarlı bir marka inşa etmenize yardımcı olur. Sağlam yapısı paket servis, yerinde tüketim ve kurye teslimatında güvenilir performans sunar.",
        "Made from 100% recyclable and biodegradable materials, our pizza boxes help you build an eco-conscious brand. Their robust construction ensures reliable performance across takeaway, dine-in, and delivery operations."
      ),
    ],
    quote: quote(L("Kraft Pizza Kutusu - Teklif Formu", "Kraft Pizza Box - Inquiry Form"), [DIM.length, DIM.width, DIM.height], [...STD_OPTS, OPT.vent]),
    showOnHome: true,
  },
  {
    slug: "hamburger-kutusu",
    slugEn: "hamburger-box",
    file: "hamburger-box",
    title: L("Kraft Hamburger Kutusu", "Kraft Hamburger Box"),
    cardText: L(
      "Ürününüzü güvende, markanızı ön planda tutan yağa dayanıklı hamburger kutuları.",
      "Grease-resistant burger boxes that keep your product secure and your brand front and center."
    ),
    listText: L("Yağa dayanıklı, güvenli hamburger ambalajı.", "Grease-resistant, secure burger packaging."),
    intro: L(
      "Kraftora hamburger kutuları gıdaya uygun kraft ve beyaz kartondan üretilir. Özel baskı seçenekleri ve ölçüye özel üretimle hamburgeriniz müşterinize kusursuz bir sunumla ulaşır.",
      "Kraftora hamburger boxes are produced from food-safe kraft and white cardboard. With custom printing options and tailored sizing, your burger reaches your customer with a flawless presentation."
    ),
    sections: [
      L("Yağ Geçirmez Koruma", "Grease-Proof Protection"),
      L(
        "Yağa ve neme dayanıklı iç kaplamasıyla hamburger kutularımız ürününüzü korurken dış yüzeyi temiz ve düzgün tutar. Kolay kilit kapak sistemi hem mutfakta hem de servis alanında pratik kullanım sağlar.",
        "Featuring a grease and moisture-resistant inner coating, our hamburger boxes protect your product while keeping the exterior clean and polished. The easy-lock closure system ensures practical use in both kitchen and front-of-house."
      ),
      L("Sürdürülebilir ve Sağlam", "Sustainable & Sturdy"),
      L(
        "%100 geri dönüştürülebilir malzemelerden üretilen hamburger kutularımız, çevreye duyarlı bir marka imajı yansıtmanıza yardımcı olur. Sağlam yapısı teslimat ve kurye taşımacılığında dayanıklılığını korur; müşterinize profesyonel bir deneyim sunar.",
        "Made from 100% recyclable materials, our hamburger boxes help you project an environmentally responsible brand image. Their sturdy build holds up during delivery and courier transport, giving your customer a professional experience."
      ),
    ],
    quote: quote(L("Kraft Hamburger Kutusu - Teklif Formu", "Kraft Hamburger Box - Inquiry Form"), [DIM.length, DIM.width, DIM.height], [...STD_OPTS, OPT.easyLock]),
    showOnHome: true,
  },
  {
    slug: "kraft-kase",
    slugEn: "kraft-bowl",
    file: "kraft-bowl",
    title: L("Kraft Kağıt Kase", "Kraft Paper Bowl"),
    cardText: L(
      "Çorba, salata ve yemekler için özel kraft kaseler: sızdırmaz, kapak uyumlu ve tamamen markalanabilir.",
      "Custom kraft bowls for soups, salads, and meals — leak-proof, lid-compatible, and fully brandable."
    ),
    listText: L("Sıcak ve soğuk yemekler için sızdırmaz kaseler.", "Leak-proof bowls for hot and cold dishes."),
    intro: L(
      "Kraftora kraft kağıt kaseler, sıcak ve soğuk yemekler için gıda güvenliği standartlarına uygun üretilir. Özel baskı ve ölçü seçenekleriyle salata, çorba, makarna ve bowl menülerinizi şık biçimde sunun.",
      "Kraftora kraft paper bowls are produced to food safety standards for both hot and cold dishes. With custom printing and sizing options, serve your salads, soups, pasta, and bowl menus in style."
    ),
    sections: [
      L("Sızdırmaz Performans", "Leak-Proof Performance"),
      L(
        "Sızdırmaz iç kaplamasıyla kraft kaselerimiz sulu yemekler için idealdir. Ergonomik formu rahat bir tutuş sağlarken kapak uyumlu tasarımı paket serviste dökülmeyi önler.",
        "Featuring a leak-proof inner coating, our kraft bowls are ideal for liquid-based dishes. Their ergonomic shape provides a comfortable grip, while the lid-compatible design ensures spill-free takeaway delivery."
      ),
      L("Doğal Görünüm, Pratik Kullanım", "Natural Look, Practical Use"),
      L(
        "Premium bir görünüm sunan doğal kraft dokusuyla kağıt kaselerimiz %100 geri dönüştürülebilir malzemeden üretilir. Mikrodalgaya uygun ve istiflenebilir tasarımıyla hem mutfakta hem de depolamada pratiklik sağlar.",
        "With a natural kraft finish that delivers a premium look, our paper bowls are made from 100% recyclable materials. Microwave-safe and stackable by design, they offer practical convenience in both kitchen and storage."
      ),
    ],
    quote: quote(L("Kraft Kağıt Kase - Teklif Formu", "Kraft Paper Bowl - Inquiry Form"), [DIM.diameter, DIM.height], [...STD_OPTS, OPT.lid]),
    showOnHome: true,
  },
  {
    slug: "kraft-tabak",
    slugEn: "kraft-plate",
    file: "kraft-plate",
    title: L("Kraft Tabak", "Kraft Tray"),
    cardText: L(
      "Sokak lezzetleri, açık büfe ve paket servis için temiz, doğal görünümlü çok amaçlı kraft tabaklar.",
      "Versatile kraft trays built for street food, buffets, and takeaway with a clean, natural finish."
    ),
    listText: L("Atıştırmalıklar ve yemekler için çok amaçlı tabaklar.", "Versatile trays for snacks and meals."),
    intro: L(
      "Kraftora kraft tabaklar atıştırmalıklardan ana yemeklere kadar çok yönlü kullanım sunar. Gıdaya uygun malzemelerden üretilen tabaklarımız, markanıza özel baskı ve ölçü seçenekleriyle servis noktasında öne çıkar.",
      "Kraftora kraft trays offer versatile use from snacks to main courses. Made from food-safe materials, our trays stand out at the point of service with custom printing and sizing options tailored to your brand."
    ),
    sections: [
      L("Her Menüye Uygun", "Built for Any Menu"),
      L(
        "Yağa ve neme dayanıklı iç kaplamasıyla kraft tabaklarımız soslu ve yağlı yiyecekler için mükemmeldir. Açık büfelere, festivallere, sokak lezzeti tezgâhlarına ve paket servise zahmetsizce uyum sağlar.",
        "With a grease and moisture-resistant inner coating, our kraft trays are perfect for saucy and oily foods. They adapt effortlessly to buffets, festivals, street food stalls, and takeaway operations."
      ),
      L("Hafif ve İstiflenebilir", "Lightweight & Stackable"),
      L(
        "Doğal kraft dokusuyla modern ve zarif bir sunum sunan tabaklarımız %100 geri dönüştürülebilir malzemeden üretilir. Hafif ve iç içe geçebilir yapısı minimum depolama alanı kaplar ve günlük operasyonu kolaylaştırır.",
        "Offering a modern and elegant presentation with their natural kraft texture, our trays are made from 100% recyclable materials. Lightweight and nestable, they take up minimal storage space and simplify daily operations."
      ),
    ],
    quote: quote(L("Kraft Tabak - Teklif Formu", "Kraft Tray - Inquiry Form"), [DIM.length, DIM.width, DIM.depth], [...STD_OPTS, OPT.lining]),
    showOnHome: true,
  },
  {
    slug: "doner-kutusu",
    slugEn: "doner-box",
    file: "doner-box",
    title: L("Kraft Döner Kutusu", "Kraft Döner Box"),
    cardText: L(
      "Dürüm, noodle ve pilav porsiyonları için tasarlanmış, ısıya dayanıklı iç yüzeyli katlanabilir döner kutuları.",
      "Foldable döner boxes with a heat-resistant interior, designed for wraps, noodles, and rice portions."
    ),
    listText: L("Dürüm ve porsiyonlar için ısıya dayanıklı kutular.", "Heat-resistant boxes for wraps and portions."),
    intro: L(
      "Kraftora döner kutuları, kolay açılır ve yeniden kapanabilir üst kapaklı, gıdaya uygun kartondan üretilir. Döner, dürüm, noodle ve pilav porsiyonları için ideal olan kutular, her birinde yer alan özel baskıyla marka görünürlüğünüzü artırır.",
      "Kraftora döner boxes are made from food-safe cardboard with an easy-open, resealable top flap. Ideal for serving döner, wraps, noodles, and rice portions, they boost your brand visibility with custom printing on every box."
    ),
    sections: [
      L("Güvenli Teslimat İçin Kapalı Yapı", "Sealed for Safe Delivery"),
      L(
        "Yağa ve ısıya dayanıklı iç kaplamasıyla döner kutularımız paket servis ve kurye teslimatında temiz bir deneyim sunar. Metal tel kilit mekanizması kutuyu taşıma boyunca güvenle kapalı tutar.",
        "Featuring a grease and heat-resistant inner coating, our döner boxes ensure a clean experience during takeaway and courier delivery. The metal wire lock mechanism keeps the box securely closed throughout transport."
      ),
      L("Kompakt ve Çevreye Duyarlı", "Compact & Eco-Conscious"),
      L(
        "%100 geri dönüştürülebilir malzemelerden üretilen döner kutularımız çevre dostu marka imajınızı güçlendirir. Kompakt, iç içe geçebilir tasarımı depolama alanından tasarruf sağlar; farklı porsiyon boyutları her operasyona uygun seçenek sunar.",
        "Made from 100% recyclable materials, our döner boxes strengthen your eco-friendly brand image. Their compact, nestable design saves storage space, and multiple portion sizes ensure the right fit for every operation."
      ),
    ],
    quote: quote(L("Kraft Döner Kutusu - Teklif Formu", "Kraft Döner Box - Inquiry Form"), [DIM.volume], [...STD_OPTS, OPT.wireLock]),
    showOnHome: true,
  },
  {
    slug: "patates-kutusu",
    slugEn: "potato-box",
    file: "potato-box",
    title: L("Kraft Patates Kutusu", "Kraft French Fry Box"),
    cardText: L(
      "Hızlı servis ve zahmetsiz marka görünürlüğü için kompakt, yağ geçirmez patates kutuları.",
      "Compact, grease-proof fry boxes built for fast service and effortless brand visibility."
    ),
    listText: L("Kompakt, yağ geçirmez patates kapları.", "Compact, grease-proof fry containers."),
    intro: L(
      "Kraftora patates kutuları, patatesinizi sıcak ve çıtır tutmak üzere gıdaya uygun kraft kartondan üretilir. Özel baskı ve ölçü seçenekleriyle her servis, müşterilerinizin yanında taşıdığı bir marka fırsatına dönüşür.",
      "Kraftora french fry boxes are crafted from food-safe kraft cardboard, designed to keep your fries hot and crispy. With custom printing and sizing options, every serving becomes a branding opportunity that your customers carry with them."
    ),
    sections: [
      L("Temiz ve Yağ Geçirmez", "Clean & Grease-Proof"),
      L(
        "Yağa dayanıklı iç kaplamasıyla patates kutularımız yağın dışarı sızmasını önlerken temiz ve profesyonel bir dış görünüm sağlar. Açık üst tasarımı kolay erişim sunar ve servisinize premium bir sokak lezzeti estetiği katar.",
        "Featuring a grease-resistant inner coating, our french fry boxes keep oil from seeping through while maintaining a clean, professional exterior. The open-top design allows easy access and adds a premium street food aesthetic to your service."
      ),
      L("Sürdürülebilir Hızlı Servis", "Sustainable Fast Service"),
      L(
        "%100 geri dönüştürülebilir malzemelerden üretilen patates kutularımız kaliteden ödün vermeden sürdürülebilirlik hedeflerinizi destekler. Kompakt, iç içe geçebilir yapısı depolama alanını en aza indirir ve yoğun saatlerde yüksek hacimli servisi hızlandırır.",
        "Made from 100% recyclable materials, our french fry boxes support your sustainability goals without compromising on quality. Their compact, nestable structure minimizes storage space and streamlines high-volume service during peak hours."
      ),
    ],
    quote: quote(L("Kraft Patates Kutusu - Teklif Formu", "Kraft French Fry Box - Inquiry Form"), [DIM.width, DIM.height], STD_OPTS),
    showOnHome: true,
  },
  {
    slug: "nata-kutusu",
    slugEn: "nata-box",
    file: "nata-box",
    title: L("Kraft Nata Kutusu", "Kraft Nata Box"),
    cardText: L(
      "Pastéis de nata'yı güvenle yerinde tutan, yastık formlu zarif hamur işi kutuları.",
      "Elegant pillow-shaped boxes that cradle your pastéis de nata securely in place."
    ),
    listText: L("Zarif, yastık formunda hamur işi tutucular.", "Elegant pillow-shaped pastry holders."),
    intro: L(
      "Kraftora nata kutuları, pastéis de nata'larınızı güvenle yerinde tutan özgün yastık formlu bir yapıyla tasarlanmıştır. Özel baskı seçenekli, gıdaya uygun kartondan üretilen kutular her servisi zarif bir marka vitrinine dönüştürür.",
      "Kraftora nata boxes are designed with a unique pillow-shaped structure that cradles your pastéis de nata securely in place. Made from food-safe cardboard with custom printing options, they turn every serving into an elegant brand showcase."
    ),
    sections: [
      L("Hassas Tutuşlu Sunum", "Precision Hold Display"),
      L(
        "Hassas kesimli tutucu yuvalar her nata'yı tam yerinde tutar; hareketi önler ve narin hamur işini taşıma sırasında korur. Açık üst sergileme tasarımı müşterilerinizin ürünü anında görmesini sağlayarak al-git deneyimini güçlendirir.",
        "The precision-cut holder slots keep each nata perfectly positioned, preventing movement and preserving the delicate pastry during transport. The open-top display design lets your customers see the product instantly, enhancing the grab-and-go experience."
      ),
      L("Düz Sevkiyat ve Geri Dönüştürülebilir", "Flat-Pack & Recyclable"),
      L(
        "%100 geri dönüştürülebilir malzemelerden üretilen nata kutularımız sürdürülebilirliği zarafetle birleştirir. Düz sevk edilen katlanabilir yapısı depolama alanından tasarruf sağlar ve hızlı kurulum sunar; yoğun fırınlar, kafeler ve paket servis tezgâhları için idealdir.",
        "Made from 100% recyclable materials, our nata boxes combine sustainability with sophistication. Their flat-pack, foldable structure saves storage space and allows quick assembly, making them ideal for high-traffic bakeries, cafés, and takeaway counters."
      ),
    ],
    quote: quote(L("Kraft Nata Kutusu - Teklif Formu", "Kraft Nata Box - Inquiry Form"), [DIM.length, DIM.width, DIM.slots], STD_OPTS),
    showOnHome: false,
  },
  {
    slug: "kraft-kagit-torba",
    slugEn: "paper-bag",
    file: "paper-bag",
    title: L("Kraft Kağıt Torba", "Kraft Paper Bag"),
    cardText: L(
      "Geniş körüklü tabanıyla fırın, perakende ve gıda servisi için ideal, dayanıklı kraft kağıt torbalar.",
      "Durable kraft paper bags with a wide gusset base, perfect for bakeries, retail, and food service."
    ),
    listText: L("Katlanır kapaklı dayanıklı torbalar.", "Durable bags with fold-over closure."),
    intro: L(
      "Kraftora kraft kağıt torbalar, güvenli katlanır kapaklı, yüksek mukavemetli ve gıdaya uygun kraft kağıttan üretilir. Özel baskı ve etiket mühür seçenekleri, sade bir torbayı fırınlar, kafeler ve perakende mağazaları için güçlü bir marka aracına dönüştürür.",
      "Kraftora kraft paper bags are made from high-strength, food-safe kraft paper with a secure fold-over closure. Custom printing and sticker seal options let you turn a simple bag into a powerful branding tool for bakeries, cafés, and retail shops."
    ),
    sections: [
      L("Dengeli ve Güçlendirilmiş", "Stable & Reinforced"),
      L(
        "Denge için geniş körüklü tabanla tasarlanan kraft kağıt torbalarımız dolduğunda dik durur; ekmek, hamur işi, sandviç ve paket siparişler için mükemmeldir. Güçlendirilmiş taban, ağır içeriklerde bile güvenilir performans sağlar.",
        "Designed with a wide gusset base for stability, our kraft paper bags stand upright when filled, making them perfect for bread, pastries, sandwiches, and takeaway orders. The reinforced bottom ensures reliable performance even with heavier contents."
      ),
      L("Doğası Gereği Yeşil", "Green by Nature"),
      L(
        "%100 geri dönüştürülebilir ve biyolojik olarak çözünebilir kraft kağıttan üretilen torbalarımız işletmenizin çevresel ayak izini azaltmasına yardımcı olur. İsteğe bağlı yağ geçirmez astarlı farklı boyut seçenekleriyle her ürüne ve servis tarzına uyum sağlar.",
        "Made from 100% recyclable and biodegradable kraft paper, our bags help your business reduce its environmental footprint. Available in a range of sizes with optional grease-resistant lining, they adapt to any product and any service style."
      ),
    ],
    quote: quote(L("Kraft Kağıt Torba - Teklif Formu", "Kraft Paper Bag - Inquiry Form"), [DIM.width, DIM.gusset, DIM.height], [...STD_OPTS, OPT.lining, OPT.sticker]),
    showOnHome: true,
  },
  {
    slug: "sapsiz-kagit-torba",
    slugEn: "no-handle-paper-bag",
    file: "no-handle-paper-bag",
    title: L("Kraft Düz Kağıt Torba", "Kraft Flat Paper Bag"),
    cardText: L(
      "Fırınlar, eczaneler ve hızlı servis gıda ambalajı için ideal, sade ve sapsız kraft torbalar.",
      "Simple, handleless kraft bags ideal for bakeries, pharmacies, and quick-service food packaging."
    ),
    listText: L("Hızlı servis için sade, sapsız torbalar.", "Simple, handleless bags for quick service."),
    intro: L(
      "Kraftora düz kağıt torbalar; fırınlar, eczaneler, perakende mağazaları ve gıda servisi için temiz ve minimal bir ambalaj çözümü sunar. Özel baskı seçenekli, gıdaya uygun kraft kağıttan üretilen torbalar sade ve işlevsel bir formatta zahmetsiz markalaşma sağlar.",
      "Kraftora flat paper bags offer a clean, minimal packaging solution for bakeries, pharmacies, retail stores, and food service. Made from food-safe kraft paper with custom printing options, they deliver effortless branding on a simple, functional format."
    ),
    sections: [
      L("Hızlı Doldurma, Kolay Kullanım", "Quick Fill, Easy Use"),
      L(
        "Hızlı doldurma ve kolay erişim için açık üst tasarımıyla sapsız kağıt torbalarımız yüksek hacimli operasyonlarda hız için üretilmiştir. Geniş yan körük, hacimli ürünlere yer açarken torbanın paketleme sırasında dik ve dengeli kalmasını sağlar.",
        "With an open-top design for quick filling and easy access, our handleless paper bags are built for speed in high-volume operations. The wide side gusset expands to accommodate bulkier items while keeping the bag upright and stable during packing."
      ),
      L("Çevre Dostu ve İstiflenebilir", "Eco-Friendly & Stackable"),
      L(
        "%100 geri dönüştürülebilir ve biyolojik olarak çözünebilir kraft kağıttan üretilen düz torbalarımız sürdürülebilirlik taahhütlerinizle uyumludur. Hafif ve istiflenerek kolayca depolanan torbalar, gıda uygulamaları için isteğe bağlı yağ geçirmez astarla farklı boyutlarda sunulur.",
        "Made from 100% recyclable and biodegradable kraft paper, our flat bags align with your sustainability commitments. Lightweight and easy to store in stacks, they are available in multiple sizes with optional grease-proof lining for food applications."
      ),
    ],
    quote: quote(L("Kraft Düz Kağıt Torba - Teklif Formu", "Kraft Flat Paper Bag - Inquiry Form"), [DIM.width, DIM.gusset, DIM.height], [...STD_OPTS, OPT.lining, OPT.sticker]),
    showOnHome: true,
  },
  {
    slug: "kagit-alisveris-cantasi",
    slugEn: "paper-shopping-bag",
    file: "paper-shopping-bag",
    title: L("Kraft Alışveriş Çantası", "Kraft Shopping Paper Bag"),
    cardText: L(
      "Kesme saplı, dayanıklı ve modern görünümlü kraft alışveriş çantaları; perakende, gıda ve etkinlik ambalajı için ideal.",
      "Durable, modern-looking kraft shopping bags with a die-cut handle, perfect for retail, food service, and event packaging."
    ),
    listText: L("Kesme saplı sağlam alışveriş çantaları.", "Sturdy shopping bags with die-cut handles."),
    intro: L(
      "Kraftora kağıt alışveriş çantaları dayanıklılığı şık ve modern bir görünümle birleştirir. Rahat taşıma için kesme saplı, yüksek mukavemetli kraft kağıttan üretilen çantalar perakende, gıda servisi ve etkinlik ambalajı için mükemmeldir. Özel baskı her çantayı markanız için yürüyen bir reklam panosuna dönüştürür.",
      "Kraftora shopping paper bags combine durability with a sleek, modern look. Made from high-strength kraft paper with a die-cut handle for comfortable carrying, they are perfect for retail, food service, and event packaging. Custom printing turns every bag into a walking billboard for your brand."
    ),
    sections: [
      L("Tek Parça Kesintisiz Tutuş", "Seamless One-Piece Grip"),
      L(
        "Entegre kesme sap, ek bağlantı gerektirmeden güvenli ve rahat bir tutuş sağlar; tek parça kesintisiz bir yapı oluşturur. Güçlendirilmiş taban körüğü çantanın formunu korumasını ve taşıma sırasında ağır içerikleri desteklemesini sağlar.",
        "The integrated die-cut handle provides a secure and comfortable grip without the need for additional attachments, creating a seamless one-piece construction. A reinforced bottom gusset ensures the bag holds its shape and supports heavier contents during transport."
      ),
      L("Sürdürülebilir ve Çok Yönlü", "Sustainable & Versatile"),
      L(
        "%100 geri dönüştürülebilir ve biyolojik olarak çözünebilir kraft kağıttan üretilen alışveriş çantalarımız sürdürülebilirlik taahhüdünüzü yansıtır. Düz katlanan tasarımı verimli depolama ve sevkiyat sağlarken farklı boyutlar ve isteğe bağlı selefon her ürün ve her etkinlik için doğru seçeneği sunar.",
        "Made from 100% recyclable and biodegradable kraft paper, our shopping bags reflect your commitment to sustainability. Their flat-fold design allows efficient storage and shipping, while a range of sizes and optional lamination ensure the right fit for any product or occasion."
      ),
    ],
    quote: quote(L("Kraft Alışveriş Çantası - Teklif Formu", "Kraft Shopping Bag - Inquiry Form"), [DIM.width, DIM.gusset, DIM.height], [...STD_OPTS, OPT.reinforcedBottom, OPT.lamination]),
    showOnHome: false,
  },
  {
    slug: "duz-sapli-kagit-canta",
    slugEn: "flat-handle-paper-bag",
    file: "flat-handle-paper-bag",
    title: L("Düz Saplı Kraft Kağıt Çanta", "Kraft Flat Handle Paper Bag"),
    cardText: L(
      "Entegre düz saplı, ilk bakışta markanızı yükselten premium kraft çantalar.",
      "Premium kraft bags with an integrated flat handle that elevate your brand at first glance."
    ),
    listText: L("Entegre düz saplı şık çantalar.", "Sleek bags with integrated die-cut handles."),
    intro: L(
      "Kraftora düz saplı kağıt çantalar, şık ve modern bir görünüm için entegre kesme saplı premium kraft kağıttan üretilir. Özel tam renkli baskı ve çeşitli boyut seçenekleriyle perakende, gıda servisi ve promosyon ambalajında markanızı ilk bakışta yükseltir.",
      "Kraftora flat handle paper bags are made from premium kraft paper with an integrated die-cut handle for a sleek, modern look. Custom full-color printing and a variety of size options make them ideal for retail, food service, and promotional packaging that elevates your brand at first glance."
    ),
    sections: [
      L("Rahat ve Güvenli Tutuş", "Comfortable, Secure Grip"),
      L(
        "Tek parça kesme sap, yapıştırma veya zımba gerektirmeden rahat ve güvenli bir tutuş sunar; temiz ve kesintisiz bir tasarım ortaya çıkar. Güçlendirilmiş körüklü taban çantayı dik ve dengeli tutar, taşıma sırasında ağır ürünleri güvenle destekler.",
        "The one-piece die-cut handle offers a comfortable, secure grip without any glued or stapled attachments, resulting in a clean and seamless design. A reinforced gusset base keeps the bag upright and stable, supporting heavier items with confidence during carry and transport."
      ),
      L("Sürdürülebilir ve Verimli", "Sustainable & Efficient"),
      L(
        "%100 geri dönüştürülebilir ve biyolojik olarak çözünebilir kraft kağıttan üretilen düz saplı çantalarımız sürdürülebilirlik taahhüdünüzü gösterir. Düz katlanan yapısı toplu depolama ve sevkiyatta verimlilik sağlarken isteğe bağlı selefon ve yağ geçirmez astar kullanımını gıda ve gıda dışı uygulamalara genişletir.",
        "Made from 100% recyclable and biodegradable kraft paper, our flat handle bags demonstrate your commitment to sustainability. Their flat-fold structure allows efficient bulk storage and shipping, while optional lamination and grease-proof lining extend their use across food and non-food applications."
      ),
    ],
    quote: quote(L("Düz Saplı Kraft Kağıt Çanta - Teklif Formu", "Kraft Flat Handle Paper Bag - Inquiry Form"), [DIM.width, DIM.gusset, DIM.height], [...STD_OPTS, OPT.lining, OPT.sticker]),
    showOnHome: false,
  },
  {
    slug: "burgu-sapli-kagit-canta",
    slugEn: "twisted-handle-paper-bag",
    file: "twisted-handle-paper-bag",
    title: L("Burgu Saplı Kraft Kağıt Çanta", "Kraft Twisted Handle Paper Bag"),
    cardText: L(
      "El burgusu kağıt ip saplı, premium hissiyatlı kraft çantalar; perakende, hediye ve etkinlik ambalajı için ideal.",
      "Premium-feel kraft bags with hand-twisted paper rope handles, ideal for retail, gifting, and event packaging."
    ),
    listText: L("Burgu kağıt saplı premium çantalar.", "Premium bags with twisted paper handles."),
    intro: L(
      "Kraftora burgu saplı kağıt çantalar, premium bir his için el burgusu kağıt ip saplı, yüksek mukavemetli kraft kağıttan üretilir. Tüm yüzeye özel baskı markanızı maksimum etkiyle sergilemenizi sağlar; perakende, hediye ve etkinlik ambalajı için idealdir.",
      "Kraftora twisted handle paper bags are made from high-strength kraft paper with hand-twisted paper rope handles for a premium feel. Custom printing across the full surface lets you showcase your brand with maximum impact, making them ideal for retail, gifting, and event packaging."
    ),
    sections: [
      L("Güçlü ve Rahat Taşıma", "Strong & Comfortable Carry"),
      L(
        "Güçlendirilmiş burgu saplar çantanın içine güvenle sabitlenir; ağır içeriklerde bile rahat ve güvenilir bir tutuş sağlar. Geniş körüklü taban çantaya raftan müşteriye kadar formunu koruyan dengeli, kendi başına duran bir yapı kazandırır.",
        "The reinforced twisted handles are securely anchored inside the bag, providing a comfortable and reliable grip even with heavier contents. A wide gusset base gives the bag a stable, self-standing structure that holds its shape from shelf to customer."
      ),
      L("Zarafet ve Çevre Sorumluluğu", "Elegance & Responsibility"),
      L(
        "%100 geri dönüştürülebilir ve biyolojik olarak çözünebilir kraft kağıttan üretilen burgu saplı çantalarımız zarafeti çevre sorumluluğuyla birleştirir. Geniş boyut ve gramaj seçenekleriyle butik alışveriş çantalarından büyük perakende taşıyıcılara kadar her ihtiyaca uyar.",
        "Made from 100% recyclable and biodegradable kraft paper, our twisted handle bags combine elegance with environmental responsibility. Available in a wide range of sizes and paper weights, they suit everything from boutique shopping bags to large retail carriers."
      ),
    ],
    quote: quote(L("Burgu Saplı Kraft Kağıt Çanta - Teklif Formu", "Kraft Twisted Handle Paper Bag - Inquiry Form"), [DIM.width, DIM.gusset, DIM.height], [...STD_OPTS, OPT.lining, OPT.sticker]),
    showOnHome: false,
  },
  {
    slug: "kagit-separator",
    slugEn: "paper-separators",
    file: "paper-seperators",
    title: L("Kraft Kağıt Separatör", "Kraft Paper Separators"),
    cardText: L(
      "Şişe, kozmetik, cam ve kırılgan ürünler için hassas bölmeli, her kutu formatına uyan kraft separatörler.",
      "Precision-fit kraft separators for bottles, cosmetics, glassware, and fragile goods that fit any box format."
    ),
    listText: L("Hassas bölmeli premium separatörler.", "Premium separators with precision-fit compartments."),
    intro: L(
      "Kraftora kraft kağıt separatörler, depolama ve taşıma sırasında ürünlerin birbirine çarpmasını önleyen bağımsız bölmeler oluşturmak üzere dayanıklı kartondan hassas kesimle üretilir. Izgara boyutu ve hücre ölçüleri tamamen özelleştirilebilir; şişe, kozmetik, cam eşya ve kırılgan ürünler için her kutu formatına kusursuz uyum sağlar.",
      "Kraftora kraft paper separators are precision-cut from durable cardboard to create individual compartments that prevent items from colliding during storage and transit. Fully customizable in grid size and cell dimensions, they fit seamlessly into any box format for bottles, cosmetics, glassware, and fragile goods."
    ),
    sections: [
      L("Darbe Emici Izgara", "Shock-Absorbing Grid"),
      L(
        "Geçmeli yuva tasarımı alet gerektirmeden hızlı kurulum sağlar ve darbeyi emip ağırlığı eşit dağıtan sert bir ızgara yapısı oluşturur. Her hücre ürünü tek tek izole edip yastıklayarak tedarik zinciri boyunca çizik, kırık ve hasarı ortadan kaldırır.",
        "The interlocking slot design allows quick, tool-free assembly and creates a rigid grid structure that absorbs shock and distributes weight evenly. Each cell isolates and cushions individual items, eliminating scratches, chips, and breakage throughout the supply chain."
      ),
      L("Düz Sevkiyat ve Markalanabilir", "Flat-Pack & Brandable"),
      L(
        "%100 geri dönüştürülebilir kraft kartondan üretilen separatörlerimiz plastik ve köpük dolgulara sürdürülebilir bir alternatif sunar. Düz sevk edilen tasarımı verimli taşıma ve depolama sağlar; dış kutuya uygulanan özel baskı işlevsel ambalajı markalı bir kutu açma deneyimine dönüştürür.",
        "Made from 100% recyclable kraft cardboard, our separators offer a sustainable alternative to plastic and foam inserts. Their flat-pack design ships and stores efficiently, and custom printing on the outer box transforms functional packaging into a branded unboxing experience."
      ),
    ],
    quote: quote(L("Kraft Kağıt Separatör - Teklif Formu", "Kraft Paper Separators - Inquiry Form"), [DIM.boxLength, DIM.boxWidth, DIM.dividerHeight], [OPT.interlock, OPT.edges, OPT.cells]),
    showOnHome: false,
  },
  {
    slug: "e-ticaret-kutusu",
    slugEn: "e-commerce-box",
    file: "e-commerce-box",
    title: L("Kraft E-Ticaret Kutusu", "Kraft E-Commerce Box"),
    cardText: L(
      "Güvenli sevkiyat ve depolama için üretilmiş ağır hizmet tipi oluklu kutular.",
      "Heavy-duty corrugated boxes built for safe shipping and storage."
    ),
    listText: L("Markalı kutu açma deneyimi sunan premium e-ticaret kutusu.", "Premium commercial box with branded unboxing."),
    intro: L(
      "Kraftora e-ticaret kutuları, kapatmak için bant veya yapıştırıcı gerektirmeyen kendinden kilitli kapaklı oluklu kraft kartondan üretilir. Hem dış hem iç yüzeye uygulanan özel baskı, her teslimatı müşterileriniz için unutulmaz bir markalı kutu açma deneyimine dönüştürür.",
      "Kraftora e-commerce boxes are built from corrugated kraft cardboard with a self-locking tuck-top lid that requires no tape or adhesive to close. Custom printing on both exterior and interior surfaces turns every delivery into a memorable branded unboxing experience for your customers."
    ),
    sections: [
      L("Sevkiyata Hazır Yapı", "Shipping-Ready Construction"),
      L(
        "Kurye ve posta ağlarının zorlu koşullarına dayanacak şekilde tasarlanan e-ticaret kutularımız çift duvarlı oluklu kenarlara ve ezilmeye ve sıkışmaya direnen sert bir yapıya sahiptir. Sıkı geçmeli kapak, ek bir kapatma olmaksızın içeriği elleçleme ve taşıma boyunca güvende tutar.",
        "Designed to withstand the demands of courier and postal networks, our e-commerce boxes feature double-wall corrugated edges and a rigid structure that resists crushing and compression. The snug interlocking closure keeps contents secure throughout handling and transit without additional sealing."
      ),
      L("Sürdürülebilir ve Yerden Tasarruflu", "Sustainable & Space-Efficient"),
      L(
        "%100 geri dönüştürülebilir kraft kartondan üretilen e-ticaret kutularımız profesyonel düzeyde koruma sunarken sürdürülebilirlik hedeflerinizi destekler. Düz sevk edilen tasarımı depo alanını ve nakliye maliyetlerini azaltır; kozmetikten elektroniğe her ürüne uygun geniş boyut seçenekleri sunar.",
        "Made from 100% recyclable kraft cardboard, our e-commerce boxes support your sustainability goals while delivering professional-grade protection. Their flat-pack design minimizes warehouse footprint and shipping costs, with a wide range of sizes to fit everything from cosmetics to electronics."
      ),
    ],
    quote: quote(L("Kraft E-Ticaret Kutusu - Teklif Formu", "Kraft E-Commerce Box - Inquiry Form"), [DIM.length, DIM.width, DIM.height], [OPT.foil, OPT.emboss, OPT.deboss, OPT.lamination]),
    showOnHome: true,
  },
  {
    slug: "kraft-koli",
    slugEn: "cardboard-box",
    file: "cardboard-box",
    title: L("Kraft Koli", "Kraft Cardboard Box"),
    cardText: L(
      "Depolama, sevkiyat ve lojistik için ağır hizmet tipi oluklu kraft koliler; özel ölçü, baskı ve taşıma sembolleriyle.",
      "Heavy-duty corrugated kraft boxes for storage, shipping, and logistics, with custom sizing, printing, and handling symbols."
    ),
    listText: L("Endüstriyel dayanıklılıkta premium koli.", "Premium cardboard box with industrial strength."),
    intro: L(
      "Kraftora koliler, her sektörde depolama, sevkiyat ve lojistik ihtiyaçlarını karşılamak üzere ağır hizmet tipi oluklu kraft mukavvadan üretilir. Özel ölçü, baskı ve taşıma sembolleri gönderilerinizin güvenli, düzenli ve markanıza uygun biçimde ulaşmasını sağlar.",
      "Kraftora cardboard boxes are manufactured from heavy-duty corrugated kraft board, engineered to handle storage, shipping, and logistics across every industry. Custom sizing, printing, and handling symbols ensure your shipments arrive safe, organized, and on brand."
    ),
    sections: [
      L("Ağır Hizmet Koruması", "Kraft Heavy-Duty Protection"),
      L(
        "Çok katmanlı oluklu duvarlarla üretilen kolilerimiz depolama ve uzun mesafe taşımacılıkta üstün ezilme direnci ve istifleme mukavemeti sunar. Güçlendirilmiş kapak kilitleri tüm tedarik zinciri boyunca basınç altında sağlam kalan güvenli bir kapanış sağlar.",
        "Built with multi-layer corrugated walls, our cardboard boxes deliver superior crush resistance and stacking strength for warehousing and long-distance transport. Reinforced flap closures provide a secure seal that holds firm under pressure throughout the entire supply chain."
      ),
      L("Ölçeklenebilir ve Geri Dönüştürülebilir", "Scalable & Recyclable"),
      L(
        "%100 geri dönüştürülebilir oluklu krafttan üretilen kolilerimiz her yük gereksinimine uygun geniş ölçü ve duvar kalınlığı seçenekleriyle sunulur. Düz sevkiyat depolama maliyetlerini düşük tutar ve paketleme hattında hızlı kurulum sağlar.",
        "Made from 100% recyclable corrugated kraft, our cardboard boxes are available in a full range of dimensions and wall thicknesses to match any load requirement. Flat-pack delivery keeps storage costs low and allows rapid assembly on the packing line."
      ),
    ],
    quote: quote(L("Kraft Koli - Teklif Formu", "Kraft Cardboard Box - Inquiry Form"), [DIM.length, DIM.width, DIM.height], [...STD_OPTS, OPT.handHoles, OPT.corners, OPT.stacking, OPT.pallet]),
    showOnHome: false,
  },
];

// ---------- Blog yazıları ----------

type SeedPost = {
  slug: string;
  slugEn: string;
  cover: string;
  date: string;
  readMinutes: number;
  title: L;
  excerpt: L;
  body: L;
};

const BLOG: SeedPost[] = [
  {
    slug: "kraft-kagit-uzerine-ozel-baski-bilmeniz-gerekenler",
    slugEn: "custom-printing-on-kraft-paper-what-you-need-to-know",
    cover: "/blog/kraft-baski.jpg",
    date: "2026-05-05",
    readMinutes: 8,
    title: L("Kraft Kağıt Üzerine Özel Baskı: Bilmeniz Gerekenler", "Custom Printing on Kraft Paper: What You Need to Know"),
    excerpt: L(
      "Özel baskı, sade kraft ambalajı güçlü bir markalaşma aracına dönüştürür. Teknikler, baskıya hazırlık ve en iyi sonucu almak için bilmeniz gereken her şey burada.",
      "Custom printing transforms plain kraft packaging into a powerful branding tool. Here’s everything you need to know about techniques, artwork preparation, and getting the best results."
    ),
    body: L(
      `## Doğal Kraft Avantajı

Sade bir kraft kutu ürününüzü korur. Baskılı bir kraft kutu ise ürününüzü korur ve markanızı satar. İkisi arasındaki fark, çoğu zaman müşterinin sizi hatırlaması ile ambalaj geri dönüşüm kutusuna gittiği anda unutması arasındaki belirleyici etkendir.

Kraft kağıt üzerine özel baskı uzun bir yol kat etti. Bir zamanlar basit tek renkli logolarla sınırlı olan baskı, artık tam renkli fotoğrafları, ayrıntılı desenleri, metalik yaldızları ve dokulu yüzey işlemlerini kapsıyor. İşletmeniz için markalı ambalaj düşünüyorsanız, başlamadan önce bilmeniz gerekenler burada.

Tekniklere geçmeden önce kraft kağıdın baskı yüzeyi olarak neden benzersiz olduğunu anlamakta fayda var. Beyaz kuşe kartonun aksine kraft, tasarımınızın altından görünen sıcak, toprak tonunda bir kahverengiye sahiptir. Bu bir kısıtlama değil, bir özelliktir.

Doğal zemin, günümüz tüketicisinin ilgisini çeken organik ve samimi bir estetik yaratır. Gıda, moda, güzellik ve yaşam tarzı sektörlerindeki markalar kraftı bilinçli olarak tercih eder; çünkü kraft tek kelime etmeden sürdürülebilirliği, zanaatkârlığı ve dürüstlüğü anlatır.

Ancak bu kahverengi zemin renklerin görünümünü etkiler. Parlak beyazlar beyaz görünmez; hafif sıcak ya da soluk çıkar. Canlı renkler biraz daha koyuya kayabilir. Bunu baştan bilmek, malzemeye karşı değil malzemeyle birlikte çalışan tasarımlar yapmanıza yardımcı olur.

## Baskı Teknikleri

Kraft kağıda baskı yapmanın birkaç yolu vardır; her birinin farklı güçlü yanları, maliyetleri ve ideal kullanım alanları bulunur.

Fleksografik baskı ambalaj sektörünün iş atıdır. Mürekkebi esnek kalıplarla doğrudan kağıda yüksek hızda aktarır. Büyük tirajlarda ekonomiktir, bir ila dört rengi başarıyla basar ve temiz, tutarlı sonuçlar verir. Pizza kutuları, torbalar ve tabaklar gibi gıda ambalajlarının çoğu fleksografik baskıyla üretilir.

Ofset baskı fleksoya göre daha yüksek ayrıntı ve renk doğruluğu sunar. Karmaşık tasarımlar, geçişler ve fotoğraf görselleri için tercih edilen yöntemdir. Hazırlık maliyeti daha yüksektir ama baskı kalitesi belirgin biçimde daha nettir. Perakende ambalajı, premium gıda kutuları ve görsel ayrıntının önemli olduğu her uygulama için en iyi seçenektir.

Dijital baskı kalıp hazırlama adımını tamamen atlar ve doğrudan dijital dosyadan basar. Bu onu kısa tirajlar, prototipler ve her ambalajın farklı metin ya da görsel taşıyabildiği değişken veri baskısı için ideal kılar. Ölçekte birim maliyeti flekso veya ofsetten yüksektir, ancak neredeyse hiç hazırlık maliyeti olmadığından büyük siparişten önce tasarımları test etmek için mükemmeldir.

Serigrafi baskı, mürekkebi elek üzerinden kalın katmanlar halinde uygular ve kraft yüzeyde öne çıkan cesur, örtücü renkler yaratır. Maksimum renk etkisi gereken basit logolar ve tasarımlar için yaygın olarak kullanılır. Kraft üzerine beyaz mürekkeple serigrafi özellikle çarpıcı bir etki verir.

## Mürekkebin Ötesi

Baskı yalnızca başlangıç noktasıdır. Birkaç yüzey işlemi kraft ambalajınızı iyiden mükemmele taşıyabilir.

Yaldız baskı; altın, gümüş, bakır veya renkli ince bir metalik katmanı tasarımınızın belirli alanlarına uygular. Kahverengi kraft kutu üzerindeki altın yaldız logo tartışmasız bir premium his yaratır. İşlem, yaldızı ısı ve basınçla kağıda bağlar; ışığı ve dikkati yakalayan bir yüzey ortaya çıkar.

Kabartma, tasarımınızın belirli öğelerini kağıt yüzeyinin üstüne çıkararak parmak uçlarınızla hissedebileceğiniz üç boyutlu bir doku oluşturur. Logonuz, bir desen ya da metin kabartılarak düz baskının asla veremeyeceği dokunsal bir boyut kazanır.

Gofre tam tersini yapar: öğeleri kağıt yüzeyine bastırarak çukur bir etki yaratır. Kraft kağıtta gofre, tasarımınıza derinlik ve sofistike bir hava katan ince gölgeler oluşturur. Ambalajının bağırmadan premium hissettirmesini isteyen minimalist markalar için özellikle uygundur.

Kısmi UV lak, tasarımınızın seçili alanlarına parlak, kabarık bir vernik uygularken yüzeyin geri kalanını mat bırakır. Parlak UV öğeler ile doğal kraft dokusu arasındaki kontrast, bakışı tam istediğiniz yere çeken çarpıcı bir görsel etki yaratır.

## Tasarım Dosyanızı Hazırlamak

Baskılı ambalajınızın kalitesi büyük ölçüde sağladığınız tasarım dosyasına bağlıdır. Dosyalarınızı üretime göndermeden önce doğru yapmanız gereken temel gereklilikler şunlardır.

Çözünürlük önemlidir. Tüm görseller gerçek baskı boyutunda en az 300 DPI olmalıdır. Ekranda iyi görünen düşük çözünürlüklü görseller baskıda bulanık ve pikselli çıkar. Logo, metin ve geometrik şekiller gibi vektör grafikler her zaman rasterleştirilmiş görsel yerine vektör formatında teslim edilmelidir.

Renk modu RGB değil CMYK olmalıdır. Ekranınız renkleri RGB olarak gösterir, baskı ise CMYK mürekkepleri kullanır. Tasarımınızı baskıya göndermeden önce CMYK'ya çevirmek, provada gördüğünüz renklerin nihai üründekine yakın olmasını sağlar. Kraft üzerindeki CMYK'nın beyaz kağıttaki CMYK'dan her zaman farklı görüneceğini unutmayın; gerçek sonucu görmek için fiziksel prova isteyin.

Taşma payı, kesim çizgisinin ötesindeki ekstra alandır; tasarımınızın baskısız bir kenar bırakmadan ambalajın en ucuna kadar uzanmasını sağlar. Standart taşma payı her kenarda 3 mm'dir. Tasarımınızda kenara değen renk veya görseller varsa bunları taşma alanına uzatmanız gerekir.

Bıçak izi, ambalajınızın tam şeklini gösteren şablondur: nerede katlanır, nerede kesilir ve yapıştırma kulakları nerededir. Bu dosyayı ambalaj tedarikçiniz sağlamalıdır. Düz tabaka üç boyutlu kutuya katlandığında her şeyin kusursuz hizalanması için tasarımınızı bıçak izinin üzerine yerleştirin.

## Beyaz Mürekkep: Oyunu Değiştiren Unsur

Beyaz kağıtta beyazı bedavaya alırsınız; basılmamış yüzeyin ta kendisidir. Kraftta ise beyaz yoktur. Basmadığınız her alan doğal kahverengi tonu gösterir.

Beyaz mürekkebin vazgeçilmez hale geldiği nokta burasıdır. Renklerinizin altına bir beyaz mürekkep katmanı basmak, o renklerin daha parlak ve orijinal tasarımınıza daha sadık görünmesini sağlayan örtücü bir zemin oluşturur. Beyaz alt zemin olmadan doğrudan krafta basılan renkler soluk ve yarı saydam olur.

Üç seçeneğiniz var. Beyaz kullanmadan tasarlayıp kahverengi tonu kucaklayarak renk paletinizin bir parçası yapabilirsiniz. Logo, önemli metinler ya da ana görseller gibi belirli öğelerin altında seçici beyaz kullanıp tasarımın geri kalanının kraft yüzeyle etkileşmesine izin verebilirsiniz. Ya da tüm tasarımınızın altına tam beyaz zemin uygulayarak kahverengi kağıt üzerinde beyaz bir tuval yaratabilirsiniz.

Her yaklaşım tamamen farklı bir estetik ortaya çıkarır. En iyi seçim marka kimliğinize ve hedeflediğiniz görsel etkiye bağlıdır.

## Minimum Sipariş Adetleri ve Maliyet

Özel baskı; kalıp, bıçak ve hazırlık için başlangıç yatırımı gerektirir. Bu da baskının ekonomik olmasını sağlayan bir minimum sipariş adedi olduğu anlamına gelir.

Fleksografik baskıda minimum siparişler, tasarımın karmaşıklığına ve ambalajın boyutuna bağlı olarak genellikle 1.000 ila 5.000 adet civarından başlar. Ofset baskı minimumları da benzerdir. Dijital baskı 50-100 adet gibi düşük miktarlardan başlayabilir, ancak birim maliyet belirgin biçimde daha yüksektir.

Adet arttıkça birim maliyet önemli ölçüde düşer. 1.000 adette kutu başına yüksek bir maliyeti olan tasarım, 10.000 adette bunun küçük bir kesrine mal olabilir. Sürekli tedarik ihtiyacınız olacağını biliyorsanız, daha büyük bir ilk sipariş vermek çoğu zaman finansal olarak mantıklıdır.

## Kaçınılması Gereken Yaygın Hatalar

Beyaz kağıt için tasarlayıp kraftta aynı görünmesini beklemek. Tasarımınızı kesinleştirmeden önce mutlaka kahverengi zemin üzerinde önizleyin.

Özellikle fleksografik baskıda küçük boyutlarda temiz çıkmayabilecek ince yazı tipleri ve ince detaylar kullanmak. Gövde metninde minimum yazı boyutunu 7 punto, kalın başlıklarda 5 punto üzerinde tutun.

Katlanma çizgilerini hesaba katmayı unutmak. Düz yerleşimde tam ortada görünen bir öğe, kutu kurulduğunda kaymış ya da bölünmüş görünebilir. Tasarımınızı her zaman katlanmış bir mockup üzerinde kontrol edin.

Prova aşamasını atlamak. Ekranınızdaki dijital mockup, kağıt üzerindeki mürekkeple aynı şey değildir. Tam üretimi onaylamadan önce mutlaka fiziksel baskılı numune isteyin. Provanın küçük maliyeti ve kısa gecikmesi sizi pahalı bir hatadan kurtarabilir.

## Markanız İçin İşe Yarar Hale Getirmek

Kraft üzerine özel baskı, her santimetrekareyi mürekkeple kaplamak değildir. En etkili kraft ambalaj tasarımları doğal malzemeyi bir tasarım öğesi olarak kullanır: kahverengi tonun nefes almasına izin verir, boşlukları stratejik kullanır ve markanızı net biçimde anlatacak kadar baskı ekler.

Ham kraft üzerinde temiz tipografili tek renkli bir logo, çoğu zaman dört renkle tamamen basılmış bir tasarımdan daha premium görünür. Malzemenin kendisi bu kadar güçlü bir görsel karakter taşıdığında, az gerçekten çoktur.

Kraftora'da baskı sürecinin her aşamasında işletmelerle çalışıyoruz: ilk konsept ve tasarım hazırlığından prova, üretim ve teslimata kadar. İster 500 baskılı pizza kutusu ister 50.000 markalı alışveriş çantası gerekiyor olsun, nihai ürünün vizyonunuzla tam olarak örtüşmesini sağlıyoruz.`,
      `## The Natural Kraft Advantage

A plain kraft box protects your product. A printed kraft box protects your product and sells your brand. The difference between the two is often the deciding factor in whether a customer remembers you or forgets you the moment the packaging hits the recycling bin.

Custom printing on kraft paper has come a long way. What was once limited to simple one-color logos now includes full-color photography, intricate patterns, metallic foils, and textured finishes. If you’re considering branded packaging for your business, here’s what you need to know before you start.

Before diving into techniques, it’s worth understanding what makes kraft paper unique as a print surface. Unlike white coated cardboard, kraft has a warm, earthy brown tone that shows through your design. This isn’t a limitation — it’s a feature.

The natural background creates an organic, authentic aesthetic that resonates with today’s consumers. Brands across food, fashion, beauty, and lifestyle industries deliberately choose kraft because it communicates sustainability, craftsmanship, and honesty without saying a single word.

However, this brown base does affect how colors appear. Bright whites won’t look white — they’ll appear slightly warm or muted. Vibrant colors may shift slightly darker. Understanding this from the beginning helps you design artwork that works with the material rather than against it.

## Printing Techniques Explained

There are several ways to print on kraft paper, each with different strengths, costs, and ideal use cases.

Flexographic printing is the workhorse of the packaging industry. It uses flexible plates to transfer ink directly onto the paper at high speed. It’s cost-effective for large runs, handles one to four colors well, and produces clean, consistent results. Most food packaging — pizza boxes, bags, trays — uses flexographic printing.

Offset printing delivers higher detail and color accuracy than flexography. It’s the preferred method for complex designs, gradients, and photographic images. The setup cost is higher, but the print quality is noticeably sharper. This method works best for retail packaging, premium food boxes, and any application where visual detail matters.

Digital printing skips the plate-making step entirely, printing directly from a digital file. This makes it ideal for short runs, prototyping, and variable data printing where each package might have different text or images. The cost per unit is higher than flexo or offset at scale, but there’s virtually no setup cost, making it perfect for testing designs before committing to a large order.

Screen printing applies thick layers of ink through a mesh screen, creating bold, opaque colors that stand out against the kraft surface. It’s commonly used for simple logos and designs where maximum color impact is needed. White ink screen printing on kraft creates a particularly striking effect.

## Going Beyond Ink

Printing is just the starting point. Several finishing techniques can elevate your kraft packaging from good to exceptional.

Foil stamping applies a thin metallic layer — gold, silver, copper, or colored foil — onto specific areas of your design. A gold foil logo on a brown kraft box creates an unmistakable premium feel. The process uses heat and pressure to bond the foil to the paper, resulting in a finish that catches light and attention.

Embossing raises specific elements of your design above the paper surface, creating a three-dimensional texture you can feel with your fingertips. Your logo, a pattern, or even text can be embossed to add a tactile dimension that flat printing simply can’t achieve.

Debossing does the opposite — pressing elements into the paper surface to create an indented effect. On kraft paper, debossing creates subtle shadows that give your design depth and sophistication. It works especially well for minimalist brands that want their packaging to feel premium without being loud.

Spot UV coating applies a glossy, raised varnish to selected areas of your design while leaving the rest of the surface matte. The contrast between the shiny UV elements and the natural kraft texture creates a visually striking effect that draws the eye exactly where you want it.

## Preparing Your Artwork

The quality of your printed packaging depends heavily on the artwork file you provide. Here are the key requirements to get right before sending your files to production.

Resolution matters. All images should be at least 300 DPI at the actual print size. Low-resolution images that look fine on screen will appear blurry and pixelated in print. Vector graphics — logos, text, and geometric shapes — should always be supplied in vector format rather than rasterized images.

Color mode should be CMYK, not RGB. Your screen displays colors in RGB, but printing uses CMYK inks. Converting your design to CMYK before sending it to print ensures that the colors you see on your proof are close to what you’ll get on the final product. Keep in mind that CMYK on kraft will always look different than CMYK on white paper — request a physical proof to see the actual result.

Bleed area is the extra space beyond the trim line that ensures your design extends all the way to the edge of the package without leaving an unprinted border. Standard bleed is 3mm on each side. If your design has colors or images that touch the edge, you must extend them into the bleed area.

Die line is the template that shows the exact shape of your package — where it folds, where it cuts, and where glue tabs are. Your packaging supplier should provide this file. Design your artwork on top of the die line to ensure everything aligns perfectly when the flat sheet is folded into a three-dimensional box.

## White Ink: The Game Changer

On white paper, you get white for free — it’s just the unprinted surface. On kraft, there is no white. Every area you don’t print shows the natural brown tone.

This is where white ink becomes essential. Printing a layer of white ink beneath your colors creates an opaque base that makes those colors appear brighter and truer to your original design. Without the white underbase, colors printed directly on kraft will be muted and translucent.

You have three options. Design with no white, embracing the brown tone and using it as part of your color palette. Use selective white under specific elements — your logo, key text, or hero images — while letting the rest of the design interact with the kraft surface. Or use a full white flood coat under your entire design, effectively creating a white canvas on brown paper.

Each approach creates a completely different aesthetic. The best choice depends on your brand identity and the visual impact you’re going for.

## Minimum Order Quantities and Cost

Custom printing requires an initial investment in plates, dies, and setup. This means there’s typically a minimum order quantity that makes printing economically viable.

For flexographic printing, minimum orders usually start around 1,000 to 5,000 units depending on the complexity of the design and the size of the package. Offset printing minimums are similar. Digital printing can start as low as 50 to 100 units, but the per-unit cost is significantly higher.

The cost per unit drops substantially as quantity increases. A design that costs a significant amount per box at 1,000 units might cost a fraction of that at 10,000 units. If you know you’ll need ongoing supply, committing to a larger initial order often makes financial sense.

## Common Mistakes to Avoid

Designing for white paper and expecting it to look the same on kraft. Always preview your design on a brown background before finalizing.

Using thin fonts or fine details that may not reproduce cleanly at small sizes, especially with flexographic printing. Keep minimum font size above 7pt for body text and 5pt for bold headlines.

Forgetting to account for the fold lines. A design element that looks perfectly centered on a flat layout might appear off-center or broken when the box is assembled. Always check your artwork on a folded mockup.

Skipping the proof stage. A digital mockup on your screen is not the same as ink on paper. Always request a physical printed sample before approving a full production run. The small cost and short delay of a proof can save you from an expensive mistake.

## Making It Work for Your Brand

Custom printing on kraft is not about covering every square centimeter with ink. The most effective kraft packaging designs use the natural material as a design element — letting the brown tone breathe, using negative space strategically, and adding just enough print to communicate your brand clearly.

A single-color logo with clean typography on raw kraft often looks more premium than a fully printed four-color design. Less can genuinely be more when the material itself carries so much visual character.

At Kraftora, we work with businesses at every stage of the print process — from initial concept and artwork preparation to proofing, production, and delivery. Whether you need 500 printed pizza boxes or 50,000 branded shopping bags, we make sure the final product matches your vision exactly.`
    ),
  },
  {
    slug: "gida-isletmeniz-icin-dogru-ambalaji-nasil-secersiniz",
    slugEn: "how-to-choose-the-right-packaging-for-your-food-business",
    cover: "/blog/gida-ambalaji.jpg",
    date: "2026-05-05",
    readMinutes: 7,
    title: L("Gıda İşletmeniz İçin Doğru Ambalajı Nasıl Seçersiniz", "How to Choose the Right Packaging for Your Food Business"),
    excerpt: L(
      "Doğru gıda ambalajını seçmek, ürün tazeliğinden müşteri algısına kadar her şeyi etkiler. Menünüz ve markanız için mükemmel uyumu bulmanın pratik rehberi.",
      "Choosing the right food packaging affects everything from product freshness to customer perception. Here’s a practical guide to finding the perfect fit for your menu and brand."
    ),
    body: L(
      `## Ambalajdan Değil, Ürününüzden Başlayın

Yemeğiniz olağanüstü olabilir; ama müşteriye sünmüş, ezilmiş ya da sızdırmış halde ulaşıyorsa bunun hiçbir önemi kalmaz. Ambalaj, mutfağınız ile müşterinizin masası arasındaki son adımdır ve her seferinde kusursuz performans göstermelidir.

İster bir fast food zinciri, ister butik bir fırın, ister bir bulut mutfak işletiyor olun, doğru ambalajı seçmek vereceğiniz en önemli operasyonel kararlardan biridir. İşte nasıl yaklaşmanız gerektiği.

İşletmelerin yaptığı en yaygın hata, ambalajı yalnızca görünüşe göre seçmektir. Bunun yerine ürününüz hakkında şu soruları sorarak başlayın:

Sıcak mı, soğuk mu? Sıcak ürünler buhar birikimini önlemek için havalandırmaya, soğuk ürünler ise sıcaklığı korumak için yalıtıma ihtiyaç duyar. Havalandırma delikli bir pizza kutusu, sıkı kapaklı kapalı bir salata kasesinden tamamen farklı bir sorunu çözer.

Kuru mu, yağlı mı, yoksa sıvı bazlı mı? Hamburger, kızartma ve hamur işleri için yağ geçirmez kaplama şarttır. Çorba ve noodle yemekleri güvenli kapanışlı sızdırmaz kaplar gerektirir. Kaplamayı ürününüze göre seçmek utandırıcı dökülmeleri ve lekeli ambalajları önler.

Ambalajda ne kadar kalacak? Yerinde tüketim ambalajının ömrü dakikalarla ölçülür. Teslimat ambalajının ise 30-60 dakikalık taşıma, istifleme ve elleçlemeye dayanması gerekebilir. Yolculuk ne kadar uzunsa o kadar fazla yapısal dayanıklılık gerekir.

## Malzeme Seçeneklerini Anlamak

Her kraft ambalaj aynı değildir. Seçtiğiniz malzeme performansı, maliyeti ve marka algısını doğrudan etkiler.

Standart kraft karton; fırın ürünleri, sandviçler ve hafif atıştırmalıklar gibi kuru ürünler için iyi çalışır. Uygun fiyatlıdır, tamamen baskıya uygundur, kolay katlanır ve kurulur.

Oluklu kraft, ekstra sertlik için dalgalı bir iç katman ekler. Pizza kutuları, sevkiyat kapları ve istifleme mukavemetinin önemli olduğu her uygulama için başvurulacak seçenektir.

Kaplamalı kraft, iç yüzeyinde ince ve gıdaya uygun bir bariyer taşır. Bu yağ geçirmez veya neme dayanıklı katman; hamburger, patates, kase ve soslu ya da yağlı her ürün için kritik önemdedir.

Mikro dalga kraft, standart ile oluklu arasında yer alır: geleneksel olukludan daha ince, ancak düz kartondan çok daha güçlüdür. Ciddi koruma ile şık bir görünümü bir arada istediğiniz premium hamburger kutuları ve yemek setleri için idealdir.

## Boyut Sandığınızdan Daha Önemli

Büyük ambalaj malzeme israfına yol açar, nakliye maliyetini artırır ve yemeğinizin taşıma sırasında kaymasına neden olur. Küçük ambalaj ise ürününüzü ezer ve müşteriyi hayal kırıklığına uğratır.

İdeal ambalaj, ürününüze her kenarda yaklaşık bir santimetre boşluk bırakacak şekilde oturur. Bu, aşırı hareket olmadan kolay çıkarmaya yetecek alan sağlar. Hamburger ve döner dürüm gibi ürünlerde sıkı bir oturma, teslimat sırasında ürünün formunu korumasına gerçekten yardımcı olur.

Özel ölçü uzlaşmayı ortadan kaldırır. Menünüzü standart kutu ölçülerine uydurmak yerine kutuyu ürününüzün etrafında inşa ettirin.

## Markalaşma İsteğe Bağlı Değil

Sade kahverengi ambalaj işi görür, ama baskılı ambalaj marka inşa eder. Mutfağınızdan çıkan her torba, kutu ve kase; müşteriniz, ailesi, iş arkadaşları ve dükkânınızla varış noktası arasındaki sokaktaki herkes tarafından görülen hareketli bir reklamdır.

En azından logonuzu ve marka renklerinizi ekleyin. Bunun ötesinde web sitenizi, sosyal medya hesaplarınızı, menünüze bağlanan bir QR kodu ya da kapağın iç yüzüne kısa bir marka mesajı eklemeyi düşünün. Kutu açma anı, çoğu gıda işletmesinin tamamen gözden kaçırdığı bir pazarlama fırsatıdır.

Kraft yüzeylere tam renkli baskı, sıradan beyaz kaplar denizinde öne çıkan ayırt edici bir görünüm yaratır. Doğal kahverengi ton, günümüz tüketicisinin aktif olarak aradığı iki niteliği anlatır: sahicilik ve sürdürülebilirlik.

## Pratik Ayrıntıları Unutmayın

Birkaç küçük ayrıntı müşteri deneyimini büyük ölçüde iyileştirebilir:

Kolay açılır kapaklar müşterinizi ambalajla boğuşmaktan kurtarır. Yırtma şeritleri, kilitli kulaklar ve perforeli açıklıklar fark yaratır.

Pizza ve kızartma ambalajındaki havalandırma delikleri, yoğuşmanın çıtır ürünleri sündürmesini önler. Bu deliklerin yeri ve boyutu önemlidir: çok fazlaysa yemek hızla soğur, çok azsa nem birikir.

İstiflenebilirlik teslimat operasyonları için kritiktir. Ambalajınız teslimat çantasında güvenle istiflenemiyorsa kuryeniz zorlanır ve yemeğiniz zarar görür.

Düz sevkiyat, ambalajınızın kurulmamış halde gelmesi ve minimum depo alanı kaplaması demektir. Hızlı kurulum tasarımları, mutfak ekibinizin yoğun serviste saniyeler içinde katlayıp doldurmasına olanak tanır.

## Sürdürülebilirlik Faktörü

Müşterileriniz çevreyi önemsiyor ve ambalajınız değerleriniz hakkında çok şey söylüyor. Plastik veya strafor alternatifler yerine geri dönüştürülebilir, biyolojik olarak çözünebilir kraft ambalaj seçmek yalnızca sorumlu bir davranış değil, artık bir beklenti.

Pek çok belediye tek kullanımlık plastik gıda kaplarına yasak getiriyor. Şimdi krafta geçmek, yeni düzenlemelere uyum için sonradan telaşa kapılmamanız anlamına gelir. Ayrıca müşterilerinizle paylaşabileceğiniz gerçek bir sürdürülebilirlik hikâyesi kazandırır; bu da zamanla güven ve sadakat oluşturur.

## Nihai Kararı Vermek

Doğru ambalaj beş faktörü dengeler: ürün koruması, marka sunumu, operasyonel verimlilik, maliyet ve çevresel etki. Hiçbir seçenek her ürün için mükemmel değildir; bu yüzden pek çok gıda işletmesi menüsünde farklı ambalaj formatları kullanır: hamburger için kutu, salata için kase, fırın ürünleri için torba ve atıştırmalıklar için tabak.

En iyi yaklaşım, özel ihtiyaçlarınızı anlayan ve ölçekli özel çözümler üretebilen bir ambalaj ortağıyla çalışmaktır. Numune isteyin, gerçek ürünlerinizle test edin ve büyük sipariş vermeden önce ekibinizden geri bildirim alın.

Kraftora'da gıda işletmelerine bu süreçte her gün rehberlik ediyoruz. Doğru malzeme ve boyutu seçmekten özel baskı tasarlamaya ve mükemmel yüzey işlemini belirlemeye kadar, ambalajınızın mutfağınız kadar sıkı çalışmasını sağlıyoruz.`,
      `## Start with Your Product, Not the Package

Your food might be outstanding, but if it arrives soggy, crushed, or leaking, none of that matters. Packaging is the final step between your kitchen and your customer’s table — and it needs to perform flawlessly every single time.

Whether you run a fast food chain, a boutique bakery, or a cloud kitchen, selecting the right packaging is one of the most important operational decisions you’ll make. Here’s how to approach it.

The most common mistake businesses make is choosing packaging based on looks alone. Instead, start by asking these questions about your product:

Is it hot or cold? Hot items need ventilation to prevent steam buildup, while cold items need insulation to maintain temperature. A pizza box with ventilation holes solves a completely different problem than a sealed salad bowl with a tight-fitting lid.

Is it dry, oily, or liquid-based? A grease-proof coating is essential for burgers, fried foods, and pastries. Soups and noodle dishes require leak-proof containers with secure closures. Matching the coating to your product prevents embarrassing spills and stained packaging.

How long will it be in the package? Dine-in packaging has a lifespan of minutes. Delivery packaging might need to survive 30 to 60 minutes of transport, stacking, and handling. The longer the journey, the more structural strength you need.

## Understanding Material Options

Not all kraft packaging is created equal. The material you choose directly impacts performance, cost, and brand perception.

Standard kraft cardboard works well for dry items like bakery goods, sandwiches, and light snacks. It’s affordable, fully printable, and easy to fold and assemble.

Corrugated kraft adds a fluted inner layer for extra rigidity. This is the go-to choice for pizza boxes, shipping containers, and any application where stacking strength matters.

Coated kraft features a thin food-safe barrier on the inner surface. This grease-proof or moisture-resistant layer is critical for burgers, fries, bowls, and anything with sauces or oils.

Micro-flute kraft sits between standard and corrugated — thinner than traditional corrugated but significantly stronger than flat cardboard. It’s ideal for premium burger boxes and meal kits where you want a sleek look with serious protection.

## Size Matters More Than You Think

Oversized packaging wastes material, increases shipping costs, and makes your food slide around during transport. Undersized packaging crushes your product and frustrates customers.

The ideal package fits your product with roughly one centimeter of clearance on each side. This provides enough room for easy removal without excessive movement. For items like burgers or döner wraps, a snug fit actually helps maintain the product’s shape during delivery.

Custom sizing eliminates the compromise. Instead of adapting your menu to fit standard box dimensions, have the box built around your product.

## Branding Is Not Optional

Plain brown packaging gets the job done, but printed packaging builds your brand. Every bag, box, and bowl that leaves your kitchen is a mobile advertisement seen by your customer, their family, their coworkers, and everyone on the street between your shop and their destination.

At minimum, include your logo and brand colors. Beyond that, consider adding your website, social media handles, a QR code linking to your menu, or even a short brand message on the inside of the lid. The unboxing moment is a marketing opportunity that most food businesses completely overlook.

Full-color printing on kraft surfaces creates a distinctive look that stands out against the sea of generic white containers. The natural brown tone communicates authenticity and sustainability — two qualities that today’s consumers actively seek out.

## Don’t Forget the Practical Details

A few small details can dramatically improve the customer experience:

Easy-open closures save your customer from fighting with the packaging. Tear strips, tuck-lock tabs, and perforated openings all make a difference.

Ventilation holes in pizza and fried food packaging prevent condensation from making crispy items soggy. The placement and size of these holes matter — too many and the food cools too fast, too few and moisture builds up.

Stackability is crucial for delivery operations. If your packaging can’t be stacked safely in a delivery bag, your driver will struggle and your food will suffer.

Flat-pack storage means your packaging arrives unassembled and takes up minimal warehouse space. Quick-assembly designs let your kitchen staff fold and fill in seconds during a busy service.

## The Sustainability Factor

Your customers care about the environment, and your packaging speaks volumes about your values. Choosing recyclable, biodegradable kraft packaging over plastic or styrofoam alternatives isn’t just responsible — it’s expected.

Many municipalities are introducing bans on single-use plastic food containers. Switching to kraft now means you won’t be scrambling to comply with new regulations later. It also gives you a genuine sustainability story to share with your customers, which builds trust and loyalty over time.

## Making the Final Decision

The right packaging balances five factors: product protection, brand presentation, operational efficiency, cost, and environmental impact. No single option is perfect for every product, which is why many food businesses use different packaging formats across their menu — boxes for burgers, bowls for salads, bags for bakery items, and trays for finger food.

The best approach is to work with a packaging partner who understands your specific needs and can produce custom solutions at scale. Request samples, test them with your actual products, and get feedback from your team before committing to a large order.

At Kraftora, we guide food businesses through this process every day. From choosing the right material and size to designing custom prints and selecting the perfect finish, we make sure your packaging works as hard as your kitchen does.`
    ),
  },
  {
    slug: "kraft-ambalaj-neden-surdurulebilir-isletmelerin-gelecegi",
    slugEn: "why-kraft-packaging-is-the-future-of-sustainable-business",
    cover: "/blog/surdurulebilir-ambalaj.jpg",
    date: "2026-05-05",
    readMinutes: 5,
    title: L("Kraft Ambalaj Neden Sürdürülebilir İşletmelerin Geleceği", "Why Kraft Packaging Is the Future of Sustainable Business"),
    excerpt: L(
      "Tüketiciler çevre dostu çözümler talep ettikçe kraft ambalaj, kaliteden ve marka çekiciliğinden ödün vermeden atığı azaltmak isteyen işletmelerin ilk tercihi haline geliyor.",
      "As consumers demand eco-friendly solutions, kraft packaging is emerging as the go-to choice for businesses looking to reduce waste without sacrificing quality or brand appeal."
    ),
    body: L(
      `## Kraft Kağıdı Farklı Kılan Nedir?

Kraft kağıt, odun hamurundan kendine özgü doğal kahverengi yüzeye sahip güçlü ve dayanıklı bir malzeme üreten kraft süreciyle elde edilir. Ağartılmış veya kaplamalı alternatiflerin aksine kraft kağıt ham liflerini korur; bu da ona üstün çekme mukavemeti ve yırtılma direnci kazandırır.

Ancak dayanıklılık hikâyenin yalnızca bir parçası. Kraftı gerçekten farklı kılan, çevresel profilidir. %100 geri dönüştürülebilir, biyolojik olarak çözünebilir ve kompostlanabilirdir. Sorumlu biçimde bertaraf edildiğinde kraft kağıt haftalar içinde doğal olarak ayrışır; geride mikroplastik, zehirli kalıntı ya da kalıcı bir iz bırakmaz.

## Krafta Geçmenin İş Gerekçesi

Kraft ambalaja geçmek yalnızca çevresel bir karar değil, akıllı bir iş hamlesidir. İşte nedenleri:

Tüketiciler fark ediyor. Araştırmalar, alışveriş yapanların çevresel sorumluluk gösteren markaları tutarlı biçimde tercih ettiğini ortaya koyuyor. Kraft bir torba ya da kutu, markanızın sürdürülebilirliği önemsediğine dair anında görsel bir sinyal gönderir.

Maliyetleri düşürür. Kraft kağıt pek çok alternatiften daha hafiftir; bu da sevkiyat ağırlığını ve taşıma maliyetlerini azaltır. Düz sevk edilebilir yapısı daha az depo alanı kaplaması anlamına gelir.

İnanılmaz derecede çok yönlüdür. Pizza kutuları ve gıda tabaklarından alışveriş çantalarına ve e-ticaret kutularına kadar kraft kağıt neredeyse her ürün kategorisine uyacak şekilde tasarlanabilir. Özel baskı, yağ geçirmez kaplama ya da selefon ekleyin; tamamen markalı ve işlevsel bir ambalajınız olsun.

## Ödünsüz Özel Baskı

Yaygın bir yanılgı, çevre dostu ambalajın tasarım kalitesinden ödün vermek anlamına geldiğidir. Bu kesinlikle doğru değil. Tam renkli CMYK, fleksografik ve ofset baskı dahil modern baskı teknikleri kraft yüzeylerde harika sonuç verir. Doğal kahverengi ton pek çok marka estetiğini güçlendirir; beyaz veya parlak ambalajın taklit edemeyeceği sıcak, samimi ve premium bir his yaratır.

Yaldız baskı, kabartma ve gofre gibi seçenekler kutu açma deneyimini daha da yükselten dokunsal bir boyut ekler.

## Kraft Devrimine Öncülük Eden Sektörler

Gıda servisi sektörü, kraft ambalajı ölçekli olarak benimseyen ilk sektörlerden biriydi; pizza kutuları, hamburger kapları, paket servis torbaları ve kaseler artık ezici çoğunlukla kraft esaslı. Ancak bu eğilim gıdanın çok ötesine yayıldı.

Moda ve perakende markaları kraft alışveriş çantalarını bir değer beyanı olarak kullanıyor. E-ticaret şirketleri mukavemet-ağırlık oranı için kraft kargo kutularını seçiyor. Kozmetik markaları temiz, minimal estetiği için kraftı tercih ediyor. Elektronik sektörü bile straforun yerine oluklu kraft dolgulara yöneliyor.

## Geleceğe Bakış

Küresel sürdürülebilirlik hedefleri sıkılaşıp tüketici beklentileri yükselmeye devam ettikçe kraft ambalaj artık niş bir tercih değil; standart haline geliyor. Geçişi şimdi yapan işletmeler, çevre bilincine sahip müşterilerle marka sadakati oluştururken tedarik zincirlerini geleceğe hazırlayarak eğrinin önünde konumlanıyor.

Kraftora'da işletmelerin bu geçişi sorunsuz yapmasına yardımcı oluyoruz. İlk danışmanlıktan son teslimata kadar ürününüz, markanız ve gezegen etrafında tasarlanmış tamamen özel kraft ambalaj çözümleri sunuyoruz.`,
      `## What Makes Kraft Paper Different?

Kraft paper is produced through the kraft process, which uses wood pulp to create a strong, durable material with a distinctive natural brown finish. Unlike bleached or coated alternatives, kraft paper retains its raw fibers, giving it superior tensile strength and tear resistance.

But strength is only part of the story. What truly sets kraft apart is its environmental profile. It is 100% recyclable, biodegradable, and compostable. When disposed of responsibly, kraft paper breaks down naturally within weeks — leaving no microplastics, no toxic residue, and no lasting footprint.

## The Business Case for Going Kraft

Switching to kraft packaging isn’t just an environmental decision — it’s a smart business move. Here’s why:

Consumers notice. Studies consistently show that shoppers prefer brands that demonstrate environmental responsibility. A kraft bag or box sends an immediate visual signal that your brand cares about sustainability.

It reduces costs. Kraft paper is lighter than many alternatives, which lowers shipping weight and transportation costs. Its flat-pack nature also means it takes up less warehouse space.

It’s incredibly versatile. From pizza boxes and food trays to shopping bags and e-commerce mailers, kraft paper can be engineered to fit virtually any product category. Add custom printing, grease-proof coatings, or lamination, and you have a fully branded, functional package.

## Custom Printing Without Compromise

One common misconception is that eco-friendly packaging means sacrificing design quality. That’s simply not true. Modern printing techniques — including full-color CMYK, flexographic, and offset printing — work beautifully on kraft surfaces. The natural brown tone actually enhances many brand aesthetics, creating a warm, authentic, premium feel that white or glossy packaging can’t replicate.

Options like foil stamping, embossing, and debossing add a tactile dimension that elevates the unboxing experience even further.

## Industries Leading the Kraft Revolution

The food service industry was among the first to adopt kraft packaging at scale — pizza boxes, burger containers, takeaway bags, and bowls are now overwhelmingly kraft-based. But the trend has expanded far beyond food.

Fashion and retail brands use kraft shopping bags as a statement of values. E-commerce companies choose kraft mailer boxes for their strength-to-weight ratio. Cosmetics brands select kraft for its clean, minimal aesthetic. Even the electronics sector is moving toward corrugated kraft inserts to replace styrofoam.

## Looking Ahead

As global sustainability targets tighten and consumer expectations continue to rise, kraft packaging is no longer a niche choice — it’s becoming the standard. Businesses that make the switch now position themselves ahead of the curve, building brand loyalty with environmentally conscious customers while future-proofing their supply chain.

At Kraftora, we help businesses make this transition seamlessly. From initial consultation to final delivery, we provide fully custom kraft packaging solutions designed around your product, your brand, and the planet.`
    ),
  },
];

// ---------- Çalıştır ----------

async function main() {
  const client = postgres(process.env.DATABASE_URL!, { max: 1 });
  const db = drizzle(client);

  const existingProducts = await db.select({ id: products.id }).from(products).limit(1);
  if (existingProducts.length === 0) {
    await db.insert(products).values(
      P.map((p, i) => {
        const images = [1, 2, 3].map((n) => `/urunler/${p.file}-${n}.jpg`);
        const sections: ProductSection[] = [
          { title: p.sections[0], text: p.sections[1], image: images[1] },
          { title: p.sections[2], text: p.sections[3], image: images[2] },
        ];
        return {
          slug: p.slug,
          slugEn: p.slugEn,
          title: p.title,
          cardText: p.cardText,
          listText: p.listText,
          intro: p.intro,
          images,
          sections,
          quote: p.quote,
          showOnHome: p.showOnHome,
          sortOrder: i,
          published: true,
        };
      })
    );
    console.log(`${P.length} ürün eklendi.`);
  } else {
    console.log("Ürünler zaten var, atlandı.");
  }

  const existingPosts = await db.select({ id: blogPosts.id }).from(blogPosts).limit(1);
  if (existingPosts.length === 0) {
    await db.insert(blogPosts).values(
      BLOG.map((b) => ({
        slug: b.slug,
        slugEn: b.slugEn,
        title: b.title,
        excerpt: b.excerpt,
        body: b.body,
        cover: b.cover,
        date: b.date,
        readMinutes: b.readMinutes,
        published: true,
      }))
    );
    console.log(`${BLOG.length} blog yazısı eklendi.`);
  } else {
    console.log("Blog yazıları zaten var, atlandı.");
  }

  const existingGallery = await db.select({ id: galleryImages.id }).from(galleryImages).limit(1);
  if (existingGallery.length === 0) {
    await db.insert(galleryImages).values(
      Array.from({ length: 12 }, (_, i) => ({
        image: `/galeri/galeri-${i + 1}.jpg`,
        alt: L("Kraftora üretim tesisi", "Kraftora production facility"),
        sortOrder: i,
      }))
    );
    console.log("12 galeri görseli eklendi.");
  } else {
    console.log("Galeri zaten dolu, atlandı.");
  }

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
