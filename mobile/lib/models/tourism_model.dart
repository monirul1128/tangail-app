import 'package:cloud_firestore/cloud_firestore.dart';

class TourismModel {
  final String id;
  final String name;
  final String description;
  final String category;
  final String imageUrl;
  final String address;
  final String upazilaId;
  final String openingHours;
  final String entryFee;
  final GeoPoint? location;

  const TourismModel({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    required this.imageUrl,
    required this.address,
    required this.upazilaId,
    required this.openingHours,
    required this.entryFee,
    this.location,
  });

  factory TourismModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return TourismModel(
      id: doc.id,
      name: data['name'] ?? '',
      description: data['description'] ?? '',
      category: data['category'] ?? '',
      imageUrl: data['imageUrl'] ?? '',
      address: data['address'] ?? '',
      upazilaId: data['upazilaId'] ?? '',
      openingHours: data['openingHours'] ?? '',
      entryFee: data['entryFee'] ?? '',
      location: data['location'] as GeoPoint?,
    );
  }

  Map<String, dynamic> toMap() => {
        'name': name,
        'description': description,
        'category': category,
        'imageUrl': imageUrl,
        'address': address,
        'upazilaId': upazilaId,
        'openingHours': openingHours,
        'entryFee': entryFee,
        'location': location,
        'updatedAt': FieldValue.serverTimestamp(),
      };
}
