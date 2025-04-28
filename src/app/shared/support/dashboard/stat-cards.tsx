"use client";

import cn from "@core/utils/class-names";
import TicketIcon from "@core/components/icons/ticket";
import TagIcon from "@core/components/icons/tag";
import MetricCard from "@core/components/cards/metric-card";
import TagIcon2 from "@core/components/icons/tag-2";
import TagIcon3 from "@core/components/icons/tag-3";
import { AdminStats, SupportStats } from "@/data/tickets.types";

// import { useAtom } from "jotai";
// import { useState } from "react";

export default function StatCards({
  className,
  initialStats,
}: {
  className?: string;
  initialStats: AdminStats | SupportStats;
}) {
  const ticketStats = [
    {
      id: 1,
      icon: <TicketIcon className="h-full w-full" />,
      title: "Total Number of Tickets",
      metric:
        "totalTickets" in initialStats ? initialStats.totalTickets : "N/A",
    },
    {
      id: 2,
      icon: <TagIcon className="h-full w-full" />,
      title: "Open Tickets",
      metric: "openTickets" in initialStats ? initialStats.openTickets : "N/A",
    },
    {
      id: 3,
      icon: <TagIcon className="h-full w-full" />,
      title: "Resolved Tickets",
      metric:
        "resolvedTickets" in initialStats
          ? initialStats.resolvedTickets
          : "N/A",
    },
    {
      id: 4,
      icon: <TagIcon2 className="h-full w-full" />,
      title: "Closed Tickets",
      metric:
        "closedTickets" in initialStats ? initialStats.closedTickets : "N/A",
    },
    {
      id: 5,
      icon: <TagIcon3 className="h-full w-full" />,
      title: "Assigned To Me",
      metric:
        "ticketsAssignedToMe" in initialStats
          ? initialStats.ticketsAssignedToMe
          : "N/A",
    },
  ];

  // const [stats, setStats] = useAtom(ticketsWithActionsAtom);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  return (
    <div
      className={cn("grid grid-cols-1 gap-5 3xl:gap-8 4xl:gap-9", className)}
    >
      {ticketStats.map((stat) => (
        <MetricCard
          key={stat.title + stat.id}
          title={stat.title}
          metric={stat.metric}
          icon={stat.icon}
          iconClassName="bg-transparent w-11 h-11"
        />
      ))}
    </div>
  );
}
