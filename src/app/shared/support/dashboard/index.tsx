import { Ticket } from "@/data/tickets.types";
import StatCards from "./stat-cards";
import { AdminStats, SupportStats } from "@/store/atoms/tickets.atom";
import TicketsTable from "./tickets";
import { Session } from "next-auth";

export default function SupportDashboard({
  tickets,
  stats,
  session,
}: {
  tickets: Ticket[];
  stats: AdminStats | SupportStats;
  session: Session;
}) {
  return (
    <div className="@container">
      <div className="grid grid-cols-12 gap-6 3xl:gap-8">
        <StatCards
          className="col-span-full @2xl:grid-cols-2 @6xl:grid-cols-4"
          initialStats={stats}
        />

        <TicketsTable
          className="col-span-full"
          tickets={tickets}
          session={session}
        />
      </div>
    </div>
  );
}
