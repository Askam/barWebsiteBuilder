import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { getDbInstance } from "./firebase";
import type { SiteData } from "./types";

function db() {
  return getDbInstance();
}

export async function getSiteById(siteId: string): Promise<SiteData | null> {
  const snap = await getDoc(doc(db(), "sites", siteId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as SiteData;
}

export async function getSiteBySlug(slug: string): Promise<SiteData | null> {
  const q = query(collection(db(), "sites"), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as SiteData;
}

export async function getSitesByOwner(ownerId: string): Promise<SiteData[]> {
  const q = query(
    collection(db(), "sites"),
    where("ownerId", "==", ownerId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SiteData));
}

export async function createSite(
  data: Omit<SiteData, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = doc(collection(db(), "sites"));
  await setDoc(ref, { ...data, createdAt: Date.now(), updatedAt: Date.now() });
  return ref.id;
}

export async function updateSite(
  siteId: string,
  data: Partial<SiteData>
): Promise<void> {
  await updateDoc(doc(db(), "sites", siteId), {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function publishSite(siteId: string): Promise<void> {
  await updateDoc(doc(db(), "sites", siteId), {
    status: "live",
    updatedAt: Date.now(),
  });
}
