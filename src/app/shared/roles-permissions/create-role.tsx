"use client";

import { useCallback, useState } from "react";
import { PiXBold } from "react-icons/pi";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, ActionIcon, Title, Textarea } from "rizzui";
import {
  CreateRoleInput,
  createRoleSchema,
} from "@/validators/create-role.schema";
import { useModal } from "@/app/shared/modal-views/use-modal";
import { useSetAtom } from "jotai";
import { roleActionsAtom } from "@/store/atoms/roles.atom";
import toast from "react-hot-toast";
import { RoleTypes } from "@/data/roles-permissions";
import { Session } from "next-auth";

export default function CreateRole({
  role,
  session,
}: {
  role?: RoleTypes;
  session: Session;
}) {
  const { closeModal } = useModal();
  const setRoles = useSetAtom(roleActionsAtom);
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoleInput>({
    defaultValues: {
      name: role?.name ?? "",
      description: role?.description ?? "",
    },
    resolver: zodResolver(createRoleSchema),
  });

  const onSubmit: SubmitHandler<CreateRoleInput> = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const accessToken = session?.user?.accessToken || "";

        if (role) {
          console.log("data : ", data);
          await setRoles({
            type: "update",
            payload: {
              id: role._id || "",
              name: data.name,
              description: data.description ?? "",
            },
            token: accessToken,
          });
          toast.success("Role updated successfully");
        } else {
          await setRoles({
            type: "create",
            payload: {
              name: data.name,
              description: data.description ?? "",
            },
            token: accessToken,
          });
          toast.success("Role created successfully");
        }
        closeModal();
        reset({ name: "", description: "" });
      } catch (error) {
        toast.error("Failed to save role. ");
        console.error("Failed to save role : ", error);
      } finally {
        setLoading(false);
      }
    },
    [role, setRoles, closeModal, reset, session?.user?.accessToken]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 p-6 @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      <div className="flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          {role ? "Update Role" : "Add a New Role"}
        </Title>
        <ActionIcon size="sm" variant="text" onClick={closeModal}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>
      <Input
        label="Name"
        placeholder="Role name"
        {...register("name")}
        error={errors.name?.message}
        disabled={isSubmitting}
      />
      <Textarea
        label="Description"
        placeholder="Description"
        {...register("description")}
        error={errors.description?.message}
        disabled={isSubmitting}
      />
      <div className="flex items-center justify-end gap-4">
        <Button
          variant="outline"
          onClick={closeModal}
          className="w-full @xl:w-auto"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading || isSubmitting}
          className="w-full @xl:w-auto"
        >
          {role ? "Update Role" : "Create Role"}
        </Button>
      </div>
    </form>
  );
}
