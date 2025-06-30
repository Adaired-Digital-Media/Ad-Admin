/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Controller, UseFormReturn } from "react-hook-form";
import { Input, Textarea } from "rizzui";
import FormGroup from "@/app/shared/form-group";
import UploadZone from "@/core/ui/file-upload/upload-zone";
import { useCallback, useState, useEffect, useRef } from "react";
import { PiPencilSimpleBold } from "react-icons/pi";
import cn from "@/core/utils/class-names";
import Image from "next/image";

interface EditableSectionProps {
  className?: string;
  namespace?: string;
  formMethods: UseFormReturn<any>;
}

interface EditableFieldProps {
  name: string;
  value: string;
  label: string;
  type: "text" | "textarea" | "image";
  onSave: (value: string) => void;
  formMethods: UseFormReturn<any>;
}

function EditableField({
  name,
  value,
  label,
  type,
  onSave,
  formMethods,
}: EditableFieldProps) {
  const { watch, control } = formMethods;
  const [isEditing, setIsEditing] = useState(false);
  const currentValue = watch(name);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
      }
    }

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  useEffect(() => {
    if (type === "image" && currentValue !== value) {
      onSave(currentValue || "");
      setIsEditing(false);
    }
  }, [currentValue, value, type, onSave]);

  const renderDisplay = () => {
    if (type === "image" && value) {
      return (
        <Image
          src={value}
          alt={label}
          height={50}
          width={50}
          className="h-32 w-auto rounded object-cover"
        />
      );
    }
    if (type === "textarea") {
      return <p className="whitespace-pre-wrap">{value || `No ${label}`}</p>;
    }
    return <h3 className="text-lg font-medium">{value || `No ${label}`}</h3>;
  };

  return (
    <div
      ref={wrapperRef}
      className="relative cursor-pointer group"
      onClick={() => setIsEditing(true)}
    >
      {!isEditing ? (
        <>
          {renderDisplay()}
          <span className="absolute top-0 right-0 hidden group-hover:block text-gray-500">
            <PiPencilSimpleBold className="h-4 w-4" />
          </span>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          {type === "image" ? (
            <UploadZone label={label} name={name} image={value} />
          ) : type === "textarea" ? (
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <Textarea
                  label={label}
                  value={field.value as string}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={(e) => {
                    onSave(e.target.value);
                    setIsEditing(false);
                  }}
                  autoFocus
                />
              )}
            />
          ) : (
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <Input
                  label={label}
                  value={field.value as string}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={(e) => {
                    onSave(e.target.value);
                    setIsEditing(false);
                  }}
                  autoFocus
                />
              )}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function EditableSection({
  className,
  namespace = "",
  formMethods,
}: EditableSectionProps) {
  const {
    formState: { errors },
  } = formMethods;

  const getFieldName = useCallback(
    (field: string): string => (namespace ? `${namespace}.${field}` : field),
    [namespace]
  );

  const getNestedError = (field: string) => {
    const fields = field.split(".");
    let error: any = errors;

    for (const f of fields) {
      if (!error) break;
      error = error[f];
    }

    return error && error.message ? (error.message as string) : undefined;
  };

  return (
    <FormGroup
      title="Editable Section"
      description="Click any field to edit content inline"
      className={cn(className)}
    >
      <EditableField
        name={getFieldName("title")}
        label="Section Title"
        type="text"
        value={formMethods.watch(getFieldName("title")) || ""}
        onSave={(value) => formMethods.setValue(getFieldName("title"), value)}
        formMethods={formMethods}
      />
      <span className="text-red-500">
        {getNestedError(getFieldName("title"))}
      </span>

      <EditableField
        name={getFieldName("description")}
        label="Section Description"
        type="textarea"
        value={formMethods.watch(getFieldName("description")) || ""}
        onSave={(value) =>
          formMethods.setValue(getFieldName("description"), value)
        }
        formMethods={formMethods}
      />
      <span className="text-red-500">
        {getNestedError(getFieldName("description"))}
      </span>

      <EditableField
        name={getFieldName("image")}
        label="Section Image"
        type="image"
        value={formMethods.watch(getFieldName("image")) || ""}
        onSave={(value) => formMethods.setValue(getFieldName("image"), value)}
        formMethods={formMethods}
      />
      <span className="text-red-500">
        {getNestedError(getFieldName("image"))}
      </span>
    </FormGroup>
  );
}
