/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import cn from "@/core/utils/class-names";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { Title, Input, Select, Button, ActionIcon } from "rizzui";
import { Controller, SubmitHandler } from "react-hook-form";
import { blogActionsAtom, blogCategoryAtom } from "@/store/atoms/blog.atom";
import {
  BlogCategoryFormInput,
  blogCategoryFormSchema,
} from "@/validators/blog-category.schema";
import { categoryDefaultValues } from "./form-utils";
import toast from "react-hot-toast";
import UploadZone from "@/core/ui/file-upload/upload-zone";
import { useModal } from "@/app/shared/modal-views/use-modal";
import { Form } from "@/core/ui/form";
import { PiXBold } from "react-icons/pi";
import { BlogCategoryType } from "@/core/types";

// Define the type for status options
type StatusOption = {
  label: string;
  value: string;
};

const statusOptions: StatusOption[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

type Props = {
  className?: string;
  category?: BlogCategoryType;
  accessToken?: string;
};

export default function CreateEditCategory({
  className,
  category,
  accessToken,
}: Props) {
  const { closeModal } = useModal();
  const [blogCategories] = useAtom(blogCategoryAtom);
  const setCategory = useSetAtom(blogActionsAtom);
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<BlogCategoryFormInput> = async (data) => {
    if (!accessToken) return;
    setLoading(true);
    try {
      if (category) {
        const response = await setCategory({
          type: "updateCategory",
          token: accessToken,
          payload: { id: category._id, ...data },
        });
        if (response.status !== 200) {
          toast.error(response.data.message);
          console.error("Failed to update category:", response);
          return;
        }
        toast.success(response.data.message);
      } else {
        const response = await setCategory({
          type: "createCategory",
          token: accessToken,
          payload: data,
        });
        if (response.status !== 201) {
          toast.error(response.data.message);
          console.error("Failed to create category:", response);
          return;
        }
        toast.success(response.data.message);
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save coupon:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      useFormProps={{
        defaultValues: categoryDefaultValues(category),
      }}
      validationSchema={blogCategoryFormSchema}
      className={cn(
        "grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900",
        className
      )}
    >
      {({
        register,
        watch,
        setValue,
        getValues,
        control,
        formState: { errors },
      }) => {
        return (
          <>
            <div className="col-span-full flex items-center justify-between">
              <Title as="h4" className="font-semibold">
                {category ? "Update category" : "Create category"}
              </Title>
              <ActionIcon size="sm" variant="text" onClick={closeModal}>
                <PiXBold className="h-auto w-5" />
              </ActionIcon>
            </div>
            <UploadZone
              name="image"
              label="Image *"
              register={register}
              watch={watch}
              setValue={setValue}
              className="col-span-full"
              image={getValues("image")}
              error={errors.image?.message}
            />
            <Input
              label="Name *"
              placeholder="e.g., My Blog Category"
              required
              {...register("name")}
              error={errors?.name?.message as string}
            />
            <Input
              label="Slug *"
              placeholder="e.g., my-blog-category"
              required
              {...register("slug")}
              error={errors?.slug?.message as string}
            />
            <Controller
              name="parentCategory"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Parent Category"
                  value={value}
                  options={blogCategories.map((category) => ({
                    value: category._id,
                    label: category.name,
                  }))}
                  onChange={onChange}
                  placeholder="Select Parent Category"
                  getOptionValue={(option) => option.value}
                  displayValue={(selected) =>
                    blogCategories
                      .filter((cat) => cat._id === getValues("parentCategory"))
                      .find((cat) => cat._id === selected)?.name || ""
                  }
                  error={errors?.parentCategory?.message as string}
                />
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Status"
                  value={value}
                  options={statusOptions}
                  onChange={onChange}
                  getOptionValue={(option) => option.value}
                  displayValue={(selected) =>
                    statusOptions.find((s) => s.value === selected)?.label ??
                    "active"
                  }
                  error={errors?.status?.message as string}
                />
              )}
            />

            <div className="col-span-full flex items-center justify-end gap-4">
              <Button
                variant="outline"
                onClick={closeModal}
                className="w-full @xl:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full @xl:w-auto"
              >
                {category ? "Update Category" : "Create Category"}
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
}
