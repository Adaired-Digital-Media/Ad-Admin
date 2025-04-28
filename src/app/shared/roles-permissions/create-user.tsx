"use client";

import { useCallback, useState } from "react";
import { PiXBold } from "react-icons/pi";
import { Controller, SubmitHandler } from "react-hook-form";
import { Input, Button, ActionIcon, Title, Select, Password, cn } from "rizzui";
import {
  CreateUserInput,
  createUserSchema,
} from "@/validators/create-user.schema";
import { useModal } from "@/app/shared/modal-views/use-modal";
import PhoneNumber from "@/core/ui/phone-input";
import UploadZone from "@/core/ui/file-upload/upload-zone";
import { UserTypes } from "@/data/users-data";
import toast from "react-hot-toast";
import { Form } from "@/core/ui/form";
import { useAtom, useSetAtom } from "jotai";
import { userActionsAtom } from "@/store/atoms/users.atom";
import { Session } from "next-auth";
import { rolesAtom } from "@/store/atoms/roles.atom";

const statuses = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export default function CreateUser({
  user,
  className,
  session,
}: {
  user?: UserTypes;
  session?: Session;
  className?: string;
}) {
  const { closeModal } = useModal();
  const setUsers = useSetAtom(userActionsAtom);
  const [roles] = useAtom(rolesAtom);
  const [isLoading, setLoading] = useState(false);

  const defaultValues = {
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
  };

  const onSubmit: SubmitHandler<CreateUserInput> = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const accessToken = session?.user?.accessToken || "";

        if (user) {
          await setUsers({
            type: "update",
            payload: {
              id: user._id || "",
              image: data.image,
              name: data.name,
              email: data.email,
              role: data.role,
              status: data.status,
              contact: data.contact,
            },
            token: accessToken,
          });
          toast.success("User updated successfully");
        } else {
          await setUsers({
            type: "create",
            payload: {
              
              image: data.image,
              name: data.name,
              email: data.email,
              role: data.role,
              status: data.status,
              contact: data.contact,
              password: data.password,
            },
            token: accessToken,
          });
          toast.success("User created successfully");
        }
        closeModal();
      } catch (error) {
        toast.error("Failed to save user.");
        console.error("Failed to save user:", error);
      } finally {
        setLoading(false);
      }
    },
    [user, setUsers, closeModal, session?.user?.accessToken]
  );

  return (
    <Form<CreateUserInput>
      onSubmit={onSubmit}
      validationSchema={createUserSchema}
      useFormProps={{
        defaultValues,
      }}
      className={cn(
        "grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900",
        className
      )}
    >
      {({
        register,
        watch,
        setValue,
        getValues,
        control,
        formState: { errors },
      }) => {
        return (
          <>
            <div className="col-span-full flex items-center justify-between">
              <Title as="h4" className="font-semibold">
                {user ? "Update user" : "Add new user"}
              </Title>
              <ActionIcon size="sm" variant="text" onClick={closeModal}>
                <PiXBold className="h-auto w-5" />
              </ActionIcon>
            </div>

            <UploadZone
              name="image"
              register={register}
              watch={watch}
              setValue={setValue}
              className="col-span-full"
              image={getValues("image")}
              error={errors.image?.message}
            />

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

            {/* <Controller
              name="role"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <Select
                  options={roles.map((role) => ({
                    value: role._id,
                    label: role.name,
                  }))}
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
            /> */}
            <Controller
              name="role"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <Select
                  options={roles.map((role) => ({
                    value: role._id || role.name,
                    label: role.name,
                  }))}
                  value={value}
                  onChange={onChange}
                  name={name}
                  label="Role"
                  error={errors.role?.message} // Corrected to "role"
                  getOptionValue={(option) => option.value}
                  displayValue={(selected: string) =>
                    roles.find((r) => r._id === selected)?.name ?? selected
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
                    statuses.find((option) => option.value === selected)
                      ?.label ?? ""
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
          </>
        );
      }}
    </Form>
  );
}
