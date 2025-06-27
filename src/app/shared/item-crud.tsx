import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { PiTagBold, PiXBold } from "react-icons/pi";
import { Input,Button } from "rizzui";

interface ItemCrudProps {
  label: string;
  name: string;
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ItemCrud({
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
