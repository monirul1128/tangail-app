import { Timestamp, GeoPoint } from "firebase/firestore";

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
