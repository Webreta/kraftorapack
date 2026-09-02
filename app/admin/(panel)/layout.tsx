import Link from "next/link";
import Image from "next/image";
import { requireUser, canAccess, ADMIN_SECTIONS } from "@/lib/auth/session";
import { logout } from "@/app/actions/auth";
import { Icon } from "@/components/site/Icon";
import { AdminNav } from "@/components/admin/AdminNav";

const sectionIcons = {
  genel: "home",
  hakkimizda: "building",
  urunler: "box",
  galeri: "image",
  blog: "pencil",
  iletisim: "mail",
  teknik: "settings",
} as const;

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();
  // Editörler yalnızca yetkili oldukları sekmeleri görür
  const navItems = ADMIN_SECTIONS.filter((s) => canAccess(user, s.key)).map((s) => ({
    href: s.route,
    label: s.label,
    icon: sectionIcons[s.key],
  }));

  return (
    <div className="flex min-h-screen bg-card">
      <aside className="flex w-60 shrink-0 flex-col border-r border-line bg-white">
        <div className="border-b border-line px-5 py-4">
          <Link href="/admin">
            <Image src="/logo.png" alt="Kraftora" width={800} height={176} className="h-auto w-40" />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3 text-sm">
          <AdminNav items={navItems} />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2.5 rounded-lg border-t border-line px-3 py-2 pt-3 font-medium text-brand-600 hover:bg-brand-50"
          >
            <Icon name="external" className="size-4 text-brand-400" />
            Siteye dön
          </a>
        </nav>
        <div className="border-t border-line p-3 text-sm">
          <a
            href="https://webreta.com.tr"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 block px-3 py-2 text-center transition hover:opacity-80"
          >
            <Image src="/webreta-logo.webp" alt="Webreta" width={343} height={54} className="mx-auto h-3.5 w-auto" />
            <p className="mt-1.5 text-[10px] font-medium text-muted">tarafından geliştirilmiştir</p>
          </a>
          <div className="mb-3 border-t border-line" />
          <p className="truncate px-3 pb-2 text-xs text-muted">
            {user.name} ({user.role})
          </p>
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left font-medium text-red-700 hover:bg-red-50"
            >
              Çıkış yap
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-8">{children}</main>
    </div>
  );
}
