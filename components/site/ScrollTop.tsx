"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

// Sağ altta yuvarlak "yukarı çık" butonu; sayfa biraz kaydırılınca görünür
export function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Yukarı çık"
      className={`fixed bottom-5 right-5 z-30 flex size-9 items-center justify-center rounded-full border-2 border-[#ccc] bg-white/90 text-[#777] shadow transition hover:border-brand-500 hover:text-brand-500 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <Icon name="chevron-down" className="size-4 rotate-180" />
    </button>
  );
}
