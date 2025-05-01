import { atom } from "jotai";

export interface PermissionModule {
  _id: string;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Permission {
  module: string;
  permissions: number[];
}

export const permissionsAtom = atom<{
  modules: PermissionModule[];
  permissions: Permission[];
  isAdmin: boolean;
  accessToken?: string;
}>({
  modules: [],
  permissions: [],
  isAdmin: false,
  accessToken: undefined,
});