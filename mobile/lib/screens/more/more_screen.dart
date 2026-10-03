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
      builder: (_) => DraggableScrollableSheet(
        initialChildSize: 0.92,
        maxChildSize: 0.95,
        minChildSize: 0.5,
        builder: (_, controller) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            children: [
              // Handle
              Container(
                margin: const EdgeInsets.only(top: 12, bottom: 8),
                width: 40, height: 4,
                decoration: BoxDecoration(
                    color: const Color(0xFFE5E7EB),
                    borderRadius: BorderRadius.circular(2)),
              ),
              Expanded(
                child: ListView(
                  controller: controller,
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 40),
                  children: [
                    // Logo + name
                    Column(
                      children: [
                        Image.asset('assets/images/logo.png', height: 64,
                            errorBuilder: (_, __, ___) => const Icon(
                                Icons.location_city_rounded,
                                size: 64, color: Color(0xFF006A4E))),
                        const SizedBox(height: 10),
                        const Text('আমাদের টাঙ্গাইল',
                            style: TextStyle(fontSize: 22,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF1F2937))),
                        const Text('সেবা ও তথ্য পোর্টাল',
                            style: TextStyle(
                                fontSize: 13, color: Color(0xFF6B7280))),
                      ],
                    ),

                    const SizedBox(height: 20),

                    // Vision banner
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF006A4E), Color(0xFF009966)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Column(
                        children: [
                          Text('🌿', style: TextStyle(fontSize: 28)),
                          SizedBox(height: 6),
                          Text('ঐতিহ্য ও প্রযুক্তির বন্ধনে,',
                              textAlign: TextAlign.center,
                              style: TextStyle(color: Colors.white,
                                  fontSize: 15, fontWeight: FontWeight.w900)),
                          Text('সেবা পৌঁছাক প্রতি ঘরে ঘরে',
                              textAlign: TextAlign.center,
                              style: TextStyle(color: Colors.white,
                                  fontSize: 15, fontWeight: FontWeight.w900)),
                          SizedBox(height: 4),
                          Text('— স্মার্ট টাঙ্গাইল গড়ার প্রত্যয়ে।',
                              style: TextStyle(color: Colors.white70,
                                  fontSize: 12)),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),
                    const Divider(),
                    const SizedBox(height: 12),

                    // Founder section
                    Row(
                      children: [
                        Container(
                          width: 4, height: 20,
                          decoration: BoxDecoration(
                              color: const Color(0xFF006A4E),
                              borderRadius: BorderRadius.circular(4)),
                        ),
                        const SizedBox(width: 8),
                        const Text('প্রতিষ্ঠাতার বার্তা',
                            style: TextStyle(fontSize: 15,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF1F2937))),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Founder card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF9FAFB),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFE5E7EB)),
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              // Photo
                              Container(
                                padding: const EdgeInsets.all(2),
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFF006A4E), Color(0xFF14B8A6)],
                                  ),
                                  shape: BoxShape.circle,
                                ),
                                child: ClipOval(
                                  child: Image.asset(
                                    'assets/images/president.jpeg',
                                    width: 64, height: 64, fit: BoxFit.cover,
                                    errorBuilder: (_, __, ___) => Container(
                                      width: 64, height: 64,
                                      color: const Color(0xFFF4F6F8),
                                      child: const Icon(Icons.person_rounded,
                                          size: 36, color: Color(0xFF9CA3AF)),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 14),
                              const Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('মো: আরিফুল ইসলাম',
                                        style: TextStyle(fontSize: 15,
                                            fontWeight: FontWeight.w800,
                                            color: Color(0xFF1F2937))),
                                    Text('প্রতিষ্ঠাতা ও পরিচালক',
                                        style: TextStyle(fontSize: 12,
                                            color: Color(0xFF006A4E),
                                            fontWeight: FontWeight.w600)),
                                    Text('📍 নাগরপুর, টাঙ্গাইল',
                                        style: TextStyle(fontSize: 11,
                                            color: Color(0xFF6B7280))),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),

                          // Contact buttons
                          Row(
                            children: [
                              _ContactBtn(
                                icon: Icons.phone_rounded,
                                label: 'কল করুন',
                                color: const Color(0xFFDC2626),
                                onTap: () async {
                                  final uri = Uri(scheme: 'tel', path: '+97452043903');
                                  if (await canLaunchUrl(uri)) launchUrl(uri);
                                },
                              ),
                              const SizedBox(width: 8),
                              _ContactBtn(
                                icon: Icons.chat_rounded,
                                label: 'WhatsApp',
                                color: const Color(0xFF25D366),
                                onTap: () async {
                                  final uri = Uri.parse('https://wa.me/97452043903');
                                  if (await canLaunchUrl(uri)) {
                                    launchUrl(uri, mode: LaunchMode.externalApplication);
                                  }
                                },
                              ),
                              const SizedBox(width: 8),
                              _ContactBtn(
                                icon: Icons.facebook_rounded,
                                label: 'Facebook',
                                color: const Color(0xFF1877F2),
                                onTap: () async {
                                  final uri = Uri.parse('https://www.facebook.com/arifulislam365/');
                                  if (await canLaunchUrl(uri)) {
                                    launchUrl(uri, mode: LaunchMode.externalApplication);
                                  }
                                },
                              ),
                            ],
                          ),

                          const SizedBox(height: 12),
                          const Divider(),
                          const SizedBox(height: 10),

                          // Message
                          const Text(
                            '"প্রযুক্তির এই আধুনিক যুগে সঠিক সময়ে সঠিক তথ্য পাওয়া প্রতিটি নাগরিকের মৌলিক সুবিধা হওয়া উচিত। টাঙ্গাইলবাসীর কাছে প্রয়োজনীয় তথ্য ও সেবা সম্পূর্ণ বিনামূল্যে হাতের মুঠোয় পৌঁছে দেওয়ার লক্ষ্যেই এই অ্যাপটির যাত্রা।"',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontSize: 12,
                                color: Color(0xFF4B5563),
                                fontStyle: FontStyle.italic,
                                height: 1.6),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Stats
                    Row(
                      children: [
                        _StatBox(emoji: '🏥', value: '৫০+', label: 'হাসপাতাল'),
                        const SizedBox(width: 8),
                        _StatBox(emoji: '👨‍⚕️', value: '১০০+', label: 'ডাক্তার'),
                        const SizedBox(width: 8),
                        _StatBox(emoji: '🚑', value: '৩০+', label: 'অ্যাম্বুলেন্স'),
                        const SizedBox(width: 8),
                        _StatBox(emoji: '🩸', value: '৫০০+', label: 'ডোনার'),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // Services
                    const Row(
                      children: [
                        Icon(Icons.check_circle_rounded,
                            color: Color(0xFF006A4E), size: 18),
                        SizedBox(width: 6),
                        Text('অ্যাপের সেবাসমূহ',
                            style: TextStyle(fontSize: 15,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF1F2937))),
                      ],
                    ),
                    const SizedBox(height: 10),

                    ...[
                      ['🚨', 'জরুরি সেবা ও হটলাইন', 'ফায়ার, পুলিশ, অ্যাম্বুলেন্স ও ২৪/৭ জরুরি ব্লাড ব্যাংক'],
                      ['🏥', 'চিকিৎসা ও স্বাস্থ্যসেবা', 'ডাক্তার, হাসপাতাল, ডায়াগনস্টিক সেন্টার'],
                      ['🏛️', 'ঐতিহ্য ও ভ্রমণ গাইড', 'মহেড়া, ধনবাড়ী, মধুপুর সহ দর্শনীয় স্থান'],
                      ['🚌', 'যাতায়াত সময়সূচী', 'বাস ও ট্রেনের সঠিক সময়সূচী ও ভাড়া'],
                      ['🎓', 'শিক্ষা ও ক্যারিয়ার', 'স্কুল, কলেজ, বিশ্ববিদ্যালয় ও চাকরির আপডেট'],
                      ['📰', 'খবর ও নোটিশ', 'জেলার প্রতিদিনের টাটকা খবর ও সরকারি নোটিশ'],
                    ].map((s) => Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF9FAFB),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFFE5E7EB)),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(s[0], style: const TextStyle(fontSize: 20)),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(s[1],
                                    style: const TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w700,
                                        color: Color(0xFF1F2937))),
                                Text(s[2],
                                    style: const TextStyle(
                                        fontSize: 11,
                                        color: Color(0xFF6B7280),
                                        height: 1.4)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    )),

                    const SizedBox(height: 16),

                    // Contact info
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF0FDF4),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFF006A4E).withOpacity(0.2)),
                      ),
                      child: const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('যোগাযোগ',
                              style: TextStyle(fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF006A4E))),
                          SizedBox(height: 8),
                          Text('📧 ariful.online365@gmail.com',
                              style: TextStyle(fontSize: 12,
                                  color: Color(0xFF374151))),
                          SizedBox(height: 4),
                          Text('📞 +974 5204 3903',
                              style: TextStyle(fontSize: 12,
                                  fontFamily: 'Roboto',
                                  color: Color(0xFF374151))),
                          SizedBox(height: 4),
                          Text('📍 নাগরপুর, টাঙ্গাইল, বাংলাদেশ',
                              style: TextStyle(fontSize: 12,
                                  color: Color(0xFF374151))),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),
                    const Text('সংস্করণ: ১.০.০',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 12,
                            color: Color(0xFF9CA3AF))),
                  ],
                ),
              ),
            ],
          ),
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

// ── Contact button ────────────────────────────────────────────────────────────
class _ContactBtn extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  const _ContactBtn({required this.icon, required this.label,
      required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: color.withOpacity(0.25)),
          ),
          child: Column(
            children: [
              Icon(icon, color: color, size: 22),
              const SizedBox(height: 4),
              Text(label,
                  style: TextStyle(fontSize: 10, color: color,
                      fontWeight: FontWeight.w600)),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Stat box ──────────────────────────────────────────────────────────────────
class _StatBox extends StatelessWidget {
  final String emoji;
  final String value;
  final String label;
  const _StatBox({required this.emoji, required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: const Color(0xFF006A4E).withOpacity(0.06),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: const Color(0xFF006A4E).withOpacity(0.15)),
        ),
        child: Column(
          children: [
            Text(emoji, style: const TextStyle(fontSize: 18)),
            const SizedBox(height: 2),
            Text(value,
                style: const TextStyle(fontSize: 13,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF006A4E))),
            Text(label,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 8,
                    color: Color(0xFF6B7280))),
          ],
        ),
      ),
    );
  }
}
