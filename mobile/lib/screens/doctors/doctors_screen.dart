import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../config/app_theme.dart';
import '../../config/app_constants.dart';
import '../../models/doctor_model.dart';
import '../../widgets/verified_badge.dart';

final _selectedSpecialtyProvider = StateProvider<String>((_) => '');

final doctorsStreamProvider =
    StreamProvider.autoDispose.family<List<DoctorModel>, String>((ref, specialty) {
  // Simple query — no orderBy to avoid index errors. Filter client-side.
  return FirebaseFirestore.instance
      .collection(AppConstants.colDoctors)
      .limit(200)
      .snapshots()
      .map((snap) {
    var list = snap.docs
        .map((doc) => DoctorModel.fromFirestore(doc))
        .toList();
    if (specialty.isNotEmpty) {
      list = list.where((d) => d.specialty == specialty).toList();
    }
    list.sort((a, b) => a.name.compareTo(b.name));
    return list;
  });
});

class DoctorsScreen extends ConsumerWidget {
  const DoctorsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedSpecialty = ref.watch(_selectedSpecialtyProvider);
    final doctorsAsync = ref.watch(doctorsStreamProvider(selectedSpecialty));

    return Scaffold(
      appBar: AppBar(
        title: const Text('বিশেষজ্ঞ ডাক্তার'),
        actions: [
          IconButton(
              icon: const Icon(Icons.search_rounded), onPressed: () {}),
        ],
      ),
      body: Column(
        children: [
          // Specialty filter
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
                    label: const Text('সব'),
                    selected: selectedSpecialty.isEmpty,
                    onSelected: (_) => ref
                        .read(_selectedSpecialtyProvider.notifier)
                        .state = '',
                    selectedColor: AppTheme.primaryColor.withOpacity(0.15),
                    checkmarkColor: AppTheme.primaryColor,
                  ),
                ),
                ...AppConstants.specialties.entries.map((e) {
                  final isSelected = selectedSpecialty == e.key;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: Text(e.value),
                      selected: isSelected,
                      onSelected: (_) => ref
                          .read(_selectedSpecialtyProvider.notifier)
                          .state = e.key,
                      selectedColor: AppTheme.primaryColor.withOpacity(0.15),
                      checkmarkColor: AppTheme.primaryColor,
                      labelStyle: TextStyle(
                          fontSize: 12,
                          color: isSelected
                              ? AppTheme.primaryColor
                              : AppTheme.textSecondary),
                    ),
                  );
                }),
              ],
            ),
          ),

          // Doctor list
          Expanded(
            child: doctorsAsync.when(
              loading: () =>
                  const Center(child: CircularProgressIndicator()),
              error: (e, _) =>
                  Center(child: Text('ত্রুটি হয়েছে: $e')),
              data: (doctors) {
                if (doctors.isEmpty) {
                  return const Center(
                      child: Text('কোনো ডাক্তার পাওয়া যায়নি'));
                }
                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: doctors.length,
                  itemBuilder: (_, i) => DoctorCard(
                    doctor: doctors[i],
                    onTap: () => context.push('/doctors/${doctors[i].id}'),
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

class DoctorCard extends StatelessWidget {
  final DoctorModel doctor;
  final VoidCallback onTap;
  const DoctorCard({super.key, required this.doctor, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final specialtyName =
        AppConstants.specialties[doctor.specialty] ?? doctor.specialty;

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
            // Avatar
            CircleAvatar(
              radius: 28,
              backgroundColor: const Color(0xFF7C3AED).withOpacity(0.1),
              backgroundImage: doctor.imageUrl.isNotEmpty
                  ? NetworkImage(doctor.imageUrl)
                  : null,
              child: doctor.imageUrl.isEmpty
                  ? const Icon(Icons.person_rounded,
                      color: Color(0xFF7C3AED), size: 28)
                  : null,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(doctor.name,
                            style: Theme.of(context)
                                .textTheme
                                .headlineSmall
                                ?.copyWith(fontSize: 15)),
                      ),
                      if (doctor.isVerified) const VerifiedBadge(),
                    ],
                  ),
                  const SizedBox(height: 3),
                  Text(specialtyName,
                      style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFF7C3AED),
                          fontWeight: FontWeight.w600)),
                  const SizedBox(height: 3),
                  if (doctor.qualifications.isNotEmpty)
                    Text(
                      doctor.qualifications.join(', '),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                          fontSize: 11, color: AppTheme.textSecondary),
                    ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      const Icon(Icons.local_hospital_outlined,
                          size: 12, color: AppTheme.textSecondary),
                      const SizedBox(width: 3),
                      Expanded(
                        child: Text(doctor.hospitalName,
                            style: const TextStyle(
                                fontSize: 11, color: AppTheme.textSecondary),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.access_time_rounded,
                          size: 12, color: AppTheme.textSecondary),
                      const SizedBox(width: 3),
                      Expanded(
                        child: Text(
                          doctor.visitingHours,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                              fontSize: 11, color: AppTheme.textSecondary),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text('ভিজিট: ৳${doctor.visitFee}',
                          style: const TextStyle(
                              fontSize: 12,
                              color: AppTheme.primaryColor,
                              fontWeight: FontWeight.w600)),
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
