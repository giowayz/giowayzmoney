"use client";

import { motion } from "framer-motion";
import CardCarousel from "@/components/CardCarousel";
import OfferCard from "@/components/OfferCard";
import type { OfferSeed } from "@/data/offers";

export default function CategorySection({
  id,
  title,
  offers,
}: {
  id: string;
  title: string;
  offers: OfferSeed[];
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-28">
      <motion.h2
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="font-display shimmer-text text-2xl mb-4"
      >
        {title}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="glow-ring liquid-glass relative mb-6 h-[260px] sm:h-[320px] overflow-hidden rounded-2xl"
      >
        <CardCarousel offers={offers} maxCardWidth={260} captureWheel={false} />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer, i) => (
          <motion.div
            key={offer.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
          >
            <OfferCard offer={offer} index={i} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
