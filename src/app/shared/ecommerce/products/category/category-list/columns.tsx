"use client";

import { createColumnHelper } from "@tanstack/react-table";
import Image from "next/image";
import { Checkbox, Text, Title } from "rizzui";
import { ProductCategoryType } from "@/core/types";
import { StatusSelect } from "@/core/components/table-utils/status-select";
import { CustomTableMeta } from "@core/types/index";
import TableRowActionGroup from "@/core/components/table-utils/table-row-action-group";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const columnHelper = createColumnHelper<ProductCategoryType>();

export const categoriesColumns = [
  columnHelper.display({
    id: "checked",
    size: 50,
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
        {row.original?.parentCategory?.name}
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
    id: "products",
    size: 120,
    header: "Products",
    cell: ({ row }) => (
      <div className="ps-6">{row?.original?.products?.length || 0}</div>
    ),
  }),
  columnHelper.accessor("status", {
    id: "status",
    size: 120,
    header: "Status",
    enableSorting: false,
    cell: ({ row, getValue }) => {
      const statusValue = getValue() || "inactive";
      return (
        <StatusSelect
          key={`status-select-${row.original._id}`}
          selectItem={statusValue}
          options={statusOptions}
          endpoint={`/product/category/update-category?id=${row.original?._id}`}
          revalidatePath={["/api/revalidateTags?tags=product-categories"]}
        />
      );
    },
  }),
  columnHelper.display({
    id: "action",
    size: 100,
    cell: ({ row, table }) => {
      const meta = table.options.meta as CustomTableMeta<ProductCategoryType>;
      return (
        <TableRowActionGroup
          deletePopoverTitle={`Delete this category`}
          deletePopoverDescription={`Are you sure you want to delete this category?`}
          onDelete={() => meta?.handleDeleteRow?.(row.original)}
          editUrl={() => {
            meta?.handleEditRow?.(row.original);
          }}
        />
      );
    },
  }),
];
