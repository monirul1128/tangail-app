/**
 * Recursively converts Firestore Timestamps (and any object with toDate/toJSON)
 * into plain ISO strings so they can be safely passed from Server → Client Components.
 */
export function serializeFirestore<T>(data: T): T {
  if (data === null || data === undefined) return data;

  // Firestore Timestamp — has toDate()
  if (typeof (data as any)?.toDate === "function") {
    return (data as any).toDate().toISOString() as unknown as T;
  }

  // Array
  if (Array.isArray(data)) {
    return data.map(serializeFirestore) as unknown as T;
  }

  // Plain object
  if (typeof data === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      out[k] = serializeFirestore(v);
    }
    return out as T;
  }

  return data;
}
