"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaInstagram, FaTiktok, FaYoutube, FaXTwitter } from "react-icons/fa6";

// Liens légaux communs
export const LEGAL_LINKS: { label: string; href: string }[] = [
  { label: "Mentions légales", href: "/web/mentions" },
  { label: "CGV", href: "/web/cgv" },
  { label: "CGU", href: "/web/cgu" },
  { label: "Politique de confidentialité", href: "/web/politique" },
  { label: "Cookies", href: "/web/politique#cookies" },
  { label: "Propriété intellectuelle", href: "/web/mentions#propriete-intellectuelle" },
];

export default function Footer() {
  const [lang, setLang] = useState<"FR" | "EN">("FR");

  return (
    <footer className="relative w-full text-white/90">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0b14]/60 to-[#08080f]/85 blur-xl" />
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Branding + Social */}
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <div className="text-base sm:text-lg font-semibold tracking-wide text-white">BEATMAKERZ</div>
            <div className="mt-1 text-xs text-zinc-400">Plateforme française pour artistes & beatmakers</div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-white/80">
            <SocialLink href="https://www.instagram.com/beatmakerz_pro/" label="Instagram">
              <FaInstagram />
            </SocialLink>
            <SocialLink href="https://www.tiktok.com/@beatmakerz.pro" label="TikTok">
              <FaTiktok />
            </SocialLink>
            <SocialLink href="https://www.youtube.com/@BEATMAKERZ-PRO" label="YouTube">
              <FaYoutube />
            </SocialLink>
            <SocialLink href="https://x.com" label="X">
              <FaXTwitter />
            </SocialLink>
            <LangSwitch lang={lang} setLang={setLang} />
          </div>
        </div>

        {/* Separator */}
        <div className="mt-6 h-px w-full bg-white/10" />

        {/* Legal links */}
        <div className="mt-6 text-xs sm:text-sm text-zinc-300">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:justify-start sm:gap-x-4">
            {LEGAL_LINKS.map((item, idx) => (
              <React.Fragment key={item.href}>
                <Link className="hover:text-white transition-colors" href={item.href}>
                  {item.label}
                </Link>
                {idx < LEGAL_LINKS.length - 1 ? <span className="text-white/30">/</span> : null}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="mt-6 h-px w-full bg-white/10" />

        {/* Copyright + utilities */}
        <div className="mt-4 flex flex-col items-center gap-2 text-center text-xs text-zinc-400 sm:flex-row sm:justify-between sm:text-left">
          <span>© {new Date().getFullYear()} Beatmakerz. Tous droits réservés.</span>
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-6 bg-white/15" />
            <Link href="/web/politique#cookies" className="hover:text-white">
              Cookies
            </Link>
            <span className="h-[1px] w-6 bg-white/15" />
            <Link href="/web/contact" className="hover:text-white">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </a>
  );
}

function LangSwitch({ lang, setLang }: { lang: "FR" | "EN"; setLang: (l: "FR" | "EN") => void }) {
  return (
    <div className="flex items-center rounded-full border border-white/10 bg-white/5 text-xs overflow-hidden">
      {(["FR", "EN"] as const).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            className={`px-3 py-1 transition ${active ? "bg-white text-black font-semibold" : "text-white/80 hover:bg-white/10"}`}
            aria-pressed={active}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
