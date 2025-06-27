"use client";

import { MoreActions } from "@core/components/table-utils/more-actions";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import Image from "next/image";
import { Checkbox, Flex, Text, Title } from "rizzui";
import { CloudinaryFile } from "@/core/types";
// import imageIcon from "@public/image-icon.svg";
// import folderIcon from "@public/folder-icon.svg";
import { CloudinaryFileMeta } from "./table";

const columnHelper = createColumnHelper<CloudinaryFile>();

export const allFilesColumns = [
  columnHelper.display({
    id: "checked",
    size: 50,
    header: ({ table }) => (
      <Checkbox
        className="ps-3.5"
        aria-label="Select all rows"
        checked={table.getIsAllPageRowsSelected()}
        onChange={() => table.toggleAllPageRowsSelected()}
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
  columnHelper.accessor("filename", {
    id: "name",
    size: 400,
    header: "Name",
    cell: ({ row }) => (
      <Flex align="center">
        <Flex
          align="center"
          justify="center"
          className="size-12"
        >
          <Image
            src = {row?.original?.secure_url}
            className="aspect-square rounded-lg bg-gray-100"
            width={40}
            height={40}
            alt={"image"}
          />
        </Flex>
        <Title as="h6" className="mb-0.5 !text-sm font-medium">
          {row.original.filename}
        </Title>
      </Flex>
    ),
  }),
  columnHelper.display({
    id: "size",
    size: 130,
    header: "Size",
    cell: ({ row }) => {
      const bytes = row.original.bytes;
      return (
        <span className="text-gray-500">
          {bytes < 1024 * 1024
            ? `${(bytes / 1024).toFixed(2)} KB`
            : `${(bytes / (1024 * 1024)).toFixed(2)} MB`}
        </span>
      );
    },
  }),
  columnHelper.accessor("type", {
    id: "type",
    size: 130,
    header: "Type",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="capitalize text-gray-500">
        {row.original.format.toUpperCase()}
      </span>
    ),
  }),
  columnHelper.accessor("created_at", {
    id: "modified",
    size: 130,
    header: "Modified",
    cell: ({ row }) => (
      <Text className="mb-1 text-gray-500">
        {dayjs(row.original.created_at).format("DD MMM YYYY")}
      </Text>
    ),
  }),
  columnHelper.display({
    id: "action",
    size: 100,
    header: "",
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) => {
      const tableMeta = meta as CloudinaryFileMeta;

      return (
        <Flex align="center" justify="end">
          <MoreActions
            onDelete={() => tableMeta?.handleDeleteRow?.(row.original)}
            onCopy={() => tableMeta?.handleCopyLink?.(row.original)}
            onEdit={() => tableMeta?.handleEditFile?.(row.original)}
          />
        </Flex>
      );
    },
  }),
];
