/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { Column } from "@tanstack/react-table";

// export function getColumnOptions<TData extends Record<string, any>>(column: Column<TData>) {
//   // const isColumnDraggable = column.columnDef.meta?.isColumnDraggable ?? true;
//   const isColumnDraggable = column.columnDef.meta?.isColumnDraggable ?? true;
//   const canResize = column.getCanResize();
//   const canPin = column.getCanPin();
//   const isPinned = column.getIsPinned();
//   const isLeftPinned = isPinned === "left" && column.getIsLastColumn("left");
//   const isRightPinned = isPinned === "right" && column.getIsFirstColumn("right");

//   return {
//     canPin,
//     isPinned,
//     canResize,
//     isLeftPinned,
//     isRightPinned,
//     isColumnDraggable,
//   };
// }

import { Column } from "@tanstack/react-table";
import { CustomColumnMeta } from "./table-types";

export function getColumnOptions<TData extends Record<string, any>>(
  column: Column<TData, unknown>
) {
  const isColumnDraggable = (column.columnDef.meta as CustomColumnMeta<TData, unknown>)?.isColumnDraggable ?? true;
  const canResize = column.getCanResize();
  const canPin = column.getCanPin();
  const isPinned = column.getIsPinned();
  const isLeftPinned = isPinned === "left" && column.getIsLastColumn("left");
  const isRightPinned = isPinned === "right" && column.getIsFirstColumn("right");

  return { canPin, isPinned, canResize, isLeftPinned, isRightPinned, isColumnDraggable };
}