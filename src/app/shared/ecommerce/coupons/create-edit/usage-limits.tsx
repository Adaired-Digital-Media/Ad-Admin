import { useFormContext } from "react-hook-form";
import { Input } from "rizzui";
import cn from "@/core/utils/class-names";
import FormGroup from "@/app/shared/form-group";

export default function UsageLimits({ className }: { className?: string }) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormGroup
      title="Usage Limits"
      description="Restrict how often the coupon can be used"
      className={cn(className)}
    >
      <Input
        label="Usage Limit Per User"
        type="number"
        placeholder="e.g., 1"
        {...register("usageLimitPerUser", { valueAsNumber: true })}
        error={errors?.usageLimitPerUser?.message as string}
      />
      <Input
        label="Total Usage Limit"
        type="number"
        placeholder="e.g., 1000"
        {...register("totalUsageLimit", { valueAsNumber: true })}
        error={errors?.totalUsageLimit?.message as string}
      />
    </FormGroup>
  );
}