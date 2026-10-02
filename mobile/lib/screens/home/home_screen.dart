import 'package:cached_network_image/cached_network_image.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_constants.dart';
import '../../models/news_model.dart';
import '../../services/news_service.dart';
import '../../widgets/prayer_times_strip.dart';

// ─── Bangla digit converter ───────────────────────────────────────────────────
String _toBangla(String s) => s.replaceAllMapped(
    RegExp(r'\d'), (m) => '০১২৩৪৫৬৭৮৯'[int.parse(m[0]!)]);

String _banglaDate() {
  final now = DateTime.now();
  const days = ['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবার'];
  const months = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন',
                  'জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
  final day  = days[now.weekday % 7];
  final d    = _toBangla(now.day.toString());
  final m    = months[now.month - 1];
  final y    = _toBangla(now.year.toString());
  return '$day, $d $m $y';
}

// ─── Quick service pills (matching web exactly) ───────────────────────────────
const _quickPills = [
  {'label': 'অ্যাম্বুলেন্স', 'emoji': '🚑', 'route': '/ambulance',   'color': 0xFFDC2626},
  {'label': 'রক্তদান',       'emoji': '🩸', 'route': '/blood-donors', 'color': 0xFFF43F5E},
  {'label': 'ফায়ার সার্ভিস','emoji': '🔥', 'route': '/emergency',    'color': 0xFFF97316},
  {'label': 'পুলিশ স্টেশন', 'emoji': '👮', 'route': '/police',       'color': 0xFF1D4ED8},
  {'label': 'হাসপাতাল',     'emoji': '🏥', 'route': '/hospitals',    'color': 0xFF006A4E},
  {'label': '৯৯৯ হটলাইন',   'emoji': '📞', 'route': '/emergency',    'color': 0xFF16A34A},
];

// ─── Full service categories (matching web page.tsx exactly) ─────────────────
const _serviceCategories = [
  {
    'title': 'জরুরী সেবা',
    'color': 0xFFFEF2F2, 'border': 0xFFFECACA, 'titleColor': 0xFFB91C1C, 'accent': 0xFFEF4444,
    'items': [
      {'label': 'পুলিশ স্টেশন',  'emoji': '👮', 'route': '/police'},
      {'label': 'ফায়ার সার্ভিস', 'emoji': '🚒', 'route': '/emergency'},
      {'label': 'অ্যাম্বুলেন্স', 'emoji': '🚑', 'route': '/ambulance'},
    ],
  },
  {
    'title': 'চিকিৎসা সেবা',
    'color': 0xFFF0FDF4, 'border': 0xFFBBF7D0, 'titleColor': 0xFF15803D, 'accent': 0xFF22C55E,
    'items': [
      {'label': 'ডেন্টিস্ট',       'emoji': '🦷', 'route': '/doctors'},
      {'label': 'ডাক্তার',          'emoji': '👨‍⚕️','route': '/doctors'},
      {'label': 'হোমিওপ্যাথি',     'emoji': '🌿', 'route': '/doctors'},
      {'label': 'হাসপাতাল',        'emoji': '🏥', 'route': '/hospitals'},
      {'label': 'ক্লিনিক সেন্টার', 'emoji': '🏨', 'route': '/hospitals'},
      {'label': 'ফার্মেসি',        'emoji': '💊', 'route': '/pharmacy'},
    ],
  },
  {
    'title': 'শিক্ষা প্রতিষ্ঠান',
    'color': 0xFFEFF6FF, 'border': 0xFFBFDBFE, 'titleColor': 0xFF1D4ED8, 'accent': 0xFF3B82F6,
    'items': [
      {'label': 'স্কুল',             'emoji': '🏫', 'route': '/education'},
      {'label': 'কলেজ',              'emoji': '🏛️', 'route': '/education'},
      {'label': 'বিশ্ববিদ্যালয়',   'emoji': '🎓', 'route': '/education'},
      {'label': 'মাদ্রাসা',          'emoji': '📖', 'route': '/education'},
      {'label': 'কোচিং সেন্টার',    'emoji': '✏️', 'route': '/education'},
      {'label': 'শিক্ষক',           'emoji': '👨‍🏫','route': '/professionals'},
      {'label': 'টিউশন সেবা',       'emoji': '📝', 'route': '/education'},
      {'label': 'লাইব্রেরি',        'emoji': '📚', 'route': '/education'},
      {'label': 'ট্রেনিং সেন্টার',  'emoji': '🖥️', 'route': '/education'},
    ],
  },
  {
    'title': 'ধর্মীয় সেবা',
    'color': 0xFFF0FDF4, 'border': 0xFFA7F3D0, 'titleColor': 0xFF065F46, 'accent': 0xFF10B981,
    'items': [
      {'label': 'মসজিদ',  'emoji': '🕌', 'route': '/islamic'},
      {'label': 'মন্দির',  'emoji': '🛕', 'route': '/islamic'},
      {'label': 'নামাজ',  'emoji': '🙏', 'route': '/islamic'},
      {'label': 'রোজা',   'emoji': '🌙', 'route': '/islamic'},
      {'label': 'হজ্জ',   'emoji': '🕋', 'route': '/islamic'},
      {'label': 'জাকাত',  'emoji': '💰', 'route': '/islamic'},
    ],
  },
  {
    'title': 'সরকারি সেবা',
    'color': 0xFFFAF5FF, 'border': 0xFFE9D5FF, 'titleColor': 0xFF7E22CE, 'accent': 0xFFA855F7,
    'items': [
      {'label': 'জন্ম নিবন্ধন',    'emoji': '📋', 'route': '/govt'},
      {'label': 'ই-নামজারি',        'emoji': '🏡', 'route': '/govt'},
      {'label': 'ভোটার সেবা',       'emoji': '🗳️', 'route': '/govt'},
      {'label': 'বিদ্যুৎ অফিস',    'emoji': '⚡', 'route': '/electricity'},
      {'label': 'আদালত',            'emoji': '⚖️', 'route': '/govt'},
      {'label': 'চাকরির বিজ্ঞাপন', 'emoji': '💼', 'route': '/jobs'},
    ],
  },
  {
    'title': 'পরিবহন সেবা',
    'color': 0xFFFFFBEB, 'border': 0xFFFDE68A, 'titleColor': 0xFFB45309, 'accent': 0xFFF59E0B,
    'items': [
      {'label': 'বাস কাউন্টার',    'emoji': '🚌', 'route': '/transport'},
      {'label': 'ট্রেন সার্ভিস',   'emoji': '🚂', 'route': '/transport'},
      {'label': 'রেন্ট এ কার',     'emoji': '🚗', 'route': '/transport'},
      {'label': 'সিএনজি স্টেশন',  'emoji': '⛽', 'route': '/transport'},
      {'label': 'ফুয়েল স্টেশন',   'emoji': '🛢️', 'route': '/transport'},
      {'label': 'কুরিয়ার সার্ভিস','emoji': '📦', 'route': '/transport'},
    ],
  },
  {
    'title': 'আর্থিক সেবা',
    'color': 0xFFF0FDFA, 'border': 0xFF99F6E4, 'titleColor': 0xFF0F766E, 'accent': 0xFF14B8A6,
    'items': [
      {'label': 'ব্যাংক',       'emoji': '🏦', 'route': '/finance'},
      {'label': 'এটিএম',        'emoji': '💳', 'route': '/finance'},
      {'label': 'ক্রয়-বিক্রয়', 'emoji': '🛒', 'route': '/finance'},
    ],
  },
  {
    'title': 'ব্যবসা ও বাণিজ্য',
    'color': 0xFFFFF7ED, 'border': 0xFFFED7AA, 'titleColor': 0xFFC2410C, 'accent': 0xFFF97316,
    'items': [
      {'label': 'দোকান/শো-রুম',   'emoji': '🏪', 'route': '/business'},
      {'label': 'হোটেল (আবাসিক)','emoji': '🏨', 'route': '/business'},
      {'label': 'রেস্টুরেন্ট',    'emoji': '🍽️', 'route': '/business'},
      {'label': 'বিউটি পার্লার',  'emoji': '💅', 'route': '/business'},
      {'label': 'নার্সারি',        'emoji': '🌱', 'route': '/business'},
      {'label': 'কৃষি সেবা',      'emoji': '🌾', 'route': '/business'},
    ],
  },
  {
    'title': 'পেশাদার সেবা',
    'color': 0xFFEEF2FF, 'border': 0xFFC7D2FE, 'titleColor': 0xFF3730A3, 'accent': 0xFF6366F1,
    'items': [
      {'label': 'আইনজীবী',     'emoji': '⚖️', 'route': '/professionals'},
      {'label': 'সাংবাদিক',    'emoji': '📰', 'route': '/professionals'},
      {'label': 'টেকনিশিয়ান', 'emoji': '🔧', 'route': '/professionals'},
      {'label': 'কাজি অফিস',   'emoji': '💍', 'route': '/professionals'},
    ],
  },
  {
    'title': 'অন্যান্য',
    'color': 0xFFFDF2F8, 'border': 0xFFFBCFE8, 'titleColor': 0xFF9D174D, 'accent': 0xFFEC4899,
    'items': [
      {'label': 'সংগঠন',          'emoji': '🤝', 'route': '/organizations'},
      {'label': 'গুণিজন',         'emoji': '🏅', 'route': '/notable-persons'},
      {'label': 'পর্যটন',         'emoji': '🏞️', 'route': '/tourism'},
      {'label': 'সর্বশেষ নোটিশ', 'emoji': '📋', 'route': '/news'},
    ],
  },
];

// ─── Upazila data (matching web exactly) ─────────────────────────────────────
const _upazilas = [
  {'id': 'tangail_sadar', 'name': 'সদর',       'icon': '🏙️', 'unions': 11, 'area': '৩৬৮ বর্গকিমি'},
  {'id': 'basail',        'name': 'বাসাইল',    'icon': '🌾', 'unions':  8, 'area': '১৫২ বর্গকিমি'},
  {'id': 'bhuapur',       'name': 'ভূয়াপুর',  'icon': '🌿', 'unions':  8, 'area': '২২৩ বর্গকিমি'},
  {'id': 'delduar',       'name': 'দেলদুয়ার', 'icon': '🏘️', 'unions':  8, 'area': '১৭৭ বর্গকিমি'},
  {'id': 'dhanbari',      'name': 'ধনবাড়ী',   'icon': '🏛️', 'unions':  4, 'area': '১৭৫ বর্গকিমি'},
  {'id': 'ghatail',       'name': 'ঘাটাইল',   'icon': '⛵', 'unions': 14, 'area': '৪৩০ বর্গকিমি'},
  {'id': 'gopalpur',      'name': 'গোপালপুর', 'icon': '🌳', 'unions':  9, 'area': '২৩৩ বর্গকিমি'},
  {'id': 'kalihati',      'name': 'কালিহাতী', 'icon': '🛖', 'unions': 15, 'area': '৩৮৫ বর্গকিমি'},
  {'id': 'madhupur',      'name': 'মধুপুর',   'icon': '🌲', 'unions': 11, 'area': '৪২৩ বর্গকিমি'},
  {'id': 'mirzapur',      'name': 'মির্জাপুর','icon': '🏗️', 'unions': 14, 'area': '৩৭২ বর্গকিমি'},
  {'id': 'nagarpur',      'name': 'নাগরপুর',  'icon': '🌻', 'unions': 11, 'area': '২৮৮ বর্গকিমি'},
  {'id': 'sakhipur',      'name': 'সখিপুর',   'icon': '🍃', 'unions':  8, 'area': '২৯৬ বর্গকিমি'},
];

const _bloodGroups = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

// ═════════════════════════════════════════════════════════════════════════════
// HOME SCREEN
// ═════════════════════════════════════════════════════════════════════════════
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light,
      child: Scaffold(
        backgroundColor: const Color(0xFFF4F6F8),
        body: ListView(
          padding: EdgeInsets.zero,
          children: const [
            _HeroBanner(),
            _SearchBar(),
            _QuickPills(),
            SizedBox(height: 4),
            _ServiceCategoriesSection(),
            _UpazilaSection(),
            _BloodGroupSection(),
            _NoticesSection(),
            _NotablePersonsSection(),
            _TourismSection(),
            _GallerySection(),
            _CtaBanner(),
            SizedBox(height: 80),
          ],
        ),
      ),
    );
  }
}

// ─── Hero Banner ──────────────────────────────────────────────────────────────
class _HeroBanner extends ConsumerWidget {
  const _HeroBanner();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return SizedBox(
      height: 340,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Background image
          Image.asset(
            'assets/images/banner.jpeg',
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF006A4E), Color(0xFF003D2B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
            ),
          ),
          // Gradient overlays (matching web)
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0x1A000000), Color(0x73000000), Color(0xE6000000)],
                stops: [0.0, 0.45, 1.0],
              ),
            ),
          ),
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
                colors: [Color(0x66000000), Color(0x00000000)],
              ),
            ),
          ),
          // Content
          SafeArea(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Left: date + subtitle + buttons
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Location pill
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: Colors.white.withOpacity(0.2)),
                                ),
                                child: const Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text('📍', style: TextStyle(fontSize: 12)),
                                    SizedBox(width: 4),
                                    Text('টাঙ্গাইল জেলা, বাংলাদেশ',
                                        style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w500)),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 10),
                              Text(
                                'আজকের তারিখ',
                                style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 10, letterSpacing: 1.5),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                _banglaDate(),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 20,
                                  fontWeight: FontWeight.w900,
                                  height: 1.2,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'আপনার জেলার সকল দরকারি তথ্য একটি ডিজিটাল প্ল্যাটফর্মে',
                                style: TextStyle(color: Colors.white.withOpacity(0.75), fontSize: 12, height: 1.5),
                              ),
                              const SizedBox(height: 14),
                              Row(
                                children: [
                                  _HeroButton(
                                    label: '🏥 সেবা খুঁজুন',
                                    bgColor: const Color(0xFF006A4E),
                                    textColor: Colors.white,
                                    onTap: () => context.push('/hospitals'),
                                  ),
                                  const SizedBox(width: 8),
                                  _HeroButton(
                                    label: '📞 জরুরি: ৯৯৯',
                                    bgColor: const Color(0xFFEF4444),
                                    textColor: Colors.white,
                                    onTap: () async {
                                      final uri = Uri(scheme: 'tel', path: '999');
                                      if (await canLaunchUrl(uri)) launchUrl(uri);
                                    },
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        // Right: Weather card
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.white.withOpacity(0.25)),
                          ),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Text('🌤️', style: TextStyle(fontSize: 28)),
                              const SizedBox(height: 4),
                              const Text('২৯°',
                                  style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900)),
                              Text('সে.', style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 10)),
                              const SizedBox(height: 6),
                              Text('রোদচ্ছায়া', style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 10)),
                              const SizedBox(height: 6),
                              Container(height: 1, width: 50, color: Colors.white.withOpacity(0.2)),
                              const SizedBox(height: 6),
                              Text('টাঙ্গাইল', style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 9)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                // Prayer times strip at bottom of banner
                Container(
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.6),
                    border: Border(top: BorderSide(color: Colors.white.withOpacity(0.1))),
                  ),
                  child: const Column(
                    children: [
                      PrayerTimesStrip(),
                      SizedBox(height: 12),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _HeroButton extends StatelessWidget {
  final String label;
  final Color bgColor;
  final Color textColor;
  final VoidCallback onTap;
  const _HeroButton({required this.label, required this.bgColor, required this.textColor, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 2))],
        ),
        child: Text(label, style: TextStyle(color: textColor, fontSize: 12, fontWeight: FontWeight.w700)),
      ),
    );
  }
}

// ─── Search Bar ───────────────────────────────────────────────────────────────
class _SearchBar extends StatelessWidget {
  const _SearchBar();

  static const _keywords = {
    'হাসপাতাল': '/hospitals', 'ডাক্তার': '/doctors', 'রক্ত': '/blood-donors',
    'অ্যাম্বুলেন্স': '/ambulance', 'খবর': '/news', 'ফার্মেসি': '/pharmacy',
    'পুলিশ': '/police', 'বিদ্যুৎ': '/electricity', 'ব্যাংক': '/finance',
    'পর্যটন': '/tourism', 'শিক্ষা': '/education', 'জরুরি': '/emergency',
  };

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFFF4F6F8),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFE5E7EB)),
        ),
        child: TextField(
          decoration: const InputDecoration(
            hintText: 'হাসপাতাল, ডাক্তার, রক্ত... খুঁজুন',
            hintStyle: TextStyle(color: Color(0xFF9CA3AF), fontSize: 14),
            prefixIcon: Icon(Icons.search_rounded, color: Color(0xFF9CA3AF)),
            suffixIcon: Icon(Icons.mic_rounded, color: Color(0xFF9CA3AF)),
            border: InputBorder.none,
            contentPadding: EdgeInsets.symmetric(horizontal: 4, vertical: 14),
          ),
          onSubmitted: (val) {
            final q = val.trim().toLowerCase();
            for (final k in _keywords.keys) {
              if (q.contains(k.toLowerCase())) {
                context.push(_keywords[k]!);
                return;
              }
            }
            context.push('/hospitals');
          },
        ),
      ),
    );
  }
}

// ─── Quick Pills ──────────────────────────────────────────────────────────────
class _QuickPills extends StatelessWidget {
  const _QuickPills();

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: SizedBox(
        height: 40,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          itemCount: _quickPills.length,
          itemBuilder: (_, i) {
            final p = _quickPills[i];
            final color = Color(p['color'] as int);
            return GestureDetector(
              onTap: () => context.push(p['route'] as String),
              child: Container(
                margin: const EdgeInsets.only(right: 8),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(p['emoji'] as String, style: const TextStyle(fontSize: 14)),
                    const SizedBox(width: 5),
                    Text(p['label'] as String,
                        style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

// ─── Section header (matching web) ───────────────────────────────────────────
class _SectionTitle extends StatelessWidget {
  final String title;
  final Color accentColor;
  final String? actionLabel;
  final VoidCallback? onAction;
  const _SectionTitle({required this.title, this.accentColor = const Color(0xFF006A4E), this.actionLabel, this.onAction});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 12),
      child: Row(
        children: [
          Container(width: 4, height: 24, decoration: BoxDecoration(color: accentColor, borderRadius: BorderRadius.circular(4))),
          const SizedBox(width: 8),
          Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF1F2937))),
          const Spacer(),
          if (actionLabel != null)
            GestureDetector(
              onTap: onAction,
              child: Row(
                children: [
                  Text(actionLabel!, style: TextStyle(color: accentColor, fontSize: 13, fontWeight: FontWeight.w600)),
                  Icon(Icons.arrow_forward_rounded, size: 14, color: accentColor),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

// ─── Service Categories Section ───────────────────────────────────────────────
class _ServiceCategoriesSection extends StatelessWidget {
  const _ServiceCategoriesSection();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const _SectionTitle(title: 'সেবা সমূহ'),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Column(
            children: _serviceCategories.map((cat) {
              final items = cat['items'] as List;
              final bgColor = Color(cat['color'] as int);
              final borderColor = Color(cat['border'] as int);
              final titleColor = Color(cat['titleColor'] as int);
              final accentColor = Color(cat['accent'] as int);
              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: bgColor,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: borderColor),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Category header
                    Row(
                      children: [
                        Container(width: 4, height: 16, decoration: BoxDecoration(color: accentColor, borderRadius: BorderRadius.circular(4))),
                        const SizedBox(width: 8),
                        Text(cat['title'] as String,
                            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: titleColor)),
                      ],
                    ),
                    const SizedBox(height: 10),
                    // Items grid
                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 4,
                        crossAxisSpacing: 8,
                        mainAxisSpacing: 8,
                        childAspectRatio: 0.9,
                      ),
                      itemCount: items.length,
                      itemBuilder: (_, i) {
                        final item = items[i] as Map;
                        return GestureDetector(
                          onTap: () => context.push(item['route'] as String),
                          child: Container(
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 6, offset: const Offset(0, 2))],
                              border: Border.all(color: Colors.white),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(item['emoji'] as String, style: const TextStyle(fontSize: 22)),
                                const SizedBox(height: 4),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 2),
                                  child: Text(item['label'] as String,
                                      textAlign: TextAlign.center,
                                      maxLines: 2,
                                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Color(0xFF4B5563), height: 1.2)),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}

// ─── Upazila Section ──────────────────────────────────────────────────────────
class _UpazilaSection extends StatelessWidget {
  const _UpazilaSection();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Expanded(child: _SectionTitle(title: 'উপজেলা সমূহ')),
            Padding(
              padding: const EdgeInsets.only(right: 16),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF006A4E).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text('১২টি উপজেলা',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF006A4E))),
              ),
            ),
          ],
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 0.78,
            ),
            itemCount: _upazilas.length,
            itemBuilder: (_, i) {
              final u = _upazilas[i];
              return GestureDetector(
                onTap: () => context.push('/upazila/${u['id']}'),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, 2))],
                    border: Border.all(color: const Color(0xFFF3F4F6)),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(u['icon'] as String, style: const TextStyle(fontSize: 22)),
                      const SizedBox(height: 3),
                      Text(
                        u['name'] as String,
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF1F2937)),
                      ),
                      const SizedBox(height: 5),
                      Container(height: 1, color: const Color(0xFFF3F4F6)),
                      const SizedBox(height: 4),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('ইউনিয়ন', style: TextStyle(fontSize: 8, color: Color(0xFF9CA3AF))),
                          Text('${_toBangla((u['unions'] as int).toString())}টি',
                              style: const TextStyle(fontSize: 8, fontWeight: FontWeight.w700, color: Color(0xFF374151))),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('আয়তন', style: TextStyle(fontSize: 8, color: Color(0xFF9CA3AF))),
                          Flexible(
                            child: Text(
                              u['area'] as String,
                              textAlign: TextAlign.right,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontSize: 7, fontWeight: FontWeight.w700, color: Color(0xFF374151)),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

// ─── Blood Group Section ──────────────────────────────────────────────────────
class _BloodGroupSection extends StatelessWidget {
  const _BloodGroupSection();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 20, 12, 0),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFFDC2626), Color(0xFFF43F5E)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('🩸 রক্তের গ্রুপ খুঁজুন',
                        style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w700)),
                    SizedBox(height: 2),
                    Text('টাঙ্গাইলের নিবন্ধিত রক্তদাতাদের তালিকা',
                        style: TextStyle(color: Colors.white70, fontSize: 11)),
                  ],
                ),
                GestureDetector(
                  onTap: () => context.push('/register-donor'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text('+ ডোনার হোন',
                        style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4, crossAxisSpacing: 8, mainAxisSpacing: 8, childAspectRatio: 2.2,
              ),
              itemCount: _bloodGroups.length,
              itemBuilder: (_, i) {
                return GestureDetector(
                  onTap: () => context.push('/blood-donors'),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white.withOpacity(0.3)),
                    ),
                    alignment: Alignment.center,
                    child: Text(_bloodGroups[i],
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 14)),
                  ),
                );
              },
            ),
            const SizedBox(height: 12),
            GestureDetector(
              onTap: () => context.push('/blood-donors'),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
                alignment: Alignment.center,
                child: const Text('সকল ডোনার দেখুন →',
                    style: TextStyle(color: Color(0xFFDC2626), fontWeight: FontWeight.w700, fontSize: 14)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Notices Section ──────────────────────────────────────────────────────────
class _NoticesSection extends StatelessWidget {
  const _NoticesSection();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionTitle(
          title: 'সর্বশেষ নোটিশ',
          accentColor: const Color(0xFFF59E0B),
          actionLabel: 'সব দেখুন',
          onAction: () => context.push('/news'),
        ),
        StreamBuilder<List<NewsModel>>(
          stream: NewsService().getNotices(limit: 3),
          builder: (context, snap) {
            if (snap.connectionState == ConnectionState.waiting) {
              return const _LoadingCards(count: 3, height: 64);
            }
            final items = snap.data ?? [];
            if (items.isEmpty) {
              return const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Text('কোনো নোটিশ নেই', style: TextStyle(color: Color(0xFF6B7280), fontSize: 13)),
              );
            }
            return Column(
              children: items.map((n) => _NoticeRow(notice: n)).toList(),
            );
          },
        ),
      ],
    );
  }
}

class _NoticeRow extends StatelessWidget {
  final NewsModel notice;
  const _NoticeRow({required this.notice});

  @override
  Widget build(BuildContext context) {
    final d = notice.publishedAt;
    final dateStr = '${_toBangla(d.day.toString())}/${_toBangla(d.month.toString())}';
    return GestureDetector(
      onTap: () => context.push('/news/${notice.id}'),
      child: Container(
        margin: const EdgeInsets.fromLTRB(12, 0, 12, 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, 2))],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: const Color(0xFFFFFBEB),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.campaign_rounded, color: Color(0xFFF59E0B), size: 18),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(notice.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: Color(0xFF1F2937))),
            ),
            const SizedBox(width: 8),
            Text(dateStr, style: const TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
            const Icon(Icons.chevron_right_rounded, size: 16, color: Color(0xFF9CA3AF)),
          ],
        ),
      ),
    );
  }
}

// ─── Notable Persons Section ──────────────────────────────────────────────────
class _NotablePersonsSection extends StatelessWidget {
  const _NotablePersonsSection();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionTitle(
          title: 'বিশিষ্ট ব্যক্তিবর্গ',
          actionLabel: 'সব দেখুন',
          onAction: () => context.push('/notable-persons'),
        ),
        StreamBuilder<QuerySnapshot>(
          stream: FirebaseFirestore.instance
              .collection(AppConstants.colNotablePersons)
              .limit(3)
              .snapshots(),
          builder: (context, snap) {
            if (snap.connectionState == ConnectionState.waiting) {
              return const _LoadingCards(count: 3, height: 72);
            }
            final docs = snap.data?.docs ?? [];
            if (docs.isEmpty) return const SizedBox.shrink();
            return Column(
              children: docs.map((doc) {
                final d = doc.data() as Map<String, dynamic>;
                return GestureDetector(
                  onTap: () => context.push('/notable-persons/${doc.id}'),
                  child: Container(
                    margin: const EdgeInsets.fromLTRB(12, 0, 12, 8),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, 2))],
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 26,
                          backgroundColor: const Color(0xFFF4F6F8),
                          backgroundImage: (d['photoUrl'] as String?)?.isNotEmpty == true
                              ? CachedNetworkImageProvider(d['photoUrl'] as String)
                              : null,
                          child: (d['photoUrl'] as String?)?.isEmpty != false
                              ? const Icon(Icons.person_rounded, color: Color(0xFF9CA3AF))
                              : null,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(d['name'] as String? ?? '',
                                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF1F2937))),
                              if ((d['designation'] ?? d['profession']) != null)
                                Text(d['designation'] as String? ?? d['profession'] as String? ?? '',
                                    style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
                            ],
                          ),
                        ),
                        const Icon(Icons.chevron_right_rounded, size: 16, color: Color(0xFF9CA3AF)),
                      ],
                    ),
                  ),
                );
              }).toList(),
            );
          },
        ),
      ],
    );
  }
}

// ─── Tourism Section ──────────────────────────────────────────────────────────
class _TourismSection extends StatelessWidget {
  const _TourismSection();

  static const _catColors = {
    'historical': [0xFFFEF3C7, 0xFF92400E],
    'nature':     [0xFFD1FAE5, 0xFF065F46],
    'entertainment': [0xFFDBEAFE, 0xFF1E40AF],
    'education':  [0xFFEDE9FE, 0xFF4C1D95],
    'modern':     [0xFFE0E7FF, 0xFF3730A3],
  };

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionTitle(
          title: 'পর্যটন স্থান',
          accentColor: const Color(0xFF0369A1),
          actionLabel: 'সব দেখুন',
          onAction: () => context.push('/tourism'),
        ),
        StreamBuilder<QuerySnapshot>(
          stream: FirebaseFirestore.instance
              .collection(AppConstants.colTourism)
              .limit(5)
              .snapshots(),
          builder: (context, snap) {
            if (snap.connectionState == ConnectionState.waiting) {
              return SizedBox(
                height: 180,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  itemCount: 3,
                  itemBuilder: (_, __) => Container(
                    width: 160, margin: const EdgeInsets.only(right: 12),
                    decoration: BoxDecoration(color: const Color(0xFFF4F6F8), borderRadius: BorderRadius.circular(16)),
                  ),
                ),
              );
            }
            final docs = snap.data?.docs ?? [];
            if (docs.isEmpty) return const SizedBox.shrink();
            return SizedBox(
              height: 200,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                itemCount: docs.length,
                itemBuilder: (_, i) {
                  final d = docs[i].data() as Map<String, dynamic>;
                  final cat = d['category'] as String? ?? '';
                  final colors = _catColors[cat] ?? [0xFFF4F6F8, 0xFF374151];
                  return GestureDetector(
                    onTap: () => context.push('/tourism/${docs[i].id}'),
                    child: Container(
                      width: 160,
                      margin: const EdgeInsets.only(right: 12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 8, offset: const Offset(0, 2))],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                            child: (d['imageUrl'] as String?)?.isNotEmpty == true
                                ? CachedNetworkImage(
                                    imageUrl: d['imageUrl'] as String,
                                    height: 110, width: double.infinity, fit: BoxFit.cover,
                                    placeholder: (_, __) => Container(height: 110, color: const Color(0xFFF4F6F8)),
                                    errorWidget: (_, __, ___) => Container(
                                      height: 110, color: const Color(0xFFF4F6F8),
                                      child: const Icon(Icons.landscape_rounded, color: Color(0xFF9CA3AF), size: 36),
                                    ),
                                  )
                                : Container(
                                    height: 110, color: const Color(0xFFF4F6F8),
                                    child: const Center(child: Text('🏞️', style: TextStyle(fontSize: 36)))),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(d['name'] as String? ?? '',
                                    maxLines: 1, overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF1F2937))),
                                const SizedBox(height: 4),
                                if (cat.isNotEmpty)
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: Color(colors[0]),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(cat,
                                        style: TextStyle(fontSize: 9, color: Color(colors[1]), fontWeight: FontWeight.w600)),
                                  ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            );
          },
        ),
      ],
    );
  }
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
class _GallerySection extends StatelessWidget {
  const _GallerySection();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionTitle(
          title: 'ফটো গ্যালারি',
          actionLabel: 'সব দেখুন',
          onAction: () => context.push('/gallery'),
        ),
        StreamBuilder<QuerySnapshot>(
          stream: FirebaseFirestore.instance
              .collection(AppConstants.colGallery)
              .limit(6)
              .snapshots(),
          builder: (context, snap) {
            if (snap.connectionState == ConnectionState.waiting) {
              return const _LoadingCards(count: 1, height: 120);
            }
            final docs = snap.data?.docs ?? [];
            if (docs.isEmpty) return const SizedBox.shrink();
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3, crossAxisSpacing: 6, mainAxisSpacing: 6,
                ),
                itemCount: docs.length,
                itemBuilder: (_, i) {
                  final d = docs[i].data() as Map<String, dynamic>;
                  final url = d['imageUrl'] as String? ?? '';
                  return ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: url.isNotEmpty
                        ? CachedNetworkImage(
                            imageUrl: url, fit: BoxFit.cover,
                            placeholder: (_, __) => Container(color: const Color(0xFFF4F6F8)),
                            errorWidget: (_, __, ___) => Container(
                              color: const Color(0xFFF4F6F8),
                              child: const Icon(Icons.image_rounded, color: Color(0xFF9CA3AF)),
                            ),
                          )
                        : Container(
                            color: const Color(0xFFF4F6F8),
                            child: const Icon(Icons.image_rounded, color: Color(0xFF9CA3AF))),
                  );
                },
              ),
            );
          },
        ),
      ],
    );
  }
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
class _CtaBanner extends StatelessWidget {
  const _CtaBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 20),
      color: const Color(0xFF006A4E),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 40),
      child: Column(
        children: [
          const Text(
            'আপনার জেলায় ব্যবসা বা সেবা আছে?',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 10),
          Text(
            'সম্পূর্ণ বিনামূল্যে আপনার প্রতিষ্ঠান যোগ করুন এবং হাজার হাজার টাঙ্গাইলবাসীর কাছে পৌঁছান।',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 13, height: 1.5),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              GestureDetector(
                onTap: () => context.push('/register-donor'),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: const Text('এখনই যোগ করুন',
                      style: TextStyle(color: Color(0xFF006A4E), fontWeight: FontWeight.w700, fontSize: 14)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ─── Loading skeleton cards ───────────────────────────────────────────────────
class _LoadingCards extends StatelessWidget {
  final int count;
  final double height;
  const _LoadingCards({required this.count, required this.height});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(count, (_) => Container(
        margin: const EdgeInsets.fromLTRB(12, 0, 12, 8),
        height: height,
        decoration: BoxDecoration(
          color: const Color(0xFFE5E7EB),
          borderRadius: BorderRadius.circular(12),
        ),
      )),
    );
  }
}
