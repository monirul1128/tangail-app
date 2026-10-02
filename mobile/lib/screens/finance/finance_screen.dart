import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/app_constants.dart';
import '../../models/generic_service_model.dart';
import '../../services/generic_service_service.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/empty_state.dart';

final _financeServiceProvider = Provider((_) => GenericServiceService());
final _financeTypeProvider = StateProvider<String>((_) => '');

final financeStreamProvider = StreamProvider.autoDispose
    .family<List<GenericServiceModel>, Map<String, String>>((ref, filters) {
  final service = ref.watch(_financeServiceProvider);
  return service.getItems(
    AppConstants.colFinance,
    type: filters['type'],
  );
});

class FinanceScreen extends ConsumerWidget {
  const FinanceScreen({super.key});

  static const _typeOptions = [
    ('', 'সব'),
    ('bank', 'ব্যাংক'),
    ('insurance', 'বীমা'),
    ('ngo', 'এনজিও'),
    ('mfs', 'মোবাইল ব্যাংকিং'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedType = ref.watch(_financeTypeProvider);
    final itemsAsync = ref.watch(
        financeStreamProvider({'type': selectedType}));

    return Scaffold(
      appBar: AppBar(title: const Text('ব্যাংক ও আর্থিক সেবা')),
      body: Column(
        children: [
          FilterChipRow(
            options: _typeOptions,
            selected: selectedType,
            accentColor: const Color(0xFF1D4ED8),
            onChanged: (v) =>
                ref.read(_financeTypeProvider.notifier).state = v,
          ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                ref.invalidate(financeStreamProvider);
              },
              child: itemsAsync.when(
                loading: () => const ShimmerList(itemCount: 8),
                error: (e, _) => EmptyState(
                  icon: Icons.error_outline_rounded,
                  message: 'ত্রুটি হয়েছে\nআবার চেষ্টা করুন',
                  onRetry: () => ref.invalidate(financeStreamProvider),
                ),
                data: (items) {
                  if (items.isEmpty) {
                    return const EmptyState(
                      icon: Icons.account_balance_rounded,
                      message: 'কোনো আর্থিক সেবা পাওয়া যায়নি',
                    );
                  }
                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: items.length,
                    itemBuilder: (_, i) => InfoCard(
                      icon: Icons.account_balance_rounded,
                      iconColor: const Color(0xFF1D4ED8),
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
