import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import { COLLECTIONS } from "./constants";
import type { Hospital, Doctor, BloodDonor, Ambulance, NewsArticle, EmergencyContact } from "@/models/types";

// ─── Hospitals ────────────────────────────────────────────────────────────────

export async function getHospitals(filters?: {
  upazilaId?: string;
  type?: string;
}): Promise<Hospital[]> {
  const constraints: QueryConstraint[] = [orderBy("rating", "desc"), limit(50)];
  if (filters?.upazilaId) constraints.unshift(where("upazilaId", "==", filters.upazilaId));
  if (filters?.type)      constraints.unshift(where("type", "==", filters.type));

  const snap = await getDocs(query(collection(db, COLLECTIONS.hospitals), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Hospital));
}

export async function getHospitalById(id: string): Promise<Hospital | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.hospitals, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Hospital;
}

// ─── Doctors ──────────────────────────────────────────────────────────────────

export async function getDoctors(filters?: {
  specialty?: string;
  upazilaId?: string;
}): Promise<Doctor[]> {
  const constraints: QueryConstraint[] = [orderBy("rating", "desc"), limit(50)];
  if (filters?.specialty) constraints.unshift(where("specialty", "==", filters.specialty));
  if (filters?.upazilaId) constraints.unshift(where("upazilaId", "==", filters.upazilaId));

  const snap = await getDocs(query(collection(db, COLLECTIONS.doctors), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Doctor));
}

export async function getDoctorById(id: string): Promise<Doctor | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.doctors, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Doctor;
}

// ─── Blood Donors ─────────────────────────────────────────────────────────────

export async function getBloodDonors(filters?: {
  bloodGroup?: string;
  upazilaId?: string;
}): Promise<BloodDonor[]> {
  const constraints: QueryConstraint[] = [
    where("isAvailable", "==", true),
    limit(50),
  ];
  if (filters?.bloodGroup) constraints.unshift(where("bloodGroup", "==", filters.bloodGroup));
  if (filters?.upazilaId)  constraints.unshift(where("upazilaId",  "==", filters.upazilaId));

  const snap = await getDocs(query(collection(db, COLLECTIONS.blood_donors), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BloodDonor));
}

// ─── Ambulances ───────────────────────────────────────────────────────────────

export async function getAmbulances(upazilaId?: string): Promise<Ambulance[]> {
  const constraints: QueryConstraint[] = [where("isAvailable", "==", true), limit(50)];
  if (upazilaId) constraints.unshift(where("upazilaId", "==", upazilaId));

  const snap = await getDocs(query(collection(db, COLLECTIONS.ambulances), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Ambulance));
}

// ─── News ─────────────────────────────────────────────────────────────────────

export async function getNews(category?: string, pageLimit = 20): Promise<NewsArticle[]> {
  const constraints: QueryConstraint[] = [orderBy("publishedAt", "desc"), limit(pageLimit)];
  if (category) constraints.unshift(where("category", "==", category));

  const snap = await getDocs(query(collection(db, COLLECTIONS.news), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as NewsArticle));
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.news, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as NewsArticle;
}

export async function getLatestNews(pageLimit = 5): Promise<NewsArticle[]> {
  return getNews(undefined, pageLimit);
}

// ─── Emergency Contacts ───────────────────────────────────────────────────────

export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.emergency_contacts), orderBy("sortOrder"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as EmergencyContact));
}
