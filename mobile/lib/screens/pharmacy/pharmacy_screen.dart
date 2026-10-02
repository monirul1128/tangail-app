import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../config/app_constants.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';

class PharmacyScreen extends StatefulWidget {
  const PharmacyScreen({super.key});
  @override
  State<PharmacyScreen> createState() => _PharmacyScreenState();
}

class _PharmacyScreenState extends State<PharmacyScreen> {
  List<Map<String, dynamic>> _items = [];
  bool _loading = true;
  String _selectedUpazila = '';

  static const _upazilaOptions = [
    ('', 'সব'), ('tangail_sadar', 'সদর'), ('mirzapur', 'মির্জাপুর'),
    ('madhupur', 'মধুপুর'), ('ghatail', 'ঘাটাইল'),
    ('kalihati', 'কালিহাতী'), ('basail', 'বাসাইল'),
    ('bhuapur', 'ভূয়াপুর'), ('delduar', 'দেলদুয়ার'),
    ('dhanbari', 'ধনবাড়ী'), ('gopalpur', 'গোপালপুর'),
    ('nagarpur', 'নাগরপুর'), ('sakhipur', 'সখিপুর'),
  ];

  @override void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final snap = await FirebaseFirestore.instance
          .collection(AppConstants.colPharmacies).limit(200).get();
      final list = snap.docs.map((d) {
        final data = d.data() as Map<String, dynamic>? ?? {};
        List<String> phones = [];
        final raw = data['phone'];
        if (raw is List) phones = raw.map((e) => e.toString()).toList();
        else if (raw is String && raw.isNotEmpty) phones = [raw];
        return {
          'id': d.id,
          'name': data['name'] as String? ?? '',
          'upazilaId': data['upazilaId'] as String? ?? '',
          'address': data['address'] as String? ?? '',
          'phone': phones,
          'isVerified': data['isVerified'] as bool? ?? false,
        };
      }).toList();
      list.sort((a, b) => (a['name'] as String).compareTo(b['name'] as String));
      setState(() { _items = list; _loading = false; });
    } catch (_) { setState(() => _loading = false); }
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _selectedUpazila.isEmpty
        ? _items
        : _items.where((i) => i['upazilaId'] == _selectedUpazila).toList();

    return Scaffold(
      appBar: AppBar(title: const Text('ফার্মেসি')),
      body: Column(
        children: [
          FilterChipRow(
            options: _upazilaOptions,
            selected: _selectedUpazila,
            accentColor: const Color(0xFF059669),
            onChanged: (v) => setState(() => _selectedUpazila = v),
          ),
          Expanded(
            child: _loading
                ? const ShimmerList(itemCount: 8)
                : filtered.isEmpty
                    ? const Center(child: Text('কোনো ফার্মেসি পাওয়া যায়নি',
                        style: TextStyle(color: Color(0xFF9CA3AF))))
                    : RefreshIndicator(
                        onRefresh: _load,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: filtered.length,
                          itemBuilder: (_, i) {
                            final item = filtered[i];
                            return InfoCard(
                              icon: Icons.local_pharmacy_rounded,
                              iconColor: const Color(0xFF059669),
                              title: item['name'] as String,
                              subtitle: item['address'] as String,
                              phones: List<String>.from(item['phone'] as List),
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
}
