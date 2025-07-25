/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { PiArrowLineUpBold } from 'react-icons/pi';
import { Button } from 'rizzui';
import cn from '@core/utils/class-names';
import { exportToCSV } from '@core/utils/export-to-csv';

type ExportButtonProps = {
  data: any[];
  header: string;
  fileName: string;
  className?: string;
};

export default function ExportButton({
  data,
  header,
  fileName,
  className,
}: ExportButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={() => exportToCSV(data, header, fileName)}
      className={cn('w-full @lg:w-auto', className)}
    >
      <PiArrowLineUpBold className="me-1.5 h-[17px] w-[17px]" />
      Export
    </Button>
  );
}
