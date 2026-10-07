import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/app_states.dart';
import '../../../core/widgets/section_card.dart';
import '../../home/presentation/account_dashboard_screen.dart';
import '../data/kundali_model.dart';

final kundaliByIdProvider = FutureProvider.family<Kundali, (int, String?)>((
  ref,
  args,
) {
  final (id, accessToken) = args;
  return ref
      .watch(kundaliServiceProvider)
      .getById(id, accessToken: accessToken);
});

class KundaliReportScreen extends ConsumerWidget {
  const KundaliReportScreen({
    super.key,
    required this.kundaliId,
    this.accessToken,
  });

  final int kundaliId;
  final String? accessToken;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final kundaliAsync = ref.watch(
      kundaliByIdProvider((kundaliId, accessToken)),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kundali Report'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined),
            tooltip: 'Download & Share PDF',
            onPressed: () => _sharePdf(context, ref),
          ),
        ],
      ),
      body: kundaliAsync.when(
        loading: () => const AppLoadingState(message: 'Loading your report...'),
        error: (e, _) => AppErrorState(
          message: e is ApiException
              ? e.message
              : 'Could not load this kundali.',
          onRetry: () =>
              ref.invalidate(kundaliByIdProvider((kundaliId, accessToken))),
        ),
        data: (kundali) => _ReportBody(kundali: kundali),
      ),
    );
  }

  Future<void> _sharePdf(BuildContext context, WidgetRef ref) async {
    try {
      final bytes = await ref
          .read(kundaliServiceProvider)
          .downloadPdf(kundaliId, accessToken: accessToken);
      final dir = await getTemporaryDirectory();
      final file = File('${dir.path}/kundali-$kundaliId.pdf');
      await file.writeAsBytes(bytes);
      await Share.shareXFiles([XFile(file.path)], text: 'My Kundali Report');
    } catch (_) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Could not download the PDF. Please try again.'),
          ),
        );
      }
    }
  }
}

class _ReportBody extends StatelessWidget {
  const _ReportBody({required this.kundali});

  final Kundali kundali;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.lg),
      children: [
        SectionCard(
          title: kundali.fullName,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _InfoRow('Date of Birth', kundali.dateOfBirth),
              _InfoRow('Time of Birth', kundali.timeOfBirth),
              _InfoRow('Place of Birth', kundali.placeOfBirth),
              _InfoRow('Lagna (Ascendant)', kundali.lagna ?? '—'),
              _InfoRow('Rashi (Moon Sign)', kundali.rashi ?? '—'),
              _InfoRow(
                'Nakshatra',
                '${kundali.nakshatra ?? '—'}${kundali.nakshatraPada != null ? ' · Pada ${kundali.nakshatraPada}' : ''}',
              ),
            ],
          ),
        ),
        if (kundali.personalitySummary != null) ...[
          const SizedBox(height: AppSpacing.lg),
          SectionCard(
            title: 'Personality Summary',
            child: Text(kundali.personalitySummary!),
          ),
        ],
        const SizedBox(height: AppSpacing.lg),
        SectionCard(
          title: 'Planetary Positions',
          child: Column(
            children: kundali.planets
                .map(
                  (p) => ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text('${p.planet}${p.retrograde ? ' (R)' : ''}'),
                    subtitle: Text(
                      '${p.sign} · House ${p.house}${p.nakshatra != null ? ' · ${p.nakshatra}' : ''}',
                    ),
                    trailing: Text('${p.degree.toStringAsFixed(2)}°'),
                  ),
                )
                .toList(),
          ),
        ),
        if (kundali.mahadashas.isNotEmpty) ...[
          const SizedBox(height: AppSpacing.lg),
          SectionCard(
            title: 'Vimshottari Dasha',
            child: Column(
              children: kundali.mahadashas
                  .map(
                    (d) => ListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text(d.planet),
                      subtitle: Text('${d.startDate} — ${d.endDate}'),
                      isThreeLine: d.aiNarrative != null,
                      trailing: d.aiNarrative != null
                          ? const Icon(Icons.auto_awesome, size: 16)
                          : null,
                    ),
                  )
                  .toList(),
            ),
          ),
        ],
        if (kundali.yogas.isNotEmpty) ...[
          const SizedBox(height: AppSpacing.lg),
          SectionCard(
            title: 'Yogas',
            child: Column(
              children: kundali.yogas
                  .map(
                    (y) => Padding(
                      padding: const EdgeInsets.only(bottom: AppSpacing.md),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            y.name,
                            style: const TextStyle(fontWeight: FontWeight.w600),
                          ),
                          Text(y.aiExplanation ?? y.description),
                        ],
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
        ],
        if (kundali.doshas.isNotEmpty) ...[
          const SizedBox(height: AppSpacing.lg),
          SectionCard(
            title: 'Doshas',
            child: Column(
              children: kundali.doshas
                  .map(
                    (d) => Padding(
                      padding: const EdgeInsets.only(bottom: AppSpacing.md),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                d.name,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(width: AppSpacing.sm),
                              Chip(
                                label: Text(
                                  d.present ? 'Present' : 'Not present',
                                ),
                                visualDensity: VisualDensity.compact,
                              ),
                            ],
                          ),
                          Text(d.aiExplanation ?? d.description),
                        ],
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
        ],
      ],
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow(this.label, this.value);

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          SizedBox(
            width: 140,
            child: Text(label, style: const TextStyle(color: Colors.grey)),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }
}
