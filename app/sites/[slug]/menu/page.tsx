import { getSiteBySlug } from "@/lib/firestore";
import { MenuPreview } from "@/components/site/MenuPreview";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  try {
    const { slug } = await params;
    const site = await getSiteBySlug(slug);
    if (!site) return { title: "Menu" };
    return { title: `${site.barName} — Menu` };
  } catch {
    return { title: "Menu" };
  }
}

export default async function PublicMenuPage({ params }: Props) {
  const { slug } = await params;
  let site = null;
  try { site = await getSiteBySlug(slug); } catch { notFound(); }

  if (!site || site.status !== "live") notFound();

  return (
    <div>
      <nav
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{ backgroundColor: site.brandColor + "20", borderColor: site.brandColor + "30" }}
      >
        <Link href={`/sites/${slug}`} className="font-bold text-lg" style={{ fontFamily: site.headingFont }}>
          {site.barName}
        </Link>
        <span
          className="text-sm font-semibold px-3 py-1.5 rounded-lg text-white"
          style={{ backgroundColor: site.brandColor }}
        >
          Menu
        </span>
      </nav>

      <MenuPreview site={site} />
    </div>
  );
}
