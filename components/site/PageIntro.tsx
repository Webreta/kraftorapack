// İç sayfa başlığı: ortalı büyük başlık + koyu yeşil alt metin
export function PageIntro({
  title,
  subtitle,
  as = "h1",
  narrow = false,
}: {
  title: string;
  subtitle?: string;
  as?: "h1" | "h2";
  narrow?: boolean;
}) {
  const Tag = as;
  return (
    <div className="px-5 pb-12 pt-14 text-center md:pt-[70px]">
      <Tag className="text-[30px] font-extrabold leading-tight text-ink md:text-[38px]">
        {title}
      </Tag>
      {subtitle && (
        <p
          className={`mx-auto mt-4 text-[16px] leading-[1.7] text-brand-900 md:text-[17px] ${
            narrow ? "max-w-[560px]" : "max-w-[640px]"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
