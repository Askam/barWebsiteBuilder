"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getAuthInstance } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(getAuthInstance(), email, password);
      } else {
        await createUserWithEmailAndPassword(getAuthInstance(), email, password);
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Échec de l'authentification";
      toast.error(msg.replace("Firebase: ", "").replace(/ \(auth\/.*\)/, ""));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-amber-500" />
          <span className="text-2xl font-bold tracking-tight">TapHouse</span>
        </div>
        <p className="text-gray-500 text-sm">
          Créez un site pour votre bar en quelques minutes.
        </p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-xl font-semibold mb-6">
          {mode === "login" ? "Se connecter" : "Créer un compte"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="vous@votrebar.fr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-60"
          >
            {submitting
              ? "Patientez…"
              : mode === "login"
              ? "Se connecter"
              : "Créer un compte"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {mode === "login" ? "Nouveau ici ? " : "Déjà un compte ? "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-amber-600 font-medium hover:underline"
          >
            {mode === "login" ? "Créer un compte" : "Se connecter"}
          </button>
        </p>
      </div>
    </div>
  );
}
