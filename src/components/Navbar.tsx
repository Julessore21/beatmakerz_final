"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaInstagram, FaTiktok, FaYoutube, FaEnvelope } from "react-icons/fa";
// SearchBar supprimé
import CartSideBar from "./CartSideBar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const AnimatedTwoBarsToggle = ({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) => {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      className="relative z-[100] w-6 h-6 focus:outline-none duration-100"
      whileHover={{ scaleY: 1 }}
      whileTap={{ scale: 1 }}
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <>
            <motion.div
              key="bar-top"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bg-white w-full h-0.5"
              style={{ top: "30%" }}
            />
            <motion.div
              key="bar-bottom"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bg-white w-full h-0.5"
              style={{ top: "70%" }}
            />
          </>
        ) : (
          <>
            <motion.div
              key="bar-top-open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 45, top: "50%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bg-white w-full h-0.5"
            />
            <motion.div
              key="bar-bottom-open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: -45, top: "50%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bg-white w-full h-0.5"
            />
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const primaryNavLinks = [
  ["/", "Accueil"],
  ["/catalogue", "Catalogue"],
  ["/abonnements", "Abonnements"],
  ["/prodsurmesure", "Prod personnalisée"],
  ["/web/marketplace", "Marketplace"],
  ["/cartecadeau", "Carte cadeau"],
  ["/programmefidelite", "Programme fidélité"],
];

const secondaryNavLinks = [
  ["/tarification", "Tarification"],
  ["/faq", "FAQ"],
  ["/retractation", "Droit de rétractation"],
  ["/politique", "Politique de confidentialité"],
  ["/cgv", "CGV"],
  ["/cgu", "CGU"],
  ["/mentions", "Mentions légales"],
  ["/contact", "Contact"],
];

const UnderlineLink = ({
  text,
  href,
  onClick,
  textSize = "text-xs",
}: {
  text: string;
  href: string;
  onClick?: () => void;
  textSize?: string;
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setWidth(textRef.current.offsetWidth);
    }
  }, [text]);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative font-semibold py-1 ${textSize} uppercase`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span ref={textRef} className="transition-colors">
        {text}
      </span>
      <span
        className="absolute left-0 bottom-0 h-[1.5px] bg-white transition-all duration-300"
        style={{ width: hovered ? `${width}px` : "0px" }}
      />
    </Link>
  );
};

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  // recherche supprimée
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { totalItems } = useCart();
  const { user } = useAuth();

  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const toggleMenu = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen((prev) => !prev);
    setTimeout(() => setIsAnimating(false), 100);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 text-white px-4 sm:px-6 lg:px-12 py-4 sm:py-6 flex items-center justify-between transition-colors duration-300 ${
          isHome ? "bg-transparent" : "bg-gradient-to-b from-[#0b0b14]/95 via-[#0b0b14]/80 to-transparent backdrop-blur-xl"
        }`}
      >
        {/* Toggle menu */}
        <div className="flex items-center m-2 space-x-2 cursor-pointer">
          <AnimatedTwoBarsToggle isOpen={isOpen} toggle={toggleMenu} />
          <UnderlineLink text="MENU" onClick={toggleMenu} href="#" />
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/#hero">
            <h1 className="text-sm sm:text-base font-bold tracking-[0.35em] sm:tracking-widest cursor-pointer uppercase">
              BEATMAKERZ
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-2 md:hidden">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsCartOpen(true);
            }}
            className="p-1.5 rounded-full border border-white/20 relative"
          >
            <img src="/img/panier.png" alt="Panier" className="h-3.5 w-3.5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1 rounded-full">
                {totalItems}
              </span>
            )}
          </button>

          <Link
            href={user ? "/account" : "/profil"}
            className="p-1.5 rounded-full border border-white/20"
          >
            <img src="/img/profil.png" alt="Profil" className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <UnderlineLink href="/catalogue" text="CATALOGUE" />
            <UnderlineLink href="/abonnements" text="ABONNEMENTS" />
            <UnderlineLink href="/prodsurmesure" text="PROD SUR MESURE" />
            <UnderlineLink href="/web/marketplace" text="MARKETPLACE" />
          </div>

          <div className="flex items-center space-x-2 ml-6">
            {/* Inversé: Panier d'abord, puis Profil */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsCartOpen(true);
              }}
              className="p-1 rounded-full border border-white/20 relative"
            >
              <img src="/img/panier.png" alt="Panier" className="h-3 w-3" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            <Link
              href={user ? "/account" : "/profil"}
              className="p-1 rounded-full border border-white/20"
            >
              <img src="/img/profil.png" alt="Profil" className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />
              <div
                ref={overlayRef}
                className="absolute top-0 left-0 h-screen w-full max-w-[360px] bg-black/80 backdrop-blur-3xl text-white shadow-[10px_0_50px_rgba(0,0,0,0.6)] flex flex-col border-r border-white/5"
              >
                <div className="flex items-center justify-between border-b border-white/10 px-5 pt-6 pb-4">
                  <span className="text-xs tracking-[0.5em] uppercase text-white/60">Menu</span>
                  <button
                    type="button"
                    onClick={toggleMenu}
                    className="text-sm uppercase tracking-wide text-white/70 hover:text-white transition"
                  >
                    Fermer
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
                  <div className="space-y-1">
                    <div className="text-[10px] font-semibold tracking-[0.4em] uppercase text-zinc-400">Navigation</div>
                    {primaryNavLinks.map(([href, label]) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={toggleMenu}
                        className="block text-lg font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="text-[10px] font-semibold tracking-[0.4em] uppercase text-zinc-400 mb-2">Infos & Legal</div>
                    <div className="space-y-2">
                      {secondaryNavLinks.map(([href, label]) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={toggleMenu}
                          className="block text-[13px] font-semibold uppercase tracking-wide text-white/80 transition-colors hover:text-white"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between text-xs uppercase tracking-widest text-zinc-400">
                      <span>Suivez-nous</span>
                      <div className="flex items-center gap-3 text-white/70">
                        <a
                          href="https://www.instagram.com/beatmakerz_pro/"
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Instagram"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 hover:border-white/40"
                        >
                          <FaInstagram className="h-4 w-4" />
                        </a>
                        <a
                          href="https://www.tiktok.com/@beatmakerz.pro"
                          target="_blank"
                          rel="noreferrer"
                          aria-label="TikTok"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 hover:border-white/40"
                        >
                          <FaTiktok className="h-4 w-4" />
                        </a>
                        <a
                          href="https://www.youtube.com/@BEATMAKERZ-PRO"
                          target="_blank"
                          rel="noreferrer"
                          aria-label="YouTube"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 hover:border-white/40"
                        >
                          <FaYoutube className="h-4 w-4" />
                        </a>
                        <a
                          href="mailto:beatmakerz.contact@gmail.com"
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Email"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 hover:border-white/40"
                        >
                          <FaEnvelope className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recherche supprimée */}
      </nav>

      <CartSideBar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default NavBar;
