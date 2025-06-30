import { Controller, useFormContext } from "react-hook-form";
import { Input, Text } from "rizzui";
import cn from "@/core/utils/class-names";
import FormGroup from "@/app/shared/form-group";
import dynamic from "next/dynamic";
import SelectLoader from "@/core/components/loader/select-loader";
import { PiCurrencyDollarDuotone } from "react-icons/pi";
const Select = dynamic(() => import("rizzui").then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});

const discountTypeOptions = [
  { label: "Percentage", value: "percentage" },
  { label: "Flat", value: "flat" },
];

export default function DiscountSettings({
  className,
}: {
  className?: string;
}) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormGroup
      title="Discount Settings"
      description="Configure the discount and monetary limits"
      className={cn(className)}
    >
      <div>
        <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
          Discount Type
          <span className="text-red-500"> *</span>
        </Text>
        <Controller
          name="discountType"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              options={discountTypeOptions}
              value={value}
              onChange={onChange}
              getOptionValue={(option) => option.value}
              displayValue={(selected) =>
                discountTypeOptions.find((r) => r.value === selected)?.label ??
                ""
              }
              error={errors?.discountType?.message as string}
            />
          )}
        />
      </div>

      <div>
        <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
          Discount Value
          <span className="text-red-500"> *</span>
        </Text>
        <Input
          type="number"
          placeholder="e.g., 50"
          {...register("discountValue", { valueAsNumber: true })}
          error={errors?.discountValue?.message as string}
        />
      </div>

      <div>
        <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
          Minimum Order Amount
        </Text>
        <Input
          type="number"
          prefix={<PiCurrencyDollarDuotone className="w-5" />}
          suffix=".00"
          placeholder="e.g., 100"
          {...register("minOrderAmount")}
          error={errors?.minOrderAmount?.message as string}
        />
      </div>

      <div>
        <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
          Maximum Discount Amount
        </Text>
        <Input
          type="number"
          prefix={<PiCurrencyDollarDuotone className="w-5" />}
          suffix=".00"
          placeholder="e.g., 200"
          {...register("maxDiscountAmount", { valueAsNumber: true })}
          error={errors?.maxDiscountAmount?.message as string}
        />
      </div>
    </FormGroup>
  );
}
