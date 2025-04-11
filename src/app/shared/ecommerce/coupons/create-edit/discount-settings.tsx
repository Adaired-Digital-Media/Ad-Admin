import { Controller, useFormContext } from "react-hook-form";
import { Input } from "rizzui";
import cn from "@/core/utils/class-names";
import FormGroup from "@/app/shared/form-group";
import dynamic from "next/dynamic";
import SelectLoader from "@/core/components/loader/select-loader";
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
      <Controller
        name="discountType"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            label="Discount Type"
            options={discountTypeOptions}
            value={value}
            onChange={onChange}
            getOptionValue={(option) => option.value}
            displayValue={(selected) =>
              discountTypeOptions.find((r) => r.value === selected)?.label ?? ""
            }
            error={errors?.discountType?.message as string}
          />
        )}
      />
      <Input
        label="Discount Value"
        type="number"
        placeholder="e.g., 50"
        {...register("discountValue", { valueAsNumber: true })}
        error={errors?.discountValue?.message as string}
      />
      <Input
        label="Minimum Order Amount"
        type="number"
        placeholder="e.g., 100"
        {...register("minOrderAmount", { valueAsNumber: true })}
        error={errors?.minOrderAmount?.message as string}
      />
      <Input
        label="Maximum Discount Amount"
        type="number"
        placeholder="e.g., 200"
        {...register("maxDiscountAmount", { valueAsNumber: true })}
        error={errors?.maxDiscountAmount?.message as string}
      />
    </FormGroup>
  );
}
