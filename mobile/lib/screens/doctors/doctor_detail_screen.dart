import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../config/app_theme.dart';
import '../../config/app_constants.dart';
import '../../models/doctor_model.dart';
import '../../widgets/call_button.dart';
import '../../widgets/verified_badge.dart';

final doctorDetailProvider =
    FutureProvider.autoDispose.family<DoctorModel?, String>((ref, id) async {
  final doc = await FirebaseFirestore.instance
      .collection(AppConstants.colDoctors)
      .doc(id)
      .get();
  if (!doc.exists) return null;
  return DoctorModel.fromFirestore(doc);
});

class DoctorDetailScreen extends ConsumerWidget {
  final String doctorId;
  const DoctorDetailScreen({super.key, required this.doctorId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final doctorAsync = ref.watch(doctorDetailProvider(doctorId));

    return doctorAsync.when(
      loading: () =>
          const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (e, _) => Scaffold(body: Center(child: Text('ত্রুটি: $e'))),
      data: (doctor) {
        if (doctor == null) {
          return const Scaffold(
              body: Center(child: Text('ডাক্তার পাওয়া যায়নি')));
        }
        return _DoctorDetailContent(doctor: doctor);
      },
    );
  }
}

class _DoctorDetailContent extends StatelessWidget {
  final DoctorModel doctor;
  const _DoctorDetailContent({required this.doctor});

  @override
  Widget build(BuildContext context) {
    final specialtyName =
        AppConstants.specialties[doctor.specialty] ?? doctor.specialty;

    return Scaffold(
      appBar: AppBar(title: Text(doctor.name)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Doctor header card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                      color: Colors.black.withOpacity(0.06),
                      blurRadius: 10,
                      offset: const Offset(0, 3))
                ],
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor:
                        const Color(0xFF7C3AED).withOpacity(0.1),
                    backgroundImage: doctor.imageUrl.isNotEmpty
                        ? NetworkImage(doctor.imageUrl)
                        : null,
                    child: doctor.imageUrl.isEmpty
                        ? const Icon(Icons.person_rounded,
                            color: Color(0xFF7C3AED), size: 36)
                        : null,
                  ),
                  const SizedBox(width: 16),
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
                                      .headlineMedium),
                            ),
                            if (doctor.isVerified) const VerifiedBadge(),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(specialtyName,
                            style: const TextStyle(
                                color: Color(0xFF7C3AED),
                                fontWeight: FontWeight.w600,
                                fontSize: 14)),
                        const SizedBox(height: 4),
                        Text(doctor.qualifications.join(' | '),
                            style: const TextStyle(
                                fontSize: 12,
                                color: AppTheme.textSecondary)),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            const Icon(Icons.star_rounded,
                                size: 14, color: Color(0xFFFBBF24)),
                            const SizedBox(width: 3),
                            Text(
                                '${doctor.rating.toStringAsFixed(1)} (${doctor.reviewCount} রিভিউ)',
                                style: const TextStyle(fontSize: 12)),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Chamber info
            _SectionCard(
              title: 'চেম্বার তথ্য',
              children: [
                _InfoTile(
                    icon: Icons.local_hospital_rounded,
                    label: 'হাসপাতাল',
                    value: doctor.hospitalName),
                _InfoTile(
                    icon: Icons.location_on_rounded,
                    label: 'ঠিকানা',
                    value: doctor.chamberAddress),
                _InfoTile(
                    icon: Icons.access_time_rounded,
                    label: 'সময়',
                    value: doctor.visitingHours),
                _InfoTile(
                    icon: Icons.payments_rounded,
                    label: 'ভিজিট ফি',
                    value: '৳${doctor.visitFee}'),
              ],
            ),
            const SizedBox(height: 16),

            // Availability badge
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: (doctor.isAvailable
                        ? AppTheme.successColor
                        : AppTheme.errorColor)
                    .withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  Icon(
                    doctor.isAvailable
                        ? Icons.check_circle_rounded
                        : Icons.cancel_rounded,
                    color: doctor.isAvailable
                        ? AppTheme.successColor
                        : AppTheme.errorColor,
                    size: 18,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    doctor.isAvailable
                        ? 'বর্তমানে রোগী দেখছেন'
                        : 'এই মুহূর্তে উপলব্ধ নেই',
                    style: TextStyle(
                      color: doctor.isAvailable
                          ? AppTheme.successColor
                          : AppTheme.errorColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Call button
            CallButton(
                phone: doctor.phone,
                label: 'অ্যাপয়েন্টমেন্ট নিন',
                expanded: true),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final String title;
  final List<Widget> children;
  const _SectionCard({required this.title, required this.children});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
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
          Text(title, style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 12),
          ...children,
        ],
      ),
    );
  }
}

class _InfoTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  const _InfoTile(
      {required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: AppTheme.primaryColor),
          const SizedBox(width: 10),
          SizedBox(
            width: 80,
            child: Text(label,
                style: const TextStyle(
                    fontSize: 13, color: AppTheme.textSecondary)),
          ),
          Expanded(
            child: Text(value,
                style: const TextStyle(
                    fontSize: 13, fontWeight: FontWeight.w500)),
          ),
        ],
      ),
    );
  }
}
