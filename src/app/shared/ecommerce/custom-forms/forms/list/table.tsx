/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import TableFooter from "@core/components/table/footer";
import { TableClassNameProps } from "@core/components/table/table-types";
import cn from "@core/utils/class-names";

import toast from "react-hot-toast";
import { CustomTableMeta } from "@core/types/index";
import { FormType } from "@/core/types";
import { formListColumns } from "./columns";
import { formFieldActionsAtom, formsAtom } from "@/store/atoms/forms.atom";
import { useAtom } from "jotai";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import CreateEditForm from "../create-edit";
import { useModal } from "@/app/shared/modal-views/use-modal";

interface FormsTableProps {
  initialForms: FormType[];
  pageSize?: number;
  hideFilters?: boolean;
  hidePagination?: boolean;
  hideFooter?: boolean;
  classNames?: TableClassNameProps;
  paginationClassName?: string;
  session: Session;
}

export default function FormsTable({
  initialForms,
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
  console.log("Initial Forms:", initialForms);
  const { openModal } = useModal();
  const [, dispatchAction] = useAtom(formFieldActionsAtom);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [forms, setForms] = useAtom(formsAtom);

  const { table, setData } = useTanStackTable<FormType>({
    tableData: initialForms,
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
          const deletePromises = rows.map(async (f: FormType) => {
            const response = await dispatchAction({
              type: "deleteForm",
              payload: { formId: f._id },
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
            toast.success("All selected forms deleted successfully");
            table.resetRowSelection();
          } else {
            toast.error("Some forms could not be deleted");
          }
        },
        handleDeleteRow: async (row: { _id: string }) => {
          const _response = await dispatchAction({
            type: "deleteForm",
            payload: { formId: row._id },
            token: session?.user?.accessToken || "",
          });
          if (_response.status !== 200) {
            toast.error(_response.message || "Failed to delete form");
            return;
          }
          toast.success(_response.message || "Form deleted successfully");
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

  // Fetch tickets on mount and when access token changes
  useEffect(() => {
    if (session?.user?.accessToken) {
      const fetchData = async () => {
        try {
          // Execute both requests in parallel
          const response = await Promise.all([
            dispatchAction({
              type: "fetchAllForms",
              token: session.user.accessToken!,
            }),
            dispatchAction({
              type: "fetchAllFields",
              token: session.user.accessToken!,
            }),
          ]);
          if (response) {
            console.log("Forms fetch response:", response);
            setIsInitialLoad(false);
          } else {
            toast.error("Failed to fetch Forms");
            setForms(initialForms);
          }
        } catch (error) {
          // Handle errors from either request
          toast.error("Failed to fetch forms data");
          console.error("Failed to fetch forms data:", error);
          setForms(initialForms);
        }
      };

      fetchData();
    }
  }, [session?.user?.accessToken, dispatchAction, setForms, initialForms]);

  useEffect(() => {
    setData(isInitialLoad && forms.length === 0 ? initialForms : forms);
  }, [forms, initialForms, setData, isInitialLoad]);

  return (
    <>
      {!hideFilters && <Filters table={table} />}
      <Table table={table} variant="modern" classNames={classNames} />
      {!hideFooter && <TableFooter table={table} />}
      {!hidePagination && (
        <TablePagination
          table={table}
          className={cn("py-4", paginationClassName)}
        />
      )}
    </>
  );
}
