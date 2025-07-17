"use client";

import { useAtom } from "jotai";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import {
  Title,
  Text,
  Badge,
  Button,
  Avatar,
  Empty,
  Select,
  Switch,
  SelectOption,
} from "rizzui";
import cn from "@core/utils/class-names";
import { SubmitHandler, Controller } from "react-hook-form";
import { Form } from "@core/ui/form";
import MessageBody from "@/app/shared/support/inbox/message-body";
import SimpleBar from "@core/ui/simplebar";
import { useElementSize } from "@core/hooks/use-element-size";
import { useMedia } from "@core/hooks/use-media";
import dynamic from "next/dynamic";
import { ticketActionsAtom } from "@/store/atoms/tickets.atom";
import { Ticket, TicketPriority, TicketStatus } from "@/data/tickets.types";
import { PiCaretDownBold } from "react-icons/pi";
import { FileInput } from "../../file-upload";
import { Session } from "next-auth";
import toast from "react-hot-toast";
import { LuReply } from "react-icons/lu";
import { AxiosError } from "axios";

const QuillEditor = dynamic(() => import("@core/ui/quill-editor"), {
  ssr: false,
});

const FormSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

type FormValues = {
  message: string;
};

const defaultValues = {
  message: "",
};

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "in progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
  { value: "reopened", label: "Reopened" },
];

export const supportTypes = {
  Chat: "Chat",
  Email: "Email",
} as const;

const supportOptionTypes = [
  {
    value: supportTypes.Chat,
    label: supportTypes.Chat,
  },
  {
    value: supportTypes.Email,
    label: supportTypes.Email,
  },
];

export default function MessageDetails({
  selectedTicket,
  className,
  session,
}: {
  selectedTicket: Ticket;
  className?: string;
  session: Session;
}) {
  const [, dispatch] = useAtom(ticketActionsAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [ref, { width }] = useElementSize();
  const isWide = useMedia("(min-width: 1280px) and (max-width: 1440px)", false);
  const [priority, setPriority] = useState(selectedTicket.priority || "Medium");
  const [status, setStatus] = useState(selectedTicket.status);
  const [includeAttachments, setIncludeAttachments] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket]);

  const formWidth = () => (isWide ? width - 64 : width - 44);
  // Function to dispatch ticket update
  const updateTicket = async (payload: Partial<Ticket>) => {
    if (!selectedTicket || !session?.user?.accessToken) return;

    try {
      await dispatch({
        type: "update",
        token: session.user.accessToken,
        payload: {
          id: selectedTicket._id,
          ...payload,
        },
      });
      toast.success("Ticket updated successfully");
    } catch (error) {
      toast.error("Failed to update ticket");
      console.error("Error:", error);
    }
  };

  // Handle status change
  const handleStatusChange = (newStatus: SelectOption) => {
    setStatus(newStatus.value as TicketStatus);
    updateTicket({ status: newStatus.value as TicketStatus });
  };

  // Handle priority change
  const handlePriorityChange = (newPriority: SelectOption) => {
    setPriority(newPriority.value as TicketPriority);
    updateTicket({ priority: newPriority.value as TicketPriority });
  };



  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!selectedTicket || !session?.user?.accessToken) return;

    setIsSubmitting(true);
    try {
      await dispatch({
        type: "update",
        token: session.user.accessToken,
        payload: {
          id: selectedTicket._id,
          message: data.message,
          attachments: files,
        },
      });

      toast.success("Reply sent successfully");
      setFiles([]);
      setIncludeAttachments(false);
      scrollToBottom();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(axiosError.response?.data?.message || axiosError.message);
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const getBadgeColor = (status: TicketStatus) => {
    switch (status) {
      case "open":
        return "success";
      case "in progress":
        return "warning";
      case "resolved":
        return "success";
      case "closed":
        return "danger";
      case "reopened":
        return "secondary";
      default:
        return "primary";
    }
  };

  if (!selectedTicket) {
    return (
      <div className={cn("flex h-full items-center justify-center", className)}>
        <Empty text="No ticket selected" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative pt-6 rounded-lg border border-muted px-4 py-7 xl:px-5 xl:py-5 2xl:pb-7 2xl:pt-6",
        className
      )}
    >
      <div>
        <header className="flex justify-between gap-4 border-b border-muted pb-5 3xl:flex-row 3xl:items-center">
          <div className="flex flex-col items-start gap-3 xs:flex-row xs:items-center xs:gap-6 lg:justify-normal">
            <Title as="h4" className="font-semibold">
              {selectedTicket.subject}
            </Title>
            <Badge
              variant="outline"
              color={getBadgeColor(selectedTicket.status)}
              size="sm"
            >
              {selectedTicket.status}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
            <Select
              variant="text"
              value={status}
              options={statusOptions}
              onChange={handleStatusChange}
              placeholder="Select Status"
              dropdownClassName="!w-48 p-2 gap-1 grid"
              getOptionDisplayValue={(option) =>
                renderStatusOptionDisplayValue(option.value as string)
              }
              displayValue={(selected: string) =>
                renderStatusOptionDisplayValue(selected)
              }
              suffix={<PiCaretDownBold className="h-3 w-3" />}
              className={"w-auto"}
            />
            <Select
              variant="text"
              value={priority}
              onChange={handlePriorityChange}
              options={priorityOptions}
              placeholder="Set Priority"
              dropdownClassName="!w-32 p-2 gap-1 grid"
              getOptionDisplayValue={(option) =>
                renderPriorityOptionDisplayValue(option.value as string)
              }
              displayValue={(selected: string) =>
                renderPriorityOptionDisplayValue(selected)
              }
              suffix={<PiCaretDownBold className="h-3 w-3" />}
              className={"w-auto"}
            />
          </div>
        </header>

        <div className="[&_.simplebar-content]:grid [&_.simplebar-content]:gap-8 [&_.simplebar-content]:py-5">
          <SimpleBar className="@3xl:max-h-[calc(100dvh-34rem)] @4xl:max-h-[calc(100dvh-32rem)] @7xl:max-h-[calc(100dvh-31rem)]">
            <MessageBody
              message={{
                ...selectedTicket.messages[0],
                sender: selectedTicket.createdBy,
                message: selectedTicket.description,
              }}
            />

            {selectedTicket.messages.slice(1).map((message) => (
              <MessageBody key={message._id.toString()} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </SimpleBar>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-[32px_1fr] items-start gap-3 rounded-b-lg bg-white @3xl:pt-4 dark:bg-transparent lg:gap-4 lg:pl-0 dark:lg:pt-0 xl:grid-cols-[48px_1fr]"
        >
          <Avatar
            name={session.user.name || "You"}
            src={session.user.image || ""}
            className="!h-8 !w-8 bg-[#70C5E0] font-medium text-white xl:!h-12 xl:!w-12"
          />
          <div
            className="relative rounded-lg border border-muted bg-gray-50 p-4 2xl:p-5"
            style={{ maxWidth: formWidth() }}
          >
            <Form<FormValues>
              onSubmit={onSubmit}
              validationSchema={FormSchema}
              useFormProps={{
                defaultValues: defaultValues,
              }}
            >
              {({ control, formState: { errors } }) => {
                return (
                  <>
                    <div className="relative mb-2.5 flex items-center justify-between">
                      <Select
                        size="sm"
                        variant="outline"
                        value={supportTypes.Chat}
                        options={supportOptionTypes}
                        // onChange={}
                        getOptionValue={(option) => option.value}
                        displayValue={(selected: string) => selected}
                        suffix={<PiCaretDownBold className="ml-1 h-3 w-3" />}
                        placement="bottom-start"
                        dropdownClassName="p-2 gap-1 grid !w-20 !z-0"
                        selectClassName="bg-gray-0 dark:bg-gray-50"
                        disabled
                        className={"w-auto"}
                      />
                      <Button
                        type="submit"
                        className="dark:bg-gray-200 dark:text-white"
                        isLoading={isSubmitting}
                      >
                        Send
                      </Button>
                    </div>
                    {!supportTypes.Email && (
                      <div className="mb-2.5 flex items-center gap-2">
                        <LuReply />
                        <span className="rounded border border-muted px-1.5 py-1 lowercase">
                          User@mail.com
                        </span>
                      </div>
                    )}
                    <Controller
                      control={control}
                      name="message"
                      render={({ field: { onChange, value } }) => (
                        <QuillEditor
                          value={value}
                          onChange={onChange}
                          className="rounded-md bg-gray-0 dark:bg-gray-50 [&>.ql-container_.ql-editor]:min-h-[100px]"
                          placeholder="Type your reply here..."
                        />
                      )}
                    />

                    {errors.message && (
                      <Text className="text-red-500">Message is required</Text>
                    )}

                    <Switch
                      label="Include Attachments"
                      checked={includeAttachments}
                      className="mt-2"
                      labelClassName="text-sm font-medium text-gray-700 dark:text-gray-200"
                      size="sm"
                      color="primary"
                      variant="flat"
                      labelPlacement="right"
                      onChange={() =>
                        setIncludeAttachments(!includeAttachments)
                      }
                    />

                    {includeAttachments && (
                      <div className="mt-2">
                        <Text as="strong">Attachments :</Text>
                        <FileInput
                          className="mt-1 w-1/2"
                          containerClassName="min-h-28"
                          wrapperClassName=""
                          label={""}
                          showBtns={false}
                          onFilesSelected={handleFilesSelected}
                          iconClassName="!h-14 !w-14"
                        />
                      </div>
                    )}
                  </>
                );
              }}
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DotSeparator({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4"
      height="4"
      viewBox="0 0 4 4"
      fill="none"
      {...props}
    >
      <circle cx="2" cy="2" r="2" fill="#D9D9D9" />
    </svg>
  );
}

function renderStatusOptionDisplayValue(value: string) {
  switch (value) {
    case "open":
      return (
        <div className="flex items-center">
          <Badge color="info" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-indigo-400">
            {value}
          </Text>
        </div>
      );
    case "in progress":
      return (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-orange-dark ">
            {value}
          </Text>
        </div>
      );
    case "resolved":
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-green-dark ">
            {value}
          </Text>
        </div>
      );
    case "closed":
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-red-dark">
            {value}
          </Text>
        </div>
      );
    case "reopened":
      return (
        <div className="flex items-center">
          <Badge color="secondary" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-secondary">
            {value}
          </Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium capitalize text-gray-600">
            {value}
          </Text>
        </div>
      );
  }
}

function renderPriorityOptionDisplayValue(value: string) {
  switch (value) {
    case "medium":
      return (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-orange-dark">
            {value}
          </Text>
        </div>
      );
    case "low":
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-green-dark">
            {value}
          </Text>
        </div>
      );
    case "high":
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-red-dark">
            {value}
          </Text>
        </div>
      );
    case "urgent":
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-red-dark">
            {value}
          </Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium capitalize text-gray-600">
            {value}
          </Text>
        </div>
      );
  }
}
