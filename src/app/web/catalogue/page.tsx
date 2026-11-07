"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid3X3, Rows3, SlidersHorizontal, Star, Crown, Flame, ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useAudio } from "@/context/AudioPlayerContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import BeatCard from "@/components/BeatCard";
import AuthRequiredModal from "@/components/AuthRequiredModal";
import { Chip } from "@/components/ui/chip";
import { Button, ButtonLink } from "@/components/ui/button";
import BeatTableRow from "@/components/BeatTableRow";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import { fetchFileUpCatalogue } from "@/lib/services/fileup-catalogue";
import { fetchFavorites, toggleFavorite as toggleFavoriteApi } from "@/lib/services/user-api";

/* ------------------------------ types & data ------------------------------ */

type Tag = "Tendance" | "Nouveau" | "Populaire";
type ViewMode = "grid" | "table";

export type Beat = {
  id: number | string;
  name: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  tag: Tag | null;
  audio: string;
  price: number;
  coverUrl?: string | null;
  licenseTypeId?: string;
};


const GENRES = [
  "Trap",
  "Drill",
  "Boom Bap",
  "R&B",
  "Lofi",
  "Soul",
  "West Coast",
  "East Coast",
  "New Wave",
  "New Jazz",
  "Afro",
  "Afro Trap",
  "Pop Urbain",
  "Detroit",
  "Jersey Club",
  "Cloud Rap",
  "Trap Soul",
  "Dancehall",
] as const;
const KEYS = [
  "Fm",
  "Cm",
  "Gm",
  "Am",
  "Dm",
  "Em",
  "Bm",
  "Bb",
  "Eb",
  "Abm",
  "C#m",
  "F#m",
  "G#m",
  "D#m",
  "Ebm",
  "Bbm",
  "A#m",
  "Dbm",
] as const;
const QUICK_TAGS: Tag[] = ["Tendance", "Nouveau", "Populaire"];
const SORTS = ["Prix ↑", "Prix ↓", "BPM ↑", "BPM ↓"] as const;

const COLLECTIONS: {
  key: string;
  label: string;
  icon: React.ReactNode;
  action: (ctx: { setTag: (t: Tag | null) => void }) => void;
}[] = [
  {
    key: "top",
    label: "Top",
    icon: <Crown className="h-4 w-4 text-amber-300" />,
    action: ({ setTag }) => setTag("Populaire"),
  },
  {
    key: "nouveaux",
    label: "Nouveaux",
    icon: <Star className="h-4 w-4 text-yellow-300" />,
    action: ({ setTag }) => setTag("Nouveau"),
  },
  // trending supprimé selon demande
];

// plages de BPM
const BPM_MIN = 60;
const BPM_MAX = 200;
const BPM_RANGE_SIZE = 30; // Taille fixe de la zone BPM (ex: 100-130)



/* -------------------------------- helpers -------------------------------- */

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400">{children}</div>
);

/* -------------------------------- ZoneSlider -------------------------------- */

const ZoneSlider = ({
  min,
  max,
  rangeSize,
  value,
  onChange,
  isActive,
  onToggleActive,
}: {
  min: number;
  max: number;
  rangeSize: number;
  value: number;
  onChange: (value: number) => void;
  isActive: boolean;
  onToggleActive: () => void;
}) => {
  // Le slider va de min à (max - rangeSize) car value représente le début de la zone
  const effectiveMax = max - rangeSize;

  const handleValueChange = (newValues: number[]) => {
    if (newValues[0] !== undefined) onChange(newValues[0]);
  };

  const displayMin = value;
  const displayMax = value + rangeSize;

  // Calcul de la position de la zone pour l'affichage
  const totalRange = max - min;
  const zoneStartPercent = ((value - min) / totalRange) * 100;
  const zoneWidthPercent = (rangeSize / totalRange) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <SectionTitle>Tempo (BPM)</SectionTitle>
        {isActive && (
          <button className="text-xs text-zinc-400 hover:text-zinc-200" onClick={onToggleActive}>
            Désactiver
          </button>
        )}
      </div>

      {/* Container avec la zone colorée en arrière-plan */}
      <div className="relative">
        {/* Zone colorée - affichée derrière le slider */}
        <div
          className={`absolute top-0 h-5 rounded-full pointer-events-none transition-colors ${
            isActive
              ? "bg-gradient-to-r from-brand-vivid to-[#c43eff]"
              : "bg-white/20"
          }`}
          style={{
            left: `${zoneStartPercent}%`,
            width: `${zoneWidthPercent}%`,
          }}
        />

        {/* Slider Radix - un seul thumb pour le début de la zone */}
        <SliderPrimitive.Root
          className="relative flex w-full touch-none select-none items-center"
          value={[value]}
          onValueChange={handleValueChange}
          min={min}
          max={effectiveMax}
          step={1}
        >
          <SliderPrimitive.Track
            className={`relative h-5 w-full grow overflow-hidden rounded-full ${
              isActive ? "bg-white/10" : "bg-white/5"
            }`}
          >
            {/* Range invisible car on utilise notre propre zone colorée */}
            <SliderPrimitive.Range className="absolute h-full opacity-0" />
          </SliderPrimitive.Track>

          {/* Thumb principal - début de la zone */}
          <SliderPrimitive.Thumb
            className="block h-6 w-4 cursor-grab rounded-md border-2 border-white/50 bg-white shadow-lg transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand active:cursor-grabbing active:scale-105"
            aria-label="Position BPM"
          />
        </SliderPrimitive.Root>
      </div>

      <div className="flex items-center justify-center text-[11px] uppercase tracking-[0.3em] text-zinc-400">
        {isActive ? (
          <span>{displayMin} - {displayMax} BPM</span>
        ) : (
          <span className="text-zinc-500">Glissez pour filtrer par BPM</span>
        )}
      </div>
    </div>
  );
};

/* ---------------------------------- page --------------------------------- */

function CatalogueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { play, toggle, isPlaying, track, setQueue } = useAudio();
  const { addItem, items: cartItems } = useCart();
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [bpmFilterActive, setBpmFilterActive] = useState(false); // Filtre BPM désactivé par défaut
  const [bpmStart, setBpmStart] = useState<number>(100); // Valeur par défaut centrale (100-120)
  const bpmMin = bpmStart;
  const bpmMax = Math.min(bpmStart + BPM_RANGE_SIZE, BPM_MAX);
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Prix ↑");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [beats, setBeats] = useState<Beat[]>([]);
  const [isLoadingBeats, setIsLoadingBeats] = useState(true);
  const [favIds, setFavIds] = useState<string[]>([]);
  const [errorBeats, setErrorBeats] = useState<string | null>(null);

  const loadBeats = useCallback(async () => {
    setIsLoadingBeats(true);
    setErrorBeats(null);
    try {
      const items = await fetchFileUpCatalogue();
      // Un beat n'est en vente que s'il a une preview et un prix calculé par l'API
      // (licence Basic, même calcul que le panier : prix affiché = prix facturé).
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://beatmakerz-api.onrender.com";
      const mapped = items.flatMap((b, idx) => {
        const id = b._id || b.id || `beat-${idx}`;
        const hasPreview = b.assets?.some((a) => a.type === "preview");
        if (!hasPreview || typeof b.priceCents !== "number") return [];
        return [
          {
            id,
            name: b.title || b.name || "Beat",
            artist: typeof b.artist === "string" ? b.artist : b.artist?.name || "Beatmaker",
            genre: b.genres?.[0] || b.genre || "Beat",
            bpm: b.bpm ?? 120,
            key: b.key || "Am",
            tag: null as Tag | null,
            audio: `${apiUrl}/beats/${id}/stream/preview`,
            price: b.priceCents / 100,
            licenseTypeId: b.licenseTypeId,
            coverUrl: b.coverUrl ?? null,
          },
        ];
      });
      setBeats(mapped);
      setErrorBeats(null);
    } catch {
      setBeats([]);
      setErrorBeats("Impossible de charger le catalogue");
    } finally {
      setIsLoadingBeats(false);
    }
  }, []);

  useEffect(() => {
    loadBeats();
  }, [loadBeats]);

  // hydrate favoris si connecté
  useEffect(() => {
    if (!user) {
      setFavIds([]);
      return;
    }
    fetchFavorites()
      .then((items) => setFavIds(items.map((f) => f.beatId)))
      .catch(() => setFavIds([]));
  }, [user]);

  /* debounce query */
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  /* init from URL once */
  useEffect(() => {
    if (!searchParams) return;
    const q = searchParams.get("q") ?? "";
    const g = searchParams.get("genres")?.split(",").filter(Boolean) ?? [];
    const k = searchParams.get("keys")?.split(",").filter(Boolean) ?? [];
    const bpmMinUrl = parseInt(searchParams.get("bpmMin") || "", 10);
    const tag = (searchParams.get("tag") as Tag) || null;
    const s = (searchParams.get("sort") as (typeof SORTS)[number]) || "Pertinence";
    const v = (searchParams.get("view") as ViewMode) || "grid";
    const pageUrl = parseInt(searchParams.get("page") || "1", 10);

    setQuery(q);
    setDebounced(q);
    setSelectedGenres(g);
    setSelectedKeys(k);
    if (!Number.isNaN(bpmMinUrl)) {
      const initialStart = Math.max(BPM_MIN, Math.min(BPM_MAX - BPM_RANGE_SIZE, bpmMinUrl));
      setBpmStart(initialStart);
      setBpmFilterActive(true);
    }
    setSelectedTag(tag);
    setSort(s);
    setViewMode(v);
    if (!Number.isNaN(pageUrl) && pageUrl > 1) setCurrentPage(pageUrl);
  }, [searchParams]); // mount only

  /* sync URL */
  const lastQSRef = useRef("");
  useEffect(() => {
    const p = new URLSearchParams();
    if (debounced) p.set("q", debounced);
    if (selectedGenres.length) p.set("genres", selectedGenres.join(","));
    if (selectedKeys.length) p.set("keys", selectedKeys.join(","));
    if (bpmFilterActive) p.set("bpmMin", String(bpmMin));
    if (selectedTag) p.set("tag", selectedTag);
    p.set("sort", sort);
    p.set("view", viewMode);
    if (currentPage > 1) p.set("page", String(currentPage));
    const qs = p.toString();
    if (qs !== lastQSRef.current) {
      lastQSRef.current = qs;
      router.replace(qs ? `?${qs}` : "?", { scroll: false });
    }
  }, [debounced, selectedGenres, selectedKeys, bpmFilterActive, bpmMin, selectedTag, sort, viewMode, currentPage, router]);

  /* reset page on filter change */
  useEffect(() => setCurrentPage(1), [debounced, selectedGenres, selectedKeys, bpmFilterActive, bpmMin, selectedTag, sort, viewMode]);

  // remonter en haut quand la page change (peu importe la direction)
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  /* filtering */
  const filtered = useMemo(() => {
    return beats.filter((b) => {
      const mQ =
        !debounced ||
        b.name.toLowerCase().includes(debounced.toLowerCase()) ||
        b.artist.toLowerCase().includes(debounced.toLowerCase()) ||
        b.genre.toLowerCase().includes(debounced.toLowerCase());
      const mG = selectedGenres.length ? selectedGenres.includes(b.genre) : true;
      const mK = selectedKeys.length ? selectedKeys.includes(b.key) : true;
      const mT = selectedTag ? b.tag === selectedTag : true;
      const mB = bpmFilterActive ? (b.bpm >= bpmMin && b.bpm <= bpmMax) : true;
      return mQ && mG && mK && mT && mB;
    });
  }, [beats, debounced, selectedGenres, selectedKeys, selectedTag, bpmFilterActive, bpmMin, bpmMax]);

  /* sort */
  const sorted = useMemo(() => {
    switch (sort) {
      case "Prix ↑":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "Prix ↓":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "BPM ↑":
        return [...filtered].sort((a, b) => a.bpm - b.bpm);
      case "BPM ↓":
        return [...filtered].sort((a, b) => b.bpm - a.bpm);
      default:
        return filtered;
    }
  }, [filtered, sort]);

  /* pagination */
  const lastIndex = currentPage * pageSize;
  const currentBeats = sorted.slice(lastIndex - pageSize, lastIndex);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  /* catalogue vraiment vide (aucun beat, aucun filtre actif) */
  const hasActiveFilters =
    debounced.trim() !== "" ||
    query.trim() !== "" ||
    selectedGenres.length > 0 ||
    selectedKeys.length > 0 ||
    bpmFilterActive ||
    selectedTag !== null;
  const isCatalogueEmpty = !isLoadingBeats && !errorBeats && beats.length === 0 && !hasActiveFilters;

  /* queue -> global player */
  const lastQueueKey = useRef("");
  useEffect(() => {
    const key = currentBeats.map((b) => b.id).join("-");
    if (key !== lastQueueKey.current) {
      lastQueueKey.current = key;
      setQueue(currentBeats);
    }
  }, [currentBeats, setQueue]);

  const toggleInArray = (val: string, arr: string[], set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const resetFilters = () => {
    setSelectedGenres([]);
    setSelectedKeys([]);
    setBpmFilterActive(false);
    setSelectedTag(null);
    setQuery("");
    setDebounced("");
  };

  const handleBpmStartChange = useCallback(
    (value: number) => {
      // Clamp pour que la zone reste dans les limites
      const clamped = Math.max(BPM_MIN, Math.min(BPM_MAX - BPM_RANGE_SIZE, value));
      setBpmStart(clamped);
      setBpmFilterActive(true); // Active le filtre dès qu'on interagit
    },
    []
  );

  const onPlay = useCallback(
    (b: Beat) => (track?.id === b.id && isPlaying ? toggle() : play(b, currentBeats)),
    [track?.id, isPlaying, toggle, play, currentBeats]
  );
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const onAddToCart = async (b: Beat) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (cartItems.some((item) => String(item.id) === String(b.id))) {
      setToast(`« ${b.name} » est déjà dans ton panier`);
      return;
    }
    const added = await addItem({ id: b.id, name: b.name, price: b.price, licenseTypeId: b.licenseTypeId });
    setToast(added ? `« ${b.name} » ajouté au panier` : "Impossible d'ajouter ce beat pour le moment, réessaie.");
  };

  const onToggleFav = useCallback(
    async (beatId: string) => {
      if (!user) {
        setShowAuthModal(true);
        return;
      }
      await toggleFavoriteApi(beatId);
      setFavIds((prev) => (prev.includes(beatId) ? prev.filter((id) => id !== beatId) : [...prev, beatId]));
    },
    [user]
  );

  const FiltersBlocks = () => (
    <>
      <div className="rounded-2xl border border-white/10 bg-brand-card/80 p-4 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <SectionTitle>Genres</SectionTitle>
          {selectedGenres.length > 0 && (
            <button className="text-xs text-zinc-400 hover:text-zinc-200" onClick={() => setSelectedGenres([])}>
              Effacer
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {GENRES.map((g) => (
            <Chip
              key={g}
              active={selectedGenres.includes(g)}
              onClick={() => toggleInArray(g, selectedGenres, setSelectedGenres)}
              className="h-8 justify-start truncate px-3 text-xs"
            >
              {g}
            </Chip>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-brand-card/80 p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <SectionTitle>Tonalites</SectionTitle>
          {selectedKeys.length > 0 && (
            <button className="text-xs text-zinc-400 hover:text-zinc-200" onClick={() => setSelectedKeys([])}>
              Effacer
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {KEYS.map((k) => (
            <Chip key={k} active={selectedKeys.includes(k)} onClick={() => toggleInArray(k, selectedKeys, setSelectedKeys)} className="justify-center px-2 py-1 text-xs">
              {k}
            </Chip>
          ))}
        </div>
      </div>

      <ZoneSlider
        min={BPM_MIN}
        max={BPM_MAX}
        rangeSize={BPM_RANGE_SIZE}
        value={bpmStart}
        onChange={handleBpmStartChange}
        isActive={bpmFilterActive}
        onToggleActive={() => setBpmFilterActive(false)}
      />
    </>
  );

  /* --------------------------------- render -------------------------------- */

  return (
    <div className="relative min-h-screen text-white pt-24 pb-40">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-screen-2xl px-4 xs:px-5 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-white/10 bg-brand-card/80 p-6 backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,.35)]">
          <div className="text-2xl font-bold tracking-tight">Catalogue</div>
          <div className="mt-1 text-sm text-zinc-300">{sorted.length} résultats • {GENRES.length} genres • vue {viewMode === "grid" ? "grille" : "tableau"}</div>
        </div>

        {/* tools sticky (masqué si le catalogue est vide) */}
        {!isCatalogueEmpty && (
        <div className="mt-6 sticky top-20 z-40 rounded-2xl border border-white/10 bg-brand-card/80 p-4 backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="inline-flex items-center gap-2 text-sm text-zinc-400">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden xs:inline">Filtres rapides</span>
              <span className="xs:hidden">Filtres</span>
            </div>
            {/* Badges icônes: Tendance, Nouveaux, Populaire */}
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1">
              <Chip active={selectedTag === "Tendance"} onClick={() => setSelectedTag(selectedTag === "Tendance" ? null : "Tendance")} className="shrink-0 min-h-[40px] px-4 text-sm font-medium sm:min-h-0 sm:px-3">
                <Flame className="h-3.5 w-3.5 text-orange-400" /> Top
              </Chip>
              <Chip active={selectedTag === "Nouveau"} onClick={() => setSelectedTag(selectedTag === "Nouveau" ? null : "Nouveau")} className="shrink-0 min-h-[40px] px-4 text-sm font-medium sm:min-h-0 sm:px-3">
                <Star className="h-3.5 w-3.5 text-yellow-300" /> Nouveaux
              </Chip>
              <Chip active={selectedTag === "Populaire"} onClick={() => setSelectedTag(selectedTag === "Populaire" ? null : "Populaire")} className="shrink-0 min-h-[40px] px-4 text-sm font-medium sm:min-h-0 sm:px-3">
                <Crown className="h-3.5 w-3.5 text-amber-300" /> Populaire
              </Chip>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <Chip
                active={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
                className={`min-h-[40px] px-4 text-sm sm:min-h-0 sm:px-3 ${viewMode === "grid" ? "bg-brand font-semibold text-white hover:bg-brand-hover" : "font-medium"}`}
              >
                <Grid3X3 className="h-3.5 w-3.5" /> Grille
              </Chip>
              <Chip
                active={viewMode === "table"}
                onClick={() => setViewMode("table")}
                className={`min-h-[40px] px-4 text-sm sm:min-h-0 sm:px-3 ${viewMode === "table" ? "bg-brand font-semibold text-white hover:bg-brand-hover" : "font-medium"}`}
              >
                <Rows3 className="h-3.5 w-3.5" /> Tableau
              </Chip>

              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
                  className="appearance-none rounded-full border border-white/[0.08] bg-white/[0.04] px-4 pr-7 h-[34px] text-sm text-zinc-200 outline-none text-center leading-none"
                >
                  {SORTS.map((s) => (
                    <option key={s} value={s} className="text-center">
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>
          </div>

          {/* search */}
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tape un artiste, un genre…"
              className="rounded-2xl py-3 pl-11"
            />
          </div>
        </div>
        )}
      </motion.div>

      {/* content */}
      <div className="container mx-auto mt-8 max-w-screen-2xl px-4 xs:px-5 sm:px-6 lg:px-8">
        {isCatalogueEmpty ? (
          <div className="relative flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-brand-card/80 px-6 py-24 text-center backdrop-blur-xl">
            <h2 className="text-3xl font-bold uppercase tracking-tight text-white sm:text-5xl">LES PRODS ARRIVENT</h2>
            <p className="mt-4 max-w-md text-sm text-zinc-300">
              Le catalogue se remplit. En attendant, fais créer ton son sur mesure par nos beatmakers.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <ButtonLink href="/web/prodsurmesure" size="lg">
                PROD SUR MESURE
              </ButtonLink>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-12 lg:hidden">
            <div className="space-y-3">
              <details className="group rounded-2xl border border-white/10 bg-brand-card/80 backdrop-blur-xl">
                <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm text-zinc-200">
                  <span>Filtres</span>
                  <ChevronDown className="h-4 w-4 text-zinc-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 space-y-3">
                  <FiltersBlocks />
                  {selectedGenres.length || selectedKeys.length || bpmFilterActive || selectedTag ? (
                    <Button variant="outline" fullWidth onClick={resetFilters}>
                  Réinitialiser tous les filtres
                </Button>
                  ) : null}
                </div>
              </details>
            </div>
          </section>
          {/* filters */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              <FiltersBlocks />
              {selectedGenres.length || selectedKeys.length || bpmFilterActive || selectedTag ? (
                <Button variant="outline" fullWidth onClick={resetFilters}>
                  Réinitialiser tous les filtres
                </Button>
              ) : null}
            </div>
          </aside>

          {/* list + header de résultats */}
          <section className="lg:col-span-9">
            <div className="mb-3 flex items-center justify-between text-sm text-zinc-400">
              <span>{sorted.length} résultats</span>
            </div>
            {isLoadingBeats ? (
              <ListSkeleton count={12} />
            ) : errorBeats ? (
              <div
                role="alert"
                className="flex flex-col items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10 px-6 py-16 text-center"
              >
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white">Le son a coupé</h3>
                <p className="mt-2 max-w-sm text-sm text-zinc-300">
                  Impossible de charger les beats pour le moment. Relance, ça repart.
                </p>
                <button
                  type="button"
                  onClick={loadBeats}
                  className="mt-6 rounded-full bg-brand px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-hover"
                >
                  RÉESSAYER
                </button>
              </div>
            ) : sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white">Aucun résultat</h3>
                <p className="mt-2 max-w-sm text-sm text-zinc-300">
                  Rien ne colle à ta recherche. Élargis tes filtres et trouve ton prochain son.
                </p>
                <Button className="mt-6" onClick={resetFilters}>
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
            <AnimatePresence mode="popLayout">
              {viewMode === "grid" ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                >
                  {currentBeats.map((b) => (
                    <BeatCard
                      key={b.id}
                      id={b.id}
                      name={b.name}
                      artist={b.artist}
                      genre={b.genre}
                      bpm={b.bpm}
                      keySig={b.key}
                      price={b.price}
                      tag={b.tag ?? undefined}
                      isCurrent={track?.id === b.id}
                      isPlaying={isPlaying}
                      onPlayPause={() => onPlay(b)}
                      isFav={favIds.includes(String(b.id))}
                      onAdd={() => onAddToCart(b)}
                      onFav={() => onToggleFav(String(b.id))}
                      coverUrl={b.coverUrl}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="table"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="overflow-x-auto sm:overflow-hidden rounded-2xl border border-white/10"
                >
                  <table className="w-full text-sm table-fixed max-sm:min-w-[720px]">
                    <thead className="bg-white/5 text-zinc-300">
                      <tr>
                        <th className="px-4 py-3 text-left w-[40%]">Titre</th>
                        <th className="px-4 py-3 w-[14%] text-center">Genre</th>
                        <th className="px-4 py-3 w-[8%]">BPM</th>
                        <th className="px-4 py-3 w-[8%]">Gamme</th>
                        <th className="px-4 py-3 text-center w-[10%]">Prix</th>
                        <th className="px-4 py-3 text-center w-[8%]">Tag</th>
                        <th className="px-4 py-3 text-center w-[20%]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {currentBeats.map((b) => (
                        <BeatTableRow
                          key={b.id}
                          id={b.id}
                          name={b.name}
                          artist={b.artist}
                          genre={b.genre}
                          bpm={b.bpm}
                          keySig={b.key}
                      price={b.price}
                      tagIcon={b.tag === "Tendance" ? "top" : b.tag === "Nouveau" ? "new" : b.tag === "Populaire" ? "popular" : null}
                      isCurrent={track?.id === b.id}
                      isPlaying={isPlaying}
                      onPlayPause={() => onPlay(b)}
                      onAdd={() => onAddToCart(b)}
                      onFav={() => onToggleFav(String(b.id))}
                    />
                  ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
            )}

            {/* pagination */}
            {!isLoadingBeats && !errorBeats && sorted.length > 0 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button variant="secondary" size="sm"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                }}>
                Précédent
              </Button>
              <div className="text-sm text-zinc-400">
                Page {currentPage} sur {totalPages}
              </div>
              <Button variant="secondary" size="sm"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                }}>
                Suivant
              </Button>
            </div>
            )}
          </section>
        </div>
        )}
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-brand-card px-5 py-2.5 text-sm shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <AuthRequiredModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => {
          setShowAuthModal(false);
          router.push("/web/profil?mode=login&next=/web/catalogue");
        }}
        message="Connecte-toi pour ajouter des beats au panier et les retrouver dans tes favoris."
      />
    </div>
  );
}

export default function CataloguePage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen px-4 pt-24 text-white">
            <div className="container mx-auto max-w-screen-2xl">
              <ListSkeleton count={12} />
            </div>
          </div>
        }
      >
        <CatalogueContent />
      </Suspense>
    </>
  );
}
