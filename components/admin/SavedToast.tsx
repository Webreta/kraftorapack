"use client";

import { useEffect, useState } from "react";

// Sağ üstte beliren "Kaydedildi" etiketi; birkaç saniye sonra kaybolur.
// clearQuery: URL'deki ?kaydedildi=1 parametresini temizler (yenilemede tekrar çıkmasın)
export function SavedToast({
  show,
  label = "Kaydedildi",
  clearQuery = false,
  signal,
}: {
  show: boolean;
  label?: string;
  clearQuery?: boolean;
  // Arka arkaya kayıtlarda toast'un yeniden görünmesi için değişen bir değer (örn. form state)
  signal?: unknown;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    if (clearQuery) {
      window.history.replaceState({}, "", window.location.pathname);
    }
    const t = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(t);
  }, [show, clearQuery, signal]);

  if (!visible) return null;
  return (
    <div className="fixed right-6 top-6 z-50 flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <path d="m5 13 4 4L19 7" />
      </svg>
      {label}
    </div>
  );
}
