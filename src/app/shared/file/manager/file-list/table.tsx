"use client";

import { Box } from "rizzui";
import { CloudinaryFile } from "@/data/cloudinary-files";
import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import TableFooter from "@core/components/table/footer";
import TablePagination from "@core/components/table/pagination";
import { allFilesColumns } from "./columns";
import FileTableFilters from "../file-table-filters";
import { useModal } from "@/app/shared/modal-views/use-modal";

import toast from "react-hot-toast";
import { EditFileModalView } from "../edit-file-modal-view";
import { useEffect } from "react";
import { CustomTableMeta } from "@/app/shared/dashboard/recent-order";
import { useAtom, useSetAtom } from "jotai";
import {
  cloudinaryActionsAtom,
  cloudinaryFilesAtom,
} from "@/store/atoms/files.atom";
import { useSession } from "next-auth/react";

// Define the meta type
export interface CloudinaryFileMeta extends CustomTableMeta<CloudinaryFile> {
  handleDeleteRow: (row: { public_id: string }) => void;
  handleCopyLink: (row: { secure_url: string }) => void;
  handleMultipleDelete: (rows: CloudinaryFile[]) => void;
  handleEditFile: (row: CloudinaryFile) => void;
}

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
          const response = await setFiles({
            type: "delete",
            token: session?.user?.accessToken ?? "",
            payload: { public_id: row.public_id },
          });
          toast.success(response);
          await fetch("/api/revalidateTags?tags=cloudinaryFiles", {
            method: "GET",
          });
          table.resetRowSelection();
        },
        handleMultipleDelete: async (rows: CloudinaryFile[]) => {
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
          await fetch("/api/revalidateTags?tags=cloudinaryFiles", {
            method: "GET",
          });
          table.resetRowSelection();
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
      const fetchTickets = async () => {
        try {
          await setFiles({
            type: "fetch",
            token: session.user.accessToken!,
            payload: { fileType: "all" },
          });
        } catch (error) {
          toast.error("Failed to fetch tickets");
          console.log("Failed to fetch tickets : ", error);
        }
      };
      fetchTickets();
    }
  }, [session?.user?.accessToken, setFiles]);

  // Sync table data with initialFiles whenever it changes
  useEffect(() => {
    setData(files.length > 0 ? files : initialFiles);
  }, [files, initialFiles, setData]);

  return (
    <Box className={className}>
      <FileTableFilters table={table} />
      <Table table={table} variant="modern" />
      <TableFooter table={table} />
      <TablePagination table={table} className="py-4" />
    </Box>
  );
}
