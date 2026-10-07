import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/app_states.dart';
import '../../../core/widgets/section_card.dart';
import '../../home/presentation/account_dashboard_screen.dart';
import '../data/match_model.dart';

final matchByIdProvider = FutureProvider.family<KundaliMatch, (int, String?)>((
  ref,
  args,
) {
  final (id, accessToken) = args;
  return ref
      .watch(matchingServiceProvider)
      .getById(id, accessToken: accessToken);
});

class MatchingResultScreen extends ConsumerWidget {
  const MatchingResultScreen({
    super.key,
    required this.matchId,
    this.accessToken,
  });

  final int matchId;
  final String? accessToken;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final matchAsync = ref.watch(matchByIdProvider((matchId, accessToken)));

    return Scaffold(
      appBar: AppBar(title: const Text('Compatibility Result')),
      body: matchAsync.when(
        loading: () => const AppLoadingState(),
        error: (e, _) => AppErrorState(
          message: e is ApiException ? e.message : 'Could not load this match.',
          onRetry: () =>
              ref.invalidate(matchByIdProvider((matchId, accessToken))),
        ),
        data: (match) => _ResultBody(match: match),
      ),
    );
  }
}

class _ResultBody extends StatelessWidget {
  const _ResultBody({required this.match});

  final KundaliMatch match;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.lg),
      children: [
        Card(
          color: AppColors.ink,
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.xxl),
            child: Column(
              children: [
                Text(
                  '${match.groomName} & ${match.brideName}',
                  style: const TextStyle(color: AppColors.onInk, fontSize: 16),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: AppSpacing.md),
                Text(
                  '${match.totalScore}/${match.maxScore}',
                  style: const TextStyle(
                    color: AppColors.secondary,
                    fontSize: 40,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(
                  match.verdict,
                  style: const TextStyle(color: AppColors.onInkMuted),
                  textAlign: TextAlign.center,
                ),
                if (match.hasNadiDosha || match.hasBhakootDosha) ...[
                  const SizedBox(height: AppSpacing.md),
                  Wrap(
                    spacing: AppSpacing.sm,
                    children: [
                      if (match.hasNadiDosha)
                        const Chip(label: Text('Nadi Dosha')),
                      if (match.hasBhakootDosha)
                        const Chip(label: Text('Bhakoot Dosha')),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.lg),
        SectionCard(
          title: 'Groom',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Moon Sign: ${match.groomMoonSign}'),
              Text('Nakshatra: ${match.groomNakshatra}'),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.lg),
        SectionCard(
          title: 'Bride',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Moon Sign: ${match.brideMoonSign}'),
              Text('Nakshatra: ${match.brideNakshatra}'),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.lg),
        SectionCard(
          title: 'Guna Milan Breakdown',
          child: Column(
            children: match.kootaBreakdown
                .map(
                  (k) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 6),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                k.name,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                k.description,
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Text('${k.score}/${k.maxScore}'),
                      ],
                    ),
                  ),
                )
                .toList(),
          ),
        ),
      ],
    );
  }
}
