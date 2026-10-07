import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'network/api_client.dart';
import 'storage/token_storage.dart';

/// Central place for app-wide infrastructure providers. Feature-specific
/// providers (auth state, kundali list, etc.) live in each
/// `features/<name>/application/` folder and depend on these.

final secureStorageProvider = Provider<FlutterSecureStorage>((ref) {
  return const FlutterSecureStorage();
});

final tokenStorageProvider = Provider<TokenStorage>((ref) {
  return TokenStorage(ref.watch(secureStorageProvider));
});

/// Bumped whenever the API client reports a 401, so anything that reads it
/// (the router's redirect) re-evaluates.
final unauthorizedEventProvider = StateProvider<int>((ref) => 0);

final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient(
    ref.watch(tokenStorageProvider),
    onUnauthorized: () => ref.read(unauthorizedEventProvider.notifier).state++,
  );
});
