"use client";

import { UserTypes } from "@/data/users-data";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { usersColumns } from "./columns";
import Table from "@core/components/table";
import TableFooter from "@core/components/table/footer";
import TablePagination from "@core/components/table/pagination";
import Filters from "./filters";
import { useApiCall } from "@/core/utils/api-config";
import toast from "react-hot-toast";
import { useModal } from "@/app/shared/modal-views/use-modal";
import CreateUser from "../create-user";
import { CustomTableMeta } from "../../dashboard/recent-order";

export interface UsersTableMeta<T> extends CustomTableMeta<T> {
  handleDeleteRow?: (row: T) => void;
  handleMultipleDelete?: (rows: T[]) => void;
  handleEditRow?: (row: T) => void;
}

export default function UsersTable({ users }: { users: UserTypes[] }) {
  const { apiCall } = useApiCall();
  const { openModal } = useModal();
  

  const { table, setData } = useTanStackTable<UserTypes>({
    tableData: users,
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
          setData((prev) => prev.filter((r) => r._id !== row._id));
          const response = await apiCall<{ message: string }>({
            url: `/user/delete?identifier=${row._id}`,
            method: "DELETE",
          });
          if (response.status === 200) toast.success(response.data.message);
          table.resetRowSelection();
        },
        handleMultipleDelete: async (rows: UserTypes[]) => {
          setData((prev) => prev.filter((r) => !rows.includes(r)));
          rows.forEach(async (r) => {
            const response = await apiCall<{ message: string }>({
              url: `/user/delete?identifier=${r._id}`,
              method: "DELETE",
            });
            if (response.status === 200) toast.success(response.data.message);
          });
          table.resetRowSelection();
        },
        handleEditRow: (row: UserTypes) => {
          openModal({
            view: <CreateUser user={row} />,
          });
          table.resetRowSelection();
        },
      } as UsersTableMeta<UserTypes>,
      enableColumnResizing: false,
    },
  });
  return (
    <div className="mt-14">
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
    </div>
  );
}
