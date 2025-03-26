/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderItemType } from "@core/types";
import { Row } from "@tanstack/react-table";
import Image from "next/image";
import { Flex, Text, Title } from "rizzui";

export function CustomExpandedComponent<TData extends Record<string, any>>(
  row: Row<TData>
) {
  const products = row?.original?.products;
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <Flex align="center" justify="center">
        <Text className="p-4 text-2xl text-gray-500">
          No products available for this order.
        </Text>
      </Flex>
    );
  }
  console.log(products);

  return (
    <div className="grid grid-cols-1 divide-y bg-gray-0 px-[26px] py-4 dark:bg-gray-50">
      {row.original.products.map((item: OrderItemType) => (
        <article
          key={item?.product?._id + item?.product?.name}
          className="flex items-center justify-between py-6 first-of-type:pt-2.5 last-of-type:pb-2.5"
        >
          <div className="flex items-start">
            <div className="relative me-4 aspect-square h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
              <Image
                fill
                className="object-cover p-2"
                src={item?.product?.featuredImage || ""}
                alt={item?.product?.name}
              />
            </div>
            <header>
              <Title as="h4" className="mb-0.5 text-sm font-medium">
                {item?.product?.name}
              </Title>
              <Text className="mb-1 text-gray-500">
                {item?.product?.category?.name}
              </Text>
              <Text className="text-xs text-gray-500">
                Price :{" "}
                <span className="font-bold">
                  ${item?.product?.pricePerUnit} / {item?.product?.minimumWords}{" "}
                  Words
                </span>
              </Text>
            </header>
          </div>
          <div className="flex w-full max-w-lg items-center justify-between gap-10">
            <div className="flex items-center justify-between gap-10">
              <Text className="text-gray-500">
                Quantity : <span className="font-bold">{item?.quantity}</span>
              </Text>
              <Text className="text-gray-500">
                Word Count : <span className="font-bold">{item?.quantity}</span>
              </Text>
            </div>
            <Text className="text-gray-500">
              Total Price :{" "}
              <span className="font-bold">${item?.totalPrice}</span>
            </Text>
          </div>
        </article>
      ))}
    </div>
  );
}
