"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { NAV } from "@/lib/site";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";

export function Header() {
  const pathname = usePathname();
  const { count, open } = useCart();
  const { isAuthenticated } = useAuth();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const active = (href: string) => !href.includes("#") && pathname?.startsWith(href);

  return (
    <header className={cn("sticky top-0 z-40 transition-colors duration-200", scrolled || menu ? "border-b border-line bg-ink/80 backdrop-blur-xl" : "border-b border-transparent")}>
      <div className="container-site flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="Beatmakerz, accueil" className="flex shrink-0 items-center">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={cn("rounded-full px-3.5 py-2 text-[14px] transition-colors", active(n.href) ? "text-fg" : "text-fg-muted hover:text-fg")}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link href={isAuthenticated ? "/web/account" : "/web/profil"} className="grid h-10 w-10 place-items-center rounded-full text-fg-muted transition-colors hover:bg-white/[0.06] hover:text-fg" aria-label={isAuthenticated ? "Mon compte" : "Se connecter"}>
            <User className="h-[18px] w-[18px]" />
          </Link>
          <button type="button" onClick={open} className="relative grid h-10 w-10 place-items-center rounded-full text-fg-muted transition-colors hover:bg-white/[0.06] hover:text-fg" aria-label={`Panier, ${count} prod${count > 1 ? "s" : ""}`}>
            <ShoppingBag className="h-[18px] w-[18px]" />
            {count > 0 && <span className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 font-mono text-[10px] font-semibold text-white">{count}</span>}
          </button>
          <button type="button" onClick={() => setMenu((m) => !m)} className="grid h-10 w-10 place-items-center rounded-full text-fg-muted hover:bg-white/[0.06] hover:text-fg md:hidden" aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={menu}>
            {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menu && (
        <nav className="container-site animate-rise pb-6 md:hidden" aria-label="Menu">
          <ul className="divide-y divide-line border-t border-line">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="flex items-center justify-between py-4 text-[17px] font-medium">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/web/contact" className="flex py-4 text-[17px] font-medium">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
