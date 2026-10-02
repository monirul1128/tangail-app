import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../config/app_constants.dart';
import '../../config/app_theme.dart';
import '../../models/notable_person_model.dart';
import '../../widgets/filter_chip_row.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/empty_state.dart';

final _notablePersonsCategoryProvider = StateProvider<String>((_) => '');

final notablePersonsStreamProvider =
    StreamProvider.autoDispose<List<NotablePersonModel>>((ref) {
  return FirebaseFirestore.instance
      .collection(AppConstants.colNotablePersons)
      .orderBy('name')
      .snapshots()
      .map((snap) => snap.docs
          .map((doc) => NotablePersonModel.fromFirestore(doc))
          .toList());
});

class NotablePersonsScreen extends ConsumerWidget {
  const NotablePersonsScreen({super.key});

  static const _categoryOptions = [
    ('', 'সব'),
    ('politician', 'রাজনীতিবিদ'),
    ('artist', 'শিল্পী'),
    ('writer', 'সাহিত্যিক'),
    ('scientist', 'বিজ্ঞানী'),
    ('freedom_fighter', 'মুক্তিযোদ্ধা'),
    ('other', 'অন্যান্য'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedCategory = ref.watch(_notablePersonsCategoryProvider);
    final personsAsync = ref.watch(notablePersonsStreamProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('বিশিষ্ট ব্যক্তিবর্গ')),
      body: Column(
        children: [
          FilterChipRow(
            options: _categoryOptions,
            selected: selectedCategory,
            accentColor: AppTheme.primaryColor,
            onChanged: (v) =>
                ref.read(_notablePersonsCategoryProvider.notifier).state = v,
          ),
          Expanded(
            child: personsAsync.when(
              loading: () => const ShimmerList(itemCount: 8),
              error: (e, _) => EmptyState(
                icon: Icons.error_outline_rounded,
                message: 'ত্রুটি হয়েছে\nআবার চেষ্টা করুন',
                onRetry: () => ref.refresh(notablePersonsStreamProvider),
              ),
              data: (persons) {
                final filtered = selectedCategory.isEmpty
                    ? persons
                    : persons
                        .where((p) => p.category == selectedCategory)
                        .toList();

                if (filtered.isEmpty) {
                  return const EmptyState(
                    icon: Icons.people_rounded,
                    message: 'কোনো বিশিষ্ট ব্যক্তি পাওয়া যায়নি',
                  );
                }

                return GridView.count(
                  crossAxisCount: 2,
                  padding: const EdgeInsets.all(16),
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 0.75,
                  children: filtered
                      .map((person) => _PersonCard(
                            person: person,
                            onTap: () =>
                                context.push('/notable-persons/${person.id}'),
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

class _PersonCard extends StatelessWidget {
  final NotablePersonModel person;
  final VoidCallback onTap;

  const _PersonCard({required this.person, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
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
            // Photo
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
              child: person.imageUrl.isNotEmpty
                  ? Image.network(
                      person.imageUrl,
                      height: 140,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => _placeholder(),
                    )
                  : _placeholder(),
            ),
            // Info
            Padding(
              padding: const EdgeInsets.all(8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    person.name,
                    style: const TextStyle(
                        fontSize: 14, fontWeight: FontWeight.bold),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (person.designation.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(
                      person.designation,
                      style: const TextStyle(
                          fontSize: 11, color: AppTheme.textSecondary),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _placeholder() {
    return Container(
      height: 140,
      width: double.infinity,
      color: AppTheme.backgroundColor,
      child: const Icon(Icons.person_rounded,
          size: 56, color: AppTheme.textSecondary),
    );
  }
}
