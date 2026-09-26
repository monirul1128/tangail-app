import 'package:cloud_firestore/cloud_firestore.dart';

class BloodDonorModel {
  final String id;
  final String userId;
  final String name;
  final String phone;
  final String bloodGroup;
  final String upazilaId;
  final String address;
  final DateTime? lastDonationDate;
  final int totalDonations;
  final bool isAvailable;
  final String gender;
  final int age;

  const BloodDonorModel({
    required this.id,
    required this.userId,
    required this.name,
    required this.phone,
    required this.bloodGroup,
    required this.upazilaId,
    required this.address,
    this.lastDonationDate,
    required this.totalDonations,
    required this.isAvailable,
    required this.gender,
    required this.age,
  });

  /// A donor is eligible to donate if their last donation was 3+ months ago
  bool get isEligibleToDonatePast3Months {
    if (lastDonationDate == null) return true;
    final diff = DateTime.now().difference(lastDonationDate!);
    return diff.inDays >= 90;
  }

  factory BloodDonorModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return BloodDonorModel(
      id: doc.id,
      userId: data['userId'] ?? '',
      name: data['name'] ?? '',
      phone: data['phone'] ?? '',
      bloodGroup: data['bloodGroup'] ?? '',
      upazilaId: data['upazilaId'] ?? '',
      address: data['address'] ?? '',
      lastDonationDate: data['lastDonationDate'] != null
          ? (data['lastDonationDate'] as Timestamp).toDate()
          : null,
      totalDonations: data['totalDonations'] ?? 0,
      isAvailable: data['isAvailable'] ?? true,
      gender: data['gender'] ?? 'male',
      age: data['age'] ?? 0,
    );
  }

  Map<String, dynamic> toMap() => {
        'userId': userId,
        'name': name,
        'phone': phone,
        'bloodGroup': bloodGroup,
        'upazilaId': upazilaId,
        'address': address,
        'lastDonationDate': lastDonationDate != null
            ? Timestamp.fromDate(lastDonationDate!)
            : null,
        'totalDonations': totalDonations,
        'isAvailable': isAvailable,
        'gender': gender,
        'age': age,
        'updatedAt': FieldValue.serverTimestamp(),
      };
}
