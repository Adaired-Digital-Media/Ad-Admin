import PageHeader from "@/app/shared/page-header";
import ModalButton from "@/app/shared/modal-button";
import UsersTable from "@/app/shared/roles-permissions/users-table";
import CreateRole from "@/app/shared/roles-permissions/create-role";
import { auth } from "@/auth";
import CreatePermissionModule from "@/app/shared/roles-permissions/create-permission-module";
import RolesGrid from "@/app/shared/roles-permissions/roles-grid";
import { fetchData } from "@/core/utils/fetch-function";
import { PermissionModule, RoleTypes, UserTypes } from "@/core/types";

const pageHeader = {
  title: "Roles and Permissions ",
  breadcrumb: [
    {
      href: "/",
      name: "Dashboard",
    },
    {
      name: "Role Management & Permission",
    },
  ],
};

export default async function UserAndRoles() {
  const session = await auth();
  if (!session) {
    throw new Error("User session is not available.");
  }
  const accessToken = session?.user?.accessToken || "";

  // Parallel data fetching with explicit typing
  const [users, roles, modules] = await Promise.all([
    fetchData({
      endpoint: "/user/find",
      accessToken,
      tag: "users",
    }) as Promise<UserTypes[]>,
    fetchData({
      endpoint: "/role/find",
      accessToken,
      tag: "roles",
    }) as Promise<RoleTypes[]>,
    fetchData({
      endpoint: "/permission-module/find",
      accessToken,
      tag: "permission-modules",
    }) as Promise<PermissionModule[]>,
  ]);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="flex gap-3">
          <ModalButton
            label="Add New Role"
            view={<CreateRole session={session} />}
          />
          <ModalButton
            label="Add Permission Module"
            view={<CreatePermissionModule />}
          />
        </div>
      </PageHeader>
      <RolesGrid initialRoles={roles} modules={modules} session={session} />
      <UsersTable users={users} session={session} />
    </>
  );
}
