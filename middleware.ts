import { NextResponse, type NextRequest } from "next/server";
import { enSegmentToTr, trSegmentToEn } from "@/lib/i18n";

/**
 * 1) /admin: İYİMSER kontrol; yalnızca cookie'nin varlığına bakar (edge'de DB yok).
 *    Gerçek doğrulama panel layout'unda ve server action'larda (requireUser).
 * 2) Dil yönlendirmesi: Türkçe adresler öneksiz (/urunler), İngilizce /en önekli
 *    (/en/products). İkisi de app/(site)/[lang]/<türkçe-klasör> rotasına rewrite edilir.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/giris";
    const hasSessionCookie = request.cookies.has("session");
    if (!isLoginPage && !hasSessionCookie) {
      const loginUrl = new URL("/admin/giris", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("X-Frame-Options", "DENY");
    return response;
  }

  // /tr/... doğrudan çağrılırsa öneksiz adrese yönlendir (tek canonical adres)
  if (pathname === "/tr" || pathname.startsWith("/tr/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/tr/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  const parts = pathname.split("/").filter(Boolean);
  let lang: "tr" | "en" = "tr";
  let rest = parts;

  if (parts[0] === "en") {
    lang = "en";
    rest = parts.slice(1);
    if (rest.length > 0) {
      const tr = enSegmentToTr(rest[0]);
      if (tr !== null) {
        rest = [tr, ...rest.slice(1)];
      } else {
        // /en/<türkçe-segment> ile gelindiyse İngilizce adrese yönlendir
        const en = trSegmentToEn(rest[0]);
        if (en !== null && en !== rest[0]) {
          const url = request.nextUrl.clone();
          url.pathname = `/en/${[en, ...rest.slice(1)].join("/")}`;
          return NextResponse.redirect(url, 308);
        }
      }
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${lang}/${rest.join("/")}`.replace(/\/$/, "") || `/${lang}`;
  const headers = new Headers(request.headers);
  headers.set("x-lang", lang);
  headers.set("x-pathname", pathname);
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  // Statik dosyalar, Next iç yolları, yüklemeler ve API dışında her şey
  matcher: [
    "/((?!_next|uploads|api|favicon.ico|robots.txt|sitemap.xml|icon.svg|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
