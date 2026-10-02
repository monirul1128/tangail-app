import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/generic_service_model.dart';

class GenericServiceService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  /// Stream items from [collectionName]. Filters applied client-side to avoid
  /// requiring composite Firestore indexes.
  Stream<List<GenericServiceModel>> getItems(
    String collectionName, {
    String? upazilaId,
    String? type,
  }) {
    // No orderBy — avoids "missing index" errors on collections without a name field
    final query = _db.collection(collectionName).limit(200);

    return query.snapshots().map((snap) {
      var list = snap.docs
          .map((doc) => GenericServiceModel.fromFirestore(doc))
          .toList();

      // Client-side filtering
      if (upazilaId != null && upazilaId.isNotEmpty) {
        list = list.where((i) => i.upazilaId == upazilaId).toList();
      }
      if (type != null && type.isNotEmpty) {
        list = list.where((i) => i.type == type).toList();
      }

      // Sort by name client-side
      list.sort((a, b) => a.name.compareTo(b.name));
      return list;
    });
  }

  /// Fetch a single document by [id] from [collectionName].
  Future<GenericServiceModel?> getItemById(
      String collectionName, String id) async {
    try {
      final doc = await _db.collection(collectionName).doc(id).get();
      if (!doc.exists) return null;
      return GenericServiceModel.fromFirestore(doc);
    } catch (_) {
      return null;
    }
  }
}
