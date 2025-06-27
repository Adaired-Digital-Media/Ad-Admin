/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CouponTypes } from "@/data/coupons.types";
import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import TablePagination from "@core/components/table/pagination";
import { couponsListColumns } from "./columns";
// import Filters from "./filters";
import TableFooter from "@core/components/table/footer";
import { TableClassNameProps } from "@core/components/table/table-types";
import cn from "@core/utils/class-names";
// import { exportToCSV } from "@core/utils/export-to-csv";
import { useApiCall } from "@/core/utils/api-config";
import toast from "react-hot-toast";
import { CustomTableMeta } from "@/app/shared/dashboard/recent-order";
import { useAtom } from "jotai";
import { couponActionsAtom, couponsAtom } from "@/store/atoms/coupons.atom";
import { Session } from "next-auth";
import { useEffect } from "react";

export default function CouponsTable({
  initialCoupons = [],
  // couponStats = [],
  pageSize = 5,
  // hideFilters = false,
  hidePagination = false,
  hideFooter = false,
  classNames = {
    container: "border border-muted rounded-md",
    rowClassName: "last:border-0",
  },
  paginationClassName,
  session,
}: {
  pageSize?: number;
  // hideFilters?: boolean;
  hidePagination?: boolean;
  hideFooter?: boolean;
  classNames?: TableClassNameProps;
  paginationClassName?: string;
  initialCoupons?: CouponTypes[];
  couponStats?: any[];
  session: Session;
}) {
  const { apiCall } = useApiCall();

  const [coupons] = useAtom(couponsAtom);
  const [, dispatch] = useAtom(couponActionsAtom);

  const { table, setData } = useTanStackTable<CouponTypes>({
    tableData: coupons.length ? coupons : initialCoupons,
    columnConfig: couponsListColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: pageSize,
        },
      },
      meta: {
        handleMultipleDelete: async (rows: any) => {
          rows.forEach(async (r: CouponTypes) => {
            const _response = await apiCall<{ message: string }>({
              url: `/coupons/delete?id=${r._id}`,
              method: "DELETE",
            });
            if (_response.status === 200) {
              toast.success(_response.data.message);
            }
          });
          await fetch("/api/revalidateTags?tags=products", {
            method: "GET",
          });
        },
        handleDeleteRow: async (row: { _id: string }) => {
          const response = await dispatch({
            type: "delete",
            token: session.user.accessToken!,
            payload: { id: row._id },
          });
          if (response.success) {
            toast.success(response.message);
          }
          await fetch("/api/revalidateTags?tags=coupons", {
            method: "GET",
          });
          table.resetRowSelection();
        },
      } as CustomTableMeta<CouponTypes>,
      enableColumnResizing: false,
    },
  });

  // Fetch coupons on mount and when access token changes
  useEffect(() => {
    if (session?.user?.accessToken) {
      const fetchCoupons = async () => {
        try {
          await dispatch({
            type: "fetchAll",
            token: session.user.accessToken!,
          });
        } catch (error) {
          toast.error("Failed to fetch coupons");
          console.error("Failed to fetch coupons : ", error);
        }
      };
      fetchCoupons();
    }
  }, [session?.user?.accessToken, dispatch]);

  // Sync table data with tickets atom
  useEffect(() => {
    setData(coupons.length >= 0 ? coupons : initialCoupons);
  }, [coupons, initialCoupons, setData]);

  return (
    <>
      {/* {!hideFilters && <Filters table={table} />} */}
      <Table table={table} variant="modern" classNames={classNames} />
      {!hideFooter && (
        <TableFooter
          table={table}
          // onExport={handleExportData}
        />
      )}
      {!hidePagination && (
        <TablePagination
          table={table}
          className={cn("py-4", paginationClassName)}
        />
      )}
    </>
  );
}
