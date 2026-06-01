export type Theme = "speakeasy" | "neighbourhood" | "taproom" | "winebar";
export type BrandColor =
  | "#e0913a"
  | "#3f6b54"
  | "#7a3045"
  | "#2f4a6b"
  | "#222222"
  | "#ffffff";
export type MenuLayout = "list" | "print" | "cards";
export type DevicePreview = "desktop" | "phone";
export type SiteStatus = "draft" | "live";

export type SectionType =
  | "hero"
  | "about"
  | "featuredDrinks"
  | "hours"
  | "gallery"
  | "events"
  | "location"
  | "reservations"
  | "contact";

export interface SectionContent {
  heading?: string;
  body?: string;
  heroImageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrls?: string[];
  drinks?: { name: string; description?: string; imageUrl?: string }[];
  hoursText?: string;
  address?: string;
  mapUrl?: string;
  phone?: string;
  email?: string;
  socials?: { platform: string; url: string }[];
  reservationUrl?: string;
}

export interface Section {
  id: string;
  type: SectionType;
  visible: boolean;
  order: number;
  content: SectionContent;
}

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  imageUrl?: string;
  tags?: ("v" | "gf")[];
}

export interface MenuCategory {
  id: string;
  name: string;
  visible: boolean;
  order: number;
  items: MenuItem[];
}

export interface MenuSettings {
  layout: MenuLayout;
  showPrices: boolean;
  currency: string;
  showDietaryTags: boolean;
}

export interface SiteData {
  id: string;
  ownerId: string;
  barName: string;
  tagline: string;
  logoUrl: string | null;
  theme: Theme;
  brandColor: BrandColor;
  headingFont: string;
  bodyFont: string;
  status: SiteStatus;
  slug: string;
  customDomain: string | null;
  sections: Section[];
  menu: {
    categories: MenuCategory[];
    settings: MenuSettings;
  };
  createdAt: number;
  updatedAt: number;
}

export type ActivePage = "home" | "menu";
export type EditorTab = "sections" | "design";
export type MenuEditorTab = "items" | "layout";
