import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_theme.dart';

class _Feature {
  const _Feature(this.icon, this.title, this.description, this.route);
  final IconData icon;
  final String title;
  final String description;
  final String route;
}

const _features = [
  _Feature(
    Icons.auto_awesome,
    'Kundali',
    'Generate your Vedic birth chart report',
    '/kundali/new',
  ),
  _Feature(
    Icons.favorite,
    'Matching',
    'Guna Milan compatibility scoring',
    '/matching/new',
  ),
  _Feature(
    Icons.star,
    'Horoscope',
    'Daily, weekly and monthly predictions',
    '/horoscope',
  ),
  _Feature(
    Icons.nights_stay,
    'Panchang',
    "Today's five auspicious limbs",
    '/panchang',
  ),
  _Feature(Icons.schedule, 'Muhurat', 'Find an auspicious time', '/muhurat'),
  _Feature(
    Icons.tag,
    'Numerology',
    'Life Path, Destiny and Soul Urge numbers',
    '/numerology',
  ),
  _Feature(
    Icons.chat_bubble_outline,
    'Ask a Question',
    'Get a personal answer from an astrologer',
    '/consultation/new',
  ),
];

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.lg,
                AppSpacing.xxxl,
                AppSpacing.lg,
                AppSpacing.xxxl,
              ),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [AppColors.inkLight, AppColors.ink],
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'VEDIC ASTROLOGY',
                    style: TextStyle(
                      color: AppColors.secondaryLight,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  Text(
                    'UdayGuruji Kundali',
                    style: Theme.of(
                      context,
                    ).textTheme.displayMedium?.copyWith(color: AppColors.onInk),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'Discover your birth chart, compatibility, and daily guidance rooted in classical Vedic astrology.',
                    style: const TextStyle(
                      color: AppColors.onInkMuted,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xl),
                  ElevatedButton(
                    onPressed: () => context.go('/kundali/new'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.secondary,
                      foregroundColor: AppColors.ink,
                    ),
                    child: const Padding(
                      padding: EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                      child: Text('Generate Your Kundali'),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: AppSpacing.md,
                crossAxisSpacing: AppSpacing.md,
                childAspectRatio: 0.95,
              ),
              delegate: SliverChildBuilderDelegate((context, index) {
                final feature = _features[index];
                return _FeatureCard(feature: feature);
              }, childCount: _features.length),
            ),
          ),
        ],
      ),
    );
  }
}

class _FeatureCard extends StatelessWidget {
  const _FeatureCard({required this.feature});

  final _Feature feature;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(AppRadius.lg),
        onTap: () => context.go(feature.route),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.surfaceAlt,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
                child: Icon(feature.icon, color: AppColors.primary),
              ),
              const SizedBox(height: AppSpacing.sm),
              Text(
                feature.title,
                style: Theme.of(
                  context,
                ).textTheme.titleLarge?.copyWith(fontSize: 16),
              ),
              const SizedBox(height: 2),
              Expanded(
                child: Text(
                  feature.description,
                  style: const TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 12,
                  ),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
