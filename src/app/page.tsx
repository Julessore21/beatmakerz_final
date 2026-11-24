"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useAudio } from "@/context/AudioPlayerContext";
import { useCart } from "@/context/CartContext";
import { cheapest, FORMAT_LABEL, genresOf, type Beat } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";
import { useCatalog } from "@/lib/useCatalog";
import { useOffers } from "@/lib/useOffers";
import { cn } from "@/lib/cn";
import { Accordion } from "@/components/ui/Accordion";
import { CountUp } from "@/components/fx/CountUp";
import { LiveClock } from "@/components/fx/LiveClock";
import { FadeUp, RevealLines } from "@/components/fx/Reveal";
import { Scramble, Tag } from "@/components/fx/Scramble";
import { ScrollWords } from "@/components/fx/ScrollWords";
import { ArtCover } from "@/components/shop/ArtCover";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIDEOS = [
  { src: "/videos/videotest3.mp4", poster: "/videos/poster3.jpg" },
  { src: "/videos/videotest2.mp4", poster: "/videos/poster2.jpg" },
  { src: "/videos/videotest0.mp4", poster: "/videos/poster0.jpg" },
];
const FALLBACK_GENRES = ["Trap", "Drill", "Cloud", "Lofi", "Boom bap", "Afro", "Rage"];
const pill = "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors";

export default function Home() {
  const { beats } = useCatalog();
  const { basic, custom } = useOffers();
  const featured = beats?.slice(0, 4) ?? [];
  const genres = beats && beats.length ? genresOf(beats).slice(0, 8) : FALLBACK_GENRES;
  const basicPrice = basic ? formatPrice(basic.priceCents, basic.currency) : null;
  const customPrice = custom?.priceCents != null ? formatPrice(custom.priceCents, custom.currency) : null;

  return (
    <>
      <Hero latest={featured[0] ?? null} queue={featured} />

      {/* Présentation */}
      <section className="container-site grid gap-10 pt-16 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr]">
        <RevealLines lines={["Des prods", "prêtes", "à poser."]} className="text-[clamp(56px,9.5vw,140px)] font-medium leading-[0.88] tracking-[-0.055em]" />
        <FadeUp className="max-w-md lg:justify-self-end lg:pt-3" delay={0.2}>
          <Tag className="eyebrow">Beatmakerz · prods pour rappeurs</Tag>
          <p className="mt-6 text-[22px] leading-[1.35] tracking-[-0.015em] sm:text-[24px]">
            Des instrumentales pour poser ce soir.{" "}
            <span className="text-fg-faint">Trap, drill, cloud, lofi : écoute les extraits, prends la licence, télécharge tes fichiers dès le paiement.</span>
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-6">
            <Fact k="TikTok" v={SITE.tiktokFollowers} />
            <Fact k="La prod" v={basicPrice ?? "—"} />
            <Fact k="Téléchargement" v="Immédiat" />
          </dl>
        </FadeUp>
      </section>

      {/* Les prods en grand */}
      <section className="container-site pt-28 sm:pt-40" aria-label="Sélection de prods">
        <div className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-5">
          <Tag className="eyebrow text-fg-muted">Sélection</Tag>
          <Link href="/web/catalogue" className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-muted hover:text-fg">
            [ Tout le catalogue ]
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
        {beats === null ? (
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="skeleton aspect-[4/5] w-full rounded-[28px]" />
            <div className="hidden lg:block" />
          </div>
        ) : featured.length ? (
          <div className="space-y-16 sm:space-y-28">
            {featured.map((b, i) => (
              <Showcase key={b.id} beat={b} index={i} total={featured.length} queue={featured} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-fg-muted">Les premières prods arrivent très bientôt.</p>
        )}
      </section>

      {/* Ce qu'on compose : la bande claire, les genres s'allument au défilement */}
      <section className="mt-28 bg-[#F2F2F0] text-ink sm:mt-40">
        <div className="container-site grid gap-12 py-24 sm:py-32 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <RevealLines as="h2" lines={["Ce qu’on", "compose."]} className="text-[clamp(40px,5vw,64px)] font-medium leading-[0.95] tracking-[-0.045em]" />
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-ink/55">Chaque genre du catalogue, et la prod que tu n’as pas encore trouvée : on la compose pour toi.</p>
            <Link href="/web/prodsurmesure" className={cn(pill, "mt-8 bg-ink text-white hover:bg-ink/85")}>
              [ Prod sur mesure ]
            </Link>
          </div>
          <ScrollWords
            className="text-[clamp(44px,6.4vw,96px)] font-medium leading-[1.02] tracking-[-0.045em]"
            dim="rgba(9,9,11,0.12)"
            lit="#09090B"
            items={[...genres.map((g) => ({ label: g, href: `/web/catalogue?genre=${encodeURIComponent(g)}` })), { label: "Sur mesure", href: "/web/prodsurmesure" }]}
          />
        </div>
      </section>

      {/* Les deux offres */}
      <section id="licence" className="container-site scroll-mt-28 pt-28 sm:pt-40">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Tag className="eyebrow text-fg-muted">Acheter</Tag>
            <RevealLines as="h2" lines={["Une prod du catalogue,", "ou la tienne."]} className="mt-5 text-[clamp(36px,4.4vw,56px)] font-medium leading-[0.98] tracking-[-0.04em]" />
            <p className="mt-6 max-w-sm text-fg-muted">Sans abonnement : tu paies la prod, tu repars avec tes fichiers et ta licence.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Offer
              tag="Licence"
              price={basicPrice}
              text="Pour poser sur une prod du catalogue et la sortir."
              points={["Usage commercial : streaming, clips, scène", "MP3 haute qualité, WAV selon la prod", "Fichiers dans ton compte dès le paiement", "Non exclusive, revente interdite"]}
              cta={{ href: "/web/catalogue", label: "Choisir une prod" }}
              primary
            />
            <Offer
              tag="Sur mesure"
              price={customPrice}
              text="Une prod faite pour toi, à partir de tes références."
              points={["Exclusive : vendue qu’à toi", "Contrat de cession fourni", "Jamais remise en vente", "Brief simple, suivi par mail"]}
              cta={{ href: "/web/prodsurmesure", label: "Faire ma demande" }}
            />
          </div>
        </div>
      </section>

      {/* TikTok */}
      <section className="container-site pt-28 sm:pt-40">
        <div className="flex flex-col gap-10 border-t border-line pt-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Tag className="eyebrow text-fg-muted">Sur TikTok</Tag>
            <p className="mt-4 text-[clamp(72px,13vw,200px)] font-medium leading-[0.85] tracking-[-0.06em] tabular-nums">
              <CountUp to={40000} />
            </p>
            <p className="mt-4 text-[20px] text-fg-muted">abonnés écoutent nos prods.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={SITE.socials.tiktok} target="_blank" rel="noreferrer" className={cn(pill, "bg-fg text-ink hover:bg-white/85")}>
              [ Suivre sur TikTok ]
            </a>
            <a href={SITE.socials.instagram} target="_blank" rel="noreferrer" className={cn(pill, "border border-line-strong text-fg hover:bg-white/[0.06]")}>
              [ Instagram ]
            </a>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="container-site grid gap-10 pt-28 sm:pt-40 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Tag className="eyebrow text-fg-muted">Questions</Tag>
          <RevealLines as="h2" lines={["Avant", "d’acheter."]} className="mt-5 text-[clamp(36px,4.4vw,56px)] font-medium leading-[0.98] tracking-[-0.04em]" />
          <Link href="/web/faq" className="mt-6 inline-flex font-mono text-[11px] uppercase tracking-[0.14em] text-fg-muted hover:text-fg">
            [ Toutes les questions ]
          </Link>
        </div>
        <Accordion
          items={[
            { q: "Qu’est-ce que je reçois après l’achat ?", a: "Le fichier MP3 de la prod, et le WAV quand la prod en a un. Ils sont à télécharger dans ton compte dès que le paiement est validé." },
            { q: "Je peux sortir mon morceau sur les plateformes ?", a: "Oui. La licence permet l’usage commercial : streaming, clips, scène. Elle n’est pas exclusive, et la revente de la prod est interdite." },
            { q: "Comment marche la prod sur mesure ?", a: "Tu remplis un brief (genre, tempo, ambiance, références), tu paies, et on compose ta prod. Elle est exclusive et n’est jamais remise en vente." },
            { q: "Je dois créer un compte ?", a: "Seulement au moment de payer : c’est là que tes fichiers t’attendent. Tu peux écouter et remplir ton panier sans compte." },
          ]}
        />
      </section>

      {beats && beats.length > 0 && <TitleMarquee beats={beats.slice(0, 12)} />}
    </>
  );
}

/** Ouverture : la vidéo du studio se déploie en plein écran, trois plans en fondu enchaîné. */
function Hero({ latest, queue }: { latest: Beat | null; queue: Beat[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setActive((a) => (a + 1) % VIDEOS.length), 7000);
    return () => clearInterval(id);
  }, [reduce]);
  useEffect(() => {
    const v = refs.current[active];
    if (v) void v.play().catch(() => undefined);
  }, [active]);

  return (
    <section ref={section} className="relative -mt-24 h-[100svh] min-h-[620px] sm:-mt-28">
      <motion.div
        className="absolute inset-0 overflow-hidden bg-ink-850"
        initial={reduce ? false : { clipPath: "inset(16% 12% 22% 12% round 36px)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
        transition={{ duration: 1.5, ease: EASE, delay: 0.15 }}
      >
        <motion.div className="absolute inset-0" style={reduce ? undefined : { y }} initial={reduce ? false : { scale: 1.18 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: EASE, delay: 0.15 }}>
          {VIDEOS.map((v, i) => (
            <video
              key={v.src}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms]", i === active ? "opacity-100" : "opacity-0")}
              src={v.src}
              poster={v.poster}
              muted
              loop
              playsInline
              autoPlay={i === 0}
              preload={i === 0 ? "auto" : "metadata"}
              aria-hidden="true"
            />
          ))}
        </motion.div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink" />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_100%,rgba(91,44,201,0.35),transparent_70%)]" />
      </motion.div>

      <div className="container-site relative flex h-full flex-col justify-end pb-6 sm:pb-8">
        <div className="grid items-end gap-4 sm:grid-cols-3">
          <motion.div className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-white/70 sm:block" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }}>
            <LiveClock />
          </motion.div>
          <motion.div className="flex justify-center" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8, ease: EASE }}>
            <Link href="/web/catalogue" className={cn(pill, "h-12 bg-ink/80 px-6 text-white backdrop-blur-md hover:bg-ink")}>
              <Scramble text="[ ÉCOUTER LE CATALOGUE ]" delay={1200} />
            </Link>
          </motion.div>
          {latest && (
            <motion.div className="flex justify-center sm:justify-end" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8, ease: EASE }}>
              <NowCard beat={latest} queue={queue} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function NowCard({ beat, queue }: { beat: Beat; queue: Beat[] }) {
  const { track, isPlaying, toggle } = useAudio();
  const playing = track?.id === beat.id && isPlaying;
  return (
    <button
      type="button"
      onClick={() => toggle(beat, queue)}
      className="flex w-full max-w-[300px] items-center gap-3 rounded-full border border-white/15 bg-ink/60 py-1.5 pl-1.5 pr-5 text-left backdrop-blur-md transition-colors hover:bg-ink/80"
      aria-label={playing ? `Mettre en pause ${beat.title}` : `Écouter ${beat.title}`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-fg text-ink">
        {playing ? <Pause className="h-4 w-4" fill="currentColor" strokeWidth={0} /> : <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" strokeWidth={0} />}
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">{playing ? "En écoute" : "Dernière prod"}</span>
        <span className="block truncate text-[14px] font-medium">{beat.title}</span>
      </span>
    </button>
  );
}

/** Une prod présentée en grand : la pochette à gauche, sa fiche à droite (façon fiche projet). */
function Showcase({ beat, index, total, queue }: { beat: Beat; index: number; total: number; queue: Beat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const scale = useTransform(scrollYProgress, [0, 0.35], [0.92, 1]);
  const { track, isPlaying, toggle } = useAudio();
  const { add, has, open } = useCart();
  const playing = track?.id === beat.id && isPlaying;
  const price = cheapest(beat);
  const priceLabel = price ? formatPrice(price.priceCents, price.currency) : null;
  const inCart = has(beat.id);
  const rows: [string, string][] = [
    ["Prod", beat.title],
    ["Tempo", beat.bpm ? `${beat.bpm} BPM` : "—"],
    ["Tonalité", beat.key ?? "—"],
    ["Genre", beat.genres.slice(0, 2).join(", ") || "—"],
    ["Fichiers", beat.formats.filter((f) => f !== "stems").map((f) => FORMAT_LABEL[f] ?? f).join(" + ") || "—"],
  ];

  return (
    <div ref={ref} className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
      <Link href={`/web/prod/${beat.id}`} className="block" aria-label={`Fiche de ${beat.title}`}>
        <motion.div style={reduce ? undefined : { y, scale }}>
          <ArtCover beat={beat} index={index} playing={playing} />
        </motion.div>
      </Link>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-faint">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <dl className="mt-6 space-y-2.5 font-mono text-[12px] uppercase tracking-[0.12em]">
          {rows.map(([k, v], i) => (
            <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3">
              <dt className="text-fg-faint">{k} :</dt>
              <dd className="text-fg">
                <Scramble text={v.toUpperCase()} delay={i * 90} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-9 flex flex-wrap gap-2">
          <button type="button" onClick={() => toggle(beat, queue)} disabled={!beat.previewUrl} className={cn(pill, "bg-fg text-ink hover:bg-white/85 disabled:opacity-40")}>
            {playing ? <Pause className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} /> : <Play className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />}
            {playing ? "[ Pause ]" : "[ Écouter ]"}
          </button>
          {price && priceLabel && (
            <button
              type="button"
              onClick={() => (inCart ? open() : void add(beat, price))}
              className={cn(pill, inCart ? "bg-accent-soft text-accent" : "bg-accent text-white hover:bg-accent/85")}
            >
              {inCart ? "[ Dans le panier ]" : `[ Ajouter · ${priceLabel} ]`}
            </button>
          )}
          <Link href={`/web/prod/${beat.id}`} className={cn(pill, "border border-line-strong text-fg-muted hover:text-fg")}>
            [ Fiche ]
          </Link>
        </div>
      </div>
    </div>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">{k}</dt>
      <dd className="mt-1.5 text-[17px] font-medium tracking-[-0.01em] tabular-nums">{v}</dd>
    </div>
  );
}

function Offer({ tag, price, text, points, cta, primary }: { tag: string; price: string | null; text: string; points: string[]; cta: { href: string; label: string }; primary?: boolean }) {
  return (
    <FadeUp className={cn("flex flex-col rounded-[24px] border p-7", primary ? "border-line-strong bg-ink-800" : "border-line bg-ink-850")}>
      <Tag className="eyebrow" scramble={false}>
        {tag}
      </Tag>
      <p className="mt-8 text-[52px] font-medium leading-none tracking-[-0.045em] tabular-nums">{price ?? "—"}</p>
      <p className="mt-3 text-[15px] text-fg-muted">{text}</p>
      <ul className="mt-8 space-y-2.5 border-t border-line pt-6">
        {points.map((p) => (
          <li key={p} className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.1em] text-fg-muted">
            — {p}
          </li>
        ))}
      </ul>
      <Link href={cta.href} className={cn(pill, "mt-8", primary ? "bg-fg text-ink hover:bg-white/85" : "border border-line-strong text-fg hover:bg-white/[0.06]")}>
        [ {cta.label} ]
      </Link>
    </FadeUp>
  );
}

/** Les titres des prods qui défilent en très grand, juste avant le pied de page. */
function TitleMarquee({ beats }: { beats: Beat[] }) {
  const list = [...beats, ...beats];
  return (
    <section aria-hidden="true" className="mt-28 overflow-hidden border-y border-line py-8 sm:mt-40">
      <div className="flex w-max animate-marquee gap-10 motion-reduce:animate-none">
        {list.map((b, i) => (
          <span key={`${b.id}-${i}`} className={cn("whitespace-nowrap text-[clamp(48px,7vw,104px)] font-medium uppercase leading-none tracking-[-0.045em]", i % 2 ? "text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)]" : "text-fg")}>
            {b.title} <span className="text-accent">·</span>
          </span>
        ))}
      </div>
    </section>
  );
}
