"use client";

import { routes } from "@/config/routes";
import TableRowActionGroup from "@core/components/table-utils/table-row-action-group";
import TableAvatar from "@core/ui/avatar-card";
import DateCell from "@core/ui/date-cell";
import { createColumnHelper } from "@tanstack/react-table";
import { Text, Checkbox } from "rizzui";
import { StatusSelect } from "@/core/components/table-utils/status-select";
import { CustomTableMeta } from "./table";
import { CaseStudyType } from "@/core/types";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const columnHelper = createColumnHelper<CaseStudyType>();

export const caseStudyColumns = () => {
  const columns = [
    columnHelper.display({
      id: "select",
      size: 50,
      header: ({ table }) => (
        <Checkbox
          className="ps-3.5"
          aria-label="Select all rows"
          checked={table.getIsAllPageRowsSelected()}
          onChange={() => table.toggleAllPageRowsSelected()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="ps-3.5"
          aria-label="Select row"
          checked={row.getIsSelected()}
          onChange={() => row.toggleSelected()}
        />
      ),
    }),
    columnHelper.accessor("name", {
      id: "name",
      size: 200,
      header: "Name",
      cell: ({ row }) => (
        <Text className="font-medium text-gray-700">{row.original.name}</Text>
      ),
    }),
    columnHelper.accessor("slug", {
      id: "slug",
      size: 150,
      header: "Slug",
      cell: ({ row }) => (
        <Text className="font-medium text-gray-700">{row.original.slug}</Text>
      ),
    }),
    columnHelper.accessor("category", {
      id: "category",
      size: 100,
      header: "Category",
      cell: ({ row }) => (
        <Text className="font-medium text-gray-700">
          {row?.original?.category?.name || "N/A"}
        </Text>
      ),
    }),
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      size: 100,
      header: "Date Created",
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
    columnHelper.accessor("createdBy", {
      id: "createdBy",
      size: 120,
      header: "Author",
      enableSorting: false,
      cell: ({ row }) =>
        row.original.createdBy ? (
          <TableAvatar
            src={row.original.createdBy?.image || ""}
            name={row.original.createdBy?.name || ""}
            description={row.original.createdBy?.email?.toLowerCase()}
          />
        ) : (
          <Text className="font-medium text-gray-700">{"N/A"}</Text>
        ),
      filterFn: (row, id, filterValue: string) => {
        // Handle empty filter value
        if (!filterValue) return true;

        const createdBy = row.getValue(id) as { name?: string } | undefined;
        const name = createdBy?.name || "";
        return name?.toLowerCase().includes(filterValue?.toLowerCase());
      },
    }),
    columnHelper.accessor("status", {
      id: "status",
      size: 100,
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => {
        const form = row.original;
        return (
          <StatusSelect
            key={`status-${form._id}`}
            selectItem={form.status}
            options={statusOptions}
            endpoint={`/case-study/update?id=${row.original._id}`}
            revalidatePath={[`/api/revalidateTags?tags=case-study`]}
          />
        );
      },
    }),
    columnHelper.display({
      id: "action",
      size: 100,
      cell: ({ row, table }) => {
        const meta = table.options.meta as CustomTableMeta<CaseStudyType>;
        return (
          <TableRowActionGroup
            editUrl={routes.blog.edit(row.original._id!)}
            deletePopoverTitle={`Delete the order`}
            deletePopoverDescription={`Are you sure you want to delete this #${row.original._id} case study?`}
            onDelete={() => meta?.handleDeleteRow?.(row.original)}
          />
        );
      },
    }),
  ];
  return columns;
};
