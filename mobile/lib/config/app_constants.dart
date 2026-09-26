class AppConstants {
  AppConstants._();

  static const String appName = 'টাঙ্গাইল জেলা';
  static const String appNameEn = 'Tangail Zilla';
  static const String districtName = 'টাঙ্গাইল';
  static const String districtId = 'tangail';

  // Emergency numbers
  static const String nationalEmergency = '999';
  static const String fireService = '199';
  static const String womenHelpline = '109';

  // Firestore collections
  static const String colHospitals = 'hospitals';
  static const String colDoctors = 'doctors';
  static const String colAmbulances = 'ambulances';
  static const String colBloodDonors = 'blood_donors';
  static const String colEmergencyContacts = 'emergency_contacts';
  static const String colNews = 'news';
  static const String colBusinesses = 'businesses';
  static const String colUpazilas = 'upazilas';
  static const String colUsers = 'users';

  // Blood groups
  static const List<String> bloodGroups = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];

  // Doctor specialties (Bangla)
  static const Map<String, String> specialties = {
    'medicine': 'মেডিসিন',
    'surgery': 'সার্জারি',
    'gynecology': 'গাইনী',
    'pediatrics': 'শিশু রোগ',
    'orthopedics': 'অর্থোপেডিক',
    'cardiology': 'হৃদরোগ',
    'neurology': 'নিউরোলজি',
    'dermatology': 'চর্মরোগ',
    'psychiatry': 'মানসিক রোগ',
    'dentistry': 'দাঁতের রোগ',
    'eye': 'চোখের রোগ',
    'ent': 'নাক-কান-গলা',
    'diabetes': 'ডায়াবেটিস',
    'nephrology': 'কিডনি রোগ',
    'oncology': 'ক্যান্সার রোগ',
  };

  // Hospital types (Bangla)
  static const Map<String, String> hospitalTypes = {
    'government': 'সরকারি',
    'private': 'বেসরকারি',
    'diagnostic': 'ডায়াগনস্টিক',
    'clinic': 'ক্লিনিক',
  };

  // Ambulance types (Bangla)
  static const Map<String, String> ambulanceTypes = {
    'ac': 'এসি অ্যাম্বুলেন্স',
    'non_ac': 'নন-এসি অ্যাম্বুলেন্স',
    'icu': 'আইসিইউ অ্যাম্বুলেন্স',
    'freezer': 'ফ্রিজার ভ্যান',
  };

  // Pagination
  static const int pageSize = 20;
}
