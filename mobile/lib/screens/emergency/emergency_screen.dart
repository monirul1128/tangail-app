import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_constants.dart';

class EmergencyScreen extends StatefulWidget {
  const EmergencyScreen({super.key});
  @override
  State<EmergencyScreen> createState() => _EmergencyScreenState();
}

class _EmergencyScreenState extends State<EmergencyScreen> {
  List<Map<String, dynamic>> _contacts = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final snap = await FirebaseFirestore.instance
          .collection(AppConstants.colEmergencyContacts)
          .limit(100)
          .get();

      final list = snap.docs.map((d) {
        final data = d.data() as Map<String, dynamic>? ?? {};
        // phone field can be List or String
        List<String> phones = [];
        final raw = data['phone'];
        if (raw is List) {
          phones = raw.map((e) => e.toString()).toList();
        } else if (raw is String && raw.isNotEmpty) {
          phones = [raw];
        }
        return {
          'id': d.id,
          'title': data['title'] as String? ?? '',
          'category': data['category'] as String? ?? 'other',
          'phone': phones,
          'isNational': data['isNational'] as bool? ?? false,
          'sortOrder': data['sortOrder'] as int? ?? 99,
        };
      }).toList();

      list.sort((a, b) =>
          (a['sortOrder'] as int).compareTo(b['sortOrder'] as int));

      setState(() {
        _contacts = list;
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  static const _catConfig = {
    'fire':      {'icon': Icons.local_fire_department_rounded, 'color': 0xFFEF4444, 'bg': 0xFFFEF2F2},
    'police':    {'icon': Icons.local_police_rounded,          'color': 0xFF1D4ED8, 'bg': 0xFFEFF6FF},
    'ambulance': {'icon': Icons.airport_shuttle_rounded,       'color': 0xFFD97706, 'bg': 0xFFFFFBEB},
    'hospital':  {'icon': Icons.local_hospital_rounded,        'color': 0xFF0066CC, 'bg': 0xFFEFF6FF},
    'hotline':   {'icon': Icons.support_agent_rounded,         'color': 0xFF059669, 'bg': 0xFFF0FDF4},
    'other':     {'icon': Icons.phone_rounded,                 'color': 0xFF6B7280, 'bg': 0xFFF9FAFB},
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F6F8),
      appBar: AppBar(
        title: const Text('জরুরি নম্বরসমূহ'),
        backgroundColor: const Color(0xFFDC2626),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _load,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // ── Big 999 button ──────────────────────────────────
                  GestureDetector(
                    onTap: () async {
                      final uri = Uri(scheme: 'tel', path: '999');
                      if (await canLaunchUrl(uri)) launchUrl(uri);
                    },
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 28),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFFDC2626), Color(0xFFEF4444)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFFDC2626).withOpacity(0.4),
                            blurRadius: 16,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Container(
                            width: 60, height: 60,
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.phone_rounded,
                                color: Colors.white, size: 30),
                          ),
                          const SizedBox(height: 10),
                          const Text('জাতীয় জরুরি সেবা',
                              style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500)),
                          const Text('৯৯৯',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 52,
                                  fontWeight: FontWeight.w900,
                                  height: 1.1)),
                          const SizedBox(height: 4),
                          const Text('যেকোনো জরুরি পরিস্থিতিতে কল করুন',
                              style: TextStyle(
                                  color: Colors.white60, fontSize: 11)),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // ── Contact list ────────────────────────────────────
                  if (_contacts.isEmpty)
                    const Center(
                      child: Padding(
                        padding: EdgeInsets.all(40),
                        child: Text('কোনো নম্বর পাওয়া যায়নি',
                            style: TextStyle(color: Color(0xFF9CA3AF))),
                      ),
                    )
                  else
                    ..._contacts
                        .where((c) =>
                            !(c['phone'] as List<String>).contains('999'))
                        .map((c) => _ContactCard(
                              contact: c,
                              catConfig: _catConfig,
                            )),
                ],
              ),
            ),
    );
  }
}

class _ContactCard extends StatelessWidget {
  final Map<String, dynamic> contact;
  final Map<String, Map<String, dynamic>> catConfig;

  const _ContactCard({required this.contact, required this.catConfig});

  @override
  Widget build(BuildContext context) {
    final category = contact['category'] as String;
    final cfg = catConfig[category] ?? catConfig['other']!;
    final color = Color(cfg['color'] as int);
    final bg = Color(cfg['bg'] as int);
    final icon = cfg['icon'] as IconData;
    final phones = contact['phone'] as List<String>;
    final isNational = contact['isNational'] as bool;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 8,
              offset: const Offset(0, 2))
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Icon
          Container(
            width: 46, height: 46,
            decoration: BoxDecoration(
                color: bg, borderRadius: BorderRadius.circular(12)),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(width: 12),

          // Title + phones
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        contact['title'] as String,
                        style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1F2937)),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (isNational)
                      Container(
                        margin: const EdgeInsets.only(left: 6),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF0FDF4),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text('জাতীয়',
                            style: TextStyle(
                                fontSize: 10,
                                color: Color(0xFF059669),
                                fontWeight: FontWeight.w600)),
                      ),
                  ],
                ),
                const SizedBox(height: 8),
                // Phone buttons — wrap to avoid overflow
                Wrap(
                  spacing: 8,
                  runSpacing: 6,
                  children: phones
                      .map((p) => _CallChip(phone: p, color: color))
                      .toList(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _CallChip extends StatelessWidget {
  final String phone;
  final Color color;
  const _CallChip({required this.phone, required this.color});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () async {
        final uri = Uri(scheme: 'tel', path: phone);
        if (await canLaunchUrl(uri)) launchUrl(uri);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.phone_rounded, size: 13, color: color),
            const SizedBox(width: 5),
            Text(
              phone,
              style: TextStyle(
                  fontSize: 13,
                  color: color,
                  fontWeight: FontWeight.w700),
            ),
          ],
        ),
      ),
    );
  }
}
