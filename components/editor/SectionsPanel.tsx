"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff, Trash2, Plus } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import type { Section, SectionType } from "@/lib/types";
import { makeId } from "@/lib/utils";
import { cn } from "@/lib/utils";

const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Image principale",
  about: "À propos",
  featuredDrinks: "Boissons à la une",
  hours: "Horaires",
  gallery: "Galerie photos",
  events: "Événements",
  location: "Localisation",
  reservations: "Réservations",
  contact: "Contact & réseaux",
};

const ADD_SECTION_TYPES: SectionType[] = [
  "events",
  "about",
  "featuredDrinks",
  "gallery",
  "hours",
  "location",
  "reservations",
  "contact",
];

function SortableRow({ section }: { section: Section }) {
  const { toggleSectionVisibility, deleteSection, setSelectedElement } = useEditorStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-100 bg-white hover:border-gray-200 group",
        !section.visible && "opacity-50",
        isDragging && "opacity-30"
      )}
    >
      <button
        className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </button>
      <span
        className="flex-1 text-sm font-medium cursor-pointer hover:text-amber-600"
        onClick={() => setSelectedElement(section.id)}
      >
        {SECTION_LABELS[section.type]}
      </span>
      <button
        onClick={() => toggleSectionVisibility(section.id)}
        className="text-gray-300 hover:text-gray-600 transition-colors"
        title={section.visible ? "Masquer" : "Afficher"}
      >
        {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>
      <button
        onClick={() => deleteSection(section.id)}
        className="text-gray-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
        title="Supprimer"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export function SectionsPanel() {
  const { site, updateSections, addSection } = useEditorStore();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!site) return null;

  const sorted = [...site.sections].sort((a, b) => a.order - b.order);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = sorted.findIndex((s) => s.id === active.id);
    const newIdx = sorted.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(sorted, oldIdx, newIdx).map((s, i) => ({
      ...s,
      order: i,
    }));
    updateSections(reordered);
  }

  function handleAddSection() {
    const existingTypes = new Set(site!.sections.map((s) => s.type));
    const available = ADD_SECTION_TYPES.filter((t) => !existingTypes.has(t));
    const type = available[0] ?? "about";
    const newSec: Section = {
      id: makeId(),
      type,
      visible: true,
      order: site!.sections.length,
      content: { heading: SECTION_LABELS[type] },
    };
    addSection(newSec);
  }

  return (
    <div className="p-3 space-y-1.5">
      <p className="text-xs text-gray-400 font-medium px-1 mb-2">
        Glisser pour réordonner
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sorted.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sorted.map((section) => (
            <SortableRow key={section.id} section={section} />
          ))}
        </SortableContext>
      </DndContext>

      <button
        onClick={handleAddSection}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-amber-400 hover:text-amber-500 transition-colors mt-2"
      >
        <Plus size={14} /> Ajouter une section
      </button>
    </div>
  );
}
