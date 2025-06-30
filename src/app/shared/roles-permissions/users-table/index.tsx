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
import { CustomTableMeta } from "@core/types/index";
import { Session } from "next-auth";
import { useAtom, useSetAtom } from "jotai";
import { userActionsAtom, usersAtom } from "@/store/atoms/users.atom";
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
  const [users] = useAtom(usersAtom);
  const setUsers = useSetAtom(userActionsAtom);
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
          await setUsers({
            type: "delete",
            payload: {
              id: row._id,
            },
            token: session.user.accessToken!,
          });
          toast.success("User deleted successfully");
          table.resetRowSelection();
        },
        handleMultipleDelete: async (rows: UserTypes[]) => {
          await Promise.all(
            rows.map((row) =>
              setUsers({
                type: "delete",
                token: session.user.accessToken!,
                payload: { id: row._id },
              })
            )
          );
          await fetch("/api/revalidateTags?tags=users", {
            method: "GET",
          });
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

  // Fetch users on mount and when access token changes
  useEffect(() => {
    if (session?.user?.accessToken) {
      const fetchUsers = async () => {
        try {
          await setUsers({
            type: "fetchAll",
            token: session.user.accessToken!,
          });
        } catch (error) {
          toast.error("Failed to fetch users");
          console.error("Failed to fetch users : ", error);
        }
      };
      fetchUsers();
    }
  }, [session?.user?.accessToken, setUsers]);

  // Sync table data with users atom
  useEffect(() => {
    setData(users.length > 0 ? users : initialUsers);
  }, [users, initialUsers, setData]);

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
