"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  List,
  AlignLeft,
  LayoutGrid,
  Check,
} from "lucide-react";
import { useEditorStore } from "@/lib/store";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { makeId, cn } from "@/lib/utils";
import { useState } from "react";

function MenuItemRow({
  item,
  categoryId,
}: {
  item: MenuItem;
  categoryId: string;
}) {
  const { deleteMenuItem } = useEditorStore();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-2 py-1.5"
    >
      <button className="text-gray-300 cursor-grab" {...attributes} {...listeners}>
        <GripVertical size={12} />
      </button>
      <span className="flex-1 text-sm">{item.name}</span>
      <span className="text-sm text-gray-400">{item.price}</span>
      <button
        onClick={() => deleteMenuItem(categoryId, item.id)}
        className="text-gray-200 hover:text-red-400 ml-1"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

function CategoryRow({ category }: { category: MenuCategory }) {
  const { toggleCategoryVisibility, deleteCategory, updateCategories, addMenuItem } =
    useEditorStore();
  const [open, setOpen] = useState(category.items.length > 0);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: category.id });
  const sensors = useSensors(useSensor(PointerSensor));
  const site = useEditorStore((s) => s.site);

  function handleItemDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !site) return;
    const items = category.items;
    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIdx, newIdx);
    const updatedCats = site.menu.categories.map((c) =>
      c.id === category.id ? { ...c, items: reordered } : c
    );
    useEditorStore.getState().updateCategories(updatedCats);
  }

  function handleAddItem() {
    if (!newName.trim()) return;
    addMenuItem(category.id, {
      id: makeId(),
      name: newName.trim(),
      price: newPrice.trim() || "—",
    });
    setNewName("");
    setNewPrice("");
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("mb-2", !category.visible && "opacity-50")}
    >
      <div className="flex items-center gap-1.5 px-2 py-2 bg-white rounded-lg border border-gray-200 group">
        <button className="text-gray-300 cursor-grab" {...attributes} {...listeners}>
          <GripVertical size={13} />
        </button>
        <button
          onClick={() => setOpen(!open)}
          className="flex-1 flex items-center gap-1.5 text-sm font-semibold text-left"
        >
          {open ? <ChevronDown size={13} className="text-gray-400" /> : <ChevronRight size={13} className="text-gray-400" />}
          {category.name}
          {!open && (
            <span className="text-xs text-gray-400 font-normal ml-1">
              · {category.items.length} article{category.items.length !== 1 ? "s" : ""}
            </span>
          )}
        </button>
        <button
          onClick={() => toggleCategoryVisibility(category.id)}
          className="text-gray-300 hover:text-gray-600"
        >
          {category.visible ? <Eye size={13} /> : <EyeOff size={13} />}
        </button>
        <button
          onClick={() => deleteCategory(category.id)}
          className="text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {open && (
        <div className="ml-4 border-l-2 border-gray-100 pl-3 mt-1 space-y-0.5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleItemDragEnd}
          >
            <SortableContext
              items={category.items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {category.items.map((item) => (
                <MenuItemRow key={item.id} item={item} categoryId={category.id} />
              ))}
            </SortableContext>
          </DndContext>

          <div className="flex gap-1.5 mt-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              placeholder="Nom de l'article"
              className="flex-1 text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <input
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              placeholder="10€"
              className="w-14 text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              onClick={handleAddItem}
              className="px-2 py-1.5 bg-amber-500 text-white rounded text-xs hover:bg-amber-600"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ItemsTab() {
  const { site, updateCategories, addCategory } = useEditorStore();
  const sensors = useSensors(useSensor(PointerSensor));
  const [newCatName, setNewCatName] = useState("");

  if (!site) return null;

  const sorted = [...site.menu.categories].sort((a, b) => a.order - b.order);

  function handleCategoryDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = sorted.findIndex((c) => c.id === active.id);
    const newIdx = sorted.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(sorted, oldIdx, newIdx).map((c, i) => ({
      ...c,
      order: i,
    }));
    updateCategories(reordered);
  }

  function handleAddCategory() {
    if (!newCatName.trim()) return;
    addCategory({
      id: makeId(),
      name: newCatName.trim(),
      visible: true,
      order: site!.menu.categories.length,
      items: [],
    });
    setNewCatName("");
  }

  return (
    <div className="p-3">
      <p className="text-xs text-gray-400 font-medium mb-2">Catégories</p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleCategoryDragEnd}
      >
        <SortableContext
          items={sorted.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {sorted.map((cat) => (
            <CategoryRow key={cat.id} category={cat} />
          ))}
        </SortableContext>
      </DndContext>

      <div className="flex gap-1.5 mt-2">
        <input
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
          placeholder="Nom de la catégorie"
          className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <button
          onClick={handleAddCategory}
          className="px-2.5 py-2 bg-amber-500 text-white rounded-lg text-xs hover:bg-amber-600"
        >
          <Plus size={13} />
        </button>
      </div>

      {/* Options rapides */}
      <div className="mt-5 space-y-1">
        <p className="text-xs text-gray-400 font-medium mb-2">Options rapides</p>
        <QuickToggle
          label="Afficher les prix"
          value={site.menu.settings.showPrices}
          onChange={(v) => useEditorStore.getState().updateMenuSettings({ showPrices: v })}
        />
        <QuickToggle
          label="Étiquettes diète (v, sg)"
          value={site.menu.settings.showDietaryTags}
          onChange={(v) => useEditorStore.getState().updateMenuSettings({ showDietaryTags: v })}
        />
        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100">
          <span className="text-sm">Devise</span>
          <select
            value={site.menu.settings.currency}
            onChange={(e) => useEditorStore.getState().updateMenuSettings({ currency: e.target.value })}
            className="text-sm border-0 bg-transparent focus:outline-none text-gray-500"
          >
            <option value="€">€ EUR</option>
            <option value="£">£ GBP</option>
            <option value="$">$ USD</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function QuickToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100"
    >
      <span className="text-sm">{label}</span>
      <div
        className={cn(
          "w-8 h-4 rounded-full transition-colors relative",
          value ? "bg-amber-500" : "bg-gray-200"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform",
            value ? "translate-x-4 left-0.5" : "translate-x-0 left-0.5"
          )}
        />
      </div>
    </button>
  );
}

const LAYOUTS = [
  { id: "list" as const, icon: <List size={14} />, label: "Liste simple" },
  { id: "print" as const, icon: <AlignLeft size={14} />, label: "Menu imprimable" },
  { id: "cards" as const, icon: <LayoutGrid size={14} />, label: "Cartes photo" },
];

function LayoutTab() {
  const { site, setMenuLayout } = useEditorStore();
  if (!site) return null;

  return (
    <div className="p-3 space-y-2">
      <p className="text-xs text-gray-400 font-medium mb-2">Mise en page du menu</p>
      {LAYOUTS.map((l) => (
        <button
          key={l.id}
          onClick={() => setMenuLayout(l.id)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-left transition-all",
            site.menu.settings.layout === l.id
              ? "border-amber-500 bg-amber-50"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <span className="text-gray-500">{l.icon}</span>
          <span className="flex-1 text-sm font-medium">{l.label}</span>
          {site.menu.settings.layout === l.id && (
            <Check size={14} className="text-amber-500" />
          )}
        </button>
      ))}
    </div>
  );
}

export function MenuEditorPanel() {
  const { menuEditorTab, setMenuEditorTab } = useEditorStore();

  return (
    <>
      <div className="flex border-b border-gray-200 bg-white shrink-0">
        {(["items", "layout"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMenuEditorTab(tab)}
            className={cn(
              "flex-1 py-3 text-sm font-semibold transition-colors",
              menuEditorTab === tab
                ? "text-gray-900 border-b-2 border-amber-500"
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            {tab === "items" ? "Articles" : "Mise en page"}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {menuEditorTab === "items" ? <ItemsTab /> : <LayoutTab />}
      </div>
    </>
  );
}
