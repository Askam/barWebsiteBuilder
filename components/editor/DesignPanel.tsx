"use client";

import { useEditorStore } from "@/lib/store";
import type { Theme, BrandColor } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const THEMES: { id: Theme; name: string; bg: string; textLight: boolean }[] = [
  { id: "speakeasy", name: "Speakeasy", bg: "#2c2a28", textLight: true },
  { id: "neighbourhood", name: "Neighbourhood", bg: "#f0e9da", textLight: false },
  { id: "taproom", name: "Taproom", bg: "#e0913a", textLight: true },
  { id: "winebar", name: "Wine bar", bg: "#7a3045", textLight: true },
];

const BRAND_COLORS: { color: BrandColor; label: string }[] = [
  { color: "#e0913a", label: "Ambre" },
  { color: "#3f6b54", label: "Vert" },
  { color: "#7a3045", label: "Bordeaux" },
  { color: "#2f4a6b", label: "Bleu" },
  { color: "#222222", label: "Noir" },
  { color: "#ffffff", label: "Blanc" },
];

const HEADING_FONTS = [
  { value: "Georgia, serif", label: "Serif élégant" },
  { value: "system-ui, sans-serif", label: "Sans-serif moderne" },
  { value: "'Playfair Display', Georgia, serif", label: "Playfair" },
  { value: "Impact, sans-serif", label: "Impact" },
];

const BODY_FONTS = [
  { value: "system-ui, sans-serif", label: "Sans-serif moderne" },
  { value: "Georgia, serif", label: "Serif" },
  { value: "'Courier New', monospace", label: "Mono" },
];

export function DesignPanel() {
  const { site, updateDesign } = useEditorStore();
  if (!site) return null;

  return (
    <div className="p-3 space-y-5">
      {/* Thème */}
      <div>
        <p className="text-xs text-gray-400 font-medium mb-2 px-1">Thème</p>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => updateDesign({ theme: t.id })}
              className={cn(
                "rounded-xl overflow-hidden border-2 text-left transition-all",
                site.theme === t.id
                  ? "border-amber-500"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div
                className="h-10 flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: t.bg,
                  color: t.textLight ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.5)",
                }}
              >
                Aa
              </div>
              <div className="px-2 py-1.5 bg-white text-xs font-medium flex items-center justify-between">
                {t.name}
                {site.theme === t.id && (
                  <Check size={11} className="text-amber-500" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Couleur principale */}
      <div>
        <p className="text-xs text-gray-400 font-medium mb-2 px-1">Couleur principale</p>
        <div className="flex flex-wrap gap-2 px-1">
          {BRAND_COLORS.map(({ color, label }) => (
            <button
              key={color}
              title={label}
              onClick={() => updateDesign({ brandColor: color })}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all",
                site.brandColor === color
                  ? "border-amber-500 scale-110"
                  : "border-white shadow hover:scale-105"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Polices */}
      <div>
        <p className="text-xs text-gray-400 font-medium mb-2 px-1">Polices</p>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-500 px-1 mb-1 block">Titres</label>
            <select
              value={site.headingFont}
              onChange={(e) => updateDesign({ headingFont: e.target.value })}
              className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {HEADING_FONTS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 px-1 mb-1 block">Texte</label>
            <select
              value={site.bodyFont}
              onChange={(e) => updateDesign({ bodyFont: e.target.value })}
              className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {BODY_FONTS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
