import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/hospital_model.dart';
import '../config/app_constants.dart';

class HospitalService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  Stream<List<HospitalModel>> getHospitals({String? upazilaId, String? type}) {
    // No orderBy — avoids index errors. Filter + sort client-side.
    final query = _db.collection(AppConstants.colHospitals).limit(200);

    return query.snapshots().map((snap) {
      var list = snap.docs
          .map((doc) => HospitalModel.fromFirestore(doc))
          .toList();

      if (upazilaId != null && upazilaId.isNotEmpty) {
        list = list.where((h) => h.upazilaId == upazilaId).toList();
      }
      if (type != null && type.isNotEmpty) {
        list = list.where((h) => h.type == type).toList();
      }

      list.sort((a, b) => a.name.compareTo(b.name));
      return list;
    });
  }

  Future<HospitalModel?> getHospitalById(String id) async {
    try {
      final doc = await _db.collection(AppConstants.colHospitals).doc(id).get();
      if (!doc.exists) return null;
      return HospitalModel.fromFirestore(doc);
    } catch (_) {
      return null;
    }
  }
}
