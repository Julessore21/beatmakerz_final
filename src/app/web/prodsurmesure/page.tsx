"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      "Partage l’ambiance, les inspirations et les éléments clés. Tu donnes la vision, on fait le reste.",
  },
  {
    id: 2,
    stepName: "Étape 2",
    progress: "50%",
    title: "Développement & retours",
    content:
      "Première version sous 24 h. Révisions illimitées jusqu’à obtenir exactement ce que tu veux.",
  },
  {
    id: 3,
    stepName: "Étape 3",
    progress: "100%",
    title: "Livraison finale",
    content:
      "Export WAV propre (stems sur demande). Licence claire. Ta prod est prête à l’emploi.",
  },
];

const fillMap: Record<number, number> = { 1: 33, 2: 66, 3: 100 };

type Sample = { id: string; title: string; tag: string; src: string };

/* =========================== Page =========================== */

export default function ProdSurMesure() {
  const stepsRef = useRef<HTMLElement | null>(null);
  const samplesRef = useRef<HTMLElement | null>(null);
  const [openBrief, setOpenBrief] = useState(false);

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
    <div className="min-h-[100svh] bg-[#0d0d12] text-white">
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

/* =========================== 1) HERO plein écran =========================== */

function HeroFull({
  onCreate,
  onSeeSamples,
}: {
  onCreate: () => void;
  onSeeSamples: () => void;
}) {
  return (
    <section className="relative flex min-h-[100svh] items-center">
      {/* le voile ne bloque plus les clics */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: "0.5rem" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-balance text-5xl md:text-6xl font-semibold tracking-tight"
        >
          Une prod sur-mesure, première version en 24 h.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-4 text-xl text-zinc-300"
        >
          Tu poses la vision, on livre le son. Révisions illimitées.
        </motion.p>

        <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          {["Qualité studio", "V1 sous 24 h", "Révisions illimitées"].map((t) => (
            <li
              key={t}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-200"
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
            transition={{ duration: 0.4 }}
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
  return (
    <section ref={ref} id="steps" className="mx-auto max-w-4xl px-6 py-20">
      <header className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Le processus en 3 étapes</h2>
        <p className="mt-3 text-zinc-300">Simple, rapide et clair.</p>
      </header>

      <div className="grid grid-cols-[0.15fr_1fr] gap-6">
        {/* rail */}
        <div className="relative pointer-events-none">
          <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-0 w-[0.125rem] rounded bg-white/10" />
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-10 w-[0.125rem] rounded bg-white/60"
            initial={{ height: 0 }}
            animate={{ height: `${visible.length ? Math.max(...visible.map((id) => fillMap[id] || 0)) : 0}%` }}
            transition={{ duration: 0.45 }}
          />
        </div>

        <div className="space-y-16 md:space-y-20">
          {stepsData.map((s) => (
            <StepRow key={s.id} step={s} onVisible={onVisible} />
          ))}

          {/* CTA Ouvrir le formulaire (layer) */}
          {/* CTA — Remplir le brief (card sticky & visible) */}
          <div className="relative">
            <div className="sticky bottom-6">
              <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur px-5 py-4 shadow-[0_1rem_2rem_rgba(0,0,0,0.35)] text-center">
                <h3 className="text-lg font-semibold">Prêt à démarrer ?</h3>
                <p className="mt-1 text-sm text-zinc-300">2 minutes pour ton brief. V1 sous 24 h.</p>

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
                    Remplir le brief (2 min)
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

      <AnimatePresence mode="popLayout">
        {inView && <StepCard step={step} titleRef={titleRef} />}
      </AnimatePresence>
    </div>
  );
}

function StepCard({
  step,
  titleRef,
}: {
  step: Step;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const percent = parseInt(step.progress, 10);

  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, y: "0.5rem" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "0.5rem" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-3 rounded-2xl border border-white/10 bg-white/[0.035] shadow-[0_0.5rem_2rem_rgba(0,0,0,0.25)]"
    >
      <div className="p-6 md:p-8">
        <h3 ref={titleRef} className="text-2xl md:text-3xl font-semibold tracking-tight">
          {step.title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-zinc-300">{step.content}</p>

        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="h-[0.375rem] w-full rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-white/70"
                initial={{ width: "0%" }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.6 }}
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
  const genres = ["Trap", "Drill", "Afro", "Lofi", "RnB", "Boom Bap", "Dancehall", "Pop Urbain"];
  const moods = ["Sombre", "Énergique", "Atmosphérique", "Émotion", "Dansant"];
  const usages = ["Streaming & réseaux", "Commercial (monétisé)", "Pub / Brand content", "Autre"];
  const instruments = ["Libre", "Piano", "Guitare", "Synthés", "Cordes", "Cuivres", "Chœurs", "Pads", "808 / Bass"];

  const [genre, setGenre] = useState(genres[0]);          // ← un seul possible
  const [mood, setMood] = useState(moods[0]);             // ← menu single
  const [usage, setUsage] = useState(usages[0]);          // ← menu single
  const [instrument, setInstrument] = useState(instruments[0]); // ← menu single
  const [bpm, setBpm] = useState(140);
  const [key, setKey] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setOk(null);

    const fd = new FormData(e.currentTarget);
    fd.set("genre", genre);
    fd.set("mood", mood);
    fd.set("usage", usage);
    fd.set("instrument", instrument);
    fd.set("bpm", String(bpm));
    fd.set("key", key);

    try {
      // await fetch("/api/brief", { method: "POST", body: fd });
      console.log("Brief PROD:", Object.fromEntries(fd.entries()));
      setOk("success");
      (e.target as HTMLFormElement).reset();
      // on conserve les selections par défaut
    } catch (err) {
      console.error(err);
      setOk("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
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
              <h3 className="text-base font-semibold tracking-tight">Brief de production</h3>
              <button
                onClick={onClose}
                className="rounded-lg border border-white/10 px-3 py-1 text-sm text-zinc-300 hover:bg-white/5"
              >
                Fermer
              </button>
            </div>

            {/* Corps scrollable */}
            <form onSubmit={onSubmit} className="max-h-[85svh] overflow-y-auto px-5 py-4 space-y-5">
              {/* Style — chips radio-like (un seul) */}
              <div>
                <label className="text-sm text-zinc-300">Style principal</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {genres.map((g) => {
                    const active = genre === g;
                    return (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setGenre(g)}
                        aria-pressed={active}
                        className={`rounded-full px-3 py-1 text-sm border transition
                          ${active ? "bg-white text-black border-white" : "border-white/15 bg-white/[0.04] text-zinc-200 hover:bg-white/10"}
                        `}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
                <input type="hidden" name="genre" value={genre} />
              </div>

              {/* Ambiance & Utilisation — menus single */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-zinc-300">Ambiance</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2"
                  >
                    {moods.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-zinc-300">Utilisation</label>
                  <select
                    value={usage}
                    onChange={(e) => setUsage(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2"
                  >
                    {usages.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {/* Instrument — menu single */}
              <div>
                <label className="text-sm text-zinc-300">Instrument principal</label>
                <select
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2"
                >
                  {instruments.map((ins) => <option key={ins}>{ins}</option>)}
                </select>
              </div>

              {/* Détails */}
              <div>
                <label className="text-sm text-zinc-300">Ambiance & éléments clés</label>
                <textarea
                  name="details"
                  required
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 placeholder:text-zinc-500"
                  placeholder="Ex : sombre, synthés analogiques, 808 profonde, clap sec, arpèges rétro…"
                />
              </div>

              {/* BPM + Tonalité */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="text-sm text-zinc-300">BPM approximatif</label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="range"
                      min={60}
                      max={180}
                      step={1}
                      value={bpm}
                      onChange={(e) => setBpm(parseInt(e.target.value, 10))}
                      className="w-full"
                    />
                    <span className="w-12 text-right text-sm text-zinc-200">{bpm}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-zinc-300">Tonalité (optionnel)</label>
                  <input
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 placeholder:text-zinc-500"
                    placeholder="Ex : Am"
                  />
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
                  {sending ? "Envoi en cours…" : "Envoyer mon brief"}
                </button>
                <p className="mt-2 text-center text-xs text-zinc-500">
                  V1 sous 24 h · Deadline finale <span className="font-medium">fixe</span> (gérée par nos conditions et visible dans ton compte).
                </p>

                <AnimatePresence>
                  {ok === "success" && (
                    <motion.p
                      initial={{ opacity: 0, y: "0.25rem" }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: "0.25rem" }}
                      className="mt-3 text-center text-sm text-emerald-400"
                    >
                      Merci ! Ton brief a bien été envoyé.
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
  );
}
