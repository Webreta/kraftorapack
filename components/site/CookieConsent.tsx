"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cerez-onay";

// Sitenin altında ince çerez bilgilendirme barı; kabul edilince bir daha çıkmaz
export function CookieConsent({
  text,
  linkLabel,
  after,
  accept,
  policyHref,
}: {
  text: string;
  linkLabel: string;
  after: string;
  accept: string;
  policyHref: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // depolama kapalıysa bar gösterilmez
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-900/40 bg-brand-950/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-3">
        <p className="text-xs text-white/90 sm:text-sm">
          {text}{" "}
          <Link href={policyHref} className="font-semibold text-brand-200 underline-offset-2 hover:underline">
            {linkLabel}
          </Link>{" "}
          {after}
        </p>
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.setItem(STORAGE_KEY, "1");
            } catch {
              // yoksay
            }
            setVisible(false);
          }}
          className="shrink-0 rounded-md bg-brand-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-brand-400 sm:text-sm"
        >
          {accept}
        </button>
      </div>
    </div>
  );
}
