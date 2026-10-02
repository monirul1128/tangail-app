/// Holds the five daily prayer times as 'HH:MM' strings (24-hour format).
class PrayerTimesModel {
  final String fajr;
  final String dhuhr;
  final String asr;
  final String maghrib;
  final String isha;
  final String date;

  const PrayerTimesModel({
    required this.fajr,
    required this.dhuhr,
    required this.asr,
    required this.maghrib,
    required this.isha,
    required this.date,
  });

  /// Parses the response from https://api.aladhan.com/v1/timings/{date}
  /// Expected shape: { "data": { "timings": { "Fajr": "HH:MM", ... } } }
  factory PrayerTimesModel.fromJson(Map<String, dynamic> json) {
    final timings =
        (json['data'] as Map<String, dynamic>)['timings'] as Map<String, dynamic>;

    String clean(String raw) {
      // API sometimes returns "05:12 (WEST)" — keep only HH:MM
      return raw.contains(' ') ? raw.split(' ').first : raw;
    }

    return PrayerTimesModel(
      fajr: clean(timings['Fajr']?.toString() ?? '--:--'),
      dhuhr: clean(timings['Dhuhr']?.toString() ?? '--:--'),
      asr: clean(timings['Asr']?.toString() ?? '--:--'),
      maghrib: clean(timings['Maghrib']?.toString() ?? '--:--'),
      isha: clean(timings['Isha']?.toString() ?? '--:--'),
      date: (json['data'] as Map<String, dynamic>)['date']
              ?['readable']
              ?.toString() ??
          '',
    );
  }

  /// Fallback model returned on any network or parsing error.
  factory PrayerTimesModel.empty() => const PrayerTimesModel(
        fajr: '--:--',
        dhuhr: '--:--',
        asr: '--:--',
        maghrib: '--:--',
        isha: '--:--',
        date: '',
      );
}
