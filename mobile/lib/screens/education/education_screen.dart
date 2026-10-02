import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../config/app_constants.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';

final _educationTypeProvider = StateProvider<String>((_) => '');

class EducationScreen extends ConsumerStatefulWidget {
  const EducationScreen({super.key});

  @override
  ConsumerState<EducationScreen> createState() => _EducationScreenState();
}

class _EducationScreenState extends ConsumerState<EducationScreen> {
  List<Map<String, dynamic>> _items = [];
  bool _loading = true;
  String _error = '';

  static const _typeOptions = [
    ('', 'সব'),
    ('school', 'স্কুল'),
    ('college', 'কলেজ'),
    ('madrasa', 'মাদ্রাসা'),
    ('university', 'বিশ্ববিদ্যালয়'),
    ('coaching', 'কোচিং'),
    ('kindergarten', 'কিন্ডারগার্টেন'),
  ];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() { _loading = true; _error = ''; });
    try {
      final snap = await FirebaseFirestore.instance
          .collection(AppConstants.colEducation)
          .limit(200)
          .get();

      final list = snap.docs.map((doc) {
        final d = doc.data();
        // phone can be String or List
        List<String> phones = [];
        final rawPhone = d['phone'];
        if (rawPhone is List) {
          phones = rawPhone.map((e) => e.toString()).toList();
        } else if (rawPhone is String && rawPhone.isNotEmpty) {
          phones = [rawPhone];
        }

        return {
          'id': doc.id,
          'name': d['name'] as String? ?? d['title'] as String? ?? '',
          'type': d['type'] as String? ?? '',
          'address': d['address'] as String? ?? '',
          'phone': phones,
          'isVerified': d['isVerified'] as bool? ?? false,
        };
      }).toList();

      list.sort((a, b) => (a['name'] as String).compareTo(b['name'] as String));

      setState(() { _items = list; _loading = false; });
    } catch (e) {
      setState(() { _error = e.toString(); _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    final selectedType = ref.watch(_educationTypeProvider);

    final filtered = selectedType.isEmpty
        ? _items
        : _items.where((i) => i['type'] == selectedType).toList();

    return Scaffold(
      appBar: AppBar(title: const Text('শিক্ষা প্রতিষ্ঠান')),
      body: Column(
        children: [
          FilterChipRow(
            options: _typeOptions,
            selected: selectedType,
            accentColor: const Color(0xFF1D4ED8),
            onChanged: (v) =>
                ref.read(_educationTypeProvider.notifier).state = v,
          ),
          Expanded(
            child: _loading
                ? const ShimmerList(itemCount: 8)
                : _error.isNotEmpty
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.error_outline,
                                  color: Colors.red, size: 48),
                              const SizedBox(height: 12),
                              Text(_error,
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(
                                      fontSize: 13, color: Colors.red)),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: _loadData,
                                child: const Text('আবার চেষ্টা করুন'),
                              ),
                            ],
                          ),
                        ),
                      )
                    : filtered.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.school_rounded,
                                    size: 60,
                                    color: Color(0xFF9CA3AF)),
                                const SizedBox(height: 12),
                                Text(
                                  _items.isEmpty
                                      ? 'কোনো তথ্য পাওয়া যায়নি\nCollection: ${AppConstants.colEducation}'
                                      : 'এই ধরনের কোনো প্রতিষ্ঠান নেই',
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(
                                      color: Color(0xFF9CA3AF),
                                      fontSize: 13),
                                ),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: _loadData,
                            child: ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: filtered.length,
                              itemBuilder: (_, i) {
                                final item = filtered[i];
                                return InfoCard(
                                  icon: _iconForType(
                                      item['type'] as String),
                                  iconColor: _colorForType(
                                      item['type'] as String),
                                  title: item['name'] as String,
                                  subtitle:
                                      item['address'] as String,
                                  badge: _labelForType(
                                      item['type'] as String),
                                  phones: List<String>.from(
                                      item['phone'] as List),
                                  isVerified:
                                      item['isVerified'] as bool,
                                );
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }

  IconData _iconForType(String type) {
    switch (type) {
      case 'college':    return Icons.account_balance_rounded;
      case 'university': return Icons.school_rounded;
      case 'madrasa':    return Icons.menu_book_rounded;
      case 'coaching':   return Icons.edit_rounded;
      default:           return Icons.school_rounded;
    }
  }

  Color _colorForType(String type) {
    switch (type) {
      case 'college':    return const Color(0xFF7C3AED);
      case 'university': return const Color(0xFFDC2626);
      case 'madrasa':    return const Color(0xFF059669);
      case 'coaching':   return const Color(0xFF0891B2);
      default:           return const Color(0xFF1D4ED8);
    }
  }

  String? _labelForType(String type) {
    const map = {
      'school':      'স্কুল',
      'college':     'কলেজ',
      'university':  'বিশ্ববিদ্যালয়',
      'madrasa':     'মাদ্রাসা',
      'coaching':    'কোচিং',
      'kindergarten':'কিন্ডারগার্টেন',
    };
    return map[type];
  }
}
