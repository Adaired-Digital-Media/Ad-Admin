import { UserTypes } from "./users-data";

export interface RoleTypes {
  _id?: string;
  name: string;
  description: string;
  status: boolean;
  permissions: PermissionTypes[];
  users: UserTypes[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface PermissionTypes {
  module: string;
  permissions: number[];
}

export interface PermissionModule {
  _id?: string;
  name: string;
  value: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
export const PERMISSIONS = {
  Create: 0,
  Read: 1,
  Update: 2,
  Delete: 3,
};

export const roleActions = [
  {
    id: 1,
    name: "Add User",
  },
  {
    id: 2,
    name: "Rename",
  },
  {
    id: 3,
    name: "Remove Role",
  },
];
