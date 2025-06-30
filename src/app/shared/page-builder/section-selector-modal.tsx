/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAtom } from "jotai";
import { useModal } from "@/app/shared/modal-views/use-modal";
import { dynamicSectionsAtom } from "./page-nav";
import { v4 as uuidv4 } from "uuid";
import { Button, Title } from "rizzui";
import cn from "@/core/utils/class-names";
import { sectionRegistry } from "./registry";
import Image from "next/image";

export default function SectionSelectorModal() {
  const { closeModal } = useModal();
  const [dynamicSections, setDynamicSections] = useAtom(dynamicSectionsAtom);

  const handleAddSection = (sectionType: string, label: string) => {
    const sectionId = uuidv4();
    setDynamicSections([
      ...dynamicSections,
      { id: sectionId, type: sectionType, label, data: {} },
    ]);
    closeModal();
  };

  return (
    <div className="p-6">
      <Title as="h3" className="mb-6">
        Select a Section
      </Title>
      <div className="grid grid-cols-2 gap-4">
        {sectionRegistry.map((section) => (
          <div
            key={section.type}
            className={cn(
              "border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition",
              "flex flex-col items-center"
            )}
            onClick={() => handleAddSection(section.type, section.label)}
          >
            <Image
              height={100}
              width={100}
              src={section.image || "/placeholder.png"}
              alt={section.label}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <span className="font-medium">{section.label}</span>
          </div>
        ))}
      </div>
      <Button variant="outline" onClick={closeModal} className="mt-6 w-full">
        Cancel
      </Button>
    </div>
  );
}
