/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom } from "jotai";
import { RoleTypes } from "@/data/roles-permissions";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI || "";

// Base atom
export const rolesAtom = atom<RoleTypes[]>([]);

// Helper function for API calls
const roleApiRequest = async (
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
    console.error(`Role API ${method.toUpperCase()} error:`, error);
    throw error;
  }
};

export const roleActionsAtom = atom(
  null,
  async (
    get,
    set,
    action: {
      type: "fetchAll" | "create" | "update" | "delete" | "createModule";
      token: string;
      payload?: any;
    }
  ) => {
    switch (action.type) {
      case "fetchAll": {
        const data = await roleApiRequest("get", "/role/find", action.token);
        set(rolesAtom, data.data);
        return data;
      }

      case "create": {
        const data = await roleApiRequest(
          "post",
          "/role/create",
          action.token,
          action.payload
        );
        set(rolesAtom, (prev) => [...prev, data.data]);
        await fetch("/api/revalidateTags?tags=roles", { method: "GET" });
        return data;
      }

      case "update": {
        const { id, ...updateData } = action.payload;
        const data = await roleApiRequest(
          "patch",
          `/role/update?identifier=${id}`,
          action.token,
          updateData
        );
        set(rolesAtom, (prev) =>
          prev.map((t) =>
            t._id === id ? { ...t, ...data.data, _id: t._id } : t
          )
        );
        await fetch("/api/revalidateTags?tags=roles", { method: "GET" });
        return data;
      }

      case "delete": {
        const { id } = action.payload;
        await roleApiRequest(
          "delete",
          `/role/delete?identifier=${id}`,
          action.token
        );
        set(rolesAtom, (prev) => {
          const updatedRoles = prev.filter((role) => role._id !== id);
          return updatedRoles;
        });
        await fetch("/api/revalidateTags?tags=roles", { method: "GET" });
        return { success: true };
      }

      case "createModule": {
        const data = await roleApiRequest(
          "post",
          "/permission-module/create",
          action.token,
          action.payload
        );
        const updatedRoles = await roleApiRequest(
          "get",
          "/role/find",
          action.token
        );
        set(rolesAtom, updatedRoles.data);
        await fetch("/api/revalidateTags?tags=roles", { method: "GET" });
        return data;
      }
    }
  }
);
