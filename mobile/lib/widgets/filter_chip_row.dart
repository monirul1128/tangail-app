import 'package:flutter/material.dart';
import '../config/app_theme.dart';

/// A horizontal scrollable row of [FilterChip] widgets.
///
/// [options] is a list of (id, label) records.
/// [selected] is the currently selected id.
/// [accentColor] is used for the selected chip highlight.
/// [onChanged] is called with the tapped id.
class FilterChipRow extends StatelessWidget {
  final List<(String, String)> options;
  final String selected;
  final Color accentColor;
  final ValueChanged<String> onChanged;

  const FilterChipRow({
    super.key,
    required this.options,
    required this.selected,
    required this.accentColor,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        itemCount: options.length,
        itemBuilder: (_, i) {
          final (id, label) = options[i];
          final isSelected = selected == id;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: FilterChip(
              label: Text(label),
              selected: isSelected,
              onSelected: (_) => onChanged(id),
              selectedColor: accentColor.withOpacity(0.15),
              checkmarkColor: accentColor,
              labelStyle: TextStyle(
                color: isSelected ? accentColor : AppTheme.textSecondary,
                fontSize: 12,
                fontWeight:
                    isSelected ? FontWeight.w600 : FontWeight.normal,
              ),
            ),
          );
        },
      ),
    );
  }
}
