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

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    if (mode === "link") {
      if (user) {
        try {
          localStorage.setItem("isBeatmaker:" + user, "true");
        } catch {
          // ignore
        }
        alert("Ton compte est maintenant configure comme beatmaker.");
        return;
      }
      const ok = await login(username, password);
      if (ok) {
        try {
          localStorage.setItem("isBeatmaker:" + username.trim(), "true");
        } catch {
          // ignore
        }
      }
      alert(ok ? "Compte lie avec succes." : "Identifiants invalides.");
    } else {
      const ok = await signup(username, password);
      alert(ok ? "Compte cree et connecte." : "Utilisateur deja existant.");
    }
  };

  const handleProfile = (event: React.FormEvent) => {
    event.preventDefault();
    const keyUser = user || username;
    if (!keyUser) {
      alert("Connecte-toi ou cree un compte d'abord.");
      return;
    }
    try {
      const raw = localStorage.getItem("beatmakerProfiles") || "{}";
      const profiles = JSON.parse(raw);
      profiles[keyUser] = { artistName, tag, bio, image };
      localStorage.setItem("beatmakerProfiles", JSON.stringify(profiles));
      localStorage.setItem("isBeatmaker:" + keyUser, "true");
      alert("Profil beatmaker enregistre.");
    } catch {
      alert("Impossible d'enregistrer localement (mode demo).");
    }
  };

  const modeButton = (current: "create" | "link", label: string) => (
    <button
      type="button"
      onClick={() => setMode(current)}
      className={`rounded-full px-3 py-1 ${mode === current ? "bg-white text-black" : "text-white"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black pt-24 pb-24 text-white">
      <div className="container mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_10px_60px_rgba(0,0,0,.35)] backdrop-blur-xl"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Configuration Beatmaker</h1>
            <p className="mt-2 text-sm text-zinc-300">Cree un profil dedie ou lie ton compte existant.</p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Compte</h2>
                <div className="rounded-full border border-white/10 bg-white/5 p-1 text-xs">
                  {modeButton("create", "Creer")}
                  {modeButton("link", "Lier")}
                </div>
              </div>

              <form onSubmit={handleAuth} className="mt-4 space-y-3">
                {!user && (
                  <>
                    <input
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="Email ou pseudo"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 placeholder:text-zinc-500"
                      required
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Mot de passe"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 placeholder:text-zinc-500"
                      required
                    />
                  </>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-zinc-100"
                >
                  {mode === "link" ? (user ? "Lier mon compte" : "Se connecter et lier") : "Creer mon compte"}
                </button>
              </form>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-base font-semibold">Profil Beatmaker</h2>
              <form onSubmit={handleProfile} className="mt-4 space-y-3">
                <input
                  value={artistName}
                  onChange={(event) => setArtistName(event.target.value)}
                  placeholder="Pseudo de beatmaker"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 placeholder:text-zinc-500"
                  required
                />
                <input
                  value={tag}
                  onChange={(event) => setTag(event.target.value)}
                  placeholder="Signature (ex: prod. by ...)"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 placeholder:text-zinc-500"
                />
                <div className="flex items-center gap-3">
                  <label className="text-sm text-zinc-300">Image de profil</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => setImage(String(reader.result || ""));
                      reader.readAsDataURL(file);
                    }}
                    className="text-sm"
                  />
                </div>
                {image && (
                  <div className="mt-1">
                    <img src={image} alt="apercu" className="h-20 w-20 rounded-xl object-cover" />
                  </div>
                )}
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="Bio courte, inspirations, styles"
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-zinc-100"
                >
                  Enregistrer
                </button>
              </form>
            </section>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-zinc-400">
            <Link href="/web/vendeur" className="hover:underline">
              Retour
            </Link>
            <span>Assistance prioritaire 24/7</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
