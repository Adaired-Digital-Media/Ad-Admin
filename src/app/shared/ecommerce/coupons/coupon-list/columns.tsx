"use client";

import { routes } from "@/config/routes";
import { CouponTypes } from "@/data/coupons.types";
import { createColumnHelper } from "@tanstack/react-table";
import { Checkbox, Text, Title } from "rizzui";
import { StatusSelect } from "@/core/components/table-utils/status-select";
import { CustomTableMeta } from "@/app/shared/dashboard/recent-order";
import DateCell from "@/core/ui/date-cell";
import TableRowActionGroup from "@/core/components/table-utils/table-row-action-group";

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

const columnHelper = createColumnHelper<CouponTypes>();

export const couponsListColumns = [
  columnHelper.display({
    id: "select",
    size: 50,
    header: ({ table }) => (
      <Checkbox
        className="ps-3.5"
        aria-label="Select all rows"
        checked={table.getIsAllPageRowsSelected()}
        onChange={() => table.toggleAllPageRowsSelected}
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

  columnHelper.accessor("code", {
    id: "code",
    size: 100,
    header: "Code",
    cell: ({ getValue }) => (
      <Title as="h6" className="!text-sm font-medium">
        {getValue()}
      </Title>
    ),
  }),

  columnHelper.accessor("discountValue", {
    id: "discountValue",
    size: 50,
    header: "Discount",
    cell: ({ row, getValue }) => {
      const discountValue = getValue();
      const discountType = row.original.discountType;

      const displayValue =
        discountType === "percentage"
          ? `${discountValue}%`
          : discountType === "flat"
          ? `$${discountValue}`
          : `${discountValue}`;

      return <Text className="font-medium">{displayValue}</Text>;
    },
  }),

  columnHelper.accessor("discountType", {
    id: "discountType",
    size: 100,
    header: "Discount Type",
    cell: ({ getValue }) => <Text className="capitalize">{getValue()}</Text>,
  }),

  columnHelper.accessor("couponApplicableOn", {
    id: "couponApplicableOn",
    size: 220,
    header: "Applicable On",
    cell: ({ row }) => {
      const {
        couponApplicableOn,
        couponType,
        specificProducts,
        productCategories,
        minQuantity,
        discountType,
        discountValue,
      } = row.original;

      // Handle 100% off special case
      if (discountType === "percentage" && discountValue === 100) {
        return (
          <Text>
            {couponApplicableOn === "allProducts" && "All Products"}
            {couponApplicableOn === "specificProducts" &&
              `Specific Products (${specificProducts?.length || 0} items)`}
            {couponApplicableOn === "productCategories" &&
              `Categories (${productCategories?.length || 0})`}
            {couponType === "quantityBased" && minQuantity
              ? `, Min Qty: ${minQuantity}`
              : ""}
            {" (100% OFF)"}
          </Text>
        );
      }

      // General case based on couponApplicableOn and couponType
      if (couponApplicableOn === "allProducts") {
        return (
          <Text>
            All Products
            {couponType === "quantityBased" && minQuantity
              ? `, Min Qty: ${minQuantity}`
              : ""}
          </Text>
        );
      } else if (couponApplicableOn === "specificProducts") {
        return (
          <Text>
            Specific Products ({specificProducts?.length || 0} items)
            {couponType === "quantityBased" && minQuantity
              ? `, Min Qty: ${minQuantity}`
              : ""}
          </Text>
        );
      } else if (couponApplicableOn === "productCategories") {
        return (
          <Text>
            Categories ({productCategories?.length || 0})
            {couponType === "quantityBased" && minQuantity
              ? `, Min Qty: ${minQuantity}`
              : ""}
          </Text>
        );
      }

      return <Text>-</Text>;
    },
  }),

  columnHelper.accessor("createdAt", {
    id: "createdAt",
    size: 120,
    header: "Created",
    cell: ({ row }) => (
      <DateCell date={new Date(row.original.createdAt || Date.now())} />
    ),
  }),

  columnHelper.accessor("status", {
    id: "status",
    size: 80,
    header: "Status",
    enableSorting: false,
    cell: ({ row, getValue }) => (
      <StatusSelect
        selectItem={getValue()}
        options={statusOptions}
        endpoint={`/coupons/update?id=${row.original._id}`}
        revalidatePath={[`/api/revalidateTags?tags=coupons`]}
      />
    ),
  }),
  columnHelper.display({
    id: "action",
    size: 150,
    cell: ({ row, table }) => {
      // Cast meta to ProductsTableMeta
      const tableMeta = table.options.meta as CustomTableMeta<CouponTypes>;

      return (
        <TableRowActionGroup
          editUrl={routes.coupons.editCoupon(row.original._id as string)}
          deletePopoverTitle={`Delete the order`}
          deletePopoverDescription={`Are you sure you want to delete this #${row.original._id} order?`}
          onDelete={() => tableMeta?.handleDeleteRow?.(row.original)}
        />
      );
    },
  }),
];
