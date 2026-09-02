"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/site/Icon";

type NavItem = { href: string; label: string; icon: IconName };

// Panel sol menüsü — bulunulan sekme renkli gösterilir
export function AdminNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  // "/admin" yalnızca tam eşleşmede aktif; diğerleri alt sayfalarda da aktif kalır
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium transition ${
              active ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-card"
            }`}
          >
            <Icon name={item.icon} className={`size-4 ${active ? "text-brand-600" : "text-[#999]"}`} />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
