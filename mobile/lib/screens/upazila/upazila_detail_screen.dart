import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_constants.dart';
import '../../config/app_theme.dart';

class UpazilaDetailScreen extends StatelessWidget {
  final String upazilaId;

  const UpazilaDetailScreen({super.key, required this.upazilaId});

  // Static union lists per upazila
  static const Map<String, List<String>> _unionsByUpazila = {
    'tangail_sadar': [
      'সদর মডেল ইউনিয়ন', 'পোড়াইল', 'ঘারিন্দা', 'মাহমুদনগর',
      'কাকুয়া', 'সহদেবপুর', 'হুগড়া', 'কাতুলী',
      'গালা', 'বাঘিল', 'ছাতিহাটি', 'আনালিয়া',
      'ধুলজুরী', 'দাইন্যা',
    ],
    'mirzapur': [
      'ওয়ার্শী', 'মহেড়া', 'জামুর্কী', 'বাঁশতৈল',
      'মির্জাপুর', 'তেওতা', 'আজগানা', 'হাটুভাঙ্গা',
      'গোড়াই', 'আনহুলিয়া', 'ভাটকোলা', 'সুতিহাটা',
      'ফুলকী', 'সেনবাড়ী',
    ],
    'madhupur': [
      'মধুপুর', 'আউশনারা', 'আলোকদিয়া', 'ধোপাখালী',
      'গাছাবাড়ী', 'কুড়াগাছা', 'মহিষমারা', 'মির্জাবাড়ী',
      'পাইতসাড়া', 'অরণখোলা',
    ],
    'ghatail': [
      'গাতাইল', 'আনহুলিয়া', 'ধলাপাড়া', 'দিঘলকান্দি',
      'দেওপাড়া', 'গোহালিয়াবাড়ী', 'জামুর্কী', 'লোকেরপাড়া',
      'রসুলপুর', 'রামপুর', 'সাগরদীঘি', 'শিমলাপাড়া',
      'সন্ধানপুর', 'গোড়াবাড়ী', 'ভোগাই', 'ধলাপাড়া উত্তর',
    ],
    'kalihati': [
      'কালিহাতী', 'এলাসিন', 'বাল্লা', 'বরইতলা',
      'চরমির্জাপুর', 'দুর্গাপুর', 'গোহালিয়া', 'কোকডহরা',
      'নগরবাড়ী', 'পারখী', 'সাহেবাবাদ', 'সেহরা',
      'নামাপাড়া', 'পাথরাইল', 'ভাতগ্রাম',
    ],
    'basail': [
      'বাসাইল', 'কাশিল', 'ফুলকী', 'হাবলা',
      'কাউলজানী', 'মির্জাপুর', 'সৈয়দনগর',
    ],
    'bhuapur': [
      'ভূয়াপুর', 'অর্জুনা', 'চিতুলিয়া', 'গোবিন্দাসী',
      'মানিকহান', 'নিকরাইল', 'শিমুলতলী', 'সোমর‍‍্য',
      'ফলদা', 'উত্তর বঙ্গীর',
    ],
    'delduar': [
      'দেলদুয়ার', 'আটিয়া', 'দুলুত্তোর', 'এলাসিন',
      'ফাজিলহাটী', 'লাউহাটী', 'পাথরাইল', 'শাহজানী', 'দেওহাটা',
    ],
    'dhanbari': [
      'ধনবাড়ী', 'মুশুদ্দী', 'পলিমা', 'যদুনাথপুর',
      'বারইহাটী', 'পাইকশা',
    ],
    'gopalpur': [
      'গোপালপুর', 'ঝাওয়াইল', 'মেঘড়া', 'নগদাশিমলা',
      'হেমনগর', 'ধোপাকান্দি', 'কসিমপুর', 'মির্জাপুর',
      'আলমনগর', 'সিংহজানী',
    ],
    'nagarpur': [
      'নাগরপুর', 'ভাড়রা', 'বুড়বুড়িয়া', 'ধুবড়িয়া',
      'মমিনপুর', 'মোকনা', 'পাকুটিয়া', 'সলিমাবাদ',
      'সাটিয়াচরা', 'দুবিলা', 'গয়হাটা', 'নলশোধা', 'ধুবড়িয়া পশ্চিম',
    ],
    'sakhipur': [
      'সখিপুর', 'বহেড়াতলী', 'কালীহাটি', 'কান্দাইল',
      'বল্লা', 'হাতিবান্ধা', 'যাদবপুর', 'বারকী',
      'কচুয়া', 'রতনপুর', 'ঢালজুরি',
    ],
  };

  Map<String, dynamic>? _findUpazila() {
    try {
      return AppConstants.upazilas
          .firstWhere((u) => u['id'] == upazilaId);
    } catch (_) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final upazila = _findUpazila();
    final unions = _unionsByUpazila[upazilaId] ?? [];
    final upazilaName = upazila != null
        ? (upazila['name'] as String)
        : upazilaId;
    final area = upazila != null ? upazila['area'] as int : 0;
    final unionCount = unions.isNotEmpty ? unions.length : (upazila != null ? upazila['unionCount'] as int : 0);

    return Scaffold(
      appBar: AppBar(title: Text(upazilaName)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Hero banner card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppTheme.primaryColor, Color(0xFF009966)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  upazilaName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.map_rounded,
                        color: Colors.white70, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      'আয়তন: $area বর্গ কিমি',
                      style: const TextStyle(
                          color: Colors.white70, fontSize: 13),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.account_tree_rounded,
                        color: Colors.white70, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      'মোট ইউনিয়ন: $unionCount টি',
                      style: const TextStyle(
                          color: Colors.white70, fontSize: 13),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Union list header
          const Text(
            'ইউনিয়ন সমূহ',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 8),

          // Union list
          if (unions.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 16),
              child: Text(
                'ইউনিয়নের তথ্য পাওয়া যায়নি',
                style: TextStyle(color: AppTheme.textSecondary),
              ),
            )
          else
            ...unions.map(
              (union) => Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 4,
                      offset: const Offset(0, 1),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    const Icon(Icons.location_city_rounded,
                        size: 18, color: AppTheme.primaryColor),
                    const SizedBox(width: 10),
                    Text(union,
                        style: const TextStyle(
                            fontSize: 14, color: AppTheme.textPrimary)),
                  ],
                ),
              ),
            ),

          const Divider(height: 32),

          // Shortcut buttons
          const Text(
            'দ্রুত সেবা',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _ShortcutButton(
                label: 'হাসপাতাল',
                icon: Icons.local_hospital_rounded,
                color: const Color(0xFF006A4E),
                onTap: () => context.push('/hospitals'),
              ),
              const SizedBox(width: 8),
              _ShortcutButton(
                label: 'ডাক্তার',
                icon: Icons.medical_services_rounded,
                color: const Color(0xFF0066CC),
                onTap: () => context.push('/doctors'),
              ),
              const SizedBox(width: 8),
              _ShortcutButton(
                label: 'রক্তদাতা',
                icon: Icons.water_drop_rounded,
                color: const Color(0xFFF42A41),
                onTap: () => context.push('/blood-donors'),
              ),
            ],
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

class _ShortcutButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _ShortcutButton({
    required this.label,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: color.withOpacity(0.3)),
          ),
          child: Column(
            children: [
              Icon(icon, color: color, size: 26),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                    fontSize: 12, color: color, fontWeight: FontWeight.w600),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
