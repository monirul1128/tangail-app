import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_constants.dart';
import '../../config/app_theme.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/verified_badge.dart';

class DoctorsScreen extends StatefulWidget {
  const DoctorsScreen({super.key});
  @override
  State<DoctorsScreen> createState() => _DoctorsScreenState();
}

class _DoctorsScreenState extends State<DoctorsScreen> {
  List<Map<String, dynamic>> _all = [];
  bool _loading = true;
  String _specialty = '';

  static const _specialtyOptions = [
    ('', 'সব'),
    ('medicine', 'মেডিসিন'),
    ('surgery', 'সার্জারি'),
    ('gynecology', 'গাইনী'),
    ('pediatrics', 'শিশু রোগ'),
    ('orthopedics', 'অর্থোপেডিক'),
    ('cardiology', 'হৃদরোগ'),
    ('neurology', 'নিউরোলজি'),
    ('dermatology', 'চর্মরোগ'),
    ('dentistry', 'দাঁতের রোগ'),
    ('eye', 'চোখের রোগ'),
    ('ent', 'নাক-কান-গলা'),
    ('diabetes', 'ডায়াবেটিস'),
    ('homeo', 'হোমিওপ্যাথি'),
  ];

  static const _specialtyNames = {
    'medicine': 'মেডিসিন', 'surgery': 'সার্জারি',
    'gynecology': 'গাইনী', 'pediatrics': 'শিশু রোগ',
    'orthopedics': 'অর্থোপেডিক', 'cardiology': 'হৃদরোগ',
    'neurology': 'নিউরোলজি', 'dermatology': 'চর্মরোগ',
    'dentistry': 'দাঁতের রোগ', 'eye': 'চোখের রোগ',
    'ent': 'নাক-কান-গলা', 'diabetes': 'ডায়াবেটিস',
    'homeo': 'হোমিওপ্যাথি', 'psychiatry': 'মানসিক রোগ',
    'nephrology': 'কিডনি রোগ', 'oncology': 'ক্যান্সার রোগ',
  };

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final snap = await FirebaseFirestore.instance
          .collection(AppConstants.colDoctors)
          .limit(200)
          .get();

      final list = snap.docs.map((d) {
        final data = d.data() as Map<String, dynamic>? ?? {};
        List<String> phones = [];
        final raw = data['phone'];
        if (raw is List) phones = raw.map((e) => e.toString()).toList();
        else if (raw is String && raw.isNotEmpty) phones = [raw];

        List<String> quals = [];
        final rawQ = data['qualifications'];
        if (rawQ is List) quals = rawQ.map((e) => e.toString()).toList();
        else if (rawQ is String && rawQ.isNotEmpty) quals = [rawQ];

        return {
          'id': d.id,
          'name': data['name'] as String? ?? '',
          'specialty': data['specialty'] as String? ?? '',
          'hospitalName': data['hospitalName'] as String? ?? data['hospital'] as String? ?? '',
          'visitingHours': data['visitingHours'] as String? ?? data['chamberTime'] as String? ?? '',
          'visitFee': data['visitFee'] ?? data['fee'] ?? 0,
          'qualifications': quals,
          'phone': phones,
          'imageUrl': data['imageUrl'] as String? ?? '',
          'isVerified': data['isVerified'] as bool? ?? false,
        };
      }).toList();

      list.sort((a, b) => (a['name'] as String).compareTo(b['name'] as String));
      setState(() { _all = list; _loading = false; });
    } catch (e) {
      setState(() => _loading = false);
    }
  }

  List<Map<String, dynamic>> get _filtered {
    if (_specialty.isEmpty) return _all;
    return _all.where((d) => d['specialty'] == _specialty).toList();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filtered;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F6F8),
      appBar: AppBar(
        title: const Text('বিশেষজ্ঞ ডাক্তার'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _load,
          ),
        ],
      ),
      body: Column(
        children: [
          // Specialty filter
          SizedBox(
            height: 46,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              itemCount: _specialtyOptions.length,
              itemBuilder: (_, i) {
                final (id, label) = _specialtyOptions[i];
                final isSelected = _specialty == id;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(label),
                    selected: isSelected,
                    onSelected: (_) => setState(() => _specialty = id),
                    selectedColor: const Color(0xFF7C3AED).withOpacity(0.15),
                    checkmarkColor: const Color(0xFF7C3AED),
                    labelStyle: TextStyle(
                      fontSize: 12,
                      color: isSelected
                          ? const Color(0xFF7C3AED)
                          : const Color(0xFF6B7280),
                      fontWeight: isSelected
                          ? FontWeight.w600
                          : FontWeight.normal,
                    ),
                  ),
                );
              },
            ),
          ),
          Expanded(
            child: _loading
                ? const ShimmerList(itemCount: 8)
                : filtered.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.medical_services_rounded,
                                size: 60, color: Color(0xFF9CA3AF)),
                            const SizedBox(height: 12),
                            Text(
                              _all.isEmpty
                                  ? 'কোনো ডাক্তার পাওয়া যায়নি'
                                  : 'এই বিশেষত্বে কোনো ডাক্তার নেই',
                              style: const TextStyle(
                                  color: Color(0xFF9CA3AF)),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _load,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: filtered.length,
                          itemBuilder: (_, i) => DoctorCard(
                            doctor: filtered[i],
                            specialtyNames: _specialtyNames,
                            onTap: () => context
                                .push('/doctors/${filtered[i]['id']}'),
                          ),
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}

class DoctorCard extends StatelessWidget {
  final Map<String, dynamic> doctor;
  final Map<String, String> specialtyNames;
  final VoidCallback onTap;

  const DoctorCard({
    super.key,
    required this.doctor,
    required this.specialtyNames,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final specialty = doctor['specialty'] as String;
    final specialtyName = specialtyNames[specialty] ?? specialty;
    final phones = doctor['phone'] as List<String>;
    final quals = doctor['qualifications'] as List<String>;
    final visitFee = doctor['visitFee'];
    final feeStr = visitFee != null && visitFee != 0
        ? '৳$visitFee'
        : '';

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
                offset: const Offset(0, 2))
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Avatar
            CircleAvatar(
              radius: 28,
              backgroundColor: const Color(0xFF7C3AED).withOpacity(0.1),
              child: const Icon(Icons.person_rounded,
                  color: Color(0xFF7C3AED), size: 28),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          doctor['name'] as String,
                          style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF1F2937)),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (doctor['isVerified'] as bool)
                        const VerifiedBadge(),
                    ],
                  ),
                  const SizedBox(height: 3),
                  Text(specialtyName,
                      style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFF7C3AED),
                          fontWeight: FontWeight.w600)),
                  if (quals.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(
                      quals.join(', '),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                          fontSize: 11,
                          color: Color(0xFF6B7280)),
                    ),
                  ],
                  if ((doctor['hospitalName'] as String).isNotEmpty) ...[
                    const SizedBox(height: 5),
                    Row(
                      children: [
                        const Icon(Icons.local_hospital_outlined,
                            size: 12, color: Color(0xFF9CA3AF)),
                        const SizedBox(width: 3),
                        Expanded(
                          child: Text(
                            doctor['hospitalName'] as String,
                            style: const TextStyle(
                                fontSize: 11,
                                color: Color(0xFF6B7280)),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                  if ((doctor['visitingHours'] as String).isNotEmpty ||
                      feeStr.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        if ((doctor['visitingHours'] as String)
                            .isNotEmpty) ...[
                          const Icon(Icons.access_time_rounded,
                              size: 12, color: Color(0xFF9CA3AF)),
                          const SizedBox(width: 3),
                          Expanded(
                            child: Text(
                              doctor['visitingHours'] as String,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                  fontSize: 11,
                                  color: Color(0xFF6B7280)),
                            ),
                          ),
                        ],
                        if (feeStr.isNotEmpty)
                          Text(
                            'ভিজিট: $feeStr',
                            style: const TextStyle(
                                fontSize: 12,
                                color: AppTheme.primaryColor,
                                fontWeight: FontWeight.w600),
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
