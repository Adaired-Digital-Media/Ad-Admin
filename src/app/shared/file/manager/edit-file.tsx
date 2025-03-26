/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FileFormInput, fileFormSchema } from "@/validators/edit-file.schema";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { Form } from "@core/ui/form";
import { Button, Input } from "rizzui";
import { CloudinaryFile, editFiles } from "@/data/cloudinary-files";
import toast from "react-hot-toast";
import { useModal } from "@/app/shared/modal-views/use-modal";
import axios from "axios";
import CldImage from "@/core/components/cloudinary-image-component";

const EditFile = ({ file }: { file: CloudinaryFile }) => {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FileFormInput> = async (data) => {
    setLoading(true);
    try {
      await toast.promise(
        editFiles({
          public_id: file.public_id,
          file: {
            caption: data.caption,
            alt: data.alt,
          },
        }),
        {
          loading: "Updating file...",
          success: (response) => {
            return response.data.message || "File updated successfully!";
          },
          error: (error) => error.message || "Failed to update file",
        }
      );

      axios.post("/api/revalidatePage", {
        path: "/file-manager",
      });

      closeModal();
    } catch (error) {
      console.error("Error updating file:", error);
      toast.error("Failed to update file: " + error, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<FileFormInput>
      validationSchema={fileFormSchema}
      onSubmit={onSubmit}
      useFormProps={{
        mode: "onChange",
        defaultValues: {
          caption: file?.context?.caption || "",
          alt: file?.context?.alt || "",
        },
      }}
      className="isomorphic-form flex flex-grow flex-col @container"
    >
      {({ register, formState: { errors } }) => (
        <>
          <div className="flex-grow pb-10">
            <div className="grid grid-cols-2 gap-3 @lg:gap-4 @2xl:gap-5">
              <div className="col-span-2 rounded-lg bg-gray-100">
                <CldImage
                  alt={file?.context?.alt || "Image preview"}
                  src={file?.secure_url || ""}
                  width={500}
                  height={300}
                  className="mx-auto object-contain"
                />
              </div>
              <Input
                label="Caption"
                placeholder="Enter caption"
                {...register("caption")}
                error={errors?.caption?.message}
              />
              <Input
                label="Alt"
                placeholder="Enter alt text"
                {...register("alt")}
                error={errors?.alt?.message}
              />
            </div>
          </div>
          <div className="sticky bottom-0 z-40 flex items-center justify-end gap-3 bg-gray-0/10 backdrop-blur @lg:gap-4 @xl:grid @xl:auto-cols-max @xl:grid-flow-col py-1">
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full @xl:w-auto"
            >
              Update File
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default EditFile;
