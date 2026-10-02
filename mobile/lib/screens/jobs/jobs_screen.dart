import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/app_constants.dart';
import '../../config/app_theme.dart';
import '../../models/generic_service_model.dart';
import '../../services/generic_service_service.dart';
import '../../widgets/shimmer_list.dart';
import '../../widgets/empty_state.dart';
import '../../widgets/verified_badge.dart';

final _jobsServiceProvider = Provider((_) => GenericServiceService());

final jobsStreamProvider =
    StreamProvider.autoDispose<List<GenericServiceModel>>((ref) {
  final service = ref.watch(_jobsServiceProvider);
  return service.getItems(AppConstants.colJobs);
});

class JobsScreen extends ConsumerWidget {
  const JobsScreen({super.key});

  /// Parses 'deadline:YYYY-MM-DD' from description, returns DateTime or null.
  DateTime? _parseDeadline(String description) {
    final match =
        RegExp(r'deadline:(\d{4}-\d{2}-\d{2})').firstMatch(description);
    if (match == null) return null;
    return DateTime.tryParse(match.group(1)!);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final itemsAsync = ref.watch(jobsStreamProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('চাকরির বিজ্ঞপ্তি')),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(jobsStreamProvider);
        },
        child: itemsAsync.when(
          loading: () => const ShimmerList(itemCount: 8),
          error: (e, _) => EmptyState(
            icon: Icons.error_outline_rounded,
            message: 'ত্রুটি হয়েছে\nআবার চেষ্টা করুন',
            onRetry: () => ref.invalidate(jobsStreamProvider),
          ),
          data: (items) {
            if (items.isEmpty) {
              return const EmptyState(
                icon: Icons.work_rounded,
                message: 'কোনো চাকরির বিজ্ঞপ্তি পাওয়া যায়নি',
              );
            }
            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (_, i) {
                final item = items[i];
                final deadline = _parseDeadline(item.description);
                final now = DateTime.now();
                final isUrgent =
                    deadline != null && deadline.difference(now).inDays <= 7;

                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(14),
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
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          color: const Color(0xFF0066CC).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.work_rounded,
                            color: Color(0xFF0066CC), size: 28),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    item.name,
                                    style: Theme.of(context)
                                        .textTheme
                                        .headlineSmall
                                        ?.copyWith(fontSize: 15),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                if (item.isVerified) const VerifiedBadge(),
                              ],
                            ),
                            if (item.address.isNotEmpty) ...[
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  const Icon(Icons.location_on_rounded,
                                      size: 13, color: AppTheme.textSecondary),
                                  const SizedBox(width: 3),
                                  Expanded(
                                    child: Text(
                                      item.address,
                                      style: const TextStyle(
                                          fontSize: 12,
                                          color: AppTheme.textSecondary),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                            if (deadline != null) ...[
                              const SizedBox(height: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: (isUrgent
                                          ? Colors.red
                                          : AppTheme.textSecondary)
                                      .withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  'শেষ তারিখ: ${deadline.day} ${_monthName(deadline.month)}',
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: isUrgent
                                        ? Colors.red
                                        : AppTheme.textSecondary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }

  String _monthName(int month) {
    const months = [
      'জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'
    ];
    if (month < 1 || month > 12) return '';
    return months[month - 1];
  }
}
