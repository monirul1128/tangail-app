import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_constants.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/prayer_times_strip.dart';

class IslamicScreen extends StatefulWidget {
  final String initialType;
  const IslamicScreen({super.key, this.initialType = ''});
  @override
  State<IslamicScreen> createState() => _IslamicScreenState();
}

class _IslamicScreenState extends State<IslamicScreen> {
  List<Map<String, dynamic>> _items = [];
  bool _loading = true;
  late String _selectedType;

  // These types show Firestore places
  static const _placeTypes = ['mosque', 'temple', 'mazar', 'church'];

  // These types show informational content
  static const _infoTypes = ['namaz', 'roja', 'hajj', 'zakat'];

  static const _typeOptions = [
    ('', 'সব'),
    ('mosque', 'মসজিদ'),
    ('temple', 'মন্দির'),
    ('mazar', 'মাজার'),
    ('namaz', 'নামাজ'),
    ('roja', 'রোজা'),
    ('hajj', 'হজ্জ'),
    ('zakat', 'জাকাত'),
  ];

  @override
  void initState() {
    super.initState();
    _selectedType = widget.initialType;
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final snap = await FirebaseFirestore.instance
          .collection(AppConstants.colIslamic)
          .limit(200)
          .get();
      final list = snap.docs.map((d) {
        final data = d.data() as Map<String, dynamic>? ?? {};
        List<String> phones = [];
        final raw = data['phone'];
        if (raw is List) phones = raw.map((e) => e.toString()).toList();
        else if (raw is String && raw.isNotEmpty) phones = [raw];
        return {
          'id': d.id,
          'name': data['name'] as String? ?? '',
          'type': data['type'] as String? ?? '',
          'address': data['address'] as String? ?? '',
          'phone': phones,
          'isVerified': data['isVerified'] as bool? ?? false,
        };
      }).toList();
      list.sort((a, b) => (a['name'] as String).compareTo(b['name'] as String));
      setState(() { _items = list; _loading = false; });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  bool get _isInfoType =>
      _selectedType.isNotEmpty && _infoTypes.contains(_selectedType);

  bool get _isPlaceType =>
      _selectedType.isEmpty || _placeTypes.contains(_selectedType);

  List<Map<String, dynamic>> get _filtered {
    if (_selectedType.isEmpty) {
      return _items.where((i) => _placeTypes.contains(i['type'])).toList();
    }
    if (_placeTypes.contains(_selectedType)) {
      return _items.where((i) => i['type'] == _selectedType).toList();
    }
    return [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F6F8),
      appBar: AppBar(title: const Text('ধর্মীয় সেবা')),
      body: Column(
        children: [
          FilterChipRow(
            options: _typeOptions,
            selected: _selectedType,
            accentColor: const Color(0xFF059669),
            onChanged: (v) => setState(() => _selectedType = v),
          ),
          Expanded(
            child: _isInfoType
                ? _InfoPage(type: _selectedType)
                : _loading
                    ? const ShimmerList(itemCount: 8)
                    : _filtered.isEmpty
                        ? const Center(
                            child: Text('কোনো তথ্য পাওয়া যায়নি',
                                style: TextStyle(color: Color(0xFF9CA3AF))))
                        : RefreshIndicator(
                            onRefresh: _load,
                            child: ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: _filtered.length,
                              itemBuilder: (_, i) {
                                final item = _filtered[i];
                                final type = item['type'] as String;
                                return InfoCard(
                                  icon: _iconFor(type),
                                  iconColor: _colorFor(type),
                                  title: item['name'] as String,
                                  subtitle: item['address'] as String,
                                  badge: _labelFor(type),
                                  phones: List<String>.from(
                                      item['phone'] as List),
                                  isVerified: item['isVerified'] as bool,
                                );
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }

  IconData _iconFor(String type) {
    switch (type) {
      case 'mosque': return Icons.mosque_rounded;
      case 'temple': return Icons.temple_hindu_rounded;
      case 'mazar':  return Icons.place_rounded;
      default:       return Icons.church_rounded;
    }
  }

  Color _colorFor(String type) {
    switch (type) {
      case 'mosque': return const Color(0xFF059669);
      case 'temple': return const Color(0xFFD97706);
      case 'mazar':  return const Color(0xFF7C3AED);
      default:       return const Color(0xFF0891B2);
    }
  }

  String? _labelFor(String type) {
    const map = {
      'mosque': 'মসজিদ', 'temple': 'মন্দির',
      'mazar': 'মাজার', 'church': 'চার্চ',
    };
    return map[type];
  }
}

// ── Informational page for namaz/roja/hajj/zakat ──────────────────────────────
class _InfoPage extends StatelessWidget {
  final String type;
  const _InfoPage({required this.type});

  static const _content = {
    'namaz': {
      'title': 'নামাজ',
      'icon': '🙏',
      'color': 0xFF059669,
      'intro': 'নামাজ ইসলামের পাঁচটি স্তম্ভের একটি। প্রতিদিন পাঁচ ওয়াক্ত নামাজ পড়া প্রত্যেক প্রাপ্তবয়স্ক মুসলমানের উপর ফরজ।',
      'items': [
        {'name': 'ফজর', 'desc': 'ভোরের নামাজ — সূর্যোদয়ের আগে'},
        {'name': 'যোহর', 'desc': 'দুপুরের নামাজ — মধ্যাহ্নের পর'},
        {'name': 'আসর', 'desc': 'বিকালের নামাজ — মধ্য বিকালে'},
        {'name': 'মাগরিব', 'desc': 'সন্ধ্যার নামাজ — সূর্যাস্তের পর'},
        {'name': 'ইশা', 'desc': 'রাতের নামাজ — রাতের প্রথম প্রহরে'},
      ],
      'link': 'https://www.islamicfoundation.gov.bd',
      'linkLabel': 'ইসলামিক ফাউন্ডেশন',
    },
    'roja': {
      'title': 'রোজা',
      'icon': '🌙',
      'color': 0xFF1D4ED8,
      'intro': 'রোজা ইসলামের পাঁচ স্তম্ভের একটি। রমজান মাসে সুবহে সাদিক থেকে সূর্যাস্ত পর্যন্ত পানাহার থেকে বিরত থাকা ফরজ।',
      'items': [
        {'name': 'সেহরি', 'desc': 'রোজার নিয়তে সুবহে সাদিকের আগে খাওয়া'},
        {'name': 'ইফতার', 'desc': 'সূর্যাস্তের পর রোজা ভঙ্গ করা'},
        {'name': 'তারাবিহ', 'desc': 'রমজান মাসে ইশার পর বিশেষ নামাজ'},
        {'name': 'লাইলাতুল কদর', 'desc': 'রমজানের শেষ দশকের বিজোড় রাতগুলো'},
        {'name': 'ফিতরা', 'desc': 'ঈদুল ফিতরের আগে গরিবদের দেওয়া দান'},
      ],
      'link': 'https://www.islamicfoundation.gov.bd',
      'linkLabel': 'ইসলামিক ফাউন্ডেশন',
    },
    'hajj': {
      'title': 'হজ্জ',
      'icon': '🕋',
      'color': 0xFF92400E,
      'intro': 'হজ্জ ইসলামের পঞ্চম স্তম্ভ। আর্থিক ও শারীরিকভাবে সক্ষম প্রত্যেক মুসলমানের জন্য জীবনে একবার হজ্জ পালন করা ফরজ।',
      'items': [
        {'name': 'হজ্জ নিবন্ধন', 'desc': 'ধর্ম মন্ত্রণালয়ের মাধ্যমে অনলাইনে নিবন্ধন'},
        {'name': 'হজ্জ প্যাকেজ', 'desc': 'সরকারি ও বেসরকারি ব্যবস্থাপনায় প্যাকেজ'},
        {'name': 'ওমরাহ', 'desc': 'যেকোনো সময় পালনযোগ্য হজ্জের ছোট সংস্করণ'},
        {'name': 'হজ্জ প্রশিক্ষণ', 'desc': 'ইসলামিক ফাউন্ডেশনের বিনামূল্যে প্রশিক্ষণ'},
      ],
      'link': 'https://www.hajj.gov.bd',
      'linkLabel': 'হজ্জ পোর্টাল — hajj.gov.bd',
    },
    'zakat': {
      'title': 'জাকাত',
      'icon': '💰',
      'color': 0xFF065F46,
      'intro': 'জাকাত ইসলামের তৃতীয় স্তম্ভ। নিসাব পরিমাণ সম্পদের মালিকদের বার্ষিক ২.৫% জাকাত আদায় করা ফরজ।',
      'items': [
        {'name': 'নিসাব', 'desc': 'সাড়ে সাত তোলা সোনা বা সাড়ে বায়ান্ন তোলা রুপার সমপরিমাণ'},
        {'name': 'জাকাতের হার', 'desc': 'মোট সম্পদের ২.৫% (৪০ ভাগের ১ ভাগ)'},
        {'name': 'জাকাত পাওয়ার যোগ্য', 'desc': 'ফকির, মিসকিন, ঋণগ্রস্ত, মুসাফির'},
        {'name': 'ফিতরা', 'desc': 'ঈদুল ফিতরে গরিবদের জন্য নির্ধারিত দান'},
        {'name': 'জাকাত ফান্ড', 'desc': 'ইসলামিক ফাউন্ডেশনের মাধ্যমে জাকাত প্রদান'},
      ],
      'link': 'https://www.islamicfoundation.gov.bd',
      'linkLabel': 'ইসলামিক ফাউন্ডেশন',
    },
  };

  @override
  Widget build(BuildContext context) {
    final data = _content[type];
    if (data == null) return const SizedBox.shrink();

    final color = Color(data['color'] as int);
    final items = data['items'] as List<Map<String, dynamic>>;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Header card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [color, color.withOpacity(0.7)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              Text(data['icon'] as String,
                  style: const TextStyle(fontSize: 48)),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(data['title'] as String,
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.w900)),
                    const SizedBox(height: 4),
                    Text('ইসলামের গুরুত্বপূর্ণ বিধান',
                        style: TextStyle(
                            color: Colors.white.withOpacity(0.8),
                            fontSize: 12)),
                  ],
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Prayer times strip for namaz
        if (type == 'namaz') ...[
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 8,
                  offset: const Offset(0, 2))],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('আজকের নামাজের সময়',
                    style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: color)),
                const SizedBox(height: 10),
                const PrayerTimesStrip(),
              ],
            ),
          ),
          const SizedBox(height: 12),
        ],

        // Intro
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: color.withOpacity(0.06),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: color.withOpacity(0.2)),
          ),
          child: Text(data['intro'] as String,
              style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFF374151),
                  height: 1.6)),
        ),

        const SizedBox(height: 16),

        // Items
        Text(type == 'namaz' ? 'পাঁচ ওয়াক্ত নামাজ' :
             type == 'roja'  ? 'রোজার গুরুত্বপূর্ণ বিষয়' :
             type == 'hajj'  ? 'হজ্জ সংক্রান্ত তথ্য' :
                               'জাকাতের বিধান',
            style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w800,
                color: color)),
        const SizedBox(height: 10),

        ...items.map((item) => Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 6,
                offset: const Offset(0, 2))],
          ),
          child: Row(
            children: [
              Container(
                width: 36, height: 36,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(Icons.info_outline_rounded,
                    color: color, size: 18),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(item['name'] as String,
                        style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1F2937))),
                    Text(item['desc'] as String,
                        style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF6B7280))),
                  ],
                ),
              ),
            ],
          ),
        )),

        const SizedBox(height: 16),

        // External link
        GestureDetector(
          onTap: () async {
            final uri = Uri.parse(data['link'] as String);
            if (await canLaunchUrl(uri)) {
              launchUrl(uri, mode: LaunchMode.externalApplication);
            }
          },
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.open_in_new_rounded,
                    color: Colors.white, size: 16),
                const SizedBox(width: 8),
                Text(data['linkLabel'] as String,
                    style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 14)),
              ],
            ),
          ),
        ),

        const SizedBox(height: 24),
      ],
    );
  }
}
