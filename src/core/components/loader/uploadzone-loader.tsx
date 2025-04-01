import cn from '../../utils/class-names';
import { Skeleton } from '../../ui/skeleton';

interface SelectLoaderProps {
  className?: string;
}

export default function UploadLoader({ className }: SelectLoaderProps) {
  return (
    <div className={cn(className)}>
      <Skeleton className="h-40 w-full rounded" />
    </div>
  );
}
