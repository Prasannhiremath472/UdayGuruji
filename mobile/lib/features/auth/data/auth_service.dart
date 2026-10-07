import '../../../core/network/api_client.dart';
import 'customer_model.dart';

class AuthResult {
  const AuthResult({required this.token, required this.customer});
  final String token;
  final Customer customer;
}

/// Talks to /api/v1/account/* - the customer auth endpoints added
/// alongside the backend's customer-accounts feature. Deliberately
/// separate from any admin auth (the mobile app has no admin surface).
class AuthService {
  AuthService(this._client);

  final ApiClient _client;

  Future<AuthResult> signup({
    required String name,
    required String email,
    String? phone,
    required String password,
  }) {
    return _client.request(
      (dio) => dio.post(
        '/account/signup',
        data: {
          'name': name,
          'email': email,
          if (phone != null && phone.isNotEmpty) 'phone': phone,
          'password': password,
        },
      ),
      decode: (data) => AuthResult(
        token: data['token'] as String,
        customer: Customer.fromJson(data['customer'] as Map<String, dynamic>),
      ),
    );
  }

  Future<AuthResult> login({required String email, required String password}) {
    return _client.request(
      (dio) => dio.post(
        '/account/login',
        data: {'email': email, 'password': password},
      ),
      decode: (data) => AuthResult(
        token: data['token'] as String,
        customer: Customer.fromJson(data['customer'] as Map<String, dynamic>),
      ),
    );
  }

  Future<Customer> me() {
    return _client.request(
      (dio) => dio.get('/account/me'),
      decode: (data) => Customer.fromJson(data as Map<String, dynamic>),
    );
  }
}
