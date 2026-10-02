import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/news_model.dart';
import '../config/app_constants.dart';

class NewsService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  Stream<List<NewsModel>> getNews({String? category, int limit = 40}) {
    // Simple query — no compound index needed
    final query = _db
        .collection(AppConstants.colNews)
        .limit(limit);

    return query.snapshots().map((snap) {
      var list = snap.docs
          .map((doc) => NewsModel.fromFirestore(doc))
          .toList();

      if (category != null && category.isNotEmpty) {
        list = list.where((n) => n.category == category).toList();
      }

      // Sort newest first client-side
      list.sort((a, b) => b.publishedAt.compareTo(a.publishedAt));
      return list;
    });
  }

  /// Notices only (isNotice == true)
  Stream<List<NewsModel>> getNotices({int limit = 10}) {
    return _db
        .collection(AppConstants.colNews)
        .limit(100) // fetch more, filter client-side
        .snapshots()
        .map((snap) {
      var list = snap.docs
          .map((doc) => NewsModel.fromFirestore(doc))
          .toList();

      list = list.where((n) => n.isNotice).toList();
      list.sort((a, b) => b.publishedAt.compareTo(a.publishedAt));
      return list.take(limit).toList();
    });
  }

  Future<NewsModel?> getNewsById(String id) async {
    try {
      final doc = await _db.collection(AppConstants.colNews).doc(id).get();
      if (!doc.exists) return null;
      return NewsModel.fromFirestore(doc);
    } catch (_) {
      return null;
    }
  }
}
