import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../config/app_constants.dart';
import '../../config/app_theme.dart';
import '../../models/notable_person_model.dart';
import '../../widgets/empty_state.dart';

final _notablePersonDetailProvider =
    FutureProvider.autoDispose.family<NotablePersonModel?, String>((ref, id) async {
  final doc = await FirebaseFirestore.instance
      .collection(AppConstants.colNotablePersons)
      .doc(id)
      .get();
  if (!doc.exists) return null;
  return NotablePersonModel.fromFirestore(doc);
});

class NotablePersonDetailScreen extends ConsumerWidget {
  final String personId;

  const NotablePersonDetailScreen({super.key, required this.personId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final personAsync = ref.watch(_notablePersonDetailProvider(personId));

    return personAsync.when(
      loading: () => const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      ),
      error: (e, _) => Scaffold(
        appBar: AppBar(),
        body: EmptyState(
          icon: Icons.error_outline_rounded,
          message: 'ত্রুটি হয়েছে',
          onRetry: () => ref.refresh(_notablePersonDetailProvider(personId)),
        ),
      ),
      data: (person) {
        if (person == null) {
          return Scaffold(
            appBar: AppBar(),
            body: const EmptyState(
              icon: Icons.person_off_rounded,
              message: 'তথ্য পাওয়া যায়নি',
            ),
          );
        }

        return Scaffold(
          body: CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 250,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  background: person.imageUrl.isNotEmpty
                      ? Image.network(
                          person.imageUrl,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) =>
                              Container(color: AppTheme.backgroundColor),
                        )
                      : Container(
                          color: AppTheme.backgroundColor,
                          child: const Icon(Icons.person_rounded,
                              size: 80, color: AppTheme.textSecondary),
                        ),
                  title: Text(
                    person.name,
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
                        person.name,
                        style: Theme.of(context).textTheme.headlineLarge,
                      ),
                      const SizedBox(height: 8),
                      if (person.designation.isNotEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            person.designation,
                            style: const TextStyle(
                                color: AppTheme.primaryColor,
                                fontWeight: FontWeight.w600),
                          ),
                        ),
                      const SizedBox(height: 8),
                      if (person.birthYear > 0)
                        Chip(
                          label: Text('জন্ম: ${person.birthYear}'),
                          backgroundColor: AppTheme.backgroundColor,
                        ),
                      if (person.category.isNotEmpty)
                        Chip(
                          label: Text(person.category),
                          backgroundColor: AppTheme.backgroundColor,
                        ),
                      const Divider(height: 24),
                      if (person.bio.isNotEmpty)
                        Text(
                          person.bio,
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
