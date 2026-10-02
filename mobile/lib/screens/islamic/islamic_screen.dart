import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/app_constants.dart';
import '../../models/generic_service_model.dart';
import '../../services/generic_service_service.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/info_card.dart';
import '../../widgets/prayer_times_strip.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/empty_state.dart';

final _islamicServiceProvider = Provider((_) => GenericServiceService());
final _islamicTypeProvider = StateProvider<String>((_) => '');

final islamicStreamProvider = StreamProvider.autoDispose
    .family<List<GenericServiceModel>, Map<String, String>>((ref, filters) {
  final service = ref.watch(_islamicServiceProvider);
  return service.getItems(
    AppConstants.colIslamic,
    type: filters['type'],
  );
});

class IslamicScreen extends ConsumerWidget {
  const IslamicScreen({super.key});

  static const _typeOptions = [
    ('', 'সব'),
    ('mosque', 'মসজিদ'),
    ('temple', 'মন্দির'),
    ('church', 'চার্চ'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedType = ref.watch(_islamicTypeProvider);
    final itemsAsync = ref.watch(
        islamicStreamProvider({'type': selectedType}));

    return Scaffold(
      appBar: AppBar(title: const Text('মসজিদ ও ধর্মীয় স্থান')),
      body: Column(
        children: [
          // Prayer times strip at top
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 8),
            child: PrayerTimesStrip(),
          ),
          FilterChipRow(
            options: _typeOptions,
            selected: selectedType,
            accentColor: const Color(0xFF006A4E),
            onChanged: (v) =>
                ref.read(_islamicTypeProvider.notifier).state = v,
          ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                ref.invalidate(islamicStreamProvider);
              },
              child: itemsAsync.when(
                loading: () => const ShimmerList(itemCount: 8),
                error: (e, _) => EmptyState(
                  icon: Icons.error_outline_rounded,
                  message: 'ত্রুটি হয়েছে\nআবার চেষ্টা করুন',
                  onRetry: () => ref.invalidate(islamicStreamProvider),
                ),
                data: (items) {
                  if (items.isEmpty) {
                    return const EmptyState(
                      icon: Icons.mosque_rounded,
                      message: 'কোনো ধর্মীয় স্থান পাওয়া যায়নি',
                    );
                  }
                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: items.length,
                    itemBuilder: (_, i) => InfoCard(
                      icon: Icons.mosque_rounded,
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
