"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { alternatePath, href, type RouteKey } from "@/lib/i18n";
import type { Lang } from "@/lib/l10n";
import { Icon, type IconName } from "./Icon";
import { FlagEN, FlagTR } from "./Flags";

export type NavLabels = {
  home: string;
  about: string;
  products: string;
  gallery: string;
  blog: string;
  contact: string;
};

export type SocialLinks = { facebook: string; instagram: string; x: string; linkedin: string };

type Props = {
  lang: Lang;
  labels: NavLabels;
  menuLabel: string;
  email: string;
  phone: string;
  phoneHref: string;
  social: SocialLinks;
};

const NAV: { key: RouteKey; label: keyof NavLabels }[] = [
  { key: "home", label: "home" },
  { key: "hakkimizda", label: "about" },
  { key: "urunler", label: "products" },
  { key: "galeri", label: "gallery" },
  { key: "blog", label: "blog" },
  { key: "iletisim", label: "contact" },
];

const SOCIAL: { key: keyof SocialLinks; icon: IconName }[] = [
  { key: "facebook", icon: "facebook" },
  { key: "instagram", icon: "instagram" },
  { key: "x", icon: "x" },
  { key: "linkedin", icon: "linkedin" },
];

export function Header({ lang, labels, menuLabel, email, phone, phoneHref, social }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Sayfa değişince mobil menüyü kapat
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (key: RouteKey) => {
    const target = href(lang, key);
    if (key === "home") return pathname === target;
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  const socialItems = SOCIAL.filter((s) => social[s.key]);
  const trHref = alternatePath(pathname, "tr");
  const enHref = alternatePath(pathname, "en");

  const LangSwitch = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-1 ${className}`}>
      <a
        href={trHref}
        aria-label="Türkçe"
        title="Türkçe"
        className={`rounded-sm p-0.5 transition ${lang === "tr" ? "ring-1 ring-brand-500" : "opacity-75 hover:opacity-100"}`}
      >
        <FlagTR className="h-[18px] w-6" />
      </a>
      <a
        href={enHref}
        aria-label="English"
        title="English"
        className={`rounded-sm p-0.5 transition ${lang === "en" ? "ring-1 ring-brand-500" : "opacity-75 hover:opacity-100"}`}
      >
        <FlagEN className="h-[18px] w-6" />
      </a>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_1px_15px_rgba(0,0,0,0.1)]">
      {/* Ana bar: logo + menü */}
      <div className="mx-auto flex h-[70px] max-w-[1240px] items-center justify-between px-5 md:h-[90px]">
        {/* Mobil: hamburger solda, logo ortada */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="-ml-2 p-2 text-ink lg:hidden"
          aria-label={menuLabel}
          aria-expanded={open}
        >
          <Icon name="menu" className="size-7" strokeWidth={1.6} />
        </button>

        <Link href={href(lang, "home")} className="shrink-0" aria-label="Kraftora">
          <Image
            src="/logo.png"
            alt="Kraftora"
            width={800}
            height={176}
            priority
            className="h-auto w-[150px] md:w-[200px]"
          />
        </Link>

        <nav className="hidden items-center lg:flex" aria-label="Ana menü">
          {NAV.map((item, i) => (
            <Link
              key={item.key}
              href={href(lang, item.key)}
              className={`relative px-[13px] text-[15px] font-bold transition hover:text-brand-700 ${
                isActive(item.key) ? "text-brand-700" : "text-[#1c1c1c]"
              } ${i > 0 ? "before:absolute before:left-0 before:top-1/2 before:h-[15px] before:w-px before:-translate-y-1/2 before:bg-line" : ""}`}
            >
              {labels[item.label]}
            </Link>
          ))}
        </nav>

        {/* Mobil: sağda dil seçici (hamburger ile simetri) */}
        <div className="lg:hidden">
          <LangSwitch />
        </div>
      </div>

      {/* Alt bar: iletişim + dil + sosyal */}
      <div className="hidden border-t border-line md:block">
        <div className="mx-auto flex h-10 max-w-[1240px] items-center justify-between px-5 text-[13px] font-semibold text-[#333]">
          <ul className="flex items-center">
            <li>
              <a href={`mailto:${email}`} className="flex items-center gap-1.5 pr-3 hover:text-brand-700">
                <Icon name="mail" className="size-4 text-[#555]" />
                {email}
              </a>
            </li>
            <li className="border-l border-line pl-3">
              <a href={`tel:${phoneHref}`} className="flex items-center gap-1.5 hover:text-brand-700">
                <Icon name="phone" className="size-4 text-[#555]" />
                {phone}
              </a>
            </li>
          </ul>
          <div className="flex items-center">
            <LangSwitch />
            {socialItems.length > 0 && (
              <ul className="ml-4 flex items-center gap-3 border-l border-line pl-4 text-[#9a9a9a]">
                {socialItems.map((s) => (
                  <li key={s.key}>
                    <a
                      href={social[s.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.key}
                      className="transition hover:text-brand-700"
                    >
                      <Icon name={s.icon} className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Mobil menü: soldan kayan panel */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      >
        <aside
          className={`flex h-full w-[300px] max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <Image src="/logo.png" alt="Kraftora" width={800} height={176} className="h-auto w-[140px]" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 text-[#555]"
              aria-label="Kapat"
            >
              <Icon name="close" className="size-6" />
            </button>
          </div>
          <nav className="flex flex-col px-2 py-3" aria-label={menuLabel}>
            {NAV.map((item) => (
              <Link
                key={item.key}
                href={href(lang, item.key)}
                className={`border-b border-line/70 px-3 py-3 text-[15px] font-bold ${
                  isActive(item.key) ? "text-brand-700" : "text-[#1c1c1c]"
                }`}
              >
                {labels[item.label]}
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-3 border-t border-line px-5 py-4 text-[13px] font-semibold text-[#333]">
            <a href={`mailto:${email}`} className="flex items-center gap-2">
              <Icon name="mail" className="size-4 text-[#555]" />
              {email}
            </a>
            <a href={`tel:${phoneHref}`} className="flex items-center gap-2">
              <Icon name="phone" className="size-4 text-[#555]" />
              {phone}
            </a>
            <div className="flex items-center justify-between pt-1">
              <LangSwitch />
              {socialItems.length > 0 && (
                <ul className="flex items-center gap-3 text-[#9a9a9a]">
                  {socialItems.map((s) => (
                    <li key={s.key}>
                      <a href={social[s.key]} target="_blank" rel="noopener noreferrer" aria-label={s.key}>
                        <Icon name={s.icon} className="size-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
}
