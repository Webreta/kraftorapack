# Kraftora (kraftorapack.com)

Kurumsal site + yönetim paneli. İki dilli: ana dil Türkçe (öneksiz, `/urunler`), İngilizce `/en` önekli (`/en/products`). Panel Türkçe (`/admin/giris`, `/admin/urunler`).

## Stack

Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4 (`@theme` token'ları `app/globals.css`), Drizzle ORM + PostgreSQL (postgres.js), bcryptjs.

Referans proje: `Webreta/ege-yatcilik` — auth, upload ve panel kalıpları oradan alındı. Tasarım kraftorapack.com (Flatsome/WordPress) birebir taşındı.

## Kurallar

- Auth: middleware yalnızca iyimser cookie kontrolü yapar; gerçek doğrulama `requireUser`/`requireSection` (lib/auth/session.ts) ile panel layout'unda ve her server action'da.
- Dil: `middleware.ts` İngilizce segmentleri (`lib/i18n.ts` ROUTES) Türkçe klasör adına rewrite eder; sayfalar `app/(site)/[lang]/<türkçe-klasör>` altında. Bağlantılar `href(lang, key, rest)` ile üretilir.
- İçerik metinleri `L = { tr, en }` tipinde (lib/l10n.ts); sitede `t(value, lang)` ile okunur, EN boşsa TR'ye düşer. Arayüz metinleri (menü, buton) `lib/i18n.ts` içindeki `dict`.
- Panel formlarında iki dilli alan adı `<ad>.tr` / `<ad>.en` (components/admin/Fields.tsx `LInput`, server tarafında `readL`).
- Site ayarları `site_settings` key-value tablosunda: genel, hakkimizda, iletisim, sayfalar, teknik, yasal (lib/settings/* varsayılanlar, lib/data/settings.ts okuma/yazma).
- Ürün ve blog kayıtları iki slug taşır (`slug` TR, `slugEn`); dil değiştirme bağlantısı diğer dilin slug'ıyla gelirse sayfa canonical adrese yönlendirir.
- DB komutları: `npm run db:generate` → `db:migrate` → `db:seed` (admin) → `db:seed-content` (ürün/blog/galeri).
- Yerel Postgres: `docker compose up -d` (port 5435).
- Yorumlar ve panelde görünen tüm metinler Türkçe.
