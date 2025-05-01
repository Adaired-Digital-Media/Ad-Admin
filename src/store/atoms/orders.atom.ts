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
    // console.error(`Order API ${method.toUpperCase()} error:`, error);
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