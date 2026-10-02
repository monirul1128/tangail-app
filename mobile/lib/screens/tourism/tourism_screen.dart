import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../config/app_constants.dart';
import '../../config/app_theme.dart';
import '../../models/tourism_model.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/empty_state.dart';

final _tourismCategoryProvider = StateProvider<String>((_) => '');

final tourismStreamProvider =
    StreamProvider.autoDispose<List<TourismModel>>((ref) {
  return FirebaseFirestore.instance
      .collection(AppConstants.colTourism)
      .orderBy('name')
      .snapshots()
      .map((snap) =>
          snap.docs.map((doc) => TourismModel.fromFirestore(doc)).toList());
});

class TourismScreen extends ConsumerWidget {
  const TourismScreen({super.key});

  static const _categoryOptions = [
    ('', 'সব'),
    ('historical', 'ঐতিহাসিক'),
    ('natural', 'প্রাকৃতিক'),
    ('religious', 'ধর্মীয়'),
    ('recreational', 'বিনোদন'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedCategory = ref.watch(_tourismCategoryProvider);
    final itemsAsync = ref.watch(tourismStreamProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('পর্যটন স্থান')),
      body: Column(
        children: [
          FilterChipRow(
            options: _categoryOptions,
            selected: selectedCategory,
            accentColor: AppTheme.primaryColor,
            onChanged: (v) =>
                ref.read(_tourismCategoryProvider.notifier).state = v,
          ),
          Expanded(
            child: itemsAsync.when(
              loading: () => const ShimmerList(itemCount: 6),
              error: (e, _) => EmptyState(
                icon: Icons.error_outline_rounded,
                message: 'ত্রুটি হয়েছে\nআবার চেষ্টা করুন',
                onRetry: () => ref.refresh(tourismStreamProvider),
              ),
              data: (items) {
                final filtered = selectedCategory.isEmpty
                    ? items
                    : items
                        .where((t) => t.category == selectedCategory)
                        .toList();

                if (filtered.isEmpty) {
                  return const EmptyState(
                    icon: Icons.landscape_rounded,
                    message: 'কোনো পর্যটন স্থান পাওয়া যায়নি',
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: filtered.length,
                  itemBuilder: (_, i) => _TourismCard(
                    item: filtered[i],
                    onTap: () => context.push('/tourism/${filtered[i].id}'),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _TourismCard extends StatelessWidget {
  final TourismModel item;
  final VoidCallback onTap;

  const _TourismCard({required this.item, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
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
          children: [
            // Image
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
              child: item.imageUrl.isNotEmpty
                  ? Image.network(
                      item.imageUrl,
                      width: double.infinity,
                      height: 180,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => _imagePlaceholder(),
                    )
                  : _imagePlaceholder(),
            ),
            // Content
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.name,
                    style: Theme.of(context)
                        .textTheme
                        .headlineSmall
                        ?.copyWith(fontSize: 16),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      if (item.category.isNotEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            item.category,
                            style: const TextStyle(
                                fontSize: 11, color: AppTheme.primaryColor),
                          ),
                        ),
                      const Spacer(),
                      if (item.address.isNotEmpty)
                        Row(
                          children: [
                            const Icon(Icons.location_on_rounded,
                                size: 13, color: AppTheme.textSecondary),
                            const SizedBox(width: 3),
                            SizedBox(
                              width: 130,
                              child: Text(
                                item.address,
                                style: const TextStyle(
                                    fontSize: 11,
                                    color: AppTheme.textSecondary),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _imagePlaceholder() {
    return Container(
      width: double.infinity,
      height: 180,
      color: AppTheme.backgroundColor,
      child: const Icon(Icons.landscape_rounded,
          size: 60, color: AppTheme.textSecondary),
    );
  }
}
