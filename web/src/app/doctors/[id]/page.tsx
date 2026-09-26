import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Clock, DollarSign, Stethoscope, Hospital } from "lucide-react";
import { getDoctorById, getDoctors } from "@/lib/firestore";
import { SPECIALTIES } from "@/lib/constants";
import CallButton from "@/components/ui/CallButton";
import StarRating from "@/components/ui/StarRating";
import VerifiedBadge from "@/components/ui/VerifiedBadge";

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doctor = await getDoctorById(params.id).catch(() => null);
  if (!doctor) return { title: "ডাক্তার পাওয়া যায়নি" };
  return { title: doctor.name, description: `${doctor.name} — ${SPECIALTIES[doctor.specialty] ?? doctor.specialty}` };
}

export async function generateStaticParams() {
  const doctors = await getDoctors().catch(() => []);
  return doctors.map((d) => ({ id: d.id }));
}

export const revalidate = 300;

export default async function DoctorDetailPage({ params }: Props) {
  const doctor = await getDoctorById(params.id).catch(() => null);
  if (!doctor) notFound();

  const specialtyName = SPECIALTIES[doctor.specialty] ?? doctor.specialty;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header card */}
      <div className="card p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-24 h-24 rounded-2xl bg-purple-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {doctor.imageUrl ? (
              <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
            ) : (
              <Stethoscope size={36} className="text-purple-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-800">{doctor.name}</h1>
              {doctor.isVerified && <VerifiedBadge />}
            </div>
            <p className="text-purple-600 font-semibold mb-1">{specialtyName}</p>
            <p className="text-sm text-gray-500 mb-3">{doctor.qualifications.join(" | ")}</p>
            <StarRating rating={doctor.rating} reviewCount={doctor.reviewCount} size={15} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: chamber info */}
        <div className="md:col-span-2 space-y-4">
          <div className="card p-5">
            <h2 className="font-bold text-gray-700 mb-4">চেম্বার তথ্য</h2>
            <div className="space-y-3">
              {[
                { icon: Hospital,    label: "হাসপাতাল",  value: doctor.hospitalName },
                { icon: MapPin,      label: "ঠিকানা",     value: doctor.chamberAddress },
                { icon: Clock,       label: "সময়",        value: doctor.visitingHours },
                { icon: DollarSign,  label: "ভিজিট ফি",   value: `৳${doctor.visitFee}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 text-sm">
                  <Icon size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-400 text-xs">{label}</span>
                    <div className="text-gray-700 font-medium">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className={`rounded-xl p-4 border ${doctor.isAvailable ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${doctor.isAvailable ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
              <span className={`font-semibold text-sm ${doctor.isAvailable ? "text-green-700" : "text-gray-500"}`}>
                {doctor.isAvailable ? "বর্তমানে রোগী দেখছেন" : "এই মুহূর্তে উপলব্ধ নেই"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: contact */}
        <div>
          <div className="card p-5">
            <h2 className="font-bold text-gray-700 mb-4">যোগাযোগ</h2>
            <CallButton phone={doctor.phone} label="অ্যাপয়েন্টমেন্ট নিন" block />
          </div>
        </div>
      </div>
    </div>
  );
}
