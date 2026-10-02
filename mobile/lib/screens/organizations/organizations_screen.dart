import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/app_constants.dart';
import '../../models/generic_service_model.dart';
import '../../services/generic_service_service.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/empty_state.dart';

final _organizationsServiceProvider = Provider((_) => GenericServiceService());
final _organizationsUpazilaProvider = StateProvider<String>((_) => '');

final organizationsStreamProvider = StreamProvider.autoDispose
    .family<List<GenericServiceModel>, Map<String, String>>((ref, filters) {
  final service = ref.watch(_organizationsServiceProvider);
  return service.getItems(
    AppConstants.colOrganizations,
    upazilaId: filters['upazilaId'],
  );
});

class OrganizationsScreen extends ConsumerWidget {
  const OrganizationsScreen({super.key});

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
    final selectedUpazila = ref.watch(_organizationsUpazilaProvider);
    final itemsAsync = ref.watch(
        organizationsStreamProvider({'upazilaId': selectedUpazila}));

    return Scaffold(
      appBar: AppBar(title: const Text('সংগঠন ও ক্লাব')),
      body: Column(
        children: [
          FilterChipRow(
            options: _upazilaOptions,
            selected: selectedUpazila,
            accentColor: const Color(0xFF059669),
            onChanged: (v) =>
                ref.read(_organizationsUpazilaProvider.notifier).state = v,
          ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                ref.invalidate(organizationsStreamProvider);
              },
              child: itemsAsync.when(
                loading: () => const ShimmerList(itemCount: 8),
                error: (e, _) => EmptyState(
                  icon: Icons.error_outline_rounded,
                  message: 'ত্রুটি হয়েছে\nআবার চেষ্টা করুন',
                  onRetry: () => ref.invalidate(organizationsStreamProvider),
                ),
                data: (items) {
                  if (items.isEmpty) {
                    return const EmptyState(
                      icon: Icons.groups_rounded,
                      message: 'কোনো সংগঠন পাওয়া যায়নি',
                    );
                  }
                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: items.length,
                    itemBuilder: (_, i) => InfoCard(
                      icon: Icons.groups_rounded,
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
