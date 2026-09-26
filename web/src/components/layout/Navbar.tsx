"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Phone, Menu, X, Globe } from "lucide-react";

const navLinks = [
  { href: "/",            label: "হোম" },
  { href: "/hospitals",   label: "হাসপাতাল" },
  { href: "/doctors",     label: "ডাক্তার" },
  { href: "/blood-donor", label: "রক্তদান" },
  { href: "/ambulance",   label: "অ্যাম্বুলেন্স" },
  { href: "/news",        label: "খবর" },
  { href: "/emergency",   label: "জরুরি নম্বর" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang]         = useState<"bn" | "en">("bn");

  return (
    <header className="sticky top-0 z-50 shadow-md">

      {/* ── Top bar ─────────────────────────────────────────── */}
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

        {/* Language toggle + dark mode placeholder */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "bn" ? "en" : "bn")}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 rounded-full px-2.5 py-1 transition-colors"
          >
            <Globe size={11} />
            <span className={lang === "bn" ? "font-bold text-white" : "text-white/60"}>বাংলা</span>
            <span className="text-white/40 mx-0.5">|</span>
            <span className={lang === "en" ? "font-bold text-white" : "text-white/60"}>EN</span>
          </button>
          {/* Dark mode icon placeholder */}
          <button className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
            <span className="text-xs">🌙</span>
          </button>
        </div>
      </div>

      {/* ── Main header ─────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">ট</span>
            </div>
            <div>
              <div className="font-black text-primary text-lg leading-none">টাঙ্গাইল জেলা</div>
              <div className="text-gray-400 text-[10px]">সেবা ও তথ্য পোর্টাল</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary hover:bg-primary-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Bell */}
            <button className="relative w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors">
              <Bell size={17} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* 999 call button */}
            <a
              href="tel:999"
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-full text-sm font-bold transition-colors"
            >
              <Phone size={13} className="fill-white" />
              <span>৯৯৯</span>
            </a>

            {/* Hamburger (mobile) */}
            <button
              className="lg:hidden w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={18} className="text-gray-600" /> : <Menu size={18} className="text-gray-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile dropdown menu ─────────────────────────────── */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 shadow-lg">
          <nav className="max-w-6xl mx-auto px-4 py-2 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-primary hover:bg-primary-50 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border-b border-gray-50 last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
