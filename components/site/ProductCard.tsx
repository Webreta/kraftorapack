import Link from "next/link";
import { Icon } from "./Icon";

// Ürün kartı: üstte 250px görsel alanı (açık zemin), altta başlık + metin.
// variant "home": uzun açıklama, buton yok; "list": kısa açıklama + "Ürünü İncele" butonu
export function ProductCard({
  href,
  image,
  title,
  text,
  buttonLabel,
}: {
  href: string;
  image: string | null;
  title: string;
  text: string;
  buttonLabel?: string;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[10px] bg-white shadow-box-1 transition hover:shadow-box-3">
      <Link href={href} className="product-media block h-[250px] w-full overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
          />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <Link href={href}>
          <h2 className="text-[19px] font-bold leading-snug text-ink hover:text-brand-700">{title}</h2>
        </Link>
        <p className="mt-2 text-[13.6px] leading-relaxed text-ink/90">{text}</p>
        {buttonLabel && (
          <div className="mt-auto pt-4">
            <Link
              href={href}
              className="inline-flex items-center gap-1 rounded-[10px] border-2 border-brand-600 px-4 py-1.5 text-[12.5px] font-bold text-brand-600 transition hover:bg-brand-600 hover:text-white"
            >
              {buttonLabel}
              <Icon name="chevron-right" className="size-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
