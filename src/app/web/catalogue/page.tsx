"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  Rows3,
  Play,
  Pause,
  X,
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scrollarea";
import AudioPlayer from "@/components/ui/audioplayer";
import Pagination from "@/components/ui/pagination";
import BeatRow from "@/components/ui/beatrow";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

/* --------------------------- Demo data (identique) --------------------------- */
const genres = [
  "Drill",
  "Trap",
  "Lofi",
  "Boom Bap",
  "R&B",
  "Soul",
  "West Coast",
];
const keys = ["Fm", "Cm", "Gm", "Am", "Dm", "Bb", "Eb", "Abm", "C#m", "F#m"];

type Beat = {
  id: number;
  name: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  tag: string | null;
  audio: string;
};

const generateRandomBeats = (count: number): Beat[] => {
  const artists = [
    "Central Cee",
    "Travis Scott",
    "J. Cole",
    "Nas",
    "Metro Boomin",
    "Drake",
    "Kanye West",
    "Lil Baby",
    "Kendrick Lamar",
    "The Weeknd",
  ];
  const adjectives = [
    "Fire",
    "Epic",
    "Dark",
    "Smooth",
    "Melodic",
    "Hard",
    "Soulful",
    "Vibing",
    "Vintage",
    "Dreamy",
  ];
  const tags = ["🔥", "Nouveauté", "Populaire", null];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${adjectives[Math.floor(Math.random() * adjectives.length)]} Beat ${
      i + 1
    }`,
    artist: `${artists[Math.floor(Math.random() * artists.length)]} Type Beat`,
    genre: genres[Math.floor(Math.random() * genres.length)],
    bpm: Math.floor(Math.random() * (160 - 80) + 80),
    key: keys[Math.floor(Math.random() * keys.length)],
    tag: tags[Math.floor(Math.random() * tags.length)],
    audio: "/audio/beats/beats.mp3",
  }));
};

/* -------------------------------- Helpers -------------------------------- */
type BPMRange = { label: string; min: number; max: number };
const bpmRanges: BPMRange[] = [
  { label: "80-100", min: 80, max: 100 },
  { label: "101-120", min: 101, max: 120 },
  { label: "121-140", min: 121, max: 140 },
  { label: "141+", min: 141, max: Infinity },
];
type ViewMode = "grid" | "table";

const Chip: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}> = ({ children, active, onClick, className }) => (
  <button
    onClick={onClick}
    className={[
      "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all border shadow-sm",
      active
        ? "bg-[#5b3bc4] border-[#5b3bc4] text-white"
        : "bg-black/40 border-white/10 text-gray-300 hover:bg-white/10",
      className || "",
    ].join(" ")}
  >
    {children}
  </button>
);

/* ----------------------------- Beat Card (new) ----------------------------- */
const BeatCard: React.FC<{
  beat: Beat;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlay: (b: Beat) => void;
  onFav: (id: number) => void;
  fav: boolean;
  onAddToCart: (id: number) => void;
}> = ({ beat, isCurrent, isPlaying, onPlay, onFav, fav, onAddToCart }) => (
  <motion.div
    layout
    whileHover={{ y: -4 }}
    className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/60 to-black p-4 shadow-lg"
  >
    {/* corner dot */}
    {beat.tag && (
      <span className="absolute -top-2 left-4 rounded-full bg-white/10 backdrop-blur px-2 py-0.5 text-[10px] uppercase tracking-wide">
        {beat.tag}
      </span>
    )}

    <div className="flex items-start gap-3">
      <button
        onClick={() => onPlay(beat)}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
        aria-label={isCurrent && isPlaying ? "Pause" : "Lecture"}
      >
        {isCurrent && isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold">{beat.name}</h3>
        <p className="truncate text-xs text-gray-400">{beat.artist}</p>
      </div>

      <button
        onClick={() => onFav(beat.id)}
        className={`rounded-full p-2 transition ${
          fav ? "text-[#ff3b81]" : "text-gray-400 hover:text-white"
        }`}
        aria-label="Ajouter aux favoris"
        title="Favori"
      >
        <Heart size={18} fill={fav ? "#ff3b81" : "transparent"} />
      </button>
    </div>

    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-gray-300">
      <div className="rounded-lg border border-white/10 bg-white/5 py-1">
        Genre
        <br />
        <span className="text-white">{beat.genre}</span>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 py-1">
        BPM
        <br />
        <span className="text-white">{beat.bpm}</span>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 py-1">
        Key
        <br />
        <span className="text-white">{beat.key}</span>
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between">
      <button
        onClick={() => onPlay(beat)}
        className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold transition hover:bg-[#5b3bc4] hover:border-[#5b3bc4]"
      >
        {isCurrent && isPlaying ? "Pause" : "Écouter"}
      </button>

      <button
        onClick={() => onAddToCart(beat.id)}
        className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/10"
      >
        <ShoppingCart size={14} /> Ajouter
      </button>
    </div>

    {/* glow on hover */}
    <div
      className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 blur-2xl transition duration-300 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(600px circle at 0% 0%, rgba(91,59,196,0.2), transparent 40%)",
      }}
    />
  </motion.div>
);

/* --------------------------------- Page --------------------------------- */
const Catalogue: React.FC = () => {
  const [beats, setBeats] = useState<Beat[]>([]);
  useEffect(() => {
    setBeats(generateRandomBeats(500));
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [placeholder, setPlaceholder] = useState(
    "Rechercher un beat, artiste, genre…"
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedBPM, setSelectedBPM] = useState<BPMRange | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<"relevance" | "bpm-asc" | "bpm-desc">(
    "relevance"
  );
  const [favs, setFavs] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("favBeats") || "[]");
    } catch {
      return [];
    }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const beatsPerPage = 50;

  const {
    beat: currentBeat,
    isPlaying,
    playBeat,
    togglePlay,
  } = useAudioPlayer();

  // Placeholder dynamique (vibes)
  useEffect(() => {
    const pool = [
      "Rechercher un beat, artiste, genre…",
      "Essaye : Travis Scott Type Beat",
      "Filtrer par tonalité (ex : F#m)…",
      "Trouver par BPM (ex : 120)…",
      "Nouveauté, Populaire, 🔥 …",
    ];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % pool.length;
      setPlaceholder(pool[i]);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Persist favoris
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favBeats", JSON.stringify(favs));
    }
  }, [favs]);

  useEffect(
    () => setCurrentPage(1),
    [
      searchTerm,
      selectedGenres,
      selectedKeys,
      selectedTag,
      selectedBPM,
      sort,
      viewMode,
    ]
  );

  const toggleList = (
    value: string,
    list: string[],
    setList: (v: string[]) => void
  ) =>
    setList(
      list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
    );

  const filteredBeats = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const arr = beats.filter((b) => {
      const matchesSearch =
        !term ||
        b.name.toLowerCase().includes(term) ||
        b.artist.toLowerCase().includes(term) ||
        b.genre.toLowerCase().includes(term) ||
        b.key.toLowerCase().includes(term);
      const matchesGenre =
        selectedGenres.length === 0 || selectedGenres.includes(b.genre);
      const matchesKey =
        selectedKeys.length === 0 || selectedKeys.includes(b.key);
      const matchesTag = !selectedTag || b.tag === selectedTag;
      const matchesBPM =
        !selectedBPM || (b.bpm >= selectedBPM.min && b.bpm <= selectedBPM.max);
      return (
        matchesSearch && matchesGenre && matchesKey && matchesTag && matchesBPM
      );
    });
    if (sort === "bpm-asc") arr.sort((a, b) => a.bpm - b.bpm);
    if (sort === "bpm-desc") arr.sort((a, b) => b.bpm - a.bpm);
    return arr;
  }, [
    beats,
    searchTerm,
    selectedGenres,
    selectedKeys,
    selectedTag,
    selectedBPM,
    sort,
  ]);

  // Pagination
  const startIndex = (currentPage - 1) * beatsPerPage;
  const currentBeats = filteredBeats.slice(
    startIndex,
    startIndex + beatsPerPage
  );
  const totalPages = Math.ceil(filteredBeats.length / beatsPerPage);

  // Actions
  const onFav = (id: number) =>
    setFavs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const onAddToCart = (id: number) => {
    // branche ton store/cart ici
    console.log("ADD_TO_CART", id);
  };

  // Next/Prev (lecture)
  const goPrev = () => {
    if (!currentBeat) return;
    const idx = currentBeats.findIndex((b) => b.id === currentBeat.id);
    const prev = currentBeats[idx - 1];
    if (prev) playBeat(prev);
  };
  const goNext = () => {
    if (!currentBeat) return;
    const idx = currentBeats.findIndex((b) => b.id === currentBeat.id);
    const next = currentBeats[idx + 1];
    if (next) playBeat(next);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900/80 to-black text-white pb-36 pt-[84px]">
      {/* HERO */}
      <section className="mx-auto w-full max-w-7xl px-4">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#1b1633] via-[#120f25] to-black p-6 md:p-8 shadow-xl">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Catalogue
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                {filteredBeats.length} résultat
                {filteredBeats.length > 1 ? "s" : ""} • {genres.length} genres •
                vue {viewMode === "grid" ? "grille" : "tableau"}
              </p>
            </div>

            {/* Search + view + sort */}
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
              <div className="relative md:w-96">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <Input
                  className="w-full rounded-full border border-white/10 bg-black/50 pl-10"
                  placeholder={placeholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 self-stretch md:self-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    viewMode === "grid"
                      ? "bg-white/10 border-white/10"
                      : "border-white/10 hover:bg-white/5"
                  }`}
                  aria-label="Vue grille"
                >
                  <Grid3X3 size={16} /> Grille
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    viewMode === "table"
                      ? "bg-white/10 border-white/10"
                      : "border-white/10 hover:bg-white/5"
                  }`}
                  aria-label="Vue tableau"
                >
                  <Rows3 size={16} /> Tableau
                </button>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as typeof sort)}
                    className="rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-semibold"
                    aria-label="Trier"
                  >
                    <option value="relevance">Pertinence</option>
                    <option value="bpm-asc">BPM ↑</option>
                    <option value="bpm-desc">BPM ↓</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Quick filters bar */}
          <div className="mt-5 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-semibold">
              <SlidersHorizontal size={14} /> Filtres rapides
            </span>
            <ScrollArea className="h-8 w-full">
              <div className="flex w-max items-center gap-2 pl-2">
                {["🔥", "Nouveauté", "Populaire"].map((t) => (
                  <Chip
                    key={t}
                    active={selectedTag === t}
                    onClick={() =>
                      setSelectedTag((prev) => (prev === t ? null : t))
                    }
                  >
                    {t}
                  </Chip>
                ))}
                {bpmRanges.map((b) => (
                  <Chip
                    key={b.label}
                    active={selectedBPM?.label === b.label}
                    onClick={() =>
                      setSelectedBPM((p) => (p?.label === b.label ? null : b))
                    }
                  >
                    {b.label}
                  </Chip>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </section>

      {/* ACTIVE FILTERS */}
      <section className="mx-auto mt-4 w-full max-w-7xl px-4">
        <div className="flex flex-wrap items-center gap-2">
          {[...selectedGenres, ...selectedKeys, selectedTag, selectedBPM?.label]
            .filter(Boolean)
            .map((label) => (
              <span
                key={label as string}
                className="bg-[#5b3bc4] text-white text-xs px-3 py-1 rounded-full inline-flex items-center gap-2"
              >
                {label}
                <button
                  onClick={() => {
                    setSelectedGenres((g) => g.filter((x) => x !== label));
                    setSelectedKeys((k) => k.filter((x) => x !== label));
                    if (selectedTag === label) setSelectedTag(null);
                    if (selectedBPM?.label === label) setSelectedBPM(null);
                  }}
                  className="hover:opacity-80"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          {(selectedGenres.length ||
            selectedKeys.length ||
            selectedTag ||
            selectedBPM) && (
            <button
              onClick={() => {
                setSelectedGenres([]);
                setSelectedKeys([]);
                setSelectedTag(null);
                setSelectedBPM(null);
              }}
              className="text-xs text-gray-400 underline-offset-2 hover:underline"
            >
              Tout effacer
            </button>
          )}
        </div>
      </section>

      {/* BODY */}
      <section className="mx-auto mt-6 grid w-full max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-[280px,1fr]">
        {/* Side filters */}
        <aside className="order-2 md:order-1">
          <div className="sticky top-24 space-y-6 rounded-2xl border border-white/10 bg-black/40 p-4">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Genres
              </p>
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <Chip
                    key={g}
                    active={selectedGenres.includes(g)}
                    onClick={() =>
                      toggleList(g, selectedGenres, setSelectedGenres)
                    }
                  >
                    {g}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Tonalités
              </p>
              <ScrollArea className="h-24">
                <div className="flex flex-wrap gap-2 pr-2">
                  {keys.map((k) => (
                    <Chip
                      key={k}
                      active={selectedKeys.includes(k)}
                      onClick={() =>
                        toggleList(k, selectedKeys, setSelectedKeys)
                      }
                    >
                      {k}
                    </Chip>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {["🔥", "Nouveauté", "Populaire"].map((t) => (
                  <Chip
                    key={t}
                    active={selectedTag === t}
                    onClick={() =>
                      setSelectedTag((prev) => (prev === t ? null : t))
                    }
                  >
                    {t}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                BPM
              </p>
              <div className="flex flex-wrap gap-2">
                {bpmRanges.map((b) => (
                  <Chip
                    key={b.label}
                    active={selectedBPM?.label === b.label}
                    onClick={() =>
                      setSelectedBPM((p) => (p?.label === b.label ? null : b))
                    }
                  >
                    {b.label}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="order-1 md:order-2">
          <AnimatePresence mode="popLayout">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {currentBeats.map((beat) => (
                  <BeatCard
                    key={beat.id}
                    beat={beat}
                    isCurrent={currentBeat?.id === beat.id}
                    isPlaying={isPlaying}
                    onPlay={(b) =>
                      currentBeat?.id === b.id ? togglePlay() : playBeat(b)
                    }
                    onFav={onFav}
                    fav={favs.includes(beat.id)}
                    onAddToCart={onAddToCart}
                  />
                ))}
                {currentBeats.length === 0 && (
                  <div className="col-span-full rounded-2xl border border-white/10 bg-black/30 p-10 text-center text-sm text-gray-400">
                    Aucun résultat ne correspond à vos filtres.
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/30">
                  <table className="w-full border-collapse text-left">
                    <thead className="sticky top-0 z-10 border-b border-white/10 bg-black/60 backdrop-blur text-[12px] text-gray-400">
                      <tr>
                        <th className="px-4 py-3 w-10">#</th>
                        <th className="px-2 py-3">Titre</th>
                        <th className="px-2 py-3">Artiste</th>
                        <th className="px-2 py-3">Genre</th>
                        <th className="px-2 py-3">BPM</th>
                        <th className="px-2 py-3">Key</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBeats.map((beat, i) => (
                        <BeatRow
                          key={beat.id}
                          beat={beat}
                          index={startIndex + i}
                          onPlay={(b: Beat) =>
                            currentBeat?.id === b.id
                              ? togglePlay()
                              : playBeat(b)
                          }
                          isPlaying={isPlaying}
                          current={currentBeat}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {filteredBeats.length > beatsPerPage && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page: number) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}
        </main>
      </section>

      {/* Player global + prev/next */}
      <div className="fixed inset-x-0 bottom-14 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 backdrop-blur">
          <button
            onClick={goPrev}
            className="rounded-full p-1 hover:bg-white/10"
            aria-label="Précédent"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="rounded-full px-3 py-1 text-sm hover:bg-white/10"
          >
            {isPlaying ? "Pause" : "Lecture"}
          </button>
          <button
            onClick={goNext}
            className="rounded-full p-1 hover:bg-white/10"
            aria-label="Suivant"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <AudioPlayer
        beat={currentBeat}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
      />
    </div>
  );
};

export default Catalogue;
