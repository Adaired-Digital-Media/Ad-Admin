/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApiCall } from "@/core/utils/api-config";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  PiCheckCircleBold,
  PiClockBold,
  PiPlusCircle,
  PiArchiveBold,
  PiEmptyBold,
  PiHourglassBold,
  PiChecksBold  
} from "react-icons/pi";
import { Select, SelectOption, Text } from "rizzui";

export function StatusSelect({
  toUpdate = "status",
  selectItem,
  options,
  method,
  endpoint,
  revalidatePath,
}: {
  toUpdate?: string;
  selectItem?: string;
  options: SelectOption[];
  method?: "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  revalidatePath?: string[];
}) {
  const initialValue = options.find((option) => option.label === selectItem);
  const [value, setValue] = useState<SelectOption | undefined>(initialValue);
  const { apiCall } = useApiCall();

  const handleStatusChange = async (selectedOption: SelectOption) => {

    const response = await apiCall<{ message: string }>({
      url: endpoint,
      method: method ?? "PATCH",
      data: { [toUpdate]: selectedOption.value },
    });

    if (response.status === 200) {
      toast.success(response.data.message);
      if (revalidatePath) {
        revalidatePath.forEach(async (path) => {
          await fetch(path, {
            method: "GET",
          });
        });
      }
    }
  };

  return (
    <Select
      dropdownClassName="!z-10"
      className="min-w-[140px]"
      placeholder="Select Role"
      options={options}
      value={value}
      onChange={(value: SelectOption) => {
        setValue(value);
        if (value) handleStatusChange(value);
      }}
      displayValue={(option: { value: any }) =>
        renderOptionDisplayValue(option.value as string)
      }
    />
  );
}

function renderOptionDisplayValue(value: string) {
  switch (value) {
    case "Scheduled":
      return (
        <div className="flex items-center">
          <PiClockBold className="shrink-0 fill-green-dark text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "Archived":
      return (
        <div className="flex items-center">
          <PiArchiveBold className="shrink-0 fill-orange text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );

    case "Closed":
      return (
        <div className="flex items-center">
          <PiPlusCircle className="shrink-0 rotate-45 fill-red-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );

    case "Inactive":
      return (
        <div className="flex items-center">
          <PiPlusCircle className="shrink-0 rotate-45 fill-red-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "Out of Stock":
      return (
        <div className="flex items-center">
          <PiEmptyBold className="shrink-0 fill-red-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );

    case "Live":
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-green-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "Active":
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-green-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );

    case "Waiting":
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-orange text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "Draft":
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-orange text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );

    // Order Statuses
    case "Pending":
      return (
        <div className="flex items-center">
          <PiHourglassBold className="shrink-0 fill-black text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "Processing":
      return (
        <div className="flex items-center">
          <PiClockBold className="shrink-0 fill-orange text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "Confirmed":
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-green-dark text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "Completed":
      return (
        <div className="flex items-center">
          <PiChecksBold  className="shrink-0 fill-green-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "Cancelled":
      return (
        <div className="flex items-center">
          <PiEmptyBold className="shrink-0 fill-red-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );

    // Payment methods
    case "Unpaid":
      return (
        <div className="flex items-center">
          <PiPlusCircle className="shrink-0 rotate-45 fill-red-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "Paid":
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-green-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "Refunded":
      return (
        <div className="flex items-center">
          <PiArchiveBold className="shrink-0 fill-orange text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "Failed":
      return (
        <div className="flex items-center">
          <PiEmptyBold className="shrink-0 fill-red-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );

    default:
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-orange text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
  }
}
