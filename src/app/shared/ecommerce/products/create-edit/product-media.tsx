import { useFormContext } from "react-hook-form";
import cn from "@core/utils/class-names";
import FormGroup from "@/app/shared/form-group";
import { useCallback, useState } from "react";
import TrashIcon from "@core/components/icons/trash";
import { PiPlusBold } from "react-icons/pi";
import UploadZone from "@/core/ui/file-upload/upload-zone";
import { ActionIcon, Button } from "rizzui";

export default function ProductImagesGallery({
  className,
}: {
  className?: string;
}) {
  const { getValues, setValue, watch } = useFormContext();

  // Watch the images array
  const images = watch("images") || [];

  // Generate unique IDs for each image entry to ensure stable keys
  const [imageIds, setImageIds] = useState<string[]>(() =>
    images.map((_:string, i: number) => `img-${i}-${Date.now()}`)
  );

  const addImage = useCallback(() => {
    const currentImages = getValues("images") || [];
    setValue("images", [...currentImages, ""], {
      shouldValidate: true,
      shouldDirty: true,
    });
    setImageIds((prev) => [...prev, `img-${prev.length}-${Date.now()}`]);
  }, [getValues, setValue]);

  const removeImage = useCallback(
    (indexToRemove: number) => {
      const currentImages = getValues("images") || [];
      const updatedImages = currentImages.filter(
        (_: string, idx: number) => idx !== indexToRemove
      );
      setValue("images", updatedImages, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setImageIds((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    },
    [getValues, setValue]
  );

  return (
    <FormGroup
      title="Images"
      description="Add or remove images from your product"
      className={cn(className)}
    >
      {images.map((item: string, index: number) => (
        <div key={imageIds[index]} className="col-span-1">
          <div className="grid grid-cols-10 gap-2">
            <UploadZone
              name={`images.${index}`}
              className="col-span-9"
              image={item}
            />
            {images.length > 1 && (
              <ActionIcon
                onClick={() => removeImage(index)}
                variant="flat"
                className="mt-1 shrink-0"
              >
                <TrashIcon className="h-4 w-4" />
              </ActionIcon>
            )}
          </div>
        </div>
      ))}

      <Button
        onClick={addImage}
        variant="outline"
        className="col-span-full ml-auto w-auto"
      >
        <PiPlusBold className="me-2 h-4 w-4" /> Add Image
      </Button>
    </FormGroup>
  );
}
