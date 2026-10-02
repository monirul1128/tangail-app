import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../../config/app_theme.dart';
import '../../models/news_model.dart';
import '../../services/news_service.dart';

/// Kept for backward compatibility — used by home_screen.dart
final newsStreamProvider =
    StreamProvider.autoDispose.family<List<NewsModel>, String>((ref, category) {
  return NewsService().getNews(category: category.isEmpty ? null : category);
});

class NewsScreen extends ConsumerWidget {
  const NewsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('সর্বশেষ খবর ও নোটিশ'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'খবর'),
              Tab(text: 'নোটিশ'),
            ],
            indicatorColor: Colors.white,
            labelColor: Colors.white,
            unselectedLabelColor: Colors.white70,
          ),
        ),
        body: TabBarView(
          children: [
            // Tab 0: News
            _NewsTab(
              stream: NewsService().getNews(limit: 30),
              emptyMessage: 'কোনো খবর পাওয়া যায়নি',
            ),
            // Tab 1: Notices
            _NewsTab(
              stream: NewsService().getNotices(limit: 30),
              emptyMessage: 'কোনো নোটিশ পাওয়া যায়নি',
            ),
          ],
        ),
      ),
    );
  }
}

class _NewsTab extends StatelessWidget {
  final Stream<List<NewsModel>> stream;
  final String emptyMessage;

  const _NewsTab({
    required this.stream,
    required this.emptyMessage,
  });

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<List<NewsModel>>(
      stream: stream,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(child: Text('ত্রুটি হয়েছে: ${snapshot.error}'));
        }
        final newsList = snapshot.data ?? [];
        if (newsList.isEmpty) {
          return Center(child: Text(emptyMessage));
        }
        return RefreshIndicator(
          onRefresh: () async {
            // StreamBuilder auto-refreshes; just wait a moment
            await Future.delayed(const Duration(milliseconds: 300));
          },
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: newsList.length,
            itemBuilder: (_, i) => NewsCard(
              news: newsList[i],
              onTap: () => context.push('/news/${newsList[i].id}'),
            ),
          ),
        );
      },
    );
  }
}

class NewsCard extends StatelessWidget {
  final NewsModel news;
  final VoidCallback onTap;
  const NewsCard({super.key, required this.news, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 8,
                offset: const Offset(0, 2))
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Thumbnail
            ClipRRect(
              borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(12),
                  bottomLeft: Radius.circular(12)),
              child: news.imageUrl.isNotEmpty
                  ? Image.network(news.imageUrl,
                      width: 100,
                      height: 90,
                      fit: BoxFit.cover)
                  : Container(
                      width: 100,
                      height: 90,
                      color: AppTheme.backgroundColor,
                      child: const Icon(Icons.newspaper_rounded,
                          color: AppTheme.textSecondary, size: 32),
                    ),
            ),
            // Content
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Notice badge
                    if (news.isNotice)
                      Container(
                        margin: const EdgeInsets.only(bottom: 5),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 7, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppTheme.warningColor.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Text('নোটিশ',
                            style: TextStyle(
                                fontSize: 10,
                                color: AppTheme.warningColor,
                                fontWeight: FontWeight.w700)),
                      ),
                    Text(news.title,
                        style:
                            Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  fontWeight: FontWeight.w600,
                                  height: 1.3,
                                ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 6),
                    Text(news.source,
                        style: const TextStyle(
                            fontSize: 11,
                            color: AppTheme.primaryColor,
                            fontWeight: FontWeight.w500)),
                    const SizedBox(height: 4),
                    Text(timeago.format(news.publishedAt, locale: 'en'),
                        style: const TextStyle(
                            fontSize: 10, color: AppTheme.textSecondary)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
