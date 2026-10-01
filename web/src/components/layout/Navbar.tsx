"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Bell, Phone, Menu, X, Moon, Sun } from "lucide-react";

const navLinks = [
  { href: "/",            label: "হোম"        },
  { href: "/hospitals",   label: "হাসপাতাল"   },
  { href: "/doctors",     label: "ডাক্তার"    },
  { href: "/blood-donor", label: "রক্তদান"    },
  { href: "/ambulance",   label: "অ্যাম্বুলেন্স" },
  { href: "/news",        label: "খবর"        },
  { href: "/emergency",   label: "জরুরি নম্বর" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark]         = useState(false);

  // On mount, read saved preference
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">

      {/* ── Top bar ── */}
      <div className="bg-[#1a3c6e] text-white text-xs px-4 py-1.5 flex items-center justify-between">
        {/* Location */}
        <div className="flex items-center gap-1 text-white/80">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0116 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>টাঙ্গাইল জেলা</span>
        </div>

        {/* Dark mode toggle only */}
        <button
          onClick={toggleDark}
          aria-label="Toggle dark mode"
          className="w-7 h-7 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors"
        >
          {dark
            ? <Sun size={13} className="text-yellow-300" />
            : <Moon size={13} className="text-white" />
          }
        </button>
      </div>

      {/* ── Main header ── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/images/logo.png" alt="আমাদের টাঙ্গাইল" className="h-10 w-auto object-contain" />
            <div>
              <div className="font-black text-primary text-lg leading-none">আমাদের টাঙ্গাইল</div>
              <div className="text-gray-400 dark:text-gray-500 text-[10px]">সেবা ও তথ্য পোর্টাল</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary-50 dark:hover:bg-primary/10 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Bell */}
            <button className="relative w-9 h-9 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
              <Bell size={17} className="text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* 999 */}
            <a href="tel:999"
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-full text-sm font-bold transition-colors">
              <Phone size={13} className="fill-white" />
              <span>৯৯৯</span>
            </a>

            {/* Hamburger */}
            <button
              className="lg:hidden w-9 h-9 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen
                ? <X size={18} className="text-gray-600 dark:text-gray-300" />
                : <Menu size={18} className="text-gray-600 dark:text-gray-300" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-lg">
          <nav className="max-w-6xl mx-auto px-4 py-2 flex flex-col">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary-50 dark:hover:bg-primary/10 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
