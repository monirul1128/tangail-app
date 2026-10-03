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
      {'label': 'স্কুল',             'emoji': '🏫', 'route': '/education?type=school'},
      {'label': 'কলেজ',              'emoji': '🏛️', 'route': '/education?type=college'},
      {'label': 'বিশ্ববিদ্যালয়',   'emoji': '🎓', 'route': '/education?type=university'},
      {'label': 'মাদ্রাসা',          'emoji': '📖', 'route': '/education?type=madrasa'},
      {'label': 'কোচিং সেন্টার',    'emoji': '✏️', 'route': '/education?type=coaching'},
      {'label': 'শিক্ষক',           'emoji': '👨‍🏫','route': '/professionals?type=teacher'},
      {'label': 'টিউশন সেবা',       'emoji': '📝', 'route': '/education?type=tuition'},
      {'label': 'লাইব্রেরি',        'emoji': '📚', 'route': '/education?type=library'},
      {'label': 'ট্রেনিং সেন্টার',  'emoji': '🖥️', 'route': '/education?type=training'},
    ],
  },
  {
    'title': 'ধর্মীয় সেবা',
    'color': 0xFFF0FDF4, 'border': 0xFFA7F3D0, 'titleColor': 0xFF065F46, 'accent': 0xFF10B981,
    'items': [
      {'label': 'মসজিদ',  'emoji': '🕌', 'route': '/islamic?type=mosque'},
      {'label': 'মন্দির',  'emoji': '🛕', 'route': '/islamic?type=temple'},
      {'label': 'নামাজ',  'emoji': '🙏', 'route': '/islamic?type=namaz'},
      {'label': 'রোজা',   'emoji': '🌙', 'route': '/islamic?type=roja'},
      {'label': 'হজ্জ',   'emoji': '🕋', 'route': '/islamic?type=hajj'},
      {'label': 'জাকাত',  'emoji': '💰', 'route': '/islamic?type=zakat'},
    ],
  },
  {
    'title': 'সরকারি সেবা',
    'color': 0xFFFAF5FF, 'border': 0xFFE9D5FF, 'titleColor': 0xFF7E22CE, 'accent': 0xFFA855F7,
    'items': [
      {'label': 'জন্ম নিবন্ধন',    'emoji': '📋', 'route': '/govt?type=birth'},
      {'label': 'ই-নামজারি',        'emoji': '🏡', 'route': '/govt?type=land'},
      {'label': 'ভোটার সেবা',       'emoji': '🗳️', 'route': '/govt?type=voter'},
      {'label': 'বিদ্যুৎ অফিস',    'emoji': '⚡', 'route': '/electricity'},
      {'label': 'আদালত',            'emoji': '⚖️', 'route': '/govt?type=court'},
      {'label': 'চাকরির বিজ্ঞাপন', 'emoji': '💼', 'route': '/jobs'},
    ],
  },
  {
    'title': 'পরিবহন সেবা',
    'color': 0xFFFFFBEB, 'border': 0xFFFDE68A, 'titleColor': 0xFFB45309, 'accent': 0xFFF59E0B,
    'items': [
      {'label': 'বাস কাউন্টার',    'emoji': '🚌', 'route': '/transport?type=bus'},
      {'label': 'ট্রেন সার্ভিস',   'emoji': '🚂', 'route': '/transport?type=train'},
      {'label': 'রেন্ট এ কার',     'emoji': '🚗', 'route': '/transport?type=rentcar'},
      {'label': 'সিএনজি স্টেশন',  'emoji': '⛽', 'route': '/transport?type=cng'},
      {'label': 'ফুয়েল স্টেশন',   'emoji': '🛢️', 'route': '/transport?type=fuel'},
      {'label': 'কুরিয়ার সার্ভিস','emoji': '📦', 'route': '/transport?type=courier'},
    ],
  },
  {
    'title': 'আর্থিক সেবা',
    'color': 0xFFF0FDFA, 'border': 0xFF99F6E4, 'titleColor': 0xFF0F766E, 'accent': 0xFF14B8A6,
    'items': [
      {'label': 'ব্যাংক',       'emoji': '🏦', 'route': '/finance?type=bank'},
      {'label': 'এটিএম',        'emoji': '💳', 'route': '/finance?type=atm'},
      {'label': 'ক্রয়-বিক্রয়', 'emoji': '🛒', 'route': '/finance?type=market'},
    ],
  },
  {
    'title': 'ব্যবসা ও বাণিজ্য',
    'color': 0xFFFFF7ED, 'border': 0xFFFED7AA, 'titleColor': 0xFFC2410C, 'accent': 0xFFF97316,
    'items': [
      {'label': 'দোকান/শো-রুম',   'emoji': '🏪', 'route': '/business?type=shop'},
      {'label': 'হোটেল (আবাসিক)','emoji': '🏨', 'route': '/business?type=hotel'},
      {'label': 'রেস্টুরেন্ট',    'emoji': '🍽️', 'route': '/business?type=restaurant'},
      {'label': 'বিউটি পার্লার',  'emoji': '💅', 'route': '/business?type=beauty'},
      {'label': 'নার্সারি',        'emoji': '🌱', 'route': '/business?type=nursery'},
      {'label': 'কৃষি সেবা',      'emoji': '🌾', 'route': '/business?type=agriculture'},
    ],
  },
  {
    'title': 'পেশাদার সেবা',
    'color': 0xFFEEF2FF, 'border': 0xFFC7D2FE, 'titleColor': 0xFF3730A3, 'accent': 0xFF6366F1,
    'items': [
      {'label': 'আইনজীবী',     'emoji': '⚖️', 'route': '/professionals?type=lawyer'},
      {'label': 'সাংবাদিক',    'emoji': '📰', 'route': '/professionals?type=journalist'},
      {'label': 'টেকনিশিয়ান', 'emoji': '🔧', 'route': '/professionals?type=technician'},
      {'label': 'কাজি অফিস',   'emoji': '💍', 'route': '/professionals?type=kazi'},
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
  {'id': 'kalihati',      'name': 'কালিহাতী', 'icon': '🌴', 'unions': 15, 'area': '৩৮৫ বর্গকিমি'},
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
            _TangailMapSection(),
            _CtaBanner(),
            _AppFooter(),
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
        child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        physics: const ClampingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 12),
        child: Row(
          children: _quickPills.map((p) {
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
          }).toList(),
        ),
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
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.fromLTRB(10, 8, 10, 10),
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
                        Container(width: 4, height: 14, decoration: BoxDecoration(color: accentColor, borderRadius: BorderRadius.circular(4))),
                        const SizedBox(width: 6),
                        Text(cat['title'] as String,
                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: titleColor)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    // Items grid
                    // Items — Wrap to avoid scroll conflict
                    LayoutBuilder(
                      builder: (context, constraints) {
                        final itemW = (constraints.maxWidth - 18) / 4;
                        return Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          children: List.generate(items.length, (i) {
                            final item = items[i] as Map;
                            return GestureDetector(
                              onTap: () => context.push(item['route'] as String),
                              child: SizedBox(
                                width: itemW,
                                height: itemW,
                                child: Container(
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(12),
                                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 6, offset: const Offset(0, 2))],
                                  ),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(item['emoji'] as String, style: const TextStyle(fontSize: 20)),
                                      const SizedBox(height: 3),
                                      Padding(
                                        padding: const EdgeInsets.symmetric(horizontal: 2),
                                        child: Text(item['label'] as String,
                                            textAlign: TextAlign.center,
                                            maxLines: 2,
                                            style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: Color(0xFF4B5563), height: 1.2)),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          }),
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
class _NoticesSection extends StatefulWidget {
  const _NoticesSection();

  @override
  State<_NoticesSection> createState() => _NoticesSectionState();
}

class _NoticesSectionState extends State<_NoticesSection> {
  List<NewsModel> _items = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final snap = await FirebaseFirestore.instance
          .collection(AppConstants.colNews)
          .limit(50)
          .get();
      final list = snap.docs
          .map((d) => NewsModel.fromFirestore(d))
          .where((n) => n.isNotice)
          .toList();
      list.sort((a, b) => b.publishedAt.compareTo(a.publishedAt));
      if (mounted) setState(() => _items = list.take(3).toList());
    } catch (_) {}
  }

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
        if (_items.isEmpty) const SizedBox.shrink()
        else Column(
          children: _items.map((n) => _NoticeRow(notice: n)).toList(),
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
class _NotablePersonsSection extends StatefulWidget {
  const _NotablePersonsSection();

  @override
  State<_NotablePersonsSection> createState() => _NotablePersonsSectionState();
}

class _NotablePersonsSectionState extends State<_NotablePersonsSection> {
  List<Map<String, dynamic>> _items = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final snap = await FirebaseFirestore.instance
          .collection(AppConstants.colNotablePersons)
          .limit(3)
          .get();
      if (mounted) {
        setState(() => _items = snap.docs
            .map((d) => {'id': d.id, ...d.data()})
            .toList());
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    if (_items.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionTitle(
          title: 'বিশিষ্ট ব্যক্তিবর্গ',
          actionLabel: 'সব দেখুন',
          onAction: () => context.push('/notable-persons'),
        ),
        ..._items.map((d) => GestureDetector(
          onTap: () => context.push('/notable-persons/${d['id']}'),
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
        )),
      ],
    );
  }
}

// ─── Tourism Section ──────────────────────────────────────────────────────────
class _TourismSection extends StatefulWidget {
  const _TourismSection();

  @override
  State<_TourismSection> createState() => _TourismSectionState();
}

class _TourismSectionState extends State<_TourismSection> {
  List<Map<String, dynamic>> _items = [];

  static const _catColors = {
    'historical': [0xFFFEF3C7, 0xFF92400E],
    'nature':     [0xFFD1FAE5, 0xFF065F46],
    'entertainment': [0xFFDBEAFE, 0xFF1E40AF],
    'education':  [0xFFEDE9FE, 0xFF4C1D95],
    'modern':     [0xFFE0E7FF, 0xFF3730A3],
  };

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final snap = await FirebaseFirestore.instance
          .collection(AppConstants.colTourism)
          .limit(5)
          .get();
      if (mounted) {
        setState(() => _items = snap.docs
            .map((d) => {'id': d.id, ...d.data()})
            .toList());
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    if (_items.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionTitle(
          title: 'পর্যটন স্থান',
          accentColor: const Color(0xFF0369A1),
          actionLabel: 'সব দেখুন',
          onAction: () => context.push('/tourism'),
        ),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          physics: const ClampingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Row(
            children: _items.map((d) {
              final cat = d['category'] as String? ?? '';
              final colors = _catColors[cat] ?? [0xFFF4F6F8, 0xFF374151];
              return GestureDetector(
                onTap: () => context.push('/tourism/${d['id']}'),
                child: Container(
                  width: 160,
                  height: 200,
                  margin: const EdgeInsets.only(right: 12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [BoxShadow(
                        color: Colors.black.withOpacity(0.08),
                        blurRadius: 8,
                        offset: const Offset(0, 2))],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: const BorderRadius.vertical(
                            top: Radius.circular(16)),
                        child: (d['imageUrl'] as String?)?.isNotEmpty == true
                            ? CachedNetworkImage(
                                imageUrl: d['imageUrl'] as String,
                                height: 110,
                                width: double.infinity,
                                fit: BoxFit.cover,
                                placeholder: (_, __) =>
                                    Container(height: 110, color: const Color(0xFFF4F6F8)),
                                errorWidget: (_, __, ___) => Container(
                                  height: 110,
                                  color: const Color(0xFFF4F6F8),
                                  child: const Icon(Icons.landscape_rounded,
                                      color: Color(0xFF9CA3AF), size: 36),
                                ),
                              )
                            : Container(
                                height: 110,
                                color: const Color(0xFFF4F6F8),
                                child: const Center(
                                    child: Text('🏞️',
                                        style: TextStyle(fontSize: 36)))),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(d['name'] as String? ?? '',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: Color(0xFF1F2937))),
                            const SizedBox(height: 4),
                            if (cat.isNotEmpty)
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: Color(colors[0]),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(cat,
                                    style: TextStyle(
                                        fontSize: 9,
                                        color: Color(colors[1]),
                                        fontWeight: FontWeight.w600)),
                              ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
class _GallerySection extends StatefulWidget {
  const _GallerySection();

  @override
  State<_GallerySection> createState() => _GallerySectionState();
}

class _GallerySectionState extends State<_GallerySection> {
  List<String> _urls = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final snap = await FirebaseFirestore.instance
          .collection(AppConstants.colGallery)
          .limit(6)
          .get();
      final urls = snap.docs
          .map((d) => (d.data()['imageUrl'] as String?) ?? '')
          .where((u) => u.isNotEmpty)
          .toList();
      if (mounted) setState(() => _urls = urls);
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    if (_urls.isEmpty) return const SizedBox.shrink();

    final screenW = MediaQuery.of(context).size.width;
    final itemSize = (screenW - 24 - 12) / 3; // 3 columns, 12px padding each side, 6px gap

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionTitle(
          title: 'ফটো গ্যালারি',
          actionLabel: 'সব দেখুন',
          onAction: () => context.push('/gallery'),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Wrap(
            spacing: 6,
            runSpacing: 6,
            children: _urls.map((url) => ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: SizedBox(
                width: itemSize,
                height: itemSize,
                child: CachedNetworkImage(
                  imageUrl: url,
                  fit: BoxFit.cover,
                  placeholder: (_, __) => Container(color: const Color(0xFFF4F6F8)),
                  errorWidget: (_, __, ___) => Container(
                    color: const Color(0xFFF4F6F8),
                    child: const Icon(Icons.image_rounded, color: Color(0xFF9CA3AF)),
                  ),
                ),
              ),
            )).toList(),
          ),
        ),
      ],
    );
  }
}

// ─── Tangail Map Section ─────────────────────────────────────────────────────
class _TangailMapSection extends StatelessWidget {
  const _TangailMapSection();

  static const _boundaries = [
    {'dir': 'উত্তরে',  'districts': 'জামালপুর ও ময়মনসিংহ'},
    {'dir': 'দক্ষিণে', 'districts': 'ঢাকা ও মানিকগঞ্জ'},
    {'dir': 'পূর্বে',  'districts': 'ময়মনসিংহ ও গাজীপুর'},
    {'dir': 'পশ্চিমে', 'districts': 'সিরাজগঞ্জ ও পাবনা'},
  ];

  static const _stats = [
    {'icon': '📐', 'label': 'আয়তন',    'value': '৩,৪১৪ বর্গকিমি'},
    {'icon': '👥', 'label': 'জনসংখ্যা', 'value': '৩৮ লক্ষ+'},
    {'icon': '🗺️', 'label': 'উপজেলা',  'value': '১২টি'},
    {'icon': '🏘️', 'label': 'ইউনিয়ন',  'value': '১২১টি'},
    {'icon': '🌾', 'label': 'গ্রাম',    'value': '১,৬৮৩টি'},
    {'icon': '🏙️', 'label': 'পৌরসভা',  'value': '৮টি'},
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const _SectionTitle(title: 'একনজরে টাঙ্গাইল'),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [BoxShadow(
                  color: Colors.black.withOpacity(0.06),
                  blurRadius: 10, offset: const Offset(0, 3))],
            ),
            child: Column(
              children: [
                // Header
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 14),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF006A4E), Color(0xFF009966)],
                    ),
                    borderRadius:
                        BorderRadius.vertical(top: Radius.circular(16)),
                  ),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('🗺️ একনজরে টাঙ্গাইল',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w800)),
                      Text('সংক্ষিপ্ত পরিচিতি ও সীমানা',
                          style: TextStyle(
                              color: Colors.white70, fontSize: 11)),
                    ],
                  ),
                ),

                Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    children: [
                      // Map image + description
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Map image
                          ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: Image.asset(
                              'assets/images/tangail-map.jpg',
                              width: 120,
                              height: 150,
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => Container(
                                width: 120, height: 150,
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF0FDF4),
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(
                                      color: const Color(0xFF006A4E)
                                          .withOpacity(0.2)),
                                ),
                                child: const Center(
                                    child: Text('🗺️',
                                        style: TextStyle(fontSize: 40))),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          // Description
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'টাঙ্গাইল জেলা বাংলাদেশের মধ্যভাগে ঢাকা বিভাগের অন্তর্গত একটি গুরুত্বপূর্ণ জেলা। যমুনা ও ধলেশ্বরী নদীর তীরে অবস্থিত এই জেলাটি শিল্প, কৃষি ও ঐতিহ্যে সমৃদ্ধ।',
                                  style: TextStyle(
                                      fontSize: 12,
                                      color: Color(0xFF4B5563),
                                      height: 1.5),
                                ),
                                const SizedBox(height: 10),
                                // Stats — simple column layout, no GridView
                                Column(
                                  children: [
                                    Row(
                                      children: [
                                        _StatItem(icon: _stats[0]['icon']!, label: _stats[0]['label']!, value: _stats[0]['value']!),
                                        const SizedBox(width: 6),
                                        _StatItem(icon: _stats[1]['icon']!, label: _stats[1]['label']!, value: _stats[1]['value']!),
                                      ],
                                    ),
                                    const SizedBox(height: 6),
                                    Row(
                                      children: [
                                        _StatItem(icon: _stats[2]['icon']!, label: _stats[2]['label']!, value: _stats[2]['value']!),
                                        const SizedBox(width: 6),
                                        _StatItem(icon: _stats[3]['icon']!, label: _stats[3]['label']!, value: _stats[3]['value']!),
                                      ],
                                    ),
                                    const SizedBox(height: 6),
                                    Row(
                                      children: [
                                        _StatItem(icon: _stats[4]['icon']!, label: _stats[4]['label']!, value: _stats[4]['value']!),
                                        const SizedBox(width: 6),
                                        _StatItem(icon: _stats[5]['icon']!, label: _stats[5]['label']!, value: _stats[5]['value']!),
                                      ],
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 14),

                      // Boundaries
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFF006A4E).withOpacity(0.05),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                              color: const Color(0xFF006A4E)
                                  .withOpacity(0.15)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('📍 চার পাশের সীমানা',
                                style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: Color(0xFF006A4E))),
                            const SizedBox(height: 8),
                            // Boundaries — simple Column, no GridView
                            Column(
                              children: _boundaries.map((b) => Padding(
                                padding: const EdgeInsets.only(bottom: 6),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    SizedBox(
                                      width: 48,
                                      child: Text(b['dir']!,
                                          style: const TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.w700,
                                              color: Color(0xFF006A4E))),
                                    ),
                                    Expanded(
                                      child: Text(b['districts']!,
                                          style: const TextStyle(
                                              fontSize: 11,
                                              color: Color(0xFF4B5563))),
                                    ),
                                  ],
                                ),
                              )).toList(),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 10),

                      // Coordinates
                      Wrap(
                        spacing: 6,
                        runSpacing: 6,
                        children: [
                          _InfoPill('📌 ২৪°১৫\' উত্তর অক্ষাংশ'),
                          _InfoPill('📌 ৮৯°৫৫\' পূর্ব দ্রাঘিমাংশ'),
                          _InfoPill('🏛️ ঢাকা বিভাগ'),
                          _InfoPill('📅 প্রতিষ্ঠা: ১৯৬৯'),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _InfoPill extends StatelessWidget {
  final String text;
  const _InfoPill(this.text);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: const Color(0xFFF4F6F8),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(text,
          style: const TextStyle(
              fontSize: 10, color: Color(0xFF6B7280))),
    );
  }
}

// ─── Stat Item helper ─────────────────────────────────────────────────────────
class _StatItem extends StatelessWidget {
  final String icon;
  final String label;
  final String value;
  const _StatItem({required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 7),
        decoration: BoxDecoration(
          color: const Color(0xFFF4F6F8),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            Text(icon, style: const TextStyle(fontSize: 14)),
            const SizedBox(width: 6),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(label,
                      style: const TextStyle(
                          fontSize: 9, color: Color(0xFF9CA3AF))),
                  Text(value,
                      style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF1F2937))),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── App Footer ───────────────────────────────────────────────────────────────
class _AppFooter extends StatelessWidget {
  const _AppFooter();

  @override
  Widget build(BuildContext context) {
    // bottom nav bar height + safe area
    final bottomPad = MediaQuery.of(context).padding.bottom + 80;
    return Container(
      color: const Color(0xFF1F2937),
      padding: EdgeInsets.fromLTRB(20, 28, 20, bottomPad),
      child: Column(
        children: [
          // Logo + name
          Row(
            children: [
              Image.asset(
                'assets/images/logo.png',
                height: 44,
                errorBuilder: (_, __, ___) => const Icon(
                    Icons.location_city_rounded,
                    color: Colors.white, size: 44),
              ),
              const SizedBox(width: 12),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('আমাদের টাঙ্গাইল',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w900)),
                  Text('সেবা ও তথ্য পোর্টাল',
                      style: TextStyle(
                          color: Colors.white54, fontSize: 11)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Divider(color: Colors.white12),
          const SizedBox(height: 14),

          // Quick links
          const Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('দ্রুত সেবা',
                        style: TextStyle(
                            color: Colors.white70,
                            fontSize: 12,
                            fontWeight: FontWeight.w700)),
                    SizedBox(height: 8),
                    _FooterLink('🏥 হাসপাতাল'),
                    _FooterLink('👨‍⚕️ ডাক্তার'),
                    _FooterLink('🩸 রক্তদাতা'),
                    _FooterLink('🚑 অ্যাম্বুলেন্স'),
                  ],
                ),
              ),
              SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('আরও সেবা',
                        style: TextStyle(
                            color: Colors.white70,
                            fontSize: 12,
                            fontWeight: FontWeight.w700)),
                    SizedBox(height: 8),
                    _FooterLink('📰 খবর ও নোটিশ'),
                    _FooterLink('🏞️ পর্যটন'),
                    _FooterLink('🏅 গুণিজন'),
                    _FooterLink('📞 জরুরি: ৯৯৯'),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),
          const Divider(color: Colors.white12),
          const SizedBox(height: 12),

          // Copyright
          const Text(
            '© ২০২৫ আমাদের টাঙ্গাইল। সকল স্বত্ব সংরক্ষিত।',
            textAlign: TextAlign.center,
            style: TextStyle(
                color: Colors.white38, fontSize: 11),
          ),
          const SizedBox(height: 4),
          const Text(
            'টাঙ্গাইল জেলা, বাংলাদেশ',
            textAlign: TextAlign.center,
            style: TextStyle(
                color: Colors.white24, fontSize: 10),
          ),
        ],
      ),
    );
  }
}

class _FooterLink extends StatelessWidget {
  final String text;
  const _FooterLink(this.text);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 5),
      child: Text(text,
          style: const TextStyle(
              color: Colors.white54, fontSize: 11)),
    );
  }
}
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
                onTap: () async {
                  final uri = Uri.parse('https://madertangail.online/register-business');
                  if (await canLaunchUrl(uri)) {
                    launchUrl(uri, mode: LaunchMode.externalApplication);
                  }
                },
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
