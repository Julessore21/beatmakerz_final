"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { PageTitle } from "@/components/ui/PageTitle";

/**
 * Le formulaire prépare le mail dans la messagerie de l'artiste : le message part de son adresse
 * et arrive directement dans la boîte de Beatmakerz (rien ne se perd dans une base que personne ne lit).
 */
export default function ContactPage() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 10) return setError("Écris quelques mots de plus (10 caractères au moins).");
    setError(null);
    const body = `${message.trim()}\n\n${name.trim() ? `— ${name.trim()}` : ""}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject.trim() || "Message depuis le site")}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="container-site grid gap-12 pt-10 sm:pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div>
        <PageTitle eyebrow="Contact" title="Une question ? Écris-nous." text="Une commande, une licence, une exclusivité, un problème de téléchargement : on répond par mail, en général dans la journée." />
        <a href={`mailto:${SITE.email}`} className="mt-8 inline-flex items-center gap-3 rounded-full border border-line-strong px-5 py-3 text-[15px] transition-colors hover:bg-white/[0.06]">
          <Mail className="h-4 w-4" />
          {SITE.email}
        </a>
        <div className="mt-10 border-t border-line pt-8">
          <p className="eyebrow mb-4">Sur les réseaux</p>
          <div className="flex flex-wrap gap-2">
            {[
              { href: SITE.socials.tiktok, label: "TikTok" },
              { href: SITE.socials.instagram, label: "Instagram" },
              { href: SITE.socials.youtube, label: "YouTube" },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="rounded-full border border-line px-4 py-2 text-[14px] text-fg-muted transition-colors hover:border-line-strong hover:text-fg">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="card space-y-4 p-6 sm:p-8" noValidate>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-fg-muted">Ton nom (ou nom d’artiste)</span>
          <input className="field" value={name} onChange={(e) => setName(e.target.value.slice(0, 100))} autoComplete="name" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-fg-muted">Sujet</span>
          <input className="field" value={subject} onChange={(e) => setSubject(e.target.value.slice(0, 200))} placeholder="Ma commande, une exclusivité…" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-fg-muted">Message</span>
          <textarea className="field min-h-[180px]" value={message} onChange={(e) => setMessage(e.target.value.slice(0, 5000))} />
        </label>
        {error && <p className="rounded-lg bg-white/[0.05] px-3 py-2.5 text-[14px]">{error}</p>}
        <Button type="submit" size="lg" className="w-full">
          <Send className="h-4 w-4" />
          Ouvrir dans ma messagerie
        </Button>
        <p className="text-center text-[12px] text-fg-faint">Ton message s’ouvre dans ta messagerie, prêt à partir.</p>
      </form>
    </div>
  );
}
