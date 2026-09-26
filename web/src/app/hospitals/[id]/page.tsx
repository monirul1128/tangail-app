import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Bed, Clock, AlertCircle, BadgeCheck } from "lucide-react";
import { getHospitalById, getHospitals } from "@/lib/firestore";
import { HOSPITAL_TYPES, SPECIALTIES } from "@/lib/constants";
import CallButton from "@/components/ui/CallButton";
import StarRating from "@/components/ui/StarRating";
import VerifiedBadge from "@/components/ui/VerifiedBadge";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hospital = await getHospitalById(params.id).catch(() => null);
  if (!hospital) return { title: "হাসপাতাল পাওয়া যায়নি" };
  return {
    title: hospital.name,
    description: `${hospital.name} — ${hospital.address}`,
  };
}

// Pre-render top hospitals at build time
export async function generateStaticParams() {
  const hospitals = await getHospitals().catch(() => []);
  return hospitals.map((h) => ({ id: h.id }));
}

export const revalidate = 300;

export default async function HospitalDetailPage({ params }: Props) {
  const hospital = await getHospitalById(params.id).catch(() => null);
  if (!hospital) notFound();

  const typeName   = HOSPITAL_TYPES[hospital.type] ?? hospital.type;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero image */}
      {hospital.imageUrl ? (
        <img
          src={hospital.imageUrl}
          alt={hospital.name}
          className="w-full h-64 object-cover rounded-2xl mb-8"
        />
      ) : (
        <div className="w-full h-48 bg-blue-50 rounded-2xl mb-8 flex items-center justify-center">
          <span className="text-8xl">🏥</span>
        </div>
      )}

      {/* Title section */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <h1 className="text-3xl font-bold text-gray-800">{hospital.name}</h1>
            {hospital.isVerified && <VerifiedBadge />}
          </div>
          <span className="badge bg-blue-50 text-blue-700 text-sm">{typeName}</span>
        </div>
        <StarRating rating={hospital.rating} reviewCount={hospital.reviewCount} size={16} />
      </div>

      {/* Stats chips */}
      <div className="flex flex-wrap gap-3 mb-8">
        {hospital.totalBeds > 0 && (
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm">
            <Bed size={16} className="text-blue-500" />
            <span>{hospital.totalBeds} শয্যা</span>
          </div>
        )}
        {hospital.emergencyAvailable && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2 text-sm text-red-700">
            <AlertCircle size={16} />
            <span>জরুরি বিভাগ</span>
          </div>
        )}
        {hospital.isOpen24Hours && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2 text-sm text-green-700">
            <Clock size={16} />
            <span>২৪ ঘণ্টা সেবা</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: details */}
        <div className="md:col-span-2 space-y-6">
          {/* Address */}
          <div className="card p-5">
            <h2 className="font-bold text-gray-700 mb-3">ঠিকানা</h2>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin size={16} className="mt-1 text-primary flex-shrink-0" />
              <span>{hospital.address}</span>
            </div>
          </div>

          {/* Specialties */}
          {hospital.specialties.length > 0 && (
            <div className="card p-5">
              <h2 className="font-bold text-gray-700 mb-3">বিশেষজ্ঞ সেবা</h2>
              <div className="flex flex-wrap gap-2">
                {hospital.specialties.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 bg-primary-50 text-primary rounded-full text-sm font-medium"
                  >
                    {SPECIALTIES[s] ?? s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: contact */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-bold text-gray-700 mb-4">যোগাযোগ</h2>
            <div className="space-y-3">
              {hospital.phone.map((p) => (
                <CallButton key={p} phone={p} label={p} block />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
