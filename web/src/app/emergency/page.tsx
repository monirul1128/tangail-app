import type { Metadata } from "next";
import { Phone, Flame, ShieldCheck, Ambulance, Hospital, HeadphonesIcon } from "lucide-react";
import { getEmergencyContacts } from "@/lib/firestore";
import type { EmergencyContact } from "@/models/types";

export const metadata: Metadata = {
  title: "জরুরি নম্বরসমূহ",
  description: "টাঙ্গাইল জেলার সকল জরুরি সেবার নম্বর — ফায়ার সার্ভিস, পুলিশ, হাসপাতাল, অ্যাম্বুলেন্স",
};

export const revalidate = 3600;

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  fire:      { icon: Flame,           color: "text-red-600",    bg: "bg-red-50"    },
  police:    { icon: ShieldCheck,     color: "text-blue-700",   bg: "bg-blue-50"   },
  ambulance: { icon: Ambulance,       color: "text-amber-600",  bg: "bg-amber-50"  },
  hospital:  { icon: Hospital,        color: "text-sky-600",    bg: "bg-sky-50"    },
  hotline:   { icon: HeadphonesIcon,  color: "text-green-700",  bg: "bg-green-50"  },
  other:     { icon: Phone,           color: "text-gray-600",   bg: "bg-gray-50"   },
};

export default async function EmergencyPage() {
  const contacts = await getEmergencyContacts().catch(() => [] as EmergencyContact[]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">জরুরি নম্বরসমূহ</h1>
        <p className="text-gray-500">টাঙ্গাইল জেলার সকল জরুরি সেবার যোগাযোগ নম্বর</p>
      </div>

      {/* Big 999 button */}
      <a
        href="tel:999"
        className="flex flex-col items-center justify-center gap-3 w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-2xl py-10 mb-10 transition-colors group"
      >
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <Phone size={30} className="text-white" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-red-100">জাতীয় জরুরি সেবা</p>
          <p className="text-7xl font-black tracking-tight">৯৯৯</p>
          <p className="text-red-200 text-sm mt-1">যেকোনো জরুরি পরিস্থিতিতে কল করুন</p>
        </div>
      </a>

      {/* Contact grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {contacts
          .filter((c) => c.phone[0] !== "999")
          .map((contact) => {
            const cfg = CATEGORY_CONFIG[contact.category] ?? CATEGORY_CONFIG.other;
            const Icon = cfg.icon;

            return (
              <div key={contact.id} className="card p-5">
                <div className="flex items-start gap-4">
                  <div className={`${cfg.bg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={22} className={cfg.color} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{contact.title}</h3>
                    {contact.isNational && (
                      <span className="badge bg-green-50 text-green-700 mb-2">জাতীয়</span>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {contact.phone.map((p) => (
                        <a
                          key={p}
                          href={`tel:${p}`}
                          className={`btn-call text-sm`}
                        >
                          <Phone size={14} />
                          {p}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
