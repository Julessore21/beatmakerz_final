"use client";

import { useEffect, useMemo, useState } from "react";

type UploadField = "previewUrl" | "coverUrl" | "audioUrl";

type AdminBeat = {
  _id: string;
  title: string;
  bpm?: number;
  key?: string;
  genres?: string[];
  moods?: string[];
  status?: "draft" | "published";
  visibility?: "public" | "private";
  previewUrl?: string;
  coverUrl?: string;
  audioUrl?: string;
  updatedAt?: string;
};

type FormState = {
  id: string;
  title: string;
  bpm: string;
  key: string;
  genres: string;
  moods: string;
  status: "draft" | "published";
  visibility: "public" | "private";
  previewUrl: string;
  coverUrl: string;
  audioUrl: string;
};

const STATUS_OPTIONS: FormState["status"][] = ["draft", "published"];
const VISIBILITY_OPTIONS: FormState["visibility"][] = ["public", "private"];

const initialFormState: FormState = {
  id: "",
  title: "",
  bpm: "",
  key: "",
  genres: "",
  moods: "",
  status: "draft",
  visibility: "public",
  previewUrl: "",
  coverUrl: "",
  audioUrl: "",
};

const splitList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function AdminCataloguePage() {
  const [beats, setBeats] = useState<AdminBeat[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadState, setUploadState] = useState<Record<UploadField, boolean>>({
    previewUrl: false,
    coverUrl: false,
    audioUrl: false,
  });
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

  useEffect(() => {
    loadBeats();
  }, []);

  const resetForm = () => {
    setForm(initialFormState);
    setError(null);
    setInfo(null);
  };

  const handleSelectBeat = (beat: AdminBeat) => {
    setForm({
      id: beat._id,
      title: beat.title,
      bpm: beat.bpm ? String(beat.bpm) : "",
      key: beat.key || "",
      genres: (beat.genres || []).join(", "),
      moods: (beat.moods || []).join(", "),
      status: beat.status || "draft",
      visibility: beat.visibility || "public",
      previewUrl: beat.previewUrl || "",
      coverUrl: beat.coverUrl || "",
      audioUrl: beat.audioUrl || "",
    });
    setError(null);
    setInfo(null);
  };

  const handleUpload = async (field: UploadField, file?: File | null) => {
    if (!file) return;
    setUploadState((prev) => ({ ...prev, [field]: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload échoué.");
      const data = await res.json();
      setForm((prev) => ({ ...prev, [field]: data.downloadLink || "" }));
      setInfo("Upload réussi. Pense à sauvegarder le beat.");
    } catch (err: any) {
      console.error(err);
      setError("L'upload n'a pas pu être réalisé.");
    } finally {
      setUploadState((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    if (form.status === "published" && !form.previewUrl) {
      return "Un preview est requis pour publier le beat.";
    }
    const isVendable = form.status === "published" && form.visibility === "public";
    if (isVendable && !form.audioUrl) {
      return "Le beat vendable doit contenir la version complète (audioUrl).";
    }
    if (!form.title.trim()) return "Le titre est obligatoire.";
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
      title: form.title.trim(),
      bpm: form.bpm ? Number(form.bpm) : undefined,
      key: form.key.trim() || undefined,
      genres: splitList(form.genres),
      moods: splitList(form.moods),
      status: form.status,
      visibility: form.visibility,
      previewUrl: form.previewUrl || undefined,
      coverUrl: form.coverUrl || undefined,
      audioUrl: form.audioUrl || undefined,
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
      if (!res.ok) throw new Error("Impossible d'enregistrer le beat.");
      await loadBeats();
      setInfo("Beat enregistré avec succès.");
      if (!form.id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("Enregistrement impossible.");
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
    if (nextStatus === "published" && !beat.previewUrl) {
      setError("Un preview est requis pour publier.");
      return;
    }
    if (nextStatus === "published" && beat.visibility === "public" && !beat.audioUrl) {
      setError("Le beat vendable doit contenir la version complète (audioUrl).");
      return;
    }
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

  const readyBeats = useMemo(() => beats, [beats]);

  return (
    <div className="min-h-screen bg-[#040410] text-white px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Admin</p>
          <h1 className="text-3xl font-semibold">Catalogue contrôlé</h1>
          <p className="text-sm text-zinc-400">
            Gère les uploads FileUp, publie des beats et sécurise l’accès aux versions complètes.
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,.35)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold">Beat / Méta</h2>
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

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {(["previewUrl", "coverUrl", "audioUrl"] as UploadField[]).map((field) => (
              <div key={field} className="rounded-2xl border border-white/10 bg-[#04040c]/70 p-4">
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-zinc-400">
                  <span>{field === "previewUrl" ? "Preview" : field === "coverUrl" ? "Cover" : "Version complète"}</span>
                  {uploadState[field] && <span className="text-xs text-amber-300">uploading…</span>}
                </div>
                <input
                  type="text"
                  value={form[field]}
                  readOnly
                  className="mt-2 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30"
                  placeholder="Aucun lien"
                />
                <label className="mt-3 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-white/30 px-3 py-2 text-sm text-white/70 transition hover:border-white/60">
                  <span>Uploader depuis FileUp</span>
                  <input
                    type="file"
                    className="hidden"
                    accept={field === "coverUrl" ? "image/*" : "audio/*"}
                    onChange={(event) => handleUpload(field, event.target.files?.[0])}
                  />
                  <span className="text-xs text-white/70">Choisir</span>
                </label>
              </div>
            ))}
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

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,.35)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Bakstage</h2>
            <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              {loading ? "Chargement…" : `${readyBeats.length} beats`}
            </div>
          </div>
          <div className="mt-4">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-zinc-300">
                  <tr>
                    <th className="px-4 py-3 text-left">Titre</th>
                    <th className="px-4 py-3 text-center">Statut</th>
                    <th className="px-4 py-3 text-center">Visibilité</th>
                    <th className="px-4 py-3 text-center">Preview</th>
                    <th className="px-4 py-3 text-center">Audio</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#03030a] text-zinc-200">
                  {readyBeats.map((beat) => (
                    <tr key={beat._id} className="hover:bg-white/5">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleSelectBeat(beat)}
                          className="text-left text-sm font-medium text-white transition hover:text-indigo-300"
                        >
                          {beat.title}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-zinc-300">
                          {statusLabel(beat.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-zinc-300">{beat.visibility}</td>
                      <td className="px-4 py-3 text-center">
                        {beat.previewUrl ? (
                          <a
                            href={beat.previewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-indigo-300 underline"
                          >
                            Voir
                          </a>
                        ) : (
                          <span className="text-[11px] text-red-400">manquant</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {beat.audioUrl ? (
                          <span className="text-[11px] text-emerald-300">prêt</span>
                        ) : (
                          <span className="text-[11px] text-red-400">absent</span>
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
                            {beat.status === "published" ? "Brouillon" : "Publier"}
                          </button>
                          <button
                            onClick={() => handleDelete(beat._id)}
                            className="rounded-full border border-white/10 px-3 py-1 text-[11px] tracking-[0.2em] text-white transition hover:border-rose-300 hover:text-rose-300"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {readyBeats.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-sm text-zinc-500">
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
