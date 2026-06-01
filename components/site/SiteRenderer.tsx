"use client";

import { useEditorStore } from "@/lib/store";
import type { SiteData, Section } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Globe,
  CalendarDays,
} from "lucide-react";
import { InlineEditToolbar } from "./InlineEditToolbar";

interface SiteRendererProps {
  site?: SiteData;
  isEditor?: boolean;
}

function useThemeVars(site: SiteData) {
  const themeMap = {
    speakeasy: {
      bg: "#1e1c1a",
      surface: "#2c2a28",
      text: "#e8e2d8",
      soft: "#9b9590",
      heading: "#f5efe6",
    },
    neighbourhood: {
      bg: "#f7f4ee",
      surface: "#ffffff",
      text: "#2c2a28",
      soft: "#6b675f",
      heading: "#1a1816",
    },
    taproom: {
      bg: "#1a1008",
      surface: "#231504",
      text: "#f0e8d8",
      soft: "#a89880",
      heading: "#fff8ee",
    },
    winebar: {
      bg: "#1a0a12",
      surface: "#2a1020",
      text: "#f0e0e8",
      soft: "#a07890",
      heading: "#fce8f0",
    },
  };
  return themeMap[site.theme] ?? themeMap.neighbourhood;
}

function SectionWrapper({
  section,
  isEditor,
  children,
  className,
  style,
}: {
  section: Section;
  isEditor: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { selectedElementId, setSelectedElement } = useEditorStore();
  const isSelected = selectedElementId === section.id;

  if (!isEditor) return <div className={className} style={style}>{children}</div>;

  return (
    <div
      className={cn(
        className,
        "ed-selectable relative",
        isSelected && "ed-selected"
      )}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(isSelected ? null : section.id);
      }}
    >
      {isSelected && <InlineEditToolbar section={section} kind="block" />}
      {children}
    </div>
  );
}

function HeroSection({
  section,
  site,
  isEditor,
}: {
  section: Section;
  site: SiteData;
  isEditor: boolean;
}) {
  const theme = useThemeVars(site);
  const c = section.content;
  return (
    <SectionWrapper
      section={section}
      isEditor={isEditor}
      style={{ backgroundColor: theme.surface, color: theme.text }}
      className="relative"
    >
      {c.heroImageUrl ? (
        <img
          src={c.heroImageUrl}
          alt="Hero"
          className="w-full h-56 object-cover"
        />
      ) : (
        <div
          className="w-full h-56 flex items-center justify-center text-sm opacity-30"
          style={{ backgroundColor: theme.bg }}
        >
          {isEditor ? "Click to add hero photo →" : ""}
        </div>
      )}
      <div className="p-6">
        <h1
          className="text-3xl font-bold mb-1"
          style={{
            fontFamily: site.headingFont,
            color: theme.heading,
          }}
        >
          {c.heading || site.barName}
        </h1>
        {c.body && (
          <p className="text-sm mb-4" style={{ color: theme.soft }}>
            {c.body}
          </p>
        )}
        {c.ctaText && (
          <button
            className="px-5 py-2 rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: site.brandColor }}
          >
            {c.ctaText}
          </button>
        )}
      </div>
    </SectionWrapper>
  );
}

function AboutSection({
  section,
  site,
  isEditor,
}: {
  section: Section;
  site: SiteData;
  isEditor: boolean;
}) {
  const theme = useThemeVars(site);
  const c = section.content;
  return (
    <SectionWrapper
      section={section}
      isEditor={isEditor}
      className="px-6 py-8 border-t"
      style={{
        backgroundColor: theme.surface,
        color: theme.text,
        borderColor: `${theme.text}15`,
      }}
    >
      <h2
        className="text-xl font-bold mb-3"
        style={{ fontFamily: site.headingFont, color: theme.heading }}
      >
        {c.heading}
      </h2>
      <p className="text-sm leading-relaxed" style={{ color: theme.soft }}>
        {c.body || (isEditor ? "Add your story here…" : "")}
      </p>
    </SectionWrapper>
  );
}

function FeaturedDrinksSection({
  section,
  site,
  isEditor,
}: {
  section: Section;
  site: SiteData;
  isEditor: boolean;
}) {
  const theme = useThemeVars(site);
  const c = section.content;
  const drinks = c.drinks ?? [];
  return (
    <SectionWrapper
      section={section}
      isEditor={isEditor}
      className="px-6 py-8 border-t"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        borderColor: `${theme.text}15`,
      }}
    >
      <h2
        className="text-xl font-bold mb-4"
        style={{ fontFamily: site.headingFont, color: theme.heading }}
      >
        {c.heading}
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {drinks.map((d, i) => (
          <div key={i} className="text-center">
            <div
              className="w-full h-20 rounded-lg mb-2 flex items-center justify-center text-xs opacity-30"
              style={{ backgroundColor: `${theme.text}20` }}
            >
              {d.imageUrl ? (
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                "IMG"
              )}
            </div>
            <div className="text-sm font-semibold" style={{ color: theme.heading }}>
              {d.name}
            </div>
            {d.description && (
              <div className="text-xs mt-0.5" style={{ color: theme.soft }}>
                {d.description}
              </div>
            )}
          </div>
        ))}
        {drinks.length === 0 &&
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-24 rounded-lg flex items-center justify-center text-xs opacity-20"
              style={{ backgroundColor: `${theme.text}20` }}
            >
              IMG
            </div>
          ))}
      </div>
    </SectionWrapper>
  );
}

function HoursSection({
  section,
  site,
  isEditor,
}: {
  section: Section;
  site: SiteData;
  isEditor: boolean;
}) {
  const theme = useThemeVars(site);
  const c = section.content;
  const lines = (c.hoursText ?? "").split("\n").filter(Boolean);
  const half = Math.ceil(lines.length / 2);
  return (
    <SectionWrapper
      section={section}
      isEditor={isEditor}
      className="px-6 py-8 border-t"
      style={{
        backgroundColor: theme.surface,
        color: theme.text,
        borderColor: `${theme.text}15`,
      }}
    >
      <h2
        className="text-xl font-bold mb-4 flex items-center gap-2"
        style={{ fontFamily: site.headingFont, color: theme.heading }}
      >
        <Clock size={18} style={{ color: site.brandColor }} />
        {c.heading}
      </h2>
      {lines.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 text-sm" style={{ color: theme.soft }}>
          <div className="space-y-1">
            {lines.slice(0, half).map((l, i) => <div key={i}>{l}</div>)}
          </div>
          <div className="space-y-1">
            {lines.slice(half).map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </div>
      ) : (
        isEditor && (
          <p className="text-sm opacity-30">Add opening hours in the editor…</p>
        )
      )}
    </SectionWrapper>
  );
}

function GallerySection({
  section,
  site,
  isEditor,
}: {
  section: Section;
  site: SiteData;
  isEditor: boolean;
}) {
  const theme = useThemeVars(site);
  const c = section.content;
  const images = c.imageUrls ?? [];
  const placeholders = Math.max(0, 4 - images.length);
  return (
    <SectionWrapper
      section={section}
      isEditor={isEditor}
      className="px-6 py-8 border-t"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        borderColor: `${theme.text}15`,
      }}
    >
      <h2
        className="text-xl font-bold mb-4"
        style={{ fontFamily: site.headingFont, color: theme.heading }}
      >
        {c.heading}
      </h2>
      <div className="grid grid-cols-4 gap-2">
        {images.map((url, i) => (
          <img
            key={i}
            src={url}
            alt=""
            className="w-full h-20 object-cover rounded-lg"
          />
        ))}
        {Array.from({ length: placeholders }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-lg flex items-center justify-center text-xs opacity-20"
            style={{ backgroundColor: `${theme.text}20` }}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}

function GenericSection({
  section,
  site,
  isEditor,
}: {
  section: Section;
  site: SiteData;
  isEditor: boolean;
}) {
  const theme = useThemeVars(site);
  const c = section.content;
  return (
    <SectionWrapper
      section={section}
      isEditor={isEditor}
      className="px-6 py-8 border-t"
      style={{
        backgroundColor: theme.surface,
        color: theme.text,
        borderColor: `${theme.text}15`,
      }}
    >
      <h2
        className="text-xl font-bold mb-3"
        style={{ fontFamily: site.headingFont, color: theme.heading }}
      >
        {c.heading}
      </h2>
      {c.address && (
        <p className="flex items-start gap-2 text-sm mb-2" style={{ color: theme.soft }}>
          <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: site.brandColor }} />
          {c.address}
        </p>
      )}
      {c.phone && (
        <p className="flex items-center gap-2 text-sm mb-2" style={{ color: theme.soft }}>
          <Phone size={14} style={{ color: site.brandColor }} />
          {c.phone}
        </p>
      )}
      {c.email && (
        <p className="flex items-center gap-2 text-sm mb-2" style={{ color: theme.soft }}>
          <Mail size={14} style={{ color: site.brandColor }} />
          {c.email}
        </p>
      )}
      {c.body && <p className="text-sm" style={{ color: theme.soft }}>{c.body}</p>}
      {c.reservationUrl && (
        <a
          href={c.reservationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: site.brandColor }}
        >
          Book a table
        </a>
      )}
      {c.socials && c.socials.length > 0 && (
        <div className="flex gap-3 mt-3">
          {c.socials.map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: site.brandColor }}>
              {s.platform === "instagram" && <Instagram size={18} />}
              {s.platform === "facebook" && <Facebook size={18} />}
              {!["instagram", "facebook"].includes(s.platform) && <Globe size={18} />}
            </a>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}

function SiteFooter({ site }: { site: SiteData }) {
  const theme = useThemeVars(site);
  return (
    <div
      className="px-6 py-4 text-center text-xs"
      style={{ backgroundColor: theme.bg, color: theme.soft }}
    >
      © {new Date().getFullYear()} {site.barName} · Powered by TapHouse
    </div>
  );
}

export function SiteRenderer({ site: propSite, isEditor = false }: SiteRendererProps) {
  const storeSite = useEditorStore((s) => s.site);
  const site = propSite ?? storeSite;
  if (!site) return null;

  const sections = [...site.sections]
    .filter((s) => s.visible || isEditor)
    .sort((a, b) => a.order - b.order);

  const theme = useThemeVars(site);

  return (
    <div
      style={{ backgroundColor: theme.bg, fontFamily: site.bodyFont, color: theme.text }}
      onClick={isEditor ? (e) => {
        if ((e.target as HTMLElement).closest(".ed-selectable")) return;
        useEditorStore.getState().setSelectedElement(null);
      } : undefined}
    >
      {sections.map((section) => {
        const props = { section, site, isEditor };
        switch (section.type) {
          case "hero": return <HeroSection key={section.id} {...props} />;
          case "about": return <AboutSection key={section.id} {...props} />;
          case "featuredDrinks": return <FeaturedDrinksSection key={section.id} {...props} />;
          case "hours": return <HoursSection key={section.id} {...props} />;
          case "gallery": return <GallerySection key={section.id} {...props} />;
          default: return <GenericSection key={section.id} {...props} />;
        }
      })}
      {!isEditor && <SiteFooter site={site} />}
    </div>
  );
}
