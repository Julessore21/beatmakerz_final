/**
 * Service pour récupérer les beats depuis le backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://beatmakerz-api.onrender.com';

export interface Beat {
  _id: string;
  title: string;
  genres: string[];
  bpm: number;
  key: string;
  artist: {
    _id: string;
    name: string;
    verified: boolean;
  };
  coverUrl?: string;
  assets: Array<{
    _id: string;
    type: 'preview' | 'wav' | 'mp3' | 'stems';
    storageKey: string;
    durationSec?: number;
  }>;
  priceOverrides: { licenseTypeId?: string; priceCents?: number }[];
  status: string;
  visibility: string;
  createdAt: string;
}

export interface BeatsResponse {
  items: Beat[];
  cursor: string | null;
}

export interface BeatsFilters {
  query?: string;
  genre?: string;
  bpmMin?: number;
  bpmMax?: number;
  sort?: 'new' | 'popular';
  limit?: number;
  cursor?: string;
}

/**
 * Récupérer les beats avec filtres et pagination
 */
export async function fetchBeats(filters: BeatsFilters = {}): Promise<BeatsResponse> {
  const params = new URLSearchParams();

  if (filters.query) params.set('query', filters.query);
  if (filters.genre) params.set('genre', filters.genre);
  if (filters.bpmMin !== undefined) params.set('bpmMin', String(filters.bpmMin));
  if (filters.bpmMax !== undefined) params.set('bpmMax', String(filters.bpmMax));
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.cursor) params.set('cursor', filters.cursor);

  const url = `${API_URL}/beats?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // Pas de cache pour avoir les derniers beats
  });

  if (!response.ok) {
    throw new Error('Failed to fetch beats');
  }

  return response.json();
}

/**
 * Récupérer un beat par son ID
 */
export async function fetchBeatById(id: string): Promise<Beat> {
  const url = `${API_URL}/beats/${id}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Beat not found');
  }

  return response.json();
}
