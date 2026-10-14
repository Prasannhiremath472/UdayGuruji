import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Font family names, bundled as local assets (see pubspec.yaml) rather
/// than fetched at runtime via google_fonts - that fetch hit
/// fonts.gstatic.com and crashed the app on launch with no network route.
class AppFonts {
  AppFonts._();
  static const display = 'Lora';
  static const body = 'NotoSans';
}

/// Spacing scale, mirroring the --space-* tokens in tokens.css.
class AppSpacing {
  AppSpacing._();
  static const xs = 4.0;
  static const sm = 8.0;
  static const md = 12.0;
  static const lg = 16.0;
  static const xl = 20.0;
  static const xxl = 24.0;
  static const xxxl = 32.0;
}

/// Radius scale, mirroring the --radius-* tokens in tokens.css.
class AppRadius {
  AppRadius._();
  static const sm = 4.0;
  static const md = 8.0;
  static const lg = 12.0;
  static const xl = 20.0;
  static const pill = 999.0;
}

class AppTheme {
  AppTheme._();

  static ThemeData _build({
    required Brightness brightness,
    required Color primary,
    required Color secondary,
    required Color background,
    required Color surface,
    required Color surfaceAlt,
    required Color textPrimary,
    required Color textMuted,
    required Color borderColor,
    required Color accent,
    required Color accentHover,
    required Color accentText,
    required Color error,
    required Color success,
  }) {
    final baseTextTheme = (brightness == Brightness.dark
            ? ThemeData.dark().textTheme
            : ThemeData.light().textTheme)
        .apply(fontFamily: AppFonts.body);
    const displayStyle = TextStyle(fontFamily: AppFonts.display);

    final colorScheme = ColorScheme(
      brightness: brightness,
      primary: primary,
      onPrimary: accentText,
      secondary: secondary,
      onSecondary: Colors.white,
      surface: surface,
      onSurface: textPrimary,
      error: error,
      onError: Colors.white,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: background,
      textTheme: baseTextTheme.copyWith(
        displayLarge: displayStyle.copyWith(
          fontSize: 32,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        displayMedium: displayStyle.copyWith(
          fontSize: 26,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        displaySmall: displayStyle.copyWith(
          fontSize: 22,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        titleLarge: displayStyle.copyWith(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        bodyLarge: baseTextTheme.bodyLarge?.copyWith(color: textPrimary),
        bodyMedium: baseTextTheme.bodyMedium?.copyWith(color: textPrimary),
        bodySmall: baseTextTheme.bodySmall?.copyWith(color: textMuted),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: surface,
        foregroundColor: textPrimary,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: displayStyle.copyWith(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
      ),
      cardTheme: CardThemeData(
        color: surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.lg),
          side: BorderSide(color: borderColor),
        ),
        margin: EdgeInsets.zero,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style:
            ElevatedButton.styleFrom(
              backgroundColor: accent,
              foregroundColor: accentText,
              minimumSize: const Size.fromHeight(44),
              shape: const StadiumBorder(),
              textStyle: const TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 15,
              ),
            ).copyWith(
              overlayColor: WidgetStateProperty.resolveWith(
                (states) => states.contains(WidgetState.pressed)
                    ? accentHover.withValues(alpha: 0.2)
                    : null,
              ),
            ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: secondary,
          side: BorderSide(color: secondary),
          minimumSize: const Size.fromHeight(44),
          shape: const StadiumBorder(),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(foregroundColor: secondary),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surface,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.md,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: BorderSide(color: borderColor),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: BorderSide(color: borderColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: BorderSide(color: accent, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: BorderSide(color: error),
        ),
        labelStyle: TextStyle(color: textMuted),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: surface,
        selectedItemColor: secondary,
        unselectedItemColor: textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      dividerTheme: DividerThemeData(color: borderColor, thickness: 1),
      extensions: [
        AppSemanticColors(
          surfaceAlt: surfaceAlt,
          borderColor: borderColor,
          textMuted: textMuted,
          error: error,
          success: success,
        ),
      ],
    );
  }

  static ThemeData get light => _build(
    brightness: Brightness.light,
    primary: AppColorsLight.primary,
    secondary: AppColorsLight.secondary,
    background: AppColorsLight.background,
    surface: AppColorsLight.surface,
    surfaceAlt: AppColorsLight.surfaceAlt,
    textPrimary: AppColorsLight.textPrimary,
    textMuted: AppColorsLight.textMuted,
    borderColor: AppColorsLight.borderColor,
    accent: AppColorsLight.accent,
    accentHover: AppColorsLight.accentHover,
    accentText: AppColorsLight.accentText,
    error: AppColorsLight.error,
    success: AppColorsLight.success,
  );

  static ThemeData get dark => _build(
    brightness: Brightness.dark,
    primary: AppColorsDark.primary,
    secondary: AppColorsDark.secondary,
    background: AppColorsDark.background,
    surface: AppColorsDark.surface,
    surfaceAlt: AppColorsDark.surfaceAlt,
    textPrimary: AppColorsDark.textPrimary,
    textMuted: AppColorsDark.textMuted,
    borderColor: AppColorsDark.borderColor,
    accent: AppColorsDark.accent,
    accentHover: AppColorsDark.accentHover,
    accentText: AppColorsDark.accentText,
    error: AppColorsDark.error,
    success: AppColorsDark.success,
  );
}

/// Theme-aware tokens not covered by Flutter's built-in ColorScheme
/// (surfaceAlt/borderColor/textMuted/error as used by this app's custom
/// widgets), exposed as a ThemeExtension so screens can do
/// `Theme.of(context).extension<AppSemanticColors>()!.textMuted` instead
/// of importing AppColorsLight/AppColorsDark directly and hardcoding which
/// one applies.
class AppSemanticColors extends ThemeExtension<AppSemanticColors> {
  const AppSemanticColors({
    required this.surfaceAlt,
    required this.borderColor,
    required this.textMuted,
    required this.error,
    required this.success,
  });

  final Color surfaceAlt;
  final Color borderColor;
  final Color textMuted;
  final Color error;
  final Color success;

  @override
  AppSemanticColors copyWith({
    Color? surfaceAlt,
    Color? borderColor,
    Color? textMuted,
    Color? error,
    Color? success,
  }) {
    return AppSemanticColors(
      surfaceAlt: surfaceAlt ?? this.surfaceAlt,
      borderColor: borderColor ?? this.borderColor,
      textMuted: textMuted ?? this.textMuted,
      error: error ?? this.error,
      success: success ?? this.success,
    );
  }

  @override
  AppSemanticColors lerp(ThemeExtension<AppSemanticColors>? other, double t) {
    if (other is! AppSemanticColors) return this;
    return AppSemanticColors(
      surfaceAlt: Color.lerp(surfaceAlt, other.surfaceAlt, t)!,
      borderColor: Color.lerp(borderColor, other.borderColor, t)!,
      textMuted: Color.lerp(textMuted, other.textMuted, t)!,
      error: Color.lerp(error, other.error, t)!,
      success: Color.lerp(success, other.success, t)!,
    );
  }
}

extension AppThemeContext on BuildContext {
  AppSemanticColors get appColors =>
      Theme.of(this).extension<AppSemanticColors>()!;
}
