import { requireSection } from "@/lib/auth/session";
import { getAboutSettings } from "@/lib/data/settings";
import { AboutBlocksForm, AboutIntroForm, AboutWhyForm } from "@/components/admin/HakkimizdaForms";

export default async function AdminAboutPage() {
  await requireSection("hakkimizda");
  const about = await getAboutSettings();

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-ink">Hakkımızda</h1>
      <div className="mt-6 space-y-10">
        <section>
          <h2 className="mb-3 text-lg font-bold text-ink">Sayfa Başlığı ve Çağrı Kutusu</h2>
          <AboutIntroForm initial={about} />
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-ink">Hikayemiz ve Misyonumuz</h2>
          <AboutBlocksForm
            key={`${about.story.image ?? ""}|${about.mission.image ?? ""}`}
            initial={about}
          />
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-ink">Neden Kraftora (6 kart)</h2>
          <AboutWhyForm initial={about.why} />
        </section>
      </div>
    </div>
  );
}
