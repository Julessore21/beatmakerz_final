import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/context/CartContext';

import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  beforeEach(() => {
    const storage = window.localStorage;
    storage.clear();
  });

  it('ajoute un article et incrémente les totaux', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({ id: 1, name: 'Beat Test', price: 19.99 });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({
      id: 1,
      name: 'Beat Test',
      price: 19.99,
      quantity: 1,
    });
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBeCloseTo(19.99);
  });

  it('cumule les quantités pour un article existant', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({ id: 1, name: 'Beat Duplicate', price: 10 });
      result.current.addItem({ id: 1, name: 'Beat Duplicate', price: 10 });
    });

    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBeCloseTo(20);
  });

  it('décrémente puis supprime un article', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({ id: 'b1', name: 'Beat One', price: 15 });
      result.current.addItem({ id: 'b2', name: 'Beat Two', price: 20 });
      result.current.decrementItem('b1');
    });

    expect(result.current.items.find((item) => item.id === 'b1')).toBeUndefined();
    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBeCloseTo(20);

    act(() => {
      result.current.removeItem('b2');
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });
});
