"use client";

import { PiXBold } from "react-icons/pi";
import { ActionIcon, Title } from "rizzui";
import { useModal } from "@/app/shared/modal-views/use-modal";
import FileSelectorTab from "./file-selector-tabs";
import { CloudinaryFile } from "@/data/cloudinary-files";

interface FileSelectorModalViewProps {
  onImageSelect: (image: CloudinaryFile) => void;
}

const FileSelectorModalView = ({ onImageSelect }: FileSelectorModalViewProps) => {
  const { closeModal } = useModal();
  return (
    <div className="m-auto px-5 pb-8 pt-5 @lg:pt-6 @2xl:px-7">
      <div className="mb-2 flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          Select File
        </Title>
        <ActionIcon size="sm" variant="text" onClick={() => closeModal()}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>
      <FileSelectorTab onImageSelect={onImageSelect} />
    </div>
  );
};

export default FileSelectorModalView;
