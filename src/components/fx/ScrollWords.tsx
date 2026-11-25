"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

/** Une liste de grands mots qui s'allument l'un après l'autre au fil du défilement. */
export function ScrollWords({ items, className, dim = "rgba(255,255,255,0.14)", lit = "#FAFAFA" }: { items: { label: string; href?: string }[]; className?: string; dim?: string; lit?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  return (
    <ul ref={ref} className={className}>
      {items.map((it, i) => (
        <Word key={it.label} item={it} progress={scrollYProgress} index={i} count={items.length} dim={dim} lit={lit} still={!!reduce} />
      ))}
    </ul>
  );
}

function Word({ item, progress, index, count, dim, lit, still }: { item: { label: string; href?: string }; progress: MotionValue<number>; index: number; count: number; dim: string; lit: string; still: boolean }) {
  const start = index / count;
  const color = useTransform(progress, [start, start + 1 / count], [dim, lit]);
  const body = <motion.span style={{ color: still ? lit : color }}>{item.label}</motion.span>;
  return (
    <li>
      {item.href ? (
        <Link href={item.href} className="group inline-flex items-baseline gap-4 transition-transform duration-300 hover:translate-x-2">
          {body}
          <span className="font-mono text-[12px] tracking-[0.18em] opacity-0 transition-opacity group-hover:opacity-100">[ ÉCOUTER ]</span>
        </Link>
      ) : (
        body
      )}
    </li>
  );
}
