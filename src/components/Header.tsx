"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/cn";
import { LogoMark } from "./Logo";

/** La navigation : une pilule de verre qui flotte en haut de chaque page. */
export function Header() {
  const pathname = usePathname();
  const { count, open } = useCart();
  const { isAuthenticated } = useAuth();
  const [menu, setMenu] = useState(false);

  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  const active = (href: string) => !href.includes("#") && pathname?.startsWith(href);

  return (
    <>
      <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4">
        <div className="flex h-14 w-full max-w-[780px] items-center justify-between gap-3 rounded-full border border-white/10 bg-[linear-gradient(100deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03)_60%,rgba(255,255,255,0.08)),linear-gradient(rgba(9,9,11,0.72),rgba(9,9,11,0.72))] pl-3 pr-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <Link href="/" aria-label="Beatmakerz, accueil" className="flex shrink-0 items-center gap-2.5 pl-1">
            <LogoMark className="h-7 w-7" />
            <span className="hidden text-[13px] font-semibold tracking-[0.16em] xs:inline">BEATMAKERZ</span>
          </Link>

          <nav className="hidden items-center md:flex" aria-label="Navigation principale">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn("rounded-full px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors", active(n.href) ? "text-fg" : "text-fg-muted hover:text-fg")}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href={isAuthenticated ? "/web/account" : "/web/profil"}
              className="hidden h-11 w-11 place-items-center rounded-full bg-white/[0.06] text-fg-muted transition-colors hover:bg-white/[0.12] hover:text-fg md:grid"
              aria-label={isAuthenticated ? "Mon compte" : "Se connecter"}
            >
              <User className="h-[17px] w-[17px]" />
            </Link>
            <button
              type="button"
              onClick={open}
              className="flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-accent px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-white transition-colors hover:bg-accent/85"
              aria-label={`Panier, ${count} prod${count > 1 ? "s" : ""}`}
            >
              [ Panier{count > 0 ? ` · ${count}` : ""} ]
            </button>
            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.06] text-fg md:hidden"
              aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menu}
            >
              <Plus className={cn("h-5 w-5 transition-transform duration-300", menu && "rotate-45")} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink/95 px-6 pb-10 pt-28 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav aria-label="Menu">
              <ul className="space-y-1">
                {[...NAV, { href: "/web/contact", label: "Contact" }, { href: isAuthenticated ? "/web/account" : "/web/profil", label: isAuthenticated ? "Mon compte" : "Se connecter" }].map((n, i) => (
                  <motion.li key={n.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                    <Link href={n.href} onClick={() => setMenu(false)} className="block py-2 text-[40px] font-medium leading-tight tracking-[-0.03em]">
                      {n.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-muted">
              <a href={SITE.socials.tiktok} target="_blank" rel="noreferrer">[ TikTok ]</a>
              <a href={SITE.socials.instagram} target="_blank" rel="noreferrer">[ Instagram ]</a>
              <a href={SITE.socials.youtube} target="_blank" rel="noreferrer">[ YouTube ]</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
