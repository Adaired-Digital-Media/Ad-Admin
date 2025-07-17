"use client";
import { routes } from "@/config/routes";
import TableRowActionGroup from "@core/components/table-utils/table-row-action-group";
import TableAvatar from "@core/ui/avatar-card";
import DateCell from "@core/ui/date-cell";
import { createColumnHelper } from "@tanstack/react-table";
import { Text, Checkbox } from "rizzui";
import { StatusSelect } from "@/core/components/table-utils/status-select";
import { CustomTableMeta } from "@core/types/index";
import { BlogTypes, UserTypes } from "@/core/types";
import { PermissionEntities } from "@/config/permissions.config";

const statusOptions = [
  { label: "Publish", value: "publish" },
  { label: "Draft", value: "draft" },
  { label: "Scheduled", value: "scheduled" },
];

const columnHelper = createColumnHelper<BlogTypes>();

export const blogColumns = () => {
  const columns = [
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
    columnHelper.accessor("postTitle", {
      id: "postTitle",
      size: 200,
      header: "Title",
      cell: ({ row }) => (
        <Text className="font-medium text-gray-700">
          {row.original.postTitle}
        </Text>
      ),
    }),
    columnHelper.accessor("slug", {
      id: "slug",
      size: 150,
      header: "Slug",
      cell: ({ row }) => (
        <Text className="font-medium text-gray-700">{row.original.slug}</Text>
      ),
    }),
    columnHelper.accessor("category", {
      id: "category",
      size: 100,
      header: "Category",
      cell: ({ row }) => (
        <Text className="font-medium text-gray-700">
          {typeof row.original.category === "object" && row.original.category
            ? row.original.category.name
            : "N/A"}
        </Text>
      ),
    }),
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      size: 100,
      header: "Date Created",
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;
        return createdAt ? (
          <DateCell date={new Date(createdAt)} />
        ) : (
          <Text className="font-medium text-gray-700">N/A</Text>
        );
      },
      filterFn: (row, id, filterValue) => {
        const [start, end] = filterValue || [null, null];
        const dateValue = row.getValue(id);

        if (!dateValue) return false; // Skip if no date

        const date = new Date(dateValue as string | Date);

        if (!start && !end) return true; // No filter applied

        const startDate = start ? new Date(start) : null;
        const endDate = end ? new Date(end) : null;

        // Adjust endDate to include the full day
        if (endDate) {
          endDate.setHours(23, 59, 59, 999);
        }

        if (startDate && !endDate) return date >= startDate;
        if (!startDate && endDate) return date <= endDate;
        return date >= startDate! && date <= endDate!;
      },
    }),
    columnHelper.accessor("blogAuthor", {
      id: "blogAuthor",
      size: 120,
      header: "Author",
      enableSorting: false,
      cell: ({ row }) => {
        const author = row.original.blogAuthor;
        if (!author)
          return <Text className="font-medium text-gray-700">N/A</Text>;

        if (typeof author === "string") {
          return <Text className="font-medium text-gray-700">{author}</Text>;
        }

        return (
          <TableAvatar
            src={author.image || ""}
            name={author.name || "Unknown"}
            description={author.email?.toLowerCase() || ""}
          />
        );
      },
      filterFn: (row, id, filterValue: string) => {
        if (!filterValue) return true;

        const blogAuthor = row.getValue(id) as UserTypes | string | null;
        if (!blogAuthor) return false;

        const name =
          typeof blogAuthor === "string" ? blogAuthor : blogAuthor.name || "";
        return name.toLowerCase().includes(filterValue.toLowerCase());
      },
    }),
    columnHelper.accessor("status", {
      id: "status",
      size: 100,
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => {
        const form = row.original;
        // Filter status options based on scheduledPublishDate
        const filteredStatusOptions = form.scheduledPublishDate
          ? statusOptions
          : statusOptions.filter((option) => option.value !== "scheduled");
        return (
          <StatusSelect
            key={`status-${form._id}`}
            selectItem={form.status}
            options={filteredStatusOptions}
            endpoint={`/blog/update?id=${row.original._id}`}
            revalidatePath={[`/api/revalidateTags?tags=blog`]}
            disabled={filteredStatusOptions.length === 1}
          />
        );
      },
    }),
    columnHelper.display({
      id: "action",
      size: 100,
      cell: ({ row, table }) => {
        const meta = table.options.meta as CustomTableMeta<BlogTypes>;
        return (
          <TableRowActionGroup
            editUrl={routes.blog.edit(row.original._id!)}
            deletePopoverTitle={`Delete the order`}
            deletePopoverDescription={`Are you sure you want to delete this #${row.original._id} order?`}
            onDelete={() => meta?.handleDeleteRow?.(row.original)}
            entity={PermissionEntities.BLOGS}
          />
        );
      },
    }),
  ];

  return columns;
};
