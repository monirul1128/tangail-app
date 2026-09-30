import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query, limit, QueryConstraint, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/** Fetch all docs from a collection — returns [] on any error */
export async function adminGetAll<T>(
  col: string,
  orderField = "createdAt",
  lim = 200
): Promise<(T & { id: string })[]> {
  try {
    const constraints: QueryConstraint[] = [limit(lim)];
    try {
      // orderBy can fail if the field doesn't exist or index is missing
      constraints.unshift(orderBy(orderField, "desc"));
    } catch {
      // fall through without ordering
    }

    const snap = await getDocs(query(collection(db, col), ...constraints));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T & { id: string }));
  } catch (err: any) {
    // If index missing, retry without ordering
    if (
      err?.code === "failed-precondition" ||
      err?.message?.includes("index") ||
      err?.message?.includes("requires an index")
    ) {
      try {
        const snap = await getDocs(query(collection(db, col), limit(lim)));
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T & { id: string }));
      } catch {
        return [];
      }
    }
    // Collection doesn't exist yet or any other error — return empty array
    console.warn(`adminGetAll(${col}):`, err?.message ?? err);
    return [];
  }
}

/** Add a new document */
export async function adminAdd(col: string, data: Record<string, any>): Promise<string> {
  const { id: _id, ...clean } = data;
  const ref = await addDoc(collection(db, col), {
    ...clean,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** Update an existing document */
export async function adminUpdate(col: string, id: string, data: Record<string, any>): Promise<void> {
  const { id: _id, ...clean } = data;
  await updateDoc(doc(db, col, id), { ...clean, updatedAt: serverTimestamp() });
}

/** Delete a document */
export async function adminDelete(col: string, id: string): Promise<void> {
  await deleteDoc(doc(db, col, id));
}
