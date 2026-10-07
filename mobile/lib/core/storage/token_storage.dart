import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Keychain/Keystore-backed storage for the customer JWT. The mobile app
/// only ever authenticates as a customer (no admin UI on mobile), so unlike
/// the web app's apiClient.js there is a single token, not two.
class TokenStorage {
  TokenStorage(this._storage);

  final FlutterSecureStorage _storage;

  static const _tokenKey = 'kundali_customer_token';
  static const _customerIdKey = 'kundali_customer_id';
  static const _customerNameKey = 'kundali_customer_name';
  static const _customerEmailKey = 'kundali_customer_email';

  Future<String?> readToken() => _storage.read(key: _tokenKey);

  Future<void> saveSession({
    required String token,
    required int customerId,
    required String name,
    required String email,
  }) async {
    await _storage.write(key: _tokenKey, value: token);
    await _storage.write(key: _customerIdKey, value: customerId.toString());
    await _storage.write(key: _customerNameKey, value: name);
    await _storage.write(key: _customerEmailKey, value: email);
  }

  Future<Map<String, String>?> readCustomer() async {
    final id = await _storage.read(key: _customerIdKey);
    final name = await _storage.read(key: _customerNameKey);
    final email = await _storage.read(key: _customerEmailKey);
    if (id == null || name == null || email == null) return null;
    return {'id': id, 'name': name, 'email': email};
  }

  Future<void> clear() async {
    await _storage.delete(key: _tokenKey);
    await _storage.delete(key: _customerIdKey);
    await _storage.delete(key: _customerNameKey);
    await _storage.delete(key: _customerEmailKey);
  }
}
