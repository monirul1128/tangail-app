"use client";
import { useState, useEffect } from "react";

// Tangail coordinates
const LAT  = 24.2513;
const LNG  = 89.9167;

interface Times {
  Fajr: string; Dhuhr: string; Asr: string; Maghrib: string; Isha: string;
}

const NAMES: { key: keyof Times; bn: string }[] = [
  { key: "Fajr",    bn: "ফজর"    },
  { key: "Dhuhr",   bn: "জোহর"   },
  { key: "Asr",     bn: "আসর"    },
  { key: "Maghrib", bn: "মাগরিব" },
  { key: "Isha",    bn: "এশা"    },
];

// Convert 24h "HH:MM" to 12h Bangla (e.g. "17:47" → "৫:৪৭")
function formatBangla(time: string): string {
  try {
    const [hStr, mStr] = time.split(":");
    let h = parseInt(hStr, 10);
    const m = mStr.padStart(2, "0");
    // Convert to 12-hour
    if (h === 0) h = 12;
    else if (h > 12) h = h - 12;
    const toBn = (n: string) => n.replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[+d]);
    return toBn(`${h}:${m}`);
  } catch { return time; }
}

export default function PrayerTimes() {
  const [times, setTimes]     = useState<Times | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const dateStr = `${dd}-${mm}-${yyyy}`;

    // aladhan.com API — method 1 = University of Islamic Sciences, Karachi (standard BD)
    fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${LAT}&longitude=${LNG}&method=1&school=1&timezone=Asia/Dhaka`)
      .then(r => r.json())
      .then(data => {
        if (data?.data?.timings) {
          const t = data.data.timings;
          setTimes({
            Fajr:    t.Fajr,
            Dhuhr:   t.Dhuhr,
            Asr:     t.Asr,
            Maghrib: t.Maghrib,
            Isha:    t.Isha,
          });
        }
      })
      .catch(() => {
        // Fallback static times if API fails
        setTimes({ Fajr:"4:30", Dhuhr:"12:10", Asr:"4:00", Maghrib:"6:25", Isha:"7:40" });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8">
      <div className="flex items-center overflow-x-auto scrollbar-hide divide-x divide-white/10">
        {/* Label */}
        <div className="flex-shrink-0 pr-4 py-3">
          <p className="text-white/40 text-[9px] uppercase tracking-widest font-semibold">নামাজের</p>
          <p className="text-white/40 text-[9px] uppercase tracking-widest font-semibold">সময়</p>
        </div>

        {loading ? (
          // Skeleton
          NAMES.map(n => (
            <div key={n.key} className="flex-shrink-0 px-4 md:px-6 py-3 text-center">
              <div className="text-white/50 text-[10px] mb-1">{n.bn}</div>
              <div className="h-4 w-10 bg-white/20 rounded animate-pulse mx-auto" />
            </div>
          ))
        ) : (
          NAMES.map(n => (
            <div key={n.key} className="flex-shrink-0 px-4 md:px-6 py-3 text-center group">
              <div className="text-white/50 text-[10px] mb-1 group-hover:text-white/80 transition-colors">{n.bn}</div>
              <div className="text-white font-bold text-sm tabular-nums">
                {times ? formatBangla(times[n.key]) : "—"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
