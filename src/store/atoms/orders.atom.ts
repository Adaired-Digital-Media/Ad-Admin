// import axios from "axios";
// import { atom } from "jotai";
// import { OrderStats, OrderType, SalesReport } from "@/core/types";

// const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI || "";

// export const ordersAtom = atom<OrderType[]>([]);

// export const ordersWithActionsAtom = atom(
//   (get) => get(ordersAtom),
//   async (
//     get,
//     set,
//     action:
//       | { type: "set"; payload: OrderType[] }
//       | { type: "fetch"; accessToken: string }
//       | { type: "delete"; id: string; accessToken: string }
//   ) => {
//     const fetchOrders = async (accessToken: string) => {
//       const response = await fetch(`${API_BASE_URL}/orders/getOrders`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       if (!response.ok) throw new Error("Failed to fetch roles");
//       const { data } = await response.json();
//       return data as OrderType[];
//     };

//     switch (action.type) {
//       case "set":
//         set(ordersAtom, action.payload);
//         break;
//       case "fetch":
//         const orders = await fetchOrders(action.accessToken);
//         set(ordersAtom, orders);
//         break;
//       case "delete":
//         const response = await axios.delete(
//           `${API_BASE_URL}/order/delete?query=${action.id}`,
//           {
//             headers: { Authorization: `Bearer ${action.accessToken}` },
//           }
//         );
//         if (response.status === 200) {
//           const updatedOrders = get(ordersAtom).filter(
//             (order) => order._id !== action.id
//           );
//           set(ordersAtom, updatedOrders);
//         }
//         break;
//       default:
//         break;
//     }
//   }
// );


// export const orderStatsAtom = atom<OrderStats | null>(null);

// export const orderStatsWithActionsAtom = atom(
//   (get) => get(orderStatsAtom),
//   async (
//     get,
//     set,
//     action: { type: "fetch"; accessToken: string }
//   ) => {
//     if (action.type === "fetch") {
//       const response = await fetch(`${API_BASE_URL}/orders/stats`, {
//         headers: { Authorization: `Bearer ${action.accessToken}` },
//       });
//       if (!response.ok) throw new Error("Failed to fetch order stats");
//       const data = await response.json();
//       set(orderStatsAtom, data);
//     }
//   }
// );

// export const salesReportAtom = atom<SalesReport[]>([]);

// export const salesReportWithActionsAtom = atom(
//   (get) => get(salesReportAtom),
//   async (
//     get,
//     set,
//     action: { type: "fetch"; accessToken: string; year?: number }
//   ) => {
//     if (action.type === "fetch") {
//       const selectedYear = action.year || new Date().getFullYear();
//       const response = await fetch(`${API_BASE_URL}/orders/sales-report?year=${selectedYear}`, {
//         headers: { Authorization: `Bearer ${action.accessToken}` },
//       });
//       if (!response.ok) throw new Error("Failed to fetch sales report");
//       const data = await response.json();
//       set(salesReportAtom, data.data);
//     }
//   }
// );


/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { atom } from "jotai";
import { OrderStats, OrderType, SalesReport } from "@/core/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI || "";

// Base atoms
export const ordersAtom = atom<OrderType[]>([]);
export const orderStatsAtom = atom<OrderStats | null>(null);
export const salesReportAtom = atom<SalesReport[]>([]);

// Helper function for API calls
const orderApiRequest = async (
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
    console.error(`Order API ${method.toUpperCase()} error:`, error);
    throw error;
  }
};

export const orderActionsAtom = atom(
  null,
  async (
    get,
    set,
    action: {
      type:
        | "fetchAll"
        | "delete"
        | "fetchStats"
        | "fetchSalesReport";
      token: string;
      payload?: any;
    }
  ) => {
    switch (action.type) {
      case "fetchAll": {
        const data = await orderApiRequest("get", "/orders/getOrders", action.token);
        set(ordersAtom, data.data);
        return data;
      }

      case "delete": {
        const { id } = action.payload;
        await orderApiRequest(
          "delete",
          `/order/delete?query=${id}`,
          action.token
        );
        set(ordersAtom, (prev) => prev.filter((order) => order._id !== id));
        return { success: true };
      }

      case "fetchStats": {
        const data = await orderApiRequest("get", "/orders/stats", action.token);
        set(orderStatsAtom, data.data);
        return data;
      }

      case "fetchSalesReport": {
        const { year } = action.payload;
        const selectedYear = year || new Date().getFullYear();
        const data = await orderApiRequest(
          "get",
          `/orders/sales-report?year=${selectedYear}`,
          action.token
        );
        set(salesReportAtom, data.data);
        return data;
      }
    }
  }
);