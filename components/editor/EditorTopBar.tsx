"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Monitor, Smartphone, Eye, Share2, ChevronLeft } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { updateSite, publishSite } from "@/lib/firestore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function EditorTopBar({ siteId }: { siteId: string }) {
  const router = useRouter();
  const {
    site,
    activePage,
    setActivePage,
    devicePreview,
    setDevicePreview,
    isSaving,
    setSaving,
  } = useEditorStore();

  async function handleSave() {
    if (!site) return;
    setSaving(true);
    try {
      await updateSite(siteId, site);
      toast.success("Enregistré");
    } catch {
      toast.error("Erreur de sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!site) return;
    setSaving(true);
    try {
      await updateSite(siteId, site);
      await publishSite(siteId);
      toast.success("Site publié !");
      router.push(`/editor/${siteId}/publish`);
    } catch {
      toast.error("Erreur de publication");
    } finally {
      setSaving(false);
    }
  }

  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center gap-2 px-3 shrink-0">
      <Link
        href="/dashboard"
        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors mr-1"
      >
        <ChevronLeft size={15} />
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-amber-500" />
          <span className="font-bold text-sm">TapHouse</span>
        </div>
      </Link>

      {/* Onglets de page */}
      <div className="flex items-center bg-gray-100 rounded-lg p-0.5 ml-1">
        {(["home", "menu"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setActivePage(p)}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-md transition-colors",
              activePage === p
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {p === "home" ? "Accueil" : "Menu"}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Aperçu appareil */}
      <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
        <button
          onClick={() => setDevicePreview("desktop")}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            devicePreview === "desktop"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          )}
          title="Aperçu bureau"
        >
          <Monitor size={14} />
        </button>
        <button
          onClick={() => setDevicePreview("phone")}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            devicePreview === "phone"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          )}
          title="Aperçu mobile"
        >
          <Smartphone size={14} />
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <Eye size={13} />
        {isSaving ? "Sauvegarde…" : "Enregistrer"}
      </button>

      <button
        onClick={handlePublish}
        disabled={isSaving}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50"
      >
        <Share2 size={13} />
        Publier
      </button>
    </header>
  );
}
