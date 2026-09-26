import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../../config/app_theme.dart';
import '../../models/news_model.dart';
import '../../services/news_service.dart';

final newsDetailProvider =
    FutureProvider.autoDispose.family<NewsModel?, String>((ref, id) {
  return NewsService().getNewsById(id);
});

class NewsDetailScreen extends ConsumerWidget {
  final String newsId;
  const NewsDetailScreen({super.key, required this.newsId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final newsAsync = ref.watch(newsDetailProvider(newsId));

    return newsAsync.when(
      loading: () =>
          const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (e, _) => Scaffold(body: Center(child: Text('ত্রুটি: $e'))),
      data: (news) {
        if (news == null) {
          return const Scaffold(
              body: Center(child: Text('খবর পাওয়া যায়নি')));
        }
        return Scaffold(
          appBar: AppBar(title: const Text('বিস্তারিত')),
          body: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (news.imageUrl.isNotEmpty)
                  Image.network(
                    news.imageUrl,
                    width: double.infinity,
                    height: 220,
                    fit: BoxFit.cover,
                  ),
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (news.isNotice)
                        Container(
                          margin: const EdgeInsets.only(bottom: 10),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.warningColor.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text('নোটিশ',
                              style: TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.warningColor,
                                  fontWeight: FontWeight.w700)),
                        ),
                      Text(news.title,
                          style: Theme.of(context)
                              .textTheme
                              .headlineLarge
                              ?.copyWith(height: 1.4)),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          const Icon(Icons.source_rounded,
                              size: 14, color: AppTheme.primaryColor),
                          const SizedBox(width: 5),
                          Text(news.source,
                              style: const TextStyle(
                                  fontSize: 13,
                                  color: AppTheme.primaryColor,
                                  fontWeight: FontWeight.w600)),
                          const Spacer(),
                          Text(
                              timeago.format(news.publishedAt, locale: 'en'),
                              style: const TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.textSecondary)),
                        ],
                      ),
                      const Divider(height: 24),
                      Text(news.body,
                          style: Theme.of(context)
                              .textTheme
                              .bodyLarge
                              ?.copyWith(height: 1.8)),
                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
