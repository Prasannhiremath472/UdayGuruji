import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'section_card.dart';

/// Generic renderer for a dynamic field map (panchang limbs, muhurat
/// windows) - each top-level key becomes its own section, rendered either
/// as a flat key/value list (if the value is a map) or a single line.
class DynamicFieldsView extends StatelessWidget {
  const DynamicFieldsView({super.key, required this.fields});

  final Map<String, dynamic> fields;

  String _titleCase(String s) {
    final spaced = s.replaceAll('_', ' ');
    return spaced.isEmpty
        ? spaced
        : '${spaced[0].toUpperCase()}${spaced.substring(1)}';
  }

  @override
  Widget build(BuildContext context) {
    final entries = fields.entries.where((e) => e.value != null).toList();
    if (entries.isEmpty) {
      return const Text(
        'No data available for this date and place.',
        style: TextStyle(color: Colors.grey),
      );
    }
    return Column(
      children: entries
          .map(
            (entry) => Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.md),
              child: SectionCard(
                title: _titleCase(entry.key),
                child: _ValueView(value: entry.value),
              ),
            ),
          )
          .toList(),
    );
  }
}

class _ValueView extends StatelessWidget {
  const _ValueView({required this.value});

  final dynamic value;

  @override
  Widget build(BuildContext context) {
    if (value is Map) {
      final map = (value as Map).cast<String, dynamic>();
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: map.entries
            .where(
              (e) => e.value != null && e.value is! Map && e.value is! List,
            )
            .map(
              (e) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 2),
                child: Text('${e.key.replaceAll('_', ' ')}: ${e.value}'),
              ),
            )
            .toList(),
      );
    }
    if (value is List) {
      return Text(value.join(', '));
    }
    return Text('$value');
  }
}
