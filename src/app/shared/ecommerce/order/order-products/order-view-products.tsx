/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Table, { HeaderCell } from "@core/components/legacy-table";
import { Title, Text, Button } from "rizzui";
import { toCurrency } from "@core/utils/to-currency";
import { OrderItemType, OrderType } from "@core/types";

import { useModal } from "@/app/shared/modal-views/use-modal";

function DetailsCell({ details }: { details: string }) {
  const { openModal, closeModal } = useModal();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        openModal({
          view: (
            <div className="m-0 p-0">
              <div className="relative border-b bg-primary dark:bg-inherit px-6 py-4 rounded-t-lg">
                <Title
                  as="h4"
                  className="!mb-0 !text-lg !font-semibold !text-white"
                >
                  Order Details
                </Title>
              </div>

              <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6">
                {details ? (
                  <div className="prose prose-sm max-w-none rounded-lg border bg-gray-50 p-4">
                    {details.split("\n").map((paragraph, i) => (
                      <p key={i} className="text-gray-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <Text className="mt-2">
                      No additional details available
                    </Text>
                  </div>
                )}
              </div>

              <div className="flex justify-end border-t px-6 py-3">
                <Button
                  variant="outline"
                  onClick={closeModal}
                  className="border-primary text-primary hover:bg-primary-light/20"
                >
                  Close
                </Button>
              </div>
            </div>
          ),
        })
      }
      className="mx-auto block"
    >
      View Details
    </Button>
  );
}

const columns = [
  {
    title: <HeaderCell title="Product" />,
    dataIndex: "product",
    key: "product",
    width: 250,
    render: (_: any, row: OrderItemType) => (
      <div className="flex items-center">
        <div className="relative aspect-square w-12 overflow-hidden rounded-lg">
          <Image
            alt={row.product.name}
            src={row.product.featuredImage}
            fill
            sizes="(max-width: 768px) 100vw"
            className="object-cover"
          />
        </div>
        <div className="ms-4">
          <Title as="h6" className="!text-sm font-medium">
            {row.product.name}
          </Title>
        </div>
      </div>
    ),
  },
  {
    title: <HeaderCell title="Word Count" align="center" />,
    dataIndex: "wordCount",
    key: "wordCount",
    width: 150,
    render: (wordCount: number) => (
      <Text className="text-center text-sm font-semibold">{wordCount}</Text>
    ),
  },
  {
    title: <HeaderCell title="Quantity" align="center" />,
    dataIndex: "quantity",
    key: "quantity",
    width: 150,
    render: (quantity: number) => (
      <Text className="text-center text-sm font-semibold">{quantity}</Text>
    ),
  },
  {
    title: <HeaderCell title="Details" align="center" />,
    dataIndex: "additionalInfo",
    key: "additionalInfo",
    width: 150,
    render: (additionalInfo: string) => (
      <DetailsCell details={additionalInfo} />
    ),
  },
  {
    title: <HeaderCell title="Total Price" align="right" />,
    dataIndex: "totalPrice",
    key: "totalPrice",
    width: 200,
    render: (totalPrice: number) => (
      <Text className="text-end text-sm">{toCurrency(totalPrice)}</Text>
    ),
  },
];

export default function OrderViewProducts({ order }: { order: OrderType }) {
  return (
    <Table
      data={order.products}
      // @ts-ignore
      columns={columns}
      className="text-sm"
      variant="minimal"
      rowKey={(record) => record.id}
      scroll={{ x: 800 }}
    />
  );
}
