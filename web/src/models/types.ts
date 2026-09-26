import { Timestamp, GeoPoint } from "firebase/firestore";

// ─── Existing types ────────────────────────────────────────────────────────────

export interface Hospital {
  id: string;
  name: string;
  nameEn: string;
  type: "government" | "private" | "diagnostic" | "clinic";
  upazilaId: string;
  address: string;
  phone: string[];
  specialties: string[];
  totalBeds: number;
  emergencyAvailable: boolean;
  isOpen24Hours: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  location?: GeoPoint;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Doctor {
  id: string;
  name: string;
  nameEn: string;
  specialty: string;
  qualifications: string[];
  hospitalId: string;
  hospitalName: string;
  upazilaId: string;
  chamberAddress: string;
  visitingHours: string;
  phone: string;
  visitFee: number;
  isAvailable: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface BloodDonor {
  id: string;
  userId: string;
  name: string;
  phone: string;
  bloodGroup: string;
  upazilaId: string;
  address: string;
  lastDonationDate?: Timestamp;
  totalDonations: number;
  isAvailable: boolean;
  gender: "male" | "female";
  age: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Ambulance {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  alternatePhone: string;
  upazilaId: string;
  type: string;
  isAvailable: boolean;
  isAvailable24Hours: boolean;
  rentalCostPerKm: number;
  isVerified: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface NewsArticle {
  id: string;
  title: string;
  titleEn: string;
  body: string;
  category: string;
  imageUrl: string;
  source: string;
  isNotice: boolean;
  publishedAt: Timestamp;
  createdAt?: Timestamp;
}

export interface EmergencyContact {
  id: string;
  title: string;
  titleEn: string;
  category: "fire" | "police" | "ambulance" | "hospital" | "hotline" | "other";
  phone: string[];
  upazilaId?: string;
  isNational: boolean;
  sortOrder: number;
}

// ─── New types ─────────────────────────────────────────────────────────────────

export interface Pharmacy {
  id: string;
  name: string;
  ownerName: string;
  upazilaId: string;
  address: string;
  phone: string;
  phone2?: string;
  hours: string;
  isOpen24Hours: boolean;
  isVerified: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface EducationInstitution {
  id: string;
  name: string;
  nameEn: string;
  type: "school" | "college" | "university" | "madrasa" | "library" | "training" | "other";
  upazilaId: string;
  address: string;
  phone: string;
  principalName?: string;
  establishedYear?: number;
  isGovt: boolean;
  isVerified: boolean;
  studentCount?: number;
  imageUrl?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Business {
  id: string;
  userId?: string;
  name: string;
  category: "hotel" | "restaurant" | "beauty" | "nursery" | "agriculture" | "shop" | "other";
  upazilaId: string;
  address: string;
  phone: string;
  phone2?: string;
  description?: string;
  hours?: string;
  ownerName?: string;
  imageUrl?: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TransportService {
  id: string;
  name: string;
  type: "bus" | "train" | "rentcar" | "cng" | "fuel" | "courier";
  upazilaId: string;
  address: string;
  phone: string;
  phone2?: string;
  route?: string;
  hours?: string;
  isVerified: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface FinanceService {
  id: string;
  name: string;
  type: "bank" | "atm" | "mobile_banking" | "market";
  upazilaId: string;
  address: string;
  phone?: string;
  hours?: string;
  isGovt?: boolean;
  isVerified: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Professional {
  id: string;
  name: string;
  type: "lawyer" | "journalist" | "technician" | "kazi" | "other";
  specialization?: string;
  upazilaId: string;
  address: string;
  phone: string;
  hours?: string;
  experience?: string;
  isVerified: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Organization {
  id: string;
  name: string;
  type: "govt" | "ngo" | "business" | "cultural" | "sports" | "social" | "service";
  description: string;
  upazilaId: string;
  address: string;
  phone?: string;
  email?: string;
  foundedYear?: number;
  isVerified: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface JobPosting {
  id: string;
  title: string;
  organization: string;
  type: "govt" | "private" | "bank" | "ngo";
  location: string;
  deadline: string;
  applyLink?: string;
  description?: string;
  salary?: string;
  isActive: boolean;
  publishedAt: Timestamp;
  createdAt?: Timestamp;
}

export interface TourismSpot {
  id: string;
  name: string;
  nameEn?: string;
  category: "historical" | "nature" | "entertainment" | "education" | "modern";
  upazilaId: string;
  address: string;
  description: string;
  imageUrl?: string;
  openingHours?: string;
  entryFee?: string;
  tips?: string;
  location?: GeoPoint;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface GalleryPhoto {
  id: string;
  caption: string;
  category: string;
  upazilaId: string;
  imageUrl: string;
  uploadedBy?: string;
  isApproved: boolean;
  createdAt?: Timestamp;
}

export interface NotablePerson {
  id: string;
  name: string;
  nameEn?: string;
  title: string;
  category: "politics" | "literature" | "social" | "art" | "sports" | "other";
  upazilaId: string;
  bornYear?: string;
  diedYear?: string;
  bio: string;
  achievements: string[];
  imageUrl?: string;
  createdAt?: Timestamp;
}

export interface BusinessRegistration {
  id?: string;
  name: string;
  category: string;
  upazilaId: string;
  address: string;
  phone: string;
  description?: string;
  ownerName?: string;
  ownerPhone?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt?: Timestamp;
}
