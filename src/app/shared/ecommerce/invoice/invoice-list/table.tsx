"use client";

import { invoiceListColumns } from "./columns";
import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import Filters from "./filters";
import TablePagination from "@core/components/table/pagination";
import TableFooter from "@core/components/table/footer";
import { exportToCSV } from "@core/utils/export-to-csv";
import { InvoiceTypes } from "@/core/types";
import { useAtom, useSetAtom } from "jotai";
import { invoiceActionsAtom, invoicesAtom } from "@/store/atoms/invoices.atom";
import { CustomTableMeta } from "@core/types/index";
import { Session } from "next-auth";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function InvoiceTable({
  initialInvoices,
  session,
}: {
  initialInvoices: InvoiceTypes[];
  session: Session;
}) {
  const [invoices, setInvoices] = useAtom(invoicesAtom);
  const dispatch = useSetAtom(invoiceActionsAtom);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { table, setData } = useTanStackTable<InvoiceTypes>({
    tableData: initialInvoices,
    columnConfig: invoiceListColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {
        handleDeleteRow: async (row: { _id: string }) => {
          const response = await dispatch({
            type: "delete",
            payload: {
              id: row._id,
            },
            token: session.user.accessToken!,
          });
          if (!response.success) {
            toast.error(response.message || "Failed to delete Invoice");
            return;
          }
          toast.success(response.message || "Invoice deleted successfully");
          table.resetRowSelection();
        },
        handleMultipleDelete: async (rows) => {
          const deletePromises = rows.map(async (row: InvoiceTypes) => {
            const response = await dispatch({
              type: "delete",
              payload: { id: row._id },
              token: session.user.accessToken!,
            });
            if (!response.success) {
              toast.error(response.message || "Failed to delete invoice");
              return false;
            }
            return true;
          });
          const results = await Promise.all(deletePromises);
          if (results.every((success) => success)) {
            toast.success("All selected invoices deleted successfully");
            table.resetRowSelection();
          } else {
            toast.error("Some invoices could not be deleted");
          }
        },
      } as CustomTableMeta<InvoiceTypes>,
      enableColumnResizing: false,
    },
  });

  // Fetch coupons on mount and when access token changes
  useEffect(() => {
    if (session?.user?.accessToken) {
      const fetchCoupons = async () => {
        try {
          const response = await dispatch({
            type: "fetchAll",
            token: session.user.accessToken!,
          });
          if (response.success) {
            setIsInitialLoad(false);
          } else {
            toast.error("Failed to fetch invoices");
            setInvoices(initialInvoices);
          }
        } catch (error) {
          toast.error("Failed to fetch invoices");
          console.error("Failed to fetch invoices : ", error);
          setInvoices(initialInvoices);
        }
      };
      fetchCoupons();
    }
  }, [session?.user?.accessToken, setInvoices, initialInvoices, dispatch]);

  useEffect(() => {
    setData(
      isInitialLoad && invoices.length === 0 ? initialInvoices : invoices
    );
  }, [invoices, initialInvoices, setData, isInitialLoad]);

  const selectedData = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  function handleExportData() {
    exportToCSV(
      selectedData,
      "ID,Name,Email,DueDate,Status,Amount,CreatedAt",
      `invoice_data_${selectedData.length}`
    );
  }

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
      <TableFooter table={table} onExport={handleExportData} />
      <TablePagination table={table} className="py-4" />
    </>
  );
}
