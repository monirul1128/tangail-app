import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_constants.dart';
import '../../config/app_theme.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/verified_badge.dart';

class HospitalsScreen extends StatefulWidget {
  const HospitalsScreen({super.key});
  @override
  State<HospitalsScreen> createState() => _HospitalsScreenState();
}

class _HospitalsScreenState extends State<HospitalsScreen> {
  List<Map<String, dynamic>> _all = [];
  bool _loading = true;
  String _upazila = '';
  String _type = '';

  static const _upazilaOptions = [
    ('', 'সব উপজেলা'),
    ('tangail_sadar', 'সদর'),
    ('mirzapur', 'মির্জাপুর'),
    ('madhupur', 'মধুপুর'),
    ('ghatail', 'ঘাটাইল'),
    ('kalihati', 'কালিহাতী'),
    ('basail', 'বাসাইল'),
    ('bhuapur', 'ভূয়াপুর'),
    ('delduar', 'দেলদুয়ার'),
    ('dhanbari', 'ধনবাড়ী'),
    ('gopalpur', 'গোপালপুর'),
    ('nagarpur', 'নাগরপুর'),
    ('sakhipur', 'সখিপুর'),
  ];

  static const _typeOptions = [
    ('', 'সব'),
    ('government', 'সরকারি'),
    ('private', 'বেসরকারি'),
    ('diagnostic', 'ডায়াগনস্টিক'),
    ('clinic', 'ক্লিনিক'),
  ];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final snap = await FirebaseFirestore.instance
          .collection(AppConstants.colHospitals)
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
          'upazilaId': data['upazilaId'] as String? ?? '',
          'address': data['address'] as String? ?? '',
          'phone': phones,
          'isVerified': data['isVerified'] as bool? ?? false,
          'isOpen24Hours': data['isOpen24Hours'] as bool? ?? false,
          'imageUrl': data['imageUrl'] as String? ?? '',
          'rating': (data['rating'] ?? 0.0).toDouble(),
        };
      }).toList();

      list.sort((a, b) => (a['name'] as String).compareTo(b['name'] as String));
      setState(() { _all = list; _loading = false; });
    } catch (e) {
      setState(() => _loading = false);
    }
  }

  List<Map<String, dynamic>> get _filtered {
    return _all.where((h) {
      if (_upazila.isNotEmpty && h['upazilaId'] != _upazila) return false;
      if (_type.isNotEmpty && h['type'] != _type) return false;
      return true;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filtered;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F6F8),
      appBar: AppBar(
        title: const Text('হাসপাতাল'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _load,
          ),
        ],
      ),
      body: Column(
        children: [
          // Upazila filter
          _FilterRow(
            options: _upazilaOptions,
            selected: _upazila,
            accentColor: AppTheme.primaryColor,
            onChanged: (v) => setState(() => _upazila = v),
          ),
          // Type filter
          _FilterRow(
            options: _typeOptions,
            selected: _type,
            accentColor: AppTheme.accentColor,
            onChanged: (v) => setState(() => _type = v),
          ),
          // List
          Expanded(
            child: _loading
                ? const ShimmerList(itemCount: 8)
                : filtered.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.local_hospital_rounded,
                                size: 60, color: Color(0xFF9CA3AF)),
                            const SizedBox(height: 12),
                            Text(
                              _all.isEmpty
                                  ? 'কোনো হাসপাতাল পাওয়া যায়নি'
                                  : 'এই ফিল্টারে কোনো হাসপাতাল নেই',
                              style: const TextStyle(
                                  color: Color(0xFF9CA3AF), fontSize: 14),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _load,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: filtered.length,
                          itemBuilder: (_, i) => _HospitalCard(
                            hospital: filtered[i],
                            onTap: () => context
                                .push('/hospitals/${filtered[i]['id']}'),
                          ),
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}

// ── Filter chips row ──────────────────────────────────────────────────────────
class _FilterRow extends StatelessWidget {
  final List<(String, String)> options;
  final String selected;
  final Color accentColor;
  final ValueChanged<String> onChanged;

  const _FilterRow({
    required this.options,
    required this.selected,
    required this.accentColor,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 46,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        itemCount: options.length,
        itemBuilder: (_, i) {
          final (id, label) = options[i];
          final isSelected = selected == id;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: FilterChip(
              label: Text(label),
              selected: isSelected,
              onSelected: (_) => onChanged(id),
              selectedColor: accentColor.withOpacity(0.15),
              checkmarkColor: accentColor,
              labelStyle: TextStyle(
                fontSize: 12,
                color: isSelected ? accentColor : const Color(0xFF6B7280),
                fontWeight:
                    isSelected ? FontWeight.w600 : FontWeight.normal,
              ),
            ),
          );
        },
      ),
    );
  }
}

// ── Hospital card ─────────────────────────────────────────────────────────────
class _HospitalCard extends StatelessWidget {
  final Map<String, dynamic> hospital;
  final VoidCallback onTap;

  const _HospitalCard({required this.hospital, required this.onTap});

  static const _typeNames = {
    'government': 'সরকারি',
    'private': 'বেসরকারি',
    'diagnostic': 'ডায়াগনস্টিক',
    'clinic': 'ক্লিনিক',
  };

  @override
  Widget build(BuildContext context) {
    final type = hospital['type'] as String;
    final typeName = _typeNames[type] ?? type;
    final phones = hospital['phone'] as List<String>;
    final isOpen24 = hospital['isOpen24Hours'] as bool;
    final isVerified = hospital['isVerified'] as bool;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon
            Container(
              width: 52, height: 52,
              decoration: BoxDecoration(
                color: AppTheme.accentColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.local_hospital_rounded,
                  color: AppTheme.accentColor, size: 26),
            ),
            const SizedBox(width: 12),
            // Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          hospital['name'] as String,
                          style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF1F2937)),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (isVerified) const VerifiedBadge(),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF4F6F8),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(typeName,
                            style: const TextStyle(
                                fontSize: 11,
                                color: Color(0xFF6B7280))),
                      ),
                      if (isOpen24) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppTheme.successColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text('২৪ ঘণ্টা',
                              style: TextStyle(
                                  fontSize: 11,
                                  color: AppTheme.successColor,
                                  fontWeight: FontWeight.w600)),
                        ),
                      ],
                    ],
                  ),
                  if ((hospital['address'] as String).isNotEmpty) ...[
                    const SizedBox(height: 5),
                    Row(
                      children: [
                        const Icon(Icons.location_on_rounded,
                            size: 13, color: Color(0xFF9CA3AF)),
                        const SizedBox(width: 3),
                        Expanded(
                          child: Text(
                            hospital['address'] as String,
                            style: const TextStyle(
                                fontSize: 12,
                                color: Color(0xFF6B7280)),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                  if (phones.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 4,
                      children: phones.take(2).map((p) =>
                        GestureDetector(
                          onTap: () async {
                            final uri = Uri(scheme: 'tel', path: p);
                            if (await canLaunchUrl(uri)) launchUrl(uri);
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: AppTheme.successColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.phone_rounded,
                                    size: 12,
                                    color: AppTheme.successColor),
                                const SizedBox(width: 4),
                                Text(p,
                                    style: const TextStyle(
                                        fontSize: 12, fontFamily: 'Roboto', color: AppTheme.successColor, fontWeight: FontWeight.w600)),
                              ],
                            ),
                          ),
                        ),
                      ).toList(),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
