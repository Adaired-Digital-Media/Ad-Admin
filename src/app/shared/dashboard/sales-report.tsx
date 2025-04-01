"use client";
import WidgetCard from "@core/components/cards/widget-card";
import { DatePicker } from "@core/ui/datepicker";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import { Badge } from "rizzui";
import { useMedia } from "@core/hooks/use-media";
import { CustomYAxisTick } from "@core/components/charts/custom-yaxis-tick";
import { CustomTooltip } from "@core/components/charts/custom-tooltip";
import SimpleBar from "@core/ui/simplebar";
import { SalesReportProps } from "@/core/types";

export default function SalesReport({
  className,
  salesReport,
  selectedYear,
  setSelectedYear,
  accessToken,
  setSalesReport,
}: SalesReportProps) {
  const isTablet = useMedia("(max-width: 820px)", false);
  const handleYearChange = (date: Date | null) => {
    if (date) {
      const newYear = date.getFullYear();
      setSelectedYear(newYear);
      setSalesReport({
        type: "fetch",
        accessToken,
        year: newYear,
      });
    }
  };

  return (
    <WidgetCard
      title={"Sales Report"}
      description={
        <>
          <Badge renderAsDot className="me-0.5 bg-[#282ECA]" /> Revenue
          <Badge
            renderAsDot
            className="me-0.5 ms-4 bg-[#B8C3E9] dark:bg-[#7c88b2]"
          />{" "}
          Sales
        </>
      }
      descriptionClassName="text-gray-500 mt-1.5"
      action={
        <DatePicker
          selected={new Date(selectedYear, 0, 1)}
          onChange={handleYearChange}
          dateFormat="yyyy"
          placeholderText="Select Year"
          showYearPicker
          inputProps={{ variant: "text", inputClassName: "p-0 px-1 h-auto" }}
          popperPlacement="bottom-end"
          className="w-[100px]"
        />
      }
      className={className}
    >
      <SimpleBar>
        <div className="h-96 w-full pt-9">
          <ResponsiveContainer
            width="100%"
            height="100%"
            {...(isTablet && { minWidth: "700px" })}
          >
            <ComposedChart
              data={salesReport}
              barSize={isTablet ? 20 : 24}
              className="[&_.recharts-tooltip-cursor]:fill-opacity-20 dark:[&_.recharts-tooltip-cursor]:fill-opacity-10 [&_.recharts-cartesian-axis-tick-value]:fill-gray-500 [&_.recharts-cartesian-axis.yAxis]:-translate-y-3 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12 [&_.recharts-cartesian-grid-vertical]:opacity-0"
            >
              <defs>
                <linearGradient id="salesReport" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#F0F1FF"
                    className="[stop-opacity:0.1]"
                  />
                  <stop offset="95%" stopColor="#8200E9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="8 10" strokeOpacity={0.435} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={<CustomYAxisTick prefix={"$"} />}
              />
              <Tooltip
                content={
                  <CustomTooltip className="[&_.chart-tooltip-item:last-child]:hidden" />
                }
              />
              <Bar
                dataKey="revenue"
                fill="#282ECA"
                stackId="a"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="sales"
                stackId="a"
                fill="#B8C3E9"
                fillOpacity={0.9}
                radius={[4, 4, 0, 0]}
              />
              <Area
                type="bump"
                dataKey="revenue"
                stroke="#8200E9"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#salesReport)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </SimpleBar>
    </WidgetCard>
  );
}
