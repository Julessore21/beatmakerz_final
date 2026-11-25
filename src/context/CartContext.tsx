"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthService } from "@/lib/auth.service";
import { useAuth } from "@/context/AuthContext";
import type { Beat, BeatPrice } from "@/lib/catalog";

/**
 * Panier.
 * - Sans compte : gardé dans ce navigateur, on ajoute tout de suite (le visiteur de TikTok n'attend pas).
 * - Connecté : l'API est la source de vérité ; le panier du navigateur y est versé à la connexion.
 * Une prod n'est qu'une fois dans le panier (changer de licence remplace la précédente).
 */
export interface CartLine {
  beatId: string;
  licenseTypeId: string;
  licenseCode: string;
  title: string;
  coverUrl: string | null;
  /** Genres de la prod : pour dessiner sa pochette. */
  genres?: string[];
  priceCents: number;
  currency: string;
  /** Ligne côté API (absente tant qu'on n'est pas connecté). */
  cartItemId?: string;
}

interface CartValue {
  lines: CartLine[];
  count: number;
  totalCents: number;
  currency: string;
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  has: (beatId: string) => boolean;
  add: (beat: Beat, price: BeatPrice, opts?: { open?: boolean }) => Promise<boolean>;
  remove: (beatId: string) => Promise<void>;
  /** Lance le paiement Stripe. « login » : il faut d'abord un compte. Sinon un message d'erreur, ou null (redirigé). */
  checkout: () => Promise<"login" | string | null>;
  refresh: () => Promise<void>;
}

const CartCtx = createContext<CartValue | undefined>(undefined);
const GUEST_KEY = "bmz-cart";

function readGuest(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(GUEST_KEY);
    const list = raw ? (JSON.parse(raw) as CartLine[]) : [];
    return Array.isArray(list) ? list.filter((l) => l && l.beatId && l.licenseTypeId) : [];
  } catch {
    return [];
  }
}
function writeGuest(lines: CartLine[]) {
  try {
    if (lines.length) window.localStorage.setItem(GUEST_KEY, JSON.stringify(lines));
    else window.localStorage.removeItem(GUEST_KEY);
  } catch {
    /* navigation privée : le panier vit le temps de la page */
  }
}

type ApiCartItem = {
  _id?: string;
  beatId?: string;
  licenseTypeId?: string;
  unitPriceSnapshotCents?: number;
  beat?: { title?: string; coverUrl?: string; genres?: string[] } | null;
  licenseType?: { code?: string; currency?: string } | null;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const merging = useRef(false);

  const fetchServer = useCallback(async () => {
    const res = await AuthService.authenticatedFetch("/me/cart");
    if (!res.ok) throw new Error("Le panier ne répond pas.");
    const data = (await res.json()) as { items?: ApiCartItem[] };
    const mapped = (data.items ?? [])
      .filter((it) => it.beatId && it.licenseTypeId)
      .map<CartLine>((it) => ({
        beatId: String(it.beatId),
        licenseTypeId: String(it.licenseTypeId),
        licenseCode: it.licenseType?.code ?? "Basic",
        title: it.beat?.title ?? "Prod",
        coverUrl: it.beat?.coverUrl ?? null,
        genres: it.beat?.genres ?? [],
        priceCents: it.unitPriceSnapshotCents ?? 0,
        currency: it.licenseType?.currency ?? "EUR",
        cartItemId: it._id,
      }));
    setLines(mapped);
  }, []);

  const postLine = (beatId: string, licenseTypeId: string) =>
    AuthService.authenticatedFetch("/me/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ beatId, licenseTypeId, qty: 1 }),
    });

  const refresh = useCallback(async () => {
    setError(null);
    if (!AuthService.isAuthenticated()) {
      setLines(readGuest());
      setIsLoading(false);
      return;
    }
    try {
      // Connexion : le panier du navigateur rejoint celui du compte, une seule fois.
      const guest = readGuest();
      if (guest.length && !merging.current) {
        merging.current = true;
        await Promise.all(guest.map((l) => postLine(l.beatId, l.licenseTypeId).catch(() => null)));
        writeGuest([]);
        merging.current = false;
      }
      await fetchServer();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Le panier ne répond pas.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchServer]);

  useEffect(() => {
    if (authLoading) return;
    void refresh();
  }, [authLoading, user?.userId, refresh]);

  const has = useCallback((beatId: string) => lines.some((l) => l.beatId === beatId), [lines]);

  const add = useCallback(
    async (beat: Beat, price: BeatPrice, opts?: { open?: boolean }) => {
      setError(null);
      const line: CartLine = {
        beatId: beat.id,
        licenseTypeId: price.licenseTypeId,
        licenseCode: price.code,
        title: beat.title,
        coverUrl: beat.coverUrl,
        genres: beat.genres,
        priceCents: price.priceCents,
        currency: price.currency,
      };
      const previous = lines.find((l) => l.beatId === beat.id);
      setLines((cur) => [...cur.filter((l) => l.beatId !== beat.id), line]);
      if (opts?.open !== false) setIsOpen(true);
      if (!AuthService.isAuthenticated()) {
        writeGuest([...readGuest().filter((l) => l.beatId !== beat.id), line]);
        return true;
      }
      try {
        if (previous?.cartItemId && previous.licenseTypeId !== price.licenseTypeId) {
          await AuthService.authenticatedFetch(`/me/cart/items/${previous.cartItemId}`, { method: "DELETE" });
        }
        const res = await postLine(beat.id, price.licenseTypeId);
        if (!res.ok) throw new Error(res.status === 400 ? "Cette prod n’est plus disponible." : "Ajout impossible pour le moment.");
        await fetchServer();
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Ajout impossible pour le moment.");
        await fetchServer().catch(() => undefined);
        return false;
      }
    },
    [lines, fetchServer],
  );

  const remove = useCallback(
    async (beatId: string) => {
      const target = lines.find((l) => l.beatId === beatId);
      setLines((cur) => cur.filter((l) => l.beatId !== beatId));
      if (!AuthService.isAuthenticated()) {
        writeGuest(readGuest().filter((l) => l.beatId !== beatId));
        return;
      }
      if (!target?.cartItemId) return;
      try {
        await AuthService.authenticatedFetch(`/me/cart/items/${target.cartItemId}`, { method: "DELETE" });
      } finally {
        await fetchServer().catch(() => undefined);
      }
    },
    [lines, fetchServer],
  );

  const checkout = useCallback(async () => {
    if (!AuthService.isAuthenticated()) return "login" as const;
    try {
      const res = await AuthService.authenticatedFetch("/checkout/session", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
      if (!res.ok || !data.url) {
        if (res.status === 401) return "login" as const;
        return data.message && typeof data.message === "string" ? data.message : "Le paiement ne se lance pas pour le moment.";
      }
      window.location.href = data.url;
      return null;
    } catch (e) {
      return e instanceof Error && /expired|Not authenticated/i.test(e.message) ? ("login" as const) : "Impossible de joindre le serveur de paiement.";
    }
  }, []);

  const value = useMemo<CartValue>(
    () => ({
      lines,
      count: lines.length,
      totalCents: lines.reduce((s, l) => s + l.priceCents, 0),
      currency: lines[0]?.currency ?? "EUR",
      isLoading,
      error,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      has,
      add,
      remove,
      checkout,
      refresh,
    }),
    [lines, isLoading, error, isOpen, has, add, remove, checkout, refresh],
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart doit être utilisé dans CartProvider");
  return ctx;
}
