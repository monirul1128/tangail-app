import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_constants.dart';
import '../../models/emergency_contact_model.dart';
import '../../widgets/info_card.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/empty_state.dart';

final policeStreamProvider =
    StreamProvider.autoDispose<List<EmergencyContactModel>>((ref) {
  return FirebaseFirestore.instance
      .collection(AppConstants.colEmergencyContacts)
      .limit(100)
      .snapshots()
      .map((snap) {
    final list = snap.docs
        .map((doc) => EmergencyContactModel.fromFirestore(doc))
        .toList();
    // filter police category
    return list.where((c) => c.category == 'police').toList()
      ..sort((a, b) => a.sortOrder.compareTo(b.sortOrder));
  });
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
                final uri = Uri(scheme: 'tel', path: AppConstants.nationalEmergency);
                if (await canLaunchUrl(uri)) await launchUrl(uri);
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
                      message: 'কোনো পুলিশ তথ্য পাওয়া যায়নি',
                    );
                  }
                  return ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    itemCount: items.length,
                    itemBuilder: (_, i) => InfoCard(
                      icon: Icons.local_police_rounded,
                      iconColor: const Color(0xFF1D4ED8),
                      title: items[i].title,
                      subtitle: items[i].isNational ? 'জাতীয়' : '',
                      phones: items[i].phone,
                      isVerified: false,
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
