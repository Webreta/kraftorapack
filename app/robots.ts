import type { MetadataRoute } from "next";
import { getTechnicalSettings } from "@/lib/data/settings";

// Ayar panelden değişebildiği için her istekte DB'den okunur
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const technical = await getTechnicalSettings();

  // İndekslemeye kapalıyken tüm site engellenir, sitemap verilmez
  if (technical.noindex) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
