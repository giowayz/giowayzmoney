"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Banknote, CalendarClock, ShieldCheck } from "lucide-react";
import { OFFERS, CATEGORY_LABELS } from "@/data/offers";
import { getBankLogo } from "@/data/bankLogos";

const featured = OFFERS.find((o) => o.slug === "ozon-business-registration-rko")!;

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
    </section>
  );
}

function FooterStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Banknote;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Icon className="h-4 w-4 text-[#8c7aff]" strokeWidth={1.75} />
      <div className="text-[10px] uppercase tracking-wide text-white/40">{label}</div>
      <div className="text-sm text-[#f4f0ff]">{value}</div>
    </div>
  );
}
