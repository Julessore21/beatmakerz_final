/**
 * Context de favoris global
 * Centralise la gestion des favoris avec l'API backend
 * Les favoris sont synchronisés entre tous les composants
 */

'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { fetchFavorites, toggleFavorite as toggleFavoriteApi } from '@/lib/services/user-api';
import { useAuth } from './AuthContext';

interface FavoritesContextValue {
  /** Liste des IDs de beats favoris */
  favIds: string[];
  /** Indique si les favoris sont en cours de chargement */
  isLoading: boolean;
  /** Erreur eventuelle */
  error: string | null;
  /** Ajouter/retirer un beat des favoris (toggle) */
  toggle: (beatId: string) => Promise<void>;
  /** Verifier si un beat est dans les favoris */
  has: (beatId: string) => boolean;
  /** Rafraichir les favoris depuis le backend */
  refresh: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

/**
 * Provider de favoris
 * A placer dans le layout, apres AuthProvider
 */
export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [favIds, setFavIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charger les favoris depuis le backend
   */
  const refresh = useCallback(async () => {
    // Ne pas charger si auth pas encore prete ou non connecte
    if (authLoading || !isAuthenticated) {
      setFavIds([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const items = await fetchFavorites();
      setFavIds(items.map((f) => f.beatId));
    } catch (err: any) {
      // Ignorer silencieusement les erreurs 401 (non authentifie)
      if (err?.message?.includes('401')) {
        setFavIds([]);
        return;
      }
      console.error('Failed to fetch favorites:', err);
      setError('Impossible de charger les favoris');
      setFavIds([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  /**
   * Charger les favoris au montage et quand l'auth change
   */
  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * Toggle un favori (optimistic update)
   */
  const toggle = useCallback(async (beatId: string) => {
    if (!isAuthenticated) {
      setError('Vous devez etre connecte pour ajouter des favoris');
      return;
    }

    // Optimistic update
    const wasInFavs = favIds.includes(beatId);
    setFavIds((prev) =>
      wasInFavs ? prev.filter((id) => id !== beatId) : [...prev, beatId]
    );

    try {
      await toggleFavoriteApi(beatId);
    } catch (err) {
      // Rollback on error
      setFavIds((prev) =>
        wasInFavs ? [...prev, beatId] : prev.filter((id) => id !== beatId)
      );
      console.error('Failed to toggle favorite:', err);
      setError('Impossible de mettre a jour les favoris');
    }
  }, [isAuthenticated, favIds]);

  /**
   * Verifier si un beat est favori
   */
  const has = useCallback((beatId: string) => {
    return favIds.includes(beatId);
  }, [favIds]);

  const value: FavoritesContextValue = {
    favIds,
    isLoading,
    error,
    toggle,
    has,
    refresh,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

/**
 * Hook pour utiliser le context des favoris
 *
 * @example
 * ```tsx
 * function BeatCard({ beatId }) {
 *   const { has, toggle } = useFavorites();
 *   const isFav = has(beatId);
 *
 *   return (
 *     <button onClick={() => toggle(beatId)}>
 *       {isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);

  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }

  return context;
}
