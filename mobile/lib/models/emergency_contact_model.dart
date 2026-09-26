import 'package:cloud_firestore/cloud_firestore.dart';

class EmergencyContactModel {
  final String id;
  final String title;
  final String titleEn;
  final String category;
  final List<String> phone;
  final String? upazilaId;
  final bool isNational;
  final int sortOrder;

  const EmergencyContactModel({
    required this.id,
    required this.title,
    required this.titleEn,
    required this.category,
    required this.phone,
    this.upazilaId,
    required this.isNational,
    required this.sortOrder,
  });

  factory EmergencyContactModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return EmergencyContactModel(
      id: doc.id,
      title: data['title'] ?? '',
      titleEn: data['titleEn'] ?? '',
      category: data['category'] ?? 'other',
      phone: List<String>.from(data['phone'] ?? []),
      upazilaId: data['upazilaId'],
      isNational: data['isNational'] ?? false,
      sortOrder: data['sortOrder'] ?? 99,
    );
  }
}
