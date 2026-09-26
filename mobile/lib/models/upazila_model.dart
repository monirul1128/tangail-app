import 'package:cloud_firestore/cloud_firestore.dart';

class UpazilaModel {
  final String id;
  final String name;
  final String nameEn;
  final int sortOrder;

  const UpazilaModel({
    required this.id,
    required this.name,
    required this.nameEn,
    required this.sortOrder,
  });

  factory UpazilaModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return UpazilaModel(
      id: doc.id,
      name: data['name'] ?? '',
      nameEn: data['nameEn'] ?? '',
      sortOrder: data['sortOrder'] ?? 99,
    );
  }

  Map<String, dynamic> toMap() => {
        'name': name,
        'nameEn': nameEn,
        'sortOrder': sortOrder,
      };
}
