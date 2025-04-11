import { Controller, useFormContext } from "react-hook-form";
import { Input } from "rizzui";
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
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
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
      <Input
        label="Code"
        placeholder="e.g., BUY100FLAT50"
        {...register("code")}
        error={errors?.code?.message as string}
      />
      <Controller
        name="status"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            label="Status"
            options={statusOptions}
            value={value}
            onChange={(selected: StatusOption) => onChange(selected?.value)}
            getOptionValue={(option) => option.value}
            displayValue={(selected) =>
              statusOptions.find((s) => s.value === selected)?.label ?? ""
            }
            error={errors?.status?.message as string}
          />
        )}
      />
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
            inputProps={{ label: "Expires At" }}
          />
        )}
      />
    </FormGroup>
  );
}
