import Link from "next/link";
import { headers } from "next/headers";
import { getDict } from "@/lib/i18n";
import { isLang } from "@/lib/l10n";

export default async function NotFound() {
  const h = await headers();
  const raw = h.get("x-lang");
  const lang = isLang(raw) ? raw : "tr";
  const d = getDict(lang);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink">{d.notFound.title}</h1>
      <p className="mt-2 max-w-md text-muted">{d.notFound.text}</p>
      <Link
        href={lang === "en" ? "/en" : "/"}
        className="mt-8 rounded-md bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        {d.notFound.home}
      </Link>
    </main>
  );
}
