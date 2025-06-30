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
import toast from "react-hot-toast";
import { useAtom, useSetAtom } from "jotai";
import { orderActionsAtom, ordersAtom } from "@/store/atoms/orders.atom";
import { Session } from "next-auth";
import { useEffect } from "react";
import { CustomTableMeta } from "@core/types/index";


export default function OrderTable({
  className,
  variant = "modern",
  hideFilters = false,
  hidePagination = false,
  orderData,
  session,
}: {
  className?: string;
  hideFilters?: boolean;
  hidePagination?: boolean;
  variant?: TableVariantProps;
  orderData: any;
  session: Session;
}) {
  const [orders] = useAtom(ordersAtom);
  const setOrders = useSetAtom(orderActionsAtom);
  const { table, setData } = useTanStackTable<OrderType>({
    tableData: orders.length ? orders : orderData,
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
          const response = await setOrders({
            type: "delete",
            payload: {
              id: row._id,
            },
            token: session.user.accessToken!,
          });
          toast.success(response.message);
        },
      } as CustomTableMeta<OrderType>,
      enableColumnResizing: false,
    },
  });

  // Sync table data with orders atom
  useEffect(() => {
    setData(orders.length >= 0 ? orders : orderData);
  }, [orders, orderData, setData]);

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
