import { Controller, useFormContext } from "react-hook-form";
import { Input, Text } from "rizzui";
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
  { label: "Amount Based", value: "amountBased" },
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
    trigger,
  } = useFormContext();
  const couponApplicableOn = watch("couponApplicableOn");
  const couponType = watch("couponType");

  return (
    <FormGroup
      title="Applicability & Conditions"
      description="Define applicability and usage conditions"
      className={cn(className)}
    >
      <div>
        <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
          Applicable On
          <span className="text-red-500"> *</span>
        </Text>
        <Controller
          name="couponApplicableOn"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
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
      </div>
      {couponApplicableOn === "specificProducts" && (
        <div>
          <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
            Products
            <span className="text-red-500"> *</span>
          </Text>
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
                error={errors?.specificProducts?.message as string}
              />
            )}
          />
        </div>
      )}
      {couponApplicableOn === "productCategories" && (
        <div>
          <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
            Products Categories
            <span className="text-red-500"> *</span>
          </Text>
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
                onChange={(selected) => {
                  onChange(selected || []);
                  trigger("productCategories");
                }}
                error={errors?.productCategories?.message as string}
              />
            )}
          />
        </div>
      )}

      <div>
        <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
          Coupon Type
          <span className="text-red-500"> *</span>
        </Text>
        <Controller
          name="couponType"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              label=""
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
      </div>
      {couponType === "quantityBased" && (
        <>
          <div>
            <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
              Minimum Quantity
              <span className="text-red-500"> *</span>
            </Text>
            <Input
              type="number"
              placeholder="e.g., 100"
              {...register("minQuantity")}
              error={errors?.minQuantity?.message as string}
            />
          </div>
          <div>
            <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
              Maximum Quantity
            </Text>
            <Input
              type="number"
              placeholder="e.g., 500"
              {...register("maxQuantity")}
              error={errors?.maxQuantity?.message as string}
            />
          </div>
        </>
      )}

      <div>
        <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
          Maximum Word Count
        </Text>
        <Input
          type="number"
          placeholder="e.g., 1000"
          {...register("maxWordCount")}
          error={errors?.maxWordCount?.message as string}
        />
      </div>
    </FormGroup>
  );
}
