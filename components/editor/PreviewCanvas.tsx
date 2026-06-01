"use client";

import { useEditorStore } from "@/lib/store";
import { SiteRenderer } from "@/components/site/SiteRenderer";
import { MenuPreview } from "@/components/site/MenuPreview";
import { cn } from "@/lib/utils";

export function PreviewCanvas() {
  const { devicePreview, activePage } = useEditorStore();

  return (
    <div className="flex-1 overflow-auto bg-gray-200 flex items-start justify-center p-6">
      <div
        className={cn(
          "bg-white shadow-xl overflow-hidden rounded-lg transition-all duration-300",
          devicePreview === "phone"
            ? "w-80 min-h-[600px]"
            : "w-full max-w-2xl min-h-[500px]"
        )}
      >
        {activePage === "home" ? (
          <SiteRenderer isEditor />
        ) : (
          <MenuPreview isEditor />
        )}
      </div>
    </div>
  );
}
