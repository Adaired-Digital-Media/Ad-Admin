/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { blogColumns } from "./columns";
import TableFooter from "@core/components/table/footer";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { TableMeta } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { Session } from "next-auth";
import { useAtom, useSetAtom } from "jotai";
import { blogActionsAtom, blogsAtom } from "@/store/atoms/blog.atom";
import { useEffect } from "react";
import { BlogTypes } from "@/core/types";

// Define custom meta interface
export interface CustomTableMeta<T> extends TableMeta<T> {
  handleDeleteRow?: (row: T) => void;
  handleMultipleDelete?: (rows: T[]) => void;
}

export default function BlogTable({
  initialBlogs,
  session,
}: {
  initialBlogs: BlogTypes[];
  session: Session;
}) {
  const [blogs] = useAtom(blogsAtom);
  const setBlogs = useSetAtom(blogActionsAtom);

  const { table, setData } = useTanStackTable<BlogTypes>({
    tableData: blogs.length ? blogs : initialBlogs,
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
            toast.error(response.data.message);
            return;
          }
          toast.success(response.data.message);
        },
        handleMultipleDelete: async (rows) => {
          rows.forEach(async (row: BlogTypes) => {
            const _response = await setBlogs({
              type: "deleteBlog",
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
      } as CustomTableMeta<BlogTypes>,
      enableColumnResizing: false,
    },
  });

  // Fetch blogs on mount and when access token changes
  useEffect(() => {
    if (session?.user?.accessToken) {
      const fetchBlogs = async () => {
        try {
          await setBlogs({
            type: "fetchAllBlog",
            token: session.user.accessToken!,
          });
        } catch (error) {
          toast.error("Failed to fetch Blog");
          console.error("Failed to fetch Blog : ", error);
        }
      };
      fetchBlogs();
    }
  }, [session?.user?.accessToken, setBlogs]);

  // Sync table data with blogs atom
  useEffect(() => {
    setData(blogs.length >= 0 ? blogs : initialBlogs);
  }, [blogs, initialBlogs, setData]);

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
