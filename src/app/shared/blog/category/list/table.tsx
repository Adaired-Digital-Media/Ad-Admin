/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { blogCategoryListColumns } from "./columns";
import TableFooter from "@core/components/table/footer";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { TableMeta } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { BlogCategoryType } from "@/core/types";
import { Session } from "next-auth";
import { useAtom, useSetAtom } from "jotai";
import { blogActionsAtom, blogCategoryAtom } from "@/store/atoms/blog.atom";
import { useEffect } from "react";
import { useModal } from "@/app/shared/modal-views/use-modal";
import CreateEditCategory from "../create-edit";

// Define custom meta interface
export interface CustomTableMeta<T> extends TableMeta<T> {
  handleDeleteRow?: (row: T) => void;
  handleMultipleDelete?: (rows: T[]) => void;
  handleEditRow?: (row: T) => void;
}

export default function BlogCategoryTable({
  initialCategories,
  session,
}: {
  initialCategories: BlogCategoryType[];
  session: Session;
}) {
  const [blogCategories] = useAtom(blogCategoryAtom);
  const setCategories = useSetAtom(blogActionsAtom);
  const { openModal } = useModal();

  const { table, setData } = useTanStackTable<BlogCategoryType>({
    tableData: blogCategories.length ? blogCategories : initialCategories,
    columnConfig: blogCategoryListColumns(),
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
            toast.error(response.data.message);
            return;
          }
          toast.success(response.data.message);
        },
        handleMultipleDelete: async (rows) => {
          rows.forEach(async (row: BlogCategoryType) => {
            const _response = await setCategories({
              type: "deleteCategory",
              payload: {
                id: row._id,
              },
              token: session.user.accessToken!,
            });
            if (_response.status !== 200) {
              toast.error(_response.data.message);
              return;
            }
            toast.success(_response.data.message);
          });
        },
        handleEditRow: (row: BlogCategoryType) => {
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
      } as CustomTableMeta<BlogCategoryType>,
      enableColumnResizing: false,
    },
  });

  // Fetch coupons on mount and when access token changes
  useEffect(() => {
    if (session?.user?.accessToken) {
      const fetchCategories = async () => {
        try {
          await setCategories({
            type: "fetchAllCategories",
            token: session.user.accessToken!,
          });
        } catch (error) {
          toast.error("Failed to fetch Categories");
          console.error("Failed to fetch Categories : ", error);
        }
      };
      fetchCategories();
    }
  }, [session?.user?.accessToken, setCategories]);

  // Sync table data with tickets atom
  useEffect(() => {
    setData(blogCategories.length >= 0 ? blogCategories : initialCategories);
  }, [blogCategories, initialCategories, setData]);

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
