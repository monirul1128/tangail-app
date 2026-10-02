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

  // Firestore collections — existing
  static const String colHospitals = 'hospitals';
  static const String colDoctors = 'doctors';
  static const String colAmbulances = 'ambulances';
  static const String colBloodDonors = 'blood_donors';
  static const String colEmergencyContacts = 'emergency_contacts';
  static const String colNews = 'news';
  static const String colBusinesses = 'businesses';
  static const String colUpazilas = 'upazilas';
  static const String colUsers = 'users';

  // Firestore collections — new
  static const String colPharmacies = 'pharmacies';
  static const String colEducation = 'education';
  static const String colTransport = 'transport';
  static const String colFinance = 'finance';
  static const String colGovtServices = 'govt_services';
  static const String colPoliceStations = 'police_stations';
  static const String colElectricityOffices = 'electricity_offices';
  static const String colIslamic = 'islamic';
  static const String colProfessionals = 'professionals';
  static const String colOrganizations = 'organizations';
  static const String colJobs = 'jobs';
  static const String colNotablePersons = 'notable_persons';
  static const String colTourism = 'tourism';
  static const String colGallery = 'gallery';

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

  // All 12 upazilas of Tangail district
  static const List<Map<String, dynamic>> upazilas = [
    {'id': 'tangail_sadar', 'name': 'টাঙ্গাইল সদর', 'unionCount': 14, 'area': 336},
    {'id': 'mirzapur',      'name': 'মির্জাপুর',    'unionCount': 14, 'area': 469},
    {'id': 'madhupur',      'name': 'মধুপুর',        'unionCount': 10, 'area': 518},
    {'id': 'ghatail',       'name': 'ঘাটাইল',        'unionCount': 16, 'area': 441},
    {'id': 'kalihati',      'name': 'কালিহাতী',      'unionCount': 15, 'area': 388},
    {'id': 'basail',        'name': 'বাসাইল',        'unionCount':  7, 'area': 148},
    {'id': 'bhuapur',       'name': 'ভূয়াপুর',       'unionCount': 10, 'area': 246},
    {'id': 'delduar',       'name': 'দেলদুয়ার',      'unionCount':  9, 'area': 166},
    {'id': 'dhanbari',      'name': 'ধনবাড়ী',        'unionCount':  6, 'area': 156},
    {'id': 'gopalpur',      'name': 'গোপালপুর',      'unionCount': 10, 'area': 224},
    {'id': 'nagarpur',      'name': 'নাগরপুর',       'unionCount': 13, 'area': 320},
    {'id': 'sakhipur',      'name': 'সখিপুর',        'unionCount': 11, 'area': 391},
  ];

  // Service categories (10 items) — icon name string, label, route, colorHex
  static const List<Map<String, dynamic>> serviceCategories = [
    {'icon': 'local_pharmacy_rounded',    'label': 'ফার্মেসি',       'route': '/pharmacy',          'colorHex': 0xFF10B981},
    {'icon': 'school_rounded',            'label': 'শিক্ষা',          'route': '/education',         'colorHex': 0xFF0066CC},
    {'icon': 'directions_bus_rounded',    'label': 'পরিবহন',          'route': '/transport',         'colorHex': 0xFFF59E0B},
    {'icon': 'account_balance_rounded',   'label': 'ব্যাংক/আর্থিক',  'route': '/finance',           'colorHex': 0xFF6366F1},
    {'icon': 'account_balance_wallet_rounded', 'label': 'সরকারি সেবা', 'route': '/govt-services',   'colorHex': 0xFF006A4E},
    {'icon': 'local_police_rounded',      'label': 'পুলিশ',           'route': '/police',            'colorHex': 0xFF1D4ED8},
    {'icon': 'bolt_rounded',              'label': 'বিদ্যুৎ',          'route': '/electricity',       'colorHex': 0xFFEAB308},
    {'icon': 'mosque_rounded',            'label': 'মসজিদ/ধর্ম',     'route': '/islamic',           'colorHex': 0xFF059669},
    {'icon': 'engineering_rounded',       'label': 'পেশাদার',         'route': '/professionals',     'colorHex': 0xFFDC2626},
    {'icon': 'business_center_rounded',   'label': 'চাকরি',           'route': '/jobs',              'colorHex': 0xFF7C3AED},
  ];

  // Quick service pills (6 items)
  static const List<Map<String, dynamic>> quickServicePills = [
    {'label': 'হাসপাতাল',    'route': '/hospitals',    'icon': 'local_hospital_rounded'},
    {'label': 'ডাক্তার',     'route': '/doctors',      'icon': 'medical_services_rounded'},
    {'label': 'রক্তদাতা',    'route': '/blood-donors', 'icon': 'water_drop_rounded'},
    {'label': 'অ্যাম্বুলেন্স', 'route': '/ambulance',  'icon': 'emergency_rounded'},
    {'label': 'পর্যটন',      'route': '/tourism',      'icon': 'landscape_rounded'},
    {'label': 'খবর',         'route': '/news',         'icon': 'newspaper_rounded'},
  ];
}
