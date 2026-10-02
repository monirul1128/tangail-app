import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../config/app_constants.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';

class OrganizationsScreen extends StatefulWidget {
  const OrganizationsScreen({super.key});
  @override
  State<OrganizationsScreen> createState() => _OrganizationsScreenState();
}

class _OrganizationsScreenState extends State<OrganizationsScreen> {
  List<Map<String, dynamic>> _items = [];
  bool _loading = true;
  String _selectedType = '';

  static const _typeOptions = [
    ('', 'সব'), ('govt', 'সরকারি'), ('ngo', 'এনজিও'),
    ('cultural', 'সাংস্কৃতিক'), ('sports', 'ক্রীড়া'),
    ('social', 'সামাজিক'), ('business', 'ব্যবসায়িক'),
  ];

  @override void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final snap = await FirebaseFirestore.instance
          .collection(AppConstants.colOrganizations).limit(200).get();
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
    } catch (_) { setState(() => _loading = false); }
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _selectedType.isEmpty
        ? _items
        : _items.where((i) => i['type'] == _selectedType).toList();

    return Scaffold(
      appBar: AppBar(title: const Text('সংগঠন ও প্রতিষ্ঠান')),
      body: Column(
        children: [
          FilterChipRow(
            options: _typeOptions,
            selected: _selectedType,
            accentColor: const Color(0xFFEC4899),
            onChanged: (v) => setState(() => _selectedType = v),
          ),
          Expanded(
            child: _loading
                ? const ShimmerList(itemCount: 8)
                : filtered.isEmpty
                    ? const Center(child: Text('কোনো সংগঠন পাওয়া যায়নি',
                        style: TextStyle(color: Color(0xFF9CA3AF))))
                    : RefreshIndicator(
                        onRefresh: _load,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: filtered.length,
                          itemBuilder: (_, i) {
                            final item = filtered[i];
                            return InfoCard(
                              icon: Icons.groups_rounded,
                              iconColor: const Color(0xFFEC4899),
                              title: item['name'] as String,
                              subtitle: item['address'] as String,
                              badge: (item['type'] as String).isNotEmpty ? item['type'] as String : null,
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
