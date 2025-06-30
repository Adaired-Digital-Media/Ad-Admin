import PageHeader from "@/app/shared/page-header";
import ModalButton from "@/app/shared/modal-button";
import UsersTable from "@/app/shared/roles-permissions/users-table";
import CreateRole from "@/app/shared/roles-permissions/create-role";
import { auth } from "@/auth";
import CreatePermissionModule from "@/app/shared/roles-permissions/create-permission-module";
import RolesGrid from "@/app/shared/roles-permissions/roles-grid";

// Centralized API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI;

// Fetch endpoints configuration
const ENDPOINTS = {
  users: "/user/find",
  roles: "/role/find",
  modules: "/permission-module/find",
};

// Generic fetch function with error handling
const fetchData = async (
  endpoint: string,
  accessToken: string,
  tag: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: [tag],
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${tag}: ${response.statusText}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${tag}:`, error);
    return [];
  }
};

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

  // Parallel data fetching
  const [users, roles, modules] = await Promise.all([
    fetchData(ENDPOINTS.users, accessToken, "users"),
    fetchData(ENDPOINTS.roles, accessToken, "roles"),
    fetchData(ENDPOINTS.modules, accessToken, "permission-modules"),
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
