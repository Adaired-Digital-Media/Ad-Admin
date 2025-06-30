/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Box, Loader } from "rizzui";
import { CloudinaryFile } from "@/core/types";
import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import TableFooter from "@core/components/table/footer";
import TablePagination from "@core/components/table/pagination";
import { allFilesColumns } from "./columns";
import FileTableFilters from "../file-table-filters";
import { useModal } from "@/app/shared/modal-views/use-modal";
import toast from "react-hot-toast";
import { EditFileModalView } from "../edit-file-modal-view";
import { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  cloudinaryActionsAtom,
  cloudinaryFilesAtom,
} from "@/store/atoms/files.atom";
import { useSession } from "next-auth/react";
import { CloudinaryFileMeta } from "@core/types";

export default function FileListTable({
  className,
  initialFiles,
}: {
  className?: string;
  initialFiles: CloudinaryFile[];
}) {
  const { openModal } = useModal();
  const { data: session } = useSession();
  const [files] = useAtom(cloudinaryFilesAtom);
  const setFiles = useSetAtom(cloudinaryActionsAtom);
  const [isLoading, setIsLoading] = useState(false);

  const { table, setData } = useTanStackTable<CloudinaryFile>({
    tableData: files.length ? files : initialFiles,
    columnConfig: allFilesColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {
        handleDeleteRow: async (row: { public_id: string }) => {
          setIsLoading(true);
          try {
            const response = await setFiles({
              type: "delete",
              token: session?.user?.accessToken ?? "",
              payload: { public_id: row.public_id },
            });
            toast.success(response);
            table.resetRowSelection();
          } catch (error) {
            toast.error("Failed to delete file");
            console.error("Failed to delete file:", error);
          } finally {
            setIsLoading(false);
          }
        },
        handleMultipleDelete: async (rows: CloudinaryFile[]) => {
          setIsLoading(true);
          try {
            await Promise.all(
              rows.map((row) =>
                setFiles({
                  type: "delete",
                  token: session?.user?.accessToken ?? "",
                  payload: { public_id: row.public_id },
                })
              )
            );
            toast.success("Files deleted successfully!");
            table.resetRowSelection();
          } catch (error) {
            toast.error("Failed to delete multiple files");
            console.error("Failed to delete multiple files:", error);
          } finally {
            setIsLoading(false);
          }
        },
        handleCopyLink: (row: { secure_url: string }) => {
          const link = row.secure_url;
          navigator.clipboard.writeText(link);
          toast.success("Link copied to clipboard!");
          table.resetRowSelection();
        },
        handleEditFile: (row: CloudinaryFile) => {
          openModal({
            view: <EditFileModalView file={row} />,
            customSize: "720px",
          });
          table.resetRowSelection();
        },
      } as CloudinaryFileMeta,
      enableColumnResizing: false,
    },
  });

  // Fetch files on mount and when access token changes
  useEffect(() => {
    if (session?.user?.accessToken) {
      const fetchFiles = async () => {
        setIsLoading(true);
        try {
          await setFiles({
            type: "fetch",
            token: session.user.accessToken!,
            payload: { fileType: "all" },
          });
        } catch (error) {
          toast.error("Failed to fetch files");
          console.error("Failed to fetch files:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchFiles();
    }
  }, [session?.user?.accessToken, setFiles]);

  // Sync table data with files or initialFiles
  useEffect(() => {
    setData(files.length ? files : initialFiles);
  }, [files, initialFiles, setData]);

  return (
    <Box className={className}>
      <FileTableFilters table={table} />
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader variant="spinner" className="w-12 h-12" />
        </div>
      ) : (
        <>
          <Table table={table} variant="modern" />
          <TableFooter table={table} />
          <TablePagination table={table} className="py-4" />
        </>
      )}
    </Box>
  );
}
