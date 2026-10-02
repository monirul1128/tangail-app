import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../widgets/shimmer_list.dart';

// govt_services collection থেকে পাওয়া না গেলে static useful links দেখাবে
final govtStreamProvider = StreamProvider.autoDispose<List<Map<String, dynamic>>>((ref) {
  return FirebaseFirestore.instance
      .collection('govt_services')
      .limit(100)
      .snapshots()
      .map((snap) => snap.docs
          .map((d) => {'id': d.id, ...d.data()})
          .toList());
});

class GovtScreen extends ConsumerWidget {
  const GovtScreen({super.key});

  // Static govt services shown when Firestore is empty
  static const _staticServices = [
    {'title': 'জন্ম ও মৃত্যু নিবন্ধন', 'url': 'https://bdris.gov.bd', 'icon': '📋'},
    {'title': 'ই-নামজারি (ভূমি সেবা)', 'url': 'https://enamjuri.gov.bd', 'icon': '🏡'},
    {'title': 'জাতীয় পরিচয়পত্র সেবা', 'url': 'https://services.nidw.gov.bd', 'icon': '🪪'},
    {'title': 'পাসপোর্ট আবেদন', 'url': 'https://www.epassport.gov.bd', 'icon': '🛂'},
    {'title': 'ড্রাইভিং লাইসেন্স', 'url': 'https://bsp.brta.gov.bd', 'icon': '🚗'},
    {'title': 'ট্রেড লাইসেন্স', 'url': 'https://www.tangail.gov.bd', 'icon': '🏢'},
    {'title': 'সরকারি নোটিশ', 'url': 'https://www.tangail.gov.bd', 'icon': '📢'},
    {'title': 'কোর্ট তথ্য', 'url': 'https://www.judiciary.org.bd', 'icon': '⚖️'},
    {'title': 'নির্বাচন কমিশন', 'url': 'https://www.ecs.gov.bd', 'icon': '🗳️'},
    {'title': 'জেলা প্রশাসন টাঙ্গাইল', 'url': 'https://www.tangail.gov.bd', 'icon': '🏛️'},
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final itemsAsync = ref.watch(govtStreamProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF4F6F8),
      appBar: AppBar(title: const Text('সরকারি সেবা')),
      body: itemsAsync.when(
        loading: () => const ShimmerList(itemCount: 6),
        error: (_, __) => _StaticGovtLinks(services: _staticServices),
        data: (items) {
          if (items.isEmpty) {
            return _StaticGovtLinks(services: _staticServices);
          }
          return RefreshIndicator(
            onRefresh: () async => ref.invalidate(govtStreamProvider),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (_, i) {
                final item = items[i];
                return _GovtCard(
                  title: item['name'] as String? ?? item['title'] as String? ?? '',
                  subtitle: item['address'] as String? ?? item['description'] as String? ?? '',
                  phones: item['phone'] is List
                      ? List<String>.from(item['phone'] as List)
                      : item['phone'] != null ? [item['phone'].toString()] : [],
                  url: item['website'] as String? ?? '',
                );
              },
            ),
          );
        },
      ),
    );
  }
}

class _StaticGovtLinks extends StatelessWidget {
  final List<Map<String, dynamic>> services;
  const _StaticGovtLinks({required this.services});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: services.length,
      itemBuilder: (_, i) {
        final s = services[i];
        return GestureDetector(
          onTap: () async {
            final url = Uri.parse(s['url'] as String);
            if (await canLaunchUrl(url)) launchUrl(url, mode: LaunchMode.externalApplication);
          },
          child: Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 2))],
            ),
            child: Row(
              children: [
                Container(
                  width: 44, height: 44,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFAF5FF),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Center(child: Text(s['icon'] as String, style: const TextStyle(fontSize: 22))),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(s['title'] as String,
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF1F2937))),
                ),
                const Icon(Icons.open_in_new_rounded, size: 16, color: Color(0xFF9CA3AF)),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _GovtCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final List<String> phones;
  final String url;
  const _GovtCard({required this.title, required this.subtitle, required this.phones, required this.url});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFFFAF5FF),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.account_balance_rounded, color: Color(0xFF7E22CE), size: 20),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(title,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF1F2937))),
              ),
            ],
          ),
          if (subtitle.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(subtitle, style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
          ],
          if (phones.isNotEmpty) ...[
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: phones.map((p) => GestureDetector(
                onTap: () async {
                  final uri = Uri(scheme: 'tel', path: p);
                  if (await canLaunchUrl(uri)) launchUrl(uri);
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF0FDF4),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.phone_rounded, size: 12, color: Color(0xFF15803D)),
                      const SizedBox(width: 4),
                      Text(p, style: const TextStyle(fontSize: 12, color: Color(0xFF15803D), fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              )).toList(),
            ),
          ],
        ],
      ),
    );
  }
}
