import type { SVGProps } from "react";

// Çizgisel ikon seti: orijinal sitedeki 52x52 viewBox'lı SVG'lerden alındı.
// Kart ikonları panelden isimle seçilir (CARD_ICONS), diğerleri arayüz için.

const CARD_ICON_PATHS: Record<string, React.ReactNode> = {
  "user-plus": (
    <>
      <circle cx="26" cy="18" r="8" />
      <path d="M10 44c0-8.837 7.163-16 16-16s16 7.163 16 16" />
      <path d="M38 12h8m-4-4v8" />
    </>
  ),
  workflow: (
    <>
      <rect x="6" y="14" width="18" height="14" rx="2" />
      <path d="M24 18h16a2 2 0 012 2v16a2 2 0 01-2 2H24" />
      <path d="M15 28v10M15 14V8" />
      <path d="M30 26l4 3-4 3" />
    </>
  ),
  resize: (
    <>
      <rect x="10" y="10" width="32" height="32" rx="3" strokeDasharray="6 4" />
      <path d="M18 26h16M26 18v16" />
      <path d="M8 16V8h8M44 16V8h-8M8 36v8h8M44 36v8h-8" />
    </>
  ),
  "check-circle": (
    <>
      <circle cx="26" cy="26" r="16" />
      <path d="M18 26l5 5 11-12" strokeWidth="2.5" />
      <path d="M26 6v4M26 42v4M6 26h4M42 26h4" />
    </>
  ),
  "leaf-pin": (
    <>
      <path d="M26 8c-7 0-14 5-14 14 0 5 3 9 7 12l7 10 7-10c4-3 7-7 7-12 0-9-7-14-14-14z" />
      <circle cx="26" cy="22" r="5" />
      <path d="M20 34l-2 8h16l-2-8" />
    </>
  ),
  clock: (
    <>
      <circle cx="26" cy="26" r="16" />
      <path d="M26 16v12l8 4" strokeWidth="2.4" />
      <path d="M40 8l4 4M12 8L8 4" />
      <path d="M26 6V4M26 48v-2" />
    </>
  ),
  clipboard: (
    <>
      <path d="M10 12h32v28H10z" />
      <path d="M18 12V8h16v4" />
      <path d="M18 24h16M18 30h10" />
    </>
  ),
  pen: (
    <>
      <path d="M8 40l10-28 28 10-14 4-6 8z" />
      <circle cx="30" cy="28" r="3" />
    </>
  ),
  target: (
    <>
      <circle cx="26" cy="26" r="16" />
      <circle cx="26" cy="26" r="6" />
      <path d="M26 10v6M26 36v6M10 26h6M36 26h6" />
    </>
  ),
  cube: (
    <>
      <path d="M26 6l18 10v20L26 46 8 36V16z" />
      <path d="M26 26v20M26 26L8 16M26 26l18-10" />
    </>
  ),
  document: (
    <>
      <rect x="12" y="8" width="28" height="36" rx="2" />
      <path d="M20 18h12M20 24h12M20 30h8" />
      <path d="M12 38h28" />
    </>
  ),
  gauge: (
    <>
      <path d="M14 26a12 12 0 0124 0" />
      <path d="M26 26l6-8" strokeWidth="2.5" />
      <circle cx="26" cy="26" r="3" />
      <path d="M10 38h32" />
      <path d="M14 38v4h24v-4" />
    </>
  ),
  truck: (
    <>
      <rect x="6" y="16" width="26" height="20" rx="2" />
      <path d="M32 22h10l4 8v6h-6" />
      <circle cx="16" cy="38" r="4" />
      <circle cx="38" cy="38" r="4" />
      <path d="M20 36h14" />
    </>
  ),
  warehouse: (
    <>
      <rect x="10" y="14" width="32" height="28" rx="2" />
      <path d="M10 22h32M18 14V8M34 14V8" />
      <rect x="20" y="28" width="12" height="8" rx="1" />
    </>
  ),
  globe: (
    <>
      <circle cx="26" cy="26" r="16" />
      <path d="M16 22c2-4 6-6 10-6s8 2 10 6" />
      <path d="M16 30c2 4 6 6 10 6s8-2 10-6" />
      <path d="M26 10v32M10 26h32" />
    </>
  ),
  chart: (
    <>
      <path d="M10 38l8-12 8 6 8-16 8 10" strokeWidth="2.4" />
      <path d="M10 42h32" />
      <path d="M38 18l4-2v6" />
    </>
  ),
  gear: (
    <>
      <circle cx="26" cy="26" r="10" />
      <path d="M26 16V8M26 44v-8M36 26h8M8 26h8" />
      <path d="M16 16l-4-4M40 40l-4-4M36 16l4-4M12 40l4-4" />
    </>
  ),
  pin: (
    <>
      <path d="M26 8c-7 0-14 5-14 14 0 5 3 9 7 12l7 10 7-10c4-3 7-7 7-12 0-9-7-14-14-14z" />
      <circle cx="26" cy="22" r="5" />
    </>
  ),
  phone: (
    <path d="M17 10h6l3 7-4 3c2.7 5.2 6.8 9.3 12 12l3-4 7 3v6c0 2-1.6 3.5-3.6 3.4C23.7 39.7 12.3 28.3 11.6 11.6 11.5 9.6 13 8 15 8h2z" />
  ),
  mail: (
    <>
      <rect x="8" y="14" width="36" height="24" rx="3" />
      <path d="M10 16l16 12 16-12" />
    </>
  ),
  share: (
    <>
      <circle cx="17" cy="26" r="3.5" />
      <circle cx="35" cy="16" r="3.5" />
      <circle cx="35" cy="36" r="3.5" />
      <path d="M20 24l11-6M20 28l11 6" />
    </>
  ),
};

export const CARD_ICONS = Object.keys(CARD_ICON_PATHS) as CardIconName[];
export type CardIconName =
  | "user-plus"
  | "workflow"
  | "resize"
  | "check-circle"
  | "leaf-pin"
  | "clock"
  | "clipboard"
  | "pen"
  | "target"
  | "cube"
  | "document"
  | "gauge"
  | "truck"
  | "warehouse"
  | "globe"
  | "chart"
  | "gear"
  | "pin"
  | "phone"
  | "mail"
  | "share";

export const CARD_ICON_LABELS: Record<CardIconName, string> = {
  "user-plus": "Kişi (+)",
  workflow: "İş akışı",
  resize: "Ölçü / boyut",
  "check-circle": "Onay işareti",
  "leaf-pin": "Yaprak / doğa",
  clock: "Saat",
  clipboard: "Pano",
  pen: "Kalem / tasarım",
  target: "Hedef",
  cube: "Küp / prototip",
  document: "Belge",
  gauge: "Gösterge",
  truck: "Kamyon",
  warehouse: "Depo",
  globe: "Dünya",
  chart: "Grafik",
  gear: "Dişli",
  pin: "Konum",
  phone: "Telefon",
  mail: "E-posta",
  share: "Paylaş",
};

// Kart ikonu: 52x52 viewBox, ince çizgi
export function CardIcon({
  name,
  className,
  strokeWidth = 2.2,
}: {
  name: CardIconName | string;
  className?: string;
  strokeWidth?: number;
}) {
  const paths = CARD_ICON_PATHS[name] ?? CARD_ICON_PATHS["check-circle"];
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}

// ---------- Arayüz ikonları (24x24) ----------

export type IconName =
  | "mail"
  | "phone"
  | "facebook"
  | "instagram"
  | "x"
  | "linkedin"
  | "chevron-right"
  | "chevron-down"
  | "arrow-up"
  | "menu"
  | "close"
  | "external"
  | "home"
  | "building"
  | "box"
  | "image"
  | "pencil"
  | "settings"
  | "user"
  | "clock"
  | "whatsapp";

const UI_PATHS: Record<IconName, React.ReactNode> = {
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  phone: (
    <path d="M6.6 3h3l1.7 4.2-2.2 1.6a12 12 0 006 6l1.6-2.2L21 14.4v3a2 2 0 01-2.2 2C10.2 18.7 5.3 13.8 4.6 5.2A2 2 0 016.6 3z" />
  ),
  facebook: (
    <path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5z" fill="currentColor" stroke="none" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  x: (
    <path d="M4 3h4.5l4 5.7L17.5 3H20l-6.3 7.4L20.5 21H16l-4.3-6.1L6.5 21H4l6.6-7.8L4 3z" fill="currentColor" stroke="none" />
  ),
  linkedin: (
    <path d="M6.5 8.5v11M6.5 5v.5M10.5 19.5v-6a3 3 0 016 0v6M10.5 8.5v11" />
  ),
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "arrow-up": <path d="M12 19V5M5 12l7-7 7 7" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />,
  home: <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z" />,
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3" />
    </>
  ),
  box: (
    <>
      <path d="M12 3l9 4.5v9L12 21l-9-4.5v-9z" />
      <path d="M12 12v9M12 12L3 7.5M12 12l9-4.5" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 16l-5-5-8 8" />
    </>
  ),
  pencil: <path d="M4 20h4l11-11-4-4L4 16v4zM13 7l4 4" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  whatsapp: (
    <path
      d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 2a8 8 0 110 16 8 8 0 01-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 0112 4zm-3 4.5c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.2 5 4.4 2.5 1 3 .8 3.5.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4l-.5-.3-1.9-.9c-.3-.1-.5-.2-.7.1l-.9 1.1c-.2.2-.3.2-.6.1a6.6 6.6 0 01-3.3-2.9c-.2-.4.2-.4.6-1.3.1-.2 0-.4 0-.5l-.9-2c-.2-.6-.5-.5-.7-.5H9z"
      fill="currentColor"
      stroke="none"
    />
  ),
};

export function Icon({
  name,
  className,
  ...rest
}: { name: IconName; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {UI_PATHS[name]}
    </svg>
  );
}
