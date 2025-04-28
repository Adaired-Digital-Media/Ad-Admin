"use client";

import { useState } from "react";
import { PiCheckBold, PiXBold } from "react-icons/pi";
import { Controller, SubmitHandler } from "react-hook-form";
import { useModal } from "@/app/shared/modal-views/use-modal";
import {
  ActionIcon,
  AdvancedCheckbox,
  Title,
  Button,
  CheckboxGroup,
} from "rizzui";
import { Form } from "@/core/ui/form";
import toast from "react-hot-toast";
import { PermissionModule, PermissionTypes } from "@/data/roles-permissions";
import { roleActionsAtom } from "@/store/atoms/roles.atom";
import { useSetAtom } from "jotai";
import { Session } from "next-auth";

interface Permission {
  value: number;
  label: string;
}

const permissions: Permission[] = [
  { value: 0, label: "Create" },
  { value: 1, label: "Read" },
  { value: 2, label: "Write" },
  { value: 3, label: "Delete" },
];

interface FormData {
  permissions: Record<string, number[]>;
}

export default function EditRole({
  id,
  modules,
  session,
  rolePermissions,
}: {
  id: string;
  rolePermissions: PermissionTypes[];
  modules: PermissionModule[];
  session: Session;
}) {
  const { closeModal } = useModal();
  const setRoles = useSetAtom(roleActionsAtom);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const accessToken = session?.user?.accessToken || "";
      // Transform flat permissions record to the schema's expected array format
      const transformedPermissions = Object.entries(data.permissions).map(
        ([module, permissions]) => ({
          module,
          permissions,
        })
      );

      const submitData = {
        permissions: transformedPermissions,
      };
      await setRoles({
        type: "update",
        payload: {
          id,
          ...submitData,
        },
        token: accessToken,
      });
      toast.success("Role updated successfully");
      closeModal();
    } catch (error) {
      toast.error("Failed to update role.");
      console.error("An Error Occured : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultValues: FormData = {
    permissions: modules.reduce((acc, module) => {
      const moduleKey = module.value.toLowerCase();
      const rolePermission = rolePermissions?.find(
        (p) => p.module.toLowerCase() === moduleKey
      );

      acc[moduleKey] = rolePermission ? rolePermission.permissions : [];
      return acc;
    }, {} as Record<string, number[]>),
  };

  return (
    <Form<FormData>
      onSubmit={onSubmit}
      useFormProps={{
        defaultValues,
      }}
      className="grid grid-cols-1 gap-6 p-6 @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      {({ control, formState: { errors } }) => {
        return (
          <>
            <div className="col-span-full flex items-center justify-between">
              <Title as="h4" className="font-semibold">
                Permissions
              </Title>
              <ActionIcon size="sm" variant="text" onClick={closeModal}>
                <PiXBold className="h-auto w-5" />
              </ActionIcon>
            </div>

            <div className="grid gap-4 divide-y divide-y-reverse divide-gray-200">
              <Title as="h5" className="mb-2 text-base font-semibold">
                Modules Access
              </Title>

              {modules?.map(({ name, value }) => {
                const parent = value.toLowerCase();
                return (
                  <div
                    key={value}
                    className="flex flex-col gap-3 pb-4 md:flex-row md:items-center md:justify-between"
                  >
                    <Title
                      as="h6"
                      className="font-medium text-gray-700 2xl:text-sm"
                    >
                      {name}
                    </Title>
                    <Controller
                      name={`permissions.${parent}`}
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <CheckboxGroup
                            values={
                              Array.isArray(value)
                                ? (value as number[]).map(String)
                                : []
                            }
                            setValues={(prevValues) => {
                              onChange(
                                Array.isArray(prevValues)
                                  ? prevValues.map(Number)
                                  : []
                              );
                            }}
                            className="grid grid-cols-3 gap-4 md:flex"
                          >
                            {permissions.map(({ value: permValue, label }) => (
                              <AdvancedCheckbox
                                key={permValue}
                                name={`${parent}.${permValue}`}
                                value={permValue.toString()}
                                inputClassName="[&:checked~span>.icon]:block"
                                contentClassName="flex items-center justify-center"
                              >
                                <PiCheckBold className="icon me-1 hidden h-[14px] w-[14px] md:h-4 md:w-4" />
                                <span className="font-medium">{label}</span>
                              </AdvancedCheckbox>
                            ))}
                          </CheckboxGroup>
                        );
                      }}
                    />
                  </div>
                );
              })}
              {errors && Object.keys(errors).length > 0 && (
                <p className="text-red-500 text-sm">
                  Please check permissions for errors.
                </p>
              )}
            </div>

            <div className="col-span-full flex items-center justify-end gap-4">
              <Button
                variant="outline"
                onClick={closeModal}
                className="w-full @xl:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full @xl:w-auto"
              >
                Save
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
}
