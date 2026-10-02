import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../config/app_constants.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';

class TransportScreen extends StatefulWidget {
  final String initialType;
  const TransportScreen({super.key, this.initialType = ''});
  @override
  State<TransportScreen> createState() => _TransportScreenState();
}

class _TransportScreenState extends State<TransportScreen> {
  List<Map<String, dynamic>> _items = [];
  bool _loading = true;
  late String _selectedType;

  static const _typeOptions = [
    ('', 'সব'), ('bus', 'বাস'), ('train', 'ট্রেন'),
    ('rentcar', 'রেন্ট এ কার'), ('cng', 'সিএনজি'),
    ('fuel', 'ফুয়েল'), ('courier', 'কুরিয়ার'),
  ];

  static const _typeIcons = {
    'bus': Icons.directions_bus_rounded,
    'train': Icons.train_rounded,
    'rentcar': Icons.directions_car_rounded,
    'cng': Icons.local_gas_station_rounded,
    'fuel': Icons.local_gas_station_rounded,
    'courier': Icons.local_shipping_rounded,
  };

  @override void initState() { super.initState(); _selectedType = widget.initialType; _load(); }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final snap = await FirebaseFirestore.instance
          .collection(AppConstants.colTransport).limit(200).get();
      final list = snap.docs.map((d) => _parse(d)).toList();
      list.sort((a, b) => (a['name'] as String).compareTo(b['name'] as String));
      setState(() { _items = list; _loading = false; });
    } catch (_) { setState(() => _loading = false); }
  }

  Map<String, dynamic> _parse(DocumentSnapshot d) {
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
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _selectedType.isEmpty
        ? _items
        : _items.where((i) => i['type'] == _selectedType).toList();

    return Scaffold(
      appBar: AppBar(title: const Text('যানবাহন সেবা')),
      body: Column(
        children: [
          FilterChipRow(
            options: _typeOptions,
            selected: _selectedType,
            accentColor: const Color(0xFFD97706),
            onChanged: (v) => setState(() => _selectedType = v),
          ),
          Expanded(
            child: _loading
                ? const ShimmerList(itemCount: 8)
                : filtered.isEmpty
                    ? const Center(child: Text('কোনো যানবাহন সেবা পাওয়া যায়নি',
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
                              icon: _typeIcons[type] ?? Icons.directions_bus_rounded,
                              iconColor: const Color(0xFFD97706),
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
