import { useFormContext } from "react-hook-form";
import { Input, Text } from "rizzui";
import cn from "@/core/utils/class-names";
import FormGroup from "@/app/shared/form-group";

export default function UsageLimits({ className }: { className?: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormGroup
      title="Usage Limits"
      description="Restrict how often the coupon can be used"
      className={cn(className)}
    >
      <div>
        <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
          Usage Limit Per User
        </Text>
        <Input
          type="number"
          placeholder="e.g., 1"
          {...register("usageLimitPerUser")}
          error={errors?.usageLimitPerUser?.message as string}
        />
      </div>

      <div>
        <Text className={cn(`block pb-1.5 font-normal text-[#515151]`)}>
          Total Usage Limit
        </Text>
        <Input
          type="number"
          placeholder="e.g., 1000"
          {...register("totalUsageLimit")}
          error={errors?.totalUsageLimit?.message as string}
        />
      </div>
    </FormGroup>
  );
}
