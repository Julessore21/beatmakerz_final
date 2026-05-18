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

export type OrderLineItem = {
  _id?: string;
  id?: string;
  beatId: string;
  beat?: { title?: string };
  title?: string;
  licenseTypeId: string;
  licenseType?: { code?: string };
  unitPriceCents?: number;
  qty?: number;
  downloadUrl?: string;
  url?: string;
  presignedUrl?: string;
  presignedKey?: string;
  downloadGrant?: { url?: string };
  downloadExpiresAt?: string;
};

export type OrderItem = {
  _id?: string;
  id?: string;
  status: string;
  totalCents: number;
  currency: string;
  createdAt?: string;
  items?: OrderLineItem[];
};

export const fetchFavorites = () => apiGet<FavoriteItem[]>("/me/favorites");
export const toggleFavorite = (beatId: string) => apiPost("/me/favorites", { beatId });

export const fetchSettings = () => apiGet<UserSettings>("/me/settings");
export const updateSettings = (data: Partial<UserSettings>) => apiPatch<UserSettings>("/me/settings", data);

export const fetchNotifications = () => apiGet<NotificationItem[]>("/me/notifications");
export const markNotificationRead = (id: string) => apiPost(`/me/notifications/${id}/read`, {});

export const fetchOrders = () => apiGet<OrderItem[]>("/me/orders");
export const createOrderFromCart = () => apiPost<OrderItem[]>("/me/orders", {});
