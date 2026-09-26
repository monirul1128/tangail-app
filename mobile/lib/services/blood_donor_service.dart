import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/blood_donor_model.dart';
import '../config/app_constants.dart';

class BloodDonorService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  /// Get donors filtered by blood group and/or upazila
  Stream<List<BloodDonorModel>> getDonors({
    String? bloodGroup,
    String? upazilaId,
    bool availableOnly = true,
  }) {
    Query query = _db.collection(AppConstants.colBloodDonors);

    if (availableOnly) {
      query = query.where('isAvailable', isEqualTo: true);
    }
    if (bloodGroup != null && bloodGroup.isNotEmpty) {
      query = query.where('bloodGroup', isEqualTo: bloodGroup);
    }
    if (upazilaId != null && upazilaId.isNotEmpty) {
      query = query.where('upazilaId', isEqualTo: upazilaId);
    }

    return query.snapshots().map((snap) =>
        snap.docs.map((doc) => BloodDonorModel.fromFirestore(doc)).toList());
  }

  /// Register as a blood donor
  Future<void> registerDonor(BloodDonorModel donor) async {
    await _db
        .collection(AppConstants.colBloodDonors)
        .doc(donor.userId)
        .set({...donor.toMap(), 'createdAt': FieldValue.serverTimestamp()});
  }

  /// Update donor availability
  Future<void> updateAvailability(String donorId, bool isAvailable) async {
    await _db
        .collection(AppConstants.colBloodDonors)
        .doc(donorId)
        .update({'isAvailable': isAvailable, 'updatedAt': FieldValue.serverTimestamp()});
  }

  /// Update last donation date
  Future<void> updateLastDonation(String donorId) async {
    await _db.collection(AppConstants.colBloodDonors).doc(donorId).update({
      'lastDonationDate': Timestamp.now(),
      'totalDonations': FieldValue.increment(1),
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  /// Get donor profile by userId
  Future<BloodDonorModel?> getDonorByUserId(String userId) async {
    final doc =
        await _db.collection(AppConstants.colBloodDonors).doc(userId).get();
    if (!doc.exists) return null;
    return BloodDonorModel.fromFirestore(doc);
  }
}
