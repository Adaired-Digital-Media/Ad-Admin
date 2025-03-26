"use client";
import { useAtom } from "jotai";
import { Session } from "next-auth";
import cn from "@core/utils/class-names";
import { useEffect, useState } from "react";
import RoleCard from "@/app/shared/roles-permissions/role-card";
import { rolesWithActionsAtom } from "@/store/atoms/roles.atom";
import { generateColorFromName } from "@/core/utils/random-color";
import { PermissionModule, RoleTypes } from "@/data/roles-permissions";


interface RolesGridProps {
  initialRoles: RoleTypes[];
  modules: PermissionModule[];
  className?: string;
  gridClassName?: string;
  session: Session;
}

export default function RolesGrid({
  initialRoles,
  modules,
  className,
  session,
  gridClassName,
}: RolesGridProps) {
  const [roles, setRoles] = useAtom(rolesWithActionsAtom);
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    if (session?.user?.accessToken) {
      setRoles({ type: "fetch", accessToken: session.user.accessToken }).then(
        () => setIsInitialRender(false)
      );
    }
  }, [session, setRoles]);

  const displayRoles = isInitialRender ? initialRoles : roles;

  return (
    <div className={cn("@container", className)}>
      <div
        className={cn(
          "grid grid-cols-1 gap-6 @[36.65rem]:grid-cols-2 @[56rem]:grid-cols-3 @[78.5rem]:grid-cols-4 @[100rem]:grid-cols-5",
          gridClassName
        )}
      >
        {displayRoles.map((role) => (
          <RoleCard
            key={role.name}
            role={role}
            modules={modules}
            color={generateColorFromName(role.name)}
            session={session}
          />
        ))}
      </div>
    </div>
  );
}
