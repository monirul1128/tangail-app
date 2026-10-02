import 'package:cloud_firestore/cloud_firestore.dart';

class GenericServiceModel {
  final String id;
  final String name;
  final String type;
  final String upazilaId;
  final String address;
  final List<String> phone;
  final String imageUrl;
  final String description;
  final bool isVerified;
  final String website;

  const GenericServiceModel({
    required this.id,
    required this.name,
    required this.type,
    required this.upazilaId,
    required this.address,
    required this.phone,
    required this.imageUrl,
    required this.description,
    required this.isVerified,
    required this.website,
  });

  factory GenericServiceModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return GenericServiceModel(
      id: doc.id,
      name: data['name'] ?? '',
      type: data['type'] ?? '',
      upazilaId: data['upazilaId'] ?? '',
      address: data['address'] ?? '',
      phone: List<String>.from(data['phone'] ?? []),
      imageUrl: data['imageUrl'] ?? '',
      description: data['description'] ?? '',
      isVerified: data['isVerified'] ?? false,
      website: data['website'] ?? '',
    );
  }

  Map<String, dynamic> toMap() => {
        'name': name,
        'type': type,
        'upazilaId': upazilaId,
        'address': address,
        'phone': phone,
        'imageUrl': imageUrl,
        'description': description,
        'isVerified': isVerified,
        'website': website,
        'updatedAt': FieldValue.serverTimestamp(),
      };
}
