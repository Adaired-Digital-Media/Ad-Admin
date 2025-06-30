/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { Fragment, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Title, Collapse } from "rizzui";
import cn from "@core/utils/class-names";
import { PiCaretDownBold } from "react-icons/pi";
import { menuItems } from "@/layout/dashboard/menu-items";
import StatusBadge from "@core/components/get-status-badge";
import { useAtom } from "jotai";
import { ticketActionsAtom, ticketStatsAtom } from "@/store/atoms/tickets.atom";
import { usePermissions } from "@/core/utils/permissions.utils";
import { routes } from "@/config/routes";
import { useSession } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";

export function SidebarMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [ticketStats] = useAtom(ticketStatsAtom);
  const [, dispatch] = useAtom(ticketActionsAtom);
  const { hasPermission } = usePermissions();

  useEffect(() => {
    if (session?.user?.accessToken) {
      try {
        const fetchTicketStats = async () => {
          await dispatch({
            type: "fetchStats",
            token: session?.user?.accessToken ?? "",
          });
        };
        fetchTicketStats();
      } catch (error) {
        console.error("Error fetching ticket stats:", error);
      }
    }
  }, [session?.user?.accessToken, dispatch]);

  const updatedMenuItems = menuItems.map((item) =>
    item.name === "Support"
      ? {
          ...item,
          badge:
            ticketStats?.stats?.open > 0
              ? ticketStats?.stats?.open.toString()
              : "",
        }
      : item
  );

  const handleMenuClick = useCallback(
    async (
      entity: string | undefined,
      action: string | undefined,
      href: string
    ) => {
      if (!href) {
        console.warn(`Navigation aborted: href is undefined`);
        return;
      }
      if (!entity || !action || !session) {
        router.push(href);
        return;
      }

      const hasAccess = await hasPermission({
        session,
        entity: entity as any,
        action: action as any,
      });

      if (hasAccess) {
        router.push(href);
      } else {
        router.push(routes.root.unauthorized);
      }
    },
    [session, hasPermission, router]
  );

  return (
    <div className="mt-4 pb-3 3xl:mt-6">
      {updatedMenuItems.map((item, index) => {
        if (!item.name) {
          console.warn(`Menu item at index ${index} has undefined name`);
          return null;
        }

        const isActive =
          item.href && item.href !== "#" ? pathname === item.href : false;
        const pathnameExistInDropdowns = item.dropdownItems
          ? item.dropdownItems.filter(
              (dropdownItem) =>
                typeof dropdownItem.href === "string" &&
                dropdownItem.href === pathname
            )
          : [];
        const isDropdownOpen = pathnameExistInDropdowns.length > 0;

        return (
          <Fragment key={`${item.name}-${index}`}>
            {item.href ? (
              <>
                {item.dropdownItems ? (
                  <Collapse
                    defaultOpen={isDropdownOpen}
                    header={({ open, toggle }) => (
                      <div
                        onClick={toggle}
                        className={cn(
                          "group relative mx-3 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 font-medium lg:my-1 2xl:mx-5 2xl:my-2",
                          isDropdownOpen
                            ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
                            : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-700/90 dark:hover:text-gray-700"
                        )}
                      >
                        <span className="flex items-center">
                          {item.icon && (
                            <span
                              className={cn(
                                "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
                                isDropdownOpen
                                  ? "text-primary"
                                  : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700"
                              )}
                            >
                              {item.icon}
                            </span>
                          )}
                          {item.name}
                        </span>
                        <PiCaretDownBold
                          strokeWidth={3}
                          className={cn(
                            "h-3.5 w-3.5 -rotate-90 text-gray-500 transition-transform duration-200 rtl:rotate-90",
                            open && "rotate-0 rtl:rotate-0"
                          )}
                        />
                      </div>
                    )}
                  >
                    {item.dropdownItems.map((dropdownItem, subIndex) => {
                      if (!dropdownItem.name) {
                        console.warn(
                          `Dropdown item at index ${subIndex} for ${item.name} has undefined name`
                        );
                        return null;
                      }
                      if (!dropdownItem.href) {
                        console.warn(
                          `Dropdown item "${dropdownItem.name}" for ${item.name} has undefined href`
                        );
                        return null;
                      }

                      const isChildActive = pathname === dropdownItem.href;

                      return (
                        <Link
                          href={dropdownItem.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleMenuClick(
                              dropdownItem.entity,
                              dropdownItem.action
                                ? dropdownItem.action.toString()
                                : undefined,
                              dropdownItem.href
                            );
                          }}
                          key={`${dropdownItem.name}-${subIndex}`}
                          className={cn(
                            "mx-3.5 mb-0.5 flex items-center justify-between rounded-md px-3.5 py-2 font-medium capitalize last-of-type:mb-1 lg:last-of-type:mb-2 2xl:mx-5",
                            isChildActive
                              ? "text-primary"
                              : "text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
                          )}
                        >
                          <div className="flex items-center truncate">
                            <span
                              className={cn(
                                "me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200",
                                isChildActive
                                  ? "bg-primary ring-[1px] ring-primary"
                                  : "opacity-40"
                              )}
                            />
                            <span className="truncate">
                              {dropdownItem.name}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </Collapse>
                ) : (
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!item.href) {
                        console.warn(
                          `Menu item "${item.name}" has undefined href`
                        );
                        return;
                      }
                      handleMenuClick(
                        item.entity,
                        item.action ? item.action.toString() : undefined,
                        item.href
                      );
                    }}
                    className={cn(
                      "group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2",
                      isActive
                        ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
                        : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-700/90"
                    )}
                  >
                    <div className="flex items-center truncate">
                      {item.icon && (
                        <span
                          className={cn(
                            "me-2 inline-flex size-5 items-center justify-center rounded-md [&>svg]:size-5",
                            isActive
                              ? "text-primary"
                              : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700"
                          )}
                        >
                          {item.icon}
                        </span>
                      )}
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge ? <StatusBadge status={item.badge} /> : null}
                  </Link>
                )}
              </>
            ) : (
              <Title
                as="h6"
                className={cn(
                  "mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest text-gray-500 2xl:px-8",
                  index !== 0 && "mt-6 3xl:mt-7"
                )}
              >
                {item.name}
              </Title>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
