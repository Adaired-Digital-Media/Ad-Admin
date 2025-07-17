/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CouponTypes } from "@/core/types";
import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import TablePagination from "@core/components/table/pagination";
import { couponsListColumns } from "./columns";
// import Filters from "./filters";
import TableFooter from "@core/components/table/footer";
import { TableClassNameProps } from "@core/components/table/table-types";
import cn from "@core/utils/class-names";
import toast from "react-hot-toast";
import { CustomTableMeta } from "@core/types/index";
import { useAtom } from "jotai";
import { couponActionsAtom, couponsAtom } from "@/store/atoms/coupons.atom";
import { Session } from "next-auth";
import { useEffect, useState } from "react";

export default function CouponsTable({
  initialCoupons = [],
  pageSize = 5,
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
  const [, dispatch] = useAtom(couponActionsAtom);
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { table, setData } = useTanStackTable<CouponTypes>({
    tableData: coupons.length > 0 ? coupons : initialCoupons,
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
          const deletePromises = rows.map(async (row: CouponTypes) => {
            const response = await dispatch({
              type: "delete",
              payload: { id: row._id },
              token: session.user.accessToken!,
            });
            if (!response.success) {
              toast.error(response.data.message || "Failed to delete coupon");
              return false;
            }
            return true;
          });
          const results = await Promise.all(deletePromises);
          if (results.every((success) => success)) {
            toast.success("All selected coupons deleted successfully");
            table.resetRowSelection();
          } else {
            toast.error("Some coupons could not be deleted");
          }
        },
        handleDeleteRow: async (row: { _id: string }) => {
          const response = await dispatch({
            type: "delete",
            token: session.user.accessToken!,
            payload: { id: row._id },
          });
          if (!response.success) {
            toast.error(response.data.message || "Failed to delete coupon");
            return;
          }
          toast.success(response.data.message || "Coupon deleted successfully");
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
          const response = await dispatch({
            type: "fetchAll",
            token: session.user.accessToken!,
          });

          if (response.success) {
            setIsInitialLoad(false);
          } else {
            toast.error(response.data.message || "Failed to fetch coupons");
            setCoupons(initialCoupons);
          }
        } catch (error) {
          toast.error("Failed to fetch coupons");
          console.error("Failed to fetch coupons : ", error);
          setCoupons(initialCoupons);
        }
      };
      fetchCoupons();
    }
  }, [session?.user?.accessToken, dispatch, initialCoupons, setCoupons]);

  useEffect(() => {
    setData(isInitialLoad && coupons.length === 0 ? initialCoupons : coupons);
  }, [coupons, initialCoupons, setData, isInitialLoad]);

  return (
    <>
      {/* {!hideFilters && <Filters table={table} />} */}
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
