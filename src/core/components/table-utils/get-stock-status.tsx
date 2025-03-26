import { Progressbar, Text } from "rizzui";

export function getStockStatus(status: number, maxStock: number = 999) {
  const percentage = Math.min((status / maxStock) * 100, 100);

  if (percentage === 0) {
    return (
      <>
        <Progressbar value={percentage} color="danger" className="h-1.5 w-24" />
        <Text className="pt-1.5 text-[13px] text-gray-500">Out of stock</Text>
      </>
    );
  } else if (percentage <= 20) {
    return (
      <>
        <Progressbar
          value={percentage}
          color="warning"
          className="h-1.5 w-24"
        />
        <Text className="pt-1.5 text-[13px] text-gray-500">
          {percentage.toFixed(0)}% low stock
        </Text>
      </>
    );
  } else {
    return (
      <>
        <Progressbar
          value={percentage}
          color="success"
          className="h-1.5 w-24"
        />
        <Text className="pt-1.5 text-[13px] text-gray-500">
          {percentage.toFixed(0)}% in stock
        </Text>
      </>
    );
  }
}
