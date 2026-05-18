"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Grid3X3, Rows3, Search, Star, Store, Users } from "lucide-react";
import BeatCard from "@/components/BeatCard";
import AuthRequiredModal from "@/components/AuthRequiredModal";
import { Input } from "@/components/ui/input";
import { useAudio } from "@/context/AudioPlayerContext";
import { useAuth } from "@/context/AuthContext";
import { apiGet } from "@/lib/services/api-client";
import { fetchFavorites, toggleFavorite as toggleFavoriteApi } from "@/lib/services/user-api";

type Mode = "consulter" | "vendre";
type ViewMode = "grid" | "table";

type Beat = {
  id: string;
  name: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  price: number;
  tag?: "Tendance" | "Nouveau" | "Populaire" | null;
  audio: string;
  coverUrl?: string | null;
};

const PRICE_RANGES = [
  { label: "< 20 EUR", min: 0, max: 20 },
  { label: "20 - 30 EUR", min: 20, max: 30 },
  { label: "> 30 EUR", min: 30, max: Number.POSITIVE_INFINITY },
] as const;

const pageSize = 12;

const cn = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" ");

function ModeSegmented({ value, onChange }: { value: Mode; onChange: (mode: Mode) => void }) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-black/40 p-1 text-sm">
      {(["consulter", "vendre"] as Mode[]).map((option) => {
        const isActive = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 transition-colors",
              isActive ? "bg-white text-black" : "text-white hover:bg-white/10"
            )}
            aria-pressed={isActive}
          >
            {option === "consulter" ? <Users size={16} /> : <Store size={16} />}
            {option === "consulter" ? "Consulter" : "Vendre"}
          </button>
        );
      })}
    </div>
  );
}

function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (view: ViewMode) => void }) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-black/40 p-1 text-sm">
      {(["grid", "table"] as ViewMode[]).map((option) => {
        const isActive = option === value;
        const Icon = option === "grid" ? Grid3X3 : Rows3;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors capitalize",
              isActive ? "bg-white text-black" : "text-white hover:bg-white/10"
            )}
            aria-pressed={isActive}
          >
            <Icon size={16} />
            {option === "grid" ? "Grille" : "Tableau"}
          </button>
        );
      })}
    </div>
  );
}

function SellerSection({ onBack }: { onBack: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#11111a] to-black p-8 text-white shadow-lg"
    >
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Beatmakerz Studio</p>
          <h2 className="mt-2 text-3xl font-semibold">Devenez vendeur</h2>
          <p className="mt-3 max-w-2xl text-sm text-zinc-300">
            Créez votre catalogue, publiez vos prods et recevez vos commandes dans un espace unique. Nous nous occupons du support et des
            paiements.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Star size={16} className="text-amber-300" />
              Profil public
            </h3>
            <p className="mt-2 text-xs text-zinc-300">Renseignez vos styles, vos tarifs et vos liens pour être visible des artistes.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Flame size={16} className="text-orange-400" />
              Boost ventes
            </h3>
            <p className="mt-2 text-xs text-zinc-300">Accédez à nos statistiques pour comprendre ce qui fonctionne et optimiser vos sorties.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Store size={16} className="text-emerald-300" />
              Paiements sécurisés
            </h3>
            <p className="mt-2 text-xs text-zinc-300">Nous traitons les licences, la TVA et les versements pour que vous puissiez créer.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/web/vendeur/beatmaker-setup"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90"
          >
            Ouvrir mon espace vendeur
          </Link>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Retour à la marketplace
          </button>
        </div>
      </div>
    </motion.section>
  );
}

function EmptyState({ query }: { query: string }) {
  const message = query ? `Essayez une autre recherche que "${query}" ou modifiez vos filtres.` : "Aucun beat ne correspond à ces filtres.";

  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] text-center text-sm text-zinc-300"
    >
      <h3 className="text-base font-semibold text-white">Aucun résultat</h3>
      <p className="mt-2 max-w-sm">{message}</p>
    </motion.div>
  );
}

function ResultsSummary({ beatsCount }: { beatsCount: number }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
      <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-white">{beatsCount} beats</span>
    </div>
  );
}

function TableView({
  beats,
  onPlayPause,
  isPlaying,
  currentTrackId,
  favorites,
  onToggleFavorite,
}: {
  beats: Beat[];
  onPlayPause: (beat: Beat) => void;
  isPlaying: boolean;
  currentTrackId: string | number | null;
  favorites: string[];
  onToggleFavorite: (beatId: string) => void;
}) {
  return (
    <motion.div
      key="table"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-black/60"
    >
      <table className="w-full table-fixed text-left text-sm text-white">
        <thead className="bg-white/5 text-xs uppercase tracking-wide text-zinc-300">
          <tr>
            <th className="px-4 py-3">Beat</th>
            <th className="px-4 py-3">Artiste</th>
            <th className="px-4 py-3">Genre</th>
            <th className="px-4 py-3">BPM</th>
            <th className="px-4 py-3">Prix</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {beats.map((beat) => {
            const isCurrent = currentTrackId === beat.id && isPlaying;
            const isFavorite = favorites.includes(String(beat.id));
            return (
              <tr key={beat.id} className="border-t border-white/5 text-sm">
                <td className="px-4 py-3 font-semibold">{beat.name}</td>
                <td className="px-4 py-3 text-zinc-300">{beat.artist}</td>
                <td className="px-4 py-3 text-zinc-300">{beat.genre}</td>
                <td className="px-4 py-3 text-zinc-300">{beat.bpm}</td>
                <td className="px-4 py-3 text-zinc-100">{beat.price.toFixed(2)} EUR</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onPlayPause(beat)}
                      className={cn(
                        "rounded-full border border-white/10 px-3 py-1 text-xs font-medium transition-colors",
                        isCurrent ? "bg-white text-black" : "text-white hover:bg-white/10"
                      )}
                    >
                      {isCurrent ? "Pause" : "Lecture"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(String(beat.id))}
                      className={cn(
                        "rounded-full border border-white/10 px-3 py-1 text-xs font-medium transition-colors",
                        isFavorite ? "bg-pink-500 text-white" : "text-white hover:bg-white/10"
                      )}
                    >
                      {isFavorite ? "Favori" : "Favoris"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (next: number) => void }) {
  if (totalPages <= 1) {
    return null;
  }

  const segments: number[] = [];
  for (let i = 1; i <= totalPages; i += 1) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      segments.push(i);
    } else if (segments[segments.length - 1] !== -1) {
      segments.push(-1);
    }
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={cn("rounded-full border border-white/10 px-3 py-1 text-sm text-white transition-colors", page === 1 ? "opacity-40" : "hover:bg-white/10")}
      >
        Précédent
      </button>
      {segments.map((item, index) =>
        item === -1 ? (
          <span key={`ellipsis-${index}`} className="px-2 text-sm text-zinc-500">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={cn(
              "h-8 w-8 rounded-full text-sm font-semibold transition-colors",
              item === page ? "bg-white text-black" : "border border-white/10 text-white hover:bg-white/10"
            )}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={cn("rounded-full border border-white/10 px-3 py-1 text-sm text-white transition-colors", page === totalPages ? "opacity-40" : "hover:bg-white/10")}
      >
        Suivant
      </button>
    </div>
  );
}

export default function BeatmakerMarketplace() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("consulter");
  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [priceRangeIndex, setPriceRangeIndex] = useState<number | null>(null);
  const [onlyTop, setOnlyTop] = useState(false);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [beats, setBeats] = useState<Beat[]>([]);
  const { play, toggle, track, isPlaying } = useAudio();
  const { user } = useAuth();

  // chargement initial des beats depuis l'API, fallback si erreur
  useEffect(() => {
    type ApiBeat = { _id?: string; id?: string; title?: string; artist?: { name?: string }; genres?: string[]; bpm?: number; key?: string; priceOverrides?: { priceCents?: number }[]; priceCents?: number; tag?: string; assets?: { type?: string }[]; coverUrl?: string | null };
    apiGet<{ items: ApiBeat[] }>("/beats")
      .then((data) => {
        const mapped =
          data.items?.map((b, idx) => ({
            id: String(b._id || b.id || `beat-${idx}`),
            name: b.title || "Beat",
            artist: b.artist?.name || "Beatmaker",
            genre: b.genres?.[0] || "Beat",
            bpm: b.bpm ?? 120,
            key: b.key || "Am",
            price: (b.priceOverrides?.[0]?.priceCents ?? b.priceCents ?? 1999) / 100,
            tag: (b.tag as Beat["tag"]) ?? null,
            audio: b.assets?.find((a) => a.type === "preview")
              ? `${process.env.NEXT_PUBLIC_API_URL || "https://beatmakerz-api.onrender.com"}/beats/${String(b._id || b.id)}/stream/preview`
              : "/audio/sample.mp3",
            coverUrl: b.coverUrl ?? null,
          })) || [];
        setBeats(mapped);
      })
      .catch(() => setBeats([]));
  }, []);

  // favoris utilisateurs via API
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    fetchFavorites()
      .then((items) => setFavorites(items.map((f) => f.beatId)))
      .catch(() => setFavorites([]));
  }, [user]);

  const allGenres = useMemo(() => Array.from(new Set(beats.map((b) => b.genre))).sort((a, b) => a.localeCompare(b)), [beats]);

  const filteredBeats = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedGenre = genreFilter === "all" || !genreFilter ? null : genreFilter.toLowerCase();
    const range = priceRangeIndex === null ? null : PRICE_RANGES[priceRangeIndex];

    return beats
      .filter((beat) => {
        const matchesQuery =
          !normalizedQuery ||
          beat.name.toLowerCase().includes(normalizedQuery) ||
          beat.artist.toLowerCase().includes(normalizedQuery) ||
          beat.genre.toLowerCase().includes(normalizedQuery);
        if (!matchesQuery) return false;

        const matchesGenre = !normalizedGenre || beat.genre.toLowerCase() === normalizedGenre;
        if (!matchesGenre) return false;

        const matchesPrice = !range || (beat.price >= range.min && beat.price <= range.max);
        if (!matchesPrice) return false;

        const matchesTop = !onlyTop || beat.tag === "Tendance" || beat.tag === "Populaire";
        return matchesTop;
      })
      .sort((a, b) => b.price - a.price);
  }, [beats, genreFilter, onlyTop, priceRangeIndex, query]);

  const totalPages = Math.max(1, Math.ceil(filteredBeats.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [query, genreFilter, priceRangeIndex, onlyTop]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const visibleBeats = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredBeats.slice(start, start + pageSize);
  }, [filteredBeats, page]);

  const currentTrackId = track ? track.id : null;

  const handleToggleFavorite = async (beatId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    try {
      await toggleFavoriteApi(beatId);
      setFavorites((prev) => (prev.includes(beatId) ? prev.filter((id) => id !== beatId) : [...prev, beatId]));
    } catch {
      // ignore
    }
  };

  const handlePlayPause = (beat: Beat) => {
    const queue = visibleBeats.map((item) => ({
      id: item.id,
      name: item.name,
      artist: item.artist,
      genre: item.genre,
      bpm: item.bpm,
      key: item.key,
      tag: item.tag ?? null,
      audio: item.audio,
    }));

    if (currentTrackId === beat.id) {
      toggle();
      return;
    }

    const target = queue.find((item) => item.id === beat.id);
    if (target) {
      play(target, queue);
    }
  };

  const handlePageChange = (next: number) => {
    if (next < 1 || next > totalPages || next === page) {
      return;
    }
    setPage(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen text-white">
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 sm:pt-32">
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">Beatmakerz Marketplace</p>
          <h1 className="text-4xl font-semibold text-white">Explorez les beatmakers</h1>
          <p className="max-w-2xl text-sm text-zinc-300">Filtrez par style, comparez les tarifs et ajoutez vos coups de cœur au panier.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ModeSegmented value={mode} onChange={setMode} />
          <ViewToggle value={view} onChange={setView} />
          <button
            type="button"
            onClick={() => setOnlyTop((prev) => !prev)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-sm transition-colors",
              onlyTop ? "bg-orange-500 text-white" : "text-white hover:bg-white/10"
            )}
            aria-pressed={onlyTop}
          >
            <Flame size={16} />
            Top vendeurs
          </button>
        </div>
      </header>

      {mode === "vendre" ? (
        <div className="mt-10">
          <SellerSection onBack={() => setMode("consulter")} />
        </div>
      ) : (
        <>
          <div className="mt-10 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex w/full flex-col gap-3 md:max-w-xl">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Rechercher un beat ou un style"
                    className="h-11 border-white/10 bg-white/[0.05] pl-10 text-sm text-white placeholder:text-zinc-500"
                    aria-label="Rechercher dans la marketplace"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <label className="text-xs uppercase tracking-wide text-zinc-400">
                  Genre
                  <select
                    value={genreFilter}
                    onChange={(event) => setGenreFilter(event.target.value)}
                    className="ml-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 text-sm text-white"
                  >
                    <option value="all">Tous les styles</option>
                    {allGenres.map((genre) => (
                      <option key={genre} value={genre.toLowerCase()}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs uppercase tracking-wide text-zinc-400">
                  Prix
                  <select
                    value={priceRangeIndex === null ? "" : String(priceRangeIndex)}
                    onChange={(event) => {
                      const value = event.target.value;
                      setPriceRangeIndex(value === "" ? null : Number(value));
                    }}
                    className="ml-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 text-sm text-white"
                  >
                    <option value="">Tous les tarifs</option>
                    {PRICE_RANGES.map((range, index) => (
                      <option key={range.label} value={index}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <ResultsSummary beatsCount={filteredBeats.length} />
          </div>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              {visibleBeats.length === 0 ? (
                <EmptyState query={query} />
              ) : view === "grid" ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {visibleBeats.map((beat) => {
                    const isCurrent = currentTrackId === beat.id;
                    return (
                      <BeatCard
                        key={beat.id}
                        id={beat.id}
                        name={beat.name}
                        artist={beat.artist}
                        genre={beat.genre}
                        bpm={beat.bpm}
                        keySig={beat.key}
                        price={beat.price}
                        tag={beat.tag ?? undefined}
                        isCurrent={isCurrent}
                        isPlaying={isPlaying}
                        isFav={favorites.includes(String(beat.id))}
                        onPlayPause={() => handlePlayPause(beat)}
                        onFav={() => handleToggleFavorite(String(beat.id))}
                        coverUrl={beat.coverUrl}
                      />
                    );
                  })}
                </motion.div>
              ) : (
                <TableView
                  beats={visibleBeats}
                  onPlayPause={handlePlayPause}
                  isPlaying={isPlaying}
                  currentTrackId={currentTrackId}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
            </AnimatePresence>
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </>
      )}
      <AuthRequiredModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => {
          setShowAuthModal(false);
          router.push("/web/profil?mode=login");
        }}
      />
      </div>
    </div>
  );
}
