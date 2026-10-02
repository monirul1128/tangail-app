import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../config/app_constants.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';

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

  static const _typeOptions = [
    ('', 'সব'), ('mosque', 'মসজিদ'), ('temple', 'মন্দির'),
    ('mazar', 'মাজার'), ('church', 'চার্চ'),
  ];

  @override void initState() { super.initState(); _selectedType = widget.initialType; _load(); }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final snap = await FirebaseFirestore.instance
          .collection(AppConstants.colIslamic).limit(200).get();
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
    } catch (e) {
      setState(() => _loading = false);
    }
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

  @override
  Widget build(BuildContext context) {
    final filtered = _selectedType.isEmpty
        ? _items
        : _items.where((i) => i['type'] == _selectedType).toList();

    return Scaffold(
      appBar: AppBar(title: const Text('ধর্মীয় স্থান')),
      body: Column(
        children: [
          FilterChipRow(
            options: _typeOptions,
            selected: _selectedType,
            accentColor: const Color(0xFF059669),
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
                            final type = item['type'] as String;
                            return InfoCard(
                              icon: _iconFor(type),
                              iconColor: _colorFor(type),
                              title: item['name'] as String,
                              subtitle: item['address'] as String,
                              badge: type.isNotEmpty ? type : null,
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
