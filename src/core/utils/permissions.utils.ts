import axios from "axios";
import { Session } from "next-auth";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { PermissionEntities, PermissionActions } from "@/config/permissions.config";

interface Permission {
  module: string;
  permissions: string[];
}

interface PermissionModule {
  name: string;
  value: string;
}

interface PermissionsState {
  modules: PermissionModule[];
  permissions: Permission[];
  isAdmin: boolean;
  accessToken: string | null;
}

const permissionsAtom = atom<PermissionsState>({
  modules: [],
  permissions: [],
  isAdmin: false,
  accessToken: null,
});

interface CheckPermissionParams {
  session: Session | null;
  entity: PermissionEntities;
  action: PermissionActions;
}

const apiRequest = async (endpoint: string, token: string) => {
  const response = await axios.get<{ data?: PermissionModule[] }>(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URI}${endpoint}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return Array.isArray(response.data) ? response.data : response.data?.data || [];
};

export const checkPermission = async ({
  session,
  entity,
  action,
  cachedModules,
  setCachedModules,
}: CheckPermissionParams & {
  cachedModules: PermissionModule[];
  setCachedModules?: (modules: PermissionModule[]) => void;
}): Promise<boolean> => {
  if (!session?.user) return false;
  if (session.user.isAdmin) return true;

  try {
    let modules = cachedModules;
    if (modules.length === 0) {
      modules = await apiRequest("/permission-module/find", session.user.accessToken);
      setCachedModules?.(modules);
    }

    const moduleExists = modules.some((m) => m.value === entity);
    if (!moduleExists) return false;

    const permissions = (session.user.role?.permissions || []) as Permission[];
    return permissions.some(
      (perm) =>
        (perm.module === entity || perm.module === "all") &&
        perm.permissions.includes(action)
    );
  } catch (error) {
    console.error(`Error checking permission for ${entity}/${action}:`, error);
    return false;
  }
};

export function usePermissions() {
  const [permissionsState, setPermissionsState] = useAtom(permissionsAtom);

  const checkPermissionWithCache = useCallback(
    async ({ session, entity, action }: CheckPermissionParams): Promise<boolean> => {
      if (!session?.user) return false;

      if (
        permissionsState.accessToken === session.user.accessToken &&
        permissionsState.modules.length > 0 &&
        permissionsState.permissions.length > 0
      ) {
        if (permissionsState.isAdmin) return true;

        const moduleExists = permissionsState.modules.some((m) => m.value === entity);
        if (!moduleExists) return false;

        return permissionsState.permissions.some(
          (perm) =>
            (perm.module === entity || perm.module === "all") &&
            perm.permissions.includes(action)
        );
      }

      const isAdmin = session.user.isAdmin || false;
      const permissions = (session.user.role?.permissions || []) as Permission[];

      const result = await checkPermission({
        session,
        entity,
        action,
        cachedModules: permissionsState.modules,
        setCachedModules: (modules) =>
          setPermissionsState({
            modules,
            permissions,
            isAdmin,
            accessToken: session.user.accessToken,
          }),
      });

      return result;
    },
    [permissionsState, setPermissionsState]
  );

  return {
    hasPermission: checkPermissionWithCache,
    isAdmin: permissionsState.isAdmin,
    permissions: permissionsState.permissions,
    modules: permissionsState.modules,
  };
}