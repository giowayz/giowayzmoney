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

      <nav className="liquid-glass mb-12 flex flex-wrap gap-2 rounded-2xl p-3">
        {categories.map(({ category, offers }) => (
          <a
            key={category}
            href={`#${category}`}
            className="rounded-[5px] px-3 py-1.5 text-xs text-[#c9b7ff] hover:bg-[#5046e4]/20 hover:text-[#f4f0ff] transition"
          >
            {CATEGORY_LABELS[category]}
            <span className="ml-1.5 shimmer-text-soft">{offers.length}</span>
          </a>
        ))}
      </nav>

      {categories.map(({ category, offers }) => (
        <CategorySection key={category} id={category} title={CATEGORY_LABELS[category]} offers={offers} />
      ))}
    </div>
  );
}
