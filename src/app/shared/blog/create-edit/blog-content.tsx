"use client";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "rizzui";
import cn from "@/core/utils/class-names";
import FormGroup from "@/app/shared/form-group";
import dynamic from "next/dynamic";
import SelectLoader from "@/core/components/loader/select-loader";
import QuillLoader from "@core/components/loader/quill-loader";
import { useAtom, useSetAtom } from "jotai";
import { blogActionsAtom, blogCategoryAtom } from "@/store/atoms/blog.atom";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ItemCrud from "@/app/shared/item-crud";
import { DatePicker } from "@/core/ui/datepicker";

const Select = dynamic(() => import("rizzui").then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});
const QuillEditor = dynamic(() => import("@core/ui/quill-editor"), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[168px]" />,
});

// Define the type for status options
type StatusOption = {
  label: string;
  value: string;
};

const statusOptions: StatusOption[] = [
  { label: "Publish", value: "publish" },
  { label: "Draft", value: "draft" },
  { label: "Scheduled", value: "scheduled" },
];

export default function BasicDetails({ className }: { className?: string }) {
  const [categories] = useAtom(blogCategoryAtom);
  const setCategories = useSetAtom(blogActionsAtom);
  const { data: session } = useSession();

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const scheduledPublishDate = watch("scheduledPublishDate");

  useEffect(() => {
    if (!categories.length && session?.user?.accessToken) {
      setCategories({
        type: "fetchAllCategories",
        token: session?.user?.accessToken,
      });
    }
  }, [categories, setCategories, session]);

  useEffect(() => {
    // Set status to "scheduled" when scheduledPublishDate is set
    if (scheduledPublishDate) {
      setValue("status", "scheduled");
    } else {
      // Reset status to "draft" if scheduledPublishDate is cleared
      if (watch("status") === "scheduled") {
        setValue("status", "draft");
      }
    }
  }, [scheduledPublishDate, setValue, watch]);

  const initialTags = watch("tags") || [];

  const normalizeTags = (tags: string | string[]): string[] => {
    if (typeof tags === "string") {
      return tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
    }
    return Array.isArray(tags) ? tags : [];
  };

  const [tags, setTags] = useState<string[]>(normalizeTags(initialTags));

  const handleDateClear = () => {
    setValue("scheduledPublishDate", null);
  };

  // Filter status options to exclude "scheduled" if no scheduledPublishDate
  const filteredStatusOptions = scheduledPublishDate
    ? statusOptions
    : statusOptions.filter((option) => option.value !== "scheduled");

  return (
    <FormGroup
      title="Blog Content"
      description="Add the core content details of the blog"
      className={cn(className)}
    >
      <Input
        label="Post Title *"
        placeholder="e.g., My Blog"
        required
        {...register("postTitle")}
        error={errors?.postTitle?.message as string}
      />

      <Input
        label="Slug"
        placeholder="e.g., my-blog"
        required
        prefix="https://adaired.com/blog/"
        {...register("slug")}
        error={errors?.slug?.message as string}
      />

      <div className="col-span-2">
        <Controller
          control={control}
          name="postDescription"
          render={({ field: { onChange, value } }) => (
            <QuillEditor
              label="Content *"
              value={value}
              onChange={onChange}
              className="[&>.ql-container_.ql-editor]:min-h-[100px]"
              labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
            />
          )}
        />
        <span className="text-red-500">
          {errors?.postDescription?.message as string}
        </span>
      </div>

      <Controller
        name="category"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            label="Category *"
            value={value}
            options={categories.map((category) => ({
              value: category._id,
              label: category.name,
            }))}
            onChange={onChange}
            placeholder="Select Category"
            getOptionValue={(option) => option.value}
            displayValue={(selected) =>
              categories.find((cat) => cat._id === selected)?.name || ""
            }
            error={errors?.category?.message as string}
          />
        )}
      />
      <ItemCrud label="Tags" name={"tags"} items={tags} setItems={setTags} />

      <Controller
        name="scheduledPublishDate"
        control={control}
        render={({ field: { value, onChange, onBlur } }) => (
          <DatePicker
            selected={value}
            onChange={onChange}
            minDate={new Date()}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="e.g., April 11, 2025 04:03 PM"
            onBlur={onBlur}
            inputProps={{
              label: "Schedule Publish Date (Optional)",
              error: errors?.scheduledPublishDate?.message as string,
              clearable: true,
              onClear: handleDateClear,
            }}
          />
        )}
      />

      <Controller
        name="status"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            label="Status *"
            value={value}
            options={filteredStatusOptions}
            onChange={onChange}
            disabled={!!scheduledPublishDate}
            getOptionValue={(option) => option.value}
            displayValue={(selected) =>
              filteredStatusOptions.find((s) => s.value === selected)?.label ?? ""
            }
            error={
              errors?.status?.message as string ||
              (!scheduledPublishDate && value === "scheduled"
                ? "Scheduled status requires a publish date"
                : "")
            }
          />
        )}
      />
    </FormGroup>
  );
}