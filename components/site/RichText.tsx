import { parseBlocks, parseBold } from "@/lib/text";

// **kalın** destekli satır içi metin
export function Inline({ text, boldClass = "font-bold text-ink" }: { text: string; boldClass?: string }) {
  return (
    <>
      {parseBold(text).map((p, i) =>
        p.bold ? (
          <strong key={i} className={boldClass}>
            {p.text}
          </strong>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

// Panelden girilen düz metni başlık / paragraf / liste bloklarına çevirir
export function RichText({ text, className = "" }: { text: string; className?: string }) {
  const blocks = parseBlocks(text);
  return (
    <div className={className}>
      {blocks.map((b, i) => {
        if (b.type === "h2")
          return (
            <h2 key={i} className="mb-4 mt-8 text-[22px] font-bold leading-snug text-ink first:mt-0 md:text-[24px]">
              <Inline text={b.text} />
            </h2>
          );
        if (b.type === "ul")
          return (
            <ul key={i} className="mb-5 list-disc space-y-2 pl-6 text-[16px] leading-[1.8] text-body">
              {b.items.map((it, j) => (
                <li key={j}>
                  <Inline text={it} />
                </li>
              ))}
            </ul>
          );
        return (
          <p key={i} className="mb-5 text-[16px] leading-[1.8] text-body">
            <Inline text={b.text} />
          </p>
        );
      })}
    </div>
  );
}
