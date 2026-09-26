import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_theme.dart';
import '../../config/app_constants.dart';
import '../../models/hospital_model.dart';
import '../../services/hospital_service.dart';
import '../../widgets/verified_badge.dart';

final _hospitalServiceProvider = Provider((_) => HospitalService());
final _selectedUpazilaProvider = StateProvider<String>((_) => '');
final _selectedTypeProvider = StateProvider<String>((_) => '');

final hospitalsStreamProvider = StreamProvider.autoDispose
    .family<List<HospitalModel>, Map<String, String>>((ref, filters) {
  final service = ref.watch(_hospitalServiceProvider);
  return service.getHospitals(
    upazilaId: filters['upazilaId'],
  );
});

class HospitalsScreen extends ConsumerWidget {
  const HospitalsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedUpazila = ref.watch(_selectedUpazilaProvider);
    final hospitalsAsync = ref.watch(
        hospitalsStreamProvider({'upazilaId': selectedUpazila}));

    return Scaffold(
      appBar: AppBar(
        title: const Text('হাসপাতাল'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search_rounded),
            onPressed: () {
              // TODO: implement search
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Upazila filter
          _UpazilaFilterBar(
            selected: selectedUpazila,
            onSelected: (v) =>
                ref.read(_selectedUpazilaProvider.notifier).state = v,
          ),

          // Hospital type chips
          _TypeFilterBar(
            selected: ref.watch(_selectedTypeProvider),
            onSelected: (v) =>
                ref.read(_selectedTypeProvider.notifier).state = v,
          ),

          // List
          Expanded(
            child: hospitalsAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) =>
                  Center(child: Text('ত্রুটি হয়েছে: $e')),
              data: (hospitals) {
                final typeFilter = ref.watch(_selectedTypeProvider);
                final filtered = typeFilter.isEmpty
                    ? hospitals
                    : hospitals
                        .where((h) => h.type == typeFilter)
                        .toList();

                if (filtered.isEmpty) {
                  return const Center(
                      child: Text('কোনো হাসপাতাল পাওয়া যায়নি'));
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: filtered.length,
                  itemBuilder: (_, i) => HospitalCard(
                    hospital: filtered[i],
                    onTap: () =>
                        context.push('/hospitals/${filtered[i].id}'),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _UpazilaFilterBar extends StatelessWidget {
  final String selected;
  final ValueChanged<String> onSelected;

  const _UpazilaFilterBar(
      {required this.selected, required this.onSelected});

  static const upazilas = [
    ('', 'সব উপজেলা'),
    ('tangail_sadar', 'সদর'),
    ('mirzapur', 'মির্জাপুর'),
    ('madhupur', 'মধুপুর'),
    ('ghatail', 'ঘাটাইল'),
    ('kalihati', 'কালিহাতী'),
    ('basail', 'বাসাইল'),
    ('bhuapur', 'ভূয়াপুর'),
    ('delduar', 'দেলদুয়ার'),
    ('dhanbari', 'ধনবাড়ী'),
    ('gopalpur', 'গোপালপুর'),
    ('nagarpur', 'নাগরপুর'),
    ('sakhipur', 'সখিপুর'),
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        itemCount: upazilas.length,
        itemBuilder: (_, i) {
          final (id, label) = upazilas[i];
          final isSelected = selected == id;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: FilterChip(
              label: Text(label),
              selected: isSelected,
              onSelected: (_) => onSelected(id),
              selectedColor: AppTheme.primaryColor.withOpacity(0.15),
              checkmarkColor: AppTheme.primaryColor,
              labelStyle: TextStyle(
                  color: isSelected ? AppTheme.primaryColor : AppTheme.textSecondary,
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal),
            ),
          );
        },
      ),
    );
  }
}

class _TypeFilterBar extends StatelessWidget {
  final String selected;
  final ValueChanged<String> onSelected;

  const _TypeFilterBar({required this.selected, required this.onSelected});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        children: [
          ('', 'সব'),
          ...AppConstants.hospitalTypes.entries
              .map((e) => (e.key, e.value))
        ].map((item) {
          final (id, label) = item;
          final isSelected = selected == id;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: FilterChip(
              label: Text(label),
              selected: isSelected,
              onSelected: (_) => onSelected(id),
              selectedColor: AppTheme.accentColor.withOpacity(0.15),
              checkmarkColor: AppTheme.accentColor,
              labelStyle: TextStyle(
                  color: isSelected ? AppTheme.accentColor : AppTheme.textSecondary,
                  fontSize: 12),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class HospitalCard extends StatelessWidget {
  final HospitalModel hospital;
  final VoidCallback onTap;

  const HospitalCard({super.key, required this.hospital, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final typeName =
        AppConstants.hospitalTypes[hospital.type] ?? hospital.type;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withOpacity(0.06),
                blurRadius: 8,
                offset: const Offset(0, 2))
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: AppTheme.accentColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: hospital.imageUrl.isNotEmpty
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.network(hospital.imageUrl, fit: BoxFit.cover))
                  : const Icon(Icons.local_hospital_rounded,
                      color: AppTheme.accentColor, size: 28),
            ),
            const SizedBox(width: 12),
            // Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(hospital.name,
                            style: Theme.of(context)
                                .textTheme
                                .headlineSmall
                                ?.copyWith(fontSize: 15),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis),
                      ),
                      if (hospital.isVerified) const VerifiedBadge(),
                    ],
                  ),
                  const SizedBox(height: 4),
                  // Type badge
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppTheme.backgroundColor,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(typeName,
                        style: const TextStyle(
                            fontSize: 11, color: AppTheme.textSecondary)),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      const Icon(Icons.location_on_rounded,
                          size: 13, color: AppTheme.textSecondary),
                      const SizedBox(width: 3),
                      Expanded(
                        child: Text(hospital.address,
                            style: Theme.of(context)
                                .textTheme
                                .bodySmall
                                ?.copyWith(color: AppTheme.textSecondary),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      // Rating
                      const Icon(Icons.star_rounded,
                          size: 14, color: Color(0xFFFBBF24)),
                      const SizedBox(width: 2),
                      Text(hospital.rating.toStringAsFixed(1),
                          style: const TextStyle(
                              fontSize: 12, fontWeight: FontWeight.w600)),
                      const SizedBox(width: 4),
                      Text('(${hospital.reviewCount})',
                          style: const TextStyle(
                              fontSize: 11, color: AppTheme.textSecondary)),
                      const Spacer(),
                      if (hospital.isOpen24Hours)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppTheme.successColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text('২৪ ঘণ্টা',
                              style: TextStyle(
                                  fontSize: 11,
                                  color: AppTheme.successColor,
                                  fontWeight: FontWeight.w600)),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
