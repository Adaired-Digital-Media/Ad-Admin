/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DateFieled from "@core/components/controlled-table/date-field";
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
    value: "publish",
    label: "Publish",
  },
  {
    value: "draft",
    label: "Draft",
  },
];

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
}

export default function Filters<TData extends Record<string, any>>({
  table,
}: TableToolbarProps<TData>) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    blogAuthor: "",
    createdAt: [null, null],
    status: [],
  });
  const isMultipleSelected = table.getSelectedRowModel().rows.length > 1;
  const applyFilters = () => {
    table.getColumn("blogAuthor")?.setFilterValue(localFilters.blogAuthor);
    table.getColumn("createdAt")?.setFilterValue(localFilters.createdAt);
    table.getColumn("status")?.setFilterValue(localFilters.status);
  };
  return (
    <Flex align="center" justify="between" className="mb-4">
      <Input
        type="search"
        placeholder="Search by title..."
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
        value={localFilters.blogAuthor}
        onChange={(e) =>
          setLocalFilters({ ...localFilters, blogAuthor: e.target.value })
        }
        label="Author"
        placeholder="Author name"
      />
      <DateFieled
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
            blogAuthor: "",
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
    case "publish":
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium capitalize">{value}</Text>
        </div>
      );
    case "draft":
      return (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-orange-dark">
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
