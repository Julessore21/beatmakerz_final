/**
 * Store de favoris
 * TODO: Migrer vers le backend (/me/favorites)
 * Pour l'instant, garde les favoris en localStorage
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavState = {
  favIds: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
};

export const useFavs = create<FavState>()(
  persist(
    (set, get) => ({
      favIds: [],
      toggle: (id) => {
        const setIds = new Set(get().favIds);
        setIds.has(id) ? setIds.delete(id) : setIds.add(id);
        set({ favIds: [...setIds] });
      },
      has: (id) => get().favIds.includes(id),
      clear: () => set({ favIds: [] }),
    }),
    { name: "bmz-favs" }
  )
);
