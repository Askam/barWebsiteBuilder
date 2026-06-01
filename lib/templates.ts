import type { SiteData, Theme } from "./types";

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export function buildSiteFromTemplate(
  ownerId: string,
  barName: string,
  tagline: string,
  theme: Theme
): Omit<SiteData, "id" | "createdAt" | "updatedAt"> {
  const themeColorMap: Record<Theme, string> = {
    speakeasy: "#e0913a",
    neighbourhood: "#3f6b54",
    taproom: "#e0913a",
    winebar: "#7a3045",
  };

  const slug = barName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  return {
    ownerId,
    barName: barName || "Mon Bar",
    tagline: tagline || "Votre bar de quartier depuis toujours",
    logoUrl: null,
    theme,
    brandColor: (themeColorMap[theme] as SiteData["brandColor"]) ?? "#e0913a",
    headingFont: "Georgia, serif",
    bodyFont: "system-ui, sans-serif",
    status: "draft",
    slug: slug || "mon-bar",
    customDomain: null,
    sections: [
      {
        id: makeId(),
        type: "hero",
        visible: true,
        order: 0,
        content: {
          heading: barName || "Le Comptoir",
          body: tagline || "bières artisanales & cocktails · votre bar depuis 2019",
          ctaText: "Réserver une table",
          heroImageUrl: "",
        },
      },
      {
        id: makeId(),
        type: "about",
        visible: true,
        order: 1,
        content: {
          heading: "Notre histoire",
          body: "Un bar de quartier avec du caractère. Chez nous, les bons verres et les bonnes conversations vont de pair.",
        },
      },
      {
        id: makeId(),
        type: "featuredDrinks",
        visible: true,
        order: 2,
        content: {
          heading: "Nos boissons",
          drinks: [
            { name: "Old Fashioned", description: "Bourbon, angostura, orange" },
            { name: "Bière de la maison", description: "Brasserie locale, 4,5°" },
            { name: "Spritz du moment", description: "Demandez au bar" },
          ],
        },
      },
      {
        id: makeId(),
        type: "hours",
        visible: true,
        order: 3,
        content: {
          heading: "Horaires d'ouverture",
          hoursText:
            "Lun–Jeu : 17h–23h\nVen : 17h–1h\nSam : 12h–1h\nDim : 12h–22h",
        },
      },
      {
        id: makeId(),
        type: "gallery",
        visible: true,
        order: 4,
        content: { heading: "Galerie", imageUrls: [] },
      },
      {
        id: makeId(),
        type: "events",
        visible: false,
        order: 5,
        content: { heading: "Événements & concerts", body: "" },
      },
      {
        id: makeId(),
        type: "location",
        visible: true,
        order: 6,
        content: { heading: "Nous trouver", address: "" },
      },
      {
        id: makeId(),
        type: "reservations",
        visible: true,
        order: 7,
        content: { heading: "Réservations", reservationUrl: "" },
      },
      {
        id: makeId(),
        type: "contact",
        visible: true,
        order: 8,
        content: {
          heading: "Contact & réseaux",
          phone: "",
          email: "",
          socials: [],
        },
      },
    ],
    menu: {
      categories: [
        {
          id: makeId(),
          name: "Cocktails",
          visible: true,
          order: 0,
          items: [
            { id: makeId(), name: "Old Fashioned", price: "11€", tags: [] },
            { id: makeId(), name: "Negroni", price: "10€", tags: [] },
            { id: makeId(), name: "Spritz maison", price: "9€", tags: ["v"] },
          ],
        },
        {
          id: makeId(),
          name: "Bières & cidres",
          visible: true,
          order: 1,
          items: [
            { id: makeId(), name: "Pale Ale", price: "6€", tags: [] },
            { id: makeId(), name: "Stout", price: "6€", tags: [] },
            { id: makeId(), name: "Lager", price: "5€", tags: [] },
          ],
        },
        {
          id: makeId(),
          name: "Vins",
          visible: true,
          order: 2,
          items: [
            { id: makeId(), name: "Rouge maison", price: "7€", tags: ["v"] },
            { id: makeId(), name: "Blanc maison", price: "7€", tags: ["v"] },
          ],
        },
      ],
      settings: {
        layout: "list",
        showPrices: true,
        currency: "€",
        showDietaryTags: true,
      },
    },
  };
}
