import type { L } from "@/lib/l10n";

// Yasal sayfalar (KVKK, gizlilik, çerez): panelden düzenlenir, site_settings("yasal")

export type LegalSlug = "kvkk" | "gizlilik" | "cerez";

export type LegalDoc = { slug: LegalSlug; title: L; body: L };

export type LegalSettings = { docs: LegalDoc[] };

export const defaultLegalSettings: LegalSettings = {
  docs: [
    {
      slug: "kvkk",
      title: { tr: "KVKK Aydınlatma Metni", en: "Personal Data Protection Notice" },
      body: {
        tr: "## Veri Sorumlusu\n\nKraftora, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla kişisel verilerinizi işlemektedir.\n\n## İşlenen Veriler ve Amaçlar\n\nİletişim ve teklif formları aracılığıyla paylaştığınız ad, soyad, e-posta, telefon ve firma bilgileri; taleplerinizi yanıtlamak, teklif hazırlamak ve sizinle iletişim kurmak amacıyla işlenir.\n\n## Haklarınız\n\nKVKK'nın 11. maddesi kapsamındaki haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.",
        en: "## Data Controller\n\nKraftora processes your personal data as a data controller under the Turkish Personal Data Protection Law No. 6698 (KVKK).\n\n## Data Processed and Purposes\n\nThe name, e-mail, phone and company details you share through our contact and quote forms are processed to respond to your requests, prepare quotations and communicate with you.\n\n## Your Rights\n\nYou may contact us to exercise your rights under Article 11 of the KVKK.",
      },
    },
    {
      slug: "gizlilik",
      title: { tr: "Gizlilik Politikası", en: "Privacy Policy" },
      body: {
        tr: "Kraftora olarak gizliliğinize önem veriyoruz. Web sitemiz üzerinden paylaştığınız bilgiler yalnızca taleplerinizi karşılamak amacıyla kullanılır ve üçüncü taraflarla paylaşılmaz.\n\nSorularınız için info@kraftorapack.com adresinden bize ulaşabilirsiniz.",
        en: "At Kraftora we value your privacy. Information you share through our website is used only to fulfil your requests and is never shared with third parties.\n\nFor any questions, contact us at info@kraftorapack.com.",
      },
    },
    {
      slug: "cerez",
      title: { tr: "Çerez Politikası", en: "Cookie Policy" },
      body: {
        tr: "Web sitemiz, düzgün çalışması için yalnızca zorunlu çerezleri kullanır. Bu çerezler kişisel veri toplamaz ve tarayıcı ayarlarınızdan yönetilebilir.",
        en: "Our website uses only strictly necessary cookies to function properly. These cookies do not collect personal data and can be managed through your browser settings.",
      },
    },
  ],
};
