import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

/// A tappable phone chip that always shows the number in Latin (English) digits.
/// Hind Siliguri font renders digits as Bengali — this widget forces Roboto/sans-serif.
class PhoneChip extends StatelessWidget {
  final String phone;
  final Color color;
  final Color bgColor;

  const PhoneChip({
    super.key,
    required this.phone,
    this.color = const Color(0xFF059669),
    this.bgColor = const Color(0xFFF0FDF4),
  });

  Future<void> _call() async {
    final uri = Uri(scheme: 'tel', path: phone);
    if (await canLaunchUrl(uri)) launchUrl(uri);
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _call,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.phone_rounded, size: 14, color: color),
            const SizedBox(width: 6),
            ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 140),
              child: Text(
                phone,
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
                style: TextStyle(
                  fontFamily: 'Roboto',
                  fontSize: 13,
                  color: color,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.3,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Helper to wrap any phone number text with Latin digits
class PhoneText extends StatelessWidget {
  final String phone;
  final TextStyle? style;

  const PhoneText(this.phone, {super.key, this.style});

  @override
  Widget build(BuildContext context) {
    return Text(
      phone,
      style: (style ?? const TextStyle()).copyWith(
        fontFamily: 'Roboto',
      ),
    );
  }
}
