const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const ACCESS_TOKEN_KEY = "access_token"; // Aligne avec auth.service.ts

const getToken = () => {
  if (typeof window === "undefined") return null;
  try {
    // sessionStorage comme auth.service.ts
    return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
};

const setToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch {
    /* ignore */
  }
};

const refreshAccessToken = async () => {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data?.tokens?.accessToken) {
      setToken(data.tokens.accessToken);
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
};

// Exposé pour les appels internes (ex: proxy Next -> API)
export const getAccessToken = () => getToken();

const doFetch = async (path: string, init: RequestInit) => {
  const exec = async () =>
    fetch(`${API_URL}${path}`, {
      credentials: "include",
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers || {}),
        Authorization: getToken() ? `Bearer ${getToken()}` : "",
      },
    });

  let res = await exec();
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      res = await exec();
    }
  }
  return res;
};

export const apiGet = async <T>(path: string): Promise<T> => {
  const res = await doFetch(path, { method: "GET" });
  if (!res.ok) throw new Error(`GET ${path} failed ${res.status}`);
  return res.json();
};

export const apiPost = async <T>(path: string, body: any = {}): Promise<T> => {
  const res = await doFetch(path, { method: "POST", body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`POST ${path} failed ${res.status}`);
  return res.json();
};

export const apiPatch = async <T>(path: string, body: any = {}): Promise<T> => {
  const res = await doFetch(path, { method: "PATCH", body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`PATCH ${path} failed ${res.status}`);
  return res.json();
};

export const apiDelete = async (path: string) => {
  const res = await doFetch(path, { method: "DELETE" });
  if (!res.ok) throw new Error(`DELETE ${path} failed ${res.status}`);
};
