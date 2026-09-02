import Link from "next/link";
import { Icon } from "./Icon";

export function BlogCard({
  href,
  image,
  title,
  excerpt,
  date,
  readLabel,
}: {
  href: string;
  image: string | null;
  title: string;
  excerpt: string;
  date: string;
  readLabel: string;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-white transition hover:border-[#111] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <Link href={href} className="block h-[260px] w-full overflow-hidden bg-card">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 hover:scale-[1.04]"
          />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[12px] text-[#888]">{date}</span>
        <h3 className="mt-2 text-[17px] font-bold leading-snug text-[#111]">
          <Link href={href} className="hover:text-brand-700">
            {title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-muted">{excerpt}</p>
        <div className="mt-auto pt-4">
          <Link
            href={href}
            className="inline-flex items-center gap-1 rounded-md border-[1.5px] border-[#111] px-4 py-2 text-[12.5px] font-semibold text-[#111] transition hover:bg-[#111] hover:text-white"
          >
            {readLabel}
            <Icon name="chevron-right" className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
