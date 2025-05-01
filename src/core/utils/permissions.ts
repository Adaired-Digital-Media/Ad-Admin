// import axios from "axios";
// import { Session } from "next-auth";
// import { useAtom } from "jotai";
// import {
//   permissionsAtom,
//   PermissionModule,
//   Permission,
// } from "@/store/atoms/permissions.atom";
// import { useCallback } from "react";

// export enum PermissionActions {
//   CREATE = 0,
//   READ = 1,
//   UPDATE = 2,
//   DELETE = 3,
// }

// interface CheckPermissionParams {
//   session: Session | null;
//   entity: string;
//   action: PermissionActions;
// }

// export const checkPermission = async ({
//   session,
//   entity,
//   action,
//   cachedModules,
//   setCachedModules,
// }: CheckPermissionParams & {
//   cachedModules: PermissionModule[];
//   setCachedModules?: (modules: PermissionModule[]) => void;
// }): Promise<boolean> => {
//   if (!session?.user) return false;

//   // Admin has all permissions
//   if (session.user.isAdmin) return true;

//   try {
//     let modules = cachedModules;

//     // Fetch modules if not cached
//     if (modules.length === 0) {
//       const response = await axios.get<{
//         data?: PermissionModule[];
//         success?: boolean;
//       }>(`${process.env.NEXT_PUBLIC_BACKEND_API_URI}/permissionModule/find`, {
//         headers: {
//           Authorization: `Bearer ${session.user.accessToken}`,
//         },
//       });

//       modules = Array.isArray(response.data)
//         ? response.data
//         : response.data?.data || [];

//       if (setCachedModules) {
//         setCachedModules(modules);
//       }
//     }

//     // Check if module exists
//     const moduleExists = modules.some(
//       (m: PermissionModule) => m.name === entity || m.value === entity
//     );
//     if (!moduleExists) return false;

//     // Check permissions
//     const permissions = (session.user.role?.permissions || []) as Permission[];
//     return permissions.some(
//       (perm) =>
//         (perm.module === entity || perm.module === "all") &&
//         perm.permissions.includes(action)
//     );
//   } catch (error) {
//     console.error("Permission check failed:", error);
//     return false;
//   }
// };

// export function usePermissions() {
//   const [permissionsState, setPermissionsState] = useAtom(permissionsAtom);

//   const checkPermissionWithCache = useCallback(
//     async ({
//       session,
//       entity,
//       action,
//     }: CheckPermissionParams): Promise<boolean> => {
//       if (!session?.user) return false;

//       // Use cached permissions if accessToken matches
//       if (
//         permissionsState.accessToken === session.user.accessToken &&
//         permissionsState.modules.length > 0 &&
//         permissionsState.permissions.length > 0
//       ) {
//         if (permissionsState.isAdmin) return true;

//         const moduleExists = permissionsState.modules.some(
//           (m) => m.name === entity || m.value === entity
//         );
//         if (!moduleExists) return false;

//         return permissionsState.permissions.some(
//           (perm) =>
//             (perm.module === entity || perm.module === "all") &&
//             perm.permissions.includes(action)
//         );
//       }

//       // Fetch and cache permissions
//       const isAdmin = session.user.isAdmin || false;
//       const permissions = (session.user.role?.permissions ||
//         []) as Permission[];

//       const result = await checkPermission({
//         session,
//         entity,
//         action,
//         cachedModules: permissionsState.modules,
//         setCachedModules: (modules) =>
//           setPermissionsState({
//             modules,
//             permissions,
//             isAdmin,
//             accessToken: session.user.accessToken,
//           }),
//       });

//       return result;
//     },
//     [permissionsState, setPermissionsState]
//   );

//   return {
//     hasPermission: checkPermissionWithCache,
//     isAdmin: permissionsState.isAdmin,
//     permissions: permissionsState.permissions,
//     modules: permissionsState.modules,
//   };
// }

import axios from "axios";
import { Session } from "next-auth";
import { useAtom } from "jotai";
import {
  permissionsAtom,
  PermissionModule,
  Permission,
} from "@/store/atoms/permissions.atom";
import { useCallback } from "react";

export enum PermissionActions {
  CREATE = 0,
  READ = 1,
  UPDATE = 2,
  DELETE = 3,
}

interface CheckPermissionParams {
  session: Session | null;
  entity: string;
  action: PermissionActions;
}

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
  if (!session?.user) {
    console.log(`checkPermission: No user session for ${entity}/${action}`);
    return false;
  }

  // Admin has all permissions
  if (session.user.isAdmin) {
    console.log(
      `checkPermission: Admin access granted for ${entity}/${action}`
    );
    return true;
  }

  try {
    let modules = cachedModules;

    // Fetch permission modules
    if (modules.length === 0) {
      const response = await axios.get<{
        data?: PermissionModule[];
        success?: boolean;
      }>(`${process.env.NEXT_PUBLIC_BACKEND_API_URI}/permissionModule/find`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      modules = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      if (setCachedModules) {
        setCachedModules(modules);
      }
    }

    // Check if module exists
    const moduleExists = modules.some(
      (m: PermissionModule) => m.name === entity || m.value === entity
    );
    if (!moduleExists) {
      console.log(`checkPermission: Module ${entity} not found`);
      return false;
    }

    // Check permissions
    const permissions = (session.user.role?.permissions || []) as Permission[];
    const hasAccess = permissions.some(
      (perm) =>
        (perm.module === entity || perm.module === "all") &&
        perm.permissions.includes(action)
    );

    console.log(
      `checkPermission: ${entity}/${action} -> ${
        hasAccess ? "granted" : "denied"
      }`
    );
    return hasAccess;
  } catch (error) {
    console.error(
      `checkPermission: Error checking ${entity}/${action}:`,
      error
    );
    return false;
  }
};

export function usePermissions() {
  const [permissionsState, setPermissionsState] = useAtom(permissionsAtom);

  const checkPermissionWithCache = useCallback(
    async ({
      session,
      entity,
      action,
    }: CheckPermissionParams): Promise<boolean> => {
      if (!session?.user) return false;

      // Use cached permissions if accessToken matches
      if (
        permissionsState.accessToken === session.user.accessToken &&
        permissionsState.modules.length > 0 &&
        permissionsState.permissions.length > 0
      ) {
        if (permissionsState.isAdmin) {
          console.log(
            `checkPermissionWithCache: Admin access granted for ${entity}/${action}`
          );
          return true;
        }

        const moduleExists = permissionsState.modules.some(
          (m) => m.name === entity || m.value === entity
        );
        if (!moduleExists) {
          console.log(`checkPermissionWithCache: Module ${entity} not found`);
          return false;
        }

        const hasAccess = permissionsState.permissions.some(
          (perm) =>
            (perm.module === entity || perm.module === "all") &&
            perm.permissions.includes(action)
        );

        console.log(
          `checkPermissionWithCache: ${entity}/${action} -> ${
            hasAccess ? "granted" : "denied"
          }`
        );
        return hasAccess;
      }

      // Fetch and cache permissions
      const isAdmin = session.user.isAdmin || false;
      const permissions = (session.user.role?.permissions ||
        []) as Permission[];

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
