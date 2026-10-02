import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../config/app_theme.dart';

class MainScaffold extends StatelessWidget {
  final Widget child;
  const MainScaffold({super.key, required this.child});

  static const _tabs = [
    _TabItem(path: '/',          icon: Icons.home_rounded,             label: 'হোম'),
    _TabItem(path: '/hospitals', icon: Icons.local_hospital_rounded,   label: 'হাসপাতাল'),
    _TabItem(path: '/doctors',   icon: Icons.medical_services_rounded, label: 'ডাক্তার'),
    _TabItem(path: '/services',  icon: Icons.grid_view_rounded,        label: 'সেবা'),
    _TabItem(path: '/more',      icon: Icons.more_horiz_rounded,       label: 'আরও'),
  ];

  int _currentIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    for (int i = 0; i < _tabs.length; i++) {
      if (location == _tabs[i].path) return i;
    }
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final currentIndex = _currentIndex(context);

    return Scaffold(
      body: child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: currentIndex,
        onDestinationSelected: (i) => context.go(_tabs[i].path),
        backgroundColor: Colors.white,
        indicatorColor: AppTheme.primaryColor.withOpacity(0.12),
        shadowColor: Colors.black12,
        elevation: 8,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        destinations: _tabs.map((t) {
          return NavigationDestination(
            icon: Icon(t.icon, color: AppTheme.textSecondary),
            selectedIcon: Icon(t.icon, color: AppTheme.primaryColor),
            label: t.label,
          );
        }).toList(),
      ),
    );
  }
}

class _TabItem {
  final String path;
  final IconData icon;
  final String label;
  const _TabItem({required this.path, required this.icon, required this.label});
}
