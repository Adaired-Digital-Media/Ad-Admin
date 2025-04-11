import SupportDashboard from "@/app/shared/support/dashboard";
import { auth } from "@/auth";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Support"),
};

// Centralized API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI;

// Fetch endpoints configuration
const ENDPOINTS = {
  tickets: "/tickets/read",
  stats: "/tickets/stats",
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
  const [tickets, stats] = await Promise.all([
    fetchData(ENDPOINTS.tickets, accessToken, "tickets"),
    fetchData(ENDPOINTS.stats, accessToken, "ticket_stats"),
  ]);

  return <SupportDashboard tickets={tickets} stats={stats} session={session} />;
}
