import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';

const addItem = vi.fn();
vi.mock('@/context/CartContext', () => ({ useCart: () => ({ addItem }) }));
vi.mock('@/context/AuthContext', () => ({ useAuth: () => ({ user: null }) }));

import BeatCard from '@/components/BeatCard';

const props = {
  id: 42,
  name: 'Space Wave',
  artist: 'Nova Wave',
  genre: 'Trap',
  bpm: 120,
  keySig: 'Am',
  price: 29.99,
  isCurrent: false,
  isPlaying: false,
  onPlayPause: vi.fn(),
};

describe('BeatCard', () => {
  it('délègue l’ajout au panier au parent quand onAdd est fourni (pas de double ajout)', async () => {
    const onAdd = vi.fn();
    render(<BeatCard {...props} onAdd={onAdd} />);

    await userEvent.setup().click(screen.getByTestId('action-add-to-cart'));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(addItem).not.toHaveBeenCalled();
  });

  it('affiche le prix en euros', () => {
    render(<BeatCard {...props} />);
    expect(screen.getByText('29.99 €')).toBeInTheDocument();
  });
});
