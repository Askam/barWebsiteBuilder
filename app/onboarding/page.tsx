"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createSite } from "@/lib/firestore";
import { buildSiteFromTemplate } from "@/lib/templates";
import type { Theme } from "@/lib/types";
import { toast } from "sonner";
import { ChevronRight, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const TEMPLATES: { id: Theme; name: string; bg: string; label: string }[] = [
  { id: "speakeasy", name: "Speakeasy", bg: "#2c2a28", label: "SOMBRE" },
  { id: "neighbourhood", name: "Neighbourhood", bg: "#f0e9da", label: "CLAIR" },
  { id: "taproom", name: "Taproom", bg: "#e0913a", label: "BOLD" },
  { id: "winebar", name: "Wine bar", bg: "#7a3045", label: "VIN" },
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [barName, setBarName] = useState("");
  const [tagline, setTagline] = useState("");
  const [selected, setSelected] = useState<Theme | "blank">("speakeasy");
  const [creating, setCreating] = useState(false);

  async function handleStart() {
    if (!user) return;
    setCreating(true);
    try {
      const theme: Theme = selected === "blank" ? "neighbourhood" : selected;
      const data = buildSiteFromTemplate(user.uid, barName, tagline, theme);
      const siteId = await createSite(data);
      router.push(`/editor/${siteId}`);
    } catch {
      toast.error("Impossible de créer votre site. Réessayez.");
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-amber-500" />
        <span className="font-bold text-lg">TapHouse</span>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">Créons votre site</h1>
        <p className="text-gray-500 text-sm mb-10">
          Deux étapes rapides. Tout est modifiable ensuite — le template n&apos;est qu&apos;un point de départ.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">
          {/* Étape 1 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-1">
              Étape 1
            </div>
            <h2 className="text-lg font-semibold mb-5">Parlez-nous de votre établissement</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du bar <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={barName}
                  onChange={(e) => setBarName(e.target.value)}
                  placeholder="Le Comptoir"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Vide ? On utilisera un nom par défaut.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accroche <span className="text-gray-400 font-normal">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="votre bar de quartier depuis 2019…"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Étape 2 */}
          <div>
            <div className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-1">
              Étape 2
            </div>
            <h2 className="text-lg font-semibold mb-2">Choisissez un template</h2>
            <p className="text-gray-500 text-sm mb-5">
              Choisissez une ambiance. Couleurs, polices et mise en page sont modifiables dans l&apos;éditeur.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className={cn(
                    "rounded-xl border-2 overflow-hidden text-left transition-all",
                    selected === t.id
                      ? "border-amber-500 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div
                    className="h-24 flex items-center justify-center text-xs font-bold opacity-60"
                    style={{
                      backgroundColor: t.bg,
                      color: t.id === "neighbourhood" ? "#2c2a28" : "#fff",
                    }}
                  >
                    {t.label}
                  </div>
                  <div className="bg-white px-3 py-2 text-sm font-medium flex items-center justify-between">
                    {t.name}
                    {selected === t.id && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
                        choisi
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelected("blank")}
              className={cn(
                "w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                selected === "blank"
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              )}
            >
              <Rocket size={22} className="text-amber-500 shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-sm">Partir de zéro</div>
                <div className="text-xs text-gray-400">
                  Pour les propriétaires qui préfèrent construire section par section.
                </div>
              </div>
              {selected === "blank" && (
                <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
                  choisi
                </span>
              )}
            </button>

            <div className="mt-6 flex items-center gap-3 text-sm text-gray-400">
              <ChevronRight size={16} />
              <span>Votre choix vous amène directement dans l&apos;éditeur.</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button
            onClick={handleStart}
            disabled={creating}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-xl text-base transition-colors disabled:opacity-60"
          >
            {creating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création…
              </>
            ) : (
              <>
                Commencer <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
