/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button, Flex, Input } from "rizzui";
import StatusField from "@core/components/controlled-table/status-field";
import DateFiled from "@core/components/controlled-table/date-field";
import {
  PiFunnel,
  PiMagnifyingGlassBold,
  PiTrashDuotone,
} from "react-icons/pi";
import { type Table as ReactTableType } from "@tanstack/react-table";
import ToggleColumns from "@core/components/table-utils/toggle-columns";
import { useEffect, useState } from "react";
import { useMedia } from "react-use";
import cn from "@core/utils/class-names";
import { FilterDrawerView } from "@core/components/controlled-table/table-filter";
import { renderOptionDisplayValue } from "@/core/components/table-utils/status-select";

const statuses = [
  {
    value: "Open",
    label: "Open",
  },
  {
    value: "In Progress",
    label: "In Progress",
  },
  {
    value: "Resolved",
    label: "Resolved",
  },
  {
    value: "Closed",
    label: "Closed",
  },

  {
    value: "Reopened",
    label: "Reopened",
  },
];

export default function Filters<TData extends Record<string, any>>({
  table,
}: {
  table: ReactTableType<TData>;
}) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const isMediumScreen = useMedia("(max-width: 1860px)", false);

  return (
    <Flex align="center" justify="between" className="my-6 px-5">
      <Flex align="center" className="w-auto">
        <Input
          type="search"
          clearable={true}
          inputClassName="h-[36px]"
          placeholder="Search by anything..."
          onClear={() => table.setGlobalFilter("")}
          value={table.getState().globalFilter ?? ""}
          prefix={<PiMagnifyingGlassBold className="size-4" />}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="w-full max-w-64"
        />
        {!isMediumScreen && showFilters && <FilterElements table={table} />}
      </Flex>
      {isMediumScreen && (
        <FilterDrawerView
          drawerTitle="Table Filters"
          isOpen={openDrawer}
          setOpenDrawer={setOpenDrawer}
        >
          <div className="grid grid-cols-1 gap-6">
            <FilterElements table={table} />
          </div>
        </FilterDrawerView>
      )}
      <Flex align="center" className="w-auto">
        <Button
          {...(isMediumScreen
            ? {
                onClick: () => {
                  setOpenDrawer(() => !openDrawer);
                },
              }
            : { onClick: () => setShowFilters(() => !showFilters) })}
          variant={"outline"}
          className={cn(
            "h-[34px] pe-3 ps-2.5",
            !isMediumScreen && showFilters && "border-dashed border-gray-700"
          )}
        >
          <PiFunnel className="me-1.5 h-[18px] w-[18px]" strokeWidth={1.7} />
          {!isMediumScreen && showFilters ? "Hide" : "Filters"}
        </Button>

        <ToggleColumns table={table} />
      </Flex>
    </Flex>
  );
}

function FilterElements<TData extends Record<string, any>>({
  table,
}: {
  table: ReactTableType<TData>;
}) {
  const [state, setState] = useState<[Date | null, Date | null]>([null, null]);
  const isFiltered =
    table.getState().globalFilter || table.getState().columnFilters.length > 0;

  useEffect(() => {
    const column = table.getColumn("createdAt");
    if (column) {
      if (state[0] && state[1]) {
        // Ensure we pass valid dates
        column.setFilterValue([state[0], state[1]]);
      } else {
        column.setFilterValue(undefined);
      }
    }
  }, [state, table]);
  return (
    <>
      <DateFiled
        selected={state[0]}
        startDate={state[0]!}
        endDate={state[1]!}
        onChange={(date) => setState(date)}
        selectsRange
        dateFormat="dd MMM yyyy"
        placeholderText="Select created date"
        maxDate={new Date()}
        className="w-full 3xl:w-auto"
        inputProps={{
          label: "Created Date",
          labelClassName: "3xl:hidden block",
        }}
      />
      <StatusField
        className="w-full 3xl:w-40"
        placeholder="Select type"
        options={statuses}
        dropdownClassName="!z-10 h-auto"
        getOptionValue={(option) => option.label}
        value={table.getColumn("status")?.getFilterValue() ?? ""}
        onChange={(e) => table.getColumn("status")?.setFilterValue(e)}
        label="Status"
        labelClassName="3xl:hidden block"
        getOptionDisplayValue={(option: { value: any }) =>
          renderOptionDisplayValue(option.value as string)
        }
        displayValue={(selected: string) => renderOptionDisplayValue(selected)}
      />
      {isFiltered && (
        <Button
          variant="flat"
          onClick={() => {
            table.resetGlobalFilter();
            table.resetColumnFilters();
            setState([null, null]);
          }}
          className="h-9 w-full bg-gray-200/70 @3xl:w-24"
        >
          <PiTrashDuotone className="me-1.5 size-4" /> Clear
        </Button>
      )}
    </>
  );
}
