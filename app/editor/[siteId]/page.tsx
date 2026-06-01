"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getSiteById } from "@/lib/firestore";
import { useEditorStore } from "@/lib/store";
import { EditorTopBar } from "@/components/editor/EditorTopBar";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { PreviewCanvas } from "@/components/editor/PreviewCanvas";

export default function EditorPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { site, setSite } = useEditorStore();

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (!siteId || site?.id === siteId) return;
    getSiteById(siteId).then((data) => {
      if (!data) { router.replace("/dashboard"); return; }
      setSite(data);
    });
  }, [siteId, site?.id, setSite, router]);

  if (!site || site.id !== siteId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <EditorTopBar siteId={siteId} />
      <div className="flex flex-1 overflow-hidden">
        <EditorPanel />
        <PreviewCanvas />
      </div>
    </div>
  );
}
