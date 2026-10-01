"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminSignOut } from "@/lib/adminAuth";
import {
  LayoutDashboard, Hospital, Stethoscope, Ambulance, Droplets,
  Newspaper, Phone, Pill, GraduationCap, Briefcase, Bus,
  Banknote, Wrench, Users, MapPin, Image, ShoppingBag,
  LogOut, ChevronRight, X, Store, BookOpen, Zap, Landmark, Star,
} from "lucide-react";

const navItems = [
  { href: "/admin",                label: "ড্যাশবোর্ড",         icon: LayoutDashboard  },
  { href: "/admin/hospitals",      label: "হাসপাতাল",            icon: Hospital         },
  { href: "/admin/doctors",        label: "ডাক্তার",             icon: Stethoscope      },
  { href: "/admin/ambulances",     label: "অ্যাম্বুলেন্স",       icon: Ambulance        },
  { href: "/admin/blood-donors",   label: "রক্তদাতা",            icon: Droplets         },
  { href: "/admin/news",           label: "খবর ও নোটিশ",        icon: Newspaper        },
  { href: "/admin/emergency",      label: "জরুরি নম্বর",         icon: Phone            },
  { href: "/admin/pharmacy",       label: "ফার্মেসি",            icon: Pill             },
  { href: "/admin/education",      label: "শিক্ষা প্রতিষ্ঠান",   icon: GraduationCap    },
  { href: "/admin/coaching",       label: "কোচিং/টিউশন",         icon: BookOpen         },
  { href: "/admin/jobs",           label: "চাকরি",               icon: Briefcase        },
  { href: "/admin/transport",      label: "পরিবহন",              icon: Bus              },
  { href: "/admin/finance",        label: "আর্থিক সেবা",         icon: Banknote         },
  { href: "/admin/electricity",    label: "বিদ্যুৎ অফিস",        icon: Zap              },
  { href: "/admin/professionals",  label: "পেশাদার সেবা",        icon: Wrench           },
  { href: "/admin/organizations",  label: "সংগঠন",               icon: Users            },
  { href: "/admin/business",       label: "ব্যবসা ও বাণিজ্য",   icon: Store            },
  { href: "/admin/islamic",           label: "ধর্মীয় সেবা",        icon: Landmark         },
  { href: "/admin/tourism",           label: "পর্যটন",              icon: MapPin           },
  { href: "/admin/notable-persons",   label: "গুণিজন",              icon: Star             },
  { href: "/admin/gallery",           label: "গ্যালারি",             icon: Image            },
  { href: "/admin/business-requests", label: "ব্যবসা আবেদন",       icon: ShoppingBag      },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const router   = useRouter();

  const handleSignOut = async () => {
    await adminSignOut();
    router.push("/admin/login");
  };

  return (
    <>
      {/* Overlay on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1a2332] text-white z-40 flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="logo" className="h-8 w-auto object-contain" />
            <div>
              <div className="font-black text-sm text-white leading-none">আমাদের টাঙ্গাইল</div>
              <div className="text-white/40 text-[10px] mt-0.5">Admin Panel</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all group
                  ${active
                    ? "bg-primary text-white"
                    : "text-white/60 hover:bg-white/8 hover:text-white"
                  }`}
              >
                <Icon size={17} className="flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={14} className="opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={17} />
            <span>লগ আউট</span>
          </button>
        </div>
      </aside>
    </>
  );
}
