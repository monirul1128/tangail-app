"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { onAdminAuthChange } from "@/lib/adminAuth";
import { db } from "@/lib/firebase";

interface AdminAuthCtx {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const Ctx = createContext<AdminAuthCtx>({ user: null, isAdmin: false, loading: true });

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAdminAuthChange(async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        setIsAdmin(snap.exists() && snap.data()?.isAdmin === true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  return <Ctx.Provider value={{ user, isAdmin, loading }}>{children}</Ctx.Provider>;
}

export const useAdminAuth = () => useContext(Ctx);
