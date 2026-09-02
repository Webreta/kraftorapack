import Link from "next/link";

// Açık yeşil zeminli çağrı kutusu (Hakkımızda / Galeri / İletişim sayfalarının altı)
export function CtaBox({
  title,
  text,
  primary,
  secondary,
  layout = "row",
  size = "lg",
}: {
  title: string;
  text: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  layout?: "row" | "column";
  size?: "lg" | "md";
}) {
  const btn =
    "inline-flex items-center justify-center rounded-md py-3 text-[14px] font-semibold transition";
  const width = layout === "column" ? "w-[250px]" : "w-[160px]";
  return (
    <div
      className={`rounded-2xl bg-brand-50 text-center ${
        size === "lg" ? "px-8 py-12" : "px-5 py-10"
      }`}
    >
      <h2
        className={`font-extrabold leading-tight text-ink ${
          size === "lg" ? "text-[26px] md:text-[28px]" : "text-[22px] font-bold"
        }`}
      >
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-[500px] text-[15px] leading-relaxed text-muted">{text}</p>
      {(primary || secondary) && (
        <div
          className={`mt-6 flex items-center justify-center gap-3 ${
            layout === "column" ? "flex-col" : "flex-col sm:flex-row"
          }`}
        >
          {primary && (
            <Link
              href={primary.href}
              className={`${btn} ${width} bg-brand-500 text-white hover:bg-brand-600`}
            >
              {primary.label}
            </Link>
          )}
          {secondary && (
            <Link
              href={secondary.href}
              className={`${btn} ${width} border border-brand-500/30 bg-transparent text-brand-500 hover:bg-white`}
            >
              {secondary.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
