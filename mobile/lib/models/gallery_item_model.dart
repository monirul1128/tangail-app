import 'package:cloud_firestore/cloud_firestore.dart';

class GalleryItemModel {
  final String id;
  final String imageUrl;
  final String caption;
  final String category;
  final DateTime createdAt;

  const GalleryItemModel({
    required this.id,
    required this.imageUrl,
    required this.caption,
    required this.category,
    required this.createdAt,
  });

  factory GalleryItemModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    final Timestamp? ts = data['createdAt'] as Timestamp?;
    return GalleryItemModel(
      id: doc.id,
      imageUrl: data['imageUrl'] ?? '',
      caption: data['caption'] ?? '',
      category: data['category'] ?? '',
      createdAt: ts?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() => {
        'imageUrl': imageUrl,
        'caption': caption,
        'category': category,
        'createdAt': Timestamp.fromDate(createdAt),
      };
}
