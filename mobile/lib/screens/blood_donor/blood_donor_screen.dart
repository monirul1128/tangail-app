import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_theme.dart';
import '../../config/app_constants.dart';
import '../../models/blood_donor_model.dart';
import '../../services/blood_donor_service.dart';
import '../../widgets/call_button.dart';

final _selectedBloodGroupProvider = StateProvider<String>((_) => '');
final _selectedUpazilaBloodProvider = StateProvider<String>((_) => '');

final bloodDonorsProvider =
    StreamProvider.autoDispose.family<List<BloodDonorModel>, Map<String, String>>(
        (ref, filters) {
  return BloodDonorService().getDonors(
    bloodGroup: filters['bloodGroup'],
    upazilaId: filters['upazilaId'],
  );
});

class BloodDonorScreen extends ConsumerWidget {
  const BloodDonorScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedGroup = ref.watch(_selectedBloodGroupProvider);
    final selectedUpazila = ref.watch(_selectedUpazilaBloodProvider);

    final donorsAsync = ref.watch(bloodDonorsProvider({
      'bloodGroup': selectedGroup,
      'upazilaId': selectedUpazila,
    }));

    return Scaffold(
      appBar: AppBar(title: const Text('রক্তদাতা খুঁজুন')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/register-donor'),
        backgroundColor: AppTheme.secondaryColor,
        icon: const Icon(Icons.favorite_rounded, color: Colors.white),
        label: const Text('ডোনার হোন',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
      ),
      body: Column(
        children: [
          // Header banner
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppTheme.secondaryColor,
                  AppTheme.secondaryColor.withRed(180)
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                const Icon(Icons.water_drop_rounded,
                    color: Colors.white, size: 40),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('জরুরি রক্ত প্রয়োজন?',
                          style: Theme.of(context)
                              .textTheme
                              .headlineSmall
                              ?.copyWith(color: Colors.white)),
                      const SizedBox(height: 4),
                      Text('নিকটস্থ রক্তদাতা খুঁজুন',
                          style: Theme.of(context)
                              .textTheme
                              .bodySmall
                              ?.copyWith(color: Colors.white70)),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Blood group filter
          SizedBox(
            height: 50,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              children: [
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: const Text('সব গ্রুপ'),
                    selected: selectedGroup.isEmpty,
                    onSelected: (_) => ref
                        .read(_selectedBloodGroupProvider.notifier)
                        .state = '',
                    selectedColor: AppTheme.secondaryColor.withOpacity(0.15),
                    checkmarkColor: AppTheme.secondaryColor,
                  ),
                ),
                ...AppConstants.bloodGroups.map((bg) {
                  final isSelected = selectedGroup == bg;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: Text(bg,
                          style: TextStyle(
                              fontWeight: FontWeight.w700,
                              color: isSelected
                                  ? AppTheme.secondaryColor
                                  : AppTheme.textSecondary)),
                      selected: isSelected,
                      onSelected: (_) => ref
                          .read(_selectedBloodGroupProvider.notifier)
                          .state = bg,
                      selectedColor:
                          AppTheme.secondaryColor.withOpacity(0.15),
                      checkmarkColor: AppTheme.secondaryColor,
                    ),
                  );
                }),
              ],
            ),
          ),

          // Donor list
          Expanded(
            child: donorsAsync.when(
              loading: () =>
                  const Center(child: CircularProgressIndicator()),
              error: (e, _) =>
                  Center(child: Text('ত্রুটি হয়েছে: $e')),
              data: (donors) {
                if (donors.isEmpty) {
                  return const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.water_drop_outlined,
                            size: 60, color: AppTheme.textSecondary),
                        SizedBox(height: 12),
                        Text('কোনো ডোনার পাওয়া যায়নি',
                            style:
                                TextStyle(color: AppTheme.textSecondary)),
                      ],
                    ),
                  );
                }
                return ListView.builder(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
                  itemCount: donors.length,
                  itemBuilder: (_, i) => _DonorCard(donor: donors[i]),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _DonorCard extends StatelessWidget {
  final BloodDonorModel donor;
  const _DonorCard({required this.donor});

  @override
  Widget build(BuildContext context) {
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
      child: Row(
        children: [
          // Blood group badge
          Container(
            width: 54,
            height: 54,
            decoration: BoxDecoration(
              color: AppTheme.secondaryColor,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(donor.bloodGroup,
                  style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w800,
                      fontSize: 16)),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(donor.name,
                    style: Theme.of(context)
                        .textTheme
                        .headlineSmall
                        ?.copyWith(fontSize: 15)),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.location_on_rounded,
                        size: 13, color: AppTheme.textSecondary),
                    const SizedBox(width: 3),
                    Text(donor.address,
                        style: const TextStyle(
                            fontSize: 12, color: AppTheme.textSecondary)),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text('মোট দান: ${donor.totalDonations} বার',
                        style: const TextStyle(
                            fontSize: 11, color: AppTheme.textSecondary)),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: (donor.isAvailable
                                ? AppTheme.successColor
                                : AppTheme.textSecondary)
                            .withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                          donor.isAvailable ? 'উপলব্ধ' : 'অনুপলব্ধ',
                          style: TextStyle(
                              fontSize: 11,
                              color: donor.isAvailable
                                  ? AppTheme.successColor
                                  : AppTheme.textSecondary,
                              fontWeight: FontWeight.w600)),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 10),
          CallButton(phone: donor.phone),
        ],
      ),
    );
  }
}
