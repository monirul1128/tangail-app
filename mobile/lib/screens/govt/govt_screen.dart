import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class GovtScreen extends StatelessWidget {
  final String initialType;
  const GovtScreen({super.key, this.initialType = ''});

  // All govt service types with their content
  static const _services = {
    'birth': {
      'title': 'জন্ম নিবন্ধন',
      'icon': '📋',
      'color': 0xFF1D4ED8,
      'intro': 'জন্ম নিবন্ধন বাংলাদেশের প্রতিটি নাগরিকের জন্য বাধ্যতামূলক। এটি পরিচয়পত্র, পাসপোর্ট, স্কুল ভর্তিসহ সব সরকারি সেবার জন্য প্রয়োজন।',
      'items': [
        {'name': 'অনলাইনে আবেদন', 'desc': 'bdris.gov.bd-তে গিয়ে নতুন নিবন্ধন করুন', 'url': 'https://bdris.gov.bd'},
        {'name': 'সনদ যাচাই', 'desc': 'জন্ম নিবন্ধন সনদের সত্যতা যাচাই করুন', 'url': 'https://bdris.gov.bd'},
        {'name': 'তথ্য সংশোধন', 'desc': 'ভুল তথ্য সংশোধনের আবেদন করুন', 'url': 'https://bdris.gov.bd'},
        {'name': 'স্থানীয় অফিস', 'desc': 'ইউনিয়ন পরিষদ / সিটি কর্পোরেশন অফিসে যোগাযোগ করুন', 'url': ''},
      ],
      'mainLink': 'https://bdris.gov.bd',
      'mainLinkLabel': 'জন্ম ও মৃত্যু নিবন্ধন পোর্টাল',
    },
    'land': {
      'title': 'ই-নামজারি (ভূমি সেবা)',
      'icon': '🏡',
      'color': 0xFF059669,
      'intro': 'ভূমি সেবা ডিজিটাল করা হয়েছে। জমির নামজারি, খতিয়ান বের করা, মিউটেশন সহ সকল ভূমি সেবা এখন অনলাইনে পাওয়া যায়।',
      'items': [
        {'name': 'ই-নামজারি', 'desc': 'অনলাইনে জমি নামজারির আবেদন করুন', 'url': 'https://enamjuri.gov.bd'},
        {'name': 'খতিয়ান/পর্চা', 'desc': 'আরএস, বিএস, সিএস খতিয়ান দেখুন', 'url': 'https://eporcha.gov.bd'},
        {'name': 'ভূমি উন্নয়ন কর', 'desc': 'অনলাইনে ভূমি কর পরিশোধ করুন', 'url': 'https://ldtax.gov.bd'},
        {'name': 'অনলাইন ম্যাপ', 'desc': 'মৌজা ম্যাপ দেখুন', 'url': 'https://map.icslandrecords.gov.bd'},
      ],
      'mainLink': 'https://enamjuri.gov.bd',
      'mainLinkLabel': 'ই-নামজারি পোর্টাল',
    },
    'voter': {
      'title': 'ভোটার সেবা',
      'icon': '🗳️',
      'color': 0xFF7C3AED,
      'intro': 'জাতীয় নির্বাচন কমিশনের অধীনে ভোটার নিবন্ধন, এনআইডি সংশোধন এবং ভোটার তথ্য যাচাই করা যায়।',
      'items': [
        {'name': 'ভোটার তথ্য যাচাই', 'desc': 'আপনার ভোটার তথ্য ও কেন্দ্র দেখুন', 'url': 'https://services.nidw.gov.bd'},
        {'name': 'NID সংশোধন', 'desc': 'জাতীয় পরিচয়পত্রের তথ্য সংশোধন করুন', 'url': 'https://services.nidw.gov.bd'},
        {'name': 'নতুন ভোটার', 'desc': '১৮+ বয়সীদের ভোটার নিবন্ধন', 'url': 'https://services.nidw.gov.bd'},
        {'name': 'NID ডাউনলোড', 'desc': 'ডিজিটাল NID কার্ড ডাউনলোড করুন', 'url': 'https://services.nidw.gov.bd'},
      ],
      'mainLink': 'https://services.nidw.gov.bd',
      'mainLinkLabel': 'NID সেবা পোর্টাল',
    },
    'court': {
      'title': 'আদালত সেবা',
      'icon': '⚖️',
      'color': 0xFFDC2626,
      'intro': 'টাঙ্গাইল জেলা জজ আদালত এবং বিভিন্ন আদালতের তথ্য ও সেবা। মামলার তথ্য, আইনি সহায়তা এবং বিচার বিভাগীয় সেবা।',
      'items': [
        {'name': 'মামলার তথ্য', 'desc': 'বিচার বিভাগীয় পোর্টালে মামলার অবস্থা দেখুন', 'url': 'https://www.judiciary.org.bd'},
        {'name': 'আইনি সহায়তা', 'desc': 'বিনামূল্যে আইনি সহায়তার জন্য আবেদন করুন', 'url': 'https://www.nlaso.gov.bd'},
        {'name': 'জেলা জজ আদালত', 'desc': 'টাঙ্গাইল জেলা জজ আদালত, টাঙ্গাইল', 'url': ''},
        {'name': 'নারী ও শিশু আদালত', 'desc': 'নারী ও শিশু নির্যাতন দমন ট্রাইব্যুনাল', 'url': ''},
      ],
      'mainLink': 'https://www.judiciary.org.bd',
      'mainLinkLabel': 'বিচার বিভাগীয় পোর্টাল',
    },
  };

  // Fallback — show all govt services
  static const _allServices = [
    {'title': 'জন্ম নিবন্ধন', 'icon': '📋', 'url': 'https://bdris.gov.bd'},
    {'title': 'ই-নামজারি', 'icon': '🏡', 'url': 'https://enamjuri.gov.bd'},
    {'title': 'ভূমি কর পরিশোধ', 'icon': '💵', 'url': 'https://ldtax.gov.bd'},
    {'title': 'NID / ভোটার সেবা', 'icon': '🪪', 'url': 'https://services.nidw.gov.bd'},
    {'title': 'পাসপোর্ট আবেদন', 'icon': '🛂', 'url': 'https://www.epassport.gov.bd'},
    {'title': 'ড্রাইভিং লাইসেন্স', 'icon': '🚗', 'url': 'https://bsp.brta.gov.bd'},
    {'title': 'টিন সার্টিফিকেট', 'icon': '📄', 'url': 'https://incometax.gov.bd'},
    {'title': 'মুক্তিযোদ্ধা তথ্য', 'icon': '🎖️', 'url': 'https://www.badhan.gov.bd'},
    {'title': 'বিচার বিভাগ', 'icon': '⚖️', 'url': 'https://www.judiciary.org.bd'},
    {'title': 'জেলা প্রশাসন টাঙ্গাইল', 'icon': '🏛️', 'url': 'https://www.tangail.gov.bd'},
    {'title': 'নির্বাচন কমিশন', 'icon': '🗳️', 'url': 'https://www.ecs.gov.bd'},
    {'title': 'আইনি সহায়তা', 'icon': '👨‍⚖️', 'url': 'https://www.nlaso.gov.bd'},
  ];

  @override
  Widget build(BuildContext context) {
    final serviceData = _services[initialType];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F6F8),
      appBar: AppBar(
        title: Text(serviceData != null
            ? serviceData['title'] as String
            : 'সরকারি সেবা'),
      ),
      body: serviceData != null
          ? _ServiceDetailPage(data: serviceData)
          : _AllServicesPage(services: _allServices),
    );
  }
}

// ── Detail page for a specific service type ───────────────────────────────────
class _ServiceDetailPage extends StatelessWidget {
  final Map<String, dynamic> data;
  const _ServiceDetailPage({required this.data});

  @override
  Widget build(BuildContext context) {
    final color = Color(data['color'] as int);
    final items = data['items'] as List<Map<String, dynamic>>;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Header
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [color, color.withOpacity(0.75)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              Text(data['icon'] as String,
                  style: const TextStyle(fontSize: 44)),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(data['title'] as String,
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.w900)),
                    const SizedBox(height: 2),
                    Text('সরকারি সেবা',
                        style: TextStyle(
                            color: Colors.white.withOpacity(0.8),
                            fontSize: 12)),
                  ],
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 14),

        // Intro
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: color.withOpacity(0.07),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: color.withOpacity(0.2)),
          ),
          child: Text(data['intro'] as String,
              style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFF374151),
                  height: 1.6)),
        ),

        const SizedBox(height: 16),

        Text('সেবাসমূহ',
            style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w800,
                color: color)),
        const SizedBox(height: 10),

        ...items.map((item) {
          final url = item['url'] as String;
          return Container(
            margin: const EdgeInsets.only(bottom: 8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 6,
                  offset: const Offset(0, 2))],
            ),
            child: ListTile(
              contentPadding: const EdgeInsets.symmetric(
                  horizontal: 14, vertical: 6),
              leading: Container(
                width: 40, height: 40,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(Icons.open_in_new_rounded,
                    color: color, size: 18),
              ),
              title: Text(item['name'] as String,
                  style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF1F2937))),
              subtitle: Text(item['desc'] as String,
                  style: const TextStyle(
                      fontSize: 12, color: Color(0xFF6B7280))),
              trailing: url.isNotEmpty
                  ? Icon(Icons.arrow_forward_ios_rounded,
                      size: 14, color: color)
                  : null,
              onTap: url.isNotEmpty
                  ? () async {
                      final uri = Uri.parse(url);
                      if (await canLaunchUrl(uri)) {
                        launchUrl(uri,
                            mode: LaunchMode.externalApplication);
                      }
                    }
                  : null,
            ),
          );
        }),

        const SizedBox(height: 16),

        // Main link button
        GestureDetector(
          onTap: () async {
            final uri = Uri.parse(data['mainLink'] as String);
            if (await canLaunchUrl(uri)) {
              launchUrl(uri, mode: LaunchMode.externalApplication);
            }
          },
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 14),
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.language_rounded,
                    color: Colors.white, size: 18),
                const SizedBox(width: 8),
                Text(data['mainLinkLabel'] as String,
                    style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 14)),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),
      ],
    );
  }
}

// ── All services grid page ────────────────────────────────────────────────────
class _AllServicesPage extends StatelessWidget {
  final List<Map<String, dynamic>> services;
  const _AllServicesPage({required this.services});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: services.length,
      itemBuilder: (_, i) {
        final s = services[i];
        final url = s['url'] as String;
        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 6,
                offset: const Offset(0, 1))],
          ),
          child: ListTile(
            leading: Container(
              width: 40, height: 40,
              decoration: BoxDecoration(
                color: const Color(0xFFFAF5FF),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(
                child: Text(s['icon'] as String,
                    style: const TextStyle(fontSize: 20)),
              ),
            ),
            title: Text(s['title'] as String,
                style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF1F2937))),
            trailing: const Icon(Icons.open_in_new_rounded,
                size: 16, color: Color(0xFF9CA3AF)),
            onTap: () async {
              final uri = Uri.parse(url);
              if (await canLaunchUrl(uri)) {
                launchUrl(uri, mode: LaunchMode.externalApplication);
              }
            },
          ),
        );
      },
    );
  }
}
