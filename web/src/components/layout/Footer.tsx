import Link from "next/link";
import { Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ট</span>
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-none">
                  আমাদের টাঙ্গাইল
                </div>
                <div className="text-gray-400 text-xs">সেবা ও তথ্য পোর্টাল</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              টাঙ্গাইল জেলার হাসপাতাল, ডাক্তার, অ্যাম্বুলেন্স, রক্তদাতা এবং
              জরুরি সেবার সম্পূর্ণ ডিরেক্টরি।
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">দ্রুত লিংক</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/hospitals",   label: "হাসপাতাল" },
                { href: "/doctors",     label: "বিশেষজ্ঞ ডাক্তার" },
                { href: "/blood-donor", label: "রক্তদাতা খুঁজুন" },
                { href: "/ambulance",   label: "অ্যাম্বুলেন্স সার্ভিস" },
                { href: "/emergency",   label: "জরুরি নম্বরসমূহ" },
                { href: "/news",        label: "সর্বশেষ খবর" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h3 className="text-white font-semibold mb-4">জরুরি সেবা</h3>
            <div className="space-y-3">
              {[
                { label: "জাতীয় জরুরি",    number: "999",  color: "bg-red-600" },
                { label: "ফায়ার সার্ভিস",   number: "199",  color: "bg-orange-600" },
                { label: "মহিলা হেল্পলাইন", number: "109",  color: "bg-pink-600" },
              ].map((item) => (
                <a
                  key={item.number}
                  href={`tel:${item.number}`}
                  className="flex items-center gap-3 group"
                >
                  <div
                    className={`${item.color} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <Phone size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">{item.label}</div>
                    <div className="text-white font-bold group-hover:text-primary-100 transition-colors">
                      {item.number}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} টাঙ্গাইল জেলা পোর্টাল। সর্বস্বত্ব সংরক্ষিত।</p>
          <p>বাংলাদেশে নির্মিত 🇧🇩</p>
        </div>
      </div>
    </footer>
  );
}
