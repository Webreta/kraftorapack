import { requireSection } from "@/lib/auth/session";
import { getGeneralSettings, getLegalSettings, getPagesSettings } from "@/lib/data/settings";
import {
  FeaturesForm,
  HeroForm,
  LegalForm,
  PageTextsForm,
  SectionTextsForm,
  ServicesForm,
} from "@/components/admin/GenelForms";

export default async function AdminGeneralPage() {
  await requireSection("genel");
  const [general, pages, legal] = await Promise.all([
    getGeneralSettings(),
    getPagesSettings(),
    getLegalSettings(),
  ]);

  const sections: [string, React.ReactNode][] = [
    ["Hero Banner ve Kayan Şerit", <HeroForm key="hero" initial={general} />],
    ["Öne Çıkan Özellikler (6 kart)", <FeaturesForm key="f" initial={general.features} />],
    ["Bölüm Başlıkları ve Footer", <SectionTextsForm key="s" initial={general} />],
    ["Hizmet Sekmeleri (6 sekme × 3 kart)", <ServicesForm key="sv" initial={general.services} />],
    ["Ürünler / Galeri / Blog Sayfa Başlıkları", <PageTextsForm key="p" initial={pages} />],
    ["Yasal Sayfalar", <LegalForm key="l" initial={legal} />],
  ];

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-ink">Ana Sayfa ve Genel İçerikler</h1>
      <p className="mt-1 text-sm text-muted">
        Her alan Türkçe (TR) ve İngilizce (EN) olarak ayrı girilir. İngilizce boş bırakılırsa sitede Türkçe metin gösterilir.
      </p>
      <div className="mt-6 space-y-10">
        {sections.map(([title, form]) => (
          <section key={title}>
            <h2 className="mb-3 text-lg font-bold text-ink">{title}</h2>
            {form}
          </section>
        ))}
      </div>
    </div>
  );
}
