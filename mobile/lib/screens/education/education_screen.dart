import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/app_constants.dart';
import '../../models/generic_service_model.dart';
import '../../services/generic_service_service.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/empty_state.dart';

final _educationServiceProvider = Provider((_) => GenericServiceService());
final _educationTypeProvider = StateProvider<String>((_) => '');

final educationStreamProvider = StreamProvider.autoDispose
    .family<List<GenericServiceModel>, Map<String, String>>((ref, filters) {
  final service = ref.watch(_educationServiceProvider);
  return service.getItems(
    AppConstants.colEducation,
    type: filters['type'],
  );
});

class EducationScreen extends ConsumerWidget {
  const EducationScreen({super.key});

  static const _typeOptions = [
    ('', 'সব'),
    ('school', 'স্কুল'),
    ('college', 'কলেজ'),
    ('madrasa', 'মাদ্রাসা'),
    ('university', 'বিশ্ববিদ্যালয়'),
    ('kindergarten', 'কিন্ডারগার্টেন'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedType = ref.watch(_educationTypeProvider);
    final itemsAsync = ref.watch(
        educationStreamProvider({'type': selectedType}));

    return Scaffold(
      appBar: AppBar(title: const Text('শিক্ষা প্রতিষ্ঠান')),
      body: Column(
        children: [
          FilterChipRow(
            options: _typeOptions,
            selected: selectedType,
            accentColor: const Color(0xFF7C3AED),
            onChanged: (v) =>
                ref.read(_educationTypeProvider.notifier).state = v,
          ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                ref.invalidate(educationStreamProvider);
              },
              child: itemsAsync.when(
                loading: () => const ShimmerList(itemCount: 8),
                error: (e, _) => EmptyState(
                  icon: Icons.error_outline_rounded,
                  message: 'ত্রুটি হয়েছে\nআবার চেষ্টা করুন',
                  onRetry: () => ref.invalidate(educationStreamProvider),
                ),
                data: (items) {
                  if (items.isEmpty) {
                    return const EmptyState(
                      icon: Icons.school_rounded,
                      message: 'কোনো শিক্ষা প্রতিষ্ঠান পাওয়া যায়নি',
                    );
                  }
                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: items.length,
                    itemBuilder: (_, i) => InfoCard(
                      icon: Icons.school_rounded,
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
