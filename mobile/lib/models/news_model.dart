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
    final data = doc.data() as Map<String, dynamic>;
    return NewsModel(
      id: doc.id,
      title: data['title'] ?? '',
      titleEn: data['titleEn'] ?? '',
      body: data['body'] ?? '',
      category: data['category'] ?? 'general',
      imageUrl: data['imageUrl'] ?? '',
      source: data['source'] ?? '',
      isNotice: data['isNotice'] ?? false,
      publishedAt: data['publishedAt'] != null
          ? (data['publishedAt'] as Timestamp).toDate()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() => {
        'title': title,
        'titleEn': titleEn,
        'body': body,
        'category': category,
        'imageUrl': imageUrl,
        'source': source,
        'isNotice': isNotice,
        'publishedAt': Timestamp.fromDate(publishedAt),
        'createdAt': FieldValue.serverTimestamp(),
      };
}
