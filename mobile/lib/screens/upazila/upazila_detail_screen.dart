import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_constants.dart';
import '../../config/app_theme.dart';

class UpazilaDetailScreen extends StatefulWidget {
  final String upazilaId;
  const UpazilaDetailScreen({super.key, required this.upazilaId});

  @override
  State<UpazilaDetailScreen> createState() => _UpazilaDetailScreenState();
}

class _UpazilaDetailScreenState extends State<UpazilaDetailScreen> {
  // union name → list of village names
  Map<String, List<String>> _unionVillages = {};
  bool _loading = true;

  // upazila id → txt filename
  static const _fileMap = {
    'tangail_sadar': 'tangail sadar.txt',
    'basail':        'basail.txt',
    'bhuapur':       'vuapur.txt',
    'delduar':       'deluar.txt',
    'dhanbari':      'dhonbari.txt',
    'ghatail':       'ghatail.txt',
    'gopalpur':      'goplapur.txt',
    'kalihati':      'kalihati.txt',
    'madhupur':      'modhupur.txt',
    'mirzapur':      'mirzapur.txt',
    'nagarpur':      'nagorpur.txt',
    'sakhipur':      'sokhipur.txt',
  };

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final fileName = _fileMap[widget.upazilaId];
    if (fileName == null) {
      setState(() => _loading = false);
      return;
    }

    try {
      final raw = await rootBundle.loadString('assets/upazilla/$fileName');
      final Map<String, List<String>> result = {};

      for (final line in raw.split('\n')) {
        final trimmed = line.trim();
        if (trimmed.isEmpty) continue;
        // Skip header line
        if (trimmed.contains('উপজেলার গ্রামসমূহ')) continue;

        // Format: "গ্রাম — ইউনিয়ন" (em dash or —)
        final parts = trimmed.split(RegExp(r'\s*[—–-]+\s*'));
        if (parts.length >= 2) {
          final village = parts[0].trim();
          final union   = parts[1].trim();
          if (village.isNotEmpty && union.isNotEmpty) {
            result.putIfAbsent(union, () => []).add(village);
          }
        }
      }

      setState(() { _unionVillages = result; _loading = false; });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  Map<String, dynamic>? get _upazila {
    try {
      return AppConstants.upazilas.firstWhere((u) => u['id'] == widget.upazilaId);
    } catch (_) { return null; }
  }

  @override
  Widget build(BuildContext context) {
    final upazila = _upazila;
    final name = upazila?['name'] as String? ?? widget.upazilaId;
    final area = upazila?['area'] as int? ?? 0;
    final unionCount = _unionVillages.isNotEmpty
        ? _unionVillages.length
        : (upazila?['unionCount'] as int? ?? 0);
    final villageCount = _unionVillages.values.fold(0, (s, v) => s + v.length);

    return Scaffold(
      backgroundColor: const Color(0xFFF4F6F8),
      appBar: AppBar(title: Text(name)),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // ── Hero card ─────────────────────────────────────────
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF006A4E), Color(0xFF009966)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(name,
                          style: const TextStyle(color: Colors.white,
                              fontSize: 24, fontWeight: FontWeight.w900)),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          _StatChip(icon: Icons.map_rounded,
                              label: '$area বর্গকিমি'),
                          const SizedBox(width: 8),
                          _StatChip(icon: Icons.account_tree_rounded,
                              label: '$unionCount টি ইউনিয়ন'),
                          if (villageCount > 0) ...[
                            const SizedBox(width: 8),
                            _StatChip(icon: Icons.holiday_village_rounded,
                                label: '$villageCount টি গ্রাম'),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // ── Union → Village accordion ─────────────────────────
                const Padding(
                  padding: EdgeInsets.only(bottom: 10),
                  child: Row(
                    children: [
                      Icon(Icons.account_tree_rounded,
                          color: Color(0xFF006A4E), size: 20),
                      SizedBox(width: 8),
                      Text('ইউনিয়ন ও গ্রামসমূহ',
                          style: TextStyle(fontSize: 17,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF1F2937))),
                    ],
                  ),
                ),

                if (_unionVillages.isEmpty)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24),
                      child: Text('তথ্য পাওয়া যায়নি',
                          style: TextStyle(color: Color(0xFF9CA3AF))),
                    ),
                  )
                else
                  ..._unionVillages.entries.map((entry) =>
                      _UnionTile(
                        unionName: entry.key,
                        villages: entry.value,
                      )),

                const SizedBox(height: 20),

                // ── Quick service buttons ─────────────────────────────
                const Padding(
                  padding: EdgeInsets.only(bottom: 12),
                  child: Text('দ্রুত সেবা',
                      style: TextStyle(fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF1F2937))),
                ),
                Row(
                  children: [
                    _ServiceBtn(label: 'হাসপাতাল',
                        icon: Icons.local_hospital_rounded,
                        color: const Color(0xFF006A4E),
                        onTap: () => context.push('/hospitals')),
                    const SizedBox(width: 8),
                    _ServiceBtn(label: 'ডাক্তার',
                        icon: Icons.medical_services_rounded,
                        color: const Color(0xFF0066CC),
                        onTap: () => context.push('/doctors')),
                    const SizedBox(width: 8),
                    _ServiceBtn(label: 'রক্তদাতা',
                        icon: Icons.water_drop_rounded,
                        color: const Color(0xFFDC2626),
                        onTap: () => context.push('/blood-donors')),
                  ],
                ),
                const SizedBox(height: 24),
              ],
            ),
    );
  }
}

// ── Union tile with collapsible village list ──────────────────────────────────
class _UnionTile extends StatefulWidget {
  final String unionName;
  final List<String> villages;
  const _UnionTile({required this.unionName, required this.villages});

  @override
  State<_UnionTile> createState() => _UnionTileState();
}

class _UnionTileState extends State<_UnionTile> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05),
            blurRadius: 6, offset: const Offset(0, 2))],
      ),
      child: Column(
        children: [
          // Union header — tap to expand
          GestureDetector(
            onTap: () => setState(() => _expanded = !_expanded),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
              decoration: BoxDecoration(
                color: _expanded
                    ? const Color(0xFF006A4E).withOpacity(0.06)
                    : Colors.white,
                borderRadius: _expanded
                    ? const BorderRadius.vertical(top: Radius.circular(12))
                    : BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Container(
                    width: 36, height: 36,
                    decoration: BoxDecoration(
                      color: const Color(0xFF006A4E).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.location_city_rounded,
                        color: Color(0xFF006A4E), size: 18),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(widget.unionName,
                            style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF1F2937))),
                        Text('${widget.villages.length}টি গ্রাম',
                            style: const TextStyle(
                                fontSize: 11,
                                color: Color(0xFF9CA3AF))),
                      ],
                    ),
                  ),
                  Icon(
                    _expanded
                        ? Icons.keyboard_arrow_up_rounded
                        : Icons.keyboard_arrow_down_rounded,
                    color: const Color(0xFF006A4E),
                    size: 22,
                  ),
                ],
              ),
            ),
          ),

          // Village list — shown when expanded
          if (_expanded) ...[
            const Divider(height: 1, indent: 14, endIndent: 14),
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 8, 14, 12),
              child: Wrap(
                spacing: 8,
                runSpacing: 6,
                children: widget.villages.map((v) => Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF0FDF4),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                        color: const Color(0xFF006A4E).withOpacity(0.2)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.holiday_village_rounded,
                          size: 11, color: Color(0xFF006A4E)),
                      const SizedBox(width: 4),
                      Text(v,
                          style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF065F46),
                              fontWeight: FontWeight.w500)),
                    ],
                  ),
                )).toList(),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

// ── Small helper widgets ──────────────────────────────────────────────────────
class _StatChip extends StatelessWidget {
  final IconData icon;
  final String label;
  const _StatChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white70, size: 13),
          const SizedBox(width: 4),
          Text(label,
              style: const TextStyle(
                  color: Colors.white, fontSize: 11,
                  fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

class _ServiceBtn extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;
  const _ServiceBtn({required this.label, required this.icon,
      required this.color, required this.onTap});

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
              Icon(icon, color: color, size: 24),
              const SizedBox(height: 4),
              Text(label,
                  style: TextStyle(fontSize: 11, color: color,
                      fontWeight: FontWeight.w600)),
            ],
          ),
        ),
      ),
    );
  }
}
