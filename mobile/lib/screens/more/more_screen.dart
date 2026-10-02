import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';
import '../../config/app_theme.dart';
import '../../widgets/prayer_times_strip.dart';

/// More screen — secondary navigation links.
class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('আরও'),
      ),
      body: ListView(
        children: [
          // জরুরি নম্বর
          _MoreTile(
            icon: Icons.emergency_rounded,
            color: AppTheme.secondaryColor,
            title: 'জরুরি নম্বর',
            onTap: () => context.push('/emergency'),
          ),
          // রক্তদাতা
          _MoreTile(
            icon: Icons.water_drop_rounded,
            color: AppTheme.secondaryColor,
            title: 'রক্তদাতা',
            onTap: () => context.push('/blood-donors'),
          ),
          // অ্যাম্বুলেন্স
          _MoreTile(
            icon: Icons.airport_shuttle_rounded,
            color: Colors.orange,
            title: 'অ্যাম্বুলেন্স',
            onTap: () => context.push('/ambulance'),
          ),
          // নামাজের সময়
          _MoreTile(
            icon: Icons.access_time_rounded,
            color: AppTheme.successColor,
            title: 'নামাজের সময়',
            onTap: () => _showPrayerTimesSheet(context),
          ),
          // শেয়ার করুন
          _MoreTile(
            icon: Icons.share_rounded,
            color: AppTheme.accentColor,
            title: 'শেয়ার করুন',
            onTap: () =>
                Share.share('আমাদের টাঙ্গাইল অ্যাপ ডাউনলোড করুন'),
          ),
          // আমাদের সম্পর্কে
          _MoreTile(
            icon: Icons.info_rounded,
            color: AppTheme.textSecondary,
            title: 'আমাদের সম্পর্কে',
            onTap: () => _showAboutDialog(context),
          ),
        ],
      ),
    );
  }

  void _showPrayerTimesSheet(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppTheme.dividerColor,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'আজকের নামাজের সময়',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 16),
            const PrayerTimesStrip(),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  void _showAboutDialog(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('আমাদের সম্পর্কে'),
        content: const Text(
          'আমাদের টাঙ্গাইল হলো টাঙ্গাইল জেলার সকল নাগরিক সেবা, তথ্য এবং যোগাযোগের একটি ডিজিটাল প্ল্যাটফর্ম।\n\nসংস্করণ: ১.০.০',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('ঠিক আছে'),
          ),
        ],
      ),
    );
  }
}

class _MoreTile extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final VoidCallback onTap;

  const _MoreTile({
    required this.icon,
    required this.color,
    required this.title,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: color, size: 22),
      ),
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 15,
          fontWeight: FontWeight.w500,
          color: AppTheme.textPrimary,
        ),
      ),
      trailing:
          const Icon(Icons.chevron_right, color: AppTheme.textSecondary),
      onTap: onTap,
    );
  }
}
