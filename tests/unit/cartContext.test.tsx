import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, beforeEach, describe, it, expect } from 'vitest';

const auth = vi.hoisted(() => ({
  isAuthenticated: vi.fn(() => true),
  authenticatedFetch: vi.fn(),
}));
vi.mock('@/lib/auth.service', () => ({ AuthService: auth }));
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: { userId: 'u1', email: 'a@b.fr' }, isLoading: false }),
}));

import { CartProvider, useCart } from '@/context/CartContext';

const json = (body: unknown, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(body), { status }));

const serverCart = {
  items: [
    { _id: 'ci1', beatId: 'b1', licenseTypeId: 'l1', qty: 1, unitPriceSnapshotCents: 1999, beat: { title: 'Space Wave' } },
  ],
  totalCents: 1999,
};

const wrapper = ({ children }: { children: React.ReactNode }) => <CartProvider>{children}</CartProvider>;

describe('CartContext', () => {
  beforeEach(() => {
    auth.isAuthenticated.mockReturnValue(true);
    auth.authenticatedFetch.mockReset();
  });

  it("charge le panier depuis l'API", async () => {
    auth.authenticatedFetch.mockImplementation(() => json(serverCart));
    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.items).toHaveLength(1));
    expect(result.current.items[0]).toMatchObject({ id: 'b1', name: 'Space Wave', price: 19.99, cartItemId: 'ci1' });
    expect(result.current.totalPrice).toBeCloseTo(19.99);
  });

  it('vide aussi le panier côté API', async () => {
    let cart = serverCart;
    auth.authenticatedFetch.mockImplementation((url: string, init?: RequestInit) => {
      if (init?.method === 'DELETE') {
        cart = { items: [], totalCents: 0 };
        return json({});
      }
      return json(cart);
    });
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.items).toHaveLength(1));

    await act(() => result.current.clearCart());

    expect(auth.authenticatedFetch).toHaveBeenCalledWith('/me/cart/items/ci1', { method: 'DELETE' });
    expect(result.current.items).toHaveLength(0);
  });

  it("renvoie un message clair si la session de paiement échoue", async () => {
    auth.authenticatedFetch.mockImplementation((url: string) =>
      url === '/checkout/session' ? json({ message: 'Cart is empty' }, 400) : json(serverCart)
    );
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.items).toHaveLength(1));

    let error: string | null = null;
    await act(async () => {
      error = await result.current.checkout();
    });

    expect(error).toBe('Cart is empty');
  });

  it("reste vide pour un visiteur non connecté", async () => {
    auth.isAuthenticated.mockReturnValue(false);
    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toHaveLength(0);
    expect(auth.authenticatedFetch).not.toHaveBeenCalled();
  });
});
