/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useModal } from "@/app/shared/modal-views/use-modal";
import { Form } from "@/core/ui/form";
import cn from "@/core/utils/class-names";
import { FieldType } from "@/core/types";
import { formFieldActionsAtom } from "@/store/atoms/forms.atom";
import {
  CreateFieldInput,
  createFieldSchema,
} from "@/validators/create-field.schema";
import { useAtom } from "jotai";
import { Session } from "next-auth";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { PiPlusBold, PiTrashBold, PiXBold } from "react-icons/pi";
import { ActionIcon, Button, Checkbox, Input, Select, Title } from "rizzui";

const CreateEditField = ({
  session,
  field,
  className,
}: {
  session: Session;
  field?: FieldType;
  className?: string;
}) => {
  const { closeModal } = useModal();
  const [, dispatchAction] = useAtom(formFieldActionsAtom);
  const [isLoading, setLoading] = useState(false);
  const [options, setOptions] = useState<{ value: string; name: string }[]>(
    field?.multipleOptions || []
  );

  const defaultValues: CreateFieldInput = {
    name: field?.name ?? "",
    label: field?.label ?? "",
    inputType: field?.inputType ?? "text",
    inputMinLength: field?.inputMinLength ?? null,
    inputMaxLength: field?.inputMaxLength ?? null,
    inputPlaceholder: field?.inputPlaceholder ?? "",
    inputValidationPattern: field?.inputValidationPattern ?? "",
    inputRequired: field?.inputRequired ?? false,
    customClassName: field?.customClassName ?? "",
    multipleOptions: field?.multipleOptions ?? [],
  };

  const onSubmit = useCallback(
    async (data: CreateFieldInput) => {
      setLoading(true);
      try {
        const accessToken = session?.user?.accessToken || "";
        const payload = {
          name: data.name,
          label: data.label,
          inputType: data.inputType,
          inputMinLength: data.inputMinLength,
          inputMaxLength: data.inputMaxLength,
          inputPlaceholder: data.inputPlaceholder,
          inputValidationPattern: data.inputValidationPattern,
          inputRequired: data.inputRequired,
          customClassName: data.customClassName,
          multipleOptions: options,
        };

        if (field) {
          await dispatchAction({
            type: "updateField",
            token: accessToken,
            payload: { fieldId: field._id, ...payload },
          });
          toast.success("Field updated successfully");
        } else {
          await dispatchAction({
            type: "createField",
            token: accessToken,
            payload,
          });
          toast.success("Field created successfully");
        }
        closeModal();
      } catch (error: any) {
        toast.error(error.message || "Failed to submit field");
        console.error("Field submission error:", error);
      } finally {
        setLoading(false);
      }
    },
    [closeModal, dispatchAction, field, session?.user?.accessToken, options]
  );

  const handleAddOption = () => {
    setOptions([...options, { value: "", name: "" }]);
  };

  const handleOptionChange = (
    index: number,
    key: "value" | "name",
    val: string
  ) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], [key]: val };
    setOptions(updatedOptions);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  return (
    <Form<CreateFieldInput>
      validationSchema={createFieldSchema}
      useFormProps={{
        defaultValues,
      }}
      onSubmit={onSubmit}
      className={cn(
        "grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900 bg-white rounded-lg shadow-md",
        className
      )}
    >
      {({ register, setValue, watch, formState: { errors } }) => (
        <>
          <div className="col-span-full flex items-center justify-between border-b border-gray-200 pb-4">
            <Title as="h4" className="font-semibold text-gray-900">
              {field ? "Edit Field" : "Add Field"}
            </Title>
            <ActionIcon size="sm" variant="text" onClick={closeModal}>
              <PiXBold className="h-auto w-5 text-gray-700" />
            </ActionIcon>
          </div>

          <div className="col-span-1">
            <Input
              label="Label Name *"
              type="text"
              placeholder="e.g. Label Field Name"
              {...register("label")}
              error={errors.label?.message}
              className="w-full"
            />
          </div>
          <div className="col-span-1">
            <Select
              label="Input Type"
              options={[
                { value: "text", label: "Text" },
                { value: "email", label: "Email" },
                { value: "password", label: "Password" },
                { value: "number", label: "Number" },
                { value: "tel", label: "Phone" },
                { value: "url", label: "URL" },
                { value: "select", label: "Select" },
                { value: "checkbox", label: "Checkbox" },
                { value: "radio", label: "Radio" },
                { value: "textarea", label: "Textarea" },
                { value: "file", label: "File" },
                { value: "date", label: "Date" },
                { value: "datetime-local", label: "Date & Time" },
                { value: "time", label: "Time" },
              ]}
              value={watch("inputType")}
              onChange={(option: { value: string; label: string }) =>
                setValue(
                  "inputType",
                  option.value as
                    | "number"
                    | "date"
                    | "text"
                    | "email"
                    | "password"
                    | "tel"
                    | "url"
                    | "select"
                    | "checkbox"
                    | "radio"
                    | "textarea"
                    | "file"
                    | "datetime-local"
                    | "time"
                )
              }
              error={errors.inputType?.message}
              className="w-full"
            />
          </div>
          <div className="col-span-1">
            <Input
              label="Input Name *"
              type="text"
              placeholder="e.g. input_name"
              {...register("name")}
              error={errors.name?.message}
              className="w-full"
            />
          </div>
          <div className="col-span-1">
            <Input
              label="Input Min Length"
              type="number"
              placeholder="Enter min length"
              {...register("inputMinLength", {
                setValueAs: (v) =>
                  v === "" || isNaN(parseInt(v)) ? null : parseInt(v),
              })}
              error={errors.inputMinLength?.message}
              className="w-full"
            />
          </div>
          <div className="col-span-1">
            <Input
              label="Input Max Length"
              type="number"
              placeholder="Enter max length"
              {...register("inputMaxLength", {
                setValueAs: (v) =>
                  v === "" || isNaN(parseInt(v)) ? null : parseInt(v),
              })}
              error={errors.inputMaxLength?.message}
              className="w-full"
            />
          </div>
          <div className="col-span-1">
            <Input
              label="Input Placeholder"
              type="text"
              placeholder="e.g. Enter text here"
              {...register("inputPlaceholder")}
              error={errors.inputPlaceholder?.message}
              className="w-full"
            />
          </div>
          <div className="col-span-1">
            <Select
              label="Input Validation Pattern"
              options={[
                { value: "", label: "None" },
                { value: "email", label: "Email" },
                { value: "url", label: "URL" },
              ]}
              value={watch("inputValidationPattern")}
              onChange={(
                selectedOption: { value: string; label: string } | null
              ) =>
                setValue("inputValidationPattern", selectedOption?.value || "")
              }
              error={errors.inputValidationPattern?.message}
              className="w-full"
            />
          </div>
          <div className="col-span-1 flex items-center place-self-stretch">
            <Checkbox
              label="Input Required"
              {...register("inputRequired")}
              error={errors.inputRequired?.message}
              className="mt-6"
            />
          </div>
          <div className="col-span-full border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="font-medium text-gray-900">
                Multiple Options
              </label>
              <Button variant="outline" onClick={handleAddOption}>
                <PiPlusBold />
              </Button>
            </div>
            {options.map((option, index) => (
              <div
                key={index}
                className="grid grid-cols-7 gap-4 mt-2 items-center"
              >
                <Input
                  placeholder="value"
                  value={option.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleOptionChange(index, "value", e.target.value)
                  }
                  className="col-span-3"
                />
                <Input
                  placeholder="name"
                  value={option.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleOptionChange(index, "name", e.target.value)
                  }
                  className="col-span-3"
                />
                <ActionIcon
                  size="sm"
                  variant="text"
                  onClick={() => handleRemoveOption(index)}
                  className="col-span-1 text-gray-700 hover:text-gray-900 place-self-center"
                >
                  <PiTrashBold className="h-auto w-5" />
                </ActionIcon>
              </div>
            ))}
          </div>
          <div className="col-span-full">
            <Input
              label="Custom Class Name"
              type="text"
              placeholder="e.g. custom-input"
              {...register("customClassName")}
              error={errors.customClassName?.message}
              className="w-full"
            />
          </div>
          <div className="col-span-full flex justify-end  border-gray-200 pt-4">
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-gray-800 text-white hover:bg-gray-900 border-gray-800"
            >
              Save
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default CreateEditField;
