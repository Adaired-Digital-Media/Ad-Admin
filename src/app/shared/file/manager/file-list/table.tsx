"use client";

import { Box } from "rizzui";
import {
  CloudinaryFile,
  deleteFile,
} from "@/data/cloudinary-files";
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
import { CustomTableMeta } from "@/app/shared/dashboard/recent-order";

// Define the meta type
export interface CloudinaryFileMeta extends CustomTableMeta<CloudinaryFile> {
  handleDeleteRow: (row: { public_id: string }) => void;
  handleCopyLink: (row: { secure_url: string }) => void;
  handleMultipleDelete: (rows: CloudinaryFile[]) => void;
  handleEditFile: (row: CloudinaryFile) => void;
}

export default function FileListTable({
  className,
  files,
}: {
  className?: string;
  files: CloudinaryFile[];
}) {
  const { openModal } = useModal();
  const [updatedFiles, setUpdatedFiles] = useState(files);

  const { table, setData } = useTanStackTable<CloudinaryFile>({
    tableData: updatedFiles,
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
          setData((prev) => prev.filter((r) => r.public_id !== row.public_id));
          const response = await deleteFile({ public_id: row.public_id });
          toast.success(response);
          table.resetRowSelection();
        },
        handleMultipleDelete: (rows: CloudinaryFile[]) => {
          setData((prev) => prev.filter((r) => !rows.includes(r)));
          rows.forEach((r) => deleteFile({ public_id: r.public_id }));
          toast.success("Files deleted successfully!");
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

  // Sync table data with updatedFiles whenever it changes
  useEffect(() => {
    setData(updatedFiles);
  }, [updatedFiles, setData]);

  // Listen for filesUpdated event with new data
  useEffect(() => {
    const handleFilesUpdated = (event: CustomEvent) => {
      if (event.detail?.updatedFiles) {
        setUpdatedFiles(event.detail.updatedFiles);
      }
    };

    window.addEventListener(
      "filesUpdated",
      handleFilesUpdated as EventListener
    );
    return () =>
      window.removeEventListener(
        "filesUpdated",
        handleFilesUpdated as EventListener
      );
  }, []);

  return (
    <Box className={className}>
      <FileTableFilters table={table} />
      <Table table={table} variant="modern" />
      <TableFooter table={table} />
      <TablePagination table={table} className="py-4" />
    </Box>
  );
}
