"use client";
import { routes } from "@/config/routes";
import { OrderType, UserType } from "@/core/types";
import TableRowActionGroup from "@core/components/table-utils/table-row-action-group";
import TableAvatar from "@core/ui/avatar-card";
import DateCell from "@core/ui/date-cell";
import { createColumnHelper } from "@tanstack/react-table";
import { PiCaretDownBold, PiCaretUpBold } from "react-icons/pi";
import { ActionIcon, Text } from "rizzui";
import { StatusSelect } from "@/core/components/table-utils/status-select";
import { CustomTableMeta } from "./table";

const statusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "Processing", value: "Processing" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

const paymentOptions = [
  { label: "Unpaid", value: "Unpaid" },
  { label: "Paid", value: "Paid" },
  { label: "Refunded", value: "Refunded" },
  { label: "Failed", value: "Failed" },
];

const columnHelper = createColumnHelper<OrderType>();

export const ordersColumns = (expanded: boolean = true) => {
  const columns = [
    columnHelper.accessor('orderNumber',{
      id: "orderNumber",
      size: 100,
      header: "Order No.",
      cell: ({ row }) => <>#{row.original.orderNumber}</>,
    }),
    columnHelper.accessor("userId", {
      id: "userId",
      size: 200,
      header: "Customer",
      enableSorting: false,
      cell: ({ row }) => (
        <TableAvatar
          src={row.original.userId?.image || ""}
          name={row.original.userId?.name || ""}
          description={row.original.userId?.email.toLowerCase()}
        />
      ),
      filterFn: (row, id, filterValue: string) => {
        const user = row.getValue<UserType>(id);
        return user?.name.toLowerCase().includes(filterValue.toLowerCase());
      },
    }),
    columnHelper.accessor('totalQuantity',{
      id: "totalQuantity",
      size: 80,
      header: "Items",
      cell: ({ row }) => (
        <Text className="font-medium text-gray-700">
          {row.original.totalQuantity}
        </Text>
      ),
    }),
    columnHelper.accessor("totalPrice", {
      id: "totalPrice",
      size: 80,
      header: "Price",
      cell: ({ row }) => (
        <Text className="font-medium text-gray-700">
          ${row.original.totalPrice}
        </Text>
      ),
    }),
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      size: 120,
      header: "Created",
      cell: ({ row }) => (
        // <DateCell date={row.original.createdAt ? new Date(row.original.createdAt) : new Date()} />
        <DateCell
          date={row.original.createdAt ? row.original.createdAt : new Date()}
        />
      ),
      filterFn: (row, id, filterValue) => {
        const [start, end] = filterValue || [null, null];
        const date = new Date(row.getValue(id));

        if (!start && !end) return true; // No filter applied

        const startDate = start ? new Date(start) : null;
        const endDate = end ? new Date(end) : null;

        // Adjust endDate to include the full day (23:59:59.999)
        if (endDate) {
          endDate.setHours(23, 59, 59, 999);
        }

        if (startDate && !endDate) return date >= startDate;
        if (!startDate && endDate) return date <= endDate;
        return date >= startDate! && date <= endDate!;
      },
    }),
    columnHelper.accessor("paymentStatus", {
      id: "paymentStatus",
      size: 140,
      header: "Payment Status",
      enableSorting: false,
      cell: ({ row, getValue }) => (
        <StatusSelect
          selectItem={getValue()}
          options={paymentOptions}
          endpoint={`/orders/updateOrder?orderId=${row.original._id}`}
          toUpdate="paymentStatus"
          revalidatePath={[`/api/revalidateTags?tags=orders`]}
        />
      ),
    }),
    columnHelper.accessor("status", {
      id: "status",
      size: 140,
      header: "Order Status",
      enableSorting: false,
      cell: ({ row, getValue }) => (
        <StatusSelect
          selectItem={getValue()}
          options={statusOptions}
          endpoint={`/orders/updateOrder?orderId=${row.original._id}`}
          revalidatePath={[`/api/revalidateTags?tags=orders`]}
        />
      ),
    }),
    columnHelper.display({
      id: "action",
      size: 100,
      cell: ({ row, table }) => {
        const meta = table.options.meta as CustomTableMeta<OrderType>;
        return (
          <TableRowActionGroup
            viewUrl={routes.orders.orderDetails(row.original.orderNumber!)}
            deletePopoverTitle={`Delete the order`}
            deletePopoverDescription={`Are you sure you want to delete this #${row.original._id} order?`}
            onDelete={() => meta?.handleDeleteRow?.(row.original)}
          />
        );
      },
    }),
  ];

  return expanded ? [expandedOrdersColumns, ...columns] : columns;
};

const expandedOrdersColumns = columnHelper.display({
  id: "expandedHandler",
  size: 60,
  cell: ({ row }) => (
    <>
      {row.getCanExpand() && (
        <ActionIcon
          size="sm"
          rounded="full"
          aria-label="Expand row"
          className="ms-2"
          variant={row.getIsExpanded() ? "solid" : "outline"}
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? (
            <PiCaretUpBold className="size-3.5" />
          ) : (
            <PiCaretDownBold className="size-3.5" />
          )}
        </ActionIcon>
      )}
    </>
  ),
});
