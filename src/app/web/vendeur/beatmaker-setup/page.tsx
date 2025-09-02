"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function BeatmakerSetup() {
  const { user, login, signup } = useAuth();
  const [mode, setMode] = useState<"create" | "link">(user ? "link" : "create");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [artistName, setArtistName] = useState("");
  const [tag, setTag] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "link") {
      // pour cette démo: si déjà connecté, on considère que le compte est lié
      if (user) {
        try {
          localStorage.setItem(`isBeatmaker:${user}`, "true");
        } catch {}
        alert("Ton compte existant est maintenant configuré comme beatmaker.");
        return;
      }
      const ok = login(username, password);
      if (ok) {
        try {
          localStorage.setItem(`isBeatmaker:${username}`, "true");
        } catch {}
      }
      alert(ok ? "Compte lié avec succès." : "Identifiants invalides.");
    } else {
      const ok = signup(username, password);
      alert(ok ? "Compte créé et connecté." : "Utilisateur déjà existant.");
    }
  };

  const handleProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const keyUser = user || username;
    if (!keyUser) {
      alert("Connecte-toi ou crée un compte d'abord.");
      return;
    }
    try {
      const raw = localStorage.getItem("beatmakerProfiles") || "{}";
      const profiles = JSON.parse(raw);
      profiles[keyUser] = { artistName, tag, bio, image };
      localStorage.setItem("beatmakerProfiles", JSON.stringify(profiles));
      localStorage.setItem(`isBeatmaker:${keyUser}`, "true");
      alert("Profil beatmaker enregistré.");
    } catch {
      alert("Impossible d'enregistrer localement (démo).");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-24 pb-24">
      <div className="container mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,.35)]"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Configuration Beatmaker</h1>
            <p className="mt-2 text-sm text-zinc-300">Crée un profil dédié ou lie ton compte existant.</p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Compte</h2>
                <div className="rounded-full border border-white/10 bg-white/5 p-1 text-xs">
                  <button
                    className={`px-3 py-1 rounded-full ${mode==="create"?"bg-white text-black":"text-white"}`}
                    onClick={() => setMode("create")}
                  >Créer</button>
                  <button
                    className={`px-3 py-1 rounded-full ${mode==="link"?"bg-white text-black":"text-white"}`}
                    onClick={() => setMode("link")}
                  >Lier</button>
                </div>
              </div>

              <form onSubmit={handleAuth} className="mt-4 space-y-3">
                {!user && (
                  <>
                    <input
                      value={username}
                      onChange={(e)=>setUsername(e.target.value)}
                      placeholder="Email ou pseudo"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 placeholder:text-zinc-500"
                      required
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e)=>setPassword(e.target.value)}
                      placeholder="Mot de passe"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 placeholder:text-zinc-500"
                      required
                    />
                  </>
                )}

                <button type="submit" className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-zinc-100">
                  {mode === "link" ? (user?"Lier mon compte":"Se connecter & lier") : "Créer mon compte"}
                </button>
              </form>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-base font-semibold">Profil Beatmaker</h2>
              <form onSubmit={handleProfile} className="mt-4 space-y-3">
                <input
                  value={artistName}
                  onChange={(e)=>setArtistName(e.target.value)}
                  placeholder="Pseudo de beatmaker"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 placeholder:text-zinc-500"
                  required
                />
                <input
                  value={tag}
                  onChange={(e)=>setTag(e.target.value)}
                  placeholder="Tag/Producteur (ex: prod. by …)"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 placeholder:text-zinc-500"
                />
                <div className="flex items-center gap-3">
                  <label className="text-sm text-zinc-300">Image de profil</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e)=>{
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const reader = new FileReader();
                      reader.onload = () => setImage(String(reader.result||""));
                      reader.readAsDataURL(f);
                    }}
                    className="text-sm"
                  />
                </div>
                {image && (
                  <div className="mt-1">
                    <img src={image} alt="aperçu" className="h-20 w-20 rounded-xl object-cover" />
                  </div>
                )}
                <textarea
                  value={bio}
                  onChange={(e)=>setBio(e.target.value)}
                  placeholder="Bio courte, inspirations, styles"
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 placeholder:text-zinc-500"
                />
                <button type="submit" className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-zinc-100">Enregistrer</button>
              </form>
            </section>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-zinc-400">
            <Link href="/web/vendeur" className="hover:underline">Retour</Link>
            <span>Assistance prioritaire 24/7</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


