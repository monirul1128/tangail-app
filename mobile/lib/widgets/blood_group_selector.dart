import 'package:flutter/material.dart';
import '../config/app_constants.dart';
import '../config/app_theme.dart';

/// A 4×2 grid of blood-group buttons. Calls [onSelected] with the chosen group.
class BloodGroupSelector extends StatelessWidget {
  final void Function(String) onSelected;

  const BloodGroupSelector({super.key, required this.onSelected});

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 4,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 8,
      crossAxisSpacing: 8,
      childAspectRatio: 1.4,
      children: AppConstants.bloodGroups.map((group) {
        return ElevatedButton(
          onPressed: () => onSelected(group),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.secondaryColor,
            foregroundColor: Colors.white,
            padding: EdgeInsets.zero,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            textStyle: const TextStyle(
                fontSize: 15, fontWeight: FontWeight.bold),
          ),
          child: Text(group),
        );
      }).toList(),
    );
  }
}
