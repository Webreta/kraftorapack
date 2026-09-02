"use client";

import { useState, useTransition } from "react";
import { SavedToast } from "./SavedToast";

// Sürükle-bırak ile sıralanabilen liste; sıra değişince onReorder(idler) çağrılır
export function SortableList<T extends { id: number }>({
  items,
  onReorder,
  render,
  emptyText,
}: {
  items: T[];
  onReorder: (ids: number[]) => Promise<void>;
  render: (item: T) => React.ReactNode;
  emptyText: string;
}) {
  const [list, setList] = useState<T[]>(items);
  const [drag, setDrag] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [, startTransition] = useTransition();

  if (list.length === 0) {
    return (
      <p className="rounded-2xl border border-line bg-white p-6 text-center text-sm text-muted">{emptyText}</p>
    );
  }

  return (
    <div className="space-y-2">
      <SavedToast show={savedCount > 0} label="Sıralama kaydedildi" signal={savedCount} />
      {list.map((item, i) => (
        <div
          key={item.id}
          onDragOver={(e) => {
            if (drag !== null) {
              e.preventDefault();
              setDragOver(i);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (drag !== null && drag !== i) {
              const next = [...list];
              const [moved] = next.splice(drag, 1);
              next.splice(i, 0, moved);
              setList(next);
              setSavedCount((c) => c + 1);
              startTransition(() => onReorder(next.map((x) => x.id)));
            }
            setDrag(null);
            setDragOver(null);
          }}
          className={`flex flex-wrap items-center gap-3 rounded-xl border bg-white px-3 py-2.5 transition ${
            dragOver === i ? "border-brand-400 ring-2 ring-brand-200" : "border-line"
          } ${drag === i ? "opacity-50" : ""}`}
        >
          <span
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = "move";
              setDrag(i);
            }}
            onDragEnd={() => {
              setDrag(null);
              setDragOver(null);
            }}
            title="Sürükleyerek sırala"
            className="shrink-0 cursor-grab select-none text-[#999] active:cursor-grabbing"
          >
            ⠿
          </span>
          {render(item)}
        </div>
      ))}
    </div>
  );
}
