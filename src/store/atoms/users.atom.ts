// src/store/atoms/users.atom.ts
import { atom } from "jotai";
import { UserTypes } from "@/data/users-data";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI || "";

export const usersAtom = atom<UserTypes[]>([]);

export const usersWithActionsAtom = atom(
  (get) => get(usersAtom),
  async (
    get,
    set,
    action:
      | { type: "set"; payload: UserTypes[] }
      | { type: "fetch"; accessToken: string }
      | {
          type: "create";
          data: {
            image?: string;
            name: string;
            email: string;
            password?: string;
            contact?: string;
            role?: string;
            status?: string;
          };
          accessToken: string;
        }
      | {
          type: "update";
          id: string;
          data: Partial<UserTypes>;
          accessToken: string;
        }
      | { type: "delete"; id: string; accessToken: string }
  ) => {
    const fetchUsers = async (accessToken: string) => {
      const response = await fetch(`${API_BASE_URL}/user/find`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const { data } = await response.json();
      return data as UserTypes[];
    };

    switch (action.type) {
      case "set":
        set(usersAtom, action.payload);
        break;
      case "fetch":
        try {
          const users = await fetchUsers(action.accessToken);
          set(usersAtom, users);
        } catch (error) {
          console.error("Fetch users failed:", error);
        }
        break;
      case "create":
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/register`,
            action.data,
            {
              headers: {
                Authorization: `Bearer ${action.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status !== 201) throw new Error("Failed to create user");
          const { data: newUser } = response;
          set(usersAtom, [...get(usersAtom), newUser]);
          await fetch("/api/revalidateTags?tags=users", { method: "GET" });
          const updatedUsers = await fetchUsers(action.accessToken);
          set(usersAtom, updatedUsers);
        } catch (error) {
          console.error("Create user failed:", error);
          throw error;
        }
        break;
      case "update":
        try {
          const response = await axios.patch(
            `${API_BASE_URL}/user/update?identifier=${action.id}`,
            action.data,
            {
              headers: { Authorization: `Bearer ${action.accessToken}` },
            }
          );
          if (response.status !== 200) throw new Error("Failed to update user");
          const updatedUser = response.data;
          set(
            usersAtom,
            get(usersAtom).map((user) =>
              user._id === action.id ? updatedUser : user
            )
          );
          await fetch("/api/revalidateTags?tags=users", { method: "GET" });
          const refreshedUsers = await fetchUsers(action.accessToken);
          set(usersAtom, refreshedUsers);
        } catch (error) {
          console.error("Update user failed:", error);
          throw error;
        }
        break;
      case "delete":
        try {
          await axios.delete(
            `${API_BASE_URL}/user/delete?identifier=${action.id}`,
            {
              headers: { Authorization: `Bearer ${action.accessToken}` },
            }
          );
          set(
            usersAtom,
            get(usersAtom).filter((user) => user._id !== action.id)
          );
          await fetch("/api/revalidateTags?tags=users", { method: "GET" });
          const remainingUsers = await fetchUsers(action.accessToken);
          set(usersAtom, remainingUsers);
        } catch (error) {
          console.error("Delete user failed:", error);
          throw error;
        }
        break;
    }
  }
);
