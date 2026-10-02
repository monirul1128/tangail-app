import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../config/app_constants.dart';
import '../../config/app_theme.dart';
import '../../models/tourism_model.dart';
import '../../widgets/empty_state.dart';

final _tourismDetailProvider =
    FutureProvider.autoDispose.family<TourismModel?, String>((ref, id) async {
  final doc = await FirebaseFirestore.instance
      .collection(AppConstants.colTourism)
      .doc(id)
      .get();
  if (!doc.exists) return null;
  return TourismModel.fromFirestore(doc);
});

class TourismDetailScreen extends ConsumerWidget {
  final String tourismId;

  const TourismDetailScreen({super.key, required this.tourismId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final itemAsync = ref.watch(_tourismDetailProvider(tourismId));

    return itemAsync.when(
      loading: () => const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      ),
      error: (e, _) => Scaffold(
        appBar: AppBar(),
        body: EmptyState(
          icon: Icons.error_outline_rounded,
          message: 'ত্রুটি হয়েছে',
          onRetry: () => ref.refresh(_tourismDetailProvider(tourismId)),
        ),
      ),
      data: (item) {
        if (item == null) {
          return Scaffold(
            appBar: AppBar(),
            body: const EmptyState(
              icon: Icons.landscape_rounded,
              message: 'তথ্য পাওয়া যায়নি',
            ),
          );
        }

        return Scaffold(
          body: CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 240,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  background: item.imageUrl.isNotEmpty
                      ? Image.network(
                          item.imageUrl,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) =>
                              Container(color: AppTheme.backgroundColor),
                        )
                      : Container(
                          color: AppTheme.backgroundColor,
                          child: const Icon(Icons.landscape_rounded,
                              size: 80, color: AppTheme.textSecondary),
                        ),
                  title: Text(
                    item.name,
                    style: const TextStyle(
                        color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.name,
                        style: Theme.of(context).textTheme.headlineLarge,
                      ),
                      const SizedBox(height: 8),
                      if (item.category.isNotEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            item.category,
                            style: const TextStyle(
                                color: AppTheme.primaryColor,
                                fontWeight: FontWeight.w600),
                          ),
                        ),
                      const Divider(height: 24),
                      if (item.address.isNotEmpty) ...[
                        Row(
                          children: [
                            const Icon(Icons.location_on_rounded,
                                color: AppTheme.textSecondary, size: 18),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                item.address,
                                style: Theme.of(context).textTheme.bodyMedium,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                      ],
                      if (item.openingHours.isNotEmpty) ...[
                        Row(
                          children: [
                            const Icon(Icons.access_time_rounded,
                                color: AppTheme.textSecondary, size: 18),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                item.openingHours,
                                style: Theme.of(context).textTheme.bodyMedium,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                      ],
                      if (item.entryFee.isNotEmpty) ...[
                        Row(
                          children: [
                            const Icon(Icons.confirmation_number_rounded,
                                color: AppTheme.textSecondary, size: 18),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                item.entryFee,
                                style: Theme.of(context).textTheme.bodyMedium,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                      ],
                      const SizedBox(height: 8),
                      if (item.description.isNotEmpty)
                        Text(
                          item.description,
                          style: Theme.of(context)
                              .textTheme
                              .bodyMedium
                              ?.copyWith(height: 1.6),
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
