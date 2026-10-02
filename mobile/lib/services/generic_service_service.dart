import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/generic_service_model.dart';

class GenericServiceService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  /// Stream list of items from [collectionName], optionally filtered by
  /// [upazilaId] and/or [type]. Results are ordered by 'name'.
  Stream<List<GenericServiceModel>> getItems(
    String collectionName, {
    String? upazilaId,
    String? type,
  }) {
    Query query = _db.collection(collectionName).orderBy('name');

    if (upazilaId != null && upazilaId.isNotEmpty) {
      query = query.where('upazilaId', isEqualTo: upazilaId);
    }
    if (type != null && type.isNotEmpty) {
      query = query.where('type', isEqualTo: type);
    }

    return query.snapshots().map((snap) => snap.docs
        .map((doc) => GenericServiceModel.fromFirestore(doc))
        .toList());
  }

  /// Fetch a single document by [id] from [collectionName].
  Future<GenericServiceModel?> getItemById(
      String collectionName, String id) async {
    final doc = await _db.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;
    return GenericServiceModel.fromFirestore(doc);
  }
}
