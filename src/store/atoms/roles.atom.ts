import { atom } from "jotai";
import { PermissionTypes, RoleTypes } from "@/data/roles-permissions";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI || "";

export const rolesAtom = atom<RoleTypes[]>([]);

export const rolesWithActionsAtom = atom(
  (get) => get(rolesAtom),
  async (
    get,
    set,
    action:
      | { type: "set"; payload: RoleTypes[] }
      | { type: "fetch"; accessToken: string }
      | {
          type: "create";
          data: {
            name: string;
            description?: string;
            permissions?: PermissionTypes[];
            status?: string;
          };
          accessToken: string;
        }
      | {
          type: "update";
          id: string;
          data: {
            name?: string;
            description?: string;
            permissions?: PermissionTypes[];
            status?: string;
          };
          accessToken: string;
        }
      | { type: "delete"; id: string; accessToken: string }
      | {
          type: "moduleCreate";
          data: { name: string; value: string };
          accessToken: string;
        }
  ) => {
    const fetchRoles = async (accessToken: string) => {
      const response = await fetch(`${API_BASE_URL}/role/find`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch roles");
      const { data } = await response.json();
      return data as RoleTypes[];
    };

    switch (action.type) {
      case "set":
        set(rolesAtom, action.payload);
        break;
      case "fetch":
        try {
          const roles = await fetchRoles(action.accessToken);
          set(rolesAtom, roles);
        } catch (error) {
          console.error("Fetch roles failed:", error);
        }
        break;
      case "create":
        try {
          const response = await axios.post(
            `${API_BASE_URL}/role/create`,
            action.data,
            {
              headers: {
                Authorization: `Bearer ${action.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status !== 201) throw new Error("Failed to create role");
          const { data: newRole } = response;
          set(rolesAtom, [...get(rolesAtom), newRole]);
          await fetch("/api/revalidateTags?tags=roles", { method: "GET" });
          const updatedRoles = await fetchRoles(action.accessToken);
          set(rolesAtom, updatedRoles);
        } catch (error) {
          console.error("Create role failed:", error);
          throw error;
        }
        break;
      case "update":
        try {
          const response = await axios.patch(
            `${API_BASE_URL}/role/update?identifier=${action.id}`,
            action.data,
            {
              headers: { Authorization: `Bearer ${action.accessToken}` },
            }
          );
          if (response.status !== 200) throw new Error("Failed to update role");
          const updatedRole = response.data;
          set(
            rolesAtom,
            get(rolesAtom).map((role) =>
              role._id === action.id ? updatedRole : role
            )
          );
          await fetch("/api/revalidateTags?tags=roles", { method: "GET" });
          const refreshedRoles = await fetchRoles(action.accessToken);
          set(rolesAtom, refreshedRoles);
        } catch (error) {
          console.error("Update role failed:", error);
          throw error;
        }
        break;
      case "delete":
        try {
          await axios.delete(
            `${API_BASE_URL}/role/delete?identifier=${action.id}`,
            {
              headers: { Authorization: `Bearer ${action.accessToken}` },
            }
          );
          set(
            rolesAtom,
            get(rolesAtom).filter((role) => role._id !== action.id)
          );
          await fetch("/api/revalidateTags?tags=roles", { method: "GET" });
          const remainingRoles = await fetchRoles(action.accessToken);
          set(rolesAtom, remainingRoles);
        } catch (error) {
          console.error("Delete role failed:", error);
          throw error;
        }
        break;
      case "moduleCreate":
        try {
          const response = await axios.post(
            `${API_BASE_URL}/permissionModule/create`,
            action.data,
            {
              headers: {
                Authorization: `Bearer ${action.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status !== 201)
            throw new Error(
              "Failed to create module: " + response.data.message
            );
          const { data: newModule } = response;
          set(rolesAtom, [...get(rolesAtom), newModule]);
          await fetch("/api/revalidateTags?tags=roles", { method: "GET" });
          const updatedRoles = await fetchRoles(action.accessToken);
          set(rolesAtom, updatedRoles);
        } catch (error) {
          console.error("Create role failed:", error);
          throw error;
        }
        break;
    }
  }
);
