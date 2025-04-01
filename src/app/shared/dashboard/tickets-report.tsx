"use client";

import { Box, Button, Text } from "rizzui";
import cn from "@core/utils/class-names";
import WidgetCard from "@core/components/cards/widget-card";
// import ButtonGroupAction from "@core/components/charts/button-group-action";
// import { CustomTooltip } from "@core/components/charts/custom-tooltip";
// import { PiInfoFill } from "react-icons/pi";
// import MetricCard from "@/core/components/cards/metric-card";
// import TagIcon3 from "@/core/components/icons/tag-3";
// import TicketIcon from "@/core/components/icons/ticket";
// import TagIcon from "@/core/components/icons/tag";
// import TagIcon2 from "@/core/components/icons/tag-2";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export default function TicketsWidget({ className }: { className?: string }) {
  // const ticketStats = [
  //   {
  //     id: 1,
  //     icon: <TicketIcon className="h-full w-full" />,
  //     title: "Total Number of Tickets",
  //     metric: "12,450",
  //   },
  //   {
  //     id: 2,
  //     icon: <TagIcon className="h-full w-full" />,
  //     title: "Unassigned Tickets",
  //     metric: "3,590",
  //   },
  //   {
  //     id: 3,
  //     icon: <TagIcon2 className="h-full w-full" />,
  //     title: "Open Tickets",
  //     metric: "7,890",
  //   },
  //   {
  //     id: 3,
  //     icon: <TagIcon3 className="h-full w-full" />,
  //     title: "Solved Tickets",
  //     metric: "1,160",
  //   },
  // ];

  const overAllProgressData = [
    { name: "Total Tickets", percentage: 126, color: "#00858D", count: 124 },
    { name: "Unassigned", percentage: 26, color: "#65BE58", count: 26 },
    { name: "Open", percentage: 36, color: "#FF712F", count: 36 },
    { name: "Solved", percentage: 46, color: "#666666", count: 46 },
  ];
  return (
    //     <WidgetCard
    //     // title={'Ticket'}
    //     description={'Tickets'}
    //     titleClassName="text-gray-500 font-normal font-inter !text-sm"
    //     descriptionClassName="text-lg font-semibold sm:text-xl 3xl:text-2xl text-gray-900 font-lexend mt-1"
    //     action={
    //       <Button variant="outline" size="sm" className="text-sm">
    //         Details
    //       </Button>
    //     }
    //     headerClassName="mb-6"
    //     className={cn('flex flex-col', className)}
    //   >
    //     <div className="grid flex-grow grid-cols-2 gap-3">
    //        {ticketStats.map((stat) => (
    //         <MetricCard
    //           key={stat.title + stat.id}
    //           title={stat.title}
    //           metric={stat.metric}
    //           icon={stat.icon}
    //           iconClassName="bg-transparent w-11 h-11"
    //         />
    //       ))}
    //     </div>
    //   </WidgetCard>
    <WidgetCard
      title="Tickets Status"
      headerClassName="items-center"
      className={cn("@container dark:bg-gray-100/50", className)}
      action={
        <Button variant="outline" size="sm" className="text-sm">
          Details
        </Button>
      }
    >
      <Box className="relative h-60 w-full translate-y-6 @sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart
            margin={{
              top: 40,
              right: 10,
            }}
            className="relative focus:[&_.recharts-sector]:outline-none"
          >
            <Pie
              label
              data={overAllProgressData}
              endAngle={-10}
              stroke="none"
              startAngle={190}
              paddingAngle={1}
              cornerRadius={12}
              dataKey="percentage"
              innerRadius={"85%"}
              outerRadius={"100%"}
            >
              {overAllProgressData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <Box className="absolute bottom-20 start-1/2 -translate-x-1/2 text-center @sm:bottom-28">
          <Text className="text-2xl font-bold text-gray-800 @lg:text-4xl">
            72%
          </Text>
          <Text className="font-medium">Completed</Text>
        </Box>
      </Box>

      <Box className="grid grid-cols-2 gap-8 text-center @sm:flex @sm:flex-wrap @sm:justify-center @sm:text-start">
        {overAllProgressData.map((item) => (
          <Box key={item.name}>
            <Text
              className="block text-xl font-bold @xl:text-2xl"
              style={{ color: item.color }}
            >
              {item.count}
            </Text>
            <Text className="whitespace-nowrap">{item.name}</Text>
          </Box>
        ))}
      </Box>
    </WidgetCard>
  );
}
