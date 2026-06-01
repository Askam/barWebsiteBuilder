"use client";

import { useEditorStore } from "@/lib/store";
import { SectionsPanel } from "./SectionsPanel";
import { DesignPanel } from "./DesignPanel";
import { MenuEditorPanel } from "./MenuEditorPanel";
import { cn } from "@/lib/utils";

export function EditorPanel() {
  const { activePage, editorTab, setEditorTab } = useEditorStore();

  if (activePage === "menu") {
    return (
      <aside className="w-72 shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col h-full overflow-hidden">
        <MenuEditorPanel />
      </aside>
    );
  }

  return (
    <aside className="w-72 shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col h-full overflow-hidden">
      <div className="flex border-b border-gray-200 bg-white shrink-0">
        {(["sections", "design"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setEditorTab(tab)}
            className={cn(
              "flex-1 py-3 text-sm font-semibold transition-colors",
              editorTab === tab
                ? "text-gray-900 border-b-2 border-amber-500"
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            {tab === "sections" ? "Sections" : "Design"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {editorTab === "sections" ? <SectionsPanel /> : <DesignPanel />}
      </div>
    </aside>
  );
}
