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
import { useEffect } from "react";
import { CaseStudyType } from "@/core/types";
import { CustomTableMeta } from "@core/types/index";

export default function CaseStudyTable({
  initialCaseStudies,
  session,
}: {
  initialCaseStudies: CaseStudyType[];
  session: Session;
}) {
  const [caseStudies] = useAtom(caseStudiesAtom);
  const setCaseStudies = useSetAtom(caseStudyActionsAtom);

  const { table, setData } = useTanStackTable<CaseStudyType>({
    tableData: caseStudies.length ? caseStudies : initialCaseStudies,
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
            toast.error(response.data.message);
            return;
          }
          toast.success(response.data.message);
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
          await setCaseStudies({
            type: "fetchAllCaseStudies",
            token: session.user.accessToken!,
          });
        } catch (error) {
          toast.error("Failed to fetch Blog");
          console.error("Failed to fetch Blog : ", error);
        }
      };
      fetchCaseStudies();
    }
  }, [session?.user?.accessToken, setCaseStudies]);

  // Sync table data with blogs atom
  useEffect(() => {
    setData(caseStudies.length >= 0 ? caseStudies : initialCaseStudies);
  }, [caseStudies, initialCaseStudies, setData]);

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
