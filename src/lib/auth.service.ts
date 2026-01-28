/**
 * Service d'authentification - Communique avec le backend API
 * Remplace le système d'authentification faible de server-auth.ts
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.beatmakerz.fr';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  displayName: string;
  role: 'buyer' | 'artist' | 'admin';
}

export interface AuthResponse {
  tokens: AuthTokens;
  userId: string;
  email: string;
  displayName: string;
  role: 'buyer' | 'artist' | 'admin';
}

export interface RegisterDto {
  email: string;
  password: string;
  displayName: string;
  avatarUrl?: string;
  role?: 'buyer' | 'artist';
}

export interface LoginDto {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Inscription d'un nouvel utilisateur
   */
  static async register(dto: RegisterDto): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
      credentials: 'include', // Important pour recevoir le cookie refreshToken
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(error.message || 'Registration failed');
    }

    const data: AuthResponse = await response.json();

    // Stocker l'access token en mémoire (pas en localStorage pour la sécurité)
    if (typeof window !== 'undefined') {
      this.setAccessToken(data.tokens.accessToken);
    }

    return data;
  }

  /**
   * Connexion d'un utilisateur existant
   */
  static async login(dto: LoginDto): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
      credentials: 'include', // Important pour recevoir le cookie refreshToken
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Invalid credentials' }));
      throw new Error(error.message || 'Invalid credentials');
    }

    const data: AuthResponse = await response.json();

    // Stocker l'access token
    if (typeof window !== 'undefined') {
      this.setAccessToken(data.tokens.accessToken);
    }

    return data;
  }

  /**
   * Rafraîchir l'access token avec le refresh token
   */
  static async refresh(): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Envoie automatiquement le cookie refreshToken
    });

    if (!response.ok) {
      // Token invalide ou expiré
      this.clearAccessToken();
      throw new Error('Refresh token invalid');
    }

    const data: AuthResponse = await response.json();

    // Mettre à jour l'access token
    if (typeof window !== 'undefined') {
      this.setAccessToken(data.tokens.accessToken);
    }

    return data;
  }

  /**
   * Déconnexion
   */
  static async logout(): Promise<void> {
    const accessToken = this.getAccessToken();

    if (accessToken) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include',
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // Nettoyer le token local
    this.clearAccessToken();
  }

  /**
   * Récupérer l'access token stocké en mémoire
   */
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;

    // Stockage en sessionStorage (plus sécurisé que localStorage)
    return sessionStorage.getItem('access_token');
  }

  /**
   * Stocker l'access token
   */
  private static setAccessToken(token: string): void {
    sessionStorage.setItem('access_token', token);
  }

  /**
   * Supprimer l'access token
   */
  private static clearAccessToken(): void {
    sessionStorage.removeItem('access_token');
  }

  /**
   * Vérifier si un utilisateur est connecté
   */
  static isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  /**
   * Décoder le JWT pour récupérer les infos utilisateur (sans vérification de signature)
   * ⚠️ À utiliser uniquement côté client pour l'UI. Ne JAMAIS faire confiance à ces données côté serveur.
   */
  static decodeToken(token: string): AuthUser | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;

      const decoded = JSON.parse(atob(payload));

      return {
        userId: decoded.sub,
        email: decoded.email,
        displayName: decoded.displayName || decoded.email,
        role: decoded.role || 'buyer',
      };
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  /**
   * Récupérer l'utilisateur courant depuis le token
   */
  static getCurrentUser(): AuthUser | null {
    const token = this.getAccessToken();
    if (!token) return null;

    return this.decodeToken(token);
  }

  /**
   * Faire une requête authentifiée vers l'API
   * Gère automatiquement le refresh du token si nécessaire
   */
  static async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    let accessToken = this.getAccessToken();

    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    // Ajouter le token dans le header
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Si 401, essayer de refresh le token
    if (response.status === 401) {
      try {
        const refreshed = await this.refresh();
        accessToken = refreshed.tokens.accessToken;

        // Réessayer la requête avec le nouveau token
        headers.set('Authorization', `Bearer ${accessToken}`);
        return fetch(`${API_URL}${url}`, {
          ...options,
          headers,
          credentials: 'include',
        });
      } catch (error) {
        // Refresh a échoué, l'utilisateur doit se reconnecter
        this.clearAccessToken();
        throw new Error('Session expired. Please login again.');
      }
    }

    return response;
  }
}
