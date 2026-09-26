import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../config/app_constants.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  User? get currentUser => _auth.currentUser;
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  bool get isLoggedIn => _auth.currentUser != null;

  /// Send OTP to phone number (Bangladesh format: +880XXXXXXXXXX)
  Future<void> sendOtp({
    required String phoneNumber,
    required void Function(PhoneAuthCredential) onVerificationCompleted,
    required void Function(FirebaseAuthException) onVerificationFailed,
    required void Function(String, int?) onCodeSent,
  }) async {
    // Ensure phone number has country code
    final formattedPhone =
        phoneNumber.startsWith('+880') ? phoneNumber : '+880$phoneNumber';

    await _auth.verifyPhoneNumber(
      phoneNumber: formattedPhone,
      verificationCompleted: onVerificationCompleted,
      verificationFailed: onVerificationFailed,
      codeSent: onCodeSent,
      codeAutoRetrievalTimeout: (_) {},
      timeout: const Duration(seconds: 60),
    );
  }

  /// Verify OTP and sign in
  Future<UserCredential> verifyOtp({
    required String verificationId,
    required String smsCode,
  }) async {
    final credential = PhoneAuthProvider.credential(
      verificationId: verificationId,
      smsCode: smsCode,
    );
    final result = await _auth.signInWithCredential(credential);

    // Create user profile if new user
    if (result.additionalUserInfo?.isNewUser == true) {
      await _createUserProfile(result.user!);
    }

    return result;
  }

  Future<void> _createUserProfile(User user) async {
    await _db.collection(AppConstants.colUsers).doc(user.uid).set({
      'name': user.displayName ?? '',
      'phone': user.phoneNumber ?? '',
      'email': user.email ?? '',
      'isAdmin': false,
      'profileImageUrl': '',
      'createdAt': FieldValue.serverTimestamp(),
    });
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }
}
