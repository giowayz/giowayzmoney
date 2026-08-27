"use client";

import { motion } from "framer-motion";
import { Search, ImageUp, Hourglass } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    n: "01",
    title: "Выбери оффер",
    text: "Каталог собран по категориям — РКО, регистрация бизнеса, кредитные и дебетовые карты. У каждого оффера сразу видна цена, целевое действие и срок холда, так что сравнивать варианты можно без лишних кликов.",
  },
  {
    icon: ImageUp,
    n: "02",
    title: "Оформи и подтверди",
    text: "Переходишь по ссылке банка, выполняешь целевое действие — открываешь счёт, оформляешь карту — и прикрепляешь скриншот подтверждения прямо в личном кабинете. Заявка сразу уходит на проверку.",
  },
  {
    icon: Hourglass,
    n: "03",
    title: "Дождись холда",
    text: "После одобрения запускается холд — фиксированный период, который банк держит перед выплатой. В кабинете видно точную дату окончания холда и сумму, без необходимости писать и спрашивать.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-10 md:mb-14 flex items-end justify-between"
      >
        <h2 className="font-display glow-text text-3xl md:text-5xl tracking-tight text-[#f4f0ff]">
          Как это работает
        </h2>
        <span className="hidden sm:block text-sm shimmer-text-soft">Три шага</span>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="liquid-glass rounded-2xl p-6 md:p-7"
          >
            <div className="mb-6 flex items-center justify-between">
              <step.icon className="h-6 w-6 text-[#f4f0ff]" strokeWidth={1.5} />
              <span className="text-2xl text-[#9382ff]">{step.n}</span>
            </div>
            <h3 className="font-display mb-2 text-[#f4f0ff]">{step.title}</h3>
            <p className="text-sm leading-relaxed shimmer-text-soft">{step.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
