import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Persists the user's theme choice the same way the web app's
/// ThemeContext.jsx does: defaults to light always (never reads system
/// brightness), stores the explicit choice, and only changes on an
/// explicit toggle.
const _prefsKey = 'theme_mode';

class ThemeModeController extends StateNotifier<ThemeMode> {
  ThemeModeController() : super(ThemeMode.light) {
    _restore();
  }

  Future<void> _restore() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final stored = prefs.getString(_prefsKey);
      if (stored == 'dark') {
        state = ThemeMode.dark;
      } else if (stored == 'light') {
        state = ThemeMode.light;
      }
      // Any other/missing value: stay on the ThemeMode.light default.
    } catch (_) {
      // Ignore storage errors - keep the light default.
    }
  }

  Future<void> toggle() async {
    state = state == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(
        _prefsKey,
        state == ThemeMode.dark ? 'dark' : 'light',
      );
    } catch (_) {
      // Ignore storage errors - the in-memory toggle still works for this session.
    }
  }
}

final themeModeProvider = StateNotifierProvider<ThemeModeController, ThemeMode>(
  (ref) {
    return ThemeModeController();
  },
);
