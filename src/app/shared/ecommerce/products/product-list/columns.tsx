"use client";

import DeletePopover from "@core/components/delete-popover";
import { getStockStatus } from "@core/components/table-utils/get-stock-status";
import { routes } from "@/config/routes";
import { ProductType } from "@/data/products";
import PencilIcon from "@core/components/icons/pencil";
import AvatarCard from "@core/ui/avatar-card";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { ActionIcon, Checkbox, Flex, Text, Tooltip } from "rizzui";
import { ProductsTableMeta } from "./table";
import { StatusSelect } from "@/core/components/table-utils/status-select";

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Archived", value: "Archived" },
  { label: "Out of Stock", value: "Out of Stock" },
];

const columnHelper = createColumnHelper<ProductType>();

export const productsListColumns = [
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
    size: 300,
    header: "Product",
    enableSorting: false,
    cell: ({ row }) => (
      <AvatarCard
        src={row.original.featuredImage}
        name={row.original.name}
        description={row.original?.category?.name}
        avatarProps={{
          name: row.original.name,
          size: "lg",
          className: "rounded-lg",
        }}
      />
    ),
  }),
  columnHelper.accessor("stock", {
    id: "stock",
    size: 200,
    header: "Stock",
    cell: ({ row }) => getStockStatus(row.original.stock),
  }),
  columnHelper.accessor("pricePerUnit", {
    id: "price",
    size: 150,
    header: "Price",
    cell: ({ row }) => {
      const { pricingType, pricePerUnit, minimumWords, minimumQuantity } =
        row.original;

      return (
        <Text className="text-gray-900">
          <span className="text-base font-bold">${pricePerUnit}</span>
          {pricingType === "perWord" && minimumWords
            ? ` / ${minimumWords} words`
            : pricingType === "perQuantity" && minimumQuantity
            ? ` / ${minimumQuantity} units`
            : ""}
        </Text>
      );
    },
  }),
  columnHelper.accessor("slug", {
    id: "slug",
    size: 200,
    header: "Slug",
    cell: ({ getValue }) => <Text>{getValue()}</Text>,
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
        endpoint={`/product/update-product?query=${row.original.slug}`}
        revalidatePath={[`/api/revalidateTags?tags=products`]}
      />
    ),
  }),
  columnHelper.display({
    id: "action",
    size: 120,
    cell: ({
      row,
      table: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        options: { meta },
      },
    }) => {
      // Cast meta to ProductsTableMeta
      const tableMeta = meta as ProductsTableMeta;

      return (
        <Flex align="center" justify="end" gap="3" className="pe-4">
          <Tooltip
            size="sm"
            content={"Edit Product"}
            placement="top"
            color="invert"
          >
            <Link href={routes?.products?.editProduct(row.original.slug)}>
              <ActionIcon
                as="span"
                size="sm"
                variant="outline"
                aria-label={"Edit Product"}
              >
                <PencilIcon className="h-4 w-4" />
              </ActionIcon>
            </Link>
          </Tooltip>
          <DeletePopover
            title={`Delete the product`}
            description={`Are you sure you want to delete this #${row.original._id} product?`}
            onDelete={() =>
              tableMeta?.handleDeleteRow &&
              tableMeta?.handleDeleteRow(row.original)
            }
          />
        </Flex>
      );
    },
  }),
];
