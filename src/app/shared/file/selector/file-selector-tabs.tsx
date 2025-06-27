"use client";
import { Tab } from "rizzui";
import FileUpload from "../../file-upload";
import FileGrid from "./file-grid";
import { CloudinaryFile } from "@/core/types";

interface FileSelectorTabProps {
  onImageSelect: (image: CloudinaryFile) => void;
}

const FileSelectorTab = ({ onImageSelect }: FileSelectorTabProps) => {
  return (
    <Tab>
      <Tab.List>
        <Tab.ListItem>Media Library</Tab.ListItem>
        <Tab.ListItem>Upload Files</Tab.ListItem>
      </Tab.List>
      <Tab.Panels className="py-2 text-sm leading-6 text-gray-500">
        <Tab.Panel className="py-2 text-sm leading-6 text-gray-500">
          <FileGrid onImageSelect={onImageSelect} />
        </Tab.Panel>
        <Tab.Panel className="py-2 text-sm leading-6 text-gray-500">
          <FileUpload showHeader={false} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab>
  );
};

export default FileSelectorTab;
