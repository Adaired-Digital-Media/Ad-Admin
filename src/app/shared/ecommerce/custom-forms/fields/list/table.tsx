/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import TableFooter from "@core/components/table/footer";
import { TableClassNameProps } from "@core/components/table/table-types";
import cn from "@core/utils/class-names";
import { exportToCSV } from "@core/utils/export-to-csv";
import toast from "react-hot-toast";
import { CustomTableMeta } from "@core/types/index";
import { FieldType } from "@/data/productForms.types";
import { fieldListColumns } from "./columns";
import { useAtom } from "jotai";
import { useModal } from "@/app/shared/modal-views/use-modal";
import { fieldsAtom, formFieldActionsAtom } from "@/store/atoms/forms.atom";
import { Session } from "next-auth";
import { useEffect } from "react";
import CreateEditField from "../create-edit";

interface FieldsTableProps {
  initialFields?: FieldType[];
  pageSize?: number;
  hideFilters?: boolean;
  hidePagination?: boolean;
  hideFooter?: boolean;
  classNames?: TableClassNameProps;
  paginationClassName?: string;
  session: Session;
}

export default function FieldsTable({
  initialFields = [],
  pageSize = 5,
  hideFilters = false,
  hidePagination = false,
  hideFooter = false,
  classNames = {
    container: "border border-muted rounded-md",
    rowClassName: "last:border-0",
  },
  paginationClassName,
  session,
}: FieldsTableProps) {
  const { openModal } = useModal();
  const [fields] = useAtom<FieldType[]>(fieldsAtom);
  const [, dispatchAction] = useAtom(formFieldActionsAtom);
  const { table, setData } = useTanStackTable<FieldType>({
    tableData: fields.length > 0 ? fields : initialFields,
    columnConfig: fieldListColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: pageSize,
        },
      },
      meta: {
        handleMultipleDelete: async (rows: any) => {
          // setData((prev) => prev.filter((r) => !rows.includes(r._id)));
          rows.forEach(async (f: FieldType) => {
            const _response = await dispatchAction({
              type: "deleteField",
              payload: {
                fieldId: f?._id,
              },
              token: session?.user?.accessToken ?? "",
            });
            toast.success(_response.message);
          });
          await fetch("/api/revalidateTags?tags=fields", {
            method: "GET",
          });
        },
        handleDeleteRow: async (row: { _id: string }) => {
          const _response = await dispatchAction({
            type: "deleteField",
            payload: {
              fieldId: row?._id,
            },
            token: session?.user?.accessToken ?? "",
          });
          toast.success(_response.message);
          await fetch("/api/revalidateTags?tags=fields", {
            method: "GET",
          });
        },
        handleEditRow: (row: FieldType) => {
          openModal({
            view: <CreateEditField field={row} session={session} />,
            size: "lg",
          });
          table.resetRowSelection();
        },
      } as CustomTableMeta<FieldType>,
      enableColumnResizing: false,
    },
  });

  const selectedData = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  function handleExportData() {
    exportToCSV(
      selectedData,
      "ID,Label,Name,InputType,ValidationPattern,Required",
      `field_data_${selectedData.length}`
    );
  }

  // Fetch fields on mount and when access token changes
  useEffect(() => {
    if (session?.user?.accessToken) {
      const fetchData = async () => {
        try {
          // Execute both requests in parallel
          await Promise.all([
            dispatchAction({
              type: "fetchAllFields",
              token: session.user.accessToken!,
            }),
          ]);
        } catch (error) {
          toast.error("Failed to fetch fields data");
          console.error("Failed to fetch fields data:", error);
        }
      };

      fetchData();
    }
  }, [session?.user?.accessToken, dispatchAction]);

  useEffect(() => {
    setData(
      fields.length === 0 && initialFields.length > 0 ? initialFields : fields
    );
  }, [fields, initialFields, setData]);

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
