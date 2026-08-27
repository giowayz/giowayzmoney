"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function toDateInput(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

const PRESETS: { label: string; range: () => [Date, Date] }[] = [
  { label: "Сегодня", range: () => [new Date(), new Date()] },
  {
    label: "Вчера",
    range: () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return [d, new Date(d)];
    },
  },
  {
    label: "7 дней",
    range: () => {
      const from = new Date();
      from.setDate(from.getDate() - 6);
      return [from, new Date()];
    },
  },
  { label: "Этот месяц", range: () => [startOfMonth(new Date()), new Date()] },
  {
    label: "Прошлый месяц",
    range: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const to = new Date(now.getFullYear(), now.getMonth(), 0);
      return [from, to];
    },
  },
  {
    label: "30 дней",
    range: () => {
      const from = new Date();
      from.setDate(from.getDate() - 29);
      return [from, new Date()];
    },
  },
];

export default function DateRangeFilter({ from, to }: { from: string; to: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);

  function apply(nextFrom: string, nextTo: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", nextFrom);
    params.set("to", nextTo);
    router.push(`/statistics?${params.toString()}`);
  }

  return (
    <div className="liquid-glass rounded-2xl p-4 mb-8">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              const [f, t] = p.range();
              const nf = toDateInput(f);
              const nt = toDateInput(t);
              setDraftFrom(nf);
              setDraftTo(nt);
              apply(nf, nt);
            }}
            className="chrome-frame rounded-[32px] px-3 py-1.5 text-xs hover:brightness-125 transition"
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="date"
          value={draftFrom}
          onChange={(e) => setDraftFrom(e.target.value)}
          className="liquid-glass rounded-[5px] px-3 py-2 text-sm outline-none focus:shadow-[inset_0_0_0_1px_#9382ff]"
        />
        <span className="text-sm shimmer-text-soft">→</span>
        <input
          type="date"
          value={draftTo}
          onChange={(e) => setDraftTo(e.target.value)}
          className="liquid-glass rounded-[5px] px-3 py-2 text-sm outline-none focus:shadow-[inset_0_0_0_1px_#9382ff]"
        />
        <button
          type="button"
          onClick={() => apply(draftFrom, draftTo)}
          className="rounded-[5px] bg-[#5046e4] px-4 py-2 text-sm font-medium text-white hover:bg-[#10093a] transition"
        >
          Применить
        </button>
      </div>
    </div>
  );
}
