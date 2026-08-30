"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden px-6 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(80,70,228,0.06)_0%,_transparent_65%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-sm uppercase tracking-widest shimmer-text-vivid"
        >
          О нас
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display glow-text text-3xl leading-[1.15] tracking-tight text-[#f4f0ff] sm:text-5xl lg:text-6xl"
        >
          Собираем <span className="shimmer-text">лучшие</span> банковские{" "}
          <span className="shimmer-text">офферы</span> в одном месте — и платим{" "}
          <span className="shimmer-text">честно</span>.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed shimmer-text-vivid sm:text-lg"
        >
          Мы каждый день проверяем условия у банков-партнёров, чтобы цена и срок холда в
          карточке оффера совпадали с тем, что вы получите на самом деле. Никакой воды —
          только точные цифры, реальные ссылки и статус вашей заявки в одном личном
          кабинете.
        </motion.p>
      </div>
    </section>
  );
}
