import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/hospital_model.dart';
import '../config/app_constants.dart';

class HospitalService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  /// Get all hospitals, optionally filtered by upazilaId
  Stream<List<HospitalModel>> getHospitals({String? upazilaId}) {
    Query query = _db
        .collection(AppConstants.colHospitals)
        .orderBy('rating', descending: true);

    if (upazilaId != null && upazilaId.isNotEmpty) {
      query = query.where('upazilaId', isEqualTo: upazilaId);
    }

    return query.snapshots().map((snap) =>
        snap.docs.map((doc) => HospitalModel.fromFirestore(doc)).toList());
  }

  /// Get hospitals by type (government, private, etc.)
  Stream<List<HospitalModel>> getHospitalsByType(String type) {
    return _db
        .collection(AppConstants.colHospitals)
        .where('type', isEqualTo: type)
        .orderBy('rating', descending: true)
        .snapshots()
        .map((snap) =>
            snap.docs.map((doc) => HospitalModel.fromFirestore(doc)).toList());
  }

  /// Get a single hospital by ID
  Future<HospitalModel?> getHospitalById(String id) async {
    final doc =
        await _db.collection(AppConstants.colHospitals).doc(id).get();
    if (!doc.exists) return null;
    return HospitalModel.fromFirestore(doc);
  }

  /// Search hospitals by name
  Future<List<HospitalModel>> searchHospitals(String query) async {
    // Firestore doesn't support full-text search natively
    // Use a range query on the name field for basic prefix search
    final snap = await _db
        .collection(AppConstants.colHospitals)
        .where('nameEn', isGreaterThanOrEqualTo: query)
        .where('nameEn', isLessThan: '${query}z')
        .limit(20)
        .get();
    return snap.docs.map((doc) => HospitalModel.fromFirestore(doc)).toList();
  }

  /// Get verified hospitals only
  Stream<List<HospitalModel>> getVerifiedHospitals({String? upazilaId}) {
    Query query = _db
        .collection(AppConstants.colHospitals)
        .where('isVerified', isEqualTo: true)
        .orderBy('rating', descending: true)
        .limit(AppConstants.pageSize);

    if (upazilaId != null && upazilaId.isNotEmpty) {
      query = query.where('upazilaId', isEqualTo: upazilaId);
    }

    return query.snapshots().map((snap) =>
        snap.docs.map((doc) => HospitalModel.fromFirestore(doc)).toList());
  }
}
