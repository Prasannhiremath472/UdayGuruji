import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app.dart';

void main() {
  // google_fonts normally downloads font files from Google's CDN on first
  // use and caches them - on a device with no network route at launch
  // (e.g. this app's dev USB-tethered setup, or just being offline) that
  // fetch throws, and since GoogleFonts.lora()/notoSansTextTheme() are
  // called directly while building the theme, an unhandled exception took
  // the whole app down at startup. Disabling runtime fetching makes it
  // fall back to the platform default font instead of crashing when a
  // font isn't already cached/bundled.
  GoogleFonts.config.allowRuntimeFetching = false;

  runApp(const ProviderScope(child: App()));
}
