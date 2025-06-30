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
          height={100}
          width={100}
          src={value}
          alt={label}
          className="h-20 w-20 rounded-full object-cover"
        />
      );
    }
    if (type === "textarea") {
      return (
        <p className="whitespace-pre-wrap italic">{value || `No ${label}`}</p>
      );
    }
    return <h4 className="text-base font-medium">{value || `No ${label}`}</h4>;
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

interface TestimonialSectionProps {
  className?: string;
  namespace?: string;
  formMethods: UseFormReturn<any>;
}

export default function TestimonialSection({
  className,
  namespace = "",
  formMethods,
}: TestimonialSectionProps) {
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
      title="Testimonial Section"
      description="Showcase client testimonials with photos"
      className={cn(className, "grid grid-cols-1 md:grid-cols-2 gap-6")}
    >
      <div className="border rounded-lg p-4">
        <EditableField
          name={getFieldName("testimonial1.name")}
          label="Testimonial 1 Name"
          type="text"
          value={formMethods.watch(getFieldName("testimonial1.name")) || ""}
          onSave={(value) =>
            formMethods.setValue(getFieldName("testimonial1.name"), value)
          }
          formMethods={formMethods}
        />
        <span className="text-red-500">
          {getNestedError(getFieldName("testimonial1.name"))}
        </span>
        <EditableField
          name={getFieldName("testimonial1.quote")}
          label="Testimonial 1 Quote"
          type="textarea"
          value={formMethods.watch(getFieldName("testimonial1.quote")) || ""}
          onSave={(value) =>
            formMethods.setValue(getFieldName("testimonial1.quote"), value)
          }
          formMethods={formMethods}
        />
        <span className="text-red-500">
          {getNestedError(getFieldName("testimonial1.quote"))}
        </span>
        <EditableField
          name={getFieldName("testimonial1.photo")}
          label="Testimonial 1 Photo"
          type="image"
          value={formMethods.watch(getFieldName("testimonial1.photo")) || ""}
          onSave={(value) =>
            formMethods.setValue(getFieldName("testimonial1.photo"), value)
          }
          formMethods={formMethods}
        />
        <span className="text-red-500">
          {getNestedError(getFieldName("testimonial1.photo"))}
        </span>
      </div>
      <div className="border rounded-lg p-4">
        <EditableField
          name={getFieldName("testimonial2.name")}
          label="Testimonial 2 Name"
          type="text"
          value={formMethods.watch(getFieldName("testimonial2.name")) || ""}
          onSave={(value) =>
            formMethods.setValue(getFieldName("testimonial2.name"), value)
          }
          formMethods={formMethods}
        />
        <span className="text-red-500">
          {getNestedError(getFieldName("testimonial2.name"))}
        </span>
        <EditableField
          name={getFieldName("testimonial2.quote")}
          label="Testimonial 2 Quote"
          type="textarea"
          value={formMethods.watch(getFieldName("testimonial2.quote")) || ""}
          onSave={(value) =>
            formMethods.setValue(getFieldName("testimonial2.quote"), value)
          }
          formMethods={formMethods}
        />
        <span className="text-red-500">
          {getNestedError(getFieldName("testimonial2.quote"))}
        </span>
        <EditableField
          name={getFieldName("testimonial2.photo")}
          label="Testimonial 2 Photo"
          type="image"
          value={formMethods.watch(getFieldName("testimonial2.photo")) || ""}
          onSave={(value) =>
            formMethods.setValue(getFieldName("testimonial2.photo"), value)
          }
          formMethods={formMethods}
        />
        <span className="text-red-500">
          {getNestedError(getFieldName("testimonial2.photo"))}
        </span>
      </div>
    </FormGroup>
  );
}
