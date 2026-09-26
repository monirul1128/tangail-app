import 'package:cloud_firestore/cloud_firestore.dart';

class AmbulanceModel {
  final String id;
  final String name;
  final String ownerName;
  final String phone;
  final String alternatePhone;
  final String upazilaId;
  final String type;
  final bool isAvailable;
  final bool isAvailable24Hours;
  final int rentalCostPerKm;
  final bool isVerified;

  const AmbulanceModel({
    required this.id,
    required this.name,
    required this.ownerName,
    required this.phone,
    required this.alternatePhone,
    required this.upazilaId,
    required this.type,
    required this.isAvailable,
    required this.isAvailable24Hours,
    required this.rentalCostPerKm,
    required this.isVerified,
  });

  factory AmbulanceModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return AmbulanceModel(
      id: doc.id,
      name: data['name'] ?? '',
      ownerName: data['ownerName'] ?? '',
      phone: data['phone'] ?? '',
      alternatePhone: data['alternatePhone'] ?? '',
      upazilaId: data['upazilaId'] ?? '',
      type: data['type'] ?? 'non_ac',
      isAvailable: data['isAvailable'] ?? true,
      isAvailable24Hours: data['isAvailable24Hours'] ?? false,
      rentalCostPerKm: data['rentalCostPerKm'] ?? 0,
      isVerified: data['isVerified'] ?? false,
    );
  }

  Map<String, dynamic> toMap() => {
        'name': name,
        'ownerName': ownerName,
        'phone': phone,
        'alternatePhone': alternatePhone,
        'upazilaId': upazilaId,
        'type': type,
        'isAvailable': isAvailable,
        'isAvailable24Hours': isAvailable24Hours,
        'rentalCostPerKm': rentalCostPerKm,
        'isVerified': isVerified,
        'updatedAt': FieldValue.serverTimestamp(),
      };
}
