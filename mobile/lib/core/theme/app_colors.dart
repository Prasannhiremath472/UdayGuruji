import 'package:flutter/material.dart';

/// Brand palette ported 1:1 from frontend/src/styles/tokens.css so the
/// mobile app and web app read as the same product.
class AppColors {
  AppColors._();

  static const primary = Color(0xFF7A2E2E);
  static const primaryDark = Color(0xFF501D1D);
  static const primaryLight = Color(0xFFA34848);

  static const secondary = Color(0xFFD9A441);
  static const secondaryLight = Color(0xFFF0C674);

  static const background = Color(0xFFFAF8F5);
  static const surface = Color(0xFFFFFFFF);
  static const surfaceAlt = Color(0xFFF4EFE6);

  static const textPrimary = Color(0xFF26201D);
  static const textMuted = Color(0xFF6B6058);
  static const borderColor = Color(0xFFE4DDD3);

  static const success = Color(0xFF2F7A4D);
  static const warning = Color(0xFFB8842C);
  static const error = Color(0xFFB3382C);
  static const info = Color(0xFF2F6A8F);

  /// "Night sky" ink tones for hero/celestial sections - used deliberately,
  /// not everywhere (matches the web app's same naming/intent).
  static const ink = Color(0xFF1C1024);
  static const inkLight = Color(0xFF2E1A38);
  static const onInk = Color(0xFFF5EFE0);
  static const onInkMuted = Color(0xFFC9B9D6);
}
