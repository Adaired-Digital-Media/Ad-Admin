"use client";

import { Text } from "rizzui";
import cn from "@core/utils/class-names";
import WidgetCard from "@core/components/cards/widget-card";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { useElementSize } from "@core/hooks/use-element-size";

export default function TicketsWidget({
  className,
  ticketStats,
}: {
  className?: string;
  ticketStats: {
    total: number;
    open: number;
    closed: number;
    resolved?: number;
    assignedToMe?: number;
    efficiency?: number;
    reopened?: number;
  };
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartRef, { width }] = useElementSize();

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  // Dynamically create data array based on available stats
  const data = [
    { name: "Open", value: ticketStats.open },
    { name: "Closed", value: ticketStats.closed },
    ...(ticketStats.resolved !== undefined
      ? [{ name: "Resolved", value: ticketStats.resolved }]
      : []),
    ...(ticketStats.assignedToMe !== undefined
      ? [{ name: "Assigned to Me", value: ticketStats.assignedToMe }]
      : []),
    ...(ticketStats.reopened !== undefined
      ? [{ name: "Reopened", value: ticketStats.reopened }]
      : []),
  ];
  // Filter out entries with zero or undefined values
  const filteredData = data.filter((item) => item.value > 0);

  const valueSum = filteredData.reduce((total, item) => total + item.value, 0);
  const calculatePercentage = (part: number, total: number) =>
    total > 0 ? ((part / total) * 100).toFixed(2) : "0.00";

  const COLORS = ["#FA436B", "#4C2889", "#36A2EB", "#4BC0C0", "#FFCE56"];

  return (
    <WidgetCard
      rounded="lg"
      title="Tickets Status"
      className={cn("grid", className)}
      headerClassName="mb-8 lg:mb-0"
      ref={chartRef}
    >
      <div className="h-80 w-full max-w-full justify-around gap-6 @sm:pt-3 @7xl:gap-8 md:h-[26rem] 3xl:h-[22rem]">
        <ResponsiveContainer
          width={width - 56}
          height="100%"
          className="mx-auto"
        >
          <PieChart
            margin={{
              top: -30,
            }}
          >
            <Pie
              cx="50%"
              cy="50%"
              dataKey="value"
              innerRadius="40%"
              outerRadius="70%"
              fill="#8884d8"
              paddingAngle={4}
              data={data}
              onMouseEnter={onPieEnter}
              activeIndex={activeIndex}
              cornerRadius={6}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-6 @md:grid-cols-4">
        {data.map((item, index) => (
          <div key={item.name} className="grid gap-2">
            <div className="flex items-center">
              <span
                className="me-2 h-2.5 w-3.5 flex-shrink-0"
                style={{ backgroundColor: COLORS[index] }}
              />
              <Text as="span" className="whitespace-nowrap">
                {item.name}
              </Text>
            </div>
            <Text as="p" className="ms-5 font-medium">
              {calculatePercentage(item.value, valueSum)}%
            </Text>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
