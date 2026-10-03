import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_constants.dart';
import '../../widgets/shimmer_list.dart';

class BloodDonorScreen extends StatefulWidget {
  const BloodDonorScreen({super.key});
  @override
  State<BloodDonorScreen> createState() => _BloodDonorScreenState();
}

class _BloodDonorScreenState extends State<BloodDonorScreen> {
  List<Map<String, dynamic>> _all = [];
  bool _loading = true;
  String _selectedGroup = '';
  String _selectedUpazila = '';

  static const _bloodGroups = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];

  static const _upazilaOptions = [
    ('', 'সব'),
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

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final snap = await FirebaseFirestore.instance
          .collection(AppConstants.colBloodDonors)
          .limit(300)
          .get();

      final list = snap.docs.map((d) {
        final data = d.data() as Map<String, dynamic>? ?? {};
        return {
          'id': d.id,
          'name': data['name'] as String? ?? '',
          'bloodGroup': data['bloodGroup'] as String? ?? '',
          'phone': data['phone'] as String? ?? '',
          'upazilaId': data['upazilaId'] as String? ?? '',
          'address': data['address'] as String? ?? '',
          'isAvailable': data['isAvailable'] as bool? ?? true,
          'totalDonations': data['totalDonations'] ?? 0,
          'gender': data['gender'] as String? ?? '',
        };
      }).toList();

      list.sort((a, b) => (a['name'] as String).compareTo(b['name'] as String));
      setState(() { _all = list; _loading = false; });
    } catch (e) {
      setState(() => _loading = false);
    }
  }

  List<Map<String, dynamic>> get _filtered {
    return _all.where((d) {
      if (_selectedGroup.isNotEmpty && d['bloodGroup'] != _selectedGroup) {
        return false;
      }
      if (_selectedUpazila.isNotEmpty && d['upazilaId'] != _selectedUpazila) {
        return false;
      }
      return true;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filtered;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F6F8),
      appBar: AppBar(title: const Text('রক্তদাতা খুঁজুন')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/register-donor'),
        backgroundColor: const Color(0xFFDC2626),
        icon: const Icon(Icons.favorite_rounded, color: Colors.white),
        label: const Text('ডোনার হোন',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
      ),
      body: Column(
        children: [
          // ── Header banner ──────────────────────────────────────────
          Container(
            margin: const EdgeInsets.fromLTRB(12, 12, 12, 0),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFDC2626), Color(0xFFF43F5E)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              children: [
                const Icon(Icons.water_drop_rounded,
                    color: Colors.white, size: 36),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('জরুরি রক্ত প্রয়োজন?',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w700)),
                      Text(
                        _all.isEmpty
                            ? 'নিকটস্থ রক্তদাতা খুঁজুন'
                            : '${_all.length}জন নিবন্ধিত ডোনার',
                        style: const TextStyle(
                            color: Colors.white70, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 8),

          // ── Blood group filter ─────────────────────────────────────
          SizedBox(
            height: 46,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(
                  horizontal: 12, vertical: 6),
              children: [
                // "সব গ্রুপ" chip
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: GestureDetector(
                    onTap: () =>
                        setState(() => _selectedGroup = ''),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: _selectedGroup.isEmpty
                            ? const Color(0xFFDC2626)
                            : Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                            color: const Color(0xFFDC2626)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (_selectedGroup.isEmpty)
                            const Icon(Icons.check_rounded,
                                size: 14, color: Colors.white),
                          if (_selectedGroup.isEmpty)
                            const SizedBox(width: 4),
                          Text('সব গ্রুপ',
                              style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: _selectedGroup.isEmpty
                                      ? Colors.white
                                      : const Color(0xFFDC2626))),
                        ],
                      ),
                    ),
                  ),
                ),
                // Blood group chips
                ..._bloodGroups.map((bg) {
                  final isSelected = _selectedGroup == bg;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: GestureDetector(
                      onTap: () =>
                          setState(() => _selectedGroup = bg),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? const Color(0xFFDC2626)
                              : Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                              color: isSelected
                                  ? const Color(0xFFDC2626)
                                  : const Color(0xFFE5E7EB)),
                        ),
                        child: Text(bg,
                            style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: isSelected
                                    ? Colors.white
                                    : const Color(0xFF1F2937))),
                      ),
                    ),
                  );
                }),
              ],
            ),
          ),

          // ── Upazila filter ─────────────────────────────────────────
          SizedBox(
            height: 40,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(
                  horizontal: 12, vertical: 4),
              itemCount: _upazilaOptions.length,
              itemBuilder: (_, i) {
                final (id, label) = _upazilaOptions[i];
                final isSelected = _selectedUpazila == id;
                return Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: GestureDetector(
                    onTap: () =>
                        setState(() => _selectedUpazila = id),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? const Color(0xFF006A4E)
                            : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                            color: isSelected
                                ? const Color(0xFF006A4E)
                                : const Color(0xFFE5E7EB)),
                      ),
                      child: Text(label,
                          style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: isSelected
                                  ? Colors.white
                                  : const Color(0xFF6B7280))),
                    ),
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 4),

          // ── Donor list ─────────────────────────────────────────────
          Expanded(
            child: _loading
                ? const ShimmerList(itemCount: 8)
                : filtered.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.water_drop_outlined,
                                size: 60, color: Color(0xFF9CA3AF)),
                            const SizedBox(height: 12),
                            Text(
                              _all.isEmpty
                                  ? 'কোনো ডোনার পাওয়া যায়নি'
                                  : 'এই ফিল্টারে কোনো ডোনার নেই',
                              style: const TextStyle(
                                  color: Color(0xFF9CA3AF)),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _load,
                        child: ListView.builder(
                          padding: const EdgeInsets.fromLTRB(
                              12, 4, 12, 80),
                          itemCount: filtered.length,
                          itemBuilder: (_, i) =>
                              _DonorCard(donor: filtered[i]),
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}

// ── Donor card ────────────────────────────────────────────────────────────────
class _DonorCard extends StatelessWidget {
  final Map<String, dynamic> donor;
  const _DonorCard({required this.donor});

  @override
  Widget build(BuildContext context) {
    final phone = donor['phone'] as String;
    final isAvailable = donor['isAvailable'] as bool;
    final totalDonations = donor['totalDonations'];

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 8,
              offset: const Offset(0, 2))
        ],
      ),
      child: Row(
        children: [
          // Blood group circle
          Container(
            width: 52, height: 52,
            decoration: const BoxDecoration(
              color: Color(0xFFDC2626),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                donor['bloodGroup'] as String,
                style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w900,
                    fontSize: 15),
              ),
            ),
          ),
          const SizedBox(width: 12),
          // Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(donor['name'] as String,
                    style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF1F2937))),
                const SizedBox(height: 3),
                if ((donor['address'] as String).isNotEmpty)
                  Row(
                    children: [
                      const Icon(Icons.location_on_rounded,
                          size: 12, color: Color(0xFF9CA3AF)),
                      const SizedBox(width: 3),
                      Expanded(
                        child: Text(
                          donor['address'] as String,
                          style: const TextStyle(
                              fontSize: 12, color: Color(0xFF6B7280)),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                const SizedBox(height: 5),
                Row(
                  children: [
                    if (totalDonations != null && totalDonations != 0)
                      Text('মোট দান: $totalDonations বার',
                          style: const TextStyle(
                              fontSize: 11,
                              color: Color(0xFF6B7280))),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: isAvailable
                            ? const Color(0xFF059669).withOpacity(0.1)
                            : const Color(0xFF6B7280).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        isAvailable ? 'উপলব্ধ' : 'অনুপলব্ধ',
                        style: TextStyle(
                            fontSize: 11,
                            color: isAvailable
                                ? const Color(0xFF059669)
                                : const Color(0xFF6B7280),
                            fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 10),
          // Call button
          if (phone.isNotEmpty)
            GestureDetector(
              onTap: () async {
                final uri = Uri(scheme: 'tel', path: phone);
                if (await canLaunchUrl(uri)) launchUrl(uri);
              },
              child: Container(
                width: 42, height: 42,
                decoration: BoxDecoration(
                  color: const Color(0xFF059669).withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.phone_rounded,
                    color: Color(0xFF059669), size: 20),
              ),
            ),
        ],
      ),
    );
  }
}
