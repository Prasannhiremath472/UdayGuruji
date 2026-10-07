import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/application/auth_controller.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/auth/presentation/signup_screen.dart';
import '../../features/home/presentation/home_screen.dart';
import '../../features/home/presentation/account_dashboard_screen.dart';
import '../../features/kundali/presentation/kundali_form_screen.dart';
import '../../features/kundali/presentation/kundali_report_screen.dart';
import '../../features/matching/presentation/matching_form_screen.dart';
import '../../features/matching/presentation/matching_result_screen.dart';
import '../../features/horoscope/presentation/horoscope_screen.dart';
import '../../features/panchang/presentation/panchang_screen.dart';
import '../../features/muhurat/presentation/muhurat_screen.dart';
import '../../features/numerology/presentation/numerology_screen.dart';
import '../../features/consultation/presentation/ask_question_screen.dart';
import '../widgets/app_shell.dart';

/// Notifies go_router to re-evaluate redirects whenever auth state changes,
/// so logging in/out immediately affects route guarding without needing a
/// manual navigation call.
class _AuthListenable extends ChangeNotifier {
  _AuthListenable(this._ref) {
    _ref.listen(authControllerProvider, (previous, next) {
      if (previous?.isAuthenticated != next.isAuthenticated) {
        notifyListeners();
      }
    });
  }
  final Ref _ref;
}

final routerProvider = Provider<GoRouter>((ref) {
  final authListenable = _AuthListenable(ref);

  return GoRouter(
    initialLocation: '/',
    refreshListenable: authListenable,
    redirect: (context, state) {
      final authState = ref.read(authControllerProvider);
      final isAccountArea = state.matchedLocation == '/account';
      if (isAccountArea && !authState.isLoading && !authState.isAuthenticated) {
        return '/account/login';
      }
      return null;
    },
    routes: [
      ShellRoute(
        builder: (context, state, child) => AppShell(child: child),
        routes: [
          GoRoute(path: '/', builder: (context, state) => const HomeScreen()),
          GoRoute(
            path: '/kundali/new',
            builder: (context, state) => const KundaliFormScreen(),
          ),
          GoRoute(
            path: '/horoscope',
            builder: (context, state) => const HoroscopeScreen(),
          ),
          GoRoute(
            path: '/matching/new',
            builder: (context, state) => const MatchingFormScreen(),
          ),
          GoRoute(
            path: '/account',
            builder: (context, state) => const AccountDashboardScreen(),
          ),
        ],
      ),
      GoRoute(
        path: '/account/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/account/signup',
        builder: (context, state) => const SignupScreen(),
      ),
      GoRoute(
        path: '/kundali/:id',
        builder: (context, state) => KundaliReportScreen(
          kundaliId: int.parse(state.pathParameters['id']!),
          accessToken: state.uri.queryParameters['accessToken'],
        ),
      ),
      GoRoute(
        path: '/matching/:id',
        builder: (context, state) => MatchingResultScreen(
          matchId: int.parse(state.pathParameters['id']!),
          accessToken: state.uri.queryParameters['accessToken'],
        ),
      ),
      GoRoute(
        path: '/panchang',
        builder: (context, state) => const PanchangScreen(),
      ),
      GoRoute(
        path: '/muhurat',
        builder: (context, state) => const MuhuratScreen(),
      ),
      GoRoute(
        path: '/numerology',
        builder: (context, state) => const NumerologyScreen(),
      ),
      GoRoute(
        path: '/consultation/new',
        builder: (context, state) => const AskQuestionScreen(),
      ),
    ],
  );
});
