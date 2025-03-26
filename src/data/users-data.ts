import { RoleTypes } from "./roles-permissions";

export interface WishlistItem {
  productId: string;
  dateAdded: Date;
}

export interface OrderHistoryItem {
  orderId: string;
}

export interface UserTypes {
  _id?: string;
  image?: string | null;
  name: string;
  userName?: string;
  email: string;
  password?: string | null;
  contact?: string | null;
  isAdmin?: boolean;
  role: string | RoleTypes;
  googleId?: string;
  orderHistory?: OrderHistoryItem[];
  cart?: string;
  wishlist?: WishlistItem[];
  status?: string;
  isVerifiedUser?: boolean;
  refreshToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export const STATUSES = {
  Active: "Active",
  Inactive: "Inactive",
} as const;
