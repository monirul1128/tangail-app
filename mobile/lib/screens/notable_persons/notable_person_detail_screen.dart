import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../config/app_constants.dart';

/// Safely converts any Firestore field to String.
/// Handles String, List<dynamic>, null, and other types.
String _asString(dynamic value) {
  if (value == null) return '';
  if (value is String) return value;
  if (value is List) return value.join('\n');
  return value.toString();
}

class NotablePersonDetailScreen extends StatefulWidget {
  final String personId;
  const NotablePersonDetailScreen({super.key, required this.personId});

  @override
  State<NotablePersonDetailScreen> createState() =>
      _NotablePersonDetailScreenState();
}

class _NotablePersonDetailScreenState
    extends State<NotablePersonDetailScreen> {
  Map<String, dynamic>? _data;
  bool _loading = true;

  static const _categoryColors = {
    'politics':   [0xFF1D4ED8, 0xFFEFF6FF],
    'literature': [0xFF7C3AED, 0xFFF5F3FF],
    'social':     [0xFF059669, 0xFFF0FDF4],
    'art':        [0xFFD97706, 0xFFFFFBEB],
    'sports':     [0xFFDC2626, 0xFFFEF2F2],
    'other':      [0xFF6B7280, 0xFFF9FAFB],
  };

  static const _categoryNames = {
    'politics':   'রাজনীতি',
    'literature': 'সাহিত্য',
    'social':     'সমাজসেবা',
    'art':        'শিল্প-সংস্কৃতি',
    'sports':     'ক্রীড়া',
    'other':      'অন্যান্য',
  };

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final doc = await FirebaseFirestore.instance
          .collection(AppConstants.colNotablePersons)
          .doc(widget.personId)
          .get();
      if (doc.exists) {
        setState(() {
          _data = {'id': doc.id, ...doc.data()!};
          _loading = false;
        });
      } else {
        setState(() => _loading = false);
      }
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }
    if (_data == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(
          child: Text('তথ্য পাওয়া যায়নি',
              style: TextStyle(color: Color(0xFF9CA3AF))),
        ),
      );
    }

    final d = _data!;
    final name        = d['name'] as String? ?? '';
    final designation = d['designation'] as String? ?? d['profession'] as String? ?? '';
    final category    = d['category'] as String? ?? 'other';
    final bio         = _asString(d['bio'] ?? d['description']);
    final imageUrl    = d['photoUrl'] as String? ?? d['imageUrl'] as String? ?? '';
    final birthYear   = d['birthYear'] ?? d['born'] ?? 0;
    final deathYear   = d['deathYear'] ?? d['died'] ?? 0;
    final birthPlace  = _asString(d['birthPlace']);
    final achievements = _asString(d['achievements']);

    final colors = _categoryColors[category] ?? _categoryColors['other']!;
    final catColor  = Color(colors[0]);
    final catBg     = Color(colors[1]);
    final catName   = _categoryNames[category] ?? category;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F6F8),
      body: CustomScrollView(
        slivers: [
          // ── Hero image SliverAppBar ──────────────────────────────────
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            backgroundColor: catColor,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  // Photo
                  imageUrl.isNotEmpty
                      ? CachedNetworkImage(
                          imageUrl: imageUrl,
                          fit: BoxFit.cover,
                          placeholder: (_, __) => Container(color: catColor),
                          errorWidget: (_, __, ___) => Container(
                            color: catColor,
                            child: const Icon(Icons.person_rounded,
                                size: 80, color: Colors.white30),
                          ),
                        )
                      : Container(
                          color: catColor,
                          child: const Icon(Icons.person_rounded,
                              size: 80, color: Colors.white30),
                        ),
                  // Gradient overlay
                  const DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Color(0xCC000000),
                        ],
                        stops: [0.4, 1.0],
                      ),
                    ),
                  ),
                  // Name overlay at bottom
                  Positioned(
                    bottom: 16,
                    left: 16,
                    right: 16,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          name,
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              shadows: [
                                Shadow(color: Colors.black54, blurRadius: 8),
                              ]),
                        ),
                        if (designation.isNotEmpty) ...[
                          const SizedBox(height: 4),
                          Text(
                            designation,
                            style: TextStyle(
                                color: Colors.white.withOpacity(0.85),
                                fontSize: 13),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ── Body ────────────────────────────────────────────────────
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [

                  // ── Name + category badge ──────────────────────────
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Text(name,
                            style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF1F2937))),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: catBg,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                              color: catColor.withOpacity(0.3)),
                        ),
                        child: Text(catName,
                            style: TextStyle(
                                color: catColor,
                                fontSize: 12,
                                fontWeight: FontWeight.w700)),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // ── Info chips ─────────────────────────────────────
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      if (designation.isNotEmpty)
                        _InfoChip(
                          icon: Icons.work_rounded,
                          label: designation,
                          color: catColor,
                        ),
                      if (birthYear != 0)
                        _InfoChip(
                          icon: Icons.cake_rounded,
                          label: 'জন্ম: $birthYear',
                          color: const Color(0xFF059669),
                        ),
                      if (deathYear != 0)
                        _InfoChip(
                          icon: Icons.event_rounded,
                          label: 'মৃত্যু: $deathYear',
                          color: const Color(0xFF6B7280),
                        ),
                      if (birthPlace.isNotEmpty)
                        _InfoChip(
                          icon: Icons.location_on_rounded,
                          label: birthPlace,
                          color: const Color(0xFF1D4ED8),
                        ),
                    ],
                  ),

                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 12),

                  // ── Bio ────────────────────────────────────────────
                  if (bio.isNotEmpty) ...[
                    Row(
                      children: [
                        Container(
                            width: 4, height: 20,
                            decoration: BoxDecoration(
                                color: catColor,
                                borderRadius: BorderRadius.circular(4))),
                        const SizedBox(width: 8),
                        const Text('জীবনী',
                            style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF1F2937))),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 8,
                              offset: const Offset(0, 2))
                        ],
                      ),
                      child: Text(bio,
                          style: const TextStyle(
                              fontSize: 14,
                              color: Color(0xFF374151),
                              height: 1.7)),
                    ),
                  ],

                  // ── Achievements ───────────────────────────────────
                  if (achievements.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Container(
                            width: 4, height: 20,
                            decoration: BoxDecoration(
                                color: catColor,
                                borderRadius: BorderRadius.circular(4))),
                        const SizedBox(width: 8),
                        const Text('অর্জন ও কৃতিত্ব',
                            style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF1F2937))),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: catBg,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: catColor.withOpacity(0.2)),
                      ),
                      child: Text(achievements,
                          style: TextStyle(
                              fontSize: 14,
                              color: catColor,
                              height: 1.7)),
                    ),
                  ],

                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _InfoChip(
      {required this.icon, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.25)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: color),
          const SizedBox(width: 5),
          Text(label,
              style: TextStyle(
                  fontSize: 12, color: color, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
