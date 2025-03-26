"use client";
import { useState } from "react";
import { PiXBold } from "react-icons/pi";
import { SubmitHandler } from "react-hook-form";
import { Form } from "@core/ui/form";
import { Input, Button, ActionIcon, Title } from "rizzui";
import {
  createPermissionModule,
  CreatePermissionModuleInput,
} from "@/validators/create-permission-module.schema";
import { useModal } from "@/app/shared/modal-views/use-modal";
import { useApiCall } from "@/core/utils/api-config";
import toast from "react-hot-toast";

const CreatePermissionModule = () => {
  const { closeModal } = useModal();
  const { apiCall } = useApiCall();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  //
  const onSubmit: SubmitHandler<CreatePermissionModuleInput> = async (data) => {
    setLoading(true);
    const _response = await apiCall<{ message: string }>({
      url: "/permissionModule/create",
      method: "POST",
      data,
    });
    if (_response.status === 201) {
      toast.success(_response.data.message);
      closeModal();
      await fetch("/api/revalidateTags?tags=permissionModules", {
        method: "GET",
      });
      setReset({ name: "", value: "" });
    }
  };
  return (
    <Form<CreatePermissionModuleInput>
      resetValues={reset}
      onSubmit={onSubmit}
      validationSchema={createPermissionModule}
      className="grid grid-cols-1 gap-6 p-6 @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      {({
        register,
        formState: { errors },
      }) => {
        return (
          <>
            <div className="flex items-center justify-between">
              <Title as="h4" className="font-semibold">
                Add new permissions module
              </Title>
              <ActionIcon size="sm" variant="text" onClick={closeModal}>
                <PiXBold className="h-auto w-5" />
              </ActionIcon>
            </div>
            <Input
              label="Name"
              placeholder="Module name"
              {...register("name")}
              error={errors.name?.message}
            />
            <Input
              label="Value"
              placeholder="Module value"
              {...register("value")}
              error={errors.value?.message}
            />

            <div className="flex items-center justify-end gap-4">
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
                Add Module
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
};

export default CreatePermissionModule;
