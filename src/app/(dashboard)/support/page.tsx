import PageHeader from "@/app/shared/page-header";
import SupportDashboard from "@/app/shared/support/dashboard";
import { auth } from "@/auth";
import { routes } from "@/config/routes";
import { metaObject } from "@/config/site.config";
import ModalButton from "@/app/shared/modal-button";
import CreateTicket from "@/app/shared/support/dashboard/tickets/create-ticket";
import { fetchData } from "@/core/utils/fetch-function";
import { Ticket, TicketStatsResponse, UserTypes } from "@/core/types";

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

// Fetch endpoints configuration
const ENDPOINTS = {
  tickets: "/tickets/read",
  stats: "/tickets/stats",
  users: "/user/find",
};

export default async function SupportDashboardPage() {
  const session = await auth();

  if (!session) {
    throw new Error("User session is not available.");
  }
  const accessToken = session?.user?.accessToken || "";

  // Parallel data fetching
  const [tickets, stats, users] = await Promise.all([
    fetchData({ endpoint: ENDPOINTS.tickets, accessToken, tag: "tickets" }),
    fetchData({ endpoint: ENDPOINTS.stats, accessToken, tag: "ticket_stats" }),
    fetchData({ endpoint: ENDPOINTS.users, accessToken, tag: "users" }),
  ]);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <ModalButton
          label="Create New Ticket"
          view={<CreateTicket session={session} users={users as UserTypes[]} />}
        />
      </PageHeader>
      <SupportDashboard
        tickets={tickets as Ticket[]}
        stats={stats as TicketStatsResponse}
        session={session}
      />
    </>
  );
}
