import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/app_theme.dart';
import '../../config/app_constants.dart';
import '../../models/hospital_model.dart';
import '../../services/hospital_service.dart';
import '../../widgets/call_button.dart';
import '../../widgets/verified_badge.dart';

final hospitalDetailProvider =
    FutureProvider.autoDispose.family<HospitalModel?, String>((ref, id) {
  return ref.watch(Provider((_) => HospitalService())).getHospitalById(id);
});

class HospitalDetailScreen extends ConsumerWidget {
  final String hospitalId;
  const HospitalDetailScreen({super.key, required this.hospitalId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final hospitalAsync = ref.watch(hospitalDetailProvider(hospitalId));

    return Scaffold(
      body: hospitalAsync.when(
        loading: () =>
            const Scaffold(body: Center(child: CircularProgressIndicator())),
        error: (e, _) => Scaffold(body: Center(child: Text('ত্রুটি: $e'))),
        data: (hospital) {
          if (hospital == null) {
            return const Scaffold(
                body: Center(child: Text('হাসপাতাল পাওয়া যায়নি')));
          }
          return _HospitalDetailContent(hospital: hospital);
        },
      ),
    );
  }
}

class _HospitalDetailContent extends StatelessWidget {
  final HospitalModel hospital;
  const _HospitalDetailContent({required this.hospital});

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          expandedHeight: 200,
          pinned: true,
          backgroundColor: AppTheme.primaryColor,
          flexibleSpace: FlexibleSpaceBar(
            background: hospital.imageUrl.isNotEmpty
                ? Image.network(hospital.imageUrl, fit: BoxFit.cover)
                : Container(
                    color: AppTheme.accentColor.withOpacity(0.15),
                    child: const Icon(Icons.local_hospital_rounded,
                        size: 72, color: AppTheme.accentColor),
                  ),
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Name + verified
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Text(hospital.name,
                          style: Theme.of(context).textTheme.headlineLarge),
                    ),
                    if (hospital.isVerified) const VerifiedBadge(),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  AppConstants.hospitalTypes[hospital.type] ?? hospital.type,
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.copyWith(color: AppTheme.textSecondary),
                ),
                const SizedBox(height: 12),

                // Stats row
                Row(
                  children: [
                    _StatChip(
                        icon: Icons.star_rounded,
                        label: hospital.rating.toStringAsFixed(1),
                        color: const Color(0xFFFBBF24)),
                    const SizedBox(width: 8),
                    _StatChip(
                        icon: Icons.bed_rounded,
                        label: '${hospital.totalBeds} শয্যা',
                        color: AppTheme.accentColor),
                    const SizedBox(width: 8),
                    if (hospital.emergencyAvailable)
                      _StatChip(
                          icon: Icons.emergency_rounded,
                          label: 'জরুরি',
                          color: AppTheme.secondaryColor),
                    if (hospital.isOpen24Hours) ...[
                      const SizedBox(width: 8),
                      _StatChip(
                          icon: Icons.access_time_rounded,
                          label: '২৪ ঘণ্টা',
                          color: AppTheme.successColor),
                    ],
                  ],
                ),
                const SizedBox(height: 16),
                const Divider(),

                // Address
                _InfoRow(
                    icon: Icons.location_on_rounded,
                    text: hospital.address),
                const SizedBox(height: 12),

                // Specialties
                if (hospital.specialties.isNotEmpty) ...[
                  Text('বিশেষজ্ঞ সেবা',
                      style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: hospital.specialties
                        .map((s) => Chip(
                              label: Text(
                                  AppConstants.specialties[s] ?? s,
                                  style: const TextStyle(fontSize: 12)),
                              backgroundColor:
                                  AppTheme.primaryColor.withOpacity(0.08),
                              side: BorderSide.none,
                            ))
                        .toList(),
                  ),
                  const SizedBox(height: 16),
                ],

                // Phone numbers
                Text('যোগাযোগ',
                    style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: 10),
                ...hospital.phone.map((p) => Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: CallButton(phone: p, label: p, expanded: true),
                    )),
                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _StatChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _StatChip(
      {required this.icon, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 4),
          Text(label,
              style: TextStyle(
                  fontSize: 12, color: color, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String text;
  const _InfoRow({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: AppTheme.textSecondary),
        const SizedBox(width: 8),
        Expanded(
          child: Text(text,
              style: Theme.of(context)
                  .textTheme
                  .bodyMedium
                  ?.copyWith(color: AppTheme.textSecondary)),
        ),
      ],
    );
  }
}
