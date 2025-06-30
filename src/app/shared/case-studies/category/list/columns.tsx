"use client";
import { createColumnHelper } from "@tanstack/react-table";
import Image from "next/image";
import { Checkbox, Text, Title } from "rizzui";
import { getStatusBadge } from "@core/components/table-utils/get-status-badge";
import { CaseStudyCategoryType } from "@/core/types";
import { CustomTableMeta } from "@core/types/index";
import TableRowActionGroup from "@/core/components/table-utils/table-row-action-group";

const columnHelper = createColumnHelper<CaseStudyCategoryType>();

export const caseStudyCategoryListColumns = [
  columnHelper.display({
    id: "checked",
    size: 50,
    header: ({ table }) => (
      <Checkbox
        className="ps-3"
        aria-label="Select All"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        className="ps-3.5"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }),
  columnHelper.display({
    id: "image",
    size: 100,
    header: "Image",
    cell: ({ row }) => (
      <figure className="relative aspect-square w-12 overflow-hidden rounded-lg bg-gray-100">
        <Image
          alt={row.original.name}
          src={row.original.image}
          fill
          sizes="(max-width: 768px) 100vw"
          className="object-cover"
        />
      </figure>
    ),
  }),
  columnHelper.accessor("name", {
    id: "name",
    size: 200,
    header: "Category Name",
    cell: ({ getValue }) => (
      <Title as="h6" className="!text-sm font-medium">
        {getValue() ?? ""}
      </Title>
    ),
  }),
  columnHelper.display({
    id: "parentCategory",
    size: 200,
    header: "Parent Category",
    cell: ({ row }) => (
      <Text className="truncate !text-sm">
        {row.original.parentCategory?.name || "N/A"}
      </Text>
    ),
  }),
  columnHelper.accessor("slug", {
    id: "slug",
    size: 200,
    header: "Slug",
    cell: ({ getValue }) => <Text>{getValue()}</Text>,
  }),
  columnHelper.display({
    id: "caseStudies",
    size: 120,
    header: "Case Studies",
    cell: ({ row }) => (
      <div className="ps-6">{row.original?.caseStudies?.length}</div>
    ),
  }),
  columnHelper.accessor("status", {
    id: "status",
    size: 120,
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => getStatusBadge(row.original.status),
  }),
  columnHelper.display({
    id: "action",
    size: 100,
    cell: ({ row, table }) => {
      const meta = table.options.meta as CustomTableMeta<CaseStudyCategoryType>;
      return (
        <TableRowActionGroup
          editUrl={() => {
            meta?.handleEditRow?.(row.original);
          }}
          deletePopoverTitle={`Delete the category`}
          deletePopoverDescription={`Are you sure you want to delete this #${row.original._id} category?`}
          onDelete={() => meta?.handleDeleteRow?.(row.original)}
        />
      );
    },
  }),
];
