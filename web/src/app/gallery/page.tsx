import ServicePageLayout from "@/components/ui/ServicePageLayout";
import { MapPin } from "lucide-react";

const photos = [
  { id:"1",  src:"https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=70", caption:"টাঙ্গাইল সদর",         category:"শহর",      upazila:"টাঙ্গাইল সদর"  },
  { id:"2",  src:"https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=70", caption:"মাওলানা ভাসানীর মাজার",category:"ঐতিহাসিক", upazila:"টাঙ্গাইল সদর"  },
  { id:"3",  src:"https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=70", caption:"মধুপুর জাতীয় উদ্যান",  category:"প্রকৃতি",   upazila:"মধুপুর"         },
  { id:"4",  src:"https://images.unsplash.com/photo-1585759591502-7cd701be2b2e?w=600&q=70", caption:"আতিয়া মসজিদ",           category:"ঐতিহাসিক", upazila:"দেলদুয়ার"       },
  { id:"5",  src:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70", caption:"যমুনা নদী",              category:"প্রকৃতি",   upazila:"ভূয়াপুর"        },
  { id:"6",  src:"https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=70", caption:"বঙ্গবন্ধু সেতু",         category:"স্থাপনা",   upazila:"কালিহাতী"       },
  { id:"7",  src:"https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=70", caption:"ভারতেশ্বরী হোমস",        category:"শিক্ষা",    upazila:"মির্জাপুর"      },
  { id:"8",  src:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=70", caption:"এলেঙ্গা রিসোর্ট",        category:"বিনোদন",    upazila:"কালিহাতী"       },
  { id:"9",  src:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70", caption:"পাকুটিয়া প্যালেস",       category:"ঐতিহাসিক", upazila:"নাগরপুর"         },
  { id:"10", src:"https://images.unsplash.com/photo-1548199569-9a4b26c5de93?w=600&q=70", caption:"ধনবাড়ী নওয়াব প্যালেস",  category:"ঐতিহাসিক", upazila:"ধনবাড়ী"          },
  { id:"11", src:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=70", caption:"মধুপুর শালবন",           category:"প্রকৃতি",   upazila:"মধুপুর"          },
  { id:"12", src:"https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=70", caption:"টাঙ্গাইলের সূর্যাস্ত",  category:"প্রকৃতি",   upazila:"টাঙ্গাইল সদর"   },
];

const categories = ["সব","শহর","ঐতিহাসিক","প্রকৃতি","স্থাপনা","শিক্ষা","বিনোদন"];
const catColor: Record<string,string> = {
  "শহর":"bg-blue-100 text-blue-800", "ঐতিহাসিক":"bg-amber-100 text-amber-800",
  "প্রকৃতি":"bg-green-100 text-green-800", "স্থাপনা":"bg-indigo-100 text-indigo-800",
  "শিক্ষা":"bg-purple-100 text-purple-800", "বিনোদন":"bg-pink-100 text-pink-800",
};

export const metadata = {
  title: "ফটো গ্যালারি — টাঙ্গাইল জেলা",
  description: "টাঙ্গাইল জেলার ঐতিহাসিক স্থান, প্রাকৃতিক সৌন্দর্য ও দর্শনীয় স্থানের ছবি",
};

export default function GalleryPage() {
  return (
    <ServicePageLayout title="ফটো গ্যালারি" subtitle="টাঙ্গাইল জেলার ছবিসমূহ" emoji="📷" accentColor="bg-violet-700">

      {/* Category badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.slice(1).map(c => (
          <span key={c} className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity ${catColor[c]??""}`}>
            {c}
          </span>
        ))}
      </div>

      {/* Masonry-style grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((photo, i) => (
          <div key={photo.id}
            className={`relative overflow-hidden rounded-2xl shadow-sm group cursor-pointer ${
              i === 0 || i === 5 ? "col-span-2 row-span-2" : ""
            }`}
            style={{ aspectRatio: (i===0||i===5) ? "1.5/1" : "1/1" }}
          >
            <img
              src={photo.src}
              alt={photo.caption}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Caption on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white font-bold text-sm">{photo.caption}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={10} className="text-white/70" />
                <span className="text-white/70 text-xs">{photo.upazila}</span>
              </div>
            </div>

            {/* Category badge */}
            <div className="absolute top-2 left-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catColor[photo.category]??""}`}>
                {photo.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Submit photo CTA */}
      <div className="mt-8 bg-violet-50 border border-violet-200 rounded-2xl p-5 text-center">
        <p className="text-2xl mb-2">📸</p>
        <p className="text-violet-800 font-bold mb-1">আপনার ছবি শেয়ার করুন</p>
        <p className="text-violet-600 text-sm">টাঙ্গাইলের সুন্দর ছবি তুলে আমাদের গ্যালারিতে যোগ করুন</p>
      </div>
    </ServicePageLayout>
  );
}
