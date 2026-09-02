// Yeşil kayan şerit: metin ekran genişliğini dolduracak kadar tekrarlanır,
// iki kopya yan yana kayar (translateX(-50%) ile kesintisiz döngü)
export function Marquee({ text }: { text: string }) {
  if (!text.trim()) return null;
  const items = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="shrink-0 pr-20">
      {text}
    </span>
  ));
  return (
    <div className="w-full overflow-hidden bg-brand-800 text-[14px] italic leading-[1.4] text-white">
      <div className="flex w-max animate-marquee whitespace-nowrap py-2 will-change-transform">
        <div className="flex">{items}</div>
        <div className="flex" aria-hidden="true">
          {items}
        </div>
      </div>
    </div>
  );
}
