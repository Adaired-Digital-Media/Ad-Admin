/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { Input } from "rizzui";
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
  type: "text" | "image";
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
          className="h-32 w-full rounded object-cover"
        />
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

interface GallerySectionProps {
  className?: string;
  namespace?: string;
  formMethods: UseFormReturn<any>;
}

export default function GallerySection({
  className,
  namespace = "",
  formMethods,
}: GallerySectionProps) {
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
      title="Gallery Section"
      description="Display a collection of images with captions"
      className={cn(className, "grid grid-cols-1 md:grid-cols-3 gap-6")}
    >
      <div>
        <EditableField
          name={getFieldName("image1.src")}
          label="Image 1"
          type="image"
          value={formMethods.watch(getFieldName("image1.src")) || ""}
          onSave={(value) =>
            formMethods.setValue(getFieldName("image1.src"), value)
          }
          formMethods={formMethods}
        />
        <span className="text-red-500">
          {getNestedError(getFieldName("image1.src"))}
        </span>
        <EditableField
          name={getFieldName("image1.caption")}
          label="Image 1 Caption"
          type="text"
          value={formMethods.watch(getFieldName("image1.caption")) || ""}
          onSave={(value) =>
            formMethods.setValue(getFieldName("image1.caption"), value)
          }
          formMethods={formMethods}
        />
        <span className="text-red-500">
          {getNestedError(getFieldName("image1.caption"))}
        </span>
      </div>
      <div>
        <EditableField
          name={getFieldName("image2.src")}
          label="Image 2"
          type="image"
          value={formMethods.watch(getFieldName("image2.src")) || ""}
          onSave={(value) =>
            formMethods.setValue(getFieldName("image2.src"), value)
          }
          formMethods={formMethods}
        />
        <span className="text-red-500">
          {getNestedError(getFieldName("image2.src"))}
        </span>
        <EditableField
          name={getFieldName("image2.caption")}
          label="Image 2 Caption"
          type="text"
          value={formMethods.watch(getFieldName("image2.caption")) || ""}
          onSave={(value) =>
            formMethods.setValue(getFieldName("image2.caption"), value)
          }
          formMethods={formMethods}
        />
        <span className="text-red-500">
          {getNestedError(getFieldName("image2.caption"))}
        </span>
      </div>
      <div>
        <EditableField
          name={getFieldName("image3.src")}
          label="Image 3"
          type="image"
          value={formMethods.watch(getFieldName("image3.src")) || ""}
          onSave={(value) =>
            formMethods.setValue(getFieldName("image3.src"), value)
          }
          formMethods={formMethods}
        />
        <span className="text-red-500">
          {getNestedError(getFieldName("image3.src"))}
        </span>
        <EditableField
          name={getFieldName("image3.caption")}
          label="Image 3 Caption"
          type="text"
          value={formMethods.watch(getFieldName("image3.caption")) || ""}
          onSave={(value) =>
            formMethods.setValue(getFieldName("image3.caption"), value)
          }
          formMethods={formMethods}
        />
        <span className="text-red-500">
          {getNestedError(getFieldName("image3.caption"))}
        </span>
      </div>
    </FormGroup>
  );
}
