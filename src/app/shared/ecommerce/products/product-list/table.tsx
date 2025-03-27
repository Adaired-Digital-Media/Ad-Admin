/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ProductType } from "@/data/products";
import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import TablePagination from "@core/components/table/pagination";
import { productsListColumns } from "./columns";
import Filters from "./filters";
import TableFooter from "@core/components/table/footer";
import { TableClassNameProps } from "@core/components/table/table-types";
import cn from "@core/utils/class-names";
import { exportToCSV } from "@core/utils/export-to-csv";
import { useApiCall } from "@/core/utils/api-config";
import toast from "react-hot-toast";
import { CustomTableMeta } from "@/app/shared/dashboard/recent-order";



export default function ProductsTable({
  products = [],
  pageSize = 5,
  hideFilters = false,
  hidePagination = false,
  hideFooter = false,
  classNames = {
    container: "border border-muted rounded-md",
    rowClassName: "last:border-0",
  },
  paginationClassName,
}: {
  pageSize?: number;
  hideFilters?: boolean;
  hidePagination?: boolean;
  hideFooter?: boolean;
  classNames?: TableClassNameProps;
  paginationClassName?: string;
  products?: ProductType[];
}) {
  const { apiCall } = useApiCall();
  const { table, setData } = useTanStackTable<ProductType>({
    tableData: products,
    columnConfig: productsListColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: pageSize,
        },
      },
      meta: {
        handleMultipleDelete: async (rows: any) => {
          setData((prev) => prev.filter((r) => !rows.includes(r)));
          rows.forEach(async (r: ProductType) => {
            const _response = await apiCall<{ message: string }>({
              url: `/product/delete-product?query=${r._id}`,
              method: "DELETE",
            });
            if (_response.status === 200) {
              toast.success(_response.data.message);
            }
          });
          await fetch("/api/revalidateTags?tags=products", {
            method: "GET",
          });
        },
        handleDeleteRow: async (row: { _id: string }) => {
          setData((prev) => prev.filter((r) => r._id !== row._id));
          const _response = await apiCall<{ message: string }>({
            url: `/product/delete-product?query=${row._id}`,
            method: "DELETE",
          });
          if (_response.status === 200) {
            toast.success(_response.data.message);
            await fetch("/api/revalidateTags?tags=products", {
              method: "GET",
            });
          }
        },
      } as CustomTableMeta<ProductType>,
      enableColumnResizing: false,
    },
  });

  const selectedData = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  function handleExportData() {
    exportToCSV(
      selectedData,
      "ID,Name,Category,Sku,Price,Stock,Status,Rating",
      `product_data_${selectedData.length}`
    );
  }

  return (
    <>
      {!hideFilters && <Filters table={table} />}
      <Table table={table} variant="modern" classNames={classNames} />
      {!hideFooter && <TableFooter table={table} onExport={handleExportData} />}
      {!hidePagination && (
        <TablePagination
          table={table}
          className={cn("py-4", paginationClassName)}
        />
      )}
    </>
  );
}
