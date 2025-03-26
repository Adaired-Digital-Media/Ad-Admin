"use client";

import { ordersColumns } from "@/app/shared/ecommerce/order/order-list/columns";
import Table from "@core/components/table";
import WidgetCard from "@core/components/cards/widget-card";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import TablePagination from "@core/components/table/pagination";
import cn from "@core/utils/class-names";
import { Input } from "rizzui";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { TableMeta } from "@tanstack/react-table";
import { OrderType } from "@/core/types";
import { useApiCall } from "@/core/utils/api-config";
import toast from "react-hot-toast";
import { useEffect } from "react";

// Define custom meta interface
export interface CustomTableMeta<T> extends TableMeta<T> {
  handleDeleteRow?: (row: T) => void;
  handleMultipleDelete?: (rows: T[]) => void;
}

export default function RecentOrder({
  className,
  orderData,
}: {
  className?: string;
  orderData: OrderType[];
}) {
  const { apiCall } = useApiCall();
  const { table, setData } = useTanStackTable<OrderType>({
    tableData: orderData,
    columnConfig: ordersColumns(),
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 7,
        },
      },
      meta: {
        handleDeleteRow: async (row: { _id: string }) => {
          setData((prev) => prev.filter((r) => r._id !== row._id));
          const response = await apiCall<{ message: string }>({
            url: `/order/delete?query=${row._id}`,
            method: "DELETE",
          });
          if (response.status === 200) {
            toast.success(response.data.message);
          }
        },
      } as CustomTableMeta<OrderType>,
      enableColumnResizing: false,
    },
  });
  useEffect(() => {
    setData(orderData);
  }, [orderData, setData]);
  return (
    <WidgetCard
      title="Recent Orders"
      className={cn("p-0 lg:p-0", className)}
      headerClassName="px-5 pt-5 lg:px-7 lg:pt-7 mb-6"
      action={
        <Input
          type="search"
          clearable={true}
          inputClassName="h-[36px]"
          placeholder="Search by patient name..."
          onClear={() => table.setGlobalFilter("")}
          value={table.getState().globalFilter ?? ""}
          prefix={<PiMagnifyingGlassBold className="size-4" />}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="w-full @3xl:order-3 @3xl:ms-auto @3xl:max-w-72"
        />
      }
    >
      <Table
        table={table}
        variant="modern"
        classNames={{
          cellClassName: "first:ps-6",
          headerCellClassName: "first:ps-6",
        }}
      />
      <TablePagination table={table} className="p-4" />
    </WidgetCard>
  );
}
