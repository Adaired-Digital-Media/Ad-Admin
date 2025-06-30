import { useFormContext } from "react-hook-form";
import { Button, Input } from "rizzui";
import cn from "@core/utils/class-names";
import FormGroup from "@/app/shared/form-group";
import { PiTagBold, PiXBold } from "react-icons/pi";
import { useState } from "react";

export default function ProductSeo({ className }: { className?: string }) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  // Watch initial tags and keywords from form state
  const initialTags = watch("tags") || [];
  const initialKeywords = watch("keywords") || [];

  const [tags, setTags] = useState<string[]>(initialTags);
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  return (
    <>
      <FormGroup
        title="SEO"
        description="Optimize your product for search engines"
        className={cn(className)}
      >
        <Input
          label="Meta Title"
          placeholder="Meta Title"
          {...register("metaTitle")}
          error={errors.metaTitle?.message as string}
        />
        <Input
          label="Meta Description"
          placeholder="Meta Description"
          {...register("metaDescription")}
          error={errors.metaDescription?.message as string}
        />
        <Input
          label="Canonical URL"
          placeholder="Canonical URL"
          {...register("canonicalLink")}
          error={errors.canonicalLink?.message as string}
        />
        <Input
          label="Priority"
          placeholder="Priority"
          {...register("priority", { valueAsNumber: true })}
          error={errors.priority?.message as string}
        />
      </FormGroup>
      <FormGroup
        title="Product Tags & Keywords"
        description="Add tags and keywords to help users find your product"
        className={cn(className)}
      >
        <ItemCrud name="tags" items={tags} setItems={setTags} />
        <ItemCrud name="keywords" items={keywords} setItems={setKeywords} />
      </FormGroup>
    </>
  );
}

interface ItemCrudProps {
  name: string;
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
}

function ItemCrud({ name, items, setItems }: ItemCrudProps): JSX.Element {
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
  }

  return (
    <div>
      <div className="flex items-center">
        <Input
          value={itemText}
          placeholder={`Enter a ${name}`}
          onChange={(e) => setItemText(e.target.value)}
          prefix={<PiTagBold className="h-4 w-4" />}
          className="w-full"
        />
        <input type="hidden" {...register("tags", { value: items })} />
        <Button
          onClick={handleItemAdd}
          className="ms-4 shrink-0 text-sm @lg:ms-5"
        >
          Add {name}
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
