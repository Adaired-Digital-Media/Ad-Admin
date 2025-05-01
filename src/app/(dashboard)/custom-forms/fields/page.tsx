import CreateEditField from "@/app/shared/ecommerce/custom-forms/fields/create-edit";
import FieldsTable from "@/app/shared/ecommerce/custom-forms/fields/list/table";
import ModalButton from "@/app/shared/modal-button";
import PageHeader from "@/app/shared/page-header";
import { auth } from "@/auth";
import { routes } from "@/config/routes";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Forms Fields"),
};

const pageHeader = {
  title: " Forms Fields",
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
      name: "Fields",
    },
  ],
};

// Centralized API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI;

// Fetch endpoints configuration
const ENDPOINTS = {
  fields: "/product/form/read-fields",
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

    const { fields } = await response.json();

    return fields;
  } catch (error) {
    console.error(`Error fetching ${tag}:`, error);
    return [];
  }
};

const FormFields = async () => {
  const session = await auth();

  if (!session) {
    throw new Error("User session is not available.");
  }
  const accessToken = session?.user?.accessToken || "";

  // Parallel data fetching
  const [fields] = await Promise.all([
    fetchData(ENDPOINTS.fields, accessToken, "fields"),
  ]);
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <ModalButton
          label="Create New Field"
          view={<CreateEditField session={session} />}
          modalSize="lg"
        />
      </PageHeader>
      <FieldsTable initialFields={fields} pageSize={10} session={session}/>
    </>
  );
};

export default FormFields;
