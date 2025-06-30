"use client";
import { useFormContext } from "react-hook-form";
import { Text } from "rizzui";
import cn from "@/core/utils/class-names";
import FormGroup from "@/app/shared/form-group";
import UploadZone from "@/core/ui/file-upload/upload-zone";

export default function BlogImage({ className }: { className?: string }) {
  const {
    watch,
    formState: { errors },
  } = useFormContext();

  const imageValue = watch("featuredImage");
  return (
    <FormGroup
      title="Blog Image"
      description="Add the featured image for the blog"
      className={cn(className)}
    >
      <div className="col-span-2">
        <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
          Featured Image
          <span className="text-red-500"> *</span>
        </Text>
        <UploadZone name={"featuredImage"} image={imageValue} />
        <span className="text-red-500">
          {errors?.featuredImage?.message as string}
        </span>
      </div>
    </FormGroup>
  );
}
