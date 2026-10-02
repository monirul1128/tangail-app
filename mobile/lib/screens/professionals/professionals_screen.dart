import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/app_constants.dart';
import '../../models/generic_service_model.dart';
import '../../services/generic_service_service.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/empty_state.dart';

final _professionalsServiceProvider = Provider((_) => GenericServiceService());
final _professionalsTypeProvider = StateProvider<String>((_) => '');

final professionalsStreamProvider = StreamProvider.autoDispose
    .family<List<GenericServiceModel>, Map<String, String>>((ref, filters) {
  final service = ref.watch(_professionalsServiceProvider);
  return service.getItems(
    AppConstants.colProfessionals,
    type: filters['type'],
  );
});

class ProfessionalsScreen extends ConsumerWidget {
  const ProfessionalsScreen({super.key});

  static const _typeOptions = [
    ('', 'সব'),
    ('lawyer', 'আইনজীবী'),
    ('accountant', 'হিসাবরক্ষক'),
    ('engineer', 'প্রকৌশলী'),
    ('it', 'আইটি বিশেষজ্ঞ'),
    ('doctor', 'চিকিৎসক'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedType = ref.watch(_professionalsTypeProvider);
    final itemsAsync = ref.watch(
        professionalsStreamProvider({'type': selectedType}));

    return Scaffold(
      appBar: AppBar(title: const Text('পেশাদার সেবা')),
      body: Column(
        children: [
          FilterChipRow(
            options: _typeOptions,
            selected: selectedType,
            accentColor: const Color(0xFF7C3AED),
            onChanged: (v) =>
                ref.read(_professionalsTypeProvider.notifier).state = v,
          ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                ref.invalidate(professionalsStreamProvider);
              },
              child: itemsAsync.when(
                loading: () => const ShimmerList(itemCount: 8),
                error: (e, _) => EmptyState(
                  icon: Icons.error_outline_rounded,
                  message: 'ত্রুটি হয়েছে\nআবার চেষ্টা করুন',
                  onRetry: () => ref.invalidate(professionalsStreamProvider),
                ),
                data: (items) {
                  if (items.isEmpty) {
                    return const EmptyState(
                      icon: Icons.badge_rounded,
                      message: 'কোনো পেশাদার সেবা পাওয়া যায়নি',
                    );
                  }
                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: items.length,
                    itemBuilder: (_, i) => InfoCard(
                      icon: Icons.badge_rounded,
                      iconColor: const Color(0xFF7C3AED),
                      title: items[i].name,
                      subtitle: items[i].address,
                      badge: items[i].type.isNotEmpty ? items[i].type : null,
                      phones: items[i].phone,
                      isVerified: items[i].isVerified,
                    ),
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
