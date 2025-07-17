/* eslint-disable @typescript-eslint/no-explicit-any */

import { atom } from "jotai";
import { UserTypes } from "@/core/types";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI || "";

// Base atom
export const usersAtom = atom<UserTypes[]>([]);

interface FormDataPayload {
  [key: string]: string | FileList | undefined;
  image?: string;
  name?: string;
  email?: string;
  password?: string;
  contact?: string;
  role?: string;
  status?: string;
}

// Helper function for API calls
const userApiRequest = async (
  method: "get" | "post" | "patch" | "delete",
  endpoint: string,
  token: string,
  data?: FormDataPayload
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
    console.error(`User API ${method.toUpperCase()} error:`, error);
    throw error;
  }
};

export const userActionsAtom = atom(
  null,
  async (
    get,
    set,
    action: {
      type: "fetchAll" | "create" | "update" | "delete" | "fetch_not_customers";
      token: string;
      payload?: any;
    }
  ) => {
    switch (action.type) {
      case "fetchAll": {
        const data = await userApiRequest("get", "/user/find", action.token);
        set(usersAtom, data.data);
        return data;
      }

      case "fetch_not_customers": {
        const data = await userApiRequest("get", "/user/find", action.token);
        set(
          usersAtom,
          data.data.filter(
            (user: UserTypes) =>
              typeof user?.role === "object" && user?.role?.name !== "customer"
          )
        );
        return data;
      }

      case "create": {
        const data = await userApiRequest(
          "post",
          "/auth/register",
          action.token,
          action.payload
        );
        const updatedUsers = await userApiRequest(
          "get",
          "/user/find",
          action.token
        );
        set(usersAtom, updatedUsers.data);
        await fetch("/api/revalidateTags?tags=users", { method: "GET" });
        return data;
      }

      case "update": {
        const { id, ...updateData } = action.payload;
        const data = await userApiRequest(
          "patch",
          `/user/update?identifier=${id}`,
          action.token,
          updateData
        );
        set(usersAtom, (prev) =>
          prev.map((t) =>
            t._id === id ? { ...t, ...data.data, _id: t._id } : t
          )
        );
        await fetch("/api/revalidateTags?tags=users", { method: "GET" });
        return data;
      }

      case "delete": {
        const { id } = action.payload;
        await userApiRequest(
          "delete",
          `/user/delete?identifier=${id}`,
          action.token
        );
        set(usersAtom, (prev) => prev.filter((user) => user._id !== id));
        await fetch("/api/revalidateTags?tags=users", { method: "GET" });
        return { success: true };
      }
    }
  }
);
