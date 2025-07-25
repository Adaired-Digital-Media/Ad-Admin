/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { RadioGroup, AdvancedRadio } from "rizzui";
import { PiCheckCircleFill } from "react-icons/pi";
import FormGroup from "@/app/shared/form-group";
import { useApiCall } from "@/core/utils/api-config";
import cn from "@/core/utils/class-names";
import SelectLoader from "@core/components/loader/select-loader";
import dynamic from "next/dynamic";
import { ProductFormValues } from "@/validators/create-product.schema";
const Select = dynamic(() => import("rizzui").then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});
import { SelectOption } from "rizzui";

interface ProductIdentifiersProps {
  className?: string;
}

const statusOptions: SelectOption[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived" },
  { label: "Out of Stock", value: "out of stock" },
];

export default function CustomFields({ className }: ProductIdentifiersProps) {
  const { apiCall, sessionStatus } = useApiCall();
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [forms, setForms] = useState<any>([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await apiCall<{
          forms: ProductFormValues[] | undefined;
        }>({
          url: "/product/form/read-form?status=active",
          method: "GET",
        });
        if (response.status === 200) {
          setForms(response.data.forms || []);
        }
      } catch (error) {
        console.error("Failed to fetch forms:", error);
        setForms([]);
      }
    };

    // Only fetch if sessionStatus is not "loading"
    if (sessionStatus !== "loading") {
      fetchForms();
    }
  }, [apiCall, sessionStatus]);

  return (
    <>
      <FormGroup
        title="Custom Fields"
        description="Add custom fields to your product"
        className={cn(className)}
      >
        <Controller
          name="formId"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              dropdownClassName="h-auto"
              options={
                forms?.map((form: any) => ({
                  value: form._id,
                  label: form.productType || form.title,
                })) || []
              }
              value={value}
              onChange={onChange}
              optionClassName=" capitalize"
              label="Form Type"
              error={errors?.formId?.message as string}
              getOptionValue={(option) => option.value}
              placeholder="Select a form type"
              displayValue={(selectedValue: string) =>
                forms.length > 0
                  ? forms.find((f: any) => f._id === selectedValue)
                      ?.productType ||
                    forms.find((f: any) => f._id === selectedValue)?.title
                  : ""
              }
              selectClassName="capitalize"
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              dropdownClassName="h-auto"
              options={statusOptions.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
              value={value}
              onChange={onChange}
              label="Status"
              error={errors?.status?.message as string}
              getOptionValue={(option) => option.value}
              displayValue={(selected) =>
                statusOptions.find((s) => s.value === selected)?.label ??
                "active"
              }
              placeholder="Select product status"
            />
          )}
        />
      </FormGroup>
      <FormGroup
        title="Product Type"
        description="Choose the type of product"
        className={cn(className)}
      >
        <Controller
          name="isFreeProduct"
          control={control}
          render={({ field: { value, onChange } }) => (
            <RadioGroup
              value={value === true ? "true" : "false"}
              setValue={(val) => onChange(val === "true")}
              className="col-span-full grid gap-4 @lg:grid-cols-2"
            >
              <AdvancedRadio
                value="true"
                className="[&_.rizzui-advanced-checkbox]:!px-5 [&_.rizzui-advanced-checkbox]:!py-4"
                inputClassName="[&~span]:border-0 [&~span]:ring-1 [&~span]:ring-gray-200 [&~span:hover]:ring-primary [&:checked~span:hover]:ring-primary [&:checked~span]:border-1 [&:checked~.rizzui-advanced-checkbox]:ring-2 [&~span_.icon]:opacity-0 [&:checked~span_.icon]:opacity-100"
              >
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">
                    Free Product
                  </span>
                  <PiCheckCircleFill className="icon h-5 w-5 text-primary" />
                </div>
                <p className="text-gray-500">Demo product with no cost</p>
              </AdvancedRadio>
              <AdvancedRadio
                value="false"
                className="[&_.rizzui-advanced-checkbox]:!px-5 [&_.rizzui-advanced-checkbox]:!py-4"
                inputClassName="[&~span]:border-0 [&~span]:ring-1 [&~span]:ring-gray-200 [&~span:hover]:ring-primary [&:checked~span:hover]:ring-primary [&:checked~span]:border-1 [&:checked~.rizzui-advanced-checkbox]:ring-2 [&~span_.icon]:opacity-0 [&:checked~span_.icon]:opacity-100"
              >
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">
                    Paid Product
                  </span>
                  <PiCheckCircleFill className="icon h-5 w-5 text-primary" />
                </div>
                <p className="text-gray-500">Product for sale</p>
              </AdvancedRadio>
            </RadioGroup>
          )}
        />
      </FormGroup>
    </>
  );
}
