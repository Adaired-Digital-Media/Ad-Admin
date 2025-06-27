"use client";

import DeletePopover from "@core/components/delete-popover";
import { routes } from "@/config/routes";
import PencilIcon from "@core/components/icons/pencil";
import { createColumnHelper } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { ActionIcon, Checkbox, Text, Title, Tooltip } from "rizzui";
import { ProductCategoryType } from "@/data/product-categories";
import { StatusSelect } from "@/core/components/table-utils/status-select";
import { CustomTableMeta } from "./table";

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Draft", value: "Draft" },
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
        {row.original.parentCategory?.name}
      </Text>
    ),
  }),
  columnHelper.display({
    id: "description",
    size: 250,
    header: "Description",
    cell: ({ row }) => (
      <Text className="truncate !text-sm">
        {row.original.description}
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
      <div className="ps-6">{row.original.products.length}</div>
    ),
  }),
  columnHelper.accessor("status", {
    id: "status",
    size: 120,
    header: "Status",
    enableSorting: false,
    cell: ({ row, getValue }) => (
      <StatusSelect
        selectItem={getValue()}
        options={statusOptions}
        endpoint={`/product/category/update-category?identifier=${row.original.slug}`}
      />
    ),
  }),
  columnHelper.display({
    id: "action",
    size: 100,
    cell: ({ row, table }) => {
      const meta = table.options.meta as CustomTableMeta<ProductCategoryType>;
      return (
        <div className="flex items-center justify-end gap-3 pe-4">
          <Tooltip content={"Edit Category"} placement="top" color="invert">
            <Link href={routes.products.editCategory(row.original._id)}>
              <ActionIcon size="sm" variant="outline">
                <PencilIcon className="h-4 w-4" />
              </ActionIcon>
            </Link>
          </Tooltip>
          <DeletePopover
            title={`Delete the category`}
            description={`Are you sure you want to delete this #${row.original.name} category?`}
            onDelete={() => meta?.handleDeleteRow?.(row.original)}
          />
        </div>
      );
    },
  }),
];
