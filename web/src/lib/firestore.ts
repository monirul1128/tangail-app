import {
  collection, query, where, orderBy, limit,
  getDocs, getDoc, doc, addDoc, updateDoc,
  QueryConstraint, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { COLLECTIONS } from "./constants";
import type {
  Hospital, Doctor, BloodDonor, Ambulance,
  NewsArticle, EmergencyContact,
  Pharmacy, EducationInstitution, Business,
  TransportService, FinanceService, Professional,
  Organization, JobPosting, TourismSpot,
  GalleryPhoto, NotablePerson, BusinessRegistration,
} from "@/models/types";

// ─── Generic helper ───────────────────────────────────────────────────────────
function fromDocs<T>(snap: { docs: any[] }): T[] {
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

// ─── Hospitals ────────────────────────────────────────────────────────────────
export async function getHospitals(filters?: { upazilaId?: string; type?: string }): Promise<Hospital[]> {
  const constraints: QueryConstraint[] = [orderBy("rating", "desc"), limit(50)];
  if (filters?.upazilaId) constraints.unshift(where("upazilaId", "==", filters.upazilaId));
  if (filters?.type)      constraints.unshift(where("type",      "==", filters.type));
  const snap = await getDocs(query(collection(db, COLLECTIONS.hospitals), ...constraints));
  return fromDocs<Hospital>(snap);
}

export async function getHospitalById(id: string): Promise<Hospital | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.hospitals, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Hospital;
}

// ─── Doctors ──────────────────────────────────────────────────────────────────
export async function getDoctors(filters?: { specialty?: string; upazilaId?: string }): Promise<Doctor[]> {
  const constraints: QueryConstraint[] = [orderBy("rating", "desc"), limit(50)];
  if (filters?.specialty) constraints.unshift(where("specialty", "==", filters.specialty));
  if (filters?.upazilaId) constraints.unshift(where("upazilaId", "==", filters.upazilaId));
  const snap = await getDocs(query(collection(db, COLLECTIONS.doctors), ...constraints));
  return fromDocs<Doctor>(snap);
}

export async function getDoctorById(id: string): Promise<Doctor | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.doctors, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Doctor;
}

// ─── Blood Donors ─────────────────────────────────────────────────────────────
export async function getBloodDonors(filters?: { bloodGroup?: string; upazilaId?: string }): Promise<BloodDonor[]> {
  const constraints: QueryConstraint[] = [where("isAvailable", "==", true), limit(50)];
  if (filters?.bloodGroup) constraints.unshift(where("bloodGroup", "==", filters.bloodGroup));
  if (filters?.upazilaId)  constraints.unshift(where("upazilaId",  "==", filters.upazilaId));
  const snap = await getDocs(query(collection(db, COLLECTIONS.blood_donors), ...constraints));
  return fromDocs<BloodDonor>(snap);
}

export async function registerBloodDonor(donor: Omit<BloodDonor, "id">): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.blood_donors), {
    ...donor, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// ─── Ambulances ───────────────────────────────────────────────────────────────
export async function getAmbulances(upazilaId?: string): Promise<Ambulance[]> {
  const constraints: QueryConstraint[] = [where("isAvailable", "==", true), limit(50)];
  if (upazilaId) constraints.unshift(where("upazilaId", "==", upazilaId));
  const snap = await getDocs(query(collection(db, COLLECTIONS.ambulances), ...constraints));
  return fromDocs<Ambulance>(snap);
}

// ─── News ─────────────────────────────────────────────────────────────────────
export async function getNews(category?: string, pageLimit = 20): Promise<NewsArticle[]> {
  const constraints: QueryConstraint[] = [orderBy("publishedAt", "desc"), limit(pageLimit)];
  if (category) constraints.unshift(where("category", "==", category));
  const snap = await getDocs(query(collection(db, COLLECTIONS.news), ...constraints));
  return fromDocs<NewsArticle>(snap);
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
  return fromDocs<EmergencyContact>(snap);
}

// ─── Pharmacies ───────────────────────────────────────────────────────────────
export async function getPharmacies(upazilaId?: string): Promise<Pharmacy[]> {
  const constraints: QueryConstraint[] = [orderBy("name"), limit(50)];
  if (upazilaId) constraints.unshift(where("upazilaId", "==", upazilaId));
  const snap = await getDocs(query(collection(db, COLLECTIONS.pharmacies), ...constraints));
  return fromDocs<Pharmacy>(snap);
}

// ─── Education ────────────────────────────────────────────────────────────────
export async function getEducationInstitutions(filters?: {
  type?: string; upazilaId?: string;
}): Promise<EducationInstitution[]> {
  const constraints: QueryConstraint[] = [orderBy("name"), limit(100)];
  if (filters?.type)      constraints.unshift(where("type",      "==", filters.type));
  if (filters?.upazilaId) constraints.unshift(where("upazilaId", "==", filters.upazilaId));
  const snap = await getDocs(query(collection(db, COLLECTIONS.education), ...constraints));
  return fromDocs<EducationInstitution>(snap);
}

// ─── Businesses ───────────────────────────────────────────────────────────────
export async function getBusinesses(filters?: {
  category?: string; upazilaId?: string;
}): Promise<Business[]> {
  const constraints: QueryConstraint[] = [
    where("isVerified", "==", true), orderBy("rating", "desc"), limit(50),
  ];
  if (filters?.category)  constraints.unshift(where("category",  "==", filters.category));
  if (filters?.upazilaId) constraints.unshift(where("upazilaId", "==", filters.upazilaId));
  const snap = await getDocs(query(collection(db, COLLECTIONS.businesses), ...constraints));
  return fromDocs<Business>(snap);
}

export async function submitBusinessRegistration(data: Omit<BusinessRegistration, "id">): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.business_requests), {
    ...data, status: "pending", submittedAt: serverTimestamp(),
  });
  return ref.id;
}

// ─── Transport ────────────────────────────────────────────────────────────────
export async function getTransportServices(filters?: {
  type?: string; upazilaId?: string;
}): Promise<TransportService[]> {
  const constraints: QueryConstraint[] = [orderBy("name"), limit(50)];
  if (filters?.type)      constraints.unshift(where("type",      "==", filters.type));
  if (filters?.upazilaId) constraints.unshift(where("upazilaId", "==", filters.upazilaId));
  const snap = await getDocs(query(collection(db, COLLECTIONS.transport), ...constraints));
  return fromDocs<TransportService>(snap);
}

// ─── Finance ──────────────────────────────────────────────────────────────────
export async function getFinanceServices(filters?: {
  type?: string; upazilaId?: string;
}): Promise<FinanceService[]> {
  const constraints: QueryConstraint[] = [orderBy("name"), limit(50)];
  if (filters?.type)      constraints.unshift(where("type",      "==", filters.type));
  if (filters?.upazilaId) constraints.unshift(where("upazilaId", "==", filters.upazilaId));
  const snap = await getDocs(query(collection(db, COLLECTIONS.finance), ...constraints));
  return fromDocs<FinanceService>(snap);
}

// ─── Professionals ────────────────────────────────────────────────────────────
export async function getProfessionals(filters?: {
  type?: string; upazilaId?: string;
}): Promise<Professional[]> {
  const constraints: QueryConstraint[] = [orderBy("name"), limit(50)];
  if (filters?.type)      constraints.unshift(where("type",      "==", filters.type));
  if (filters?.upazilaId) constraints.unshift(where("upazilaId", "==", filters.upazilaId));
  const snap = await getDocs(query(collection(db, COLLECTIONS.professionals), ...constraints));
  return fromDocs<Professional>(snap);
}

// ─── Organizations ────────────────────────────────────────────────────────────
export async function getOrganizations(filters?: {
  type?: string; upazilaId?: string;
}): Promise<Organization[]> {
  const constraints: QueryConstraint[] = [orderBy("name"), limit(50)];
  if (filters?.type)      constraints.unshift(where("type",      "==", filters.type));
  if (filters?.upazilaId) constraints.unshift(where("upazilaId", "==", filters.upazilaId));
  const snap = await getDocs(query(collection(db, COLLECTIONS.organizations), ...constraints));
  return fromDocs<Organization>(snap);
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export async function getJobs(type?: string): Promise<JobPosting[]> {
  const constraints: QueryConstraint[] = [
    where("isActive", "==", true), orderBy("publishedAt", "desc"), limit(30),
  ];
  if (type) constraints.unshift(where("type", "==", type));
  const snap = await getDocs(query(collection(db, COLLECTIONS.jobs), ...constraints));
  return fromDocs<JobPosting>(snap);
}

// ─── Tourism ──────────────────────────────────────────────────────────────────
export async function getTourismSpots(filters?: {
  category?: string; upazilaId?: string;
}): Promise<TourismSpot[]> {
  const constraints: QueryConstraint[] = [orderBy("name"), limit(50)];
  if (filters?.category)  constraints.unshift(where("category",  "==", filters.category));
  if (filters?.upazilaId) constraints.unshift(where("upazilaId", "==", filters.upazilaId));
  const snap = await getDocs(query(collection(db, COLLECTIONS.tourism), ...constraints));
  return fromDocs<TourismSpot>(snap);
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export async function getGalleryPhotos(category?: string): Promise<GalleryPhoto[]> {
  const constraints: QueryConstraint[] = [
    where("isApproved", "==", true), orderBy("createdAt", "desc"), limit(50),
  ];
  if (category) constraints.unshift(where("category", "==", category));
  const snap = await getDocs(query(collection(db, COLLECTIONS.gallery), ...constraints));
  return fromDocs<GalleryPhoto>(snap);
}

// ─── Notable Persons ──────────────────────────────────────────────────────────
export async function getNotablePersons(category?: string): Promise<NotablePerson[]> {
  const constraints: QueryConstraint[] = [orderBy("name"), limit(50)];
  if (category) constraints.unshift(where("category", "==", category));
  const snap = await getDocs(query(collection(db, COLLECTIONS.notable_persons), ...constraints));
  return fromDocs<NotablePerson>(snap);
}
