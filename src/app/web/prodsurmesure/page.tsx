"use client";
"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

/* =========================== Types & Data =========================== */

type Step = {
  id: number;
  stepName: string;
  progress: "0%" | "50%" | "100%";
  title: string;
  content: string;
};

const stepsData: Step[] = [
  {
    id: 1,
    stepName: "Étape 1",
    progress: "0%",
    title: "Définis ton beat idéal",
    content:
      "Partage l'ambiance, les inspirations et les éléments clés. Tu donnes la vision, on fait le reste.",
  },
  {
    id: 2,
    stepName: "Étape 2",
    progress: "50%",
    title: "Développement & retours",
    content:
      "Première version sous 24 h. Révisions illimitées jusqu'à obtenir exactement ce que tu veux.",
  },
  {
    id: 3,
    stepName: "Étape 3",
    progress: "100%",
    title: "Livraison finale",
    content:
      "Export WAV propre (stems sur demande). Licence claire. Ta prod est prête à l'emploi.",
  },
];

const fillMap: Record<number, number> = { 1: 33, 2: 66, 3: 100 };

type Sample = { id: string; title: string; tag: string; src: string };

const PROD_SUR_MESURE_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_PROD_SUR_MESURE;

/* =========================== Page =========================== */

function ProdSurMesure() {
  const stepsRef = useRef<HTMLElement | null>(null);
  const samplesRef = useRef<HTMLElement | null>(null);
  const [openBrief, setOpenBrief] = useState(false);
  useEffect(() => {
    if (openBrief) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [openBrief]);

  // visibilité pour la timeline (remplissage)
  const [visible, setVisible] = useState<number[]>([]);
  const onVisible = useCallback((id: number, v: boolean) => {
    setVisible((prev) => (v ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)));
  }, []);
  const fill = visible.length ? Math.max(...visible.map((id) => fillMap[id] || 0)) : 0;

  const scrollToSteps = () =>
    stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const scrollToSamples = () =>
    samplesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#07070B] text-white">
      {/* Ambient background sombre inspiré des cartes cadeau */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ duration: 1.2 }}
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-700/25 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 16, -8, 0], y: [0, -8, 8, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute right-[-10rem] top-10 h-[26rem] w-[26rem] rounded-full bg-violet-800/25 blur-[110px]"
        />
        <motion.div
          animate={{ x: [0, -8, 12, 0], y: [0, 10, -6, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-12rem] left-20 h-[24rem] w-[24rem] rounded-full bg-violet-950/25 blur-[110px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.03),transparent_60%)]" />
      </div>
      {/* 1) HERO 100svh */}
      <HeroFull onCreate={scrollToSteps} onSeeSamples={scrollToSamples} />

      {/* 2) EXEMPLES */}
    

      {/* 3) ÉTAPES */}
      <StepsSection
        ref={stepsRef}
        visible={visible}
        onVisible={onVisible}
        fill={fill}
        onOpenBrief={() => setOpenBrief(true)}
      />

      {/* 4) MODAL FORMULAIRE (layer) */}
      <BriefModal open={openBrief} onClose={() => setOpenBrief(false)} />
    </div>
  );
}

export default function ProdSurMesurePage() {
  return (
    <ProdSurMesure />
  );
}

/* =========================== 1) HERO plein écran =========================== */

function HeroFull({
  onCreate,
  onSeeSamples,
}: {
  onCreate: () => void;
  onSeeSamples: () => void;
}) {
  const phrases = [
    "Des prods sur‑mesure, première version livrée en 24 h",
    "Lance ta carrière avec des prods taillées rien que pour toi",
    "Tu formules, on produit : ta prod idéale prête en 48 h",
  ];
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);

  const toTitleCase = useCallback((s: string) => {
    return s
      .split(" ")
      .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
      .join(" ");
  }, []);

  const displayPhrases = useMemo(() => phrases.map((p) => toTitleCase(p)), [phrases, toTitleCase]);
  const full = displayPhrases[idx];
  const longest = useMemo(
    () => displayPhrases.reduce((a, b) => (a.length > b.length ? a : b), ""),
    [displayPhrases]
  );

  useEffect(() => {
    const doneTyping = typed === full;
    const doneDeleting = typed === "";

    const typingSpeed = 22; // un peu ralenti
    const deletingSpeed = 16; // effacement rapide mais lisible
    const visiblePauseMs = 5000; // 5 secondes d'affichage

    let t: ReturnType<typeof setTimeout> | null = null;

    if (!deleting && !doneTyping) {
      t = setTimeout(() => setTyped(full.slice(0, typed.length + 1)), typingSpeed);
    } else if (!deleting && doneTyping) {
      t = setTimeout(() => setDeleting(true), visiblePauseMs);
    } else if (deleting && !doneDeleting) {
      t = setTimeout(() => setTyped(full.slice(0, Math.max(0, typed.length - 1))), deletingSpeed);
    } else if (deleting && doneDeleting) {
      setDeleting(false);
      setIdx((i) => (i + 1) % displayPhrases.length);
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [typed, deleting, full, displayPhrases.length]);

  const showCursor = deleting || typed !== full; // visible pendant frappe/effacement uniquement

  return (
    <section className="relative flex min-h-[100svh] items-center">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: "0.5rem" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-balance text-5xl md:text-6xl font-semibold tracking-tight leading-[1.38] md:leading-[1.32] min-h-[3.8rem] md:min-h-[4.8rem]"
        >
          <span className="relative inline-block align-top">
            <span className="invisible select-none">{longest}</span>
            <span className="absolute inset-0">
              {typed}
              {showCursor && (
                <motion.span
                  aria-hidden
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="ml-1 inline-block h-[1em] w-[2px] translate-y-[2px] bg-white align-middle"
                />
              )}
            </span>
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 1 }}
          className="mt-4 text-xl text-zinc-300"
        >
          Ta vision • Notre expertise • Ta prod prête en 48 h • Révisions illimitées
        </motion.p>

        <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            "Qualité studio",
            "Licence exclusive délivrée",
            "Pistes par pistes",
          ].map((t) => (
            <li
              key={t}
              className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-200"
            >
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onCreate}
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black shadow-sm hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Créer ma prod
          </motion.button>  

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onSeeSamples}
            className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Écouter des exemples
          </motion.button>
        </div>

        <p className="mt-4 text-sm text-zinc-400">
          Paiement sécurisé · Licence commerciale claire · Support rapide
        </p>

        {/* Indicateur de scroll (positionné en bas du hero) */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.button
            aria-label="Descendre"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-auto rounded-full border border-white/30 bg-transparent p-2 text-white cursor-pointer will-change-transform"
            onClick={onCreate}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}

/* =========================== 2) EXEMPLES =========================== */

const SamplesSection = React.forwardRef<HTMLElement, { items: Sample[] }>(
  ({ items }, ref) => (
    <section ref={ref} className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Exemples récents</h2>
        <p className="mt-2 text-zinc-300">Produit pour nos clients — rendu réel.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((s) => (
          <motion.article
            key={s.id}
            initial={{ opacity: 0, y: "0.5rem" }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">{s.title}</h3>
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-zinc-300">
                {s.tag}
              </span>
            </div>

            <div className="mt-3">
              <audio controls preload="none" className="w-full">
                <source src={s.src} />
              </audio>
            </div>

            <div className="mt-3">
              <button className="w-full rounded-lg border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/5">
                Je veux ce style
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
);
SamplesSection.displayName = "SamplesSection";

/* =========================== 3) ÉTAPES =========================== */

const StepsSection = React.forwardRef<HTMLElement, {
  visible: number[];
  onVisible: (id: number, v: boolean) => void;
  fill: number;
  onOpenBrief: () => void;
}>(({ visible, onVisible, fill, onOpenBrief }, ref) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const lastStepRef = React.useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = React.useState(0);
  const [lastStepBottomRel, setLastStepBottomRel] = React.useState(0);

  const recalcTrack = React.useCallback(() => {
    if (!contentRef.current || !lastStepRef.current) return;
    const c = contentRef.current.getBoundingClientRect();
    const l = lastStepRef.current.getBoundingClientRect();
    setContentHeight(c.height);
    setLastStepBottomRel(Math.max(0, l.bottom - c.top));
  }, []);

  React.useEffect(() => {
    recalcTrack();
    // raf double pour garantir les mesures après animations/layout
    requestAnimationFrame(() => recalcTrack());
    const onResize = () => recalcTrack();
    window.addEventListener("resize", onResize);
    let ro: ResizeObserver | null = null;
    if (contentRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(recalcTrack);
      ro.observe(contentRef.current);
    }
    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
    };
  }, [recalcTrack]);
  const railTopPx = 40; // correspond à top-10
  const trackHeight = Math.max(0, Math.min(contentHeight, lastStepBottomRel) - railTopPx);
  return (
    <section ref={ref} id="steps" className="mx-auto max-w-3xl px-6 py-20 overflow-anchor-none">
      <header className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Le processus en 3 étapes</h2>
        <p className="mt-3 text-zinc-300">Simple, rapide et clair.</p>
      </header>

      <div className="grid grid-cols-[1px_80px_1fr] gap-0 items-stretch">
        {/* rail (1px) + offset 20px avant le contenu */}
        <div className="relative pointer-events-none" style={{ height: contentHeight }}>
          <div
            className="absolute left-0 w-px origin-left scale-x-[0.6] transform rounded bg-white/40"
            style={{ top: railTopPx, height: trackHeight }}
          />
          <motion.div
            className="absolute left-0 w-px origin-left scale-x-[0.6] transform rounded bg-white"
            initial={{ height: 0 }}
            animate={{ height: trackHeight * ((visible.length ? Math.max(...visible.map((id) => fillMap[id] || 0)) : 0) / 100) }}
            transition={{ duration: 1 }}
            style={{ top: railTopPx }}
          />
        </div>
        <div />

        <div ref={contentRef} className="space-y-16 md:space-y-20">
          {stepsData.map((s, i) => (
            <div key={s.id} ref={i === stepsData.length - 1 ? lastStepRef : undefined}>
              <StepRow step={s} onVisible={onVisible} />
            </div>
          ))}

          {/* CTA Ouvrir le formulaire (layer) */}
          {/* CTA — Remplir le formulaire (card sticky & visible) */}
          <div className="relative">
            <div className="sticky bottom-6">
              <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur px-5 py-4 shadow-[0_1rem_2rem_rgba(0,0,0,0.35)] text-center">
                <h3 className="text-lg font-semibold">Prêt à démarrer ?</h3>
                <p className="mt-1 text-sm text-zinc-300">2 minutes pour ton formulaire. V1 sous 24 h.</p>

                <div className="mt-4">
                  <button
                    onClick={onOpenBrief}
                    className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-black
                              transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      background:
                        "linear-gradient(180deg, #fff 0%, #eaeaea 100%)",
                    }}
                  >
                    Remplir le formulaire (2 min)
                  </button>
                </div>

                <p className="mt-2 text-xs text-zinc-500">
                  Deadline finale <span className="font-medium">fixe</span> (visible dans ton compte).
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
});
StepsSection.displayName = "StepsSection";

function StepRow({
  step,
  onVisible,
}: {
  step: Step;
  onVisible: (id: number, v: boolean) => void;
}) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const [inView, setInView] = useState(false);
  const [dotTop, setDotTop] = useState<number>(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        onVisible(step.id, e.isIntersecting);
      },
      { threshold: 0.25 }
    );
    if (rowRef.current) io.observe(rowRef.current);
    return () => io.disconnect();
  }, [onVisible, step.id]);

  useEffect(() => {
    const update = () => {
      if (!rowRef.current || !titleRef.current) return;
    const rowTop = rowRef.current.getBoundingClientRect().top;
    const titleTop = titleRef.current.getBoundingClientRect().top;
    setDotTop(titleTop - rowTop + titleRef.current.clientHeight * 0.5);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div ref={rowRef} className="relative scroll-mt-24">
      {/* dot aligné au titre */}
    

      <div className="text-sm uppercase tracking-wide text-zinc-400">{step.stepName}</div>

      <StepCard step={step} titleRef={titleRef} inView={inView} />
    </div>
  );
}

function StepCard({
  step,
  titleRef,
  inView,
}: {
  step: Step;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
  inView?: boolean;
}) {
  const percent = parseInt(step.progress, 10);
  // légère parallaxe selon le scroll de la page
  const { scrollYProgress } = useScroll();
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -8]);

  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, y: "0.5rem" }}
      animate={{ opacity: inView ? 1 : 0.6 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      style={{ y: translateY }}
      className="mt-3 rounded-2xl border border-white/10 bg-white/[0.035] shadow-[0_0.5rem_2rem_rgba(0,0,0,0.25)]"
    >
      <div className="p-6 md:p-8">
        <h3 ref={titleRef} className="text-2xl md:text-3xl font-semibold tracking-tight">
          {step.title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-zinc-300">{step.content}</p>

        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="h-[0.375rem] w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-white/70"
                initial={{ width: "0%" }}
                animate={{ width: inView ? `${percent}%` : "0%" }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-sm font-medium text-zinc-200">{step.progress}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================== 4) MODAL FORMULAIRE =========================== */
/* Optimisé : menus, bulles multi-sélection, slider BPM. Identité + deadline gérées côté compte. */

function BriefModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState<null | "success" | "error">(null);

  // Choix uniques
  const genres = [
    "Trap",
    "Drill",
    "RnB",
    "New Wave",
    "Lo-fi",
    "New Jazz",
    "Afro",
    "Boom Bap",
    "Dancehall",
    "Pop Urbain",
    // Rap-related sous-genres
    "Trap Soul",
    "Cloud Rap",
    "Detroit",
    "East Coast",
    "West Coast",
    "Jersey Club",
    "Afro Trap",
    "Autre",
  ];
  const styles = ["Mélancolique", "Sombre", "Énergique", "Atmosphérique", "Émotion", "Dansant"];
  // Instruments uniquement (pas de 808/pads)
  const instrumentCategories: Record<string, string[]> = {
    "Claviers": ["Piano", "Synthés"],
    "Cordes": ["Guitare", "Cordes"],
    "Vents": ["Cuivres", "Flûte"],
    "Voix": ["Chœurs"],
  };

  const [genre, setGenre] = useState(genres[0]);
  const [style, setStyle] = useState(styles[0]);
  const [styleOther, setStyleOther] = useState("");
  const [genreOther, setGenreOther] = useState("");
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [customInstrumentByFamily, setCustomInstrumentByFamily] = useState<Record<string, string>>({});
  const [bpm, setBpm] = useState(140);
  const [key, setKey] = useState("");
  const [openKeyModal, setOpenKeyModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string>("");
  const [selectedQuality, setSelectedQuality] = useState<"m" | "maj" | "">("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setOk(null);

    if (!PROD_SUR_MESURE_PRICE_ID) {
      setOk("error");
      alert("Le tarif Stripe pour les prods sur mesure n'est pas configure.");
      setSending(false);
      return;
    }

    const fd = new FormData(e.currentTarget);
    const baseStyle = styleOther.trim() ? styleOther.trim() : style;
    const details = (fd.get("details") as FormDataEntryValue | null)?.toString() ?? "";
    const notes = (fd.get("notes") as FormDataEntryValue | null)?.toString() ?? "";
    const fileInput = e.currentTarget.querySelector<HTMLInputElement>('input[name="file"]');
    const fileName = fileInput?.files?.[0]?.name ?? "";
    const instrumentsLabel = selectedInstruments.join(", ");

    const truncate = (value: string, max = 450) =>
      value.length > max ? `${value.slice(0, max - 3)}...` : value;

    const metadata: Record<string, string> = {
      genre: truncate(genre),
      style: truncate(baseStyle),
      bpm: String(bpm),
      key: key || "non_precise",
      instruments: truncate(instrumentsLabel || "non_precise"),
      brief: truncate(details),
    };

    if (notes.trim()) metadata.notes = truncate(notes.trim());
    if (fileName) metadata.file = truncate(fileName, 120);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: PROD_SUR_MESURE_PRICE_ID,
          mode: "payment",
          metadata,
          successUrl: "/web/prodsurmesure?success=true&session_id={CHECKOUT_SESSION_ID}",
          cancelUrl: "/web/prodsurmesure?canceled=true",
        }),
      });

      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Impossible de demarrer le paiement Stripe.");
      }

      window.location.href = payload.url;
    } catch (err) {
      console.error(err);
      setOk("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal
          role="dialog"
        >
          {/* Contenant compact + scrollable */}
          <motion.div
            initial={{ opacity: 0, y: "1rem" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "1rem" }}
            transition={{ duration: 0.25 }}
            className="w-full sm:max-w-xl rounded-2xl border border-white/10 bg-[#111116] text-white shadow-xl"
          >
            {/* Header figé */}
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-white/10 bg-[#111116] px-5 py-4">
              <h3 className="text-base font-semibold tracking-tight">Formulaire de production</h3>
              <button
                onClick={onClose}
                className="rounded-lg border border-white/10 px-3 py-1 text-sm text-zinc-300 hover:bg-white/5"
              >
                Fermer
              </button>
            </div>

            {/* Corps scrollable */}
            <form onSubmit={onSubmit} className="max-h-[85svh] overflow-y-auto px-5 py-4 space-y-5">
              {/* Genre — chips radio-like (un seul) */}
              <div>
                <label className="text-sm text-zinc-300">Genre principal</label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {genres.map((g) => {
                    const active = genre === g;
                    return (
                      <button
                        type="button"
                        key={g}
                        onClick={() => {
                          if (g === "Autre") {
                            const val = prompt("Entrez votre genre");
                            if (val && val.trim()) setGenre(val.trim());
                            return;
                          }
                          setGenre(g);
                        }}
                        aria-pressed={active}
                        className={`rounded-full px-3 py-1.5 text-sm border transition text-left
                          ${active ? "bg-white text-black border-white" : "border-white/15 bg-white/[0.04] text-zinc-200 hover:bg-white/10"}
                        `}
                      >
                        {g}
                      </button>
                    );
                  })}
                  {/* Autre géré comme une chip via l'entrée "Autre" de la liste */}
                </div>
                <input type="hidden" name="genre" value={genre} />
              </div>

              {/* Style (chips single) + Autre */}
              <div>
                <label className="text-sm text-zinc-300">Style</label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {styles.map((s) => {
                    const active = style === s && !styleOther.trim();
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => { setStyle(s); setStyleOther(""); }}
                        aria-pressed={active}
                        className={`rounded-full px-3 py-1.5 text-sm border transition text-left
                          ${active ? "bg-white text-black border-white" : "border-white/15 bg-white/[0.04] text-zinc-200 hover:bg-white/10"}
                        `}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3">
                  <input
                    value={styleOther}
                    onChange={(e) => setStyleOther(e.target.value)}
                    placeholder="Autre style (optionnel)"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 placeholder:text-zinc-500"
                  />
                </div>
                <input type="hidden" name="style" value={styleOther.trim() ? styleOther.trim() : style} />
              </div>

              {/* Instruments — multi-select, organisés par familles */}
              <div>
                <div className="flex items-baseline justify-between">
                  <label className="text-sm text-zinc-300">Instruments souhaités</label>
                  {selectedInstruments.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedInstruments([])}
                      className="text-xs text-zinc-400 hover:text-zinc-200"
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {Object.entries(instrumentCategories).map(([family, list]) => (
                    <div
                      key={family}
                      className="rounded-xl border border-white/10 bg-white/[0.035] p-4"
                    >
                      <div className="text-xs font-medium tracking-wide text-zinc-300">
                        {family}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {list.map((ins) => {
                          const active = selectedInstruments.includes(ins);
                          return (
                            <button
                              type="button"
                              key={ins}
                              onClick={() =>
                                setSelectedInstruments((prev) =>
                                  prev.includes(ins) ? prev.filter((i) => i !== ins) : [...prev, ins]
                                )
                              }
                              aria-pressed={active}
                              className={`rounded-full px-3 py-1.5 text-sm border transition shadow-sm
                                ${active
                                  ? "bg-white text-black border-white"
                                  : "border-white/15 bg-white/[0.05] text-zinc-200 hover:bg-white/10"}
                              `}
                            >
                              {ins}
                            </button>
                          );
                        })}
                      </div>
                      {/* Autre instrument pour cette famille */}
                      <div className="mt-3">
                        <input
                          value={customInstrumentByFamily[family] || ""}
                          onChange={(e) =>
                            setCustomInstrumentByFamily((prev) => ({ ...prev, [family]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const val = (customInstrumentByFamily[family] || "").trim();
                              if (!val) return;
                              setSelectedInstruments((prev) => (prev.includes(val) ? prev : [...prev, val]));
                              // laisser le texte saisi visible
                            }
                          }}
                          placeholder={`Autre (${family.toLowerCase()})`}
                          className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 placeholder:text-zinc-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {/* hidden inputs to submit array */}
                {selectedInstruments.map((ins) => (
                  <input key={ins} type="hidden" name="instruments[]" value={ins} />
                ))}
              </div>

              {/* Détails */}
              <div>
                <label className="text-sm text-zinc-300">Détails & éléments clés</label>
                <textarea
                  name="details"
                  required
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 placeholder:text-zinc-500"
                  placeholder="Ex : mélancolique, synthés analogiques, 808 profonde, clap sec, arpèges rétro…"
                />
              </div>

              {/* BPM + Tonalité */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="text-sm text-zinc-300">BPM</label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="range"
                      min={60}
                      max={200}
                      step={1}
                      value={bpm}
                      onChange={(e) => setBpm(parseInt(e.target.value, 10))}
                      className="w-full"
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      min={60}
                      max={200}
                      value={bpm}
                      onChange={(e) => {
                        const v = parseInt(e.target.value || "0", 10);
                        setBpm(Number.isFinite(v) ? Math.max(60, Math.min(200, v)) : 60);
                      }}
                      className="w-20 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-zinc-300">Tonalité (optionnel)</label>
                  <button
                    type="button"
                    onClick={() => {
                      // initialiser l'état du modal depuis la valeur actuelle
                      if (key) {
                        const base = key.replace(/m$/, "");
                        const qual = key.endsWith("m") ? "m" : "maj";
                        setSelectedNote(base);
                        setSelectedQuality(qual);
                      } else {
                        setSelectedNote("");
                        setSelectedQuality("");
                      }
                      setOpenKeyModal(true);
                    }}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-zinc-200 hover:bg-white/10"
                  >
                    {key ? `Tonalité: ${key}` : "Choisir une tonalité"}
                  </button>
                </div>
              </div>

              {/* Fichier / Notes */}
              <div>
                <label className="text-sm text-zinc-300">Fichier (sample / voix guide — optionnel)</label>
                <input
                  name="file"
                  type="file"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-2 file:text-black"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-300">Notes complémentaires (optionnel)</label>
                <textarea
                  name="notes"
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 placeholder:text-zinc-500"
                  placeholder="Références YouTube/Spotify, contraintes, idées stylistiques…"
                />
              </div>

              {/* Footer actions */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-100 disabled:opacity-70"
                >
                  {sending ? "Redirection..." : "Proceder au paiement"}
                </button>
                <p className="mt-2 text-center text-xs text-zinc-500">
                  Licence exclusive délivrée · Deadline finale <span className="font-medium">fixe</span> (gérée par nos conditions et visible dans ton compte).
                </p>

                <AnimatePresence>
                  {ok === "success" && (
                    <motion.p
                      initial={{ opacity: 0, y: "0.25rem" }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: "0.25rem" }}
                      className="mt-3 text-center text-sm text-emerald-400"
                    >
                      Merci ! Ton formulaire a bien été envoyé.
                    </motion.p>
                  )}
                  {ok === "error" && (
                    <motion.p
                      initial={{ opacity: 0, y: "0.25rem" }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: "0.25rem" }}
                      className="mt-3 text-center text-sm text-rose-400"
                    >
                      Oups, une erreur est survenue. Réessaie dans un instant.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    
    <AnimatePresence>
      {openKeyModal && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, y: "1rem" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "1rem" }}
            transition={{ duration: 0.2 }}
            className="w-full sm:max-w-md rounded-2xl border border-white/10 bg-[#111116] p-5 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold">Choisir une tonalité</h4>
              <button
                onClick={() => setOpenKeyModal(false)}
                className="rounded-lg border border-white/10 px-2 py-1 text-xs text-zinc-300 hover:bg-white/5"
              >
                Fermer
              </button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"].map((note) => (
                <button
                  key={note}
                  type="button"
                  onClick={() => setSelectedNote(note)}
                  className={`rounded-lg border px-3 py-2 text-sm ${selectedNote===note?"bg-white text-black border-white":"border-white/15 bg-white/[0.04] text-zinc-200 hover:bg-white/10"}`}
                >
                  {note}
                </button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {["maj","m"].map((qual) => (
                <button
                  key={qual}
                  type="button"
                  onClick={() => setSelectedQuality(qual as ("m"|"maj"))}
                  className={`rounded-lg border px-3 py-2 text-sm ${selectedQuality===qual?"bg-white text-black border-white":"border-white/15 bg-white/[0.04] text-zinc-200 hover:bg-white/10"}`}
                >
                  {qual === "m" ? "Mineur" : "Majeur"}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setKey(""); setSelectedNote(""); setSelectedQuality(""); setOpenKeyModal(false); }}
                className="rounded-lg border border-white/15 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
              >
                Effacer
              </button>
              <button
                type="button"
                onClick={() => { const computed = selectedNote ? `${selectedNote}${selectedQuality==='m'?'m':''}` : ""; setKey(computed); setOpenKeyModal(false); }}
                className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black"
              >
                Valider
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
