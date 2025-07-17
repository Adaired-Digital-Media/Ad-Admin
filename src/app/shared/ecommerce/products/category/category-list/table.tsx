/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ProductCategoryType } from "@/core/types";
import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { categoriesColumns } from "./columns";
import TableFooter from "@core/components/table/footer";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import toast from "react-hot-toast";
import { CustomTableMeta } from "@core/types/index";
import { useAtom, useSetAtom } from "jotai";
import { Session } from "next-auth";
import {
  productActionsAtom,
  productsCategoryAtom,
} from "@/store/atoms/product.atom";
import { useEffect, useState } from "react";
import { useModal } from "@/app/shared/modal-views/use-modal";
import CreateEditCategory from "@/app/shared/ecommerce/products/category/create-edit";

export default function ProductCategoryTable({
  initialCategories,
  session,
}: {
  initialCategories: ProductCategoryType[];
  session: Session;
}) {
  const { openModal } = useModal();
  const setCategories = useSetAtom(productActionsAtom);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [categories, setCategoriesState] = useAtom(productsCategoryAtom);

  const { table, setData } = useTanStackTable<ProductCategoryType>({
    tableData: initialCategories,
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
          const response = await setCategories({
            type: "deleteCategory",
            payload: {
              id: row._id,
            },
            token: session.user.accessToken!,
          });
          if (response.status !== 200) {
            toast.error(response.data.message || "Failed to delete category");
            return;
          }
          toast.success(
            response.data.message || "Category deleted successfully"
          );
          table.resetRowSelection();
        },
        handleMultipleDelete: async (rows) => {
          const deletePromises = rows.map(async (row: ProductCategoryType) => {
            const response = await setCategories({
              type: "deleteCategory",
              payload: { id: row._id },
              token: session.user.accessToken!,
            });
            if (response.status !== 200) {
              toast.error(response.data.message || "Failed to delete category");
              return false;
            }
            return true;
          });
          const results = await Promise.all(deletePromises);
          if (results.every((success) => success)) {
            toast.success("All selected categories deleted successfully");
            table.resetRowSelection();
          } else {
            toast.error("Some categories could not be deleted");
          }
        },
        handleEditRow: (row: ProductCategoryType) => {
          openModal({
            view: (
              <CreateEditCategory
                category={row}
                accessToken={session?.user?.accessToken}
              />
            ),
          });
          table.resetRowSelection();
        },
      } as CustomTableMeta<ProductCategoryType>,
      enableColumnResizing: false,
    },
  });

  // Fetch categories on mount and when access token changes
  useEffect(() => {
    if (session?.user?.accessToken) {
      const fetchCategories = async () => {
        try {
          const response = await setCategories({
            type: "fetchAllCategories",
            token: session.user.accessToken!,
          });
          if (response.status === 200) {
            setIsInitialLoad(false);
          } else {
            toast.error("Failed to fetch categories");
            setCategoriesState(initialCategories);
          }
        } catch (error) {
          toast.error("Failed to fetch categories");
          console.error("Failed to fetch categories: ", error);
          setCategoriesState(initialCategories);
        }
      };
      fetchCategories();
    }
  }, [
    session?.user?.accessToken,
    setCategories,
    initialCategories,
    setCategoriesState,
  ]);

  // Update table data when categories or initialCategories change
  useEffect(() => {
    const dataToUse =
      isInitialLoad && categories.length === 0 ? initialCategories : categories;
    setData(dataToUse);
  }, [categories, initialCategories, setData, isInitialLoad]);

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
