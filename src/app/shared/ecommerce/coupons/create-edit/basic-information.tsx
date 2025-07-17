import { Controller, useFormContext } from "react-hook-form";
import { Input, Text } from "rizzui";
import cn from "@/core/utils/class-names";
import FormGroup from "@/app/shared/form-group";
import dynamic from "next/dynamic";
import SelectLoader from "@/core/components/loader/select-loader";
import { DatePicker } from "@/core/ui/datepicker";
const Select = dynamic(() => import("rizzui").then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});

// Define the type for status options
type StatusOption = {
  label: string;
  value: string;
};

const statusOptions: StatusOption[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function BasicInformation({
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
      title="Basic Information"
      description="Set the coupon's core details"
      className={cn(className)}
    >
      <div>
        <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
          Code
          <span className="text-red-500"> *</span>
        </Text>
        <Input
          placeholder="e.g., BUY100FLAT50"
          required
          {...register("code")}
          error={errors?.code?.message as string}
        />
      </div>

      <div>
        <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
          Status
        </Text>
        <Controller
          name="status"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              value={value}
              options={statusOptions}
              onChange={onChange}
              getOptionValue={(option) => option.value}
              displayValue={(selected) =>
                statusOptions.find((s) => s.value === selected)?.label ?? ""
              }
              error={errors?.status?.message as string}
            />
          )}
        />
      </div>

      <div>
        <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
          Expires At
        </Text>
        <Controller
          name="expiresAt"
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
            />
          )}
        />
      </div>
    </FormGroup>
  );
}
