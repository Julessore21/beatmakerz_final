import { apiGet, apiPost, apiDelete, apiPatch } from "./api-client";

export type FavoriteItem = {
  id?: string;
  _id?: string;
  beatId: string;
  beat?: { title?: string; coverUrl?: string; artistId?: string; artist?: string; artistName?: string };
  createdAt?: string;
};

export type UserSettings = {
  marketingOptIn: boolean;
  dropsOptIn: boolean;
  securityOptIn: boolean;
  twoFAEnabled: boolean;
  anonymousMode: boolean;
};

export type NotificationItem = {
  _id: string;
  userId: string;
  kind: string;
  title: string;
  body: string;
  readAt?: string;
  createdAt?: string;
};

export type PurchasedItem = {
  _id: string;
  orderId: string;
  beatId: string;
  licenseTypeId: string;
  unitPriceCents: number;
  qty: number;
  beat?: { title?: string; coverUrl?: string } | null;
  license?: { code?: string } | null;
  downloadable: boolean;
};

/** Commande payée (ou remboursée) telle que renvoyée par GET /me/orders. */
export type Order = {
  _id: string;
  status: "paid" | "refunded";
  totalCents: number;
  currency: string;
  createdAt?: string;
  items: PurchasedItem[];
};

export const fetchFavorites = () => apiGet<FavoriteItem[]>("/me/favorites");
export const toggleFavorite = (beatId: string) => apiPost("/me/favorites", { beatId });

export const fetchSettings = () => apiGet<UserSettings>("/me/settings");
export const updateSettings = (data: Partial<UserSettings>) => apiPatch<UserSettings>("/me/settings", data);

export const fetchNotifications = () => apiGet<NotificationItem[]>("/me/notifications");
export const markNotificationRead = (id: string) => apiPost(`/me/notifications/${id}/read`, {});

export const fetchOrders = () => apiGet<Order[]>("/me/orders");

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/**
 * Lien de téléchargement d'un beat acheté : l'API renvoie un lien signé
 * (valable 15 min) qui relaie le fichier sans exposer son URL de stockage.
 */
export const fetchDownloadUrl = async (orderId: string, itemId: string) => {
  const { downloadUrl } = await apiGet<{ downloadUrl: string; expiresAt: string }>(
    `/me/orders/${orderId}/items/${itemId}/download`
  );
  return `${API_URL}${downloadUrl}`;
};
