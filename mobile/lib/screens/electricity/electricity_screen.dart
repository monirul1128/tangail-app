import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/app_constants.dart';
import '../../models/generic_service_model.dart';
import '../../services/generic_service_service.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/empty_state.dart';

final _electricityServiceProvider = Provider((_) => GenericServiceService());

final electricityStreamProvider =
    StreamProvider.autoDispose<List<GenericServiceModel>>((ref) {
  final service = ref.watch(_electricityServiceProvider);
  return service.getItems(AppConstants.colElectricityOffices);
});

class ElectricityScreen extends ConsumerWidget {
  const ElectricityScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final itemsAsync = ref.watch(electricityStreamProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('বিদ্যুৎ অফিস')),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(electricityStreamProvider);
        },
        child: itemsAsync.when(
          loading: () => const ShimmerList(itemCount: 8),
          error: (e, _) => EmptyState(
            icon: Icons.error_outline_rounded,
            message: 'ত্রুটি হয়েছে\nআবার চেষ্টা করুন',
            onRetry: () => ref.invalidate(electricityStreamProvider),
          ),
          data: (items) {
            if (items.isEmpty) {
              return const EmptyState(
                icon: Icons.electric_bolt_rounded,
                message: 'কোনো বিদ্যুৎ অফিস পাওয়া যায়নি',
              );
            }
            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (_, i) => InfoCard(
                icon: Icons.electric_bolt_rounded,
                iconColor: const Color(0xFFF59E0B),
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
    );
  }
}
