import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../config/app_constants.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';

class ProfessionalsScreen extends StatefulWidget {
  final String initialType;
  const ProfessionalsScreen({super.key, this.initialType = ''});
  @override
  State<ProfessionalsScreen> createState() => _ProfessionalsScreenState();
}

class _ProfessionalsScreenState extends State<ProfessionalsScreen> {
  List<Map<String, dynamic>> _items = [];
  bool _loading = true;
  late String _selectedType;

  static const _typeOptions = [
    ('', 'সব'), ('lawyer', 'আইনজীবী'), ('journalist', 'সাংবাদিক'),
    ('technician', 'টেকনিশিয়ান'), ('kazi', 'কাজি অফিস'),
    ('teacher', 'শিক্ষক'), ('other', 'অন্যান্য'),
  ];

  @override void initState() { super.initState(); _selectedType = widget.initialType; _load(); }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final snap = await FirebaseFirestore.instance
          .collection(AppConstants.colProfessionals).limit(200).get();
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
          'address': data['address'] as String? ?? data['chamber'] as String? ?? '',
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
      appBar: AppBar(title: const Text('পেশাদার সেবা')),
      body: Column(
        children: [
          FilterChipRow(
            options: _typeOptions,
            selected: _selectedType,
            accentColor: const Color(0xFF6366F1),
            onChanged: (v) => setState(() => _selectedType = v),
          ),
          Expanded(
            child: _loading
                ? const ShimmerList(itemCount: 8)
                : filtered.isEmpty
                    ? const Center(child: Text('কোনো তথ্য পাওয়া যায়নি',
                        style: TextStyle(color: Color(0xFF9CA3AF))))
                    : RefreshIndicator(
                        onRefresh: _load,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: filtered.length,
                          itemBuilder: (_, i) {
                            final item = filtered[i];
                            return InfoCard(
                              icon: Icons.work_rounded,
                              iconColor: const Color(0xFF6366F1),
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
