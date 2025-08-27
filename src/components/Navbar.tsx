"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaEnvelope,
  FaSearch,
} from "react-icons/fa";
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
      <nav className="fixed top-0 w-full z-50 bg-transparent text-white px-12 py-6 flex items-center justify-between">
        {/* Toggle menu */}
        <div className="flex items-center m-2 space-x-2 cursor-pointer">
          <AnimatedTwoBarsToggle isOpen={isOpen} toggle={toggleMenu} />
          <UnderlineLink text="MENU" onClick={toggleMenu} href="#" />
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/#hero">
            <h1 className="text-base font-bold tracking-widest cursor-pointer uppercase">
              BEATMAKERZ
            </h1>
          </Link>
        </div>

        <div className="flex items-center justify-between">
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
              {/* voile flouté/assombri */}
              <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />
              <div
                ref={overlayRef}
                className="absolute top-0 left-0 h-screen w-2/5 bg-black bg-opacity-60 backdrop-blur-xl text-white transform transition-transform duration-300 flex flex-col pt-16 space-y-8"
              >
                <div className="flex flex-col items-start ml-8 mt-1 pl-6 space-y-4">
                  {[
                    ["/", "ACCUEIL"],
                    ["/catalogue", "CATALOGUE"],
                    ["/abonnements", "ABONNEMENTS"],
                    ["/prodsurmesure", "PROD PERSONNALISÉE"],
                    ["/web/marketplace", "MARKETPLACE"],
                    ["/cartecadeau", "CARTE CADEAU"],
                    ["/programmefidelite", "PROGRAMME FIDÉLITÉ"],
                  ].map(([href, text]) => (
                    <UnderlineLink
                      key={href}
                      href={href}
                      text={text}
                      textSize="text-4xl"
                      onClick={toggleMenu}
                    />
                  ))}
                </div>

                <div className="flex ml-8 flex-col items-start pl-6 space-y-2 mt-12">
                  <div className="w-[95%] border-t-2 border-white opacity-25"></div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {[
                      ["/tarification", "TARIFICATION"],
                      ["/faq", "FAQ"],
                      ["/droit", "DROIT DE RÉTRACTATION"],
                      ["/politique", "POLITIQUE DE CONFIDENTIALITÉ"],
                    ].map(([href, text]) => (
                      <UnderlineLink
                        key={href}
                        href={href}
                        text={text}
                        textSize="text-sm"
                        onClick={toggleMenu}
                      />
                    ))}
                  </div>
                  <div className="w-[95%] border-b-2 border-white opacity-25"></div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {[
                      ["/cgv", "CGV"],
                      ["/cgu", "CGU"],
                      ["/mentions", "MENTIONS LÉGALES"],
                      ["/contact", "CONTACT"],
                    ].map(([href, text]) => (
                      <UnderlineLink
                        key={href}
                        href={href}
                        text={text}
                        textSize="text-sm"
                        onClick={toggleMenu}
                      />
                    ))}
                  </div>
                  <div className="w-[95%] border-b-2 border-white opacity-25"></div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-10 mt-12">
                  <div className="flex items-center justify-center space-x-8">
                    <a
                      href="https://www.instagram.com/beatmakerz_pro/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram className="text-white w-7 h-7 hover:text-gray-400" />
                    </a>
                    <a
                      href="https://www.tiktok.com/@beatmakerz.pro"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTiktok className="text-white w-7 h-7 hover:text-gray-400" />
                    </a>
                    <a
                      href="https://www.youtube.com/@BEATMAKERZ-PRO"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaYoutube className="text-white w-7 h-7 hover:text-gray-400" />
                    </a>
                    <a
                      href="mailto:beatmakerz.contact@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaEnvelope className="text-white w-7 h-7 hover:text-gray-400" />
                    </a>
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
