/* eslint-disable @typescript-eslint/no-explicit-any */
import EyeIcon from "@core/components/icons/eye";
import PencilIcon from "@core/components/icons/pencil";
import { ActionIcon, Flex, Tooltip } from "rizzui";
import Link from "next/link";
import cn from "@core/utils/class-names";
import DeletePopover from "../delete-popover";
import { usePermissions, } from "@/core/utils/permissions.utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { PermissionActions } from "@/config/permissions.config";

export default function TableRowActionGroup({
  onDelete,
  editUrl,
  viewUrl,
  deletePopoverTitle = "Delete the appointment",
  deletePopoverDescription = "Are you sure you want to delete this item?",
  className,
  entity = "",
}: {
  onDelete?: () => void;
  editUrl?: string | (() => void);
  viewUrl?: string;
  deletePopoverTitle?: string;
  deletePopoverDescription?: string;
  className?: string;
  entity?: any;
}) {
  const { hasPermission } = usePermissions();
  const { data: session } = useSession();
  const [permissions, setPermissions] = useState({
    canEdit: false,
    canView: false,
    canDelete: false,
  });

  const checkPermissions = useCallback(
    async (session: Session) => {
      const checks = [
        editUrl
          ? hasPermission({ session, entity, action: PermissionActions.UPDATE })
          : Promise.resolve(false),
        viewUrl
          ? hasPermission({ session, entity, action: PermissionActions.READ })
          : Promise.resolve(false),
        onDelete
          ? hasPermission({ session, entity, action: PermissionActions.DELETE })
          : Promise.resolve(false),
      ];

      const [canEdit, canView, canDelete] = await Promise.all(checks);

      // Only update state if permissions have changed
      setPermissions((prev) =>
        prev.canEdit !== canEdit ||
        prev.canView !== canView ||
        prev.canDelete !== canDelete
          ? { canEdit, canView, canDelete }
          : prev
      );
    },
    [entity, hasPermission, editUrl, viewUrl, onDelete]
  );

  useEffect(() => {
    if (session) {
      checkPermissions(session);
    }
  }, [session, checkPermissions]);

  const actionGroup = useMemo(
    () => (
      <Flex
        align="center"
        justify="end"
        gap="3"
        className={cn("pe-3", className)}
      >
        {editUrl && permissions.canEdit && (
          <Tooltip size="sm" content="Edit Item" placement="top" color="invert">
            {typeof editUrl === "string" ? (
              <Link href={editUrl}>
                <ActionIcon
                  as="span"
                  size="sm"
                  variant="outline"
                  aria-label="Edit Item"
                >
                  <PencilIcon className="size-4" />
                </ActionIcon>
              </Link>
            ) : (
              <ActionIcon
                as="span"
                size="sm"
                variant="outline"
                aria-label="Edit Item"
                onClick={editUrl}
              >
                <PencilIcon className="size-4" />
              </ActionIcon>
            )}
          </Tooltip>
        )}
        {viewUrl && permissions.canView && (
          <Tooltip size="sm" content="View Item" placement="top" color="invert">
            <Link href={viewUrl}>
              <ActionIcon
                as="span"
                size="sm"
                variant="outline"
                aria-label="View item"
              >
                <EyeIcon className="size-4" />
              </ActionIcon>
            </Link>
          </Tooltip>
        )}
        {onDelete && permissions.canDelete && (
          <DeletePopover
            title={deletePopoverTitle}
            description={deletePopoverDescription}
            onDelete={onDelete}
          />
        )}
      </Flex>
    ),
    [
      editUrl,
      viewUrl,
      onDelete,
      permissions,
      className,
      deletePopoverTitle,
      deletePopoverDescription,
    ]
  );

  return actionGroup;
}
