import Link from "next/link";
import type { CSSProperties } from "react";
import type { OfferSeed } from "@/data/offers";
import { getBankLogo } from "@/data/bankLogos";

export default function OfferCard({ offer, index = 0 }: { offer: OfferSeed; index?: number }) {
  const logo = getBankLogo(offer.bankKey);

  return (
    <Link
      href={`/offers/${offer.slug}`}
      className="glow-ring liquid-glass card-float card-hover-glow group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 contain-content"
      style={{ animationDelay: `${(index % 5) * 0.4}s` }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 90% at 100% 0%, rgba(147,130,255,0.14), transparent 55%), radial-gradient(90% 70% at 0% 100%, rgba(80,70,228,0.12), transparent 60%)",
        }}
      />
      <div
        className="card-sheen"
        style={{ "--sheen-delay": `${(index % 6) * 1.1}s` } as CSSProperties}
      />

      <div className="relative">
        <div className="mb-3 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <span className="glow-ring relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1.5">
              {logo ? (
                <img src={logo} alt="" className="h-full w-full object-contain" draggable={false} />
              ) : (
                <span className="text-xs font-bold text-black">{offer.bank.slice(0, 1)}</span>
              )}
            </span>
            <div className="text-xs uppercase tracking-wider shimmer-text-soft">{offer.bank}</div>
          </div>
          <span className="badge-glow shrink-0 rounded-[32px] px-2.5 py-1 text-[10px] font-medium text-[#c9b7ff]">
            {offer.defaultHoldDays} дн. холд
          </span>
        </div>
        <h3 className="font-display leading-snug mb-2 text-[#f4f0ff] group-hover:text-[#9382ff] transition-colors">
          {offer.name}
        </h3>
        <p className="text-sm shimmer-text-soft line-clamp-3">{offer.action}</p>
      </div>

      <div className="relative mt-4">
        <span className="aurora-divider block" />
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display glow-text text-lg text-[#f4f0ff] tabular-nums">
            {offer.price.toLocaleString("ru-RU")} ₽
          </span>
          <span className="text-sm shimmer-text-soft group-hover:text-[#9382ff] transition-colors">
            Подробнее →
          </span>
        </div>
      </div>
    </Link>
  );
}
