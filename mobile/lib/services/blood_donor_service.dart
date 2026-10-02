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
    // Simple query — filter client-side to avoid composite index errors
    return _db
        .collection(AppConstants.colBloodDonors)
        .limit(200)
        .snapshots()
        .map((snap) {
      var list = snap.docs
          .map((doc) => BloodDonorModel.fromFirestore(doc))
          .toList();

      if (availableOnly) {
        list = list.where((d) => d.isAvailable).toList();
      }
      if (bloodGroup != null && bloodGroup.isNotEmpty) {
        list = list.where((d) => d.bloodGroup == bloodGroup).toList();
      }
      if (upazilaId != null && upazilaId.isNotEmpty) {
        list = list.where((d) => d.upazilaId == upazilaId).toList();
      }

      list.sort((a, b) => a.name.compareTo(b.name));
      return list;
    });
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
