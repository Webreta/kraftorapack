import Link from "next/link";
import Image from "next/image";
import { href, getDict } from "@/lib/i18n";
import { t, type Lang } from "@/lib/l10n";
import { site } from "@/lib/site";
import type { GeneralSettings } from "@/lib/settings/genel";
import type { ContactSettings } from "@/lib/settings/iletisim";
import { Icon } from "./Icon";

export function Footer({
  lang,
  general,
  contact,
}: {
  lang: Lang;
  general: GeneralSettings;
  contact: ContactSettings;
}) {
  const d = getDict(lang);
  const taglineLines = t(general.footer.tagline, lang).split("\n");

  const bullet = "flex items-start gap-2 text-[13.5px] leading-snug text-[#333]";
  const chevron = <Icon name="chevron-right" className="mt-0.5 size-3.5 shrink-0 text-[#777]" />;

  return (
    <footer className="bg-section">
      <div className="mx-auto max-w-[1240px] px-5 py-8 md:py-10">
        {/* Logo + slogan */}
        <div className="grid items-center gap-6 md:grid-cols-12">
          <div className="text-center md:col-span-4">
            <Image
              src="/logo.png"
              alt="Kraftora"
              width={800}
              height={176}
              className="mx-auto h-auto w-[220px] md:w-[240px]"
            />
          </div>
          <div className="md:col-span-8">
            <p className="text-center text-[22px] leading-snug text-[#333] md:text-right">
              {taglineLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="my-6 h-px bg-divider" />

        {/* Sütunlar */}
        <div className="grid gap-8 pt-2 md:grid-cols-12">
          <div className="md:col-span-3">
            <h4 className="mb-4 text-[16px] font-semibold text-ink">{d.footer.contact}</h4>
            <ul className="space-y-3">
              <li className={bullet}>
                {chevron}
                <a href={`mailto:${contact.email}`} className="hover:text-brand-700">
                  {contact.email}
                </a>
              </li>
              <li className={bullet}>
                {chevron}
                <a href={`tel:${contact.phoneHref}`} className="hover:text-brand-700">
                  {contact.phone}
                </a>
              </li>
              <li className={bullet}>
                {chevron}
                <span>{t(contact.location, lang)}</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-9">
            <div className="grid gap-8 md:grid-cols-12">
              <div className="md:col-span-5">
                <h4 className="mb-4 text-[16px] font-semibold text-ink">{d.footer.siteMap}</h4>
                <ul className="space-y-3">
                  {(
                    [
                      ["home", d.nav.home],
                      ["hakkimizda", d.nav.about],
                      ["urunler", d.nav.products],
                      ["galeri", d.nav.gallery],
                      ["blog", d.nav.blog],
                      ["iletisim", d.nav.contact],
                    ] as const
                  ).map(([key, label]) => (
                    <li key={key} className={bullet}>
                      {chevron}
                      <Link href={href(lang, key)} className="hover:text-brand-700">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-7">
                <h4 className="mb-4 text-[16px] font-semibold text-ink">{d.footer.sustainability}</h4>
                <p className="text-[15px] leading-relaxed text-[#333]">
                  {t(general.footer.sustainability, lang)}
                </p>
                <Link
                  href={href(lang, "urunler")}
                  className="mt-4 inline-flex items-center gap-1 rounded-[10px] border-2 border-brand-600 px-[30px] py-[6px] text-[13px] font-bold text-brand-600 transition hover:bg-brand-600 hover:text-white"
                >
                  {d.allProducts}
                  <Icon name="chevron-right" className="size-3.5" />
                </Link>
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#666]">
                  {(
                    [
                      ["kvkk", lang === "tr" ? "KVKK" : "KVKK"],
                      ["gizlilik", lang === "tr" ? "Gizlilik Politikası" : "Privacy Policy"],
                      ["cerez", lang === "tr" ? "Çerez Politikası" : "Cookie Policy"],
                    ] as const
                  ).map(([key, label]) => (
                    <li key={key}>
                      <Link href={href(lang, key)} className="hover:text-brand-700">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="my-6 h-px bg-divider" />

        <div className="flex flex-col items-center justify-between gap-2 text-[12px] text-[#333] md:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. {d.footer.rights}
          </p>
          <p>
            {d.footer.designedBy}{" "}
            <a
              href={site.developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-brand-700"
            >
              {site.developer.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
