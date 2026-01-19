const CATALOG_URL = process.env.NEXT_PUBLIC_FILEUP_CATALOG_URL;

export type FileUpCatalogueItem = {
  id?: string | number;
  title?: string;
  name?: string;
  artist?: { name?: string } | string;
  genres?: string[];
  genre?: string;
  bpm?: number;
  key?: string;
  priceCents?: number;
  price?: number;
  assets?: { type?: string; url?: string; storageKey?: string }[];
  previewUrl?: string;
  audioUrl?: string;
};

export const fetchFileUpCatalogue = async (): Promise<FileUpCatalogueItem[]> => {
  if (!CATALOG_URL) {
    throw new Error("NEXT_PUBLIC_FILEUP_CATALOG_URL is not set.");
  }
  const res = await fetch(CATALOG_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`FileUp catalogue fetch failed: ${res.status}`);
  }
  const data = await res.json();
  if (Array.isArray(data)) return data as FileUpCatalogueItem[];
  if (Array.isArray(data?.items)) return data.items as FileUpCatalogueItem[];
  if (Array.isArray(data?.beats)) return data.beats as FileUpCatalogueItem[];
  return [];
};
