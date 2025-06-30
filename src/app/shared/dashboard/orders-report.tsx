"use client";

import { Button, Text, Title } from "rizzui";
import cn from "@core/utils/class-names";
import WidgetCard from "@core/components/cards/widget-card";
import { CustomTooltip } from "@core/components/charts/custom-tooltip";
import {
  PiCheckCircleDuotone,
  PiCurrencyCircleDollarDuotone,
  PiGiftDuotone,
  PiPulseDuotone,
} from "react-icons/pi";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { OrderStats } from "@/core/types";
import Link from "next/link";
import { routes } from "@/config/routes";

export default function OrdersWidget({
  className,
  orderStats,
}: {
  className?: string;
  orderStats: OrderStats | null;
}) {
  const widgetCardStat = [
    {
      title: "Total Orders",
      metric: orderStats?.allOrders ?? 0,
      bgColor: "bg-[#3872FA]/10",
      textColor: "text-[#3872FA]",
      icon: <PiGiftDuotone className="h-6 w-6" />,
    },
    {
      title: "Paid Orders",
      metric: orderStats?.paidOrders ?? 0,
      bgColor: "bg-[#10b981]/10",
      textColor: "text-[#10b981]",
      icon: <PiCurrencyCircleDollarDuotone className="h-6 w-6" />,
    },
    {
      title: "Daily Orders",
      metric: orderStats?.dailyOrders ?? 0,
      bgColor: "bg-[#f1416c]/10",
      textColor: "text-[#f1416c]",
      icon: <PiPulseDuotone className="h-6 w-6" />,
    },
    {
      title: "Completed Orders",
      metric: orderStats?.completedOrders ?? 0,
      bgColor: "bg-[#7928ca]/10",
      textColor: "text-[#7928ca]",
      icon: <PiCheckCircleDuotone className="h-6 w-6" />,
    },
  ];

  return (
    <WidgetCard
      title={"Orders Status"}
      action={
        <Link href={routes.orders.orders}>
          <Button variant="outline" size="sm" className="text-sm">
            Details
          </Button>
        </Link>
      }
      descriptionClassName="text-gray-500 mt-1.5"
      className={cn(className)}
    >
      <div className="mt-5 grid w-full grid-cols-1 justify-around gap-6 @sm:py-2 @7xl:gap-8">
        <div className="grid grid-cols-2 gap-5">
          {widgetCardStat.map((stat) => (
            <div key={stat.title} className="flex items-center">
              <div
                className={cn(
                  "me-3.5 flex h-10 w-10 items-center justify-center rounded-md bg-opacity-10 p-[9px]",
                  stat.bgColor,
                  stat.textColor
                )}
              >
                {stat.icon}
              </div>
              <div>
                <Text className="mb-1 text-gray-600">{stat.title}</Text>
                <Title as="h6" className="font-semibold">
                  {stat.metric}
                </Title>
              </div>
            </div>
          ))}
        </div>

        <div className="h-72 w-full @sm:pt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={orderStats?.chartData?.newOrders}
              margin={{
                left: -30,
              }}
              barSize={24}
            >
              <YAxis tickLine={false} axisLine={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                type="natural"
                dataKey={
                  Object.keys(orderStats?.chartData?.newOrders[0] || [])[1]
                }
                stroke="#3872FA"
                fill="#3872FA"
                strokeWidth={2}
                fillOpacity={0.1}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WidgetCard>
  );
}
