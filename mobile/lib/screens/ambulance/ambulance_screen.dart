import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../config/app_theme.dart';
import '../../config/app_constants.dart';
import '../../models/ambulance_model.dart';
import '../../widgets/call_button.dart';
import '../../widgets/verified_badge.dart';

final ambulanceStreamProvider =
    StreamProvider.autoDispose<List<AmbulanceModel>>((ref) {
  return FirebaseFirestore.instance
      .collection(AppConstants.colAmbulances)
      .where('isAvailable', isEqualTo: true)
      .snapshots()
      .map((snap) =>
          snap.docs.map((doc) => AmbulanceModel.fromFirestore(doc)).toList());
});

final _selectedAmbulanceTypeProvider = StateProvider<String>((_) => '');

class AmbulanceScreen extends ConsumerWidget {
  const AmbulanceScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ambulancesAsync = ref.watch(ambulanceStreamProvider);
    final selectedType = ref.watch(_selectedAmbulanceTypeProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('অ্যাম্বুলেন্স সার্ভিস')),
      body: Column(
        children: [
          // Emergency call banner
          Container(
            margin: const EdgeInsets.all(16),
            padding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: AppTheme.warningColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                  color: AppTheme.warningColor.withOpacity(0.4)),
            ),
            child: Row(
              children: [
                const Icon(Icons.airport_shuttle_rounded,
                    color: AppTheme.warningColor, size: 28),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('জরুরি অ্যাম্বুলেন্স?',
                          style: Theme.of(context)
                              .textTheme
                              .headlineSmall
                              ?.copyWith(color: AppTheme.warningColor)),
                      Text('জাতীয় হেল্পলাইন: 999',
                          style: Theme.of(context)
                              .textTheme
                              .bodySmall
                              ?.copyWith(color: AppTheme.textSecondary)),
                    ],
                  ),
                ),
                const CallButton(phone: '999', label: '৯৯৯'),
              ],
            ),
          ),

          // Type filter
          SizedBox(
            height: 46,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              children: [
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: const Text('সব'),
                    selected: selectedType.isEmpty,
                    onSelected: (_) => ref
                        .read(_selectedAmbulanceTypeProvider.notifier)
                        .state = '',
                    selectedColor:
                        AppTheme.warningColor.withOpacity(0.15),
                    checkmarkColor: AppTheme.warningColor,
                  ),
                ),
                ...AppConstants.ambulanceTypes.entries.map((e) {
                  final isSelected = selectedType == e.key;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: Text(e.value),
                      selected: isSelected,
                      onSelected: (_) => ref
                          .read(_selectedAmbulanceTypeProvider.notifier)
                          .state = e.key,
                      selectedColor:
                          AppTheme.warningColor.withOpacity(0.15),
                      checkmarkColor: AppTheme.warningColor,
                      labelStyle: TextStyle(
                          fontSize: 12,
                          color: isSelected
                              ? AppTheme.warningColor
                              : AppTheme.textSecondary),
                    ),
                  );
                }),
              ],
            ),
          ),

          // List
          Expanded(
            child: ambulancesAsync.when(
              loading: () =>
                  const Center(child: CircularProgressIndicator()),
              error: (e, _) =>
                  Center(child: Text('ত্রুটি হয়েছে: $e')),
              data: (ambulances) {
                final filtered = selectedType.isEmpty
                    ? ambulances
                    : ambulances
                        .where((a) => a.type == selectedType)
                        .toList();

                if (filtered.isEmpty) {
                  return const Center(
                      child: Text('কোনো অ্যাম্বুলেন্স পাওয়া যায়নি'));
                }
                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: filtered.length,
                  itemBuilder: (_, i) => _AmbulanceCard(ambulance: filtered[i]),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _AmbulanceCard extends StatelessWidget {
  final AmbulanceModel ambulance;
  const _AmbulanceCard({required this.ambulance});

  @override
  Widget build(BuildContext context) {
    final typeName =
        AppConstants.ambulanceTypes[ambulance.type] ?? ambulance.type;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 8,
              offset: const Offset(0, 2))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppTheme.warningColor.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.airport_shuttle_rounded,
                    color: AppTheme.warningColor, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(ambulance.name,
                              style: Theme.of(context)
                                  .textTheme
                                  .headlineSmall
                                  ?.copyWith(fontSize: 15)),
                        ),
                        if (ambulance.isVerified) const VerifiedBadge(),
                      ],
                    ),
                    const SizedBox(height: 3),
                    Text(typeName,
                        style: const TextStyle(
                            fontSize: 12,
                            color: AppTheme.warningColor,
                            fontWeight: FontWeight.w600)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              const Icon(Icons.person_outline_rounded,
                  size: 14, color: AppTheme.textSecondary),
              const SizedBox(width: 4),
              Text(ambulance.ownerName,
                  style: const TextStyle(
                      fontSize: 12, color: AppTheme.textSecondary)),
              const Spacer(),
              if (ambulance.isAvailable24Hours)
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppTheme.successColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text('২৪ ঘণ্টা',
                      style: TextStyle(
                          fontSize: 11,
                          color: AppTheme.successColor,
                          fontWeight: FontWeight.w600)),
                ),
            ],
          ),
          if (ambulance.rentalCostPerKm > 0) ...[
            const SizedBox(height: 4),
            Text('ভাড়া: ৳${ambulance.rentalCostPerKm}/কিমি',
                style: const TextStyle(
                    fontSize: 12, color: AppTheme.textSecondary)),
          ],
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: CallButton(
                    phone: ambulance.phone, label: ambulance.phone, expanded: true),
              ),
              if (ambulance.alternatePhone.isNotEmpty) ...[
                const SizedBox(width: 8),
                Expanded(
                  child: CallButton(
                      phone: ambulance.alternatePhone,
                      label: ambulance.alternatePhone,
                      expanded: true),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}
