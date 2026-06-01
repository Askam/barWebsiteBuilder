"use client";

import { useEditorStore } from "@/lib/store";
import type { Section } from "@/lib/types";
import { useState } from "react";
import { Type, Bold, Italic, Palette, Trash2, GripVertical, Image, Pencil, X, Check } from "lucide-react";

interface InlineEditToolbarProps {
  section: Section;
  kind?: "text" | "media" | "block";
}

export function InlineEditToolbar({ section, kind = "text" }: InlineEditToolbarProps) {
  const { updateSectionContent, deleteSection, setSelectedElement } = useEditorStore();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(section.content.heading ?? "");
  const [bodyValue, setBodyValue] = useState(section.content.body ?? "");

  function stopPropagation(e: React.MouseEvent) {
    e.stopPropagation();
  }

  function saveEdit() {
    updateSectionContent(section.id, { heading: value, body: bodyValue });
    setEditing(false);
  }

  if (editing) {
    return (
      <div
        onClick={stopPropagation}
        className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm p-4 flex flex-col gap-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Edit section
          </span>
          <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Heading</label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        {section.type !== "hero" && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Content</label>
            <textarea
              value={bodyValue}
              onChange={(e) => setBodyValue(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>
        )}
        {section.type === "hero" && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Tagline</label>
            <input
              value={bodyValue}
              onChange={(e) => setBodyValue(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="craft beer & cocktails…"
            />
          </div>
        )}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => setEditing(false)}
            className="flex-1 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={saveEdit}
            className="flex-1 py-1.5 text-xs bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center justify-center gap-1"
          >
            <Check size={12} /> Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={stopPropagation}
      className="absolute -top-10 left-0 z-30 flex items-center gap-0.5 bg-gray-900 text-white rounded-lg shadow-lg px-1 py-1"
    >
      {kind === "text" && (
        <>
          <ToolBtn icon={<Type size={13} />} onClick={() => setEditing(true)} title="Edit text" />
          <ToolBtn icon={<Bold size={13} />} title="Bold" />
          <ToolBtn icon={<Italic size={13} />} title="Italic" />
          <div className="w-px h-4 bg-white/20 mx-0.5" />
          <ToolBtn icon={<Palette size={13} />} title="Colour" />
        </>
      )}
      {kind === "media" && (
        <>
          <ToolBtn icon={<Image size={13} />} title="Replace image" />
          <ToolBtn icon={<Pencil size={13} />} onClick={() => setEditing(true)} title="Edit" />
        </>
      )}
      {kind === "block" && (
        <>
          <ToolBtn icon={<GripVertical size={13} />} title="Drag" />
          <div className="w-px h-4 bg-white/20 mx-0.5" />
          <ToolBtn icon={<Pencil size={13} />} onClick={() => setEditing(true)} title="Edit content" />
          <div className="w-px h-4 bg-white/20 mx-0.5" />
          <ToolBtn
            icon={<Trash2 size={13} />}
            onClick={() => {
              deleteSection(section.id);
              setSelectedElement(null);
            }}
            title="Delete"
            className="hover:text-red-400"
          />
        </>
      )}
    </div>
  );
}

function ToolBtn({
  icon,
  onClick,
  title,
  className,
}: {
  icon: React.ReactNode;
  onClick?: () => void;
  title: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded hover:bg-white/20 transition-colors ${className ?? ""}`}
    >
      {icon}
    </button>
  );
}
