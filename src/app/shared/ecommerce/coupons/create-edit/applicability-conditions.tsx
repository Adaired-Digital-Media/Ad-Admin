import { Controller, useFormContext } from "react-hook-form";
import { Input } from "rizzui";
import cn from "@/core/utils/class-names";
import FormGroup from "@/app/shared/form-group";
import dynamic from "next/dynamic";
import SelectLoader from "@/core/components/loader/select-loader";
import { useAtom } from "jotai";
import { productsWithActionsAtom } from "@/store/atoms/products.atom";
import { useEffect } from "react";
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

const applicabilityOptions = [
  { label: "All Products", value: "allProducts" },
  { label: "Specific Products", value: "specificProducts" },
  { label: "Product Categories", value: "productCategories" },
];

const couponTypeOptions = [
  { label: "All", value: "all" },
  { label: "Quantity Based", value: "quantityBased" },
];

export default function ApplicabilityConditions({
  className,
}: {
  className?: string;
}) {
  const { data: session } = useSession();
  const [products, setProducts] = useAtom(productsWithActionsAtom);

  useEffect(() => {
    if (products.products.length === 0 && session?.user?.accessToken) {
      const fetchData = async () => {
        if (session?.user?.accessToken) {
          await setProducts({
            type: "fetch",
            accessToken: session?.user?.accessToken,
          });
        }
      };
      fetchData();
    }
  }, [products, setProducts, session?.user?.accessToken]);

  const {
    register,
    control,
    watch,
    formState: { errors },
    trigger
  } = useFormContext();
  const couponApplicableOn = watch("couponApplicableOn");
  const couponType = watch("couponType");

  return (
    <FormGroup
      title="Applicability & Conditions"
      description="Define applicability and usage conditions"
      className={cn(className)}
    >
      <Controller
        name="couponApplicableOn"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            label="Applicable On"
            options={applicabilityOptions}
            value={value}
            onChange={onChange}
            getOptionValue={(option) => option.value}
            displayValue={(selected) =>
              applicabilityOptions.find((r) => r.value === selected)?.label ??
              ""
            }
            error={errors?.couponApplicableOn?.message as string}
          />
        )}
      />
      {couponApplicableOn === "specificProducts" && (
        <Controller
          name="specificProducts"
          control={control}
          render={({ field: { onChange, value } }) => (
            <MultiSelect
              dropdownClassName="h-auto"
              options={products.products.map((product) => ({
                value: product._id as string,
                label: product.name,
              }))}
              value={value}
              onChange={onChange}
              label="Products"
              error={errors?.specificProducts?.message as string}
            />
          )}
        />
      )}
      {couponApplicableOn === "productCategories" && (
        <Controller
          name="productCategories"
          control={control}
          render={({ field: { onChange, value } }) => (
            <MultiSelect
              dropdownClassName="h-auto"
              options={products.categories.map((category) => ({
                value: category._id as string,
                label: category.name,
              }))}
              value={value}
              // onChange={onChange}
              onChange={(selected) => {
                onChange(selected || []);
                trigger("productCategories"); // Revalidate immediately
              }}
              label="Product Categories"
              error={errors?.productCategories?.message as string}
            />
          )}
        />
      )}
      <Controller
        name="couponType"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            label="Coupon Type"
            options={couponTypeOptions}
            value={value}
            onChange={onChange}
            getOptionValue={(option) => option.value}
            displayValue={(selected) =>
              couponTypeOptions.find((r) => r.value === selected)?.label ?? ""
            }
            error={errors?.couponType?.message as string}
          />
        )}
      />
      {couponType === "quantityBased" && (
        <>
          <Input
            label="Minimum Quantity"
            type="number"
            placeholder="e.g., 100"
            {...register("minQuantity", { valueAsNumber: true })}
            error={errors?.minQuantity?.message as string}
          />
          <Input
            label="Maximum Quantity"
            type="number"
            placeholder="e.g., 500"
            {...register("maxQuantity", { valueAsNumber: true })}
            error={errors?.maxQuantity?.message as string}
          />
        </>
      )}
      <Input
        label="Maximum Word Count"
        type="number"
        placeholder="e.g., 1000"
        {...register("maxWordCount", { valueAsNumber: true })}
        error={errors?.maxWordCount?.message as string}
      />
    </FormGroup>
  );
}
