/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import TableRowActionGroup from "@core/components/table-utils/table-row-action-group";
import AvatarCard from "@core/ui/avatar-card";
import DateCell from "@core/ui/date-cell";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge, Checkbox,Text } from "rizzui";
import { Ticket } from "@/data/tickets.types";
import { CustomTableMeta } from "@/app/shared/dashboard/recent-order";
import { routes } from "@/config/routes";

const colors = {
  Low: "success",
  Medium: "warning",
  High: "danger",
};

const statusColors = {
  "In Progress": "info",
  Completed: "success",
  Open: "secondary",
  Closed: "danger",
};

const columnHelper = createColumnHelper<Ticket>();

export const ticketsColumns = [
  columnHelper.display({
    id: "select",
    size: 50,
    cell: ({ row }) => (
      <Checkbox
        variant="flat"
        className="ps-3.5"
        aria-label="Select row"
        checked={row.getIsSelected()}
        onChange={() => row.toggleSelected()}
      />
    ),
  }),
  columnHelper.accessor("ticketId", {
    id: "ticketId",
    size: 50,
    header: "Ticket ID",
    cell: ({ row }) => (
      <Text className="font-medium text-gray-700">
        {row.original.ticketId}
      </Text>
    ),
  }),
  columnHelper.accessor("subject", {
    id: "issue",
    size: 150,
    header: "Issue",
    cell: ({ row }) => <p className="line-clamp-1">{row.original.subject}</p>,
  }),
  columnHelper.accessor("customer", {
    id: "customer",
    size: 150,
    header: "Customer",
    cell: ({ row }) => (
      <AvatarCard
        src={row.original.customer.image || ""}
        name={row.original.customer.name}
      />
    ),
  }),
  columnHelper.accessor("assignedTo", {
    id: "agent",
    size: 150,
    header: "Assigned To",
    cell: ({ row }) => (
      <AvatarCard
        src={row.original.assignedTo.image || ""}
        name={row.original.assignedTo.name}
      />
    ),
  }),
  columnHelper.accessor("createdAt", {
    id: "createdAt",
    size: 150,
    header: "Date Created",
    cell: ({ row }) => <DateCell date={new Date(row.original.createdAt)} />,
  }),
  columnHelper.accessor("priority", {
    id: "priority",
    size: 140,
    header: "Priority",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge
          renderAsDot
          color={colors[row.original.priority as keyof typeof colors] as any}
        />
        <span>{row.original.priority}</span>
      </div>
    ),
  }),
  columnHelper.accessor("status", {
    id: "status",
    size: 140,
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="w-[90px] font-medium"
        color={
          statusColors[row.original.status as keyof typeof statusColors] as any
        }
      >
        {row.original.status}
      </Badge>
    ),
  }),
  columnHelper.display({
    id: "actions",
    size: 120,
    cell: ({ row, table }) => {
      const meta = table.options.meta as CustomTableMeta<Ticket>;
      return (
        <TableRowActionGroup
          viewUrl={routes?.support?.inbox(row.original.ticketId)}
          deletePopoverTitle={`Delete the order`}
          deletePopoverDescription={`Are you sure you want to delete this "#${row.original._id}" Ticket?`}
          onDelete={() => meta?.handleDeleteRow?.(row.original)}
        />
      );
    },
  }),
];
