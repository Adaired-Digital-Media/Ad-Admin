"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { z } from "zod";
import { useState } from "react";
import {
  Title,
  Text,
  Badge,
  Button,
  Avatar,
  Empty,
  Select,
  Loader,
} from "rizzui";
import cn from "@core/utils/class-names";
import { SubmitHandler, Controller } from "react-hook-form";
import { Form } from "@core/ui/form";
import MessageBody from "@/app/shared/support/inbox/message-body";
import SimpleBar from "@core/ui/simplebar";
import { useElementSize } from "@core/hooks/use-element-size";
import { useMedia } from "@core/hooks/use-media";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  selectedTicketAtom,
  ticketsWithActionsAtom,
} from "@/store/atoms/tickets.atom";
// import { getInitials } from "@core/utils/get-initials";
import { useSession } from "next-auth/react";
// import { uploadFiles } from "@/utils/upload";
import { TicketStatus, TicketPriority } from "@/data/tickets.types";
import { PiCaretDownBold } from "react-icons/pi";
import ActionDropdown from "./action-dropdown";
import Upload from "@/core/ui/upload";
import FileUpload, { FileInput, fileType } from "../../file-upload";
import { LuReply } from "react-icons/lu";
import { Session } from "next-auth";

const QuillEditor = dynamic(() => import("@core/ui/quill-editor"), {
  ssr: false,
});

const FormSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

type FormValues = {
  message: string;
};

const priorityOptions = [
  {
    value: "Low",
    label: "Low",
  },
  {
    value: "Medium",
    label: "Medium",
  },
  {
    value: "High",
    label: "High",
  },
];

const agentsOptions = [
  {
    value: 1,
    label: "Isabel Larson",
    avatar:
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-10.webp",
  },
  {
    value: 2,
    label: "Elias Pouros",
    avatar:
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-11.webp",
  },
  {
    value: 3,
    label: "Rose Powlowski-Paucek",
    avatar:
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-13.webp",
  },
  {
    value: 4,
    label: "Milton Leannon",
    avatar:
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-04.webp",
  },
];

const contactStatuses = [
  {
    value: "New",
    label: "New",
  },
  {
    value: "Waiting on contact",
    label: "Waiting on contact",
  },
  {
    value: "Waiting on us",
    label: "Waiting on us",
  },
  {
    value: "Closed",
    label: "Closed",
  },
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
  className,
  session,
}: {
  className?: string;
  session: Session;
}) {
  const selectedTicket = useAtomValue(selectedTicketAtom);
  const setTickets = useSetAtom(ticketsWithActionsAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  console.log(files);
  const [ref, { width }] = useElementSize();
  const isWide = useMedia("(min-width: 1280px) and (max-width: 1440px)", false);

  const [agent, setAgent] = useState();
  const [priority, setPriority] = useState("");
  const [contactStatus, setContactStatus] = useState(contactStatuses[0].value);

  function formWidth() {
    if (isWide) return width - 64;
    return width - 44;
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!selectedTicket || !session?.user?.accessToken) return;

    setIsSubmitting(true);
    try {
      await setTickets({
        type: "update",
        id: selectedTicket._id!,
        data: {
          message: data.message,
          attachments: files,
        },
        accessToken: session?.user?.accessToken,
      });

      setFiles([]);
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Callback to update files state when selected in FileInput
  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  // if (isLoading) {
  //   return (
  //     <div
  //       className={cn(
  //         "!grid h-full min-h-[128px] flex-grow place-content-center items-center justify-center",
  //         className
  //       )}
  //     >
  //       <Loader variant="spinner" size="xl" />
  //     </div>
  //   );
  // }

  const getBadgeColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return "primary";
      case TicketStatus.IN_PROGRESS:
        return "warning";
      case TicketStatus.RESOLVED:
        return "success";
      case TicketStatus.CLOSED:
        return "success";
      case TicketStatus.REOPENED:
        return "danger";
      default:
        return "primary";
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.LOW:
        return "success";
      case TicketPriority.MEDIUM:
        return "warning";
      case TicketPriority.HIGH:
        return "danger";
      case TicketPriority.URGENT:
        return "danger";
      default:
        return "primary";
    }
  };

  if (!selectedTicket || !session?.user?.accessToken) {
    return (
      <div
        className={cn(
          "!grid h-full min-h-[128px] flex-grow place-content-center items-center justify-center",
          className
        )}
      >
        <Empty
          text="No ticket selected"
          textClassName="mt-4 text-base text-gray-500"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative pt-6 lg:rounded-lg lg:border lg:border-muted lg:px-4 lg:py-7 xl:px-5 xl:py-5 2xl:pb-7 2xl:pt-6",
        className
      )}
    >
      <div>
        <header className="flex flex-col justify-between gap-4 border-b border-muted pb-5 3xl:flex-row 3xl:items-center">
          <div className="flex flex-col items-start justify-between gap-3 xs:flex-row xs:items-center xs:gap-6 lg:justify-normal">
            <Title as="h4" className="font-semibold">
              {selectedTicket?.subject}
            </Title>

            <Badge
              variant="outline"
              color={getBadgeColor(selectedTicket?.status)}
              size="sm"
            >
              {selectedTicket?.status}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
            <Select
              value={agent}
              variant="text"
              options={agentsOptions}
              onChange={setAgent}
              placeholder="Select Agent"
              placement="bottom-end"
              displayValue={(value: AvatarOptionTypes) =>
                renderAvatarOptionDisplayValue(value)
              }
              getOptionDisplayValue={(option) =>
                renderAvatarOptionDisplayValue(option)
              }
              dropdownClassName="!w-60 p-2 gap-1 grid !z-0"
              suffix={<PiCaretDownBold className="h-3 w-3" />}
              className={"w-auto"}
            />
            <Select
              variant="text"
              value={contactStatus}
              options={contactStatuses}
              onChange={setContactStatus}
              placeholder="Select Status"
              placement="bottom-end"
              selectClassName="text-xs sm:text-sm"
              optionClassName="text-xs sm:text-sm"
              dropdownClassName="!w-48 p-2 gap-1 grid !z-0"
              suffix={<PiCaretDownBold className="h-3 w-3" />}
              className={"w-auto"}
            />
            <Select
              variant="text"
              value={priority}
              onChange={setPriority}
              options={priorityOptions}
              placeholder="Set Priority"
              placement="bottom-end"
              dropdownClassName="!w-32 p-2 gap-1 grid !z-0"
              getOptionValue={(option) => option.value}
              getOptionDisplayValue={(option) =>
                renderPriorityOptionDisplayValue(option.value as string)
              }
              displayValue={(selected: string) =>
                renderPriorityOptionDisplayValue(selected)
              }
              suffix={<PiCaretDownBold className="h-3 w-3" />}
              className={"w-auto"}
            />
            <ActionDropdown className="ml-auto sm:ml-[unset]" />
          </div>
        </header>

        <div className="[&_.simplebar-content]:grid [&_.simplebar-content]:gap-8 [&_.simplebar-content]:py-5">
          <SimpleBar className="@3xl:max-h-[calc(100dvh-34rem)] @4xl:max-h-[calc(100dvh-32rem)] @7xl:max-h-[calc(100dvh-31rem)]">
            {/* Original ticket message */}
            <MessageBody
              message={{
                ...selectedTicket?.messages[0],
                sender: selectedTicket.createdBy!,
                message: selectedTicket.description!,
              }}
            />

            {/* Replies */}
            {selectedTicket.messages.slice(1).map((message) => (
              <MessageBody key={message?._id.toString()} message={message} />
            ))}
          </SimpleBar>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-[32px_1fr] items-start gap-3 rounded-b-lg bg-white @3xl:pt-4 dark:bg-transparent lg:gap-4 lg:pl-0 dark:lg:pt-0 xl:grid-cols-[48px_1fr]"
        >
          <Avatar
            name={session?.user?.name || "You"}
            // initials={getInitials(session?.user?.name || "You")}
            src={session?.user?.image || ""}
            className="!h-8 !w-8 bg-[#70C5E0] font-medium text-white xl:!h-12 xl:!w-12"
          />
          <div
            className="relative rounded-lg border border-muted bg-gray-50 p-4 2xl:p-5"
            style={{
              maxWidth: formWidth(),
            }}
          >
            <Form<FormValues> onSubmit={onSubmit} validationSchema={FormSchema}>
              {({ control, formState: { errors }, reset }) => (
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
                      className={"w-auto"}
                    />
                    <Button
                      type="submit"
                      className="dark:bg-gray-200 dark:text-white"
                      isLoading={isSubmitting}
                    >
                      Send Reply
                    </Button>
                  </div>
                  {supportTypes.Email && (
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
                </>
              )}
            </Form>
          </div>
        </div>

        {/* <div
          ref={ref}
          className="grid grid-cols-[32px_1fr] items-start gap-3 rounded-b-lg bg-white @3xl:pt-4 dark:bg-transparent lg:gap-4 lg:pl-0 dark:lg:pt-0 xl:grid-cols-[48px_1fr]"
        >
          <figure className="dark:mt-4">
            <Avatar
              name="John Doe"
              initials={initials}
              src="https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-14.png"
              className="!h-8 !w-8 bg-[#70C5E0] font-medium text-white xl:!h-12 xl:!w-12"
            />
          </figure>
          <div
            className="relative rounded-lg border border-muted bg-gray-50 p-4 2xl:p-5"
            style={{
              maxWidth: formWidth(),
            }}
          >
            <Form<FormValues> onSubmit={onSubmit} validationSchema={FormSchema}>
              {({ control, watch, formState: { errors } }) => {
                return (
                  <>
                    <div className="relative mb-2.5 flex items-center justify-between">
                      <Select
                        size="sm"
                        variant="outline"
                        value={supportType}
                        options={supportOptionTypes}
                        onChange={setSupportType}
                        getOptionValue={(option) => option.value}
                        displayValue={(selected: string) => selected}
                        suffix={<PiCaretDownBold className="ml-1 h-3 w-3" />}
                        placement="bottom-start"
                        dropdownClassName="p-2 gap-1 grid !w-20 !z-0"
                        selectClassName="bg-gray-0 dark:bg-gray-50"
                        className={'w-auto'}
                      />
                      <Button
                        type="submit"
                        className="dark:bg-gray-200 dark:text-white"
                      >
                        Send
                      </Button>
                    </div>
                    {supportType === supportTypes.Email && (
                      <div className="mb-2.5 flex items-center gap-2">
                        <LuReply />
                        <span className="rounded border border-muted px-1.5 py-1 lowercase">
                          {message?.email}
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
                        />
                      )}
                    />
                  </>
                );
              }}
            </Form>
          </div>
        </div> */}
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

type AvatarOptionTypes = {
  avatar: string;
  label: string;
  [key: string]: any;
};

function renderAvatarOptionDisplayValue(option: AvatarOptionTypes) {
  return (
    <div className="flex items-center gap-2">
      <Avatar
        src={option.avatar}
        name={option.label}
        className="!h-6 !w-6 rounded-full"
      />
      <span className="whitespace-nowrap text-xs sm:text-sm">
        {option.label}
      </span>
    </div>
  );
}

function renderPriorityOptionDisplayValue(value: string) {
  switch (value) {
    case "Medium":
      return (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-orange-dark">
            {value}
          </Text>
        </div>
      );
    case "Low":
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-green-dark">
            {value}
          </Text>
        </div>
      );
    case "High":
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
