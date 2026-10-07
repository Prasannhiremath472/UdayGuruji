import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// A titled card used to group a section of content on result/report
/// screens (kundali report sections, panchang limbs, match koota
/// breakdown, etc.) - the mobile equivalent of the web app's Card.jsx.
class SectionCard extends StatelessWidget {
  const SectionCard({super.key, this.title, required this.child, this.actions});

  final String? title;
  final Widget child;
  final Widget? actions;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (title != null || actions != null) ...[
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (title != null)
                    Expanded(
                      child: Text(
                        title!,
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                    ),
                  if (actions != null) actions!,
                ],
              ),
              const SizedBox(height: AppSpacing.md),
            ],
            child,
          ],
        ),
      ),
    );
  }
}
