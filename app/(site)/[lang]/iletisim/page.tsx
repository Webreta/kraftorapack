import type { Metadata } from "next";
import { Marquee } from "@/components/site/Marquee";
import { PageIntro } from "@/components/site/PageIntro";
import { CtaBox } from "@/components/site/CtaBox";
import { CardIcon, Icon, type IconName } from "@/components/site/Icon";
import { ContactForm } from "@/components/site/ContactForm";
import { getContactSettings, getGeneralSettings } from "@/lib/data/settings";
import { getDict } from "@/lib/i18n";
import { t } from "@/lib/l10n";
import { resolveLang } from "@/lib/lang";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await resolveLang(params);
  return { title: getDict(lang).nav.contact };
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: "pin" | "phone" | "mail" | "share";
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-brand-500/10 bg-card p-6">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
        <CardIcon name={icon} className="size-7" />
      </div>
      <div className="min-w-0">
        <h3 className="mb-1.5 text-[16px] font-bold leading-snug text-ink">{title}</h3>
        <div className="text-[14px] leading-relaxed text-muted">{children}</div>
      </div>
    </div>
  );
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await resolveLang(params);
  const d = getDict(lang);
  const [contact, general] = await Promise.all([getContactSettings(), getGeneralSettings()]);
  const p = contact.page;
  const socials = (
    [
      ["facebook", "facebook"],
      ["instagram", "instagram"],
      ["x", "x"],
      ["linkedin", "linkedin"],
    ] as const
  ).filter(([key]) => contact.social[key]) as [keyof typeof contact.social, IconName][];

  return (
    <>
      <Marquee text={t(general.marquee, lang)} />
      <div className="mx-auto max-w-[1200px] px-5">
        <PageIntro title={t(p.title, lang)} subtitle={t(p.subtitle, lang)} narrow />

        <div className="mb-12 grid gap-8 lg:grid-cols-[42%_minmax(0,1fr)] lg:gap-10">
          <div className="flex flex-col justify-between gap-4">
            <InfoCard icon="pin" title={t(p.officeTitle, lang)}>
              {t(contact.address, lang)}
            </InfoCard>
            <InfoCard icon="phone" title={t(p.phoneTitle, lang)}>
              <a href={`tel:${contact.phoneHref}`} className="hover:text-brand-700">
                {contact.phone}
              </a>{" "}
              {t(contact.hours, lang)}
            </InfoCard>
            <InfoCard icon="mail" title={t(p.emailTitle, lang)}>
              <a href={`mailto:${contact.email}`} className="hover:text-brand-700">
                {contact.email}
              </a>{" "}
              {t(contact.replyNote, lang)}
            </InfoCard>
            <InfoCard icon="share" title={t(p.followTitle, lang)}>
              {t(p.followText, lang)}
              {socials.length > 0 && (
                <div className="mt-3 flex items-center gap-3 text-[#777]">
                  {socials.map(([key, icon]) => (
                    <a
                      key={key}
                      href={contact.social[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={key}
                      className="transition hover:text-brand-700"
                    >
                      <Icon name={icon} className="size-5" />
                    </a>
                  ))}
                </div>
              )}
            </InfoCard>
          </div>

          <div className="rounded-xl border border-brand-500/10 bg-card px-6 py-8 md:px-8 md:py-9">
            <h2 className="mb-2 text-[24px] font-bold leading-snug text-ink">{t(p.formTitle, lang)}</h2>
            <p className="mb-6 text-[14px] leading-relaxed text-muted">{t(p.formText, lang)}</p>
            <ContactForm lang={lang} form={d.form} />
          </div>
        </div>

        {contact.mapEmbed && (
          <div className="mb-12 overflow-hidden rounded-xl border border-brand-500/10">
            <iframe
              src={contact.mapEmbed}
              title="Kraftora"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[320px] w-full border-0"
              allowFullScreen
            />
          </div>
        )}

        <div className="mb-[60px]">
          <CtaBox title={t(p.ctaTitle, lang)} text={t(p.ctaText, lang)} size="md" />
        </div>
      </div>
    </>
  );
}
