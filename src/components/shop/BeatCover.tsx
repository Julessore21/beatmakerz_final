/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { coverStyleOf, seedOf, type CoverStyle } from "@/lib/coverStyle";
import { cn } from "@/lib/cn";

/**
 * La pochette d'une prod : son image si elle en a une, sinon une pochette dessinée dans la direction
 * artistique de son style (trap, drill, cloud…), avec son titre et ses vraies données.
 * Les tailles suivent la largeur de la pochette (unités cqw) : géante sur l'accueil, vignette dans
 * une liste (le titre ne s'affiche qu'à partir d'une taille lisible).
 */
export interface BeatCoverProps {
  id: string;
  title: string;
  genres?: string[];
  bpm?: number | null;
  keyName?: string | null;
  url?: string | null;
  /** Numéro affiché en haut (sélection de l'accueil). */
  index?: number;
  playing?: boolean;
  className?: string;
}

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

export function BeatCover({ id, title, genres, bpm, keyName, url, index, playing, className }: BeatCoverProps) {
  const style = coverStyleOf(genres);
  const s1 = seedOf(id, 1);
  const s2 = seedOf(id, 2);
  const s3 = seedOf(id, 3);
  const meta = [bpm ? `${bpm} BPM` : null, keyName].filter(Boolean).join(" · ");
  const layout = TITLE[style.id];

  return (
    // Une image pour les lecteurs d'écran : son texte (titre, tempo) est déjà dit à côté.
    <div role="img" aria-label={`Pochette de ${title}`} className={cn("cover relative overflow-hidden", className)} style={{ background: style.bg, color: style.fg }}>
      {url ? <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" /> : <Art style={style} s1={s1} s2={s2} s3={s3} />}

      {/* Grain : la matière commune à toutes les pochettes. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.9)_0.6px,transparent_0.6px)] [background-size:3px_3px]" />
      {url && <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />}

      {/* Libellés du haut (à partir d'une taille lisible). */}
      <div aria-hidden="true" className="cover-big absolute inset-x-0 top-0 flex items-start justify-between font-mono uppercase" style={{ padding: "6cqw", fontSize: "max(9px, 2.4cqw)", letterSpacing: "0.16em", opacity: 0.85 }}>
        <span>Beatmakerz{index != null ? ` — N°${String(index + 1).padStart(2, "0")}` : ""}</span>
        <span>{style.id === "default" ? "" : style.label}</span>
      </div>

      {/* Le titre, posé selon le style. */}
      <div aria-hidden="true" className={cn("cover-big absolute", layout.box)} style={{ padding: "6cqw" }}>
        {playing && (
          <span className="mb-[3cqw] flex h-[5cqw] items-end gap-[0.8cqw]" aria-hidden="true">
            {[0, 0.15, 0.3, 0.45, 0.6].map((d) => (
              <span key={d} className="h-full w-[1cqw] origin-bottom animate-bars rounded-full" style={{ animationDelay: `${d}s`, background: "currentColor" }} />
            ))}
          </span>
        )}
        <p className={cn("[overflow-wrap:anywhere]", layout.text)} style={layout.style(style)}>
          {layout.lower ? title.toLowerCase() : title}
        </p>
        {meta && (
          <p className="font-mono uppercase" style={{ marginTop: "2.6cqw", fontSize: "max(9px, 2.4cqw)", letterSpacing: "0.16em", opacity: 0.8 }}>
            {meta}
          </p>
        )}
      </div>
    </div>
  );
}

/** Où et comment chaque style pose le titre. */
const TITLE: Record<CoverStyle["id"], { box: string; text: string; lower?: boolean; style: (s: CoverStyle) => CSSProperties }> = {
  trap: { box: "inset-x-0 bottom-0", text: "font-semibold uppercase leading-[0.86]", style: () => ({ fontSize: "15cqw", letterSpacing: "-0.05em" }) },
  drill: { box: "inset-x-0 top-[12%]", text: "font-semibold uppercase leading-[0.9]", style: () => ({ fontSize: "12.5cqw", letterSpacing: "-0.01em" }) },
  cloud: { box: "inset-0 flex flex-col items-center justify-center text-center", text: "font-normal leading-[0.92]", lower: true, style: () => ({ fontSize: "14cqw", letterSpacing: "-0.05em" }) },
  lofi: { box: "inset-x-0 bottom-0", text: "font-medium leading-[0.9]", lower: true, style: () => ({ fontSize: "13cqw", letterSpacing: "-0.04em" }) },
  boombap: { box: "inset-x-0 bottom-0", text: "font-black uppercase leading-[0.84]", style: () => ({ fontSize: "15.5cqw", letterSpacing: "-0.05em" }) },
  afro: { box: "inset-x-0 bottom-0 text-center", text: "font-semibold uppercase leading-[0.88]", style: () => ({ fontSize: "13cqw", letterSpacing: "-0.03em" }) },
  rage: {
    box: "inset-0 flex flex-col items-center justify-center text-center",
    text: "font-black uppercase leading-[0.84]",
    style: (s) => ({ fontSize: "15cqw", letterSpacing: "-0.04em", textShadow: `0.8cqw 0 0 ${s.accent}, -0.8cqw 0 0 rgba(0,229,255,0.75)` }),
  },
  emo: { box: "inset-x-0 top-[12%]", text: "font-medium leading-[0.9]", lower: true, style: () => ({ fontSize: "13.5cqw", letterSpacing: "-0.045em" }) },
  rnb: { box: "inset-0 flex flex-col items-center justify-center text-center", text: "font-light leading-[0.92]", style: () => ({ fontSize: "13cqw", letterSpacing: "-0.05em" }) },
  default: { box: "inset-x-0 bottom-0", text: "font-semibold uppercase leading-[0.86]", style: () => ({ fontSize: "14cqw", letterSpacing: "-0.05em" }) },
};

/** Le dessin de chaque style. s1, s2, s3 : la variante propre à la prod. */
function Art({ style, s1, s2, s3 }: { style: CoverStyle; s1: number; s2: number; s3: number }) {
  const a = style.accent;
  switch (style.id) {
    case "trap":
      return (
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute rounded-full" style={{ width: "120%", height: "120%", left: pct(-0.2 + s1 * 0.4), top: pct(-0.15 + s2 * 0.3), background: `radial-gradient(closest-side, ${a}d9, ${a}40 55%, transparent)` }} />
          <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(115deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 4.5cqw)", maskImage: "linear-gradient(200deg, black, transparent 70%)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      );
    case "drill":
      return (
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0D1424, #04060B)" }}>
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(120,160,255,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(120,160,255,0.13) 1px, transparent 1px)", backgroundSize: "8cqw 8cqw" }} />
          <div className="absolute inset-x-0" style={{ top: pct(0.55 + s1 * 0.25), height: "1.4cqw", background: a, boxShadow: `0 0 6cqw 2cqw ${a}88` }} />
          <div className="absolute" style={{ right: "6cqw", bottom: "6cqw", width: "22cqw", height: "22cqw", border: `0.5cqw solid ${a}`, transform: `rotate(${Math.round(s2 * 45)}deg)` }} />
        </div>
      );
    case "cloud":
      return (
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(160deg, #CFC7FF, #9CA8FF)" }}>
          {[
            [0.05 + s1 * 0.3, 0.05, "#FFFFFF", 70],
            [0.45, 0.35 + s2 * 0.2, "#E7D9FF", 80],
            [0.1 + s3 * 0.3, 0.6, "#8C9BFF", 75],
          ].map(([x, y, c, w], i) => (
            <div key={i} className="absolute rounded-full" style={{ left: pct(x as number), top: pct(y as number), width: `${w}cqw`, height: `${w}cqw`, background: c as string, filter: "blur(9cqw)", opacity: 0.85 }} />
          ))}
        </div>
      );
    case "lofi":
      return (
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(180deg, #2E2016, #1C130C)" }}>
          <div className="absolute rounded-full" style={{ width: "62cqw", height: "62cqw", left: pct(0.12 + s1 * 0.36), top: "12%", background: `repeating-radial-gradient(circle, ${a} 0 0.7cqw, #C9813F 0.7cqw 1.4cqw)`, boxShadow: `0 0 10cqw ${a}55` }}>
            <div className="absolute left-1/2 top-1/2 h-[16cqw] w-[16cqw] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "#F4E3C8" }} />
          </div>
          <div className="absolute inset-x-0" style={{ top: "60%", height: "12cqw", background: `linear-gradient(180deg, ${a} 0 33%, #F4E3C8 33% 66%, #8C4A22 66%)`, opacity: 0.9 }} />
        </div>
      );
    case "boombap":
      return (
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(#111 32%, transparent 34%)", backgroundSize: "3.2cqw 3.2cqw", maskImage: `radial-gradient(ellipse 46% 36% at ${pct(0.55 + s1 * 0.15)} 50%, black 35%, transparent 100%)`, opacity: 0.85 }} />
          <div className="absolute grid place-items-center rounded-full font-mono uppercase" style={{ right: "6cqw", top: "16cqw", width: "24cqw", height: "24cqw", background: a, color: "#ECE6D8", fontSize: "3cqw", letterSpacing: "0.12em", transform: `rotate(${Math.round(-12 + s2 * 24)}deg)` }}>
            <span className="cover-big text-center leading-tight">
              Prod
              <br />
              Beatmakerz
            </span>
          </div>
        </div>
      );
    case "afro":
      return (
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(180deg, #2A0F05, #120603)" }}>
          <div className="absolute rounded-full" style={{ width: "150cqw", height: "150cqw", left: pct(-0.25 + s1 * 0.1), top: "38%", background: `repeating-radial-gradient(circle, ${a} 0 4cqw, #B4400C 4cqw 8cqw, #2A0F05 8cqw 11cqw)` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#170904] via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#170904] via-[#170904]/80 to-transparent" />
        </div>
      );
    case "rage":
      return (
        <div aria-hidden="true" className="absolute inset-0">
          {Array.from({ length: 7 }, (_, i) => {
            const r = seedOf(String(i), Math.round(s1 * 1000));
            return <div key={i} className="absolute" style={{ left: pct(r * 0.4), top: pct((i / 7) * 0.95 + s2 * 0.04), width: pct(0.35 + r * 0.6), height: `${1 + r * 5}cqw`, background: i % 3 ? a : "#FFFFFF", opacity: i % 3 ? 0.85 : 0.5, mixBlendMode: "screen" }} />;
          })}
          <div className="absolute inset-0" style={{ background: `radial-gradient(70% 60% at 50% 50%, transparent, ${style.bg})` }} />
        </div>
      );
    case "emo":
      return (
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${a}aa, transparent 65%)` }} />
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="absolute h-px" style={{ top: pct(0.5 + i * 0.055), left: pct(seedOf(String(i), Math.round(s1 * 999)) * 0.5), width: pct(0.2 + seedOf(String(i), Math.round(s2 * 999)) * 0.6), background: "#FFE4F0", opacity: 0.5 }} />
          ))}
        </div>
      );
    case "rnb":
      return (
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(160deg, #2A0A1E, #0E0209)" }}>
          {[
            [0.1 + s1 * 0.2, 0.1, a, 90, 30],
            [-0.2, 0.45 + s2 * 0.1, "#5C0F3B", 110, -20],
            [0.35, 0.65, "#E05A9A", 70, 15],
          ].map(([x, y, c, w, r], i) => (
            <div key={i} className="absolute rounded-[50%]" style={{ left: pct(x as number), top: pct(y as number), width: `${w}cqw`, height: `${(w as number) * 0.45}cqw`, background: c as string, filter: "blur(7cqw)", transform: `rotate(${r}deg)`, opacity: 0.8 }} />
          ))}
        </div>
      );
    default:
      return (
        <div aria-hidden="true" className="absolute inset-0" style={{ background: `radial-gradient(120% 90% at ${pct(0.1 + s1 * 0.3)} 15%, hsl(${255 + Math.round(s2 * 25)} 70% 42%) 0%, transparent 60%), radial-gradient(90% 80% at 85% 90%, hsl(${280 + Math.round(s3 * 20)} 65% 30%) 0%, transparent 65%), ${style.bg}` }} />
      );
  }
}
