/**
 * Context d'authentification global
 * Fournit l'état d'authentification à toute l'application
 * Utilise l'API backend JWT (remplace l'ancien système)
 */

'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AuthService, type AuthUser, type RegisterDto, type LoginDto } from '@/lib/auth.service';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider d'authentification
 * À placer à la racine de l'application
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * export default function RootLayout({ children }: { children: ReactNode }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthProvider>
 *           {children}
 *         </AuthProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charger l'utilisateur au montage
   */
  const refreshUser = () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Failed to load user:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  /**
   * Rafraîchir automatiquement le token avant qu'il n'expire
   * Les access tokens expirent après 15 minutes
   */
  useEffect(() => {
    if (!user) return;

    // Rafraîchir le token toutes les 10 minutes (avant expiration de 15min)
    const refreshInterval = setInterval(
      async () => {
        try {
          await AuthService.refresh();
          refreshUser();
        } catch (err) {
          console.error('Auto-refresh failed:', err);
          // Si le refresh échoue, déconnecter l'utilisateur
          setUser(null);
        }
      },
      10 * 60 * 1000,
    ); // 10 minutes

    return () => clearInterval(refreshInterval);
  }, [user]);

  /**
   * Connexion
   */
  const login = async (dto: LoginDto) => {
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
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Inscription
   */
  const register = async (dto: RegisterDto) => {
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
  };

  /**
   * Déconnexion
   */
  const logout = async () => {
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
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook pour utiliser le context d'authentification
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, logout } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <p>Non connecté</p>;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Bienvenue {user?.displayName}</p>
 *       <button onClick={logout}>Déconnexion</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
