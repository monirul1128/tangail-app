import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_theme.dart';
import '../../widgets/prayer_times_strip.dart';

class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F6F8),
      body: ListView(
        children: [
          // ── Header with logo ─────────────────────────────────────────
          Container(
            color: AppTheme.primaryColor,
            padding: const EdgeInsets.fromLTRB(20, 52, 20, 24),
            child: Row(
              children: [
                Image.asset(
                  'assets/images/logo.png',
                  height: 52,
                  errorBuilder: (_, __, ___) => const Icon(
                    Icons.location_city_rounded,
                    color: Colors.white,
                    size: 52,
                  ),
                ),
                const SizedBox(width: 14),
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('আমাদের টাঙ্গাইল',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.w900)),
                    Text('সেবা ও তথ্য পোর্টাল',
                        style: TextStyle(
                            color: Colors.white70, fontSize: 12)),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // ── Quick links ───────────────────────────────────────────────
          _SectionLabel(label: 'সেবা সমূহ'),
          _Tile(icon: Icons.emergency_rounded,        color: const Color(0xFFDC2626), title: 'জরুরি নম্বর',       onTap: () => context.push('/emergency')),
          _Tile(icon: Icons.water_drop_rounded,       color: const Color(0xFFDC2626), title: 'রক্তদাতা',          onTap: () => context.push('/blood-donors')),
          _Tile(icon: Icons.airport_shuttle_rounded,  color: const Color(0xFFF97316), title: 'অ্যাম্বুলেন্স',     onTap: () => context.push('/ambulance')),
          _Tile(icon: Icons.local_police_rounded,     color: const Color(0xFF1D4ED8), title: 'পুলিশ স্টেশন',     onTap: () => context.push('/police')),
          _Tile(icon: Icons.landscape_rounded,        color: const Color(0xFF0369A1), title: 'পর্যটন স্থান',      onTap: () => context.push('/tourism')),
          _Tile(icon: Icons.people_rounded,           color: const Color(0xFF7C3AED), title: 'গুণিজন',            onTap: () => context.push('/notable-persons')),
          _Tile(icon: Icons.photo_library_rounded,    color: const Color(0xFF0891B2), title: 'ফটো গ্যালারি',     onTap: () => context.push('/gallery')),
          _Tile(icon: Icons.newspaper_rounded,        color: const Color(0xFF059669), title: 'খবর ও নোটিশ',      onTap: () => context.push('/news')),

          const SizedBox(height: 8),

          // ── Prayer times ──────────────────────────────────────────────
          _SectionLabel(label: 'নামাজের সময়'),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 12),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, 2))],
            ),
            child: const PrayerTimesStrip(),
          ),

          const SizedBox(height: 8),

          // ── App ───────────────────────────────────────────────────────
          _SectionLabel(label: 'অ্যাপ'),
          _Tile(
            icon: Icons.share_rounded,
            color: AppTheme.accentColor,
            title: 'বন্ধুদের সাথে শেয়ার করুন',
            onTap: () => Share.share(
                'আমাদের টাঙ্গাইল অ্যাপ ব্যবহার করুন — টাঙ্গাইলের সব সেবা এক জায়গায়!'),
          ),
          _Tile(
            icon: Icons.phone_rounded,
            color: const Color(0xFF16A34A),
            title: 'জরুরি: ৯৯৯ কল করুন',
            onTap: () async {
              final uri = Uri(scheme: 'tel', path: '999');
              if (await canLaunchUrl(uri)) launchUrl(uri);
            },
          ),
          _Tile(
            icon: Icons.info_outline_rounded,
            color: AppTheme.textSecondary,
            title: 'আমাদের সম্পর্কে',
            onTap: () => _showAboutSheet(context),
          ),

          const SizedBox(height: 80),
        ],
      ),
    );
  }

  void _showAboutSheet(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        padding: const EdgeInsets.fromLTRB(24, 12, 24, 40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle bar
            Container(width: 40, height: 4,
                decoration: BoxDecoration(color: const Color(0xFFE5E7EB), borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 20),

            // Logo
            Image.asset('assets/images/logo.png', height: 60,
                errorBuilder: (_, __, ___) => const Icon(Icons.location_city_rounded, size: 60, color: Color(0xFF006A4E))),
            const SizedBox(height: 12),
            const Text('আমাদের টাঙ্গাইল',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF1F2937))),
            const Text('সেবা ও তথ্য পোর্টাল',
                style: TextStyle(fontSize: 13, color: Color(0xFF6B7280))),
            const SizedBox(height: 20),
            const Divider(),
            const SizedBox(height: 16),

            // President / founder section
            Row(
              children: [
                ClipOval(
                  child: Image.asset(
                    'assets/images/president.jpeg',
                    width: 64, height: 64, fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      width: 64, height: 64,
                      color: const Color(0xFFF4F6F8),
                      child: const Icon(Icons.person_rounded, size: 36, color: Color(0xFF9CA3AF)),
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('মো: আরিফুল ইসলাম',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: Color(0xFF1F2937))),
                      Text('প্রতিষ্ঠাতা ও পরিচালক',
                          style: TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
                      Text('আমাদের টাঙ্গাইল',
                          style: TextStyle(fontSize: 12, color: Color(0xFF006A4E), fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Map
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.asset(
                'assets/images/tangail-map.jpg',
                width: double.infinity,
                height: 160,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  height: 160,
                  color: const Color(0xFFF4F6F8),
                  child: const Center(
                    child: Text('🗺️', style: TextStyle(fontSize: 48)),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8),
            const Text('টাঙ্গাইল জেলার মানচিত্র',
                style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
            const SizedBox(height: 20),

            const Text(
              'আমাদের টাঙ্গাইল হলো টাঙ্গাইল জেলার সকল নাগরিক সেবা, তথ্য এবং যোগাযোগের একটি ডিজিটাল প্ল্যাটফর্ম।',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: Color(0xFF6B7280), height: 1.6),
            ),
            const SizedBox(height: 12),
            const Text('সংস্করণ: ১.০.০',
                style: TextStyle(fontSize: 12, color: Color(0xFF9CA3AF))),
          ],
        ),
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  final String label;
  const _SectionLabel({required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 6),
      child: Text(label,
          style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: Color(0xFF9CA3AF),
              letterSpacing: 0.8)),
    );
  }
}

class _Tile extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final VoidCallback onTap;

  const _Tile({required this.icon, required this.color, required this.title, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(12, 0, 12, 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6, offset: const Offset(0, 1))],
      ),
      child: ListTile(
        leading: Container(
          width: 38, height: 38,
          decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
          child: Icon(icon, color: color, size: 20),
        ),
        title: Text(title,
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Color(0xFF1F2937))),
        trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xFF9CA3AF), size: 18),
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
      ),
    );
  }
}
