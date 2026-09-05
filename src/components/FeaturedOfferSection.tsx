"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Banknote, CalendarClock, ShieldCheck } from "lucide-react";
import { OFFERS, CATEGORY_LABELS } from "@/data/offers";
import { getBankLogo } from "@/data/bankLogos";

const featured = OFFERS.find((o) => o.slug === "ozon-business-registration-rko")!;

// Three more real RKO offers, shown as compact cards under the featured one —
// same "several offers below the hero card" shape as the reference mockup.
const MORE_SLUGS = ["alfa-bank-rko", "tochka-bank-rko", "vtb-rko"];
const moreOffers = MORE_SLUGS.map((slug) => OFFERS.find((o) => o.slug === slug)!);

export default function FeaturedOfferSection() {
  const logo = getBankLogo(featured.bankKey);

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-6 flex items-end justify-between"
      >
        <span className="text-xs uppercase tracking-widest shimmer-text-vivid">Актуальные офферы</span>
        <Link
          href="/offers"
          className="flex items-center gap-1.5 text-sm shimmer-text-vivid hover:text-[#9382ff] transition-colors"
        >
          Смотреть все
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <Link
          href={`/offers/${featured.slug}`}
          className="glow-ring liquid-glass card-hover-glow group relative block overflow-hidden rounded-2xl p-6 md:p-7"
        >
          <div className="card-sheen" style={{ "--sheen-delay": "0s" } as CSSProperties} />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <span className="glow-ring relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-2">
                {logo ? (
                  <img src={logo} alt="" className="h-full w-full object-contain" draggable={false} />
                ) : (
                  <span className="text-lg font-bold text-black">{featured.bank.slice(0, 1)}</span>
                )}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl md:text-2xl text-[#f4f0ff] group-hover:text-[#9382ff] transition-colors">
                    {featured.bank}
                  </h3>
                  <span className="badge-glow rounded-[32px] px-2.5 py-1 text-[10px] font-medium text-[#c9b7ff]">
                    {CATEGORY_LABELS[featured.category]}
                  </span>
                </div>
                <p className="mt-1 text-sm shimmer-text-soft">
                  {featured.name.split("—")[1]?.trim() ?? featured.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <div>
                <span className="font-display glow-text text-3xl md:text-4xl text-[#f4f0ff] tabular-nums">
                  {featured.price.toLocaleString("ru-RU")} ₽
                </span>
                <div className="mt-1 text-xs shimmer-text-soft">холд {featured.defaultHoldDays} дн.</div>
              </div>
              <span className="btn-glow-primary shrink-0 text-sm">Оформить</span>
            </div>
          </div>

          <span className="aurora-divider relative mt-5 block" />

          <div className="relative mt-4 grid grid-cols-3 gap-3 text-center">
            <FooterStat icon={Banknote} label="Выплата" value={`${featured.price.toLocaleString("ru-RU")} ₽`} />
            <FooterStat icon={CalendarClock} label="Холд" value={`${featured.defaultHoldDays} дней`} />
            <FooterStat icon={ShieldCheck} label="Подтверждение" value="Скриншот" />
          </div>
        </Link>
      </motion.div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {moreOffers.map((offer, i) => (
          <CompactOfferCard key={offer.slug} offer={offer} delay={0.15 + i * 0.08} />
        ))}
      </div>
    </section>
  );
}

function CompactOfferCard({ offer, delay }: { offer: (typeof OFFERS)[number]; delay: number }) {
  const logo = getBankLogo(offer.bankKey);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay }}
    >
      <Link
        href={`/offers/${offer.slug}`}
        className="glow-ring liquid-glass card-hover-glow group relative block overflow-hidden rounded-2xl p-4"
      >
        <div className="card-sheen" style={{ "--sheen-delay": `${1.2 + delay}s` } as CSSProperties} />

        <div className="relative flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="glow-ring relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1.5">
              {logo ? (
                <img src={logo} alt="" className="h-full w-full object-contain" draggable={false} />
              ) : (
                <span className="text-xs font-bold text-black">{offer.bank.slice(0, 1)}</span>
              )}
            </span>
            <h4 className="font-display truncate text-sm text-[#f4f0ff] group-hover:text-[#9382ff] transition-colors">
              {offer.bank}
            </h4>
          </div>
          <span className="badge-glow shrink-0 rounded-[32px] px-2 py-1 text-[10px] font-medium text-[#c9b7ff]">
            {CATEGORY_LABELS[offer.category]}
          </span>
        </div>

        <div className="relative mt-3 flex items-center justify-between">
          <span className="font-display glow-text text-xl text-[#f4f0ff] tabular-nums">
            {offer.price.toLocaleString("ru-RU")} ₽
          </span>
          <span className="btn-glow-primary shrink-0 px-4 py-2 text-xs">Оформить</span>
        </div>
        <div className="relative mt-1 text-[10px] shimmer-text-soft">холд {offer.defaultHoldDays} дн.</div>

        <span className="aurora-divider relative mt-3 block" />

        <div className="relative mt-3 grid grid-cols-3 gap-1 text-center">
          <FooterStat icon={Banknote} label="Выплата" value={`${offer.price.toLocaleString("ru-RU")} ₽`} compact />
          <FooterStat icon={CalendarClock} label="Холд" value={`${offer.defaultHoldDays} дн.`} compact />
          <FooterStat icon={ShieldCheck} label="Скрин" value="✓" compact />
        </div>
      </Link>
    </motion.div>
  );
}

function FooterStat({
  icon: Icon,
  label,
  value,
  compact = false,
}: {
  icon: typeof Banknote;
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className={compact ? "h-3 w-3 text-[#8c7aff]" : "h-4 w-4 text-[#8c7aff]"} strokeWidth={1.75} />
      <div className={compact ? "text-[8px] uppercase tracking-wide text-white/40" : "text-[10px] uppercase tracking-wide text-white/40"}>
        {label}
      </div>
      <div className={compact ? "text-xs text-[#f4f0ff]" : "text-sm text-[#f4f0ff]"}>{value}</div>
    </div>
  );
}
