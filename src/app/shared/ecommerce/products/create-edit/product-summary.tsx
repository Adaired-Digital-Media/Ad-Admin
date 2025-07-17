import { Controller, useFormContext } from "react-hook-form";
import { Input } from "rizzui";
import cn from "@/core/utils/class-names";
import FormGroup from "@/app/shared/form-group";
import dynamic from "next/dynamic";
import SelectLoader from "@core/components/loader/select-loader";
import QuillLoader from "@core/components/loader/quill-loader";
import { useEffect, useState } from "react";
import { ProductCategoryType } from "@/core/types";
import { fetchData } from "@/core/utils/fetch-function";
import { useSession } from "next-auth/react";

const Select = dynamic(() => import("rizzui").then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});
const MultiSelect = dynamic(
  () => import("rizzui").then((mod) => mod.MultiSelect),
  {
    ssr: false,
    loading: () => <SelectLoader />,
  }
);
const QuillEditor = dynamic(() => import("@core/ui/quill-editor"), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[143px]" />,
});

export default function ProductSummary({ className }: { className?: string }) {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<ProductCategoryType[]>([]);
  const [subCategories, setSubCategories] = useState<ProductCategoryType[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response: ProductCategoryType[] = await fetchData({
        endpoint: "/product/category/read-category",
        accessToken: session?.user?.accessToken || "",
      });
      setCategories(response);

      // Filter top-level categories (those with no parentCategory)
      const topLevelCategories = response.filter(
        (category: ProductCategoryType) => !category.parentCategory
      );
      setCategories(topLevelCategories);
      // Filter subcategories (those with a parentCategory)
      const filteredSubCategories = response.filter(
        (category: ProductCategoryType) => category.parentCategory
      );
      setSubCategories(filteredSubCategories);
    };
    fetchCategories();
  }, [session]);

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormGroup
      title="Summary"
      description="Edit your product description and necessary information from here"
      className={cn(className)}
    >
      <Input
        label="Product Name"
        placeholder="Product name"
        {...register("name")}
        error={errors?.name?.message as string}
      />
      <Input
        label="Slug"
        placeholder="Slug"
        {...register("slug")}
        error={errors?.slug?.message as string}
      />
      <Controller
        name="category"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            // dropdownClassName="!z-0"
            options={categories.map((category) => ({
              value: category._id,
              label: category.name,
            }))}
            value={value}
            onChange={onChange}
            label="Category"
            error={errors?.category?.message as string}
            getOptionValue={(option) => option.value}
            displayValue={(value) =>
              categories.find((cat) => cat._id === value)?.name || ""
            }
          />
        )}
      />

      <Controller
        name="subCategory"
        control={control}
        render={({ field: { onChange, value } }) => (
          <MultiSelect
            dropdownClassName="h-auto"
            options={subCategories.map((category) => ({
              value: category._id,
              label: category.name,
            }))}
            value={value}
            onChange={onChange}
            label="Sub Category"
            error={errors?.subCategory?.message as string}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <QuillEditor
            value={value}
            onChange={onChange}
            label="Description"
            className="col-span-full [&_.ql-editor]:min-h-[100px]"
            labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
          />
        )}
      />
    </FormGroup>
  );
}
