"use client";

import { useEditorStore } from "@/lib/store";
import type { SiteData, MenuCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MenuPreviewProps {
  site?: SiteData;
  isEditor?: boolean;
}

export function MenuPreview({ site: propSite, isEditor = false }: MenuPreviewProps) {
  const storeSite = useEditorStore((s) => s.site);
  const site = propSite ?? storeSite;
  if (!site) return null;

  const { menu } = site;
  const categories = menu.categories
    .filter((c) => c.visible)
    .sort((a, b) => a.order - b.order);
  const layout = menu.settings.layout;

  return (
    <div style={{ fontFamily: site.bodyFont }}>
      {/* Menu header */}
      <div
        className="px-6 py-6 border-b"
        style={{ borderColor: `${site.brandColor}30` }}
      >
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: site.headingFont, color: site.brandColor }}
        >
          Menu
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {site.barName} · updated regularly
        </p>
      </div>

      <div className="p-6 space-y-8">
        {categories.map((cat) => (
          <CategorySection
            key={cat.id}
            category={cat}
            layout={layout}
            site={site}
          />
        ))}
      </div>
    </div>
  );
}

function CategorySection({
  category,
  layout,
  site,
}: {
  category: MenuCategory;
  layout: string;
  site: SiteData;
}) {
  const items = category.items;

  if (layout === "print") {
    return (
      <div className="text-center">
        <h2
          className="text-sm font-bold tracking-widest uppercase mb-4"
          style={{ color: site.brandColor }}
        >
          — {category.name} —
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-left">
          {items.map((item) => (
            <div key={item.id} className="flex items-baseline gap-1">
              <span className="text-sm font-medium truncate">{item.name}</span>
              <span className="flex-1 border-b border-dotted border-gray-300 mb-0.5" />
              {site.menu.settings.showPrices && (
                <span className="text-sm shrink-0">{item.price}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "cards") {
    return (
      <div>
        <h2
          className="text-lg font-bold mb-4"
          style={{ fontFamily: site.headingFont, color: site.brandColor }}
        >
          {category.name}
        </h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center text-xs text-gray-300">
                  IMG
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{item.name}</span>
                  {site.menu.settings.showPrices && (
                    <span className="text-sm font-bold" style={{ color: site.brandColor }}>
                      {item.price}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>
                )}
                {site.menu.settings.showDietaryTags && item.tags && item.tags.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-xs border border-gray-300 rounded px-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: simple list
  return (
    <div>
      <h2
        className="text-lg font-bold mb-3"
        style={{ fontFamily: site.headingFont, color: site.brandColor }}
      >
        {category.name}
      </h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-baseline gap-1">
            <span className="text-sm font-medium">{item.name}</span>
            {site.menu.settings.showDietaryTags && item.tags && item.tags.length > 0 && (
              <span className="text-xs text-gray-400 ml-1">
                {item.tags.join(" ")}
              </span>
            )}
            <span className="flex-1 border-b border-dotted border-gray-200 mb-0.5 mx-1" />
            {site.menu.settings.showPrices && (
              <span className="text-sm shrink-0">{item.price}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
