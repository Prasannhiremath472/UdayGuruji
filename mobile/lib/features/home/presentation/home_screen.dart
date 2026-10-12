import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/theme_mode_controller.dart';

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

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final themeMode = ref.watch(themeModeProvider);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: _HeroSection(isDark: isDark, themeMode: themeMode),
          ),
          SliverToBoxAdapter(child: _ToolsHeaderBand(isDark: isDark)),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(
              AppSpacing.lg,
              AppSpacing.lg,
              AppSpacing.lg,
              0,
            ),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: AppSpacing.md,
                crossAxisSpacing: AppSpacing.md,
                childAspectRatio: 0.95,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) => _FeatureCard(feature: _features[index]),
                childCount: _features.length,
              ),
            ),
          ),
          SliverToBoxAdapter(child: _CtaBand(isDark: isDark)),
        ],
      ),
    );
  }
}

class _HeroSection extends ConsumerWidget {
  const _HeroSection({required this.isDark, required this.themeMode});

  final bool isDark;
  final ThemeMode themeMode;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.appColors;

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        image: isDark
            ? null
            : const DecorationImage(
                image: AssetImage('assets/images/hero-full.png'),
                fit: BoxFit.cover,
              ),
        gradient: isDark
            ? const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF120D09), Color(0xFF0D0A07)],
              )
            : null,
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(
          AppSpacing.lg,
          AppSpacing.xxl,
          AppSpacing.lg,
          AppSpacing.xxxl,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Align(
              alignment: Alignment.topRight,
              child: IconButton(
                onPressed: () => ref.read(themeModeProvider.notifier).toggle(),
                icon: Icon(
                  isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
                ),
                tooltip: isDark
                    ? 'Switch to light theme'
                    : 'Switch to dark theme',
                style: IconButton.styleFrom(
                  backgroundColor: Theme.of(
                    context,
                  ).colorScheme.surface.withValues(alpha: 0.85),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              'VEDIC ASTROLOGY',
              style: TextStyle(
                color: Theme.of(context).colorScheme.secondary,
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
                fontSize: 12,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              'UdayGuruji Kundali',
              style: Theme.of(context).textTheme.displayMedium,
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Discover your birth chart, compatibility, and daily guidance rooted in classical Vedic astrology.',
              style: TextStyle(color: colors.textMuted, height: 1.5),
            ),
            const SizedBox(height: AppSpacing.xl),
            ElevatedButton(
              onPressed: () => context.go('/kundali/new'),
              child: const Padding(
                padding: EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                child: Text('Generate Your Kundali'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ToolsHeaderBand extends StatelessWidget {
  const _ToolsHeaderBand({required this.isDark});

  final bool isDark;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.lg,
        AppSpacing.xl,
        AppSpacing.lg,
        AppSpacing.lg,
      ),
      decoration: BoxDecoration(
        color: isDark ? null : Theme.of(context).colorScheme.surface,
        image: isDark
            ? null
            : const DecorationImage(
                image: AssetImage('assets/images/tools-full.png'),
                fit: BoxFit.cover,
                opacity: 0.9,
              ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'All Astrology Tools',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 4),
          Text(
            'Everything you need for a complete astrological picture, in one place.',
            style: TextStyle(color: colors.textMuted, fontSize: 13),
          ),
        ],
      ),
    );
  }
}

class _CtaBand extends StatelessWidget {
  const _CtaBand({required this.isDark});

  final bool isDark;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.fromLTRB(
        AppSpacing.lg,
        AppSpacing.xl,
        AppSpacing.lg,
        AppSpacing.xxxl,
      ),
      padding: const EdgeInsets.all(AppSpacing.xl),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(AppRadius.xl),
        gradient: isDark
            ? LinearGradient(
                colors: [
                  Theme.of(context).colorScheme.primary,
                  Theme.of(context).colorScheme.secondary,
                ],
              )
            : null,
        image: isDark
            ? null
            : const DecorationImage(
                image: AssetImage('assets/images/cta-full.png'),
                fit: BoxFit.cover,
              ),
      ),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.lg),
        decoration: BoxDecoration(
          color: isDark ? null : Colors.white.withValues(alpha: 0.72),
          borderRadius: BorderRadius.circular(AppRadius.lg),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Ready to Explore Your Chart?',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                color: isDark ? Colors.white : null,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Enter your birth details and get a complete, professional Vedic Kundali report in minutes.',
              style: TextStyle(
                color: isDark ? Colors.white70 : context.appColors.textMuted,
                height: 1.4,
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            ElevatedButton(
              onPressed: () => context.go('/kundali/new'),
              child: const Padding(
                padding: EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                child: Text('Generate Free Kundali'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FeatureCard extends StatelessWidget {
  const _FeatureCard({required this.feature});

  final _Feature feature;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

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
                  color: Theme.of(context).colorScheme.primary,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
                child: Icon(
                  feature.icon,
                  color: Theme.of(context).colorScheme.onPrimary,
                ),
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
                  style: TextStyle(color: colors.textMuted, fontSize: 12),
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
