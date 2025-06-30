import PageHeader from "@/app/shared/page-header";
import SupportDashboard from "@/app/shared/support/dashboard";
import { auth } from "@/auth";
import { routes } from "@/config/routes";
import { metaObject } from "@/config/site.config";
import ModalButton from "@/app/shared/modal-button";
import CreateTicket from "@/app/shared/support/dashboard/tickets/create-ticket";

export const metadata = {
  ...metaObject("Support"),
};

const pageHeader = {
  title: "Support Inbox",
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: "Dashboard",
    },
    {
      href: routes.support.support,
      name: "Support",
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
  tickets: "/tickets/read",
  stats: "/tickets/stats",
  users: "/user/find",
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

export default async function SupportDashboardPage() {
  const session = await auth();

  if (!session) {
    throw new Error("User session is not available.");
  }
  const accessToken = session?.user?.accessToken || "";

  // Parallel data fetching
  const [tickets, stats, users] = await Promise.all([
    fetchData(ENDPOINTS.tickets, accessToken, "tickets"),
    fetchData(ENDPOINTS.stats, accessToken, "ticket_stats"),
    fetchData(ENDPOINTS.users, accessToken, "users"),
  ]);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <ModalButton
          label="Create New Ticket"
          view={<CreateTicket session={session} users={users} />}
        />
      </PageHeader>
      <SupportDashboard tickets={tickets} stats={stats} session={session} />
    </>
  );
}
