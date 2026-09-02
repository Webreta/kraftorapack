import type { MetadataRoute } from "next";
import { getTechnicalSettings } from "@/lib/data/settings";
import { getPublishedPosts, getPublishedProducts } from "@/lib/data/content";
import { href } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  const [technical, products, posts] = await Promise.all([
    getTechnicalSettings(),
    getPublishedProducts(),
    getPublishedPosts(),
  ]);

  const now = new Date();
  return [
    // Panelden yönetilen sabit sayfalar
    ...technical.sitemap.map((path) => ({
      url: `${base}${path === "/" ? "" : path}` || base,
      lastModified: now,
    })),
    // Yayındaki ürün ve blog sayfaları iki dilde otomatik eklenir
    ...products.flatMap((p) => [
      { url: `${base}${href("tr", "urunler", p.slug)}`, lastModified: now },
      { url: `${base}${href("en", "urunler", p.slugEn)}`, lastModified: now },
    ]),
    ...posts.flatMap((p) => [
      { url: `${base}${href("tr", "blog", p.slug)}`, lastModified: now },
      { url: `${base}${href("en", "blog", p.slugEn)}`, lastModified: now },
    ]),
  ];
}
