"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  SubmitHandler,
  Controller,
  useForm,
  FormProvider,
} from "react-hook-form";
import SelectLoader from "@core/components/loader/select-loader";
import QuillLoader from "@core/components/loader/quill-loader";
import { Button, Input, Text, Title } from "rizzui";
import cn from "@core/utils/class-names";
import {
  CategoryFormInput,
  categoryFormSchema,
} from "@/validators/create-category.schema";
import { ProductCategoryType } from "@/data/product-categories";
import UploadZone from "@/core/ui/file-upload/upload-zone";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useApiCall } from "@core/utils/api-config";
const Select = dynamic(() => import("rizzui").then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});
const QuillEditor = dynamic(() => import("@core/ui/quill-editor"), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[168px]" />,
});

// a reusable form wrapper component
function HorizontalFormBlockWrapper({
  title,
  description,
  children,
  className,
  isModalView = true,
}: React.PropsWithChildren<{
  title: string;
  description?: string;
  className?: string;
  isModalView?: boolean;
}>) {
  return (
    <div
      className={cn(
        className,
        isModalView ? "@5xl:grid @5xl:grid-cols-6" : " "
      )}
    >
      {isModalView && (
        <div className="col-span-2 mb-6 pe-4 @5xl:mb-0">
          <Title as="h6" className="font-semibold">
            {title}
          </Title>
          <Text className="mt-1 text-sm text-gray-500">{description}</Text>
        </div>
      )}

      <div
        className={cn(
          "grid grid-cols-2 gap-3 @lg:gap-4 @2xl:gap-5",
          isModalView ? "col-span-4" : " "
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default function CreateCategory({
  id,
  isModalView = true,
  category,
  categories,
}: {
  id?: string;
  isModalView?: boolean;
  category?: CategoryFormInput;
  categories: ProductCategoryType[];
}) {
  const [isLoading, setLoading] = useState(false);
  const { apiCall, sessionStatus } = useApiCall();
  const methods = useForm({
    mode: "onChange",
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category ? category.name : "",
      description: category ? category.description : "",
      parentCategory:
        category?.parentCategory && typeof category.parentCategory === "object"
          ? (category.parentCategory as { _id: string })?._id
          : "",
      slug: category ? category.slug : "",
      image: category ? category.image : "",
      metaTitle: category ? category.metaTitle : "",
      metaDescription: category ? category.metaDescription : "",
      canonicalLink: category ? category.canonicalLink : "",
      status: category ? category.status : "",
    },
  });
  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<CategoryFormInput> = async (data) => {
    console.log("Submitting form data:", data);
    if (sessionStatus === "loading") {
      console.log("Session is still loading, please wait.");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (category) {
        response = await apiCall<{ message: string }>({
          url: `/product/category/update-category?identifier=${id}`,
          method: "PATCH",
          data,
        });
      } else {
        response = await apiCall<{ message: string }>({
          url: "/product/category/create-category",
          method: "POST",
          data,
        });
      }
      reset({
        name: "",
        description: "",
        parentCategory: "",
        slug: "",
        image: "",
        metaTitle: "",
        metaDescription: "",
        canonicalLink: "",
        status: "",
      });
      toast.success(response?.data?.message || "Category created successfully");
      await fetch("/api/revalidateTags?tags=product-categories", {
        method: "GET",
      });
    } catch (error) {
      console.error(
        "Error submitting form:",
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="isomorphic-form flex flex-grow flex-col @container"
      >
        <div className="flex-grow pb-10">
          <div
            className={cn(
              "grid grid-cols-1",
              isModalView
                ? "grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12 [&>div]:pt-7 first:[&>div]:pt-0 @2xl:[&>div]:pt-9 @3xl:[&>div]:pt-11"
                : "gap-5"
            )}
          >
            <HorizontalFormBlockWrapper
              title={"Add Category Data :"}
              description={"Add your category information from here..."}
              isModalView={isModalView}
            >
              <Input
                label="Category Name"
                placeholder="Category name"
                {...register("name")}
                error={errors.name?.message}
              />
              <Input
                label="Slug"
                placeholder="Slug"
                {...register("slug")}
                error={errors.slug?.message}
              />
              <Controller
                name="parentCategory"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    dropdownClassName="!z-0"
                    options={categories.map((category) => ({
                      value: category._id,
                      label: category.name,
                    }))}
                    value={value}
                    onChange={onChange}
                    label="Parent Category"
                    error={errors?.parentCategory?.message as string}
                    getOptionValue={(option) => option.value}
                    displayValue={(value) =>
                      categories.find((cat) => cat._id === value)?.name || ""
                    }
                  />
                )}
              />

              <div className="col-span-2">
                <UploadZone
                  label={"Image"}
                  name={"image"}
                  image={category?.image}
                />
              </div>

              <div className="col-span-2">
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, value } }) => (
                    <QuillEditor
                      value={value}
                      onChange={onChange}
                      label="Description"
                      className="[&>.ql-container_.ql-editor]:min-h-[100px]"
                      labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
                    />
                  )}
                />
              </div>
            </HorizontalFormBlockWrapper>
            <HorizontalFormBlockWrapper
              title="Add Category Meta Data :"
              description="Add your category meta data from here..."
              isModalView={isModalView}
            >
              <Input
                label="Meta Title"
                placeholder="Meta title"
                {...register("metaTitle")}
                error={errors.metaTitle?.message}
              />
              <Input
                label="Meta Description"
                placeholder="Meta description"
                {...register("metaDescription")}
                error={errors.metaDescription?.message}
              />
              <Input
                label="Canonical Link"
                placeholder="Canonical link"
                {...register("canonicalLink")}
                error={errors.canonicalLink?.message}
              />
              <Controller
                name="status"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    dropdownClassName="!z-0"
                    options={["Active", "Inactive", "Archived"].map(
                      (status) => ({
                        value: status,
                        label: status,
                      })
                    )}
                    value={value}
                    onChange={onChange}
                    label="Status"
                    error={errors?.status?.message as string}
                    getOptionValue={(option) => option.value}
                  />
                )}
              />
            </HorizontalFormBlockWrapper>
          </div>
        </div>

        <div
          className={cn(
            "sticky bottom-0 z-40 flex items-center justify-end gap-3 bg-gray-0/10 backdrop-blur @lg:gap-4 @xl:grid @xl:auto-cols-max @xl:grid-flow-col",
            isModalView ? "-mx-10 -mb-7 px-10 py-5" : "py-1"
          )}
        >
          <Button variant="outline" className="w-full @xl:w-auto">
            Save as Draft
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full @xl:w-auto"
          >
            {id ? "Update" : "Create"} Category
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
