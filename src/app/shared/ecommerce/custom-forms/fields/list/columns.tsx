import { FieldType } from "@/data/productForms.types";
import { createColumnHelper, TableMeta } from "@tanstack/react-table";
import { Checkbox, Text } from "rizzui";
import TableRowActionGroup from "@core/components/table-utils/table-row-action-group";

export interface CustomTableMeta<T> extends TableMeta<T> {
  handleDeleteRow?: (row: T) => void;
  handleMultipleDelete?: (rows: T[]) => void;
  handleEditRow?: (row: T) => void;
}

const columnHelper = createColumnHelper<FieldType>();

export const fieldListColumns = [
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
  columnHelper.accessor("label", {
    id: "label",
    size: 300,
    header: "Field Label",
    enableSorting: false,
    cell: ({ row }) => (
      <Text className="text-gray-900 font-medium">{row.original.label}</Text>
    ),
  }),
  columnHelper.accessor("name", {
    id: "name",
    size: 200,
    header: "Field Name",
    cell: ({ getValue }) => <Text>{getValue()}</Text>,
  }),
  columnHelper.accessor("inputType", {
    id: "inputType",
    size: 150,
    header: "Input Type",
    cell: ({ getValue }) => <Text>{getValue()}</Text>,
  }),
  columnHelper.accessor("inputValidationPattern", {
    id: "validationPattern",
    size: 150,
    header: "Validation Pattern",
    cell: ({ getValue }) => <Text>{getValue() || "None"}</Text>,
  }),
  columnHelper.accessor("inputRequired", {
    id: "required",
    size: 100,
    header: "Required",
    cell: ({ getValue }) => <Text>{getValue() ? "Yes" : "No"}</Text>,
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
      const tableMeta = meta as CustomTableMeta<FieldType>;

      return (
        <TableRowActionGroup
          deletePopoverTitle={`Delete this Field`}
          deletePopoverDescription={`Are you sure you want to delete this #${row.original._id} Field?`}
          onDelete={() => tableMeta?.handleDeleteRow?.(row.original)}
          editUrl={() => {
            tableMeta?.handleEditRow?.(row.original);
          }}
        />
      );
    },
  }),
];
