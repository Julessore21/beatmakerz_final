"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaTimes } from "react-icons/fa";

type SearchResult = {
  title: string;
  description: string;
};

interface Props {
  onClose: () => void;
}

const SearchOverlay: React.FC<Props> = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setError(null);
      setLoading(false);
      setShowLoader(false);
    }
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    setResults([]);
    setLoading(true);
    setError(null);
    setShowLoader(true);

    try {
      const response = await fetch(
        `https://votre-api.com/search?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la recherche");
      }
      const data = await response.json();
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
    setTimeout(() => setShowLoader(false), 500);
  };

  const handleSearchIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-start pt-5 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
        <motion.button
          onClick={onClose}
          className="absolute top-5 right-5 text-white text-2xl focus:outline-none rounded-full p-2"
          initial={{ rotate: 0, opacity: 1 }}
          whileHover={{ rotate: 90 }}
          whileTap={{ rotate: 180, scale: 0.9 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <FaTimes />
        </motion.button>

        <div className="w-full max-w-3xl flex items-center px-4">
          <form onSubmit={handleSubmit} className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher sur le site..."
              className="w-full py-2 pl-4 pr-12 text-lg rounded-full bg-gray-800 text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSearchIconClick}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white rounded-full p-2 hover:bg-gray-700 transition-colors"
            >
              <FaSearch />
            </button>
            <AnimatePresence>
              {showLoader && (
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "linear" }}
                  style={{
                    originX: 0,
                    backgroundColor: "rgba(73, 36, 73, 0.8)",
                  }}
                />
              )}
            </AnimatePresence>
          </form>
        </div>

        <div className="mt-8 w-full max-w-3xl px-4">
          {loading ? (
            <p className="text-white">Chargement...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : results.length > 0 ? (
            <ul className="space-y-4">
              {results.map((item, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-800 rounded text-white hover:bg-gray-700 cursor-pointer"
                >
                  <h2 className="font-bold">{item.title}</h2>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          ) : query ? (
            <p className="mt-4 text-white">
              Aucun résultat trouvé pour &quot;{query}&quot;
            </p>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchOverlay;
