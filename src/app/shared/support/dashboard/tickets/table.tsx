"use client";

import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import { ticketsColumns } from "./columns";
import Filters from "./filters";
import { CustomTableMeta } from "@core/types/index";
import { Ticket } from "@/core/types";
import { Session } from "next-auth";
import { useAtom } from "jotai";
import { ticketActionsAtom, ticketsAtom } from "@/store/atoms/tickets.atom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface TicketsTableMeta<T> extends CustomTableMeta<T> {
  handleDeleteRow?: (row: T) => void;
  handleMultipleDelete?: (rows: T[]) => void;
  handleEditRow?: (row: T) => void;
}

export default function TicketsTable({
  tickets: initialTickets,
  session,
}: {
  tickets: Ticket[];
  session: Session;
}) {
  const [, dispatch] = useAtom(ticketActionsAtom);
  const [tickets, setTicketsState] = useAtom(ticketsAtom);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Initialize table with tickets from atom or initialTickets
  const { table, setData } = useTanStackTable<Ticket>({
    tableData: initialTickets,
    columnConfig: ticketsColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {
        handleDeleteRow: async (row) => {
          const response = await dispatch({
            type: "delete",
            token: session.user.accessToken!,
            payload: { id: row._id },
          });
          if (response.status !== 200) {
            toast.error(response.data.message || "Failed to delete ticket");
            return;
          }
          toast.success(response.data.message || "Ticket deleted successfully");
          table.resetRowSelection();
        },
        handleMultipleDelete: async (rows) => {
          await Promise.all(
            rows.map((row) =>
              dispatch({
                type: "delete",
                token: session.user.accessToken!,
                payload: { id: row._id },
              })
            )
          );
          toast.success("Tickets deleted successfully");
          table.resetRowSelection();
        },
      } as TicketsTableMeta<Ticket>,
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
            dispatch({
              type: "fetchAll",
              token: session.user.accessToken!,
            }),
            dispatch({
              type: "fetchStats",
              token: session.user.accessToken!,
            }),
          ]);

          if (response[0]?.status === 200 && response[1].status === 200) {
            setIsInitialLoad(false);
          } else {
            toast.error("Failed to fetch tickets");
            setTicketsState(initialTickets);
          }
        } catch (error) {
          // Handle errors from either request
          toast.error("Failed to fetch ticket data");
          console.error("Failed to fetch ticket data:", error);
          setTicketsState(initialTickets);
        }
      };

      fetchData();
    }
  }, [session?.user?.accessToken, initialTickets, setTicketsState, dispatch]);

  // Sync table data with tickets atom
  useEffect(() => {
    setData(isInitialLoad && tickets.length === 0 ? initialTickets : tickets);
  }, [tickets, initialTickets, setData, isInitialLoad]);

  return (
    <>
      <Filters table={table} />
      <Table
        table={table}
        variant="modern"
        classNames={{
          rowClassName: "last:border-0",
        }}
      />
      <TablePagination table={table} className="p-4" />
    </>
  );
}
