/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ProductCategoryType } from "@/data/product-categories";
import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { categoriesColumns } from "./columns";
import TableFooter from "@core/components/table/footer";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useApiCall } from "@/core/utils/api-config";
import toast from "react-hot-toast";
import { CustomTableMeta } from "@core/types/index";

export default function CategoryTable({
  categories,
}: {
  categories: ProductCategoryType[];
}) {
  const { apiCall } = useApiCall();
  const { table, setData } = useTanStackTable<ProductCategoryType>({
    tableData: categories,
    columnConfig: categoriesColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {
        handleDeleteRow: async (row: { _id: string }) => {
          setData((prev) => prev.filter((r) => r._id !== row._id));
          const response = await apiCall<{ message: string }>({
            url: `/product/category/delete-category?identifier=${row._id}`,
            method: "DELETE",
          });
          if (response.status === 200) {
            toast.success(response.data.message);
          }
        },
        handleMultipleDelete: async (rows: any) => {
          setData((prev) => prev.filter((r) => !rows.includes(r)));
          rows.forEach(async (r: ProductCategoryType) => {
            await apiCall<{ message: string }>({
              url: `/product/category/delete-category?identifier=${r._id}`,
              method: "DELETE",
            });
          });
          toast.success("Selected categories deleted successfully");
        },
      } as CustomTableMeta<ProductCategoryType>,
      enableColumnResizing: false,
    },
  });

  return (
    <>
      <Filters table={table} />
      <Table
        table={table}
        variant="modern"
        classNames={{
          container: "border border-muted rounded-md",
          rowClassName: "last:border-0",
        }}
      />
      <TableFooter table={table} />
      <TablePagination table={table} className="py-4" />
    </>
  );
}
