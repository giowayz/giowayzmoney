"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, LayoutGrid, UserRound } from "lucide-react";

const SERVICES = [
  {
    tag: "Каталог",
    title: "Все офферы в одном месте",
    text: "23 действующих оффера по РКО, регистрации бизнеса, кредитным и дебетовым картам. У каждого — точная цена, целевое действие и срок холда, отсортировано по категориям, без лишнего скролла.",
    href: "/offers",
    icon: LayoutGrid,
    image: "/brand/logo-geekoffers.jpg",
  },
  {
    tag: "Кабинет",
    title: "Прозрачный трекинг выплат",
    text: "Загружай скриншот подтверждения, следи за статусом каждой заявки и точной датой окончания холда. Вся история — даты, суммы, статусы — собрана в одном месте.",
    href: "/cabinet",
    icon: UserRound,
    image: "/brand/logo-moneytracker.png",
  },
];

export default function ServicesSection() {
  return (
    <section className="relative mx-auto max-w-6xl overflow-hidden px-4 sm:px-6 py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(80,70,228,0.05)_0%,_transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative mb-10 md:mb-14 flex items-end justify-between"
      >
        <h2 className="font-display glow-text text-3xl md:text-5xl tracking-tight text-[#f4f0ff]">Что внутри</h2>
        <span className="hidden sm:block text-sm shimmer-text-vivid">Сервисы</span>
      </motion.div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.tag}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
          >
            <Link href={s.href} className="group liquid-glass block overflow-hidden rounded-2xl">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  loading={i === 0 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="icon-badge absolute right-6 top-6 h-10 w-10 rounded-[12px]">
                  <s.icon className="h-5 w-5 text-[#8c7aff]" strokeWidth={1.75} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/80 via-[#030014]/10 to-transparent" />
              </div>
              <div className="p-6 md:p-8">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest shimmer-text-vivid">{s.tag}</span>
                  <span className="icon-badge flex h-8 w-8 items-center justify-center rounded-[10px]">
                    <ArrowUpRight className="h-4 w-4 text-[#8c7aff]" strokeWidth={1.75} />
                  </span>
                </div>
                <h3 className="font-display mb-3 text-xl md:text-2xl tracking-tight text-[#f4f0ff]">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed shimmer-text-vivid">{s.text}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
