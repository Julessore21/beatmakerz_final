/**
 * CartContext - Gestion du panier
 * Backend-first : Le backend est la source unique de vérité
 * Le localStorage est utilisé uniquement comme cache optimiste
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "@/lib/auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://beatmakerz-api.onrender.com';

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
  addItem: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeItem: (id: CartItem["id"]) => Promise<void>;
  decrementItem: (id: CartItem["id"]) => Promise<void>;
  setQuantity: (id: CartItem["id"], qty: number) => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalCents: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalCents, setTotalCents] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const envDefaultLicenseId = process.env.NEXT_PUBLIC_LICENSE_TYPE_ID;

  /**
   * Charger le panier depuis le backend
   */
  const fetchCart = async () => {
    try {
      setError(null);

      // Si pas authentifié, panier vide
      if (!AuthService.isAuthenticated()) {
        setItems([]);
        setTotalCents(0);
        setIsLoading(false);
        return;
      }

      const response = await AuthService.authenticatedFetch('/me/cart');

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();

      const mapped: CartItem[] = data.items?.map((it: any) => ({
        id: it.beatId,
        beatId: it.beatId,
        licenseTypeId: it.licenseTypeId,
        cartItemId: it._id,
        name: it.beat?.title || "Beat",
        price: (it.unitPriceSnapshotCents ?? 0) / 100,
        quantity: it.qty ?? 1,
      })) || [];

      setItems(mapped);
      setTotalCents(data.totalCents || 0);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
      // En cas d'erreur, garder le panier vide (pas de localStorage fallback)
      setItems([]);
      setTotalCents(0);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Charger le panier au montage
   */
  useEffect(() => {
    fetchCart();
  }, []);

  /**
   * Ajouter un item au panier
   */
  const addItem = async (item: Omit<CartItem, "quantity">) => {
    const beatId = (item.beatId ?? item.id)?.toString();
    const licenseTypeId = item.licenseTypeId ?? envDefaultLicenseId;

    if (!beatId || !licenseTypeId) {
      setError('Invalid item: missing beatId or licenseTypeId');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      // Optimistic update
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
        }
        return [...prev, { ...item, beatId, licenseTypeId, quantity: 1 }];
      });

      const response = await AuthService.authenticatedFetch('/me/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          beatId,
          licenseTypeId,
          qty: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      // Recharger le panier depuis le backend (source de vérité)
      await fetchCart();
    } catch (err) {
      console.error('Failed to add item:', err);
      setError(err instanceof Error ? err.message : 'Failed to add item');
      // Rollback optimistic update
      await fetchCart();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Retirer un item du panier
   */
  const removeItem = async (id: CartItem["id"]) => {
    const target = items.find((i) => i.id === id);

    if (!target?.cartItemId) {
      setError('Invalid item: missing cartItemId');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      // Optimistic update
      setItems((prev) => prev.filter((i) => i.id !== id));

      const response = await AuthService.authenticatedFetch(`/me/cart/items/${target.cartItemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      // Recharger le panier
      await fetchCart();
    } catch (err) {
      console.error('Failed to remove item:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove item');
      // Rollback optimistic update
      await fetchCart();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Décrémenter la quantité d'un item
   */
  const decrementItem = async (id: CartItem["id"]) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;

    const nextQty = target.quantity - 1;

    if (nextQty <= 0) {
      await removeItem(id);
      return;
    }

    await setQuantity(id, nextQty);
  };

  /**
   * Définir la quantité d'un item
   */
  const setQuantity = async (id: CartItem["id"], qty: number) => {
    if (qty <= 0) {
      await removeItem(id);
      return;
    }

    const target = items.find((i) => i.id === id);

    if (!target?.beatId || !target?.licenseTypeId) {
      setError('Invalid item: missing beatId or licenseTypeId');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      // Optimistic update
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));

      const response = await AuthService.authenticatedFetch('/me/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          beatId: target.beatId,
          licenseTypeId: target.licenseTypeId,
          qty,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      // Recharger le panier
      await fetchCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
      // Rollback optimistic update
      await fetchCart();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Vider le panier (local uniquement, le backend le videra après paiement)
   */
  const clearCart = () => {
    setItems([]);
    setTotalCents(0);
  };

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        decrementItem,
        setQuantity,
        clearCart,
        totalItems,
        totalPrice,
        totalCents,
        isLoading,
        error,
        refresh: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};

