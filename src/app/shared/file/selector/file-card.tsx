import Image from "next/image";
import cn from "@/core/utils/class-names";
import { CloudinaryFile } from "@/core/types";
import { Title } from "rizzui";

interface FileProps {
  file: CloudinaryFile;
  isSelected?: boolean;
  className?: string;
}

const FileCard = ({ file, className }: FileProps) => {
  return (
    <div className={cn(className)}>
      <div className="relative">
        <div className="relative mx-auto aspect-[4/2.5] w-full overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={file.secure_url || ""}
            alt={file.context?.alt || file.filename}
            fill
            className="transform rounded-md object-contain p-2"
          />
        </div>
      </div>
      <div className="pt-1">
        <Title
          as="h6"
          className="mb-1 truncate font-semibold transition-colors hover:text-primary"
        >
          {file.public_id}
        </Title>
      </div>
    </div>
  );
};

export default FileCard;
