import { FormType } from "@/data/productForms.types";
import { createColumnHelper } from "@tanstack/react-table";
import { Checkbox, Text } from "rizzui";
import { StatusSelect } from "@core/components/table-utils/status-select";
import TableRowActionGroup from "@core/components/table-utils/table-row-action-group";
import { CustomTableMeta } from "@core/types/index";

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

const columnHelper = createColumnHelper<FormType>();

export const formListColumns = [
  columnHelper.display({
    id: "select",
    size: 50,
    header: ({ table }) => (
      <Checkbox
        className="ps-3.5"
        aria-label="Select all rows"
        checked={table.getIsAllPageRowsSelected()}
        onChange={() => table.toggleAllPageRowsSelected()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="ps-3.5"
        aria-label="Select row"
        checked={row.getIsSelected()}
        onChange={() => row.toggleSelected()}
      />
    ),
  }),
  columnHelper.accessor("title", {
    id: "title",
    size: 300,
    header: "Form Title",
    enableSorting: false,
    cell: ({ row }) => (
      <Text className="text-gray-900 font-medium">{row.original.title}</Text>
    ),
  }),
  columnHelper.accessor("fields", {
    id: "fields",
    size: 200,
    header: "Fields",
    enableSorting: false,
    cell: ({ row }) => <Text>{row.original.fields.length} field(s)</Text>,
  }),
  columnHelper.accessor("status", {
    id: "status",
    size: 120,
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => {
      const form = row.original;
      return (
        <StatusSelect
          key={`status-${form._id}`}
          selectItem={form.status}
          options={statusOptions}
          endpoint={`/product/form/update-form?formId=${row.original._id}`}
          revalidatePath={[`/api/revalidateTags?tags=forms`]}
        />
      );
    },
  }),
  columnHelper.display({
    id: "action",
    size: 120,
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) => {
      const tableMeta = meta as CustomTableMeta<FormType>;

      return (
        <TableRowActionGroup
          deletePopoverTitle={`Delete this Form`}
          deletePopoverDescription={`Are you sure you want to delete this #${row.original._id} Form?`}
          onDelete={() => tableMeta?.handleDeleteRow?.(row.original)}
          editUrl={() => {
            tableMeta?.handleEditRow?.(row.original);
          }}
        />
      );
    },
  }),
];
