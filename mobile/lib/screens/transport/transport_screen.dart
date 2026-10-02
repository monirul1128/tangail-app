import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/app_constants.dart';
import '../../models/generic_service_model.dart';
import '../../services/generic_service_service.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/empty_state.dart';

final _transportServiceProvider = Provider((_) => GenericServiceService());
final _transportTypeProvider = StateProvider<String>((_) => '');

final transportStreamProvider = StreamProvider.autoDispose
    .family<List<GenericServiceModel>, Map<String, String>>((ref, filters) {
  final service = ref.watch(_transportServiceProvider);
  return service.getItems(
    AppConstants.colTransport,
    type: filters['type'],
  );
});

class TransportScreen extends ConsumerWidget {
  const TransportScreen({super.key});

  static const _typeOptions = [
    ('', 'সব'),
    ('bus', 'বাস'),
    ('launch', 'লঞ্চ'),
    ('train', 'ট্রেন'),
    ('cng', 'সিএনজি'),
    ('rental', 'ভাড়া'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedType = ref.watch(_transportTypeProvider);
    final itemsAsync = ref.watch(
        transportStreamProvider({'type': selectedType}));

    return Scaffold(
      appBar: AppBar(title: const Text('যানবাহন')),
      body: Column(
        children: [
          FilterChipRow(
            options: _typeOptions,
            selected: selectedType,
            accentColor: const Color(0xFFD97706),
            onChanged: (v) =>
                ref.read(_transportTypeProvider.notifier).state = v,
          ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                ref.invalidate(transportStreamProvider);
              },
              child: itemsAsync.when(
                loading: () => const ShimmerList(itemCount: 8),
                error: (e, _) => EmptyState(
                  icon: Icons.error_outline_rounded,
                  message: 'ত্রুটি হয়েছে\nআবার চেষ্টা করুন',
                  onRetry: () => ref.invalidate(transportStreamProvider),
                ),
                data: (items) {
                  if (items.isEmpty) {
                    return const EmptyState(
                      icon: Icons.directions_bus_rounded,
                      message: 'কোনো যানবাহন সেবা পাওয়া যায়নি',
                    );
                  }
                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: items.length,
                    itemBuilder: (_, i) => InfoCard(
                      icon: Icons.directions_bus_rounded,
                      iconColor: const Color(0xFFD97706),
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
