import { notFound } from "next/navigation";
import { isLang, type Lang } from "@/lib/l10n";

// [lang] segmentini doğrular; middleware yalnızca tr/en üretir, elle girilen
// başka değerler 404 verir.
export async function resolveLang(params: Promise<{ lang: string }>): Promise<Lang> {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return lang;
}
