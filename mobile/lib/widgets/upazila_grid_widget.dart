import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../config/app_constants.dart';
import '../config/app_theme.dart';

/// A 2-column grid of upazila cards. Tapping a card pushes '/upazila/{id}'.
class UpazilaGridWidget extends StatelessWidget {
  final VoidCallback? onUpazilaSelected;

  const UpazilaGridWidget({super.key, this.onUpazilaSelected});

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.8,
      children: AppConstants.upazilas.map((u) {
        final id = u['id'] as String;
        final name = u['name'] as String;
        final unionCount = u['unionCount'] as int;
        final area = u['area'] as int;

        return GestureDetector(
          onTap: () {
            onUpazilaSelected?.call();
            context.push('/upazila/$id');
          },
          child: Container(
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
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textPrimary),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  '$unionCountটি ইউনিয়ন • $area বর্গকিমি',
                  style: const TextStyle(
                      fontSize: 11, color: AppTheme.textSecondary),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
