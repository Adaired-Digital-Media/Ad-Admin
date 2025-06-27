/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { useAtom } from "jotai";
import { dynamicSectionsAtom } from "./page-nav";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PiTrashBold, PiArrowsOutCardinalBold } from "react-icons/pi";
import cn from "@/core/utils/class-names";
import { Link } from "react-scroll";

interface SortableItemProps {
  id: string;
  label: string;
  onDelete: (id: string) => void;
}

function SortableItem({ id, label, onDelete }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center justify-between p-2 bg-gray-50 mb-1 rounded cursor-move hover:bg-gray-100"
    >
      <Link
        to={id}
        spy={true}
        hashSpy={true}
        smooth={true}
        offset={-150}
        duration={500}
        className="flex-1 truncate"
      >
        {label}
      </Link>
      <div className="flex items-center gap-2">
        <span {...listeners} className="cursor-grab">
          <PiArrowsOutCardinalBold className="h-4 w-4 text-gray-500" />
        </span>
        <button
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700"
        >
          <PiTrashBold className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function SectionManagerWidget() {
  const [dynamicSections, setDynamicSections] = useAtom(dynamicSectionsAtom);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      widgetRef.current &&
      e.target === widgetRef.current.querySelector(".drag-handle")
    ) {
      setIsDragging(true);
      const startX = e.clientX - position.x;
      const startY = e.clientY - position.y;

      const handleMove = (moveEvent: MouseEvent) => {
        setPosition({
          x: moveEvent.clientX - startX,
          y: moveEvent.clientY - startY,
        });
      };

      const handleEnd = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = dynamicSections.findIndex((sec) => sec.id === active.id);
      const newIndex = dynamicSections.findIndex((sec) => sec.id === over.id);
      const newSections = [...dynamicSections];
      const [movedSection] = newSections.splice(oldIndex, 1);
      newSections.splice(newIndex, 0, movedSection);
      setDynamicSections(newSections);
    }
  };

  const handleDeleteSection = (id: string) => {
    setDynamicSections(dynamicSections.filter((section) => section.id !== id));
  };

  return (
    <div
      ref={widgetRef}
      className={cn(
        "fixed bg-white shadow-lg rounded-lg p-4 w-64 z-[99999]",
        isDragging ? "opacity-75" : "opacity-100"
      )}
      style={{ left: position.x, top: position.y }}
    >
      <div
        className="drag-handle flex items-center justify-between mb-2 cursor-move"
        onMouseDown={handleDragStart}
      >
        <span className="font-medium">Sections</span>
        <PiArrowsOutCardinalBold className="h-5 w-5 text-gray-500" />
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={dynamicSections.map((sec) => sec.id)}
          strategy={verticalListSortingStrategy}
        >
          {dynamicSections.map((section) => (
            <SortableItem
              key={section.id}
              id={section.id}
              label={section.label}
              onDelete={handleDeleteSection}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
