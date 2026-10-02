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
    final data = doc.data() as Map<String, dynamic>? ?? {};

    // phone field can be a List, a String, or missing
    List<String> parsePhone(dynamic raw) {
      if (raw == null) return [];
      if (raw is List) return raw.map((e) => e.toString()).toList();
      if (raw is String && raw.isNotEmpty) return [raw];
      return [];
    }

    return GenericServiceModel(
      id: doc.id,
      name: data['name'] as String? ?? data['title'] as String? ?? '',
      type: data['type'] as String? ?? data['category'] as String? ?? '',
      upazilaId: data['upazilaId'] as String? ?? '',
      address: data['address'] as String? ?? data['location'] as String? ?? '',
      phone: parsePhone(data['phone'] ?? data['phones'] ?? data['contact']),
      imageUrl: data['imageUrl'] as String? ?? data['image'] as String? ?? '',
      description: data['description'] as String? ?? data['details'] as String? ?? '',
      isVerified: data['isVerified'] as bool? ?? false,
      website: data['website'] as String? ?? data['url'] as String? ?? '',
    );
  }
}
