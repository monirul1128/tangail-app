import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/app_constants.dart';
import '../../models/generic_service_model.dart';
import '../../services/generic_service_service.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/empty_state.dart';

final _pharmacyServiceProvider = Provider((_) => GenericServiceService());
final _pharmacyUpazilaProvider = StateProvider<String>((_) => '');

final pharmaciesStreamProvider = StreamProvider.autoDispose
    .family<List<GenericServiceModel>, Map<String, String>>((ref, filters) {
  final service = ref.watch(_pharmacyServiceProvider);
  return service.getItems(
    AppConstants.colPharmacies,
    upazilaId: filters['upazilaId'],
  );
});

class PharmacyScreen extends ConsumerWidget {
  const PharmacyScreen({super.key});

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
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedUpazila = ref.watch(_pharmacyUpazilaProvider);
    final itemsAsync = ref.watch(
        pharmaciesStreamProvider({'upazilaId': selectedUpazila}));

    return Scaffold(
      appBar: AppBar(title: const Text('ফার্মেসি')),
      body: Column(
        children: [
          FilterChipRow(
            options: _upazilaOptions,
            selected: selectedUpazila,
            accentColor: const Color(0xFF059669),
            onChanged: (v) =>
                ref.read(_pharmacyUpazilaProvider.notifier).state = v,
          ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                ref.invalidate(pharmaciesStreamProvider);
              },
              child: itemsAsync.when(
                loading: () => const ShimmerList(itemCount: 8),
                error: (e, _) => EmptyState(
                  icon: Icons.error_outline_rounded,
                  message: 'ত্রুটি হয়েছে\nআবার চেষ্টা করুন',
                  onRetry: () => ref.invalidate(pharmaciesStreamProvider),
                ),
                data: (items) {
                  if (items.isEmpty) {
                    return const EmptyState(
                      icon: Icons.local_pharmacy_rounded,
                      message: 'কোনো ফার্মেসি পাওয়া যায়নি',
                    );
                  }
                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: items.length,
                    itemBuilder: (_, i) => InfoCard(
                      icon: Icons.local_pharmacy_rounded,
                      iconColor: const Color(0xFF059669),
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
