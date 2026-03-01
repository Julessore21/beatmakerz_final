"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getBeatCover } from "@/lib/genre-cover";

type Artist = {
  _id: string;
  name: string;
  verified?: boolean;
};

type Asset = {
  _id: string;
  type: "preview" | "mp3" | "wav" | "stems" | "project";
  storageKey: string;
};

type AdminBeat = {
  _id: string;
  artistId: string;
  title: string;
  bpm?: number;
  key?: string;
  genres?: string[];
  moods?: string[];
  status?: "draft" | "published";
  visibility?: "public" | "unlisted";
  coverUrl?: string;
  artist?: Artist;
  assets?: Asset[];
  updatedAt?: string;
};

type FormState = {
  id: string;
  artistId: string;
  title: string;
  bpm: string;
  key: string;
  genres: string[];
  moods: string[];
  status: "draft" | "published";
  visibility: "public" | "unlisted";
};

// Preset options
const GENRE_OPTIONS = ["Trap", "Drill", "Hip-Hop", "R&B", "Pop", "Afrobeat", "Reggaeton", "Boom Bap", "Lo-Fi", "Jersey", "Dancehall", "Amapiano", "Soul", "Jazz", "Electro", "Phonk", "Cloud Rap", "Plugg"];
const MOOD_OPTIONS = ["Dark", "Chill", "Energetic", "Sad", "Happy", "Aggressive", "Dreamy", "Melancholic", "Hype", "Romantic", "Motivational", "Ethereal", "Hard", "Smooth", "Vibey", "Nostalgic"];
const BPM_PRESETS = [70, 80, 85, 90, 95, 100, 105, 110, 120, 130, 140, 150, 160, 170, 180];
const KEY_OPTIONS = {
  minor: ["Am", "Bm", "Cm", "Dm", "Em", "Fm", "Gm", "A#m", "C#m", "D#m", "F#m", "G#m"],
  major: ["A", "B", "C", "D", "E", "F", "G", "A#", "C#", "D#", "F#", "G#"],
};

const initialFormState: FormState = {
  id: "",
  artistId: "5138a0fa-def1-4330-b668-3efd949b8485",
  title: "",
  bpm: "",
  key: "",
  genres: [],
  moods: [],
  status: "draft",
  visibility: "public",
};

// Popover component for single-select pickers
function Popover({
  open,
  onClose,
  children,
  className = "",
  triggerRef
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      // Ignore clicks on the trigger button (toggle is handled by button itself)
      if (triggerRef?.current?.contains(target)) {
        return;
      }
      // Close if click is outside the popover
      if (ref.current && !ref.current.contains(target)) {
        onClose();
      }
    };
    // Small delay to avoid catching the opening click
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClick);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClick);
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`absolute z-[100] mt-1 rounded-xl border border-white/10 bg-[#0c0c18] p-2.5 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

// Chip button component
function Chip({ active, onClick, children, size = "sm" }: { active?: boolean; onClick?: () => void; children: React.ReactNode; size?: "sm" | "md" }) {
  const sizeClasses = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border transition-all ${sizeClasses} ${
        active
          ? "border-indigo-400 bg-indigo-500/30 text-white"
          : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/30 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

export default function AdminCataloguePage() {
  const [beats, setBeats] = useState<AdminBeat[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Single popover state - only one open at a time
  const [openPopover, setOpenPopover] = useState<"artist" | "bpm" | "key" | "genres" | "moods" | null>(null);
  const [customBpm, setCustomBpm] = useState("");

  // Toggle popover - closes others automatically
  const togglePopover = (name: typeof openPopover) => {
    setOpenPopover((prev) => (prev === name ? null : name));
  };
  const closePopover = () => setOpenPopover(null);

  // Refs for trigger buttons (to handle click outside properly)
  const artistBtnRef = useRef<HTMLButtonElement>(null);
  const bpmBtnRef = useRef<HTMLButtonElement>(null);
  const keyBtnRef = useRef<HTMLButtonElement>(null);
  const genresBtnRef = useRef<HTMLButtonElement>(null);
  const moodsBtnRef = useRef<HTMLButtonElement>(null);

  // Helper pour ajouter le token aux requêtes
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const loadBeats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/beats", {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Impossible de charger les beats.");
      const data = (await res.json()) as AdminBeat[];
      setBeats(data);
    } catch (err) {
      console.error(err);
      setBeats([]);
      setError("Les beats n&apos;ont pas pu être chargés.");
    } finally {
      setLoading(false);
    }
  };

  const loadArtists = async () => {
    try {
      const res = await fetch("/api/admin/artists", {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Impossible de charger les artistes.");
      const data = (await res.json()) as Artist[];
      setArtists(data);
    } catch (err) {
      console.error(err);
      setArtists([
        {
          _id: "5138a0fa-def1-4330-b668-3efd949b8485",
          name: "BeatMaster",
          verified: true,
        },
      ]);
    }
  };

  useEffect(() => {
    loadBeats();
    loadArtists();
  }, []);

  const resetForm = () => {
    setForm(initialFormState);
    setAudioFile(null);
    setCoverFile(null);
    setCoverPreview(null);
    setError(null);
    setInfo(null);
  };

  const handleSelectBeat = (beat: AdminBeat) => {
    setForm({
      id: beat._id,
      artistId: beat.artistId,
      title: beat.title,
      bpm: beat.bpm ? String(beat.bpm) : "",
      key: beat.key || "",
      genres: beat.genres || [],
      moods: beat.moods || [],
      status: beat.status || "draft",
      visibility: beat.visibility || "public",
    });
    setCoverFile(null);
    setCoverPreview(beat.coverUrl || null);
    setError(null);
    setInfo(null);
  };

  const uploadCoverForBeat = async (beatId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const token = sessionStorage.getItem("access_token");
    const res = await fetch(`/api/admin/beats/${beatId}/cover`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
      credentials: "include",
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Upload cover échoué" }));
      throw new Error(errorData.error || "Upload cover échoué");
    }
    return await res.json();
  };

  const uploadAudioForBeat = async (beatId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = sessionStorage.getItem("access_token");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://beatmakerz-api.onrender.com";
      const res = await fetch(`${apiUrl}/beats/${beatId}/upload-audio`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Upload audio échoué" }));
        throw new Error(errorData.error || "Upload audio échoué");
      }

      return await res.json();
    } catch (err: unknown) {
      console.error(err);
      throw new Error((err as Error).message || "L&apos;upload de l&apos;audio n&apos;a pas pu être réalisé.");
    }
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Le titre est obligatoire.";
    if (!form.artistId) return "L&apos;artiste est obligatoire.";
    return null;
  };

  const handleSave = async () => {
    setError(null);
    setInfo(null);
    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const payload = {
      artistId: form.artistId,
      title: form.title.trim(),
      bpm: form.bpm ? Number(form.bpm) : undefined,
      key: form.key.trim() || undefined,
      genres: form.genres,
      moods: form.moods,
      status: form.status,
      visibility: form.visibility,
    };

    try {
      setSaving(true);

      // Étape 1: Créer ou mettre à jour le beat
      const method = form.id ? "PUT" : "POST";
      const path = form.id ? `/api/admin/beats/${form.id}` : "/api/admin/beats";
      const res = await fetch(path, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Impossible d&apos;enregistrer le beat.");
      }
      const savedBeat = await res.json();

      // Étape 2: Upload cover si sélectionnée
      if (coverFile && savedBeat._id) {
        setInfo("Cover en cours d'upload...");
        const coverResult = await uploadCoverForBeat(savedBeat._id, coverFile);
        setCoverPreview(coverResult.coverUrl || null);
        setCoverFile(null);
      }

      // Étape 3: Si un fichier audio est sélectionné, l'uploader
      if (audioFile && savedBeat._id) {
        setInfo(`Beat créé! Upload audio en cours... (${(audioFile.size / 1024 / 1024).toFixed(2)} MB)`);
        await uploadAudioForBeat(savedBeat._id, audioFile);
        setInfo("Beat créé et audio uploadé avec succès! Preview générée automatiquement.");
      } else {
        setInfo(coverFile ? "Beat et cover enregistrés." : "Beat enregistré avec succès.");
      }

      await loadBeats();

      // Mettre à jour le formulaire avec le beat créé
      if (!form.id) {
        setForm((prev) => ({ ...prev, id: savedBeat._id }));
      }

      // Reset le fichier audio après upload
      setAudioFile(null);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce beat ?")) return;
    try {
      const res = await fetch(`/api/admin/beats/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Suppression impossible.");
      await loadBeats();
      if (form.id === id) resetForm();
      setInfo("Beat supprimé.");
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer le beat.");
    }
  };

  const handleToggleStatus = async (beat: AdminBeat) => {
    const nextStatus = beat.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/beats/${beat._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: nextStatus }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Impossible de changer le statut.");
      await loadBeats();
      setInfo(`Beat ${nextStatus === "published" ? "publié" : "remis en brouillon"}.`);
    } catch (err) {
      console.error(err);
      setError("Changement de statut impossible.");
    }
  };

  const statusLabel = (status: AdminBeat["status"]) => {
    if (status === "published") return "Publié";
    if (status === "draft") return "Brouillon";
    return "Inconnu";
  };

  const currentBeat = beats.find((b) => b._id === form.id);
  const selectedArtist = artists.find((a) => a._id === form.artistId);

  const toggleGenre = (genre: string) => {
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre) ? prev.genres.filter((g) => g !== genre) : [...prev.genres, genre],
    }));
  };

  const toggleMood = (mood: string) => {
    setForm((prev) => ({
      ...prev,
      moods: prev.moods.includes(mood) ? prev.moods.filter((m) => m !== mood) : [...prev.moods, mood],
    }));
  };

  return (
    <div className="min-h-screen bg-[#040410] text-white px-4 pt-24 pb-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Admin</p>
            <h1 className="text-2xl font-semibold">Catalogue</h1>
          </div>
        </header>

        {/* Form Section - Compact */}
        <section className="relative z-10 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">Beat / Métadonnées</h2>
            <button
              onClick={resetForm}
              className="rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-zinc-400 transition hover:border-white/40"
            >
              Nouveau
            </button>
          </div>
          {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
          {info && <p className="mb-2 text-xs text-emerald-400">{info}</p>}

          <div className="space-y-3">
            {/* Row 1: Title + Artist */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-zinc-400">Titre</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#08080f]/70 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="Titre du beat"
                />
              </div>
              <div className="relative">
                <label className="text-xs font-medium text-zinc-400">Artiste</label>
                <button
                  ref={artistBtnRef}
                  type="button"
                  onClick={() => togglePopover("artist")}
                  className="mt-1 flex w-full items-center justify-between rounded-lg border border-white/10 bg-[#08080f]/70 px-3 py-2 text-sm text-white transition hover:border-white/30"
                >
                  <span>{selectedArtist?.name || "Sélectionner"} {selectedArtist?.verified ? "✓" : ""}</span>
                  <span className="text-zinc-400">▾</span>
                </button>
                <Popover open={openPopover === "artist"} onClose={closePopover} triggerRef={artistBtnRef} className="left-0 right-0 max-h-48 overflow-y-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {artists.map((artist) => (
                      <Chip
                        key={artist._id}
                        active={form.artistId === artist._id}
                        onClick={() => {
                          setForm((prev) => ({ ...prev, artistId: artist._id }));
                          closePopover();
                        }}
                      >
                        {artist.name} {artist.verified ? "✓" : ""}
                      </Chip>
                    ))}
                  </div>
                </Popover>
              </div>
            </div>

            {/* Row 2: BPM, Key, Status, Visibility */}
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              <div className="relative">
                <label className="text-xs font-medium text-zinc-400">BPM</label>
                <button
                  ref={bpmBtnRef}
                  type="button"
                  onClick={() => togglePopover("bpm")}
                  className="mt-1 flex w-full items-center justify-between rounded-lg border border-white/10 bg-[#08080f]/70 px-3 py-2 text-sm text-white transition hover:border-white/30"
                >
                  <span>{form.bpm || "—"}</span>
                  <span className="text-zinc-400">▾</span>
                </button>
                <Popover open={openPopover === "bpm"} onClose={closePopover} triggerRef={bpmBtnRef} className="left-0 w-64">
                  <div className="grid grid-cols-5 gap-1.5">
                    {BPM_PRESETS.map((bpm) => (
                      <Chip
                        key={bpm}
                        active={form.bpm === String(bpm)}
                        onClick={() => {
                          setForm((prev) => ({ ...prev, bpm: String(bpm) }));
                          closePopover();
                        }}
                      >
                        {bpm}
                      </Chip>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
                    <input
                      type="number"
                      min={40}
                      max={220}
                      value={customBpm}
                      onChange={(e) => setCustomBpm(e.target.value)}
                      placeholder="Custom"
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customBpm) {
                          setForm((prev) => ({ ...prev, bpm: customBpm }));
                          setCustomBpm("");
                          closePopover();
                        }
                      }}
                      className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-400"
                    >
                      OK
                    </button>
                  </div>
                </Popover>
              </div>

              {/* Key Picker */}
              <div className="relative">
                <label className="text-xs font-medium text-zinc-400">Clé</label>
                <button
                  ref={keyBtnRef}
                  type="button"
                  onClick={() => togglePopover("key")}
                  className="mt-1 flex w-full items-center justify-between rounded-lg border border-white/10 bg-[#08080f]/70 px-3 py-2 text-sm text-white transition hover:border-white/30"
                >
                  <span>{form.key || "—"}</span>
                  <span className="text-zinc-400">▾</span>
                </button>
                <Popover open={openPopover === "key"} onClose={closePopover} triggerRef={keyBtnRef} className="left-0 w-72">
                  <div className="space-y-2">
                    <div>
                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-zinc-500">Mineur</p>
                      <div className="flex flex-wrap gap-1">
                        {KEY_OPTIONS.minor.map((k) => (
                          <Chip key={k} active={form.key === k} onClick={() => { setForm((prev) => ({ ...prev, key: k })); closePopover(); }}>{k}</Chip>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-zinc-500">Majeur</p>
                      <div className="flex flex-wrap gap-1">
                        {KEY_OPTIONS.major.map((k) => (
                          <Chip key={k} active={form.key === k} onClick={() => { setForm((prev) => ({ ...prev, key: k })); closePopover(); }}>{k}</Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                </Popover>
              </div>

              {/* Status inline */}
              <div>
                <label className="text-xs font-medium text-zinc-400">Statut</label>
                <div className="mt-1 flex gap-1">
                  <Chip active={form.status === "draft"} onClick={() => setForm((prev) => ({ ...prev, status: "draft" }))}>Draft</Chip>
                  <Chip active={form.status === "published"} onClick={() => setForm((prev) => ({ ...prev, status: "published" }))}>Publié</Chip>
                </div>
              </div>

              {/* Visibility inline */}
              <div>
                <label className="text-xs font-medium text-zinc-400">Visibilité</label>
                <div className="mt-1 flex gap-1">
                  <Chip active={form.visibility === "public"} onClick={() => setForm((prev) => ({ ...prev, visibility: "public" }))}>Public</Chip>
                  <Chip active={form.visibility === "unlisted"} onClick={() => setForm((prev) => ({ ...prev, visibility: "unlisted" }))}>Unlisted</Chip>
                </div>
              </div>
            </div>

            {/* Row 3: Genres + Moods inline */}
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Genres */}
              <div className="relative">
                <label className="text-xs font-medium text-zinc-400">Genres</label>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  {form.genres.map((genre) => (
                    <Chip key={genre} active onClick={() => toggleGenre(genre)}>{genre} ✕</Chip>
                  ))}
                  <button ref={genresBtnRef} type="button" onClick={() => togglePopover("genres")} className="rounded-full border border-dashed border-white/20 px-2 py-0.5 text-[10px] text-zinc-400 hover:border-white/40">+</button>
                </div>
                <Popover open={openPopover === "genres"} onClose={closePopover} triggerRef={genresBtnRef} className="left-0 right-0 mt-1">
                  <div className="flex flex-wrap gap-1">
                    {GENRE_OPTIONS.map((genre) => (
                      <Chip key={genre} active={form.genres.includes(genre)} onClick={() => toggleGenre(genre)}>{genre}</Chip>
                    ))}
                  </div>
                </Popover>
              </div>

              {/* Moods */}
              <div className="relative">
                <label className="text-xs font-medium text-zinc-400">Moods</label>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  {form.moods.map((mood) => (
                    <Chip key={mood} active onClick={() => toggleMood(mood)}>{mood} ✕</Chip>
                  ))}
                  <button ref={moodsBtnRef} type="button" onClick={() => togglePopover("moods")} className="rounded-full border border-dashed border-white/20 px-2 py-0.5 text-[10px] text-zinc-400 hover:border-white/40">+</button>
                </div>
                <Popover open={openPopover === "moods"} onClose={closePopover} triggerRef={moodsBtnRef} className="left-0 right-0 mt-1">
                  <div className="flex flex-wrap gap-1">
                    {MOOD_OPTIONS.map((mood) => (
                      <Chip key={mood} active={form.moods.includes(mood)} onClick={() => toggleMood(mood)}>{mood}</Chip>
                    ))}
                  </div>
                </Popover>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="text-xs font-medium text-zinc-400">Cover</label>
              <div className="mt-1 flex items-center gap-3">
                {/* Preview */}
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                  {(() => {
                    const img = coverPreview || getBeatCover(null, form.genres);
                    return img ? (
                      <img src={img} alt="cover" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-600 text-xs">—</div>
                    );
                  })()}
                </div>
                <label className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border border-dashed border-zinc-600/50 bg-white/3 py-2 px-3 transition hover:border-zinc-500/70 hover:bg-white/5">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCoverFile(file);
                        setCoverPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <div className="text-center">
                    {coverFile ? (
                      <p className="text-xs font-medium text-zinc-300">{coverFile.name}</p>
                    ) : (
                      <p className="text-xs text-zinc-500">Choisir une image <span className="text-zinc-600">JPG / PNG / WEBP</span></p>
                    )}
                  </div>
                </label>
                {coverFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setCoverFile(null);
                      const currentBeatCover = beats.find((b) => b._id === form.id)?.coverUrl;
                      setCoverPreview(currentBeatCover || null);
                    }}
                    className="text-xs text-zinc-500 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Audio File Upload */}
            <div>
              <label className="text-xs font-medium text-zinc-400">Fichier Audio</label>
              <div className="mt-1">
                <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-indigo-500/30 bg-indigo-500/5 py-3 px-4 transition hover:border-indigo-500/50 hover:bg-indigo-500/10">
                  <input
                    type="file"
                    className="hidden"
                    accept="audio/mp3,audio/mpeg,.mp3"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAudioFile(file);
                        setInfo(`Fichier sélectionné: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
                      }
                    }}
                  />
                  <div className="text-center">
                    {audioFile ? (
                      <div>
                        <p className="text-sm font-medium text-indigo-300">{audioFile.name}</p>
                        <p className="text-[10px] text-zinc-500 mt-1">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-indigo-300">Choisir un fichier audio</p>
                        <p className="text-[10px] text-zinc-500 mt-1">MP3 uniquement • La preview (45s) sera générée automatiquement</p>
                      </div>
                    )}
                  </div>
                </label>
                {audioFile && (
                  <button
                    onClick={() => {
                      setAudioFile(null);
                      setInfo(null);
                    }}
                    className="mt-1 text-xs text-zinc-400 hover:text-white"
                  >
                    Supprimer le fichier
                  </button>
                )}
              </div>
            </div>

            {/* Submit buttons inline */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:bg-indigo-400 disabled:cursor-wait disabled:opacity-60"
              >
                {saving ? "Enregistrement..." : (form.id ? "Mettre à jour" : "Créer")}
              </button>
              {form.id && (
                <button onClick={resetForm} className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/60 hover:border-white/40">
                  Annuler
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Backstage Table - Compact */}
        <section className="relative z-0 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">Backstage</h2>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">{loading ? "..." : `${beats.length} beats`}</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-xs">
              <thead className="bg-white/5 text-zinc-400">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Titre</th>
                  <th className="px-3 py-2 text-left font-medium">Artiste</th>
                  <th className="px-3 py-2 text-center font-medium">Statut</th>
                  <th className="px-3 py-2 text-center font-medium">C</th>
                  <th className="px-3 py-2 text-center font-medium">P</th>
                  <th className="px-3 py-2 text-center font-medium">M</th>
                  <th className="px-3 py-2 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#03030a] text-zinc-300">
                {beats.map((beat) => (
                  <tr key={beat._id} className="hover:bg-white/5 cursor-pointer" onClick={() => handleSelectBeat(beat)}>
                    <td className="px-3 py-2 font-medium text-white">{beat.title}</td>
                    <td className="px-3 py-2 text-zinc-400">{beat.artist?.name || "—"}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`text-[10px] ${beat.status === "published" ? "text-emerald-400" : "text-zinc-500"}`}>
                        {beat.status === "published" ? "●" : "○"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {beat.coverUrl
                        ? <span className="text-emerald-400">✓</span>
                        : getBeatCover(null, beat.genres || [])
                          ? <span className="text-zinc-400 text-[9px]">auto</span>
                          : <span className="text-zinc-600">—</span>
                      }
                    </td>
                    <td className="px-3 py-2 text-center">{beat.assets?.find((a) => a.type === "preview") ? <span className="text-emerald-400">✓</span> : <span className="text-zinc-600">—</span>}</td>
                    <td className="px-3 py-2 text-center">{beat.assets?.find((a) => a.type === "mp3") ? <span className="text-emerald-400">✓</span> : <span className="text-zinc-600">—</span>}</td>
                    <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleToggleStatus(beat)} className="rounded px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-white/10 hover:text-white">
                          {beat.status === "published" ? "↓" : "↑"}
                        </button>
                        <button onClick={() => handleDelete(beat._id)} className="rounded px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-rose-500/20 hover:text-rose-400">✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {beats.length === 0 && (
                  <tr><td colSpan={7} className="px-3 py-4 text-center text-zinc-500">Aucun beat</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
