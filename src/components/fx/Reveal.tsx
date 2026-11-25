"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Lignes qui montent de derrière un masque, l'une après l'autre (titres).
 * L'entrée à l'écran est lue sur le titre entier : une ligne cachée sous son masque n'est jamais « visible ».
 */
export function RevealLines({ lines, className, delay = 0, as: Tag = "h1" }: { lines: string[]; className?: string; delay?: number; as?: "h1" | "h2" | "p" }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const shown = reduce || inView;
  return (
    <Tag ref={ref} className={className} aria-label={lines.join(" ")}>
      {lines.map((l, i) => (
        <span key={l + i} className="block overflow-hidden pb-[0.08em]" aria-hidden="true">
          <motion.span
            className="block"
            initial={reduce ? false : { y: "110%" }}
            animate={shown ? { y: "0%" } : { y: "110%" }}
            transition={{ duration: 1, ease: EASE, delay: delay + i * 0.09 }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Bloc qui apparaît en fondu et en montant à son entrée à l'écran. */
export function FadeUp({ children, className, delay = 0, y = 24 }: { children: React.ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
