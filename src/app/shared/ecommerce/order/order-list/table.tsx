/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ordersColumns } from "@/app/shared/ecommerce/order/order-list/columns";
import Table from "@core/components/table";
import { CustomExpandedComponent } from "@core/components/table/custom/expanded-row";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { TableVariantProps } from "rizzui";
import { OrderType } from "@/core/types";
import { TableMeta } from "@tanstack/react-table";
import { useApiCall } from "@/core/utils/api-config";
import toast from "react-hot-toast";

// Define custom meta interface
export interface CustomTableMeta<T> extends TableMeta<T> {
  handleDeleteRow?: (row: T) => void;
  handleMultipleDelete?: (rows: T[]) => void;
}

export default function OrderTable({
  className,
  variant = "modern",
  hideFilters = false,
  hidePagination = false,
  orderData,
}: {
  className?: string;
  hideFilters?: boolean;
  hidePagination?: boolean;
  variant?: TableVariantProps;
  orderData: any;
}) {
  const { apiCall } = useApiCall();
  const { table, setData } = useTanStackTable<OrderType>({
    tableData: orderData,
    columnConfig: ordersColumns(),
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
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

  return (
    <div className={className}>
      {!hideFilters && <Filters table={table} />}
      <Table
        table={table}
        variant={variant}
        classNames={{
          container: "border border-muted rounded-md border-t-0",
          rowClassName: "last:border-0",
        }}
        components={{
          expandedComponent: CustomExpandedComponent,
        }}
      />
      {!hidePagination && <TablePagination table={table} className="py-4" />}
    </div>
  );
}
