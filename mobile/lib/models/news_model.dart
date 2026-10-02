import 'package:cloud_firestore/cloud_firestore.dart';

class NewsModel {
  final String id;
  final String title;
  final String titleEn;
  final String body;
  final String category;
  final String imageUrl;
  final String source;
  final bool isNotice;
  final DateTime publishedAt;

  const NewsModel({
    required this.id,
    required this.title,
    required this.titleEn,
    required this.body,
    required this.category,
    required this.imageUrl,
    required this.source,
    required this.isNotice,
    required this.publishedAt,
  });

  factory NewsModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};

    DateTime parsedDate = DateTime.now();
    final raw = data['publishedAt'];
    if (raw is Timestamp) {
      parsedDate = raw.toDate();
    } else if (raw is String) {
      parsedDate = DateTime.tryParse(raw) ?? DateTime.now();
    }
    // also fallback to createdAt
    if (raw == null) {
      final created = data['createdAt'];
      if (created is Timestamp) parsedDate = created.toDate();
    }

    return NewsModel(
      id: doc.id,
      title: data['title'] as String? ?? '',
      titleEn: data['titleEn'] as String? ?? '',
      body: data['body'] as String? ?? '',
      category: data['category'] as String? ?? 'general',
      imageUrl: data['imageUrl'] as String? ?? '',
      source: data['source'] as String? ?? '',
      isNotice: data['isNotice'] as bool? ?? false,
      publishedAt: parsedDate,
    );
  }
}
