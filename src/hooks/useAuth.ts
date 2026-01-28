/**
 * Hook d'authentification React
 * Fournit l'état d'authentification et les méthodes pour login/logout
 */

import { useState, useEffect, useCallback } from 'react';
import { AuthService, type AuthUser, type RegisterDto, type LoginDto } from '@/lib/auth.service';

interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

/**
 * Hook useAuth - Gestion de l'authentification
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <LoginForm onSubmit={login} />;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Bienvenue {user?.displayName}</p>
 *       <button onClick={logout}>Se déconnecter</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charger l'utilisateur depuis le token au montage du composant
   */
  const refreshUser = useCallback(() => {
    try {
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Failed to load user:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  /**
   * Connexion
   */
  const login = useCallback(async (dto: LoginDto) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.login(dto);
      const userData: AuthUser = {
        userId: response.userId,
        email: response.email,
        displayName: response.displayName,
        role: response.role,
      };
      setUser(userData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err; // Propager l'erreur pour que le composant puisse la gérer
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Inscription
   */
  const register = useCallback(async (dto: RegisterDto) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.register(dto);
      const userData: AuthUser = {
        userId: response.userId,
        email: response.email,
        displayName: response.displayName,
        role: response.role,
      };
      setUser(userData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Déconnexion
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await AuthService.logout();
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
  };
}
