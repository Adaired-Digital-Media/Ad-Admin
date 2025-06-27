/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import prettyBytes from "pretty-bytes";
import { useEffect, useState } from "react";
import { PiTrashBold } from "react-icons/pi";
import { Text, FieldError, Input } from "rizzui";
import cn from "../../utils/class-names";
import UploadIcon from "../../components/shape/upload";
import { endsWith } from "lodash";
import {
  FieldValues,
  Path,
  useFormContext,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { CloudinaryFile } from "@/core/types";
import { useModal } from "@/app/shared/modal-views/use-modal";
import FileSelectorModalView from "@/app/shared/file/selector/file-selector-model-view";
import { ProfileFormTypes } from "@/validators/profile-settings.schema";

// Define props interface to include optional form methods
interface UploadZoneProps<T extends FieldValues = ProfileFormTypes> {
  label?: string;
  name: Path<T>;
  className?: string;
  error?: string;
  image?: string;
  register?: UseFormRegister<T>;
  watch?: UseFormWatch<T>;
  setValue?: UseFormSetValue<T>;
  getValues?: UseFormGetValues<T>
}

export default function UploadZone<T extends FieldValues>({
  label,
  name = "image" as Path<T>,
  className,
  error,
  image,
  register: registerProp,
  watch: watchProp,
  setValue: setValueProp,
}: UploadZoneProps<T>) {
  const { openModal } = useModal();

  // Use useFormContext only if no props are provided
  const formContext = useFormContext<T>();
  const register = registerProp || formContext?.register;
  const watch = watchProp || formContext?.watch;
  const setValue = setValueProp || formContext?.setValue;

  const selectedImage = watch?.(name);
  const [selectedFile, setSelectedFile] = useState<CloudinaryFile | null>(null);

  useEffect(() => {
    if (image && !selectedFile) {
      fetch(image, { method: "HEAD" })
        .then((res) => {
          const bytes = res.headers.get("Content-Length") || 0;
          setSelectedFile({
            secure_url: image,
            filename:
              decodeURI(
                (image?.split("/").pop() ?? "")
                  .split(".")
                  .slice(0, -1)
                  .join(".")
              ) || "Default Image",
            bytes: Number(bytes),
            context: {
              caption:
                decodeURI(
                  (image?.split("/").pop() ?? "")
                    .split(".")
                    .slice(0, -1)
                    .join(".")
                ) || "Default Image",
            },
          } as CloudinaryFile);
        })
        .catch((err) => {
          console.error("Error fetching image size:", err);
          setSelectedFile({
            secure_url: image,
            filename:
              decodeURI(
                (image?.split("/").pop() ?? "")
                  .split(".")
                  .slice(0, -1)
                  .join(".")
              ) || "Default Image",
            bytes: 0,
            context: {
              caption:
                decodeURI(
                  (image?.split("/").pop() ?? "")
                    .split(".")
                    .slice(0, -1)
                    .join(".")
                ) || "Default Image",
            },
          } as CloudinaryFile);
        });
    }
  }, [image, selectedFile]);

  const handleImageSelect = (image: CloudinaryFile) => {
    setSelectedFile(image);
    setValue?.(name, image.secure_url as any);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setValue?.(name, "" as any);
  };

  return (
    <div className={cn("grid @container", className)}>
      {label && <span className="mb-1.5 block text-gray-900">{label}</span>}

      {/* Hidden input to store the selected image URL */}
      {register && <Input type="text" {...register(name)} className="hidden" />}
      {!selectedImage && (
        <div
          className={cn(
            "rounded-md border-[1.8px] cursor-pointer",
            error && "border-red-500"
          )}
          onClick={() =>
            openModal({
              view: <FileSelectorModalView onImageSelect={handleImageSelect} />,
              size: "xl",
            })
          }
        >
          <div
            className={cn("flex justify-center items-center gap-4 px-6 py-5")}
          >
            <UploadIcon className="h-12 w-12" />
            <Text className="text-base font-medium">Select file</Text>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="mt-1 grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))]">
          <div className="relative">
            <figure className="group relative h-40 rounded-md bg-gray-50">
              <MediaPreview
                name={
                  selectedFile?.context?.caption || selectedFile?.filename || ""
                }
                url={selectedFile?.secure_url || ""}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute right-2 top-2 rounded-full bg-gray-700/70 p-1.5 opacity-20 transition duration-300 hover:bg-red-dark group-hover:opacity-100"
              >
                <PiTrashBold className="text-white" />
              </button>
            </figure>
            <MediaCaption
              name={selectedFile?.filename || ""}
              size={selectedFile?.bytes || 0}
            />
          </div>
        </div>
      )}

      {error && <FieldError error={error} />}
    </div>
  );
}

function MediaPreview({ name, url }: { name: string; url: string }) {
  if (!url) return null;
  return endsWith(name.toLowerCase(), ".pdf") ? (
    <object data={url} type="application/pdf" width="100%" height="100%">
      <p>
        Alternative text - include a link <a href={url}>to the PDF!</a>
      </p>
    </object>
  ) : (
    <Image
      fill
      src={url}
      alt={name}
      className="transform rounded-md object-contain"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={false}
    />
  );
}

function MediaCaption({ name, size }: { name: string; size: number }) {
  const fileSize = size ?? 0;
  return (
    <div className="mt-1 text-xs">
      <p className="break-words font-medium text-gray-700">{name}</p>
      <p className="mt-1 font-mono">{prettyBytes(fileSize)}</p>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
          <stop stopColor="#fff" stopOpacity="0" offset="0%" />
          <stop stopColor="#fff" stopOpacity=".631" offset="63.146%" />
          <stop stopColor="#fff" offset="100%" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)">
          <path
            d="M36 18c0-9.94-8.06-18-18-18"
            id="Oval-2"
            stroke="url(#a)"
            strokeWidth="2"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </path>
          <circle fill="#fff" cx="36" cy="18" r="1">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </g>
    </svg>
  );
}
