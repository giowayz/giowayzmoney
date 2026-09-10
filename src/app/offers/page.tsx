import type { Metadata } from "next";
import CategorySection from "@/components/CategorySection";
import { CATEGORY_LABELS, getOffersByCategory, type OfferCategory } from "@/data/offers";

export const metadata: Metadata = {
  title: "Все офферы — Giøwayz Zøne",
};

const CATEGORY_ORDER: OfferCategory[] = [
  "rko",
  "business_registration",
  "credit_cards",
  "debit_cards",
];

export default function OffersPage() {
  const categories = CATEGORY_ORDER.map((category) => ({
    category,
    offers: getOffersByCategory(category),
  })).filter((c) => c.offers.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="font-display glow-text text-3xl text-[#f4f0ff] mb-2">Все офферы</h1>
      <p className="max-w-xl shimmer-text-soft mb-6 leading-relaxed">
        Актуальные цены, целевые действия и сроки холда по каждому банку — сгруппировано по
        категориям, чтобы можно было сравнить условия за один взгляд.
      </p>

      {/* Same chrome-rim language as the nav bar: the bar itself is framed,
          and each category is one of its pills. */}
      <nav className="chrome-frame liquid-glass mb-12 flex flex-wrap gap-2 rounded-full p-2">
        {categories.map(({ category, offers }) => (
          <a
            key={category}
            href={`#${category}`}
            className="chrome-frame flex h-9 items-center gap-1.5 rounded-[32px] bg-[#0b1a4a] px-3.5 transition hover:brightness-125"
          >
            <span className="chrome-badge-text text-xs">{CATEGORY_LABELS[category]}</span>
            <span className="chrome-badge-text text-xs opacity-70">{offers.length}</span>
          </a>
        ))}
      </nav>

      {categories.map(({ category, offers }) => (
        <CategorySection key={category} id={category} title={CATEGORY_LABELS[category]} offers={offers} />
      ))}
    </div>
  );
}
