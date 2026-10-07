import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/providers.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/app_states.dart';
import '../../../core/widgets/section_card.dart';
import '../data/horoscope_service.dart';

final horoscopeServiceProvider = Provider(
  (ref) => HoroscopeService(ref.watch(apiClientProvider)),
);

final rashisProvider = FutureProvider(
  (ref) => ref.watch(horoscopeServiceProvider).listRashis(),
);

final selectedRashiProvider = StateProvider<String?>((ref) => null);
final selectedPeriodProvider = StateProvider<String>((ref) => 'daily');

final horoscopeProvider = FutureProvider<Horoscope?>((ref) async {
  final rashi = ref.watch(selectedRashiProvider);
  if (rashi == null) return null;
  final period = ref.watch(selectedPeriodProvider);
  return ref
      .watch(horoscopeServiceProvider)
      .getHoroscope(rashi, period: period);
});

class HoroscopeScreen extends ConsumerWidget {
  const HoroscopeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final rashisAsync = ref.watch(rashisProvider);
    final selectedRashi = ref.watch(selectedRashiProvider);
    final selectedPeriod = ref.watch(selectedPeriodProvider);
    final horoscopeAsync = ref.watch(horoscopeProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Horoscope')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          children: [
            rashisAsync.when(
              loading: () => const AppLoadingState(),
              error: (e, _) =>
                  const AppErrorState(message: 'Could not load zodiac signs.'),
              data: (rashis) => DropdownButtonFormField<String>(
                initialValue: selectedRashi,
                decoration: const InputDecoration(
                  labelText: 'Select your Rashi',
                ),
                items: rashis
                    .map((r) => DropdownMenuItem(value: r, child: Text(r)))
                    .toList(),
                onChanged: (v) =>
                    ref.read(selectedRashiProvider.notifier).state = v,
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            SegmentedButton<String>(
              segments: const [
                ButtonSegment(value: 'daily', label: Text('Daily')),
                ButtonSegment(value: 'weekly', label: Text('Weekly')),
                ButtonSegment(value: 'monthly', label: Text('Monthly')),
              ],
              selected: {selectedPeriod},
              onSelectionChanged: (s) =>
                  ref.read(selectedPeriodProvider.notifier).state = s.first,
            ),
            const SizedBox(height: AppSpacing.xl),
            if (selectedRashi == null)
              const AppEmptyState(title: 'Select a Rashi to see your horoscope')
            else
              horoscopeAsync.when(
                loading: () => const AppLoadingState(),
                error: (e, _) => AppErrorState(
                  message: e is ApiException
                      ? e.message
                      : 'Could not load this horoscope.',
                  onRetry: () => ref.invalidate(horoscopeProvider),
                ),
                data: (horoscope) {
                  if (horoscope == null) return const SizedBox.shrink();
                  return Column(
                    children: horoscope.categories.entries
                        .map(
                          (entry) => Padding(
                            padding: const EdgeInsets.only(
                              bottom: AppSpacing.md,
                            ),
                            child: SectionCard(
                              title: _titleCase(entry.key),
                              child: Text(entry.value),
                            ),
                          ),
                        )
                        .toList(),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  String _titleCase(String s) =>
      s.isEmpty ? s : '${s[0].toUpperCase()}${s.substring(1)}';
}
