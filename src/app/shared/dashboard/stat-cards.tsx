"use client";

import MetricCard from "@core/components/cards/metric-card";
import { Text } from "rizzui";
import cn from "@core/utils/class-names";
import {
  PiCaretDoubleUpDuotone,
  PiCaretDoubleDownDuotone,
  PiGiftDuotone,
  PiBankDuotone,
  PiChartPieSliceDuotone,
} from "react-icons/pi";
import { BarChart, Bar, ResponsiveContainer } from "recharts";
import { OrderStats } from "@/core/types";

// Helper to format numbers as currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export default function StatCards({
  className,
  orderStats,
}: {
  className?: string;
  orderStats: OrderStats | null;
}) {
  const orderData = orderStats?.chartData?.newOrders.map((item) => {
    return {
      day: item.day,
      sale: item.orders,
    };
  });

  const revenueData = orderStats?.chartData?.revenue.map((item) => {
    return {
      day: item.day,
      sale: item.revenue,
    };
  });

  const eComDashboardStatData = [
    {
      id: "1",
      icon: <PiGiftDuotone className="h-6 w-6" />,
      title: "New Orders",
      metric: orderStats?.newOrders.count ?? 0,
      increased: orderStats?.newOrders.trend === "increased",
      decreased: orderStats?.newOrders.trend === "decreased",
      percentage: orderStats?.newOrders.percentageChange.toFixed(2) ?? "0.00",
      style: "text-[#3872FA]",
      fill: "#3872FA",
      chart: orderData,
    },
    {
      id: "2",
      icon: <PiChartPieSliceDuotone className="h-6 w-6" />,
      title: "Sales",
      metric: formatCurrency(orderStats?.sales.total ?? 0),
      increased: orderStats?.sales.trend === "increased",
      decreased: orderStats?.sales.trend === "decreased",
      percentage: orderStats?.sales.percentageChange.toFixed(2) ?? "0.00",
      style: "text-[#10b981]",
      fill: "#10b981",
      chart: orderStats?.chartData.sales ?? [],
    },
    {
      id: "3",
      icon: <PiBankDuotone className="h-6 w-6" />,
      title: "Revenue",
      metric: formatCurrency(orderStats?.revenue.total ?? 0),
      increased: orderStats?.revenue.trend === "increased",
      decreased: orderStats?.revenue.trend === "decreased",
      percentage: orderStats?.revenue.percentageChange.toFixed(2) ?? "0.00",
      style: "text-[#7928ca]",
      fill: "#7928ca",
      chart: revenueData ?? [],
    },
  ];

  return (
    <div
      className={cn("grid grid-cols-1 gap-5 3xl:gap-8 4xl:gap-9", className)}
    >
      {eComDashboardStatData.map((stat) => (
        <MetricCard
          key={stat.title + stat.id}
          title={stat.title}
          metric={stat.metric}
          metricClassName="lg:text-[22px]"
          icon={stat.icon}
          iconClassName={cn(
            "[&>svg]:w-10 [&>svg]:h-8 lg:[&>svg]:w-11 lg:[&>svg]:h-9 w-auto h-auto p-0 bg-transparent -mx-1.5",
            stat.id === "1" &&
              "[&>svg]:w-9 [&>svg]:h-7 lg:[&>svg]:w-[42px] lg:[&>svg]:h-[34px]",
            stat.style
          )}
          chart={
            <ResponsiveContainer width="100%" height="100%">
              <BarChart barSize={5} barGap={2} data={stat.chart}>
                <Bar dataKey="sale" fill={stat.fill} radius={5} />
              </BarChart>
            </ResponsiveContainer>
          }
          chartClassName="hidden @[200px]:flex @[200px]:items-center h-14 w-24"
          className="@container [&>div]:items-center"
        >
          <Text className="mt-5 flex items-center border-t border-dashed border-muted pt-4 leading-none text-gray-500">
            <Text
              as="span"
              className={cn(
                "me-2 inline-flex items-center font-medium",
                stat.increased ? "text-green" : "text-red"
              )}
            >
              {stat.increased ? (
                <PiCaretDoubleUpDuotone className="me-1 h-4 w-4" />
              ) : (
                <PiCaretDoubleDownDuotone className="me-1 h-4 w-4" />
              )}
              {stat.percentage}%
            </Text>
            <Text as="span" className="me-1 hidden @[240px]:inline-flex">
              {stat.increased ? "Increased" : "Decreased"}
            </Text>{" "}
            last month
          </Text>
        </MetricCard>
      ))}
    </div>
  );
}
