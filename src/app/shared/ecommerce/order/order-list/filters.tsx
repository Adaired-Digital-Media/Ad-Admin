/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DateFiled from "@core/components/controlled-table/date-field";
import PriceField from "@core/components/controlled-table/price-field";
import StatusField from "@core/components/controlled-table/status-field";
import { FilterDrawerView } from "@core/components/controlled-table/table-filter";
import ToggleColumns from "@core/components/table-utils/toggle-columns";
import { type Table as ReactTableType } from "@tanstack/react-table";
import { useState } from "react";
import {
  PiFunnel,
  PiMagnifyingGlassBold,
  PiTrash,
  PiTrashDuotone,
} from "react-icons/pi";
import { Badge, Button, Flex, Input, Text } from "rizzui";

const statusOptions = [
  {
    value: "Pending",
    label: "Pending",
  },
  {
    value: "Processing",
    label: "Processing",
  },
  {
    value: "Confirmed",
    label: "Confirmed",
  },
  {
    value: "Completed",
    label: "Completed",
  },
  {
    value: "Cancelled",
    label: "Cancelled",
  },
];

const paymentStatus =[
  {
    value: "Unpaid",
    label: "Unpaid",
  },
  {
    value: "Paid",
    label: "Paid",
  },
  {
    value: "Refunded",
    label: "Refunded",
  },
  {
    value: "Failed",
    label: "Failed",
  },
]

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
}

export default function Filters<TData extends Record<string, any>>({
  table,
}: TableToolbarProps<TData>) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    userId: "",
    totalPrice: ["", ""],
    createdAt: [null, null],
    paymentStatus: [],
    status: [],
  });
  const isMultipleSelected = table.getSelectedRowModel().rows.length > 1;
  const applyFilters = () => {
    table.getColumn("userId")?.setFilterValue(localFilters.userId);
    table.getColumn("totalPrice")?.setFilterValue(localFilters.totalPrice);
    table.getColumn("createdAt")?.setFilterValue(localFilters.createdAt);
    table.getColumn("paymentStatus")?.setFilterValue(localFilters.paymentStatus);
    table.getColumn("status")?.setFilterValue(localFilters.status);
  };

  return (
    <Flex align="center" justify="between" className="mb-4">
      <Input
        type="search"
        placeholder="Search by order number..."
        value={table.getState().globalFilter ?? ""}
        onClear={() => table.setGlobalFilter("")}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        inputClassName="h-9"
        clearable={true}
        prefix={<PiMagnifyingGlassBold className="size-4" />}
      />

      <FilterDrawerView
        isOpen={openDrawer}
        drawerTitle="Table Filters"
        setOpenDrawer={setOpenDrawer}
        onApplyFilters={applyFilters}
      >
        <div className="grid grid-cols-1 gap-6">
          <FilterElements
            table={table}
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
          />
        </div>
      </FilterDrawerView>

      <Flex align="center" gap="3" className="w-auto">
        {isMultipleSelected ? (
          <Button
            color="danger"
            variant="outline"
            className="h-[34px] gap-2 text-sm"
          >
            <PiTrash size={18} />
            Delete
          </Button>
        ) : null}

        <Button
          variant={"outline"}
          onClick={() => setOpenDrawer(!openDrawer)}
          className="h-9 pe-3 ps-2.5"
        >
          <PiFunnel className="me-1.5 size-[18px]" strokeWidth={1.7} />
          Filters
        </Button>

        <ToggleColumns table={table} />
      </Flex>
    </Flex>
  );
}

function FilterElements<T extends Record<string, any>>({
  table,
  localFilters,
  setLocalFilters,
}: TableToolbarProps<T> & {
  localFilters: any;
  setLocalFilters: React.Dispatch<React.SetStateAction<any>>;
}) {
  return (
    <>
      <Input
        type="text"
        value={localFilters.userId}
        onChange={(e) =>
          setLocalFilters({ ...localFilters, userId: e.target.value })
        }
        label="Customer"
        placeholder="Customer name"
      />
      <PriceField
        value={localFilters.totalPrice}
        onChange={(v) => setLocalFilters({ ...localFilters, totalPrice: v })}
        label="Amount"
      />
      <DateFiled
        selectsRange
        dateFormat={"dd-MMM-yyyy"}
        className="w-full"
        placeholderText="Select created date"
        startDate={localFilters.createdAt[0]}
        endDate={localFilters.createdAt[1]}
        onChange={(date) => {
          setLocalFilters({ ...localFilters, createdAt: date });
        }}
        inputProps={{
          label: "Created Date",
        }}
      />
      <StatusField
        options={paymentStatus}
        value={localFilters.paymentStatus}
        onChange={(e) => setLocalFilters({ ...localFilters, paymentStatus: e })}
        getOptionValue={(option: { value: any }) => option.value}
        getOptionDisplayValue={(option: { value: any }) =>
          renderOptionDisplayValue(option.value as string)
        }
        displayValue={(selected: string) => renderOptionDisplayValue(selected)}
        dropdownClassName="!z-20 h-auto"
        className={"w-auto"}
        label="Payment Status"
      />
      <StatusField
        options={statusOptions}
        value={localFilters.status}
        onChange={(e) => setLocalFilters({ ...localFilters, status: e })}
        getOptionValue={(option: { value: any }) => option.value}
        getOptionDisplayValue={(option: { value: any }) =>
          renderOptionDisplayValue(option.value as string)
        }
        displayValue={(selected: string) => renderOptionDisplayValue(selected)}
        dropdownClassName="!z-20 h-auto"
        className={"w-auto"}
        label="Order Status"
      />

      <Button
        size="sm"
        onClick={() => {
          setLocalFilters({
            userId: "",
            totalPrice: ["", ""],
            createdAt: [null, null],
            status: [],
          });
          table.resetGlobalFilter();
          table.resetColumnFilters();
        }}
        variant="flat"
        className="h-9 bg-gray-200/70"
      >
        <PiTrashDuotone className="me-1.5 h-[17px] w-[17px]" /> Clear
      </Button>
    </>
  );
}

function renderOptionDisplayValue(value: string) {
  switch (value?.toLowerCase()) {
    case "pending":
      return (
        <div className="flex items-center">
          <Badge color="primary" renderAsDot />
          <Text className="ms-2 font-medium capitalize">
            {value}
          </Text>
        </div>
      );
    case "processing":
      return (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-orange-dark">
            {value}
          </Text>
        </div>
      );
    case "confirmed":
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-green-600">
            {value}
          </Text>
        </div>
      );
    case "completed":
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-green-dark">
            {value}
          </Text>
        </div>
      );
    case "cancelled":
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-red-dark">
            {value}
          </Text>
        </div>
      );
    case "unpaid":
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-red-dark">
            {value}
          </Text>
        </div>
      );
    case "paid":
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-green-dark">
            {value}
          </Text>
        </div>
      );
    case "refunded":
      return (
        <div className="flex items-center">
          <Badge color="primary" renderAsDot />
          <Text className="ms-2 font-medium capitalize ">
            {value}
          </Text>
        </div>
      );
    case "failed":
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-red-dark">
            {value}
          </Text>
        </div>
      );
    
      default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium capitalize text-gray-600">
            {value}
          </Text>
        </div>
      );
  }
}
