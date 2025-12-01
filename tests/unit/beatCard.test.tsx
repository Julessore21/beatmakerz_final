import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BeatCard from '@/components/BeatCard';
import { CartProvider, useCart } from '@/context/CartContext';
import { vi } from 'vitest';

const CartProbe = () => {
  const { totalItems } = useCart();
  return <div data-testid="cart-count">{totalItems}</div>;
};

describe('BeatCard', () => {
  it('ajoute le beat au panier et déclenche le callback', async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();

    render(
      <CartProvider>
        <BeatCard
          id={42}
          name="Space Wave"
          artist="Nova Wave"
          genre="Trap"
          bpm={120}
          keySig="Am"
          price={29.99}
          tag="Tendance"
          isCurrent={false}
          isPlaying={false}
          onPlayPause={vi.fn()}
          onAdd={onAdd}
        />
        <CartProbe />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');

    await user.click(screen.getByTestId('action-add-to-cart'));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
  });
});
