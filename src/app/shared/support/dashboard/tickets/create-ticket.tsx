"use client";

import { useCallback, useState } from "react";
import { PiXBold } from "react-icons/pi";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Input,
  Button,
  ActionIcon,
  Title,
  Textarea,
  Text,
  Switch,
  Select,
} from "rizzui";
import { useModal } from "@/app/shared/modal-views/use-modal";
import { useAtom } from "jotai";
import toast from "react-hot-toast";
import { Session } from "next-auth";
import { ticketActionsAtom } from "@/store/atoms/tickets.atom";
import {
  CreateTicketInput,
  createTicketSchema,
} from "@/validators/create-tickets.schema";
import { useRouter } from "next/navigation";
import { FileInput } from "@/app/shared/file-upload";
import cn from "@/core/utils/class-names";
import { UserTypes } from "@/core/types";
import { RoleTypes } from "@/data/roles-permissions";
import { routes } from "@/config/routes";

export default function CreateTicket({
  session,
  users,
}: {
  session: Session;
  users: UserTypes[];
}) {
  const router = useRouter();
  const { closeModal } = useModal();
  const [, dispatch] = useAtom(ticketActionsAtom);
  const [isLoading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [includeAttachments, setIncludeAttachments] = useState(false);

  console.log("users : ", users);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketInput>({
    defaultValues: {
      subject: "",
      description: "",
      status: undefined,
      priority: undefined,
      assignedTo: "",
      customer: "",
      attachments: "",
    },
    resolver: zodResolver(createTicketSchema),
  });

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const onSubmit: SubmitHandler<CreateTicketInput> = useCallback(
    async (data) => {
      setLoading(true);

      try {
        const accessToken = session?.user?.accessToken || "";
        const newTicket = await dispatch({
          type: "create",
          token: accessToken,
          payload: {
            subject: data.subject,
            description: data.description,
            attachments: files.length > 0 && files,
            status: data.status,
            priority: data.priority,
            assignedTo: data.assignedTo,
            customer: data.customer,
          },
        });
        if (newTicket.success) {
          toast.success("Ticket Raised successfully");
          router.push(routes.support.inbox(newTicket.data.ticketId));
          closeModal();
        }
      } catch (error) {
        toast.error("Failed to raise ticket. ");
        console.error("Failed to raise ticket : ", error);
      } finally {
        setLoading(false);
      }
    },
    [closeModal, session?.user?.accessToken, dispatch, files, router]
  );
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 p-6 @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
      >
        <div className="flex items-center justify-between">
          <Title as="h4" className="font-semibold">
            Raise a ticket
          </Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal}>
            <PiXBold className="h-auto w-5" />
          </ActionIcon>
        </div>
        <Input
          label="Subject"
          placeholder="e.g. Issue related to order."
          {...register("subject")}
          error={errors.subject?.message}
          disabled={isSubmitting}
        />
        <Textarea
          label="Description"
          placeholder="e.g. What is the status of my order"
          {...register("description")}
          error={errors.description?.message}
          disabled={isSubmitting}
        />

        <div className={cn(`grid grid-cols-2 gap-3 @lg:gap-4 @2xl:gap-5`)}>
          <Controller
            name="status"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                dropdownClassName="!z-0"
                options={[
                  "Open",
                  "In Progress",
                  "Resolved",
                  "Closed",
                  "Reopened",
                ].map((status) => ({
                  value: status,
                  label: status,
                }))}
                value={value}
                onChange={onChange}
                label="Status"
                error={errors?.status?.message as string}
                getOptionValue={(option) => option.value}
              />
            )}
          />
          <Controller
            name="priority"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                dropdownClassName="!z-0"
                options={["Low", "Medium", "High", "Urgent"].map((status) => ({
                  value: status,
                  label: status,
                }))}
                value={value}
                onChange={onChange}
                label="Priority"
                error={errors?.priority?.message as string}
                getOptionValue={(option) => option.value}
              />
            )}
          />

          <Controller
            name="customer"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                dropdownClassName="!z-0"
                options={users
                  .filter((user) => user._id !== undefined)
                  .map((user) => ({
                    value: user._id as string,
                    label: user.name,
                  }))}
                value={value}
                onChange={onChange}
                label="Customer"
                error={errors?.customer?.message as string}
                getOptionValue={(option) => option.value}
                displayValue={(value) =>
                  users.find((user) => user._id === value)?.name || ""
                }
              />
            )}
          />

          <Controller
            name="assignedTo"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                dropdownClassName="!z-0"
                options={users
                  .filter(
                    (user) =>
                      (user.role &&
                        typeof user.role === "object" &&
                        (user.role as RoleTypes).name !== "customer") ||
                      user.isAdmin
                  )
                  .map((user) => ({
                    value: user._id as string,
                    label: user.name,
                  }))}
                value={value}
                onChange={onChange}
                label="Assigned To"
                error={errors?.assignedTo?.message as string}
                getOptionValue={(option) => option.value}
                displayValue={(value) =>
                  users.find((user) => user._id === value)?.name || ""
                }
              />
            )}
          />

          {/* <Controller
            name="assignedTo"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                dropdownClassName="!z-0"
                options={users
                  .filter(
                    (user) =>
                      typeof user.role === "object" &&
                      (user.role as RoleTypes).name === "customer" &&
                      user._id
                  )
                  .map((user) => ({
                    value: user._id as string,
                    label: user.name,
                  }))}
                value={value}
                onChange={onChange}
                label="Assigned To"
                error={errors?.assignedTo?.message as string}
                getOptionValue={(option) => option.value}
                displayValue={(value) =>
                  users.find((user) => user._id === value)?.name || ""
                }
              />
            )}
          /> */}
        </div>

        <Switch
          label="Include Attachments"
          checked={includeAttachments}
          labelClassName="text-sm font-medium text-gray-700 dark:text-gray-200"
          size="sm"
          color="primary"
          variant="flat"
          labelPlacement="right"
          onChange={() => setIncludeAttachments(!includeAttachments)}
        />

        {includeAttachments && (
          <div>
            <Text as="strong">Attachments :</Text>
            <FileInput
              className="mt-1 w-full"
              containerClassName="min-h-20"
              wrapperClassName=""
              label={""}
              iconClassName="!h-14 !w-14"
              onFilesSelected={handleFilesSelected}
              showBtns={false}
            />
          </div>
        )}
        <Text>
          <strong>Note:</strong> For orders related queries please mention{" "}
          <strong>Order No.</strong>
        </Text>
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
            Raise
          </Button>
        </div>
      </form>
    </>
  );
}
