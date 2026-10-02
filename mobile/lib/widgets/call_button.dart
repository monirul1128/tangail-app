import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/app_theme.dart';

class CallButton extends StatelessWidget {
  final String phone;
  final String? label;
  final bool expanded;

  const CallButton({
    super.key,
    required this.phone,
    this.label,
    this.expanded = false,
  });

  Future<void> _call() async {
    final uri = Uri(scheme: 'tel', path: phone);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    final btn = ElevatedButton.icon(
      onPressed: _call,
      icon: const Icon(Icons.phone_rounded, size: 18),
      label: Text(label ?? phone),
      style: ElevatedButton.styleFrom(
        backgroundColor: AppTheme.successColor,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
    return expanded ? SizedBox(width: double.infinity, child: btn) : btn;
  }
}
