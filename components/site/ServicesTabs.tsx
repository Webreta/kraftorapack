"use client";

import { useState } from "react";
import { CardIcon } from "./Icon";
import { SERVICE_TAB_COLORS } from "@/lib/settings/genel";

export type ServiceTabView = {
  title: string;
  cards: { icon: string; title: string; text: string }[];
};

// Ana sayfa hizmet sekmeleri: her sekmenin kendi vurgu rengi var
export function ServicesTabs({ tabs }: { tabs: ServiceTabView[] }) {
  const [active, setActive] = useState(0);
  const color = SERVICE_TAB_COLORS[active % SERVICE_TAB_COLORS.length];
  const tab = tabs[active];
  if (!tab) return null;

  return (
    <div>
      <div role="tablist" className="mb-8 flex flex-wrap items-center justify-center border-b-2 border-line">
        {tabs.map((tb, i) => {
          const c = SERVICE_TAB_COLORS[i % SERVICE_TAB_COLORS.length];
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className="-mb-[2px] whitespace-nowrap px-3 py-2 text-[13px] font-semibold transition md:px-6 md:py-3 md:text-[15px]"
              style={{
                color: isActive ? c.accent : "#888",
                borderBottom: `3px solid ${isActive ? c.accent : "transparent"}`,
              }}
            >
              {tb.title}
            </button>
          );
        })}
      </div>
      <div className="grid gap-5 md:grid-cols-3" role="tabpanel">
        {tab.cards.map((card, i) => (
          <div
            key={i}
            className="rounded-xl px-7 py-8 text-left"
            style={{ background: color.bg, border: `1px solid ${color.border}` }}
          >
            <div className="mb-5 size-[52px]" style={{ color: color.accent }}>
              <CardIcon name={card.icon} className="size-full" />
            </div>
            <h3 className="mb-2.5 text-[18px] font-bold leading-snug text-ink">{card.title}</h3>
            <p className="text-[14px] leading-[1.65] text-muted">{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
