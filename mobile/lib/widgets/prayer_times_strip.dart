import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shimmer/shimmer.dart';
import '../config/app_theme.dart';
import '../models/prayer_times_model.dart';
import '../services/prayer_times_service.dart';

/// File-level provider so it can be shared across widgets.
final prayerTimesProvider = FutureProvider<PrayerTimesModel>(
  (ref) => PrayerTimesService().fetchTodayTimings(),
);

/// Horizontal strip showing the five daily prayer times.
class PrayerTimesStrip extends ConsumerWidget {
  const PrayerTimesStrip({super.key});

  static const _prayers = [
    ('ফজর',    _PrayerKey.fajr),
    ('যোহর',   _PrayerKey.dhuhr),
    ('আসর',    _PrayerKey.asr),
    ('মাগরিব', _PrayerKey.maghrib),
    ('এশা',    _PrayerKey.isha),
  ];

  String _formatTime(String hhmm) {
    if (hhmm == '--:--') return hhmm;
    final parts = hhmm.split(':');
    if (parts.length < 2) return hhmm;
    final hour = int.tryParse(parts[0]) ?? 0;
    final minute = parts[1].padLeft(2, '0');
    final displayHour = hour == 0 ? 12 : (hour > 12 ? hour - 12 : hour);
    final prefix = hour < 12
        ? 'সকাল'
        : hour == 12
            ? 'দুপুর'
            : hour < 18
                ? 'বিকাল'
                : 'রাত';
    return '$prefix $displayHour:$minute';
  }

  String _timeFor(_PrayerKey key, PrayerTimesModel m) {
    switch (key) {
      case _PrayerKey.fajr:    return _formatTime(m.fajr);
      case _PrayerKey.dhuhr:   return _formatTime(m.dhuhr);
      case _PrayerKey.asr:     return _formatTime(m.asr);
      case _PrayerKey.maghrib: return _formatTime(m.maghrib);
      case _PrayerKey.isha:    return _formatTime(m.isha);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(prayerTimesProvider);

    return SizedBox(
      height: 56,
      child: async.when(
        loading: () => Shimmer.fromColors(
          baseColor: AppTheme.backgroundColor,
          highlightColor: Colors.white,
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
        error: (_, __) => const Center(
          child: Text(
            'সময় পাওয়া যায়নি',
            style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
          ),
        ),
        data: (model) => ListView.builder(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          itemCount: _prayers.length,
          itemBuilder: (_, i) {
            final (name, key) = _prayers[i];
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 4,
                      offset: const Offset(0, 1),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      name,
                      style: const TextStyle(
                          fontSize: 10, color: AppTheme.textSecondary),
                    ),
                    Text(
                      _timeFor(key, model),
                      style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primaryColor),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

enum _PrayerKey { fajr, dhuhr, asr, maghrib, isha }
