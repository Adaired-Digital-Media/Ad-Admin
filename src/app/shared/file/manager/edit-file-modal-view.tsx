"use client";

import { useModal } from "@/app/shared/modal-views/use-modal";
import { Title, ActionIcon } from "rizzui";
import { PiXBold } from "react-icons/pi";
import EditFile from "./edit-file";
import { CloudinaryFile } from "@/core/types";
export function EditFileModalView({ file }: { file: CloudinaryFile }) {
  const { closeModal } = useModal();
  return (
    <div className="m-auto px-5 pb-8 pt-5 @lg:pt-6 @2xl:px-7">
      <div className="mb-7 flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          Edit File
        </Title>
        <ActionIcon size="sm" variant="text" onClick={() => closeModal()}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>
      <EditFile file={file} />
    </div>
  );
}
