/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Table from "@core/components/table";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { caseStudyColumns } from "./columns";
import TableFooter from "@core/components/table/footer";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import toast from "react-hot-toast";
import { Session } from "next-auth";
import { useAtom, useSetAtom } from "jotai";
import {
  caseStudyActionsAtom,
  caseStudiesAtom,
} from "@/store/atoms/case-studies.atom";
import { useEffect, useState } from "react";
import { CaseStudyType } from "@/core/types";
import { CustomTableMeta } from "@core/types/index";

export default function CaseStudyTable({
  initialCaseStudies,
  session,
}: {
  initialCaseStudies: CaseStudyType[];
  session: Session;
}) {
  const setCaseStudies = useSetAtom(caseStudyActionsAtom);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [caseStudies, setCaseStudiesState] = useAtom(caseStudiesAtom);

  const { table, setData } = useTanStackTable<CaseStudyType>({
    tableData: initialCaseStudies,
    columnConfig: caseStudyColumns(),
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {
        handleDeleteRow: async (row: { _id: string }) => {
          const response = await setCaseStudies({
            type: "deleteCaseStudy",
            payload: {
              id: row._id,
            },
            token: session.user.accessToken!,
          });

          if (response.status !== 200) {
            toast.error(response.data.message || "Failed to delete case study");
            return;
          }
          toast.success(
            response.data.message || "Case study deleted successfully"
          );
          table.resetRowSelection();
        },
        handleMultipleDelete: async (rows) => {
          rows.forEach(async (row: CaseStudyType) => {
            const _response = await setCaseStudies({
              type: "deleteCaseStudy",
              payload: {
                id: row._id,
              },
              token: session.user.accessToken!,
            });
            if (_response.status !== 200) {
              toast.error(_response.data.message);
              return;
            }
            toast.success(_response.data.message);
          });

          const deletePromises = rows.map(async (row: CaseStudyType) => {
            const response = await setCaseStudies({
              type: "deleteCaseStudy",
              payload: { id: row._id },
              token: session.user.accessToken!,
            });
            if (response.status !== 200) {
              toast.error(
                response.data.message || "Failed to delete case study"
              );
              return false;
            }
            return true;
          });
          const results = await Promise.all(deletePromises);
          if (results.every((success) => success)) {
            toast.success("All selected case studies deleted successfully");
            table.resetRowSelection();
          } else {
            toast.error("Some case studies could not be deleted");
          }
        },
      } as CustomTableMeta<CaseStudyType>,
      enableColumnResizing: false,
    },
  });

  // Fetch case studies on mount and when access token changes
  useEffect(() => {
    if (session?.user?.accessToken) {
      const fetchCaseStudies = async () => {
        try {
          const response = await setCaseStudies({
            type: "fetchAllCaseStudies",
            token: session.user.accessToken!,
          });
          if (response.status === 200) {
            setIsInitialLoad(false);
          } else {
            toast.error("Failed to fetch case studies");
            setCaseStudiesState(initialCaseStudies);
          }
        } catch (error) {
          toast.error("Failed to fetch Blog");
          console.error("Failed to fetch Blog : ", error);
        }
      };
      fetchCaseStudies();
    }
  }, [
    session?.user?.accessToken,
    setCaseStudies,
    initialCaseStudies,
    setCaseStudiesState,
  ]);

  useEffect(() => {
    setData(
      isInitialLoad && caseStudies.length === 0
        ? initialCaseStudies
        : caseStudies
    );
  }, [caseStudies, initialCaseStudies, setData, isInitialLoad]);

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
      <TableFooter table={table} />
      <TablePagination table={table} className="py-4" />
    </>
  );
}
