import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../config/app_constants.dart';
import '../../config/app_theme.dart';
import '../../models/gallery_item_model.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/empty_state.dart';

final _galleryCategoryProvider = StateProvider<String>((_) => '');

final galleryStreamProvider =
    StreamProvider.autoDispose<List<GalleryItemModel>>((ref) {
  return FirebaseFirestore.instance
      .collection(AppConstants.colGallery)
      .orderBy('createdAt', descending: true)
      .snapshots()
      .map((snap) => snap.docs
          .map((doc) => GalleryItemModel.fromFirestore(doc))
          .toList());
});

class GalleryScreen extends ConsumerWidget {
  const GalleryScreen({super.key});

  static const _categoryOptions = [
    ('', 'সব'),
    ('nature', 'প্রকৃতি'),
    ('cultural', 'সাংস্কৃতিক'),
    ('historical', 'ঐতিহাসিক'),
    ('event', 'অনুষ্ঠান'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedCategory = ref.watch(_galleryCategoryProvider);
    final itemsAsync = ref.watch(galleryStreamProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('ফটো গ্যালারি')),
      body: Column(
        children: [
          FilterChipRow(
            options: _categoryOptions,
            selected: selectedCategory,
            accentColor: AppTheme.primaryColor,
            onChanged: (v) =>
                ref.read(_galleryCategoryProvider.notifier).state = v,
          ),
          Expanded(
            child: itemsAsync.when(
              loading: () => const ShimmerList(itemCount: 9),
              error: (e, _) => EmptyState(
                icon: Icons.error_outline_rounded,
                message: 'ত্রুটি হয়েছে\nআবার চেষ্টা করুন',
                onRetry: () => ref.refresh(galleryStreamProvider),
              ),
              data: (items) {
                final filtered = selectedCategory.isEmpty
                    ? items
                    : items
                        .where((item) => item.category == selectedCategory)
                        .toList();

                if (filtered.isEmpty) {
                  return const EmptyState(
                    icon: Icons.photo_library_rounded,
                    message: 'কোনো ছবি পাওয়া যায়নি',
                  );
                }

                return GridView.count(
                  crossAxisCount: 3,
                  crossAxisSpacing: 2,
                  mainAxisSpacing: 2,
                  padding: EdgeInsets.zero,
                  children: filtered
                      .map((item) => GestureDetector(
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => _FullScreenImage(item: item),
                              ),
                            ),
                            child: Hero(
                              tag: item.id,
                              child: item.imageUrl.isNotEmpty
                                  ? Image.network(
                                      item.imageUrl,
                                      fit: BoxFit.cover,
                                      errorBuilder: (_, __, ___) =>
                                          Container(
                                            color: AppTheme.backgroundColor,
                                            child: const Icon(
                                                Icons.broken_image_rounded,
                                                color:
                                                    AppTheme.textSecondary),
                                          ),
                                    )
                                  : Container(
                                      color: AppTheme.backgroundColor,
                                      child: const Icon(
                                          Icons.photo_rounded,
                                          color: AppTheme.textSecondary),
                                    ),
                            ),
                          ))
                      .toList(),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _FullScreenImage extends StatelessWidget {
  final GalleryItemModel item;

  const _FullScreenImage({required this.item});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        title: Text(
          item.caption.isNotEmpty ? item.caption : 'ছবি',
          style: const TextStyle(color: Colors.white),
        ),
      ),
      body: Center(
        child: Hero(
          tag: item.id,
          child: item.imageUrl.isNotEmpty
              ? Image.network(
                  item.imageUrl,
                  fit: BoxFit.contain,
                  errorBuilder: (_, __, ___) => const Icon(
                    Icons.broken_image_rounded,
                    color: Colors.white54,
                    size: 80,
                  ),
                )
              : const Icon(Icons.photo_rounded,
                  color: Colors.white54, size: 80),
        ),
      ),
    );
  }
}
