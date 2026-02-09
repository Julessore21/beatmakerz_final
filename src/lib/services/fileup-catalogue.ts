export type FileUpCatalogueItem = {
  id?: string | number;
  _id?: string;
  title?: string;
  name?: string;
  artist?: { name?: string; _id?: string } | string;
  artistId?: string;
  genres?: string[];
  genre?: string;
  moods?: string[];
  bpm?: number;
  key?: string;
  priceCents?: number;
  price?: number;
  assets?: { type?: string; url?: string; storageKey?: string; _id?: string }[];
  previewUrl?: string;
  audioUrl?: string;
  coverUrl?: string;
  status?: "draft" | "published";
  visibility?: "public" | "unlisted";
};

export const fetchFileUpCatalogue = async (): Promise<FileUpCatalogueItem[]> => {
  try {
    // Appel à notre API route qui proxy vers le backend
    const res = await fetch("/api/beats?limit=100", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Catalogue fetch failed: ${res.status}`);
    }

    const data = await res.json();

    // Le backend retourne { items: Beat[], cursor: string | null }
    if (Array.isArray(data.items)) {
      return data.items as FileUpCatalogueItem[];
    }

    // Fallback si le format est différent
    if (Array.isArray(data)) {
      return data as FileUpCatalogueItem[];
    }

    return [];
  } catch (error) {
    console.error("Error fetching catalogue:", error);
    throw error; // Re-throw pour que le composant gère l'erreur
  }
};
