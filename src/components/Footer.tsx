"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaInstagram, FaTiktok, FaYoutube, FaXTwitter } from "react-icons/fa6";

const NAV_SECTIONS = {
  explore: [
    { label: "Catalogue", href: "/web/catalogue" },
    { label: "Marketplace", href: "/web/marketplace" },
    { label: "Prod sur mesure", href: "/web/prodsurmesure" },
  ],
  account: [
    { label: "Abonnements", href: "/web/abonnements" },
    { label: "Cartes cadeau", href: "/web/cartes-cadeau" },
    { label: "Mon compte", href: "/web/account" },
  ],
  legal: [
    { label: "Mentions legales", href: "/web/mentions" },
    { label: "CGV", href: "/web/cgv" },
    { label: "CGU", href: "/web/cgu" },
    { label: "Confidentialite", href: "/web/politique" },
  ],
  support: [
    { label: "Contact", href: "/web/contact" },
    { label: "FAQ", href: "/web/faq" },
  ],
};

// Export for backwards compatibility
export const LEGAL_LINKS: { label: string; href: string }[] = [
  { label: "Mentions legales", href: "/web/mentions" },
  { label: "CGV", href: "/web/cgv" },
  { label: "CGU", href: "/web/cgu" },
  { label: "Politique de confidentialite", href: "/web/politique" },
  { label: "Cookies", href: "/web/politique#cookies" },
  { label: "Propriete intellectuelle", href: "/web/mentions#propriete-intellectuelle" },
];

export default function Footer() {
  const [lang, setLang] = useState<"FR" | "EN">("FR");

  return (
    <footer className="relative w-full bg-[#030308] text-white">
      {/* Top separator line with glow */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Main content */}
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8 pt-16 pb-8">
        {/* Grid layout */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1 lg:pr-8">
            <div className="text-xl font-bold tracking-[0.25em] text-white">BEATMAKERZ</div>
            <p className="mt-3 text-xs leading-relaxed text-white/40">
              Plateforme francaise pour artistes & beatmakers
            </p>
            {/* Social icons */}
            <div className="mt-6 flex items-center gap-3">
              <SocialIcon href="https://www.instagram.com/beatmakerz_pro/" label="Instagram">
                <FaInstagram className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="https://www.tiktok.com/@beatmakerz.pro" label="TikTok">
                <FaTiktok className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="https://www.youtube.com/@BEATMAKERZ-PRO" label="YouTube">
                <FaYoutube className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="https://x.com" label="X">
                <FaXTwitter className="h-4 w-4" />
              </SocialIcon>
            </div>
          </div>

          {/* Navigation columns */}
          <NavColumn title="Explorer" links={NAV_SECTIONS.explore} />
          <NavColumn title="Compte" links={NAV_SECTIONS.account} />
          <NavColumn title="Legal" links={NAV_SECTIONS.legal} />
          <NavColumn title="Support" links={NAV_SECTIONS.support} />
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Beatmakerz. Tous droits reserves.
          </p>
          <div className="flex items-center gap-6">
            <LangSwitch lang={lang} setLang={setLang} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function NavColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center text-white/50 transition-colors hover:text-white"
    >
      {children}
    </a>
  );
}

function LangSwitch({ lang, setLang }: { lang: "FR" | "EN"; setLang: (l: "FR" | "EN") => void }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      {(["FR", "EN"] as const).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            className={`transition-colors ${active ? "text-white font-medium" : "text-white/40 hover:text-white/70"}`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
