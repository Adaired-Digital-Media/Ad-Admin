/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { atom } from "jotai";
import { CouponTypes } from "@/data/coupons.types";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI || "";

// Base atoms
export const couponsAtom = atom<CouponTypes[]>([]);
export const couponStatsAtom = atom<any>(null);

// Helper function for API calls
const couponApiRequest = async (
  method: "get" | "post" | "patch" | "delete",
  endpoint: string,
  token: string,
  data?: any
) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data,
    });
    return response.data;
  } catch (error) {
    console.error(`Coupon API ${method.toUpperCase()} error:`, error);
    throw error;
  }
};

export const couponActionsAtom = atom(
  null,
  async (
    get,
    set,
    action: {
      type:
        | "fetchAll"
        | "fetchSingle"
        | "create"
        | "update"
        | "delete"
        | "fetchStats";
      token: string;
      payload?: any;
    }
  ) => {
    switch (action.type) {
      case "fetchAll": {
        const data = await couponApiRequest(
          "get",
          "/coupons/read",
          action.token
        );
        set(couponsAtom, data.data);
        return data;
      }

      case "fetchSingle": {
        const { couponId } = action.payload;
        const data = await couponApiRequest(
          "get",
          `/coupons/read?id=${couponId}`,
          action.token
        );

        // Normalize data to a single coupon object
        const newCoupon = Array.isArray(data.data) ? data.data[0] : data.data;

        // Append coupon, assuming state is reset to []
        set(couponsAtom, (prev) => {
          // Ensure prev is a valid array to handle unexpected cases
          const currentCoupons = Array.isArray(prev) ? prev : [];
          return [...currentCoupons, newCoupon];
        });
        return data;
      }

      case "create": {
        const data = await couponApiRequest(
          "post",
          "/coupons/create",
          action.token,
          action.payload
        );
        toast.success(data.message);
        set(couponsAtom, (prev) => [data.data, ...prev]);
        await fetch("/api/revalidateTags?tag=coupons", { method: "GET" });
        return data;
      }

      case "update": {
        const { id, ...updateData } = action.payload;
        const data = await couponApiRequest(
          "patch",
          `/coupons/update?id=${id}`,
          action.token,
          updateData
        );
        toast.success(data.message);
        // Use functional updates to ensure consistency
        set(couponsAtom, (prev) =>
          prev.map((t) =>
            t._id === id ? { ...t, ...data.data, _id: t._id } : t
          )
        );
        await fetch("/api/revalidateTags?tags=coupons", { method: "GET" });
        return data;
      }

      case "delete": {
        const { id } = action.payload;
        const data = await couponApiRequest(
          "delete",
          `/coupons/delete?id=${id}`,
          action.token
        );
        set(couponsAtom, (prev) => {
          const updatedCoupons = prev.filter((coupon) => coupon._id !== id);
          return updatedCoupons;
        });
        await fetch("/api/revalidateTags?tags=coupons", { method: "GET" });
        return data;
      }

      case "fetchStats": {
        const data = await couponApiRequest(
          "get",
          "/coupons/usageStats",
          action.token
        );
        set(couponStatsAtom, data.data);
        return data;
      }
    }
  }
);
