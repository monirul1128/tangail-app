import 'package:cloud_firestore/cloud_firestore.dart';

class HospitalModel {
  final String id;
  final String name;
  final String nameEn;
  final String type;
  final String upazilaId;
  final String address;
  final List<String> phone;
  final List<String> specialties;
  final int totalBeds;
  final bool emergencyAvailable;
  final bool isOpen24Hours;
  final bool isVerified;
  final double rating;
  final int reviewCount;
  final String imageUrl;
  final GeoPoint? location;

  const HospitalModel({
    required this.id,
    required this.name,
    required this.nameEn,
    required this.type,
    required this.upazilaId,
    required this.address,
    required this.phone,
    required this.specialties,
    required this.totalBeds,
    required this.emergencyAvailable,
    required this.isOpen24Hours,
    required this.isVerified,
    required this.rating,
    required this.reviewCount,
    required this.imageUrl,
    this.location,
  });

  factory HospitalModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return HospitalModel(
      id: doc.id,
      name: data['name'] ?? '',
      nameEn: data['nameEn'] ?? '',
      type: data['type'] ?? 'government',
      upazilaId: data['upazilaId'] ?? '',
      address: data['address'] ?? '',
      phone: List<String>.from(data['phone'] ?? []),
      specialties: List<String>.from(data['specialties'] ?? []),
      totalBeds: data['totalBeds'] ?? 0,
      emergencyAvailable: data['emergencyAvailable'] ?? false,
      isOpen24Hours: data['isOpen24Hours'] ?? false,
      isVerified: data['isVerified'] ?? false,
      rating: (data['rating'] ?? 0.0).toDouble(),
      reviewCount: data['reviewCount'] ?? 0,
      imageUrl: data['imageUrl'] ?? '',
      location: data['location'] as GeoPoint?,
    );
  }

  Map<String, dynamic> toMap() => {
        'name': name,
        'nameEn': nameEn,
        'type': type,
        'upazilaId': upazilaId,
        'address': address,
        'phone': phone,
        'specialties': specialties,
        'totalBeds': totalBeds,
        'emergencyAvailable': emergencyAvailable,
        'isOpen24Hours': isOpen24Hours,
        'isVerified': isVerified,
        'rating': rating,
        'reviewCount': reviewCount,
        'imageUrl': imageUrl,
        'location': location,
        'updatedAt': FieldValue.serverTimestamp(),
      };
}
