"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getAuthInstance } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { getSitesByOwner } from "@/lib/firestore";
import type { SiteData } from "@/lib/types";
import { Plus, LogOut, Globe, ExternalLink } from "lucide-react";
import Link from "next/link";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://needaname.fr").replace(/\/$/, "");

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sites, setSites] = useState<SiteData[]>([]);
  const [loadingSites, setLoadingSites] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    getSitesByOwner(user.uid)
      .then(setSites)
      .finally(() => setLoadingSites(false));
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-500" />
          <span className="font-bold text-lg">TapHouse</span>
        </div>
        <div className="flex-1" />
        <span className="text-sm text-gray-500">{user.email}</span>
        <button
          onClick={() => signOut(getAuthInstance()).then(() => router.push("/"))}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <LogOut size={15} /> Déconnexion
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Vos sites</h1>
          <Link
            href="/onboarding"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Plus size={16} /> Nouveau site
          </Link>
        </div>

        {loadingSites ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sites.length === 0 ? (
          <div className="text-center py-20">
            <Globe size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Aucun site pour l&apos;instant
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Créez votre premier site en quelques minutes.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              <Plus size={16} /> Créer votre premier site
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sites.map((site) => (
              <div
                key={site.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="h-28 flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: site.brandColor }}
                >
                  {site.barName.charAt(0)}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-base">{site.barName}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    needaname.fr/sites/{site.slug}
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        site.status === "live"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {site.status === "live" ? "En ligne" : "Brouillon"}
                    </span>
                    <div className="flex-1" />
                    <Link
                      href={`/editor/${site.id}`}
                      className="text-xs font-medium text-amber-600 hover:text-amber-700"
                    >
                      Modifier
                    </Link>
                    {site.status === "live" && (
                      <a
                        href={`${BASE_URL}/sites/${site.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
