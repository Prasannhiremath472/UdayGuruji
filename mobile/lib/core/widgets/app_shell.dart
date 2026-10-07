import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Bottom-nav shell for the primary destinations (Home, Kundali, Horoscope,
/// Matching, Account). Secondary tools (Panchang, Muhurat, Numerology, Ask
/// a Question) are reachable from the Home feature grid instead of being
/// crammed into the bottom bar - mirrors how the web app's HomePage.jsx
/// features grid works, since 9 bottom-nav destinations isn't a premium
/// mobile pattern.
class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.child});

  final Widget child;

  static const _destinations = [
    ('/', Icons.home_outlined, Icons.home, 'Home'),
    (
      '/kundali/new',
      Icons.auto_awesome_outlined,
      Icons.auto_awesome,
      'Kundali',
    ),
    ('/horoscope', Icons.star_border, Icons.star, 'Horoscope'),
    ('/matching/new', Icons.favorite_border, Icons.favorite, 'Matching'),
    ('/account', Icons.person_outline, Icons.person, 'Account'),
  ];

  int _indexForLocation(String location) {
    final index = _destinations.indexWhere((d) => d.$1 == location);
    return index == -1 ? 0 : index;
  }

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    final currentIndex = _indexForLocation(location);

    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: (index) => context.go(_destinations[index].$1),
        items: _destinations
            .map(
              (d) => BottomNavigationBarItem(
                icon: Icon(d.$2),
                activeIcon: Icon(d.$3),
                label: d.$4,
              ),
            )
            .toList(),
      ),
    );
  }
}
