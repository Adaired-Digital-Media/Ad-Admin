/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderType } from "@/core/types";
import { Title, Text } from "rizzui";
import Table from "@core/components/legacy-table";

const columns = [
  {
    title: "#",
    key: "index",
    width: 50,
    render: (_: any, __: any, index: number) => (
      <Text className="text-sm">{index + 1}</Text>
    ),
  },
  {
    title: "Item",
    dataIndex: "product",
    key: "product",
    width: 250,
    render: (product: { name: string; description: string }) => (
      <>
        <Title as="h6" className="mb-0.5 text-sm font-medium">
          {product.name}
        </Title>
        {/* <Text
          as="p"
          className="max-w-[250px] overflow-hidden truncate text-sm text-gray-500"
        >
          {product.description}
        </Text> */}
      </>
    ),
  },
  {
    title: "Unit Price",
    dataIndex: "product",
    key: "unitPrice",
    width: 200,
    render: (product: { pricePerUnit: number; minimumWords: string }) => (
      <Text className="font-medium">
        ${product.pricePerUnit} / {product.minimumWords} words
      </Text>
    ),
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    width: 200,
    render: (value: number) => <Text className="text-sm">{value}</Text>,
  },
  {
    title: "Word Count",
    dataIndex: "wordCount",
    key: "wordCount",
    width: 200,
    render: (value: number) => <Text className="text-sm">{value}</Text>,
  },
  {
    title: "Total Price",
    dataIndex: "totalPrice",
    key: "total",
    width: 200,
    render: (value: number) => <Text className="font-medium">${value}</Text>,
  },
];

export function InvoiceDetailsListTable({ order }: { order: OrderType }) {
  const orderItems = order?.products;
  return (
    <Table
      data={orderItems}
      columns={columns}
      variant="minimal"
      rowKey={(record: any) => record.id}
      scroll={{ x: 660 }}
      className="mb-11"
    />
  );
}


export const getStatusColor = (
  status: "Unpaid" | "Paid" | "Overdue" | "Cancelled"
) => {
  switch (status) {
    case "Paid":
      return "success";
    case "Unpaid":
      return "warning";
    case "Overdue":
      return "secondary";
    case "Cancelled":
      return "danger";
    default:
      return "info";
  }
};
