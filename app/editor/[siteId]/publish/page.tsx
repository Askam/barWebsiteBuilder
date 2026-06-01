"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getSiteById, updateSite } from "@/lib/firestore";
import { useEditorStore } from "@/lib/store";
import type { SiteData } from "@/lib/types";
import {
  Check,
  Copy,
  ExternalLink,
  Globe,
  ArrowLeft,
  Rocket,
  QrCode,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://needaname.fr").replace(/\/$/, "");

export default function PublishPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { site, setSite } = useEditorStore();
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (!siteId || site?.id === siteId) return;
    getSiteById(siteId).then((data) => {
      if (data) setSite(data);
    });
  }, [siteId, site?.id, setSite]);

  useEffect(() => {
    if (!site) return;
    const url = `${BASE_URL}/sites/${site.slug}`;
    QRCode.toDataURL(url, { width: 256, margin: 2 }).then(setQrDataUrl).catch(() => {});
  }, [site]);

  if (!site) return null;

  const liveUrl = `${BASE_URL}/sites/${site.slug}`;

  async function handleRepublish() {
    if (!site) return;
    setSaving(true);
    try {
      await updateSite(siteId, { ...site, status: "live" });
      setSite({ ...site, status: "live" });
      toast.success("Site republié !");
    } catch {
      toast.error("Erreur de republication");
    } finally {
      setSaving(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(liveUrl);
    toast.success("Lien copié !");
  }

  function downloadQr() {
    if (!site) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${site.slug}-qr.png`;
    a.click();
  }

  const checklist: { label: string; done: boolean }[] = [
    { label: "Nom du bar renseigné", done: !!site.barName },
    { label: "Horaires ajoutés", done: !!site.sections.find((s) => s.type === "hours")?.content.hoursText },
    { label: "Photo principale ajoutée", done: !!site.sections.find((s) => s.type === "hero")?.content.heroImageUrl },
    { label: "Menu avec des articles", done: site.menu.categories.some((c) => c.items.length > 0) },
    { label: "Infos de contact renseignées", done: !!site.sections.find((s) => s.type === "contact")?.content.phone || !!site.sections.find((s) => s.type === "contact")?.content.email },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link
          href={`/editor/${siteId}`}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={15} /> Retour à l&apos;éditeur
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-amber-500" />
          <span className="font-bold">TapHouse</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">Publier &amp; partager</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
          {/* Carte de publication */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <span
                className={`flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1 rounded-full ${
                  site.status === "live"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${site.status === "live" ? "bg-green-500" : "bg-gray-400"}`} />
                {site.status === "live" ? "En ligne" : "Brouillon"}
              </span>
              <h2 className="text-lg font-semibold">
                {site.status === "live" ? "Votre site est en ligne" : "Prêt à publier"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1.5">
                  Adresse gratuite
                </label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
                  <span className="flex-1 truncate text-gray-500">
                    needaname.fr/sites/<span className="font-bold text-gray-900">{site.slug}</span>
                  </span>
                  <Globe size={14} className="text-gray-400 shrink-0" />
                </div>

                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1.5 mt-4">
                  Domaine personnalisé
                </label>
                <div className="flex items-center gap-2 border border-dashed border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-400">
                  <span className="flex-1">connectez votrebar.fr…</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink size={13} /> Voir le site
                  </a>
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Copy size={13} /> Copier le lien
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1.5">
                  QR code — tables &amp; vitrine
                </label>
                <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-3">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR Code" className="w-32 h-32" />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <QrCode size={40} className="text-gray-300" />
                    </div>
                  )}
                  <button
                    onClick={downloadQr}
                    disabled={!qrDataUrl}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 disabled:opacity-40"
                  >
                    <Download size={12} /> Télécharger PNG
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
              <Check size={16} className="text-green-500 shrink-0" />
              Pages publiées : <strong className="text-gray-900">Accueil</strong> ·{" "}
              <strong className="text-gray-900">Menu</strong> · Les modifications s&apos;appliquent immédiatement.
            </div>
          </div>

          {/* Checklist + republier */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold mb-4">Avant de publier</h3>
              <div className="space-y-2.5">
                {checklist.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                        item.done
                          ? "bg-green-100"
                          : "border-2 border-dashed border-gray-200"
                      }`}
                    >
                      {item.done && <Check size={12} className="text-green-600" />}
                    </div>
                    <span
                      className={`text-sm ${item.done ? "text-gray-900" : "text-gray-400"}`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleRepublish}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-base transition-colors disabled:opacity-60"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Rocket size={18} />
              )}
              {site.status === "live" ? "Republier les modifications" : "Publier le site"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
