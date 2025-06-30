"use client";

import cn from "@core/utils/class-names";
import TicketIcon from "@core/components/icons/ticket";
import TagIcon from "@core/components/icons/tag";
import MetricCard from "@core/components/cards/metric-card";
import TagIcon2 from "@core/components/icons/tag-2";
import TagIcon3 from "@core/components/icons/tag-3";
import { TicketStatsResponse } from "@/data/tickets.types";

// Helper function to get appropriate icon based on metric title
const getIconForMetric = (title: string) => {
  switch (title) {
    case "Total Tickets":
      return <TicketIcon className="h-full w-full" />;
    case "Open Tickets":
    case "Reopened Tickets":
      return <TagIcon className="h-full w-full" />;
    case "Closed Tickets":
      return <TagIcon2 className="h-full w-full" />;
    case "Resolved Tickets":
      return <TagIcon className="h-full w-full" />;
    case "Assigned To Me":
      return <TagIcon3 className="h-full w-full" />;
    case "Efficiency":
      return <TagIcon3 className="h-full w-full" />;
    default:
      return <TicketIcon className="h-full w-full" />;
  }
};

// Helper function to format metric values
const formatMetric = (title: string, value: number) => {
  if (title.includes("Efficiency")) {
    return `${value}%`;
  }
  return value;
};

export default function StatCards({
  className,
  statsData,
}: {
  className?: string;
  statsData: TicketStatsResponse;
}) {
  const { role, stats } = statsData;

  // Common metrics for all roles
  const commonCards = [
    {
      id: 1,
      title: "Total Tickets",
      metric: stats.total,
    },
    {
      id: 2,
      title: "Open Tickets",
      metric: stats.open,
    },
    {
      id: 3,
      title: "Closed Tickets",
      metric: stats.closed,
    },
  ];

  // Role-specific metrics
  const roleSpecificCards = [];
  
  if (role === "admin") {
    roleSpecificCards.push(
      {
        id: 4,
        title: "Resolved Tickets",
        metric: stats.resolved || 0,
      },
      {
        id: 5,
        title: "Assigned To Me",
        metric: stats.assignedToMe || 0,
      }
    );
  } else if (role === "support") {
    roleSpecificCards.push({
      id: 4,
      title: "Efficiency",
      metric: stats.efficiency || 0,
    });
  } else if (role === "customer") {
    roleSpecificCards.push({
      id: 4,
      title: "Reopened Tickets",
      metric: stats.reopened || 0,
    });
  }

  // Combine all cards and add icons/formatted metrics
  const allCards = [...commonCards, ...roleSpecificCards].map((card) => ({
    ...card,
    icon: getIconForMetric(card.title),
    metric: formatMetric(card.title, card.metric),
  }));

  return (
    <div className={cn("grid grid-cols-1 gap-5 3xl:gap-8 4xl:gap-9", className)}>
      {allCards.map((stat) => (
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
