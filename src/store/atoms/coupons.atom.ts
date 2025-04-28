// import axios from "axios";
// import { atom } from "jotai";
// import { CouponTypes } from "@/data/coupons.types";
// import toast from "react-hot-toast";

// const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI || "";

// export const couponAtom = atom<CouponTypes[]>([]);

// export const couponsWithActionAtom = atom(
//   (get) => get(couponAtom),
//   async (
//     get,
//     set,
//     action:
//       | { type: "set"; payload: CouponTypes[] }
//       | { type: "create"; accessToken: string; payload: CouponTypes }
//       | { type: "fetch"; accessToken: string; couponId?: string }
//       | {
//           type: "update";
//           id: string;
//           accessToken: string;
//           payload: Partial<CouponTypes>;
//         }
//       | { type: "delete"; id: string; accessToken: string }
//       | { type: "fetchStats"; accessToken: string }
//   ) => {
//     const currentState = get(couponAtom) || [];

//     const fetchCoupons = async (accessToken: string, couponId?: string) => {
//       try {
//         const url = couponId
//           ? `${API_BASE_URL}/coupons/read?id=${couponId}`
//           : `${API_BASE_URL}/coupons/read`;
//         const res = await axios.get(url, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         if (res.status !== 200) throw new Error("Failed to fetch coupons.");
//         const data = res.data.data;
//         // Ensure the return value is always an array
//         return couponId
//           ? Array.isArray(data)
//             ? data
//             : [data]
//           : Array.isArray(data)
//           ? data
//           : [];
//       } catch (error) {
//         console.error("An error occurred while fetching coupons -> ", error);
//         return [];
//       }
//     };

//     switch (action.type) {
//       case "set":
//         set(couponAtom, action.payload);
//         break;

//       case "create":
//         try {
//           const res = await axios.post(
//             `${API_BASE_URL}/coupons/create`,
//             action.payload,
//             {
//               headers: {
//                 Authorization: `Bearer ${action.accessToken}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//           if (res.status !== 201) throw new Error("Failed to create coupon.");
//           const newCoupon = res.data.data;
//           toast.success(res.data.message);
//           set(couponAtom, [...get(couponAtom), newCoupon]);
//           await fetch("/api/revalidateTags?tag=coupons", { method: "GET" });
//         } catch (error) {
//           console.error("Create coupon failed:", error);
//           throw error;
//         }
//         break;

//       case "fetch":
//         const coupons = await fetchCoupons(action.accessToken, action.couponId);
//         if (action.couponId) {
//           // Update or add the single coupon
//           set(
//             couponAtom,
//             currentState.some((c) => c._id === action.couponId)
//               ? currentState.map((c) =>
//                   c._id === action.couponId ? coupons[0] : c
//                 )
//               : [...currentState, ...coupons]
//           );
//         } else {
//           // Replace the full list
//           set(couponAtom, coupons);
//         }
//         break;

//       case "update":
//         try {
//           const res = await axios.patch(
//             `${API_BASE_URL}/coupons/update?id=${action.id}`,
//             action.payload,
//             {
//               headers: {
//                 Authorization: `Bearer ${action.accessToken}`,
//               },
//             }
//           );
//           if (res.status !== 200)
//             throw new Error("Failed to update the coupon.");
//           const updatedCoupon = res.data.data;
//           toast.success(res.data.message);
//           set(
//             couponAtom,
//             currentState.map((coupon) =>
//               coupon._id === action.id ? updatedCoupon : coupon
//             )
//           );
//           await fetch("/api/revalidateTags?tags=coupons", { method: "GET" });
//         } catch (error) {
//           console.error("Failed updating the coupon : ", error);
//           throw error;
//         }
//         break;

//       case "delete":
//         try {
//           const res = await axios.delete(
//             `${API_BASE_URL}/coupons/delete?id=${action.id}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${action.accessToken}`,
//               },
//             }
//           );
//           if (res.status !== 200)
//             throw new Error("An error occurred while deleting the coupon.");
//           set(
//             couponAtom,
//             currentState.filter((coupon) => coupon._id !== action.id)
//           );
//           await fetch("/api/revalidateTags?tags=coupons", { method: "GET" });
//         } catch (error) {
//           console.error("Error deleting coupon : ", error);
//         }
//         break;

//       case "fetchStats":
//         try {
//           // TODO: Implement stats fetching if backend supports it
//           const res = await axios.get(`${API_BASE_URL}/coupons/usageStats`, {
//             headers: {
//               Authorization: `Bearer ${action.accessToken}`,
//             },
//           });
//           // Handle stats response if needed
//           console.log("Coupon stats:", res.data);
//         } catch (error) {
//           console.error("An error occurred while fetching the stats : ", error);
//         }
//         break;
//     }
//   }
// );

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
        // Update or add the single coupon
        set(couponsAtom, (prev) =>
          prev.some((c) => c._id === couponId)
            ? prev.map((c) => (c._id === couponId ? data.data[0] : c))
            : [...prev, ...(Array.isArray(data.data) ? data.data : [data.data])]
        );
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
