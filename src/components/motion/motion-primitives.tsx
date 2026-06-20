"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Snappy by default — engineers hate slow UI. Quick, crisp entrances, no fluff.
const easeOut = [0.22, 1, 0.36, 1] as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18, ease: easeOut } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03, delayChildren: 0 } },
};

/** A container that staggers its children into view. */
export function MotionStagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** A single item that fades + lifts into place. */
export function MotionItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeInUp} className={cn(className)}>
      {children}
    </motion.div>
  );
}
