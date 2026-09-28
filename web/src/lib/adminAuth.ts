import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

/** Sign in and verify the user has admin claim in Firestore */
export async function adminSignIn(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  // Check Firestore users/{uid}.isAdmin == true
  const snap = await getDoc(doc(db, "users", cred.user.uid));
  if (!snap.exists() || snap.data()?.isAdmin !== true) {
    await signOut(auth);
    throw new Error("আপনার অ্যাডমিন অ্যাক্সেস নেই।");
  }

  return cred.user;
}

export async function adminSignOut(): Promise<void> {
  await signOut(auth);
}

export function onAdminAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}
