"use client";

import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import { ticketsColumns } from "./columns";
import Filters from "./filters";
import { CustomTableMeta } from "@/app/shared/dashboard/recent-order";
import { Ticket } from "@/data/tickets.types";
import { Session } from "next-auth";
import { useAtom } from "jotai";
import { ticketsWithActionsAtom } from "@/store/atoms/tickets.atom";
import { useEffect } from "react";
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
  const [tickets, setTickets] = useAtom(ticketsWithActionsAtom);

  // Initialize table with tickets from atom or initialTickets
  const { table, setData } = useTanStackTable<Ticket>({
    tableData: tickets.tickets.length ? tickets.tickets : initialTickets,
    columnConfig: ticketsColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {
        handleDeleteRow: (row) => {
          setTickets({
            type: "delete",
            id: row._id!,
            accessToken: session.user.accessToken!,
          });
          toast.success("Ticket deleted successfully");
          table.resetRowSelection();
        },
        handleMultipleDelete: (rows) => {
          rows.forEach((row) =>
            setTickets({
              type: "delete",
              id: row._id!,
              accessToken: session.user.accessToken!,
            })
          );
          toast.success("Tickets deleted successfully");
          table.resetRowSelection();
        },
      } as TicketsTableMeta<Ticket>,
      enableColumnResizing: false,
    },
  });

  // Sync table data with users atom or initialUsers when they change
  useEffect(() => {
    setData(tickets.tickets.length ? tickets.tickets : initialTickets);
  }, [tickets.tickets, initialTickets, setData]);

  useEffect(() => {
    if (session?.user?.accessToken) {
      setTickets({ type: "fetch", accessToken: session.user.accessToken });
    }
  }, [session?.user?.accessToken, setTickets, tickets.tickets]);
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
