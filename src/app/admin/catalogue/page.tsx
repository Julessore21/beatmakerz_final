"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
  genres: string;
  moods: string;
  status: "draft" | "published";
  visibility: "public" | "unlisted";
};

const STATUS_OPTIONS: FormState["status"][] = ["draft", "published"];
const VISIBILITY_OPTIONS: FormState["visibility"][] = ["public", "unlisted"];

const initialFormState: FormState = {
  id: "",
  artistId: "5138a0fa-def1-4330-b668-3efd949b8485", // BeatMaster par défaut
  title: "",
  bpm: "",
  key: "",
  genres: "",
  moods: "",
  status: "draft",
  visibility: "public",
};

const splitList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function AdminCataloguePage() {
  const [beats, setBeats] = useState<AdminBeat[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPreview, setUploadingPreview] = useState(false);
  const [uploadingMp3, setUploadingMp3] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const loadBeats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/beats");
      if (!res.ok) throw new Error("Impossible de charger les beats.");
      const data = (await res.json()) as AdminBeat[];
      setBeats(data);
    } catch (err) {
      console.error(err);
      setBeats([]);
      setError("Les beats n'ont pas pu être chargés.");
    } finally {
      setLoading(false);
    }
  };

  const loadArtists = async () => {
    try {
      const res = await fetch("/api/admin/artists");
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
      genres: (beat.genres || []).join(", "),
      moods: (beat.moods || []).join(", "),
      status: beat.status || "draft",
      visibility: beat.visibility || "public",
    });
    setError(null);
    setInfo(null);
  };

  const uploadCover = async (beatId: string, file: File) => {
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/admin/beats/${beatId}/cover`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload cover échoué.");

      const data = await res.json();
      setInfo(`Cover uploadée: ${data.coverUrl}`);
      await loadBeats();
    } catch (err: any) {
      console.error(err);
      setError("L'upload de la cover n'a pas pu être réalisé.");
    } finally {
      setUploadingCover(false);
    }
  };

  const uploadAsset = async (
    beatId: string,
    type: "preview" | "mp3" | "wav" | "stems",
    file: File
  ) => {
    const setUploading = type === "preview" ? setUploadingPreview : setUploadingMp3;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/admin/beats/${beatId}/assets/${type}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Upload ${type} échoué.`);

      const data = await res.json();
      setInfo(`${type.toUpperCase()} uploadé avec succès!`);
      await loadBeats();
    } catch (err: any) {
      console.error(err);
      setError(`L'upload du ${type} n'a pas pu être réalisé.`);
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Le titre est obligatoire.";
    if (!form.artistId) return "L'artiste est obligatoire.";
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
      genres: splitList(form.genres),
      moods: splitList(form.moods),
      status: form.status,
      visibility: form.visibility,
    };

    try {
      setSaving(true);
      const method = form.id ? "PUT" : "POST";
      const path = form.id ? `/api/admin/beats/${form.id}` : "/api/admin/beats";
      const res = await fetch(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Impossible d'enregistrer le beat.");
      }
      const savedBeat = await res.json();
      await loadBeats();
      setInfo("Beat enregistré avec succès. Vous pouvez maintenant uploader des fichiers.");

      // Si c'est un nouveau beat, on met l'ID dans le formulaire pour permettre l'upload
      if (!form.id) {
        setForm((prev) => ({ ...prev, id: savedBeat._id }));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce beat ?")) return;
    try {
      const res = await fetch(`/api/admin/beats/${id}`, { method: "DELETE" });
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
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

  return (
    <div className="min-h-screen bg-[#040410] text-white px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Admin</p>
          <h1 className="text-3xl font-semibold">Catalogue - FileUp Integration</h1>
          <p className="text-sm text-zinc-400">
            Gère les beats, uploads vers FileUp, et contrôle la publication.
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,.35)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold">Beat / Métadonnées</h2>
            <button
              onClick={resetForm}
              className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wide text-zinc-300 transition hover:border-white/40"
            >
              Nouveau
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          {info && <p className="mt-3 text-sm text-emerald-400">{info}</p>}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-200">
              Artiste
              <select
                value={form.artistId}
                onChange={(e) => setForm((prev) => ({ ...prev, artistId: e.target.value }))}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-[#08080f]/70 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {artists.map((artist) => (
                  <option key={artist._id} value={artist._id}>
                    {artist.name} {artist.verified ? "✓" : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-zinc-200">
              Titre
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-[#08080f]/70 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Titre du beat"
              />
            </label>

            <label className="text-sm font-medium text-zinc-200">
              BPM
              <input
                type="number"
                min={40}
                max={220}
                value={form.bpm}
                onChange={(e) => setForm((prev) => ({ ...prev, bpm: e.target.value }))}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-[#08080f]/70 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="120"
              />
            </label>

            <label className="text-sm font-medium text-zinc-200">
              Gamme / clé
              <input
                type="text"
                value={form.key}
                onChange={(e) => setForm((prev) => ({ ...prev, key: e.target.value }))}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-[#08080f]/70 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Am, Fm..."
              />
            </label>

            <label className="text-sm font-medium text-zinc-200">
              Genres (virgules)
              <input
                type="text"
                value={form.genres}
                onChange={(e) => setForm((prev) => ({ ...prev, genres: e.target.value }))}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-[#08080f]/70 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Trap, Drill..."
              />
            </label>

            <label className="text-sm font-medium text-zinc-200">
              Moods (virgules)
              <input
                type="text"
                value={form.moods}
                onChange={(e) => setForm((prev) => ({ ...prev, moods: e.target.value }))}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-[#08080f]/70 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Dark, Chill..."
              />
            </label>

            <label className="text-sm font-medium text-zinc-200">
              Statut
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status: e.target.value as FormState["status"],
                  }))
                }
                className="mt-1 w-full rounded-2xl border border-white/10 bg-[#08080f]/70 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-zinc-200">
              Visibilité
              <select
                value={form.visibility}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    visibility: e.target.value as FormState["visibility"],
                  }))
                }
                className="mt-1 w-full rounded-2xl border border-white/10 bg-[#08080f]/70 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {VISIBILITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-2xl bg-indigo-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-400 disabled:cursor-wait disabled:opacity-60"
            >
              {form.id ? "Mettre à jour" : "Créer le beat"}
            </button>
            {form.id ? (
              <button
                onClick={resetForm}
                className="rounded-2xl border border-white/20 px-6 py-2 text-sm text-white/70 hover:border-white/60"
              >
                Annuler
              </button>
            ) : null}
          </div>
        </section>

        {form.id && currentBeat && (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,.35)] backdrop-blur-xl">
            <h2 className="text-lg font-semibold">Upload Fichiers (FileUp)</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Les fichiers sont uploadés vers FileUp et stockés comme assets MongoDB
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {/* Cover */}
              <div className="rounded-2xl border border-white/10 bg-[#04040c]/70 p-4">
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-zinc-400">
                  <span>Cover Image</span>
                  {uploadingCover && <span className="text-xs text-amber-300">uploading…</span>}
                </div>
                {currentBeat.coverUrl && (
                  <div className="mt-2 relative w-full h-32">
                    <Image
                      src={currentBeat.coverUrl}
                      alt="Cover"
                      fill
                      className="object-cover rounded-lg"
                    />
                    <a
                      href={currentBeat.coverUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-300 underline mt-1 block"
                    >
                      Voir
                    </a>
                  </div>
                )}
                <label className="mt-3 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-white/30 px-3 py-2 text-sm text-white/70 transition hover:border-white/60">
                  <span>Upload Cover</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && form.id) uploadCover(form.id, file);
                    }}
                  />
                  <span className="text-xs text-white/70">Choisir</span>
                </label>
              </div>

              {/* Preview */}
              <div className="rounded-2xl border border-white/10 bg-[#04040c]/70 p-4">
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-zinc-400">
                  <span>Preview (30s)</span>
                  {uploadingPreview && <span className="text-xs text-amber-300">uploading…</span>}
                </div>
                {currentBeat.assets?.find((a) => a.type === "preview") && (
                  <div className="mt-2">
                    <p className="text-xs text-emerald-300">✓ Preview uploadé</p>
                    <a
                      href={currentBeat.assets.find((a) => a.type === "preview")?.storageKey}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-300 underline"
                    >
                      Écouter
                    </a>
                  </div>
                )}
                <label className="mt-3 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-white/30 px-3 py-2 text-sm text-white/70 transition hover:border-white/60">
                  <span>Upload Preview MP3</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="audio/mp3,audio/mpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && form.id) uploadAsset(form.id, "preview", file);
                    }}
                  />
                  <span className="text-xs text-white/70">Choisir</span>
                </label>
              </div>

              {/* MP3 Full */}
              <div className="rounded-2xl border border-white/10 bg-[#04040c]/70 p-4">
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-zinc-400">
                  <span>MP3 Complet</span>
                  {uploadingMp3 && <span className="text-xs text-amber-300">uploading…</span>}
                </div>
                {currentBeat.assets?.find((a) => a.type === "mp3") && (
                  <div className="mt-2">
                    <p className="text-xs text-emerald-300">✓ MP3 uploadé</p>
                    <a
                      href={currentBeat.assets.find((a) => a.type === "mp3")?.storageKey}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-300 underline"
                    >
                      Télécharger
                    </a>
                  </div>
                )}
                <label className="mt-3 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-white/30 px-3 py-2 text-sm text-white/70 transition hover:border-white/60">
                  <span>Upload MP3 Full</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="audio/mp3,audio/mpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && form.id) uploadAsset(form.id, "mp3", file);
                    }}
                  />
                  <span className="text-xs text-white/70">Choisir</span>
                </label>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,.35)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Backstage</h2>
            <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              {loading ? "Chargement…" : `${beats.length} beats`}
            </div>
          </div>
          <div className="mt-4">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-zinc-300">
                  <tr>
                    <th className="px-4 py-3 text-left">Titre</th>
                    <th className="px-4 py-3 text-left">Artiste</th>
                    <th className="px-4 py-3 text-center">Statut</th>
                    <th className="px-4 py-3 text-center">Cover</th>
                    <th className="px-4 py-3 text-center">Preview</th>
                    <th className="px-4 py-3 text-center">MP3</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#03030a] text-zinc-200">
                  {beats.map((beat) => (
                    <tr key={beat._id} className="hover:bg-white/5">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleSelectBeat(beat)}
                          className="text-left text-sm font-medium text-white transition hover:text-indigo-300"
                        >
                          {beat.title}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-300">
                        {beat.artist?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-zinc-300">
                          {statusLabel(beat.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {beat.coverUrl ? (
                          <span className="text-[11px] text-emerald-300">✓</span>
                        ) : (
                          <span className="text-[11px] text-red-400">✗</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {beat.assets?.find((a) => a.type === "preview") ? (
                          <span className="text-[11px] text-emerald-300">✓</span>
                        ) : (
                          <span className="text-[11px] text-red-400">✗</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {beat.assets?.find((a) => a.type === "mp3") ? (
                          <span className="text-[11px] text-emerald-300">✓</span>
                        ) : (
                          <span className="text-[11px] text-red-400">✗</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <button
                            onClick={() => handleSelectBeat(beat)}
                            className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white transition hover:border-indigo-300 hover:text-indigo-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(beat)}
                            className="rounded-full border border-white/10 px-3 py-1 text-[11px] tracking-[0.2em] text-white transition hover:border-emerald-300 hover:text-emerald-300"
                          >
                            {beat.status === "published" ? "Draft" : "Publish"}
                          </button>
                          <button
                            onClick={() => handleDelete(beat._id)}
                            className="rounded-full border border-white/10 px-3 py-1 text-[11px] tracking-[0.2em] text-white transition hover:border-rose-300 hover:text-rose-300"
                          >
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {beats.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-sm text-zinc-500">
                        Aucun beat trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
