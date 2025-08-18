import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaWeibo,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-black via-[#1A1530] to-[#000000] text-white py-12 px-10">
      <div className="w-full max-w-screen-xl mx-auto border-t border-gray-700 pt-10 flex flex-col md:flex-row justify-between items-start">
        <div className="text-left md:w-auto">
          <h2 className="text-4xl font-bold tracking-wide uppercase">
            Beatmakerz
          </h2>
        </div>

        <div className="flex flex-wrap justify-center md:justify-between gap-12 text-sm">
          <div className="flex flex-col space-y-2 text-center md:text-left">
            <h2 className="text-lg font-semibold uppercase">LA MARQUE</h2>
            <a href="#" className="hover:text-gray-400 transition">
              Savoir-faire
            </a>
            <a href="#" className="hover:text-gray-400 transition">
              Collections
            </a>
            <a href="#" className="hover:text-gray-400 transition">
              Amis et partenaires
            </a>
            <a href="#" className="hover:text-gray-400 transition">
              Nos boutiques
            </a>
            <a href="#" className="hover:text-gray-400 transition">
              Événements
            </a>
          </div>

          <div className="flex flex-col space-y-2 text-center md:text-left">
            <h2 className="text-lg font-semibold uppercase">
              Modèles historiques
            </h2>
            <a href="#" className="hover:text-gray-400 transition">
              Seconde main
            </a>
            <h2 className="text-lg font-semibold mt-6 uppercase">Entretien</h2>
            <a href="#" className="hover:text-gray-400 transition">
              Réservez un rendez-vous
            </a>
          </div>
        </div>
      </div>

      <div className="w-full mt-8 flex justify-center border-t border-gray-700 pt-6 text-lg space-x-6">
        <a
          href="#"
          className="hover:text-gray-400 transition"
          aria-label="Twitter"
        >
          <FaTwitter />
        </a>
        <a
          href="#"
          className="hover:text-gray-400 transition"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
        <a
          href="#"
          className="hover:text-gray-400 transition"
          aria-label="YouTube"
        >
          <FaYoutube />
        </a>
      </div>

      <div className="w-full mt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs border-t border-gray-700 pt-4">
        <span>© Beatmakerz 2025</span>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-white">
            EN
          </a>
          <a href="#" className="text-white">
            FR
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
