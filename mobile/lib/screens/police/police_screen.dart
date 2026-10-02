import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_phone_direct_caller/flutter_phone_direct_caller.dart';
import '../../config/app_constants.dart';
import '../../models/generic_service_model.dart';
import '../../services/generic_service_service.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/empty_state.dart';

final _policeServiceProvider = Provider((_) => GenericServiceService());

final policeStreamProvider =
    StreamProvider.autoDispose<List<GenericServiceModel>>((ref) {
  final service = ref.watch(_policeServiceProvider);
  return service.getItems(AppConstants.colPoliceStations);
});

class PoliceScreen extends ConsumerWidget {
  const PoliceScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final itemsAsync = ref.watch(policeStreamProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('পুলিশ স্টেশন')),
      body: Column(
        children: [
          // Prominent 999 helpline button
          Container(
            margin: const EdgeInsets.all(16),
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () async {
                await FlutterPhoneDirectCaller.callNumber(
                    AppConstants.nationalEmergency);
              },
              icon: const Icon(Icons.local_police_rounded),
              label: const Text('জাতীয় পুলিশ হেল্পলাইন: ৯৯৯'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                ref.invalidate(policeStreamProvider);
              },
              child: itemsAsync.when(
                loading: () => const ShimmerList(itemCount: 8),
                error: (e, _) => EmptyState(
                  icon: Icons.error_outline_rounded,
                  message: 'ত্রুটি হয়েছে\nআবার চেষ্টা করুন',
                  onRetry: () => ref.invalidate(policeStreamProvider),
                ),
                data: (items) {
                  if (items.isEmpty) {
                    return const EmptyState(
                      icon: Icons.local_police_rounded,
                      message: 'কোনো পুলিশ স্টেশন পাওয়া যায়নি',
                    );
                  }
                  return ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    itemCount: items.length,
                    itemBuilder: (_, i) => InfoCard(
                      icon: Icons.local_police_rounded,
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
