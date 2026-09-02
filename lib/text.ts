// Panelde girilen düz metni bloklara ayırır:
// - boş satırla ayrılan paragraflar
// - "## " ile başlayan satırlar alt başlık
// - "- " ile başlayan ardışık satırlar madde listesi
// - **kalın** vurgusu

export type TextBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export function parseBlocks(raw: string): TextBlock[] {
  const blocks: TextBlock[] = [];
  const chunks = raw.replace(/\r\n/g, "\n").split(/\n\s*\n/);
  for (const chunk of chunks) {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;
    if (lines.every((l) => l.startsWith("- "))) {
      blocks.push({ type: "ul", items: lines.map((l) => l.slice(2).trim()) });
      continue;
    }
    for (const line of lines.length === 1 ? lines : [lines.join(" ")]) {
      if (line.startsWith("## ")) blocks.push({ type: "h2", text: line.slice(3).trim() });
      else if (line.startsWith("# ")) blocks.push({ type: "h2", text: line.slice(2).trim() });
      else blocks.push({ type: "p", text: line });
    }
  }
  return blocks;
}

// "**kalın**" parçalarını ayırır: [{bold, text}]
export function parseBold(text: string): { bold: boolean; text: string }[] {
  const parts: { bold: boolean; text: string }[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ bold: false, text: text.slice(last, m.index) });
    parts.push({ bold: true, text: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ bold: false, text: text.slice(last) });
  return parts;
}

// Okuma süresi tahmini (dakika)
export function estimateReadMinutes(text: string) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Türkçe karakterleri sadeleştirip URL dostu slug üretir
export function slugify(text: string) {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", I: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return text
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
