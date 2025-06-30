/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Title, Text, Button } from "rizzui";
import cn from "@core/utils/class-names";
import MusicIcon from "@core/components/icons/music-solid";
import VideoIcon from "@core/components/icons/video-solid";
import DriveIcon from "@core/components/icons/drive-solid";
import ExpenseIcon from "@/core/components/icons/expenses";
import { useScrollableSlider } from "@core/hooks/use-scrollable-slider";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";
import MetricCard from "@core/components/cards/metric-card";
import CircleProgressBar from "@core/components/charts/circle-progressbar";
import ExchangeIcon from "@/core/components/icons/exchange";

type FileStatsType = {
  className?: string;
  usage: any;
};

// @md:grid-cols-2 @2xl:grid-cols-3 @3xl:grid-cols-4 @7xl:grid-cols-5
export default function FileStats({ className, usage }: FileStatsType) {
  const {
    sliderEl,
    sliderPrevBtn,
    sliderNextBtn,
    scrollToTheRight,
    scrollToTheLeft,
  } = useScrollableSlider();

  const filesStatData = [
    {
      id: 1,
      title: "Plan",
      metric: `${usage?.plan}`,
      icon: <ExpenseIcon className="h-12 w-10" />,
      fill: "#4c5c75",
      percentage: `${usage?.credits?.used_percent}`,
    },
    {
      id: 2,
      title: "Total Storage",
      metric: `${(usage?.storage?.usage / (1024 * 1024 * 1024)).toFixed(
        2
      )} GB`,
      icon: <DriveIcon className="h-12 w-10" />,
      fill: "#f3962d",
      percentage: `${
        (parseFloat(
          (usage?.storage?.usage / (1024 * 1024 * 1024)).toFixed(2)
        ) /
          usage?.credits?.limit) *
        100
      }`,
    },
    {
      id: 3,
      title: "Bandwidth",
      metric: `${(usage?.bandwidth?.usage / (1024 * 1024 * 1024)).toFixed(
        2
      )} GB`,
      icon: <ExchangeIcon className="h-12 w-10" />,
      fill: "#6d98ff",
      percentage: `${
        (parseFloat(
          (usage?.bandwidth?.usage / (1024 * 1024 * 1024)).toFixed(2)
        ) /
          usage?.credits?.limit) *
        100
      }`,
    },
    {
      id: 4,
      title: "Audios",
      metric: "54 GB",
      icon: <MusicIcon className="h-10 w-10" />,
      fill: "#fbc13b",
      percentage: 54,
    },
    {
      id: 5,
      title: "Videos",
      metric: "67 GB",
      icon: <VideoIcon className="h-10 w-10" />,
      fill: "#e16244",
      percentage: 67,
    },
  ];

  return (
    <div
      className={cn(
        "relative flex w-auto items-center overflow-hidden",
        className
      )}
    >
      <Button
        title="Prev"
        variant="text"
        ref={sliderPrevBtn}
        onClick={() => scrollToTheLeft()}
        className="!absolute left-0 top-0 z-10 !h-full w-8 !justify-start rounded-none bg-gradient-to-r from-white via-white to-transparent px-0 text-gray-500 hover:text-black dark:from-gray-50/80 dark:via-gray-50/80 3xl:hidden"
      >
        <PiCaretLeftBold className="h-5 w-5" />
      </Button>
      <div className="w-full overflow-hidden">
        <div
          ref={sliderEl}
          className="custom-scrollbar-x grid grid-flow-col gap-5 overflow-x-auto scroll-smooth"
        >
          {filesStatData.map((stat: any) => {
            return (
              <MetricCard
                key={stat.id}
                title=""
                metric=""
                className="min-w-[292px] max-w-full flex-row-reverse"
              >
                <div className="flex items-center justify-start gap-5">
                  <div className="w-14">
                    <CircleProgressBar
                      percentage={stat.percentage}
                      size={80}
                      stroke="#D7E3FE"
                      strokeWidth={5}
                      progressColor={stat.fill}
                      useParentResponsive={true}
                      label={stat.icon}
                      strokeClassName="dark:stroke-gray-300"
                    />
                  </div>
                  <div className="">
                    <Text className="mb-1 text-sm font-medium text-gray-500">
                      {stat.title}
                    </Text>
                    <Title
                      as="h4"
                      className="mb-1 text-xl font-semibold text-gray-900"
                    >
                      {stat.metric}
                      {stat.title !== "Plan" && (
                        <span className="inline-block text-sm font-normal text-gray-500">
                          &nbsp; of {usage?.credits?.limit} GB
                        </span>
                      )}
                    </Title>
                  </div>
                </div>
              </MetricCard>
            );
          })}
        </div>
      </div>
      <Button
        title="Next"
        variant="text"
        ref={sliderNextBtn}
        onClick={() => scrollToTheRight()}
        className="!absolute right-0 top-0 z-10 !h-full w-8 !justify-end rounded-none bg-gradient-to-l from-white via-white to-transparent px-0 text-gray-500 hover:text-black dark:from-gray-50/80 dark:via-gray-50/80 3xl:hidden"
      >
        <PiCaretRightBold className="h-5 w-5" />
      </Button>
    </div>
  );
}

