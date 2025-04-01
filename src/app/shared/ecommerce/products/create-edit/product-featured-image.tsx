import FormGroup from "@/app/shared/form-group";
import UploadZone from "@/core/ui/file-upload/upload-zone";
import cn from "@/core/utils/class-names";
import { useFormContext } from "react-hook-form";
interface ProductFeaturedImageProps {
  className?: string;
}

export default function ProductFeaturedImage({
  className,
}: ProductFeaturedImageProps) {
  const {
    // watch,
    formState: { errors },
    getValues,
  } = useFormContext();

  // Watch the featuredImage field value
  // const featuredImageValue = watch("featuredImage");
  return (
    <FormGroup
      title="Upload new featured image"
      description="Upload a new featured image for your product"
      className={cn(className)}
    >
      <UploadZone
        name="featuredImage"
        label="Featured Image"
        className="col-span-full"
        image={getValues("featuredImage")}
        error={errors.featuredImage?.message as string}
      />
    </FormGroup>
  );
}
