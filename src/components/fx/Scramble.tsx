"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/[]_";

/**
 * Texte qui se résout lettre à lettre depuis des signes aléatoires, à son entrée à l'écran
 * (ou quand il change). En mouvement réduit : le texte, tout de suite.
 */
export function Scramble({ text, className, delay = 0, speed = 28 }: { text: string; className?: string; delay?: number; speed?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView || reduce) {
      setOut(text);
      return;
    }
    let solved = 0;
    let started = delay <= 0;
    setOut(text.replace(/\S/g, "\u00a0"));
    const wait = setTimeout(() => (started = true), delay);
    const id = setInterval(() => {
      if (!started) return;
      solved += 0.5;
      if (solved >= text.length) {
        clearInterval(id);
        setOut(text);
        return;
      }
      setOut(
        text
          .split("")
          .map((c, i) => (i < solved || c === " " ? c : i < solved + 6 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : "\u00a0"))
          .join(""),
      );
    }, speed);
    return () => {
      clearTimeout(wait);
      clearInterval(id);
    };
  }, [inView, reduce, text, delay, speed]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}

/** Étiquette entre crochets, en mono : « [ CATALOGUE ] ». */
export function Tag({ children, className, scramble = true, delay }: { children: string; className?: string; scramble?: boolean; delay?: number }) {
  const label = `[ ${children.toUpperCase()} ]`;
  return scramble ? <Scramble text={label} delay={delay} className={className} /> : <span className={className}>{label}</span>;
}
