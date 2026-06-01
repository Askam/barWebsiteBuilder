import { create } from "zustand";
import type {
  SiteData,
  Section,
  MenuCategory,
  ActivePage,
  EditorTab,
  MenuEditorTab,
  DevicePreview,
  MenuLayout,
  Theme,
  BrandColor,
  SectionContent,
} from "./types";

interface EditorUIState {
  activePage: ActivePage;
  editorTab: EditorTab;
  menuEditorTab: MenuEditorTab;
  devicePreview: DevicePreview;
  selectedElementId: string | null;
  isSaving: boolean;
}

interface EditorStore extends EditorUIState {
  site: SiteData | null;

  // UI actions
  setActivePage: (page: ActivePage) => void;
  setEditorTab: (tab: EditorTab) => void;
  setMenuEditorTab: (tab: MenuEditorTab) => void;
  setDevicePreview: (dev: DevicePreview) => void;
  setSelectedElement: (id: string | null) => void;
  setSaving: (saving: boolean) => void;

  // Site actions
  setSite: (site: SiteData) => void;
  updateBarInfo: (data: { barName?: string; tagline?: string; logoUrl?: string | null }) => void;
  updateDesign: (data: { theme?: Theme; brandColor?: BrandColor; headingFont?: string; bodyFont?: string }) => void;

  // Section actions
  updateSections: (sections: Section[]) => void;
  toggleSectionVisibility: (id: string) => void;
  deleteSection: (id: string) => void;
  addSection: (section: Section) => void;
  updateSectionContent: (id: string, content: Partial<SectionContent>) => void;

  // Menu actions
  updateCategories: (categories: MenuCategory[]) => void;
  addCategory: (cat: MenuCategory) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryVisibility: (id: string) => void;
  updateCategoryName: (id: string, name: string) => void;
  addMenuItem: (categoryId: string, item: { id: string; name: string; price: string }) => void;
  deleteMenuItem: (categoryId: string, itemId: string) => void;
  updateMenuSettings: (settings: Partial<SiteData["menu"]["settings"]>) => void;
  setMenuLayout: (layout: MenuLayout) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  site: null,
  activePage: "home",
  editorTab: "sections",
  menuEditorTab: "items",
  devicePreview: "desktop",
  selectedElementId: null,
  isSaving: false,

  setActivePage: (activePage) => set({ activePage }),
  setEditorTab: (editorTab) => set({ editorTab }),
  setMenuEditorTab: (menuEditorTab) => set({ menuEditorTab }),
  setDevicePreview: (devicePreview) => set({ devicePreview }),
  setSelectedElement: (selectedElementId) => set({ selectedElementId }),
  setSaving: (isSaving) => set({ isSaving }),

  setSite: (site) => set({ site }),

  updateBarInfo: (data) =>
    set((s) => s.site ? { site: { ...s.site, ...data } } : {}),

  updateDesign: (data) =>
    set((s) => s.site ? { site: { ...s.site, ...data } } : {}),

  updateSections: (sections) =>
    set((s) => s.site ? { site: { ...s.site, sections } } : {}),

  toggleSectionVisibility: (id) =>
    set((s) => {
      if (!s.site) return {};
      return {
        site: {
          ...s.site,
          sections: s.site.sections.map((sec) =>
            sec.id === id ? { ...sec, visible: !sec.visible } : sec
          ),
        },
      };
    }),

  deleteSection: (id) =>
    set((s) => {
      if (!s.site) return {};
      return {
        site: {
          ...s.site,
          sections: s.site.sections.filter((sec) => sec.id !== id),
        },
      };
    }),

  addSection: (section) =>
    set((s) => {
      if (!s.site) return {};
      return { site: { ...s.site, sections: [...s.site.sections, section] } };
    }),

  updateSectionContent: (id, content) =>
    set((s) => {
      if (!s.site) return {};
      return {
        site: {
          ...s.site,
          sections: s.site.sections.map((sec) =>
            sec.id === id ? { ...sec, content: { ...sec.content, ...content } } : sec
          ),
        },
      };
    }),

  updateCategories: (categories) =>
    set((s) => s.site ? { site: { ...s.site, menu: { ...s.site.menu, categories } } } : {}),

  addCategory: (cat) =>
    set((s) => {
      if (!s.site) return {};
      return {
        site: {
          ...s.site,
          menu: {
            ...s.site.menu,
            categories: [...s.site.menu.categories, cat],
          },
        },
      };
    }),

  deleteCategory: (id) =>
    set((s) => {
      if (!s.site) return {};
      return {
        site: {
          ...s.site,
          menu: {
            ...s.site.menu,
            categories: s.site.menu.categories.filter((c) => c.id !== id),
          },
        },
      };
    }),

  toggleCategoryVisibility: (id) =>
    set((s) => {
      if (!s.site) return {};
      return {
        site: {
          ...s.site,
          menu: {
            ...s.site.menu,
            categories: s.site.menu.categories.map((c) =>
              c.id === id ? { ...c, visible: !c.visible } : c
            ),
          },
        },
      };
    }),

  updateCategoryName: (id, name) =>
    set((s) => {
      if (!s.site) return {};
      return {
        site: {
          ...s.site,
          menu: {
            ...s.site.menu,
            categories: s.site.menu.categories.map((c) =>
              c.id === id ? { ...c, name } : c
            ),
          },
        },
      };
    }),

  addMenuItem: (categoryId, item) =>
    set((s) => {
      if (!s.site) return {};
      return {
        site: {
          ...s.site,
          menu: {
            ...s.site.menu,
            categories: s.site.menu.categories.map((c) =>
              c.id === categoryId
                ? { ...c, items: [...c.items, { ...item, tags: [] }] }
                : c
            ),
          },
        },
      };
    }),

  deleteMenuItem: (categoryId, itemId) =>
    set((s) => {
      if (!s.site) return {};
      return {
        site: {
          ...s.site,
          menu: {
            ...s.site.menu,
            categories: s.site.menu.categories.map((c) =>
              c.id === categoryId
                ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
                : c
            ),
          },
        },
      };
    }),

  updateMenuSettings: (settings) =>
    set((s) => {
      if (!s.site) return {};
      return {
        site: {
          ...s.site,
          menu: {
            ...s.site.menu,
            settings: { ...s.site.menu.settings, ...settings },
          },
        },
      };
    }),

  setMenuLayout: (layout) =>
    set((s) => {
      if (!s.site) return {};
      return {
        site: {
          ...s.site,
          menu: {
            ...s.site.menu,
            settings: { ...s.site.menu.settings, layout },
          },
        },
      };
    }),
}));
