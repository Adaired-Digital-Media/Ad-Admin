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
import { FormType } from "@/data/productForms.types";
import { formListColumns } from "./columns";
import { formFieldActionsAtom, formsAtom } from "@/store/atoms/forms.atom";
import { useAtom } from "jotai";
import { Session } from "next-auth";
import { useEffect } from "react";
import CreateEditForm from "../create-edit";
import { useModal } from "@/app/shared/modal-views/use-modal";

interface FormsTableProps {
  initialForms?: FormType[];
  pageSize?: number;
  hideFilters?: boolean;
  hidePagination?: boolean;
  hideFooter?: boolean;
  classNames?: TableClassNameProps;
  paginationClassName?: string;
  session: Session;
}

export default function FormsTable({
  initialForms = [],
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
}: FormsTableProps) {
  const { openModal } = useModal();
  const [forms] = useAtom<FormType[]>(formsAtom);
  const [, dispatchAction] = useAtom(formFieldActionsAtom);
  const { table, setData } = useTanStackTable<FormType>({
    tableData: forms.length ? forms : initialForms,
    columnConfig: formListColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: pageSize,
        },
      },
      meta: {
        handleMultipleDelete: async (rows: any) => {
          rows.forEach(async (f: FormType) => {
            const _response = await dispatchAction({
              type: "deleteForm",
              payload: { formId: f._id },
              token: session?.user?.accessToken || "",
            });
            if (_response.status === 200) {
              toast.success(_response.data.message);
            }
          });
          await fetch("/api/revalidateTags?tags=forms", {
            method: "GET",
          });
          table.resetRowSelection();
        },
        handleDeleteRow: async (row: { _id: string }) => {
          const _response = await dispatchAction({
            type: "deleteForm",
            payload: { formId: row._id },
            token: session?.user?.accessToken || "",
          });
          toast.success(_response.message);
          await fetch("/api/revalidateTags?tags=forms", {
            method: "GET",
          });
          table.resetRowSelection();
        },
        handleEditRow: (row: FormType) => {
          openModal({
            view: <CreateEditForm form={row} session={session} />,
            size: "xl",
          });
          table.resetRowSelection();
        },
      } as CustomTableMeta<FormType>,
      enableColumnResizing: false,
    },
  });

  const selectedData = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  function handleExportData() {
    exportToCSV(
      selectedData,
      "ID,Title,ProductType,FieldsCount,Status",
      `form_data_${selectedData.length}`
    );
  }

  // Fetch tickets on mount and when access token changes
  useEffect(() => {
    if (session?.user?.accessToken) {
      const fetchData = async () => {
        try {
          // Execute both requests in parallel
          await Promise.all([
            dispatchAction({
              type: "fetchAllForms",
              token: session.user.accessToken!,
            }),
            dispatchAction({
              type: "fetchAllFields",
              token: session.user.accessToken!,
            }),
          ]);
        } catch (error) {
          // Handle errors from either request
          toast.error("Failed to fetch forms data");
          console.error("Failed to fetch forms data:", error);
        }
      };

      fetchData();
    }
  }, [session?.user?.accessToken, dispatchAction]);

  // Sync table data with tickets atom
  useEffect(() => {
    setData(forms.length >= 0 ? forms : initialForms);
  }, [forms, initialForms, setData]);

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
