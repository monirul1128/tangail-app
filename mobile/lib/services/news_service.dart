import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/news_model.dart';
import '../config/app_constants.dart';

class NewsService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  /// Get latest news, optionally filtered by category
  Stream<List<NewsModel>> getNews({String? category, int limit = 20}) {
    Query query = _db
        .collection(AppConstants.colNews)
        .orderBy('publishedAt', descending: true)
        .limit(limit);

    if (category != null && category.isNotEmpty) {
      query = query.where('category', isEqualTo: category);
    }

    return query.snapshots().map(
        (snap) => snap.docs.map((doc) => NewsModel.fromFirestore(doc)).toList());
  }

  /// Get notices only
  Stream<List<NewsModel>> getNotices({int limit = 10}) {
    return _db
        .collection(AppConstants.colNews)
        .where('isNotice', isEqualTo: true)
        .orderBy('publishedAt', descending: true)
        .limit(limit)
        .snapshots()
        .map((snap) =>
            snap.docs.map((doc) => NewsModel.fromFirestore(doc)).toList());
  }

  /// Get a single news article
  Future<NewsModel?> getNewsById(String id) async {
    final doc = await _db.collection(AppConstants.colNews).doc(id).get();
    if (!doc.exists) return null;
    return NewsModel.fromFirestore(doc);
  }
}
