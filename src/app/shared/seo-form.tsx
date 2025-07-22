/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FieldPath, Controller, useFormContext } from "react-hook-form";
import { Button, Input, Select, Textarea } from "rizzui";
import FormGroup from "@/app/shared/form-group";
import UploadZone from "@/core/ui/file-upload/upload-zone";
import { PiTagBold, PiXBold } from "react-icons/pi";
import { useCallback, useEffect, useState } from "react";
import { SeoFormInput } from "@/validators/seo.schema";

type StatusOption = {
  label: string;
  value: string;
};

type RobotsOptions = {
  label: string;
  value: string;
};

const robotsTextOptions: StatusOption[] = [
  { label: "index, follow", value: "index,follow" },
  { label: "noindex, nofollow", value: "noindex,nofollow" },
  { label: "index, nofollow", value: "index,nofollow" },
  { label: "noindex, follow", value: "noindex,follow" },
];

const changeFrequencyOptions: StatusOption[] = [
  { label: "Always", value: "always" },
  { label: "Hourly", value: "hourly" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
  { label: "Never", value: "never" },
];

const redirectTypeOptions: RobotsOptions[] = [
  { label: "301", value: "301" },
  { label: "302", value: "302" },
  { label: "None", value: "null" },
];

interface SEOFormProps {
  className?: string;
  namespace?: string; // e.g., 'seo' for nested fields like 'seo.metaTitle'
}

export default function SEOForm({ className, namespace = "" }: SEOFormProps) {
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<SeoFormInput>();

  const getFieldName = useCallback(
    <TFieldName extends FieldPath<SeoFormInput>>(
      field: TFieldName
    ): TFieldName =>
      namespace ? (`${namespace}.${field}` as TFieldName) : field,
    [namespace]
  );

  const getNestedError = (
    field: FieldPath<SeoFormInput>
  ): string | undefined => {
    const fields = field.split(".");
    let error: any = errors;

    for (const f of fields) {
      if (!error) break;
      error = error[f];
    }

    return error && "message" in error ? (error.message as string) : undefined;
  };

  const initialKeywords = watch(getFieldName("keywords")) || [];
  const initialOpenGraphImage = watch(getFieldName("openGraph.image"));
  const initialTwitterImage = watch(getFieldName("twitterCard.image"));

  const normalizeTags = (tags: string | string[]): string[] => {
    if (typeof tags === "string") {
      return tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
    }
    return Array.isArray(tags) ? tags : [];
  };

  const [keywords, setKeywords] = useState<string[]>(
    normalizeTags(initialKeywords)
  );

  useEffect(() => {
    setValue(getFieldName("keywords"), keywords);
  }, [keywords, setValue, getFieldName]);

  return (
    <>
      {/* Basic SEO Metadata */}
      <FormGroup
        title="Basic SEO Metadata"
        description="Core SEO settings for search engine visibility"
        className={className}
      >
        <Input
          label="Meta Title *"
          placeholder="e.g., Page Meta Title"
          required
          {...register(getFieldName("metaTitle"))}
          error={getNestedError("metaTitle")}
        />
        <Input
          label="Focus Keyword *"
          placeholder="e.g., page topic"
          required
          {...register(getFieldName("focusKeyword"))}
          error={getNestedError("focusKeyword")}
        />
        <div className="col-span-2">
          <Textarea
            label="Meta Description *"
            placeholder="e.g., This is a page about..."
            required
            {...register(getFieldName("metaDescription"))}
            error={getNestedError("metaDescription")}
          />
        </div>
        <Input
          label="Canonical Link *"
          placeholder="e.g., my-page"
          prefix="https://adaired.com/"
          required
          {...register(getFieldName("canonicalLink"))}
          error={getNestedError("canonicalLink")}
        />
        <div>
          <ItemCrud
            label="Keywords"
            name={getFieldName("keywords")}
            items={keywords}
            setItems={setKeywords}
          />
        </div>
      </FormGroup>

      {/* Social Media Metadata */}
      <FormGroup
        title="Social Media Metadata"
        description="Settings for Open Graph and Twitter Card to optimize social sharing"
        className={className}
      >
        <div className="col-span-2">
          <UploadZone
            label="Upload Open Graph Image"
            name={getFieldName("openGraph.image")}
            image={initialOpenGraphImage}
          />
          <span className="text-red-500">
            {getNestedError("openGraph.image")}
          </span>
        </div>

        <Input
          label="Open Graph Title"
          placeholder="e.g., Page OG Title"
          {...register(getFieldName("openGraph.title"))}
          error={getNestedError("openGraph.title")}
        />

        <Input
          label="Open Graph Type"
          placeholder="e.g., article"
          {...register(getFieldName("openGraph.type"))}
          error={getNestedError("openGraph.type")}
        />

        <Textarea
          label="Open Graph Description"
          className="col-span-2"
          placeholder="e.g., This is an Open Graph description..."
          {...register(getFieldName("openGraph.description"))}
          error={getNestedError("openGraph.description")}
        />

        <Input
          label="Open Graph URL"
          type="url"
          placeholder="e.g., https://example.com/my-page"
          {...register(getFieldName("openGraph.url"))}
          error={getNestedError("openGraph.url")}
        />

        <Input
          label="Open Graph Site Name"
          placeholder="e.g., My Site"
          {...register(getFieldName("openGraph.siteName"))}
          error={getNestedError("openGraph.siteName")}
        />

        <div className="col-span-2">
          <UploadZone
            label="Twitter Card Image"
            name={getFieldName("twitterCard.image")}
            image={initialTwitterImage}
          />
          <span className="text-red-500">
            {getNestedError("twitterCard.image")}
          </span>
        </div>

        <Input
          label="Twitter Card Type"
          placeholder="e.g., summary_large_image"
          {...register(getFieldName("twitterCard.cardType"))}
          error={getNestedError("twitterCard.cardType")}
        />

        <Input
          label="Twitter Card Site"
          placeholder="e.g., @MySite"
          {...register(getFieldName("twitterCard.site"))}
          error={getNestedError("twitterCard.site")}
        />

        <Input
          label="Twitter Card Creator"
          placeholder="e.g., @AuthorName"
          {...register(getFieldName("twitterCard.creator"))}
          error={getNestedError("twitterCard.creator")}
        />

        <Input
          label="Twitter Card Title"
          placeholder="e.g., Page Twitter Title"
          {...register(getFieldName("twitterCard.title"))}
          error={getNestedError("twitterCard.title")}
        />

        <Textarea
          label="Twitter Card Description"
          className="col-span-2"
          placeholder="e.g., This is a Twitter card description..."
          {...register(getFieldName("twitterCard.description"))}
          error={getNestedError("twitterCard.description")}
        />
      </FormGroup>

      {/* Sitemap Settings */}
      <FormGroup
        title="Sitemap Settings"
        description="Control how search engines crawl and prioritize this page"
        className={className}
      >
        <Controller
          name={getFieldName("robotsText")}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              label="Robots Text"
              value={value}
              options={robotsTextOptions}
              onChange={onChange}
              placeholder="e.g., index,follow"
              getOptionValue={(option) => option.value}
              displayValue={(selected) =>
                robotsTextOptions.find((s) => s.value === selected)?.label ??
                "index,follow"
              }
              error={getNestedError("robotsText")}
            />
          )}
        />

        <Input
          label="Priority"
          type="number"
          step="0.1"
          min="0"
          max="1"
          placeholder="e.g., 0.5"
          {...register(getFieldName("priority"), { valueAsNumber: true })}
          error={getNestedError("priority")}
        />

        <Controller
          name={getFieldName("changeFrequency")}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              label="Change Frequency"
              value={value}
              options={changeFrequencyOptions}
              onChange={onChange}
              placeholder="e.g., monthly"
              getOptionValue={(option) => option.value}
              displayValue={(selected) =>
                changeFrequencyOptions.find((s) => s.value === selected)
                  ?.label ?? "monthly"
              }
              error={getNestedError("changeFrequency")}
            />
          )}
        />
      </FormGroup>

      {/* Custom Scripts */}
      <FormGroup
        title="Custom Scripts"
        description="Add custom scripts to the page's header, body, or footer"
        className={className}
      >
        <Textarea
          label="Header Script"
          placeholder="e.g., <script>...</script>"
          {...register(getFieldName("headerScript"))}
          error={getNestedError("headerScript")}
        />

        <Textarea
          label="Body Script"
          placeholder="e.g., <script>...</script>"
          {...register(getFieldName("bodyScript"))}
          error={getNestedError("bodyScript")}
        />

        <Textarea
          label="Footer Script"
          placeholder="e.g., <script>...</script>"
          {...register(getFieldName("footerScript"))}
          error={getNestedError("footerScript")}
        />
      </FormGroup>

      {/* Redirect Settings */}
      <FormGroup
        title="Redirect Settings"
        description="Configure redirects for this page"
        className={className}
      >
        <Controller
          name={getFieldName("redirect.type")}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              label="Redirect Type"
              value={value}
              options={redirectTypeOptions}
              onChange={onChange}
              placeholder="e.g., None"
              getOptionValue={(option) => option.value}
              displayValue={(selected) =>
                redirectTypeOptions.find((s) => s.value === selected)?.label ??
                "None"
              }
              error={getNestedError("redirect.type")}
            />
          )}
        />

        <Input
          type="url"
          label="Redirect URL"
          placeholder="e.g., https://example.com/new-page"
          {...register(getFieldName("redirect.url"))}
          error={getNestedError("redirect.url")}
        />
      </FormGroup>

      {/* Schema.org */}
      <FormGroup
        title="Schema.org"
        description="Structured data for search engine optimization (auto-generated, editable)"
        className={className}
      >
        <Textarea
          className="col-span-2"
          label="Schema.org JSON"
          placeholder='e.g., {"@context": "https://schema.org", "@type": "Article"}'
          {...register(getFieldName("schemaOrg"))}
          error={getNestedError("schemaOrg")}
        />
      </FormGroup>
    </>
  );
}

interface ItemCrudProps {
  label: string;
  name: string;
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
}

function ItemCrud({
  label,
  name,
  items,
  setItems,
}: ItemCrudProps): JSX.Element {
  const { register, setValue } = useFormContext();
  const [itemText, setItemText] = useState<string>("");

  function handleItemAdd(): void {
    if (itemText.trim() !== "") {
      const newItem: string = itemText;
      setItems([...items, newItem]);
      setValue(name, [...items, newItem]);
      setItemText("");
    }
  }

  function handleItemRemove(text: string): void {
    const updatedItems = items.filter((item) => item !== text);
    setItems(updatedItems);
    setValue(name, updatedItems);
  }

  return (
    <div>
      <div className="flex items-end">
        <Input
          label={label}
          value={itemText}
          placeholder={`Enter a ${name.split(".").pop()}`}
          onChange={(e) => setItemText(e.target.value)}
          prefix={<PiTagBold className="h-4 w-4" />}
          className="w-full"
        />
        <input type="hidden" {...register(name, { value: items })} />
        <Button
          onClick={handleItemAdd}
          className="ms-4 shrink-0 text-sm @lg:ms-5"
        >
          Add {name.split(".").pop()}
        </Button>
      </div>
      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((text, index) => (
            <div
              key={index}
              className="flex items-center rounded-full border border-gray-300 py-1 pe-2.5 ps-3 text-sm font-medium text-gray-700"
            >
              {text}
              <button
                type="button"
                onClick={() => handleItemRemove(text)}
                className="ps-2 text-gray-500 hover:text-gray-900"
              >
                <PiXBold className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
