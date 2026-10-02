import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/prayer_times_model.dart';

/// Fetches today's prayer times for Tangail, Bangladesh from the AlAdhan API.
/// Latitude/longitude: 24.2513, 89.9167 (Tangail district centre)
/// Method 1 = University of Islamic Sciences, Karachi (used in Bangladesh)
/// School 1 = Hanafi (Asr calculation)
class PrayerTimesService {
  static const double _latitude = 24.2513;
  static const double _longitude = 89.9167;
  static const int _method = 1;
  static const int _school = 1;
  static const String _timezone = 'Asia/Dhaka';

  Future<PrayerTimesModel> fetchTodayTimings() async {
    try {
      final now = DateTime.now();
      // AlAdhan expects DD-MM-YYYY
      final date =
          '${now.day.toString().padLeft(2, '0')}-${now.month.toString().padLeft(2, '0')}-${now.year}';

      final uri = Uri.parse(
        'https://api.aladhan.com/v1/timings/$date'
        '?latitude=$_latitude'
        '&longitude=$_longitude'
        '&method=$_method'
        '&school=$_school'
        '&timezone=$_timezone',
      );

      final response = await http.get(uri);
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        return PrayerTimesModel.fromJson(decoded);
      }
      return PrayerTimesModel.empty();
    } catch (_) {
      return PrayerTimesModel.empty();
    }
  }
}
