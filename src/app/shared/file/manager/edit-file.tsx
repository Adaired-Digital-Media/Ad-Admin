/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FileFormInput, fileFormSchema } from "@/validators/edit-file.schema";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { Form } from "@core/ui/form";
import { Button, Input } from "rizzui";
import { CloudinaryFile } from "@/core/types";
import toast from "react-hot-toast";
import { useModal } from "@/app/shared/modal-views/use-modal";
import CldImage from "@/core/components/cloudinary-image-component";
import { useAtom } from "jotai";
import { cloudinaryActionsAtom } from "@/store/atoms/files.atom";
import { useSession } from "next-auth/react";

const EditFile = ({ file }: { file: CloudinaryFile }) => {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [, dispatch] = useAtom(cloudinaryActionsAtom);

  const onSubmit: SubmitHandler<FileFormInput> = async (data) => {
    if (!session?.user?.accessToken) {
      toast.error("User session not found", { position: "top-right" });
      return;
    }

    setLoading(true);
    try {
      await toast.promise(
        dispatch({
          type: "edit",
          token: session.user.accessToken,
          payload: {
            public_id: file.public_id,
            file: {
              caption: data.caption,
              alt: data.alt,
            },
          },
        }),
        {
          loading: "Updating file...",
          success: () => "File updated successfully!",
          error: (error) => error.message || "Failed to update file",
        }
      );

      closeModal();
    } catch (error) {
      console.error("Error updating file:", error);
      toast.error(`Failed to update file: ${error.message || "Unknown error"}`, {
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