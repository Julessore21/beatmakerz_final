"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "@/lib/services/api-client";

export type CartItem = {
  id: number | string;
  beatId?: string;
  licenseTypeId?: string;
  cartItemId?: string;
  name: string;
  price: number;
  quantity: number;
};

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: CartItem["id"]) => void;
  decrementItem: (id: CartItem["id"]) => void;
  setQuantity: (id: CartItem["id"], qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setHydrated] = useState(false);
  const envDefaultLicenseId = process.env.NEXT_PUBLIC_LICENSE_TYPE_ID;
  const [defaultLicenseId] = useState<string | null>(envDefaultLicenseId ?? null);

  // Charge l'état du localStorage pour les visiteurs non connectés
  const loadFromLocal = () => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem("bm:cart");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as CartItem[];
      }
    } catch {
      /* ignore */
    }
    return [];
  };

  const persistLocal = (next: CartItem[]) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("bm:cart", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const fetchCart = async () => {
    try {
      const data = await apiGet<{ items: any[]; totalCents: number; updatedAt?: string }>("/me/cart");
      const mapped =
        data.items?.map((it) => ({
          id: it.beatId,
          beatId: it.beatId,
          licenseTypeId: it.licenseTypeId,
          cartItemId: it.id || it._id,
          name: it.beat?.title || "Beat",
          price: (it.unitPriceSnapshotCents ?? 0) / 100,
          quantity: it.qty ?? 1,
        })) || [];
      setItems(mapped);
      persistLocal(mapped);
    } catch {
      // ignore (not logged in)
      const local = loadFromLocal();
      setItems(local);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Initial local state (visiteur)
    const local = loadFromLocal();
    if (local.length) setItems(local);
    fetchCart()
      .catch(() => {
        /* ignore */
      })
      .finally(() => setHydrated(true));
  }, []);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    const beatId = (item.beatId ?? item.id)?.toString();
    const licenseTypeId = item.licenseTypeId ?? defaultLicenseId ?? "lic-basic";
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        const next = prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
        persistLocal(next);
        return next;
      }
      const next = [...prev, { ...item, beatId, licenseTypeId, quantity: 1 }];
      persistLocal(next);
      return next;
    });
    apiPost("/me/cart/items", { beatId, licenseTypeId, qty: 1 }).then(fetchCart).catch(() => {});
  };

  const removeItem = (id: CartItem["id"]) => {
    const target = items.find((i) => i.id === id);
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      persistLocal(next);
      return next;
    });
    if (target?.cartItemId) {
      apiDelete(`/me/cart/items/${target.cartItemId}`).then(fetchCart).catch(() => {});
    }
  };

  const decrementItem = (id: CartItem["id"]) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    const nextQty = target.quantity - 1;
    if (nextQty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, quantity: nextQty } : i));
      persistLocal(next);
      return next;
    });
    if (target.cartItemId) {
      apiPost("/me/cart/items", { beatId: target.beatId ?? id, licenseTypeId: target.licenseTypeId ?? "lic-basic", qty: nextQty })
        .then(fetchCart)
        .catch(() => {});
    }
  };

  const setQuantity = (id: CartItem["id"], qty: number) => {
    const target = items.find((i) => i.id === id);
    setItems((prev) => {
      let next: CartItem[];
      if (qty <= 0) {
        next = prev.filter((i) => i.id !== id);
      } else {
        next = prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i));
      }
      persistLocal(next);
      return next;
    });
    if (target?.cartItemId) {
      apiPost("/me/cart/items", { beatId: target.beatId ?? id, licenseTypeId: target.licenseTypeId ?? "lic-basic", qty })
        .then(fetchCart)
        .catch(() => {});
    }
  };

  const clearCart = () => {
    setItems([]);
    persistLocal([]);
  };

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, decrementItem, setQuantity, clearCart, totalItems, totalPrice, refresh: fetchCart }}
    >
      {isHydrated ? children : null}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};

