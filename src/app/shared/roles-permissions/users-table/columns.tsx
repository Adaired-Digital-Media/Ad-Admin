"use client";

import AvatarCard from "@core/ui/avatar-card";
import DateCell from "@core/ui/date-cell";
import { createColumnHelper } from "@tanstack/react-table";
import { Checkbox, Text } from "rizzui";
import TableRowActionGroup from "@core/components/table-utils/table-row-action-group";
import { UserTypes } from "@/core/types";
import { StatusSelect } from "@/core/components/table-utils/status-select";
import { statusOptions } from "./filters";
import cn from "@/core/utils/class-names";
import { CustomTableMeta } from "@core/types/index";

const columnHelper = createColumnHelper<UserTypes>();

export const usersColumns = [
  columnHelper.display({
    id: "select",
    size: 50,
    header: ({ table }) => (
      <Checkbox
        className="ps-3.5"
        aria-label="Select all Rows"
        checked={table.getIsAllPageRowsSelected()}
        onChange={() => table.toggleAllPageRowsSelected()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="ps-3.5"
        aria-label="Select Row"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }),
  columnHelper.accessor("name", {
    id: "name",
    size: 300,
    header: "Name",
    enableSorting: true,
    cell: ({ row }) => (
      <AvatarCard
        src={row.original.image || ""}
        name={row.original.name || "-"}
        description={row.original.email || "-"}
      />
    ),
  }),
  columnHelper.accessor("contact", {
    id: "contact",
    size: 200,
    header: "Phone Number",
    enableSorting: false,
    cell: ({ row }) => (
      <Text className="truncate !text-sm">{row.original?.contact || "-"}</Text>
    ),
  }),
  columnHelper.accessor("role", {
    id: "role",
    size: 200,
    header: "Role",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.isAdmin ? (
        <Text className={cn("font-medium capitalize text-green-dark")}>
          {"Admin"}
        </Text>
      ) : (
        typeof row.original.role !== "string" && row?.original?.role?.name
      ),
  }),
  columnHelper.accessor("createdAt", {
    id: "createdAt",
    size: 200,
    header: "Created",
    cell: ({ row }) => (
      <DateCell date={new Date(row?.original?.createdAt || Date.now())} />
    ),
  }),
  columnHelper.accessor("status", {
    id: "status",
    size: 200,
    header: "Status",
    enableSorting: false,
    cell: ({ row, getValue }) => (
      <StatusSelect
        selectItem={getValue() ?? "active"}
        options={statusOptions}
        endpoint={`/user/update?identifier=${row.original._id}`}
        revalidatePath={[`/api/revalidateTags?tags=users`]}
      />
    ),
  }),
  columnHelper.display({
    id: "action",
    size: 150,
    cell: ({ row, table }) => {
      const meta = table.options.meta as CustomTableMeta<UserTypes>;
      return (
        <TableRowActionGroup
          deletePopoverTitle={`Delete this user`}
          deletePopoverDescription={`Are you sure you want to delete this #${row.original._id} user?`}
          onDelete={() => meta?.handleDeleteRow?.(row.original)}
          editUrl={() => {
            meta?.handleEditRow?.(row.original);
          }}
        />
      );
    },
  }),
];
