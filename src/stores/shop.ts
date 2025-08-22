import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  artist: string;
  price: number;
  cover?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: () => number;
  total: () => number;
};

type FavState = {
  favIds: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        const items = [...get().items];
        const i = items.findIndex((x) => x.id === item.id);
        if (i >= 0) items[i] = { ...items[i], qty: items[i].qty + qty };
        else items.push({ ...item, qty });
        set({ items });
      },
      dec: (id) => {
        const items = get()
          .items.map((x) =>
            x.id === id ? { ...x, qty: Math.max(0, x.qty - 1) } : x
          )
          .filter((x) => x.qty > 0);
        set({ items });
      },
      remove: (id) => set({ items: get().items.filter((x) => x.id !== id) }),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((a, b) => a + b.qty, 0),
      total: () => get().items.reduce((a, b) => a + Number(b.price) * b.qty, 0),
    }),
    { name: "bmz-cart" }
  )
);

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
