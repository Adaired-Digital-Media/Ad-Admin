"use client";

import { useState } from "react";
import { Box, Flex, Text } from "rizzui";
import cn from "@core/utils/class-names";
import WidgetCard from "@core/components/cards/widget-card";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
// import DropdownAction from '@core/components/charts/dropdown-action';
import { useElementSize } from "@core/hooks/use-element-size";

// const viewOptions = [
//   {
//     value: 'Daily',
//     label: 'Daily',
//   },
//   {
//     value: 'Monthly',
//     label: 'Monthly',
//   },
// ];

// Define colors for ticket statuses
const COLORS = [
  "#FF6B6B", // Open: Vivid Red
  "#2ECC71", // Closed: Emerald Green
  "#3498DB", // Resolved: Bright Blue
  "#F1C40F", // Assigned to Me: Vivid Yellow
  "#E67E22", // Reopened: Orange
];

export default function SalesAnalytics({
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
    reopened?: number;
  };
}) {
  const [, setActiveIndex] = useState(0);
  const [chartRef] = useElementSize();

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  // function handleChange(viewType: string) {
  //   console.log(viewType);
  // }

  // Dynamically create data array based on available stats
  const data = [
    { name: "Open", value: ticketStats?.open },
    { name: "Closed", value: ticketStats.closed },
    ...(ticketStats.resolved !== undefined
      ? [{ name: "Resolved", value: ticketStats?.resolved }]
      : []),
    ...(ticketStats.assignedToMe !== undefined
      ? [{ name: "Assigned to Me", value: ticketStats?.assignedToMe }]
      : []),
    ...(ticketStats.reopened !== undefined
      ? [{ name: "Reopened", value: ticketStats?.reopened }]
      : []),
  ];

  // Filter out entries with zero or undefined values
  const filteredData = data.filter((item) => item.value > 0);

  // const valueSum = filteredData.reduce((total, item) => total + item.value, 0);
  // const calculatePercentage = (part: number, total: number) =>
  //   total > 0 ? ((part / total) * 100).toFixed(2) : "0.00";

  return (
    <WidgetCard
      title="Tickets Status"
      className={cn("@container", className)}
      headerClassName="mb-6 lg:mb-0"
      // action={<DropdownAction options={viewOptions} onChange={handleChange} />}
      ref={chartRef}
    >
      <Box className="relative mx-auto size-[290px] @sm:size-[340px]">
        <ResponsiveContainer
          width={"100%"}
          height="100%"
          className="relative z-10"
        >
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              dataKey="value"
              innerRadius="42%"
              outerRadius="70%"
              data={filteredData}
              onMouseEnter={onPieEnter}
              // activeIndex={activeIndex}
              cornerRadius={6}
              paddingAngle={4}
              label
            >
              {filteredData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <Box className="absolute inset-24 flex flex-col items-center justify-center rounded-full bg-white shadow-[0px_4px_20px_0px_#00000029] @sm:inset-28 dark:bg-gray-200">
          <Text className="text-center text-gray-500">Total Tickets</Text>
          <Text className="text-xl font-semibold dark:text-white">
            {ticketStats?.total ?? 0}
          </Text>
        </Box>
      </Box>

      <Flex justify="center" className="flex-wrap @lg:gap-8">
        {data.map((item, index) => (
          <Box key={item.name}>
            <Flex align="center" gap="1">
              <span
                className="me-2 h-2.5 w-3.5 flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <Text as="span" className="whitespace-nowrap">
                {item.name}
              </Text>
            </Flex>
            <Text as="p" className="ms-[26px] font-medium">
              {/* {calculatePercentage(item.value, valueSum)}% */}
              {item.value}
            </Text>
          </Box>
        ))}
      </Flex>
    </WidgetCard>
  );
}
