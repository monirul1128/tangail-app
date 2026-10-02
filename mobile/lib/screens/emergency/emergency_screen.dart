import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../config/app_theme.dart';
import '../../config/app_constants.dart';
import '../../models/emergency_contact_model.dart';
import '../../widgets/call_button.dart';

final emergencyContactsProvider =
    StreamProvider.autoDispose<List<EmergencyContactModel>>((ref) {
  return FirebaseFirestore.instance
      .collection(AppConstants.colEmergencyContacts)
      .orderBy('sortOrder')
      .snapshots()
      .map((snap) => snap.docs
          .map((doc) => EmergencyContactModel.fromFirestore(doc))
          .toList());
});

class EmergencyScreen extends ConsumerWidget {
  const EmergencyScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final contactsAsync = ref.watch(emergencyContactsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('জরুরি নম্বরসমূহ'),
        backgroundColor: AppTheme.secondaryColor,
      ),
      body: Column(
        children: [
          // Big 999 button
          Container(
            width: double.infinity,
            margin: const EdgeInsets.all(16),
            child: ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.emergency_rounded, size: 28),
              label: const Column(
                children: [
                  Text('জাতীয় জরুরি সেবা',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                  Text('999', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900)),
                ],
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.secondaryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 20),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16)),
              ),
            ),
          ),

          // Contacts list
          Expanded(
            child: contactsAsync.when(
              loading: () =>
                  const Center(child: CircularProgressIndicator()),
              error: (e, _) =>
                  Center(child: Text('ত্রুটি হয়েছে: $e')),
              data: (contacts) {
                return ListView.builder(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
                  itemCount: contacts.length,
                  itemBuilder: (_, i) =>
                      _EmergencyContactCard(contact: contacts[i]),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _EmergencyContactCard extends StatelessWidget {
  final EmergencyContactModel contact;
  const _EmergencyContactCard({required this.contact});

  static const _categoryColors = {
    'fire': Color(0xFFEF4444),
    'police': Color(0xFF1D4ED8),
    'ambulance': Color(0xFFD97706),
    'hospital': Color(0xFF0066CC),
    'hotline': Color(0xFF059669),
    'other': Color(0xFF6B7280),
  };

  static const _categoryIcons = {
    'fire': Icons.local_fire_department_rounded,
    'police': Icons.local_police_rounded,
    'ambulance': Icons.airport_shuttle_rounded,
    'hospital': Icons.local_hospital_rounded,
    'hotline': Icons.support_agent_rounded,
    'other': Icons.phone_rounded,
  };

  @override
  Widget build(BuildContext context) {
    final color =
        _categoryColors[contact.category] ?? const Color(0xFF6B7280);
    final icon =
        _categoryIcons[contact.category] ?? Icons.phone_rounded;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 6,
              offset: const Offset(0, 2))
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(contact.title,
                    style: Theme.of(context)
                        .textTheme
                        .headlineSmall
                        ?.copyWith(fontSize: 14)),
                const SizedBox(height: 3),
                Text(contact.phone.join(' / '),
                    style: TextStyle(
                        fontSize: 15,
                        color: color,
                        fontWeight: FontWeight.w700)),
              ],
            ),
          ),
          ...contact.phone
              .take(2)
              .map((p) => Padding(
                    padding: const EdgeInsets.only(left: 6),
                    child: CallButton(phone: p),
                  )),
        ],
      ),
    );
  }
}
