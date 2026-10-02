import 'package:cached_network_image/cached_network_image.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter_phone_direct_caller/flutter_phone_direct_caller.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_constants.dart';
import '../../config/app_theme.dart';
import '../../models/news_model.dart';
import '../../services/news_service.dart';
import '../../widgets/blood_group_selector.dart';
import '../../widgets/prayer_times_strip.dart';
import '../../widgets/search_bar_widget.dart';
import '../../widgets/section_header.dart';
import '../../widgets/upazila_grid_widget.dart';

// ─────────────────────────────────────────────
// Icon helper — maps String icon name to IconData
// ─────────────────────────────────────────────
IconData _iconFromName(String name) {
  const map = <String, IconData>{
    'local_pharmacy_rounded': Icons.local_pharmacy_rounded,
    'school_rounded': Icons.school_rounded,
    'directions_bus_rounded': Icons.directions_bus_rounded,
    'account_balance_rounded': Icons.account_balance_rounded,
    'account_balance_wallet_rounded': Icons.account_balance_wallet_rounded,
    'local_police_rounded': Icons.local_police_rounded,
    'bolt_rounded': Icons.bolt_rounded,
    'mosque_rounded': Icons.mosque_rounded,
    'engineering_rounded': Icons.engineering_rounded,
    'business_center_rounded': Icons.business_center_rounded,
    'local_hospital_rounded': Icons.local_hospital_rounded,
    'medical_services_rounded': Icons.medical_services_rounded,
    'water_drop_rounded': Icons.water_drop_rounded,
    'emergency_rounded': Icons.emergency_rounded,
    'landscape_rounded': Icons.landscape_rounded,
    'newspaper_rounded': Icons.newspaper_rounded,
  };
  return map[name] ?? Icons.circle_rounded;
}

// ─────────────────────────────────────────────
// HomeScreen
// ─────────────────────────────────────────────
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: CustomScrollView(
        slivers: [
          // ── Hero SliverAppBar ──────────────────────────────────────────
          SliverAppBar(
            expandedHeight: 220,
            pinned: true,
            backgroundColor: AppTheme.primaryColor,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppTheme.primaryColor, Color(0xFF004D38)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Location row
                        const Row(
                          children: [
                            Icon(Icons.location_on_rounded,
                                color: Colors.white70, size: 16),
                            SizedBox(width: 4),
                            Text(
                              'টাঙ্গাইল জেলা',
                              style: TextStyle(
                                  color: Colors.white70, fontSize: 12),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        // Title + weather stub
                        const Row(
                          children: [
                            Expanded(
                              child: Text(
                                'আমাদের টাঙ্গাইল',
                                style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold),
                              ),
                            ),
                            Text(
                              '২৯° ☁️',
                              style: TextStyle(
                                  color: Colors.white, fontSize: 16),
                            ),
                          ],
                        ),
                        const Text(
                          'আপনার জেলার সকল দরকারি তথ্য একটি ডিজিটাল প্ল্যাটফর্মে',
                          style: TextStyle(
                              color: Colors.white70, fontSize: 13),
                        ),
                        const SizedBox(height: 8),
                        // CTA buttons
                        Row(
                          children: [
                            ElevatedButton(
                              onPressed: () => context.go('/services'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white,
                                foregroundColor: AppTheme.primaryColor,
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 16, vertical: 8),
                                minimumSize: Size.zero,
                                tapTargetSize:
                                    MaterialTapTargetSize.shrinkWrap,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                              child: const Text('সেবা খুঁজুন',
                                  style: TextStyle(
                                      fontWeight: FontWeight.w600,
                                      fontSize: 13)),
                            ),
                            const SizedBox(width: 8),
                            ElevatedButton.icon(
                              onPressed: () async {
                                await FlutterPhoneDirectCaller.callNumber(
                                    '999');
                              },
                              icon: const Icon(Icons.phone,
                                  size: 14, color: Colors.white),
                              label: const Text('৯৯৯',
                                  style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600)),
                              style: ElevatedButton.styleFrom(
                                backgroundColor:
                                    AppTheme.secondaryColor,
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 16, vertical: 8),
                                minimumSize: Size.zero,
                                tapTargetSize:
                                    MaterialTapTargetSize.shrinkWrap,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        // Prayer times strip
                        const PrayerTimesStrip(),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),

          // ── Body sections ─────────────────────────────────────────────
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Search bar
                const Padding(
                  padding: EdgeInsets.symmetric(
                      horizontal: 16, vertical: 12),
                  child: SearchBarWidget(),
                ),

                // 2. Quick service pills
                const SectionHeader(title: 'দ্রুত সেবা'),
                SizedBox(
                  height: 48,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    itemCount: AppConstants.quickServicePills.length,
                    itemBuilder: (context, index) {
                      final pill = AppConstants.quickServicePills[index];
                      final label = pill['label'] as String;
                      final route = pill['route'] as String;
                      final colorHex = AppConstants.serviceCategories
                          .firstWhere(
                            (c) => c['route'] == route,
                            orElse: () =>
                                {'colorHex': 0xFF006A4E},
                          )['colorHex'] as int;
                      final color = Color(colorHex);
                      final emoji = _emojiForPill(label);

                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: GestureDetector(
                          onTap: () => context.go(route),
                          child: Container(
                            decoration: BoxDecoration(
                              color: color.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 8),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(emoji,
                                    style:
                                        const TextStyle(fontSize: 16)),
                                const SizedBox(width: 4),
                                Text(
                                  label,
                                  style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: color),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 8),

                // 3. Service categories grid
                SectionHeader(
                  title: 'সকল সেবা',
                  actionLabel: 'সব দেখুন',
                  onAction: () => context.go('/services'),
                ),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 1.4,
                  children:
                      AppConstants.serviceCategories.map((cat) {
                    final icon =
                        _iconFromName(cat['icon'] as String);
                    final label = cat['label'] as String;
                    final route = cat['route'] as String;
                    final color = Color(cat['colorHex'] as int);
                    return _ServiceCategoryCard(
                      icon: icon,
                      label: label,
                      route: route,
                      color: color,
                    );
                  }).toList(),
                ),
                const SizedBox(height: 8),

                // 4. Upazilas
                const SectionHeader(title: 'উপজেলা সমূহ'),
                const Padding(
                  padding:
                      EdgeInsets.symmetric(horizontal: 16),
                  child: UpazilaGridWidget(),
                ),
                const SizedBox(height: 8),

                // 5. Blood group finder
                const SectionHeader(title: 'রক্তের গ্রুপ খুঁজুন'),
                Container(
                  margin:
                      const EdgeInsets.symmetric(horizontal: 16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [
                        AppTheme.secondaryColor,
                        Color(0xFFB91C1C),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'আপনার প্রয়োজনীয় রক্তের গ্রুপ বেছে নিন',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 12),
                      BloodGroupSelector(
                        onSelected: (bg) => context
                            .push('/blood-donors?group=$bg'),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),

                // 6. Latest notices
                SectionHeader(
                  title: 'সর্বশেষ নোটিশ',
                  actionLabel: 'সব দেখুন',
                  onAction: () => context.go('/news'),
                ),
                const _NoticesPreview(),

                // 7. Notable persons
                SectionHeader(
                  title: 'বিশিষ্ট ব্যক্তিবর্গ',
                  actionLabel: 'সব দেখুন',
                  onAction: () => context.push('/notable-persons'),
                ),
                const _NotablePersonsPreview(),

                // 8. Tourism places
                SectionHeader(
                  title: 'পর্যটন স্থান',
                  actionLabel: 'সব দেখুন',
                  onAction: () => context.push('/tourism'),
                ),
                const _TourismPreview(),

                // 9. Photo gallery
                SectionHeader(
                  title: 'ফটো গ্যালারি',
                  actionLabel: 'সব দেখুন',
                  onAction: () => context.push('/gallery'),
                ),
                const _GalleryPreview(),

                // 10. Business CTA banner
                Container(
                  margin: const EdgeInsets.all(16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.accentColor,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'আপনার জেলায় ব্যবসা বা সেবা আছে?',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 6),
                      Text(
                        'আজই যোগ করুন এবং আরও বেশি মানুষের কাছে পৌঁছান',
                        style: TextStyle(
                            color: Colors.white70, fontSize: 12),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 80),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// Returns an appropriate emoji for each quick pill label.
  String _emojiForPill(String label) {
    switch (label) {
      case 'হাসপাতাল':
        return '🏥';
      case 'ডাক্তার':
        return '👨‍⚕️';
      case 'রক্তদাতা':
        return '🩸';
      case 'অ্যাম্বুলেন্স':
        return '🚑';
      case 'পর্যটন':
        return '🏞️';
      case 'খবর':
        return '📰';
      default:
        return '⚡';
    }
  }
}

// ─────────────────────────────────────────────
// Service category card
// ─────────────────────────────────────────────
class _ServiceCategoryCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String route;
  final Color color;

  const _ServiceCategoryCard({
    required this.icon,
    required this.label,
    required this.route,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push(route),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(height: 6),
            Text(
              label,
              style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textPrimary),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────
// Notices preview (StreamBuilder)
// ─────────────────────────────────────────────
class _NoticesPreview extends StatelessWidget {
  const _NoticesPreview();

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<List<NewsModel>>(
      stream: NewsService().getNotices(limit: 3),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const _SectionLoadingPlaceholder(count: 3, height: 56);
        }
        if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Text('কোনো নোটিশ নেই',
                style: TextStyle(
                    color: AppTheme.textSecondary, fontSize: 13)),
          );
        }
        final items = snapshot.data!;
        return Column(
          children: items.map((notice) => _NoticeCardRow(notice: notice)).toList(),
        );
      },
    );
  }
}

class _NoticeCardRow extends StatelessWidget {
  final NewsModel notice;
  const _NoticeCardRow({required this.notice});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          const Icon(Icons.warning_amber_rounded,
              color: AppTheme.warningColor, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              notice.title,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: AppTheme.textPrimary),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            _formatDate(notice.publishedAt),
            style: const TextStyle(
                fontSize: 11, color: AppTheme.textSecondary),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime dt) {
    return '${dt.day}/${dt.month}/${dt.year}';
  }
}

// ─────────────────────────────────────────────
// Notable persons preview (StreamBuilder)
// ─────────────────────────────────────────────
class _NotablePersonsPreview extends StatelessWidget {
  const _NotablePersonsPreview();

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseFirestore.instance
          .collection(AppConstants.colNotablePersons)
          .orderBy('name')
          .limit(3)
          .snapshots(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const _SectionLoadingPlaceholder(count: 3, height: 72);
        }
        if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
          return const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Text('কোনো তথ্য নেই',
                style: TextStyle(
                    color: AppTheme.textSecondary, fontSize: 13)),
          );
        }
        final docs = snapshot.data!.docs;
        return Column(
          children: docs.map((doc) {
            final data = doc.data() as Map<String, dynamic>;
            final name = data['name'] as String? ?? '';
            final designation = data['designation'] as String? ?? '';
            final photoUrl = data['photoUrl'] as String? ?? '';
            return Container(
              margin: const EdgeInsets.fromLTRB(16, 0, 16, 8),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 24,
                    backgroundColor: AppTheme.backgroundColor,
                    backgroundImage: photoUrl.isNotEmpty
                        ? CachedNetworkImageProvider(photoUrl)
                        : null,
                    child: photoUrl.isEmpty
                        ? const Icon(Icons.person_rounded,
                            color: AppTheme.textSecondary)
                        : null,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(name,
                            style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.textPrimary)),
                        if (designation.isNotEmpty)
                          Text(designation,
                              style: const TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.textSecondary)),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        );
      },
    );
  }
}

// ─────────────────────────────────────────────
// Tourism preview (StreamBuilder)
// ─────────────────────────────────────────────
class _TourismPreview extends StatelessWidget {
  const _TourismPreview();

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseFirestore.instance
          .collection(AppConstants.colTourism)
          .orderBy('name')
          .limit(3)
          .snapshots(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return SizedBox(
            height: 130,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: 3,
              itemBuilder: (_, __) => Container(
                width: 160,
                margin: const EdgeInsets.only(right: 12),
                decoration: BoxDecoration(
                  color: AppTheme.backgroundColor,
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          );
        }
        if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
          return const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Text('কোনো তথ্য নেই',
                style: TextStyle(
                    color: AppTheme.textSecondary, fontSize: 13)),
          );
        }
        final docs = snapshot.data!.docs;
        return SizedBox(
          height: 140,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: docs.length,
            itemBuilder: (_, i) {
              final data = docs[i].data() as Map<String, dynamic>;
              final name = data['name'] as String? ?? '';
              final category = data['category'] as String? ?? '';
              final imageUrl = data['imageUrl'] as String? ?? '';
              return Container(
                width: 160,
                margin: const EdgeInsets.only(right: 12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.06),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(12)),
                      child: imageUrl.isNotEmpty
                          ? CachedNetworkImage(
                              imageUrl: imageUrl,
                              height: 90,
                              width: double.infinity,
                              fit: BoxFit.cover,
                              placeholder: (_, __) => Container(
                                height: 90,
                                color: AppTheme.backgroundColor,
                              ),
                              errorWidget: (_, __, ___) => Container(
                                height: 90,
                                color: AppTheme.backgroundColor,
                                child: const Icon(
                                    Icons.image_rounded,
                                    color: AppTheme.textSecondary),
                              ),
                            )
                          : Container(
                              height: 90,
                              color: AppTheme.backgroundColor,
                              child: const Icon(Icons.image_rounded,
                                  color: AppTheme.textSecondary),
                            ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: AppTheme.textPrimary)),
                          if (category.isNotEmpty)
                            Container(
                              margin: const EdgeInsets.only(top: 4),
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppTheme.primaryColor
                                    .withOpacity(0.1),
                                borderRadius:
                                    BorderRadius.circular(4),
                              ),
                              child: Text(category,
                                  style: const TextStyle(
                                      fontSize: 10,
                                      color: AppTheme.primaryColor)),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        );
      },
    );
  }
}

// ─────────────────────────────────────────────
// Gallery preview (StreamBuilder)
// ─────────────────────────────────────────────
class _GalleryPreview extends StatelessWidget {
  const _GalleryPreview();

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseFirestore.instance
          .collection(AppConstants.colGallery)
          .orderBy('createdAt', descending: true)
          .limit(6)
          .snapshots(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return SizedBox(
            height: 120,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: 6,
              itemBuilder: (_, __) => Container(
                width: 110,
                height: 110,
                margin: const EdgeInsets.only(right: 8),
                decoration: BoxDecoration(
                  color: AppTheme.backgroundColor,
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          );
        }
        if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
          return const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Text('কোনো ছবি নেই',
                style: TextStyle(
                    color: AppTheme.textSecondary, fontSize: 13)),
          );
        }
        final docs = snapshot.data!.docs;
        return SizedBox(
          height: 120,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: docs.length,
            itemBuilder: (_, i) {
              final data = docs[i].data() as Map<String, dynamic>;
              final imageUrl = data['imageUrl'] as String? ?? '';
              return Container(
                width: 110,
                height: 110,
                margin: const EdgeInsets.only(right: 8),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: imageUrl.isNotEmpty
                      ? CachedNetworkImage(
                          imageUrl: imageUrl,
                          fit: BoxFit.cover,
                          placeholder: (_, __) => Container(
                            color: AppTheme.backgroundColor,
                          ),
                          errorWidget: (_, __, ___) => Container(
                            color: AppTheme.backgroundColor,
                            child: const Icon(Icons.image_rounded,
                                color: AppTheme.textSecondary),
                          ),
                        )
                      : Container(
                          color: AppTheme.backgroundColor,
                          child: const Icon(Icons.image_rounded,
                              color: AppTheme.textSecondary),
                        ),
                ),
              );
            },
          ),
        );
      },
    );
  }
}

// ─────────────────────────────────────────────
// Generic loading placeholder rows
// ─────────────────────────────────────────────
class _SectionLoadingPlaceholder extends StatelessWidget {
  final int count;
  final double height;
  const _SectionLoadingPlaceholder(
      {required this.count, required this.height});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(
        count,
        (_) => Container(
          margin: const EdgeInsets.fromLTRB(16, 0, 16, 8),
          height: height,
          decoration: BoxDecoration(
            color: AppTheme.backgroundColor,
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }
}
