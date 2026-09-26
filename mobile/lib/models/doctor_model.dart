import 'package:cloud_firestore/cloud_firestore.dart';

class DoctorModel {
  final String id;
  final String name;
  final String nameEn;
  final String specialty;
  final List<String> qualifications;
  final String hospitalId;
  final String hospitalName;
  final String upazilaId;
  final String chamberAddress;
  final String visitingHours;
  final String phone;
  final int visitFee;
  final bool isAvailable;
  final bool isVerified;
  final double rating;
  final int reviewCount;
  final String imageUrl;

  const DoctorModel({
    required this.id,
    required this.name,
    required this.nameEn,
    required this.specialty,
    required this.qualifications,
    required this.hospitalId,
    required this.hospitalName,
    required this.upazilaId,
    required this.chamberAddress,
    required this.visitingHours,
    required this.phone,
    required this.visitFee,
    required this.isAvailable,
    required this.isVerified,
    required this.rating,
    required this.reviewCount,
    required this.imageUrl,
  });

  factory DoctorModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return DoctorModel(
      id: doc.id,
      name: data['name'] ?? '',
      nameEn: data['nameEn'] ?? '',
      specialty: data['specialty'] ?? '',
      qualifications: List<String>.from(data['qualifications'] ?? []),
      hospitalId: data['hospitalId'] ?? '',
      hospitalName: data['hospitalName'] ?? '',
      upazilaId: data['upazilaId'] ?? '',
      chamberAddress: data['chamberAddress'] ?? '',
      visitingHours: data['visitingHours'] ?? '',
      phone: data['phone'] ?? '',
      visitFee: data['visitFee'] ?? 0,
      isAvailable: data['isAvailable'] ?? true,
      isVerified: data['isVerified'] ?? false,
      rating: (data['rating'] ?? 0.0).toDouble(),
      reviewCount: data['reviewCount'] ?? 0,
      imageUrl: data['imageUrl'] ?? '',
    );
  }

  Map<String, dynamic> toMap() => {
        'name': name,
        'nameEn': nameEn,
        'specialty': specialty,
        'qualifications': qualifications,
        'hospitalId': hospitalId,
        'hospitalName': hospitalName,
        'upazilaId': upazilaId,
        'chamberAddress': chamberAddress,
        'visitingHours': visitingHours,
        'phone': phone,
        'visitFee': visitFee,
        'isAvailable': isAvailable,
        'isVerified': isVerified,
        'rating': rating,
        'reviewCount': reviewCount,
        'imageUrl': imageUrl,
        'updatedAt': FieldValue.serverTimestamp(),
      };
}
