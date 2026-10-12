import 'package:flutter/material.dart';

/// Brand palette ported 1:1 from frontend/src/styles/tokens.css (light
/// theme block). The web app's light theme is gold/orange-on-cream, not
/// the old maroon palette this file previously held.
class AppColorsLight {
  AppColorsLight._();

  static const primary = Color(0xFFF0B429);
  static const primaryDark = Color(0xFFD99A12);
  static const primaryLight = Color(0xFFF7D060);

  static const secondary = Color(0xFFD9711F);
  static const secondaryLight = Color(0xFFE8923F);

  static const background = Color(0xFFFFFDF5);
  static const backgroundGradientTop = Color(0xFFFFFDF0);
  static const backgroundGradientBottom = Color(0xFFFFF6D8);
  static const surface = Color(0xFFFFFFFF);
  static const surfaceAlt = Color(0xFFFFF8E6);
  static const surfaceRaised = Color(0xFFFFFFFF);

  static const textPrimary = Color(0xFF1A1206);
  static const textMuted = Color(0xFF6B6058);
  static const borderColor = Color(0xFFECE2C8);

  /// The actual button/CTA gold - same value in both themes.
  static const accent = Color(0xFFF5C518);
  static const accentHover = Color(0xFFE6B812);
  static const accentText = Color(0xFF1A1206);

  static const success = Color(0xFF3FB96F);
  static const warning = Color(0xFFE6A93C);
  static const error = Color(0xFFE2554F);
  static const info = Color(0xFF4A9FD8);
}

/// Brand palette ported 1:1 from frontend/src/styles/tokens.css (dark
/// theme block) - near-black background, same gold accent as light theme.
class AppColorsDark {
  AppColorsDark._();

  static const primary = Color(0xFFF5C518);
  static const primaryDark = Color(0xFFE6B812);
  static const primaryLight = Color(0xFFF7D454);

  static const secondary = Color(0xFFF08A3C);
  static const secondaryLight = Color(0xFFF5A862);

  static const background = Color(0xFF0D0A07);
  static const backgroundGradientTop = Color(0xFF120D09);
  static const backgroundGradientBottom = Color(0xFF0D0A07);
  static const surface = Color(0xFF17120D);
  static const surfaceAlt = Color(0xFF1F1812);
  static const surfaceRaised = Color(0xFF221A13);

  static const textPrimary = Color(0xFFF3EDE2);
  static const textMuted = Color(0xFFA89D8D);
  static const borderColor = Color(0xFF332A20);

  static const accent = Color(0xFFF5C518);
  static const accentHover = Color(0xFFE6B812);
  static const accentText = Color(0xFF1A1206);

  static const success = Color(0xFF3FB96F);
  static const warning = Color(0xFFE6A93C);
  static const error = Color(0xFFE2554F);
  static const info = Color(0xFF4A9FD8);
}
