import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/app_constants.dart';
import '../../models/generic_service_model.dart';
import '../../services/generic_service_service.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/empty_state.dart';

final _govtServiceProvider = Provider((_) => GenericServiceService());
final _govtTypeProvider = StateProvider<String>((_) => '');

final govtStreamProvider = StreamProvider.autoDispose
    .family<List<GenericServiceModel>, Map<String, String>>((ref, filters) {
  final service = ref.watch(_govtServiceProvider);
  return service.getItems(
    AppConstants.colGovtServices,
    type: filters['type'],
  );
});

class GovtScreen extends ConsumerWidget {
  const GovtScreen({super.key});

  static const _typeOptions = [
    ('', 'সব'),
    ('upazila', 'উপজেলা পরিষদ'),
    ('union', 'ইউনিয়ন পরিষদ'),
    ('office', 'সরকারি অফিস'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedType = ref.watch(_govtTypeProvider);
    final itemsAsync = ref.watch(
        govtStreamProvider({'type': selectedType}));

    return Scaffold(
      appBar: AppBar(title: const Text('সরকারি সেবা')),
      body: Column(
        children: [
          FilterChipRow(
            options: _typeOptions,
            selected: selectedType,
            accentColor: const Color(0xFF006A4E),
            onChanged: (v) =>
                ref.read(_govtTypeProvider.notifier).state = v,
          ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                ref.invalidate(govtStreamProvider);
              },
              child: itemsAsync.when(
                loading: () => const ShimmerList(itemCount: 8),
                error: (e, _) => EmptyState(
                  icon: Icons.error_outline_rounded,
                  message: 'ত্রুটি হয়েছে\nআবার চেষ্টা করুন',
                  onRetry: () => ref.invalidate(govtStreamProvider),
                ),
                data: (items) {
                  if (items.isEmpty) {
                    return const EmptyState(
                      icon: Icons.account_balance_rounded,
                      message: 'কোনো সরকারি সেবা পাওয়া যায়নি',
                    );
                  }
                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: items.length,
                    itemBuilder: (_, i) => InfoCard(
                      icon: Icons.account_balance_rounded,
                      iconColor: const Color(0xFF006A4E),
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
