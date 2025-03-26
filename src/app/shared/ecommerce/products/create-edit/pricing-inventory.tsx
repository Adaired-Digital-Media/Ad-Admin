import FormGroup from "@/app/shared/form-group";
import cn from "@core/utils/class-names";
import { Controller, useFormContext } from "react-hook-form";
import { Input, Select } from "rizzui";

interface PricingInventoryProps {
  className?: string;
}

export default function ProductPricingInventory({
  className,
}: PricingInventoryProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const pricingTypes = [
    {
      value: "perWord",
      label: "Per Word",
    },
    {
      value: "perPost",
      label: "Per Post",
    },
    {
      value: "perReview",
      label: "Per Review",
    },
    {
      value: "perMonth",
      label: "Per Month",
    },
    {
      value: "perQuantity",
      label: "Per Quantity",
    },
  ];

  return (
    <>
      <FormGroup
        title="Pricing"
        description="Add your product pricing here"
        className={cn(className)}
      >
        <Input
          type="number"
          label="Minimum Quantity"
          placeholder="1"
          {...register("minimumQuantity", { valueAsNumber: true })}
          error={errors?.minimumQuantity?.message as string}
        />
        <Input
          type="number"
          label="Minimum Words"
          placeholder="100"
          {...register("minimumWords", { valueAsNumber: true })}
          error={errors?.minimumWords?.message as string}
        />
        <Input
          label="Price / Unit"
          placeholder="10"
          {...register("pricePerUnit", { valueAsNumber: true })}
          error={errors.pricePerUnit?.message as string}
          prefix={"$"}
          type="text"
        />
        <Controller
          name="pricingType"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              //   dropdownClassName="!z-0"
              options={pricingTypes}
              value={value}
              onChange={onChange}
              label="Pricing Type"
              error={errors?.category?.message as string}
              getOptionValue={(option) => option.value}
              displayValue={(value) =>
                pricingTypes.find((p) => p.value === value)?.label
              }
            />
          )}
        />
      </FormGroup>
      <FormGroup
        title="Inventory"
        description="Add your product inventory info here"
        className={cn(className)}
      >
        <Input
          type="number"
          label="Stock"
          placeholder="100"
          {...register("stock", { valueAsNumber: true })}
          error={errors.stock?.message as string}
        />
      </FormGroup>
    </>
  );
}
