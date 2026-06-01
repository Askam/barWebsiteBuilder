import { getSiteBySlug } from "@/lib/firestore";
import { SiteRenderer } from "@/components/site/SiteRenderer";
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
    if (!site) return { title: "Not found" };
    return { title: site.barName, description: site.tagline };
  } catch {
    return { title: "Bar" };
  }
}

export default async function PublicSitePage({ params }: Props) {
  const { slug } = await params;
  let site = null;
  try { site = await getSiteBySlug(slug); } catch { notFound(); }

  if (!site || site.status !== "live") notFound();

  return (
    <div>
      {/* Public site nav */}
      <nav
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{ backgroundColor: site.brandColor + "20", borderColor: site.brandColor + "30" }}
      >
        <h1 className="font-bold text-lg" style={{ fontFamily: site.headingFont }}>
          {site.barName}
        </h1>
        <Link
          href={`/sites/${slug}/menu`}
          className="text-sm font-semibold px-3 py-1.5 rounded-lg text-white"
          style={{ backgroundColor: site.brandColor }}
        >
          Menu
        </Link>
      </nav>

      <SiteRenderer site={site} />
    </div>
  );
}
