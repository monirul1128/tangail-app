import 'package:cloud_firestore/cloud_firestore.dart';

class NotablePersonModel {
  final String id;
  final String name;
  final String nameEn;
  final String designation;
  final String bio;
  final String imageUrl;
  final String category;
  final int birthYear;

  const NotablePersonModel({
    required this.id,
    required this.name,
    required this.nameEn,
    required this.designation,
    required this.bio,
    required this.imageUrl,
    required this.category,
    required this.birthYear,
  });

  factory NotablePersonModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return NotablePersonModel(
      id: doc.id,
      name: data['name'] ?? '',
      nameEn: data['nameEn'] ?? '',
      designation: data['designation'] ?? '',
      bio: data['bio'] ?? '',
      imageUrl: data['imageUrl'] ?? '',
      category: data['category'] ?? '',
      birthYear: data['birthYear'] ?? 0,
    );
  }

  Map<String, dynamic> toMap() => {
        'name': name,
        'nameEn': nameEn,
        'designation': designation,
        'bio': bio,
        'imageUrl': imageUrl,
        'category': category,
        'birthYear': birthYear,
        'updatedAt': FieldValue.serverTimestamp(),
      };
}
