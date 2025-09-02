"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3, Rows3, Search, ShoppingCart, Store, Users, Flame, Star, Instagram, Youtube, Mail } from "lucide-react";

import { useAudio } from "@/context/AudioPlayerContext";
import BeatCard from "@/components/BeatCard";
import { Input } from "@/components/ui/input";

type ViewMode = "grid" | "table";
type Mode = "consulter" | "vendre";

type BeatCore = {
  id: number;
  name: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  tag: "Tendance" | "Nouveau" | "Populaire" | null;
  audio: string;
  price: number;
};

type Beatmaker = {
  id: number;
  name: string;
  avatar?: string;
  city?: string;
  specialties?: string[];
  sales: number;
  avgPrice: number;
  heat: number;
  instagram?: string;
  youtube?: string;
  email?: string;
  rating: number;
  beats: BeatCore[];
};

const TEST_AUDIO = 
  "/audio/Woke up late, still rich from yesterday  (Remix) (Instrumental) (1).mp3";

const GENRES = [
  "Trap",
  "Drill",
  "Boom Bap",
  "R&B",
  "Lofi",
  "West Coast",
] as const;

const KEYS = ["Fm", "Cm", "Gm", "Am", "Dm", "Bb", "Eb", "Abm", "C#m", "F#m"] as const;
const TAGS = ["Tendance", "Nouveau", "Populaire"] as const;

const randomIn = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

function generateBeatmakers(count = 24): Beatmaker[] {
  const names = [
    "Nova Wave",
    "808 Alchimist",
    "Blue Garden",
    "Nocturne Drive",
    "Crimson Keys",
    "Urban Mirage",
    "Velvet Bass",
    "Midnight Echo",
    "Neon Mirage",
    "Golden Tape",
    "Shadow Beats",
    "Electric Palm",
  ];
  return Array.from({ length: count }, (_, i) => {
    const bmName = randomIn(names) + " " + (100 + i);
    const beats = Array.from({ length: 12 }, (_, j) => {
      const title = `${bmName} - Beat ${j + 1}`;
      return {
        id: i * 100 + j,
        name: title,
        artist: bmName,
        genre: randomIn(GENRES),
        bpm: 80 + Math.floor(Math.random() * 60),
        key: randomIn(KEYS),
        tag: Math.random() > 0.6 ? randomIn(TAGS) : null,
        audio: TEST_AUDIO,
        price: parseFloat((9 + Math.random() * 30).toFixed(2)),
      } satisfies BeatCore;
    });
    const avgPrice = beats.reduce((a, b) => a + b.price, 0) / beats.length;
    const sales = 50 + Math.floor(Math.random() * 900);
    const heat = Math.round(0.5 * sales + Math.random() * 200);
    const rating = parseFloat((3.8 + Math.random() * 1.2).toFixed(1));
    return {
      id: i + 1,
      name: bmName,
      avatar: randomIn(["/img/melancolique.png", "/img/newwave.png", "/img/kick.png"]),
      city: "Paris",
      specialties: [randomIn(GENRES), randomIn(GENRES)],
      sales,
      avgPrice: parseFloat(avgPrice.toFixed(2)),
      heat,
      instagram: "https://www.instagram.com/beatmakerz_pro/",
      youtube: "https://www.youtube.com/@BEATMAKERZ-PRO",
      email: "beatmaker@example.com",
      rating,
      beats,
    } as Beatmaker;
  });
}

function Segmented({ value, onChange }: { value: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-black/40 p-1 text-sm">
      <button
        onClick={() => onChange("consulter")}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 ${
          value === "consulter" ? "bg-indigo-500 text-white" : "text-zinc-300 hover:bg-white/10"
        }`}
      >
        <Users size={14} /> Consulter
      </button>
      <button
        onClick={() => onChange("vendre")}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 ${
          value === "vendre" ? "bg-indigo-500 text-white" : "text-zinc-300 hover:bg-white/10"
        }`}
      >
        <Store size={14} /> Vendre
      </button>
    </div>
  );
}

export default function BeatmakerMarketplace() {
  const [mode, setMode] = useState<Mode>("consulter");
  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [genreFilter, setGenreFilter] = useState<string>("");
  const [onlyTop, setOnlyTop] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 16; // 4 x 4

  const { play, toggle, isPlaying, track, setQueue } = useAudio();
  // favoris persistant (localStorage)
  const [favs, setFavs] = useState<number[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("favs") || "[]";
      setFavs(JSON.parse(raw));
    } catch {}
  }, []);
  const saveFavs = (arr: number[]) => {
    setFavs(arr);
    try { localStorage.setItem("favs", JSON.stringify(arr)); } catch {}
  };
  const toggleFav = (id: number) => {
    saveFavs(favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id]);
  };

  // Génération côté client uniquement pour éviter les erreurs d'hydratation
  const [beatmakers, setBeatmakers] = useState<Beatmaker[]>([]);
  useEffect(() => {
    setBeatmakers(generateBeatmakers());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = Number(minPrice);
    const max = Number(maxPrice);
    let arr = beatmakers.filter((bm) => {
      const matchText =
        !q || [bm.name, ...(bm.specialties || [])].some((t) => (t || "").toLowerCase().includes(q));
      const matchGenre = !genreFilter || (bm.specialties || []).includes(genreFilter);
      const matchPrice = bm.beats.some((p) => {
        const okMin = !Number.isFinite(min) || !minPrice ? true : p.price >= min;
        const okMax = !Number.isFinite(max) || !maxPrice ? true : p.price <= max;
        return okMin && okMax;
      });
      return matchText && matchGenre && matchPrice;
    });

    if (onlyTop && arr.length) {
      const sortedHeat = [...arr].sort((a, b) => b.heat - a.heat);
      const cutoff = sortedHeat[Math.max(0, Math.floor(arr.length * 0.25) - 1)]?.heat ?? 0;
      arr = arr.filter((b) => b.heat >= cutoff);
    }

    return arr;
  }, [beatmakers, query, minPrice, maxPrice, genreFilter, onlyTop]);

  const lastIndex = page * pageSize;
  const current = filtered.slice(lastIndex - pageSize, lastIndex);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const [openId, setOpenId] = useState<number | null>(null);
  const [profileId, setProfileId] = useState<number | null>(null);
  const opened = current.find((b) => b.id === openId) || beatmakers.find((b) => b.id === openId) || null;
  const profiled = current.find((b) => b.id === profileId) || beatmakers.find((b) => b.id === profileId) || null;

  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setPage(1);
  }, [query, minPrice, maxPrice, genreFilter, onlyTop]);

  useEffect(() => {
    if (!opened) return;
    setQueue(opened.beats.map((x) => ({
      id: x.id,
      name: x.name,
      artist: x.artist,
      genre: x.genre,
      bpm: x.bpm,
      key: x.key,
      tag: x.tag,
      audio: x.audio,
    })));
  }, [opened, setQueue]);

  const onPlay = (b: BeatCore, list: BeatCore[]) => {
    const q = list.map((x) => ({
      id: x.id,
      name: x.name,
      artist: x.artist,
      genre: x.genre,
      bpm: x.bpm,
      key: x.key,
      tag: x.tag,
      audio: x.audio,
    }));
    if (track?.id === b.id && isPlaying) toggle();
    else play(q.find((x) => x.id === b.id)!, q);
  };

  // Sauvegarde des métadonnées de beat pour favoris (pour le modal)
  const saveBeatMeta = (b: BeatCore) => {
    try {
      const raw = localStorage.getItem("favs:data") || "{}";
      const map = JSON.parse(raw);
      map[b.id] = { id: b.id, name: b.name, artist: b.artist, price: b.price };
      localStorage.setItem("favs:data", JSON.stringify(map));
    } catch {}
  };

  const Chip = ({
    active,
    onClick,
    children,
  }: {
    active?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active
          ? "border-indigo-500/70 bg-indigo-500 text-white"
          : "border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-24 pb-40">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-[0_10px_60px_rgba(0,0,0,.35)]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-2xl font-bold">Marketplace</div>
            <Segmented value={mode} onChange={setMode} />
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setView("grid")}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                  view === "grid" ? "border-indigo-500 bg-indigo-500 text-white" : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <Grid3X3 className="h-4 w-4" /> Grille
              </button>
              <button
                onClick={() => setView("table")}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                  view === "table" ? "border-indigo-500 bg-indigo-500 text-white" : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <Rows3 className="h-4 w-4" /> Tableau
              </button>
            </div>
          </div>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un beatmaker, une spécialité…"
              className="w-full rounded-2xl border border-white/10 bg-black/50 pl-11 py-3 backdrop-blur-md"
            />
          </div>

          {/* Filtres avancés (verre, sticky) */}
          <div className="sticky top-20 z-40 mt-3 grid grid-cols-1 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl sm:grid-cols-4">
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm"
            >
              <option value="">Tous les genres</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="Prix min (€)"
              className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm"
            />
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="Prix max (€)"
              className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm"
            />
            <button
              onClick={() => {
                setGenreFilter("");
                setMinPrice("");
                setMaxPrice("");
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            >
              Réinitialiser
            </button>
          </div>

          {/* Filtres sociaux */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Chip active={onlyTop} onClick={() => setOnlyTop((v) => !v)}>
              <span className="inline-flex items-center gap-1"><Flame className="h-4 w-4 text-orange-400" /> Top beatmakers 🔥</span>
            </Chip>
          </div>
        </div>

        {mode === "vendre" ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#241e33]/60 to-[#161522]/60 p-8 text-zinc-200">
            <div className="text-xl font-semibold">Devenez vendeur sur Beatmakerz</div>
            <p className="mt-2 text-sm text-zinc-300">
              Mettez vos instrumentales en vente, gérez votre catalogue et recevez vos paiements en toute sécurité.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/web/vendeur/onboarding"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
              >
                <Store size={16} /> Commencer à vendre
              </a>
              <a
                href="/web/faq"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                En savoir plus
              </a>
            </div>
          </div>
        ) : (
          <div ref={listRef} className="mt-8">
            <AnimatePresence mode="popLayout">
              {view === "grid" ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
                >
                  {current.map((bm) => (
                    <motion.div
                      key={bm.id}
                      whileHover={{ y: -3, scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 280, damping: 22 }}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,.35)] aspect-square"
                    >
                      {/* background image plein cadre */}
                      <img
                        src={bm.avatar || "/img/profil.png"}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover brightness-[.7] scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-black" />

                      {/* overlay content */}
                      <div className="absolute inset-0 flex flex-col p-4">
                        <div className="flex items-center gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-[14px] font-semibold tracking-tight text-white">{bm.name}</div>
                            <div className="truncate text-[11px] text-zinc-200/90">{(bm.specialties || []).slice(0, 2).join(" • ")}</div>
                          </div>
                          {bm.heat > 400 && (
                            <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] text-white">
                              <Flame className="h-3 w-3 text-orange-400" /> Top
                            </span>
                          )}
                        </div>
                        <div className="mt-auto">
                          <div className="mb-2 flex justify-center">
                            <div className="grid grid-cols-3 gap-3 text-center text-[10px] text-zinc-200 justify-items-center">
                              <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-1.5 min-w-[96px]"><div className="text-white text-[12px] font-semibold">{bm.sales}</div><div>Ventes</div></div>
                              <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-1.5 min-w-[96px]"><div className="text-white text-[12px] font-semibold">{bm.beats.length}</div><div>Prods</div></div>
                              <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-1.5 min-w-[96px]"><div className="text-white text-[12px] font-semibold">{bm.avgPrice.toFixed(0)}€</div><div>Prix Moyen</div></div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setOpenId(bm.id)}
                              className="inline-flex flex-1 items-center justify-center rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15"
                            >
                              Voir les prods
                            </button>
                            <button
                              className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15"
                              onClick={() => setProfileId(bm.id)}
                            >
                              Profil
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="table"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="overflow-hidden rounded-2xl border border-white/10"
                >
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 text-zinc-300">
                      <tr>
                        <th className="px-4 py-3 text-left">Beatmaker</th>
                        <th className="px-4 py-3">Prods</th>
                        <th className="px-4 py-3">Spécialités</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {current.map((bm) => (
                        <tr key={bm.id} className="hover:bg-white/5">
                          <td className="px-4 py-3 font-medium">{bm.name}</td>
                          <td className="px-4 py-3 text-center">{bm.beats.length}</td>
                          <td className="px-4 py-3 text-center">{(bm.specialties || []).slice(0, 2).join(" • ")}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setOpenId(bm.id)}
                              className="rounded-full bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
                            >
                              Voir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 disabled:opacity-40"
              >
                Précédent
              </button>
              <div className="text-sm text-zinc-400">Page {page} sur {totalPages}</div>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-full bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 disabled:opacity-40"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Drawer prods plein écran */}
      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={() => setOpenId(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="absolute inset-0 h-full w-full overflow-y-auto border-t border-white/10 bg-gradient-to-b from-[#0b0b12] to-black"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header plein écran */}
              <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/10 bg-black/60 px-4 py-3 backdrop-blur-md">
                <img src={opened.avatar || "/img/profil.png"} alt="avatar" className="h-10 w-10 rounded-lg border border-white/10" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{opened.name}</div>
                  <div className="truncate text-xs text-zinc-400">{(opened.specialties || []).slice(0, 3).join(" • ")}</div>
                </div>
                <button
                  className="ml-auto rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
                  onClick={() => setOpenId(null)}
                >
                  Fermer
                </button>
              </div>

              <div className="p-4 sm:p-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {opened.beats.map((b) => (
                  <BeatCard
                    key={b.id}
                    id={b.id}
                    name={b.name}
                    artist={b.artist}
                    genre={b.genre}
                    bpm={b.bpm}
                    keySig={b.key}
                    price={b.price}
                    tag={b.tag || undefined}
                    isCurrent={track?.id === b.id}
                    isPlaying={isPlaying}
                    onPlayPause={() => onPlay(b, opened.beats)}
                    onFav={() => toggleFav(b.id)}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal profil centré */}
      <AnimatePresence>
        {profiled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setProfileId(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative w-[min(760px,94vw)] overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f14]/85 p-6 shadow-[0_20px_60px_rgba(0,0,0,.6)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4">
                <img src={profiled.avatar || "/img/profil.png"} alt="avatar" className="h-16 w-16 rounded-2xl border border-white/10" />
                <div className="min-w-0">
                  <div className="truncate text-lg font-semibold">{profiled.name}</div>
                  <div className="truncate text-xs text-zinc-400">{(profiled.specialties || []).slice(0, 3).join(" • ")}</div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => {
                      setProfileId(null);
                      setOpenId(profiled.id);
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
                  >
                    Consulter ses prods
                  </button>
                  <button
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
                    onClick={() => setProfileId(null)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
              {/* Stats + Réseaux */}
              <div className="mt-5 grid grid-cols-3 gap-3 text-center text-[12px] text-zinc-300">
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <div className="text-white text-base font-semibold">{profiled.beats.length}</div>
                  <div>Nombre de prods</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <div className="text-white text-base font-semibold">{profiled.sales}</div>
                  <div>Prods vendues</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <div className="flex items-center justify-center gap-1 text-white text-base font-semibold">
                    <Star className="h-4 w-4 text-yellow-300" /> {profiled.rating}/5
                  </div>
                  <div>Notation</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <a href={profiled.instagram} target="_blank" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
                <a href={profiled.youtube} target="_blank" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
                  <Youtube className="h-4 w-4" /> YouTube
                </a>
                <a href={`mailto:${profiled.email}`} className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
                  <Mail className="h-4 w-4" /> {profiled.email}
                </a>
              </div>

              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


