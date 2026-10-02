import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// A search bar that navigates to a feature screen based on keyword detection.
class SearchBarWidget extends StatefulWidget {
  const SearchBarWidget({super.key});

  @override
  State<SearchBarWidget> createState() => _SearchBarWidgetState();
}

class _SearchBarWidgetState extends State<SearchBarWidget> {
  final TextEditingController _controller = TextEditingController();

  void _handleQuery(String query) {
    if (query.trim().isEmpty) return;
    final q = query.trim();

    String route;
    if (q.contains('হাসপাতাল')) {
      route = '/hospitals';
    } else if (q.contains('ডাক্তার')) {
      route = '/doctors';
    } else if (q.contains('রক্ত')) {
      route = '/blood-donors';
    } else if (q.contains('অ্যাম্বুলেন্স')) {
      route = '/ambulance';
    } else if (q.contains('ফার্মেসি')) {
      route = '/pharmacy';
    } else if (q.contains('পুলিশ')) {
      route = '/police';
    } else {
      route = '/news';
    }

    context.go(route);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _controller,
      textInputAction: TextInputAction.search,
      onSubmitted: _handleQuery,
      decoration: InputDecoration(
        hintText: 'কী খুঁজছেন?',
        suffixIcon: IconButton(
          icon: const Icon(Icons.mic_rounded),
          onPressed: () {},
        ),
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(24),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(24),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(24),
          borderSide: BorderSide.none,
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      ),
    );
  }
}
