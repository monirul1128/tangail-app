import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_constants.dart';
import '../../config/app_theme.dart';

// ─────────────────────────────────────────────
// Icon helper — maps icon name string → IconData
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
  };
  return map[name] ?? Icons.circle_rounded;
}

/// Full-screen grid of all service categories.
class ServicesMenuScreen extends StatelessWidget {
  const ServicesMenuScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('সকল সেবা'),
      ),
      body: GridView.count(
        crossAxisCount: 2,
        padding: const EdgeInsets.all(16),
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.0,
        children: AppConstants.serviceCategories.map((cat) {
          final icon = _iconFromName(cat['icon'] as String);
          final label = cat['label'] as String;
          final route = cat['route'] as String;
          final color = Color(cat['colorHex'] as int);
          return _ServiceMenuCard(
            icon: icon,
            label: label,
            route: route,
            color: color,
          );
        }).toList(),
      ),
    );
  }
}

class _ServiceMenuCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String route;
  final Color color;

  const _ServiceMenuCard({
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
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: color.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 32),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
