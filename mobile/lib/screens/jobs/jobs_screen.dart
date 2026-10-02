import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_constants.dart';
import '../../widgets/shimmer_list.dart';

class JobsScreen extends StatefulWidget {
  const JobsScreen({super.key});
  @override
  State<JobsScreen> createState() => _JobsScreenState();
}

class _JobsScreenState extends State<JobsScreen> {
  List<Map<String, dynamic>> _items = [];
  bool _loading = true;

  @override void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final snap = await FirebaseFirestore.instance
          .collection(AppConstants.colJobs).limit(100).get();
      final list = snap.docs.map((d) {
        final data = d.data() as Map<String, dynamic>? ?? {};
        return {
          'id': d.id,
          'title': data['title'] as String? ?? data['name'] as String? ?? '',
          'organization': data['organization'] as String? ?? data['company'] as String? ?? '',
          'type': data['type'] as String? ?? '',
          'deadline': data['deadline'] as String? ?? '',
          'location': data['location'] as String? ?? 'টাঙ্গাইল',
          'url': data['url'] as String? ?? data['link'] as String? ?? '',
          'description': data['description'] as String? ?? '',
        };
      }).toList();
      list.sort((a, b) => (a['title'] as String).compareTo(b['title'] as String));
      setState(() { _items = list; _loading = false; });
    } catch (_) { setState(() => _loading = false); }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('চাকরির বিজ্ঞাপন')),
      body: _loading
          ? const ShimmerList(itemCount: 8)
          : _items.isEmpty
              ? const Center(child: Text('কোনো চাকরির বিজ্ঞাপন নেই',
                  style: TextStyle(color: Color(0xFF9CA3AF))))
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _items.length,
                    itemBuilder: (_, i) => _JobCard(job: _items[i]),
                  ),
                ),
    );
  }
}

class _JobCard extends StatelessWidget {
  final Map<String, dynamic> job;
  const _JobCard({required this.job});

  static const _typeColors = {
    'govt': Color(0xFF1D4ED8),
    'private': Color(0xFF059669),
    'bank': Color(0xFF7C3AED),
    'ngo': Color(0xFFD97706),
  };

  @override
  Widget build(BuildContext context) {
    final type = job['type'] as String;
    final color = _typeColors[type] ?? const Color(0xFF6B7280);
    final url = job['url'] as String;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06),
            blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10)),
                child: Icon(Icons.work_rounded, color: color, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(job['title'] as String,
                        style: const TextStyle(fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1F2937)),
                        maxLines: 2, overflow: TextOverflow.ellipsis),
                    if ((job['organization'] as String).isNotEmpty)
                      Text(job['organization'] as String,
                          style: TextStyle(fontSize: 12, color: color,
                              fontWeight: FontWeight.w600)),
                  ],
                ),
              ),
              if (type.isNotEmpty)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(color: color.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(6)),
                  child: Text(type, style: TextStyle(fontSize: 11, color: color,
                      fontWeight: FontWeight.w600)),
                ),
            ],
          ),
          if ((job['deadline'] as String).isNotEmpty) ...[
            const SizedBox(height: 8),
            Row(children: [
              const Icon(Icons.calendar_today_rounded, size: 13,
                  color: Color(0xFF9CA3AF)),
              const SizedBox(width: 4),
              Text('শেষ তারিখ: ${job['deadline']}',
                  style: const TextStyle(fontSize: 12,
                      color: Color(0xFF9CA3AF))),
            ]),
          ],
          if ((job['description'] as String).isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(job['description'] as String,
                maxLines: 2, overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
          ],
          if (url.isNotEmpty) ...[
            const SizedBox(height: 10),
            GestureDetector(
              onTap: () async {
                final uri = Uri.parse(url);
                if (await canLaunchUrl(uri)) {
                  launchUrl(uri, mode: LaunchMode.externalApplication);
                }
              },
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(8),
                ),
                alignment: Alignment.center,
                child: const Text('বিস্তারিত দেখুন',
                    style: TextStyle(color: Colors.white,
                        fontWeight: FontWeight.w600, fontSize: 13)),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
