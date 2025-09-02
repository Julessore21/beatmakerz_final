import React from "react";
import Link from "next/link";
import { FaInstagram, FaTiktok, FaYoutube, FaXTwitter } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-white/90 bg-gradient-to-b from-black via-[#0b0b12] to-black pb-[30px]">
      <div className="container mx-auto max-w-screen-2xl px-6 lg:px-8 pt-12 pb-10">
        {/* Top brand row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-2xl font-bold tracking-widest">BEATMAKERZ</div>
            <div className="mt-1 text-xs text-zinc-400 leading-relaxed">Plateforme française pour artistes & beatmakers</div>
          </div>
          <div className="mt-1 sm:mt-0 flex items-center gap-2.5 text-zinc-300 shrink-0">
            <a href="https://www.instagram.com/beatmakerz_pro/" target="_blank" aria-label="Instagram" className="rounded-full border border-white/10 p-2 hover:bg-white/10">
              <FaInstagram size={15} />
            </a>
            <a href="https://www.tiktok.com/@beatmakerz.pro" target="_blank" aria-label="TikTok" className="rounded-full border border-white/10 p-2 hover:bg-white/10">
              <FaTiktok size={15} />
            </a>
            <a href="https://www.youtube.com/@BEATMAKERZ-PRO" target="_blank" aria-label="YouTube" className="rounded-full border border-white/10 p-2 hover:bg-white/10">
              <FaYoutube size={15} />
            </a>
            <a href="https://x.com" target="_blank" aria-label="X" className="rounded-full border border-white/10 p-2 hover:bg-white/10">
              <FaXTwitter size={15} />
            </a>
          </div>
        </div>

        {/* separator (gap réduit) */}
        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Columns (gap vertical réduit) */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 text-sm leading-6">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-400">Découvrir</div>
            <div className="mt-2 flex flex-col gap-1.5">
              <Link href="/web/catalogue" className="hover:text-white">Catalogue</Link>
              <Link href="/web/abonnements" className="hover:text-white">Abonnements</Link>
              <Link href="/web/marketplace" className="hover:text-white">Marketplace</Link>
              <Link href="/web/prodsurmesure" className="hover:text-white">Prod sur mesure</Link>
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-400">Support</div>
            <div className="mt-2 flex flex-col gap-1.5">
              <Link href="/web/faq" className="hover:text-white">FAQ</Link>
              <Link href="/web/contact" className="hover:text-white">Contact</Link>
              <Link href="/web/tarification" className="hover:text-white">Tarification</Link>
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-400">Légal</div>
            <div className="mt-2 flex flex-col gap-1.5">
              <Link href="/web/cgv" className="hover:text-white">CGV</Link>
              <Link href="/web/cgu" className="hover:text-white">CGU</Link>
              <Link href="/web/mentions" className="hover:text-white">Mentions légales</Link>
              <Link href="/web/politique" className="hover:text-white">Confidentialité</Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-[11px] uppercase tracking-wider text-zinc-400">Ressources</div>
            <div className="mt-2 flex flex-col gap-1.5">
              <a href="#" className="hover:text-white">Affiliation</a>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-[11px] uppercase tracking-wider text-zinc-400">Produits</div>
            <div className="mt-2 flex flex-col gap-1.5">
              <a href="#" className="hover:text-white">Cartes cadeau</a>
              <Link href="/web/prodsurmesure" className="hover:text-white">Prod personnalisée</Link>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-zinc-400">
          <div className="text-center sm:text-left">© {new Date().getFullYear()} Beatmakerz. Tous droits réservés.</div>
          <div className="mt-3 sm:mt-0 flex items-center gap-3">
            <span className="h-[1px] w-6 bg-white/20" />
            <a href="/web/politique" className="hover:text-white">Cookies</a>
            <span className="h-[1px] w-6 bg-white/20" />
            <a href="/web/contact" className="hover:text-white">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
