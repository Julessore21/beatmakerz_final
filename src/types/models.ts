export type BeatStatus = "draft" | "published";
export type BeatVisibility = "public" | "private";

export interface BeatDocument {
  _id?: string;
  artistId?: string;
  title: string;
  bpm?: number;
  key?: string;
  genres?: string[];
  moods?: string[];
  status: BeatStatus;
  visibility: BeatVisibility;
  coverUrl?: string;
  previewUrl?: string;
  audioUrl?: string;
  audioFormat?: "mp3" | "wav";
  duration?: number;
  fileSize?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderStatus = "paid" | "pending" | "failed";

export interface OrderItem {
  beatId: string;
  price: number;
  licenseTypeId?: string;
}

export interface OrderDocument {
  _id?: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt?: Date;
  downloadGranted?: boolean;
  downloadCount?: number;
}
