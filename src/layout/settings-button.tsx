'use client';
import dynamic from 'next/dynamic';
import CogSolidIcon from '@core/components/icons/cog-solid';
import { ActionIcon } from 'rizzui';
import cn from '@core/utils/class-names';
import DrawerHeader from '@/layout/drawer-header';
import { useDrawer } from '@/app/shared/drawer-views/use-drawer';
const SettingsDrawer = dynamic(() => import('@/layout/settings-drawer'), {
  ssr: false,
});

export default function SettingsButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { openDrawer, closeDrawer } = useDrawer();

  return (
    <ActionIcon
      aria-label="Settings"
      variant="text"
      className={cn(
        'relative h-[34px] w-[34px] shadow backdrop-blur-md dark:bg-gray-100 md:h-9 md:w-9',
        className
      )}
      onClick={() =>
        openDrawer({
          view: (
            <>
              <DrawerHeader onClose={closeDrawer} />
              <SettingsDrawer />
            </>
          ),
          placement: 'right',
          containerClassName: 'max-w-[420px]',
        })
      }
    >
      {children ? (
        children
      ) : (
        <CogSolidIcon
          strokeWidth={1.8}
          className="h-[22px] w-auto animate-spin-slow"
        />
      )}
    </ActionIcon>
  );
}
