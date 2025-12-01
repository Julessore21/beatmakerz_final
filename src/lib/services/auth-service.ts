const CURRENT_USER_KEY = 'currentUser';
const CURRENT_USER_EMAIL_KEY = 'currentUser:email';
const ACCESS_TOKEN_KEY = 'bm:accessToken';

const isBrowser = () => typeof window !== 'undefined';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

type AuthResponse = {
  tokens: { accessToken: string };
  userId: string;
  email: string;
  displayName: string;
  role: string;
};

const persistAuth = (data: AuthResponse) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, data.tokens.accessToken);
    window.localStorage.setItem(CURRENT_USER_KEY, data.displayName || data.email);
    window.localStorage.setItem(CURRENT_USER_EMAIL_KEY, data.email);
  } catch {
    /* noop */
  }
};

const clearAuth = () => {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(CURRENT_USER_KEY);
    window.localStorage.removeItem(CURRENT_USER_EMAIL_KEY);
  } catch {
    /* noop */
  }
};

const request = async (path: string, options: RequestInit) => {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
};

export const getCurrentUser = async (): Promise<string | null> => {
  if (!isBrowser()) return null;
  try {
    const data = (await request('/auth/refresh', { method: 'POST', body: '{}' })) as AuthResponse;
    persistAuth(data);
    return data.displayName || data.email;
  } catch {
    return window.localStorage.getItem(CURRENT_USER_KEY);
  }
};

export const signup = async (email: string, password: string): Promise<boolean> => {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const data = (await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: normalizedEmail, password, displayName: normalizedEmail.split('@')[0] }),
    })) as AuthResponse;
    persistAuth(data);
    return true;
  } catch {
    return false;
  }
};

export const login = async (email: string, password: string): Promise<boolean> => {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const data = (await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: normalizedEmail, password }),
    })) as AuthResponse;
    persistAuth(data);
    return true;
  } catch {
    return false;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await request('/auth/logout', { method: 'POST', body: '{}' });
  } catch {
    /* ignore */
  } finally {
    clearAuth();
  }
};
