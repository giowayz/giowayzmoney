"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Reusable page-load reveal — fade + slight rise, staggered by `delay`.
// For above-the-fold content where whileInView (scroll-triggered) doesn't
// apply, since it's already in view on first paint.
export default function FadeIn({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
