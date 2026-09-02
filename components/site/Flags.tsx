// Dil seçici bayrakları (24x18) — GTranslate görünümüne benzer basit SVG'ler

export function FlagTR({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 18" className={className} aria-hidden="true">
      <rect width="24" height="18" fill="#e30a17" />
      <circle cx="9.5" cy="9" r="4.6" fill="#fff" />
      <circle cx="10.6" cy="9" r="3.7" fill="#e30a17" />
      <path
        d="M14.3 9l2.9.95-1.8-2.47v3.04l1.8-2.47L14.3 9l3.3.02-2.7 1.9 1-3.2-1 3.2 1-3.2z"
        fill="#fff"
      />
      <polygon points="15.2,6.8 15.9,8.6 17.8,8.6 16.3,9.7 16.9,11.5 15.2,10.4 13.5,11.5 14.1,9.7 12.6,8.6 14.5,8.6" fill="#fff" />
    </svg>
  );
}

export function FlagEN({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 18" className={className} aria-hidden="true">
      <rect width="24" height="18" fill="#012169" />
      <path d="M0 0l24 18M24 0L0 18" stroke="#fff" strokeWidth="3.4" />
      <path d="M0 0l24 18M24 0L0 18" stroke="#c8102e" strokeWidth="1.4" />
      <path d="M12 0v18M0 9h24" stroke="#fff" strokeWidth="5" />
      <path d="M12 0v18M0 9h24" stroke="#c8102e" strokeWidth="3" />
    </svg>
  );
}
