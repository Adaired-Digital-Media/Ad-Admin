/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApiCall } from "@/core/utils/api-config";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  PiCheckCircleBold,
  PiClockBold,
  PiPlusCircle,
  PiArchiveBold,
  PiEmptyBold,
  PiHourglassBold,
  PiChecksBold,
} from "react-icons/pi";
import { Select, SelectOption, Text } from "rizzui";

export function StatusSelect({
  toUpdate = "status",
  selectItem,
  options,
  method,
  endpoint,
  revalidatePath,
  placeholder = "Select",
}: {
  placeholder?: string;
  toUpdate?: string;
  selectItem: string;
  options: SelectOption[];
  method?: "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  revalidatePath?: string[];
}) {
  const initialValue =
    options.find(
      (option) =>
        option.value.toString().toLowerCase() === selectItem?.toLowerCase()
    ) || options[0];

  const [value, setValue] = useState<SelectOption | undefined>(initialValue);

  // Reinitialize value when selectItem changes
  useEffect(() => {
    const newValue =
      options.find(
        (option) =>
          option.value.toString().toLowerCase() === selectItem?.toLowerCase()
      ) || options[0];
    if (!selectItem) {
      console.warn(
        "StatusSelect: selectItem is undefined, defaulting to",
        newValue.value
      );
    }
    setValue(newValue);
  }, [selectItem, options]);

  const { apiCall } = useApiCall();

  const handleStatusChange = async (selectedOption: SelectOption) => {
    console.log("Updating status to:", selectedOption.value);
    const response = await apiCall<{ message: string }>({
      url: endpoint,
      method: method ?? "PATCH",
      data: { [toUpdate]: selectedOption.value },
    });

    console.log("API response:", response);
    if (response.status === 200) {
      toast.success(response.data.message);
      if (revalidatePath) {
        for (const path of revalidatePath) {
          await fetch(path);
        }
      }
      return true;
    } else {
      toast.error(response?.data?.message || "Failed to update");
      return false;
    }
  };

  return (
    <Select
      dropdownClassName="!z-10"
      className="min-w-[70px]"
      placeholder={placeholder}
      options={options}
      value={value}
      onChange={async (value: SelectOption) => {
        if (!value) return;
        await handleStatusChange(value);
        setValue(value);
      }}
      displayValue={(option: { value: any }) =>
        renderOptionDisplayValue(option.value as string)
      }
    />
  );
}

export function renderOptionDisplayValue(value: string) {
  switch (value) {
    case "archived":
      return (
        <div className="flex items-center">
          <PiArchiveBold className="shrink-0 fill-orange text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "closed":
      return (
        <div className="flex items-center">
          <PiPlusCircle className="shrink-0 rotate-45 fill-red-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );

    // Product Statuses
    case "out of stock":
      return (
        <div className="flex items-center">
          <PiEmptyBold className="shrink-0 fill-red-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );

    // Blog Statuses
    case "publish":
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-green-dark text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "draft":
      return (
        <div className="flex items-center">
          <PiArchiveBold className="shrink-0 fill-orange text-base" />

          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "scheduled":
      return (
        <div className="flex items-center">
          <PiClockBold className="shrink-0 fill-orange text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );

    // Order Statuses
    case "pending":
      return (
        <div className="flex items-center">
          <PiHourglassBold className="shrink-0 fill-black text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "processing":
      return (
        <div className="flex items-center">
          <PiClockBold className="shrink-0 fill-orange text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "confirmed":
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-green-dark text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "completed":
      return (
        <div className="flex items-center">
          <PiChecksBold className="shrink-0 fill-green-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "cancelled":
      return (
        <div className="flex items-center">
          <PiEmptyBold className="shrink-0 fill-red-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );

    // Payment methods
    case "unpaid":
      return (
        <div className="flex items-center">
          <PiPlusCircle className="shrink-0 rotate-45 fill-red-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "paid":
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-green-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "refunded":
      return (
        <div className="flex items-center">
          <PiArchiveBold className="shrink-0 fill-orange text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "failed":
      return (
        <div className="flex items-center">
          <PiEmptyBold className="shrink-0 fill-red-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );

    // Tickets methods
    case "open":
      return (
        <div className="flex items-center">
          <PiHourglassBold className="shrink-0 fill-black text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "in progress":
      return (
        <div className="flex items-center">
          <PiClockBold className="shrink-0 fill-orange text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "resolved":
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-green-dark text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "reopened":
      return (
        <div className="flex items-center">
          <PiHourglassBold className="shrink-0 fill-black text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );

    // ******************************* Active & Inactive ********************************
    case "inactive":
      return (
        <div className="flex items-center">
          <PiPlusCircle className="shrink-0 rotate-45 fill-red-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "active":
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-green-dark text-lg" />
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
