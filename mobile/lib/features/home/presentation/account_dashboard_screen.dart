import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/providers.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/app_states.dart';
import '../../../core/widgets/section_card.dart';
import '../../auth/application/auth_controller.dart';
import '../../kundali/data/kundali_service.dart';
import '../../kundali/data/kundali_summary.dart';
import '../../matching/data/matching_service.dart';
import '../../matching/data/match_model.dart';

final kundaliServiceProvider = Provider(
  (ref) => KundaliService(ref.watch(apiClientProvider)),
);
final matchingServiceProvider = Provider(
  (ref) => MatchingService(ref.watch(apiClientProvider)),
);

final myKundalisProvider = FutureProvider<List<KundaliSummary>>((ref) {
  return ref.watch(kundaliServiceProvider).mine();
});

final myMatchesProvider = FutureProvider<List<MatchSummary>>((ref) {
  return ref.watch(matchingServiceProvider).mine();
});

class AccountDashboardScreen extends ConsumerWidget {
  const AccountDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authControllerProvider);
    final kundalisAsync = ref.watch(myKundalisProvider);
    final matchesAsync = ref.watch(myMatchesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Account'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
            onPressed: () async {
              await ref.read(authControllerProvider.notifier).logout();
              if (context.mounted) context.go('/');
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          Text(
            'Welcome back, ${authState.customer?.name ?? ''}',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: AppSpacing.xl),
          SectionCard(
            title: 'My Kundalis',
            child: kundalisAsync.when(
              data: (items) => items.isEmpty
                  ? const AppEmptyState(
                      title: "You haven't generated any kundalis yet.",
                    )
                  : Column(
                      children: items
                          .map(
                            (k) => ListTile(
                              contentPadding: EdgeInsets.zero,
                              title: Text(k.fullName),
                              subtitle: Text(
                                '${k.dateOfBirth} · ${k.rashi ?? '—'}',
                              ),
                              trailing: const Icon(Icons.chevron_right),
                              onTap: () => context.push('/kundali/${k.id}'),
                            ),
                          )
                          .toList(),
                    ),
              loading: () => const AppLoadingState(),
              error: (e, _) => AppErrorState(
                message: 'Could not load your kundalis.',
                onRetry: () => ref.invalidate(myKundalisProvider),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          SectionCard(
            title: 'My Kundali Matches',
            child: matchesAsync.when(
              data: (items) => items.isEmpty
                  ? const AppEmptyState(
                      title: "You haven't generated any matches yet.",
                    )
                  : Column(
                      children: items
                          .map(
                            (m) => ListTile(
                              contentPadding: EdgeInsets.zero,
                              title: Text('${m.groomName} & ${m.brideName}'),
                              subtitle: Text(
                                '${m.totalScore}/${m.maxScore} · ${m.verdict}',
                              ),
                              trailing: const Icon(Icons.chevron_right),
                              onTap: () => context.push('/matching/${m.id}'),
                            ),
                          )
                          .toList(),
                    ),
              loading: () => const AppLoadingState(),
              error: (e, _) => AppErrorState(
                message: 'Could not load your matches.',
                onRetry: () => ref.invalidate(myMatchesProvider),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
