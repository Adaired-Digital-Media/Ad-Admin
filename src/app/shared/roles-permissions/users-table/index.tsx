"use client";

import { UserTypes } from "@/data/users-data";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { usersColumns } from "./columns";
import Table from "@core/components/table";
import TableFooter from "@core/components/table/footer";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import toast from "react-hot-toast";
import { useModal } from "@/app/shared/modal-views/use-modal";
import CreateUser from "../create-user";
import { CustomTableMeta } from "../../dashboard/recent-order";
import { Session } from "next-auth";
import { useAtom } from "jotai";
import { usersWithActionsAtom } from "@/store/atoms/users.atom";
import { useEffect } from "react";

export interface UsersTableMeta<T> extends CustomTableMeta<T> {
  handleDeleteRow?: (row: T) => void;
  handleMultipleDelete?: (rows: T[]) => void;
  handleEditRow?: (row: T) => void;
}

export default function UsersTable({
  users: initialUsers,
  session,
}: {
  users: UserTypes[];
  session: Session;
}) {
  const [users, setUsers] = useAtom(usersWithActionsAtom);
  const { openModal } = useModal();

  // Initialize table with users from atom or initialUsers
  const { table, setData } = useTanStackTable<UserTypes>({
    tableData: users.length ? users : initialUsers,
    columnConfig: usersColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {
        handleDeleteRow: async (row: UserTypes) => {
          setUsers({
            type: "delete",
            id: row._id!,
            accessToken: session.user.accessToken!,
          });
          toast.success("User deleted successfully");
          table.resetRowSelection();
        },
        handleMultipleDelete: async (rows: UserTypes[]) => {
          rows.forEach((row) =>
            setUsers({
              type: "delete",
              id: row._id!,
              accessToken: session.user.accessToken!,
            })
          );
          toast.success("Users deleted successfully");
          table.resetRowSelection();
        },
        handleEditRow: (row: UserTypes) => {
          openModal({
            view: <CreateUser user={row} session={session} />,
          });
          table.resetRowSelection();
        },
      } as UsersTableMeta<UserTypes>,
      enableColumnResizing: false,
    },
  });

  // Sync table data with users atom or initialUsers when they change
  useEffect(() => {
    setData(users.length ? users : initialUsers);
  }, [users, initialUsers, setData]);

  useEffect(() => {
    if (session?.user?.accessToken) {
      setUsers({ type: "fetch", accessToken: session.user.accessToken });
    }
  }, [session?.user?.accessToken, setUsers, users]);

  return (
    <div className="mt-14">
      <Filters table={table} session={session} />
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
    </div>
  );
}
