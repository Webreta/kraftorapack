import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ScrollTop } from "@/components/site/ScrollTop";
import { CookieConsent } from "@/components/site/CookieConsent";
import { getContactSettings, getGeneralSettings } from "@/lib/data/settings";
import { getDict, href } from "@/lib/i18n";
import { resolveLang } from "@/lib/lang";

// Menü ve footer içerikleri DB'den geldiği için her istekte taze render
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const lang = await resolveLang(params);
  const [general, contact] = await Promise.all([getGeneralSettings(), getContactSettings()]);
  const d = getDict(lang);

  return (
    <>
      <Header
        lang={lang}
        labels={d.nav}
        menuLabel={d.menu}
        email={contact.email}
        phone={contact.phone}
        phoneHref={contact.phoneHref}
        social={contact.social}
      />
      <main>{children}</main>
      <Footer lang={lang} general={general} contact={contact} />
      <ScrollTop />
      <CookieConsent
        text={d.cookie.text}
        linkLabel={d.cookie.link}
        after={d.cookie.after}
        accept={d.cookie.accept}
        policyHref={href(lang, "cerez")}
      />
    </>
  );
}
