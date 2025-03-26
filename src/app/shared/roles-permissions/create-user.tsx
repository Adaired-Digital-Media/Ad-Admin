"use client";

import { useState } from "react";
import { PiXBold } from "react-icons/pi";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Input, Button, ActionIcon, Title, Select, Password, cn } from "rizzui";
import {
  CreateUserInput,
  createUserSchema,
} from "@/validators/create-user.schema";
import { useModal } from "@/app/shared/modal-views/use-modal";
import PhoneNumber from "@/core/ui/phone-input";
import UploadZone from "@/core/ui/file-upload/upload-zone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiCall } from "@/core/utils/api-config";
import { UserTypes } from "@/data/users-data";
import toast from "react-hot-toast";

const statuses = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const roles = [
  { value: "67c5ad44cc94a330bf8112f3", label: "Admin" },
  { value: "67c5ad44cc94a330bf8112f3", label: "Manager" },
  { value: "67c5ad44cc94a330bf8112f3", label: "User" },
];

export default function CreateUser({
  user,
  className,
}: {
  user?: UserTypes;
  className?: string;
}) {
  const { apiCall } = useApiCall();
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);

  const methods = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      image: user?.image ?? "",
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: user?.password ?? "",
      contact: user?.contact ?? "",
      role:
        typeof user?.role === "string"
          ? user.role
          : typeof user?.role !== "string"
          ? user?.role?._id
          : "",
      status: user?.status ?? "",
    },
  });

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<CreateUserInput> = async (data) => {
    try {
      setLoading(true);
      const response = await apiCall<{ message: string; data: UserTypes }>({
        url: "/auth/register",
        method: "POST",
        data,
      });
      if (response.status === 201) toast.success(response.data.message);
      await fetch("/api/revalidateTags?tags=users", {
        method: "GET",
      });
      console.log("Data : ", data);
      setLoading(false);
      closeModal();
      reset();
    } catch (error) {
      console.error("An error occurred -> ", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900",
          className
        )}
      >
        <div className="col-span-full flex items-center justify-between">
          <Title as="h4" className="font-semibold">
            {user ? "Update user" : "Add new user"}
          </Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal}>
            <PiXBold className="h-auto w-5" />
          </ActionIcon>
        </div>

        <UploadZone name="image" className="col-span-full" />

        <Input
          label="Full Name"
          type="text"
          placeholder="Enter user's full name"
          {...register("name")}
          error={errors.name?.message}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter user's Email Address"
          {...register("email")}
          error={errors.email?.message}
        />

        <Password
          label="Password"
          {...register("password")}
          placeholder="********"
          error={errors.password?.message}
        />

        <Controller
          name="contact"
          control={control}
          render={({ field }) => (
            <PhoneNumber
              {...field}
              label="Phone Number"
              country="us"
              preferredCountries={["us"]}
              onChange={(value) => field.onChange(value)}
              error={errors.contact?.message}
              inputClassName="!border-2"
            />
          )}
        />

        <Controller
          name="role"
          control={control}
          render={({ field: { name, onChange, value } }) => (
            <Select
              options={roles}
              value={value}
              onChange={onChange}
              name={name}
              label="Role"
              error={errors?.status?.message}
              getOptionValue={(option) => option.value}
              displayValue={(selected: string) =>
                roles.find((option) => option.value === selected)?.label ??
                selected
              }
              dropdownClassName="!z-[1]"
              placeholder="Select a role"
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field: { name, onChange, value } }) => (
            <Select
              options={statuses}
              value={value}
              onChange={onChange}
              name={name}
              label="Status"
              error={errors?.status?.message}
              getOptionValue={(option) => option.value}
              displayValue={(selected: string) =>
                statuses.find((option) => option.value === selected)?.label ??
                ""
              }
              dropdownClassName="!z-[1] h-auto"
              placeholder="Select status"
            />
          )}
        />

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
            {user ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
