/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { blogColumns } from "./columns";
import TableFooter from "@core/components/table/footer";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import toast from "react-hot-toast";
import { Session } from "next-auth";
import { useAtom, useSetAtom } from "jotai";
import { blogActionsAtom, blogsAtom } from "@/store/atoms/blog.atom";
import { useEffect, useState } from "react";
import { BlogTypes } from "@/core/types";
import { CustomTableMeta } from "@core/types/index";

export default function BlogTable({
  initialBlogs,
  session,
}: {
  initialBlogs: BlogTypes[];
  session: Session;
}) {
  const setBlogs = useSetAtom(blogActionsAtom);
  const [blogs, setBlogsState] = useAtom(blogsAtom);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { table, setData } = useTanStackTable<BlogTypes>({
    tableData: initialBlogs,
    columnConfig: blogColumns(),
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {
        handleDeleteRow: async (row: { _id: string }) => {
          const response = await setBlogs({
            type: "deleteBlog",
            payload: {
              id: row._id,
            },
            token: session.user.accessToken!,
          });
          if (response.status !== 200) {
            toast.error(response.data.message || "Failed to delete blog");
            return;
          }
          toast.success(response.data.message || "Blog deleted successfully");
          table.resetRowSelection();
        },
        handleMultipleDelete: async (rows) => {
          const deletePromises = rows.map(async (row: BlogTypes) => {
            const response = await setCategories({
              type: "deleteBlog",
              payload: { id: row._id },
              token: session.user.accessToken!,
            });
            if (response.status !== 200) {
              toast.error(response.data.message || "Failed to delete blog");
              return false;
            }
            return true;
          });
          const results = await Promise.all(deletePromises);
          if (results.every((success) => success)) {
            toast.success("All selected blog deleted successfully");
            table.resetRowSelection();
          } else {
            toast.error("Some blog could not be deleted");
          }
        },
      } as CustomTableMeta<BlogTypes>,
      enableColumnResizing: false,
    },
  });

  // Fetch blogs on mount and when access token changes
  useEffect(() => {
    if (session?.user?.accessToken) {
      const fetchBlogs = async () => {
        try {
          const response = await setBlogs({
            type: "fetchAllBlog",
            token: session.user.accessToken!,
          });
          if (response.status === 200) {
            setIsInitialLoad(false);
          } else {
            toast.error("Failed to fetch categories");
            setBlogsState(initialCategories);
          }
        } catch (error) {
          toast.error("Failed to fetch Blog");
          console.error("Failed to fetch Blog : ", error);
        }
      };
      fetchBlogs();
    }
  }, [session?.user?.accessToken, setBlogs, setBlogsState]);

  useEffect(() => {
    const dataToUse =
      isInitialLoad && blogs.length === 0 ? initialBlogs : blogs;
    setData(dataToUse);
  }, [blogs, initialBlogs, setData, isInitialLoad]);

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
