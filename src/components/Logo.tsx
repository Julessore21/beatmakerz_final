import { cn } from "@/lib/cn";

/** La marque Beatmakerz : le carré à trois barres, liseré blanc, ombre violette (dessin du logo d'origine). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-7 w-7", className)} aria-hidden="true">
      <rect x="2" y="4.5" width="34" height="34" rx="9" fill="#5B2CC9" />
      <rect x="2" y="2" width="34" height="34" rx="9" fill="#fff" />
      <rect x="4.6" y="4.6" width="28.8" height="28.8" rx="7" fill="#09090B" />
      {[11, 19, 27].map((x) => (
        <g key={x}>
          <rect x={x - 2.4} y="10.2" width="4.8" height="19" rx="2.4" fill="#5B2CC9" />
          <rect x={x - 2.4} y="9" width="4.8" height="19" rx="2.4" fill="#fff" />
        </g>
      ))}
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-[0.14em]">BEATMAKERZ</span>
    </span>
  );
}
