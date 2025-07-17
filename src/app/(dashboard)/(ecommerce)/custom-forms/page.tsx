import CreateEditForm from "@/app/shared/ecommerce/custom-forms/forms/create-edit";
import FormsTable from "@/app/shared/ecommerce/custom-forms/forms/list/table";
import ModalButton from "@/app/shared/modal-button";
import PageHeader from "@/app/shared/page-header";
import { auth } from "@/auth";
import { routes } from "@/config/routes";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Custom Forms"),
};

const pageHeader = {
  title: "Custom Forms",
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: "Dashboard",
    },
    {
      href: routes.customForms.all,
      name: "Custom Forms",
    },
    {
      name: "List",
    },
  ],
};

// Centralized API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI;

// Fetch endpoints configuration
const ENDPOINTS = {
  forms: "/product/form/read-form",
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

    const { forms } = await response.json();

    return forms;
  } catch (error) {
    console.error(`Error fetching ${tag}:`, error);
    return [];
  }
};

const CustomForms = async () => {
  const session = await auth();

  if (!session) {
    throw new Error("User session is not available.");
  }
  const accessToken = session?.user?.accessToken || "";

  // Parallel data fetching
  const [forms] = await Promise.all([
    fetchData(ENDPOINTS.forms, accessToken, "forms"),
  ]);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <ModalButton
          label="Create New Form"
          view={<CreateEditForm session={session} />}
          customSize=""
          modalSize="xl"
        />
      </PageHeader>
      <FormsTable initialForms={forms} pageSize={10} session={session} />
    </>
  );
};

export default CustomForms;
