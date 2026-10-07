import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers.dart';
import '../data/auth_service.dart';
import '../data/customer_model.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ref.watch(apiClientProvider));
});

/// Holds the current customer session. Null customer = logged out.
/// Starts as `loading` while it checks secure storage for a persisted
/// session on app launch.
class AuthState {
  const AuthState({required this.customer, required this.isLoading});

  final Customer? customer;
  final bool isLoading;

  bool get isAuthenticated => customer != null;

  AuthState copyWith({
    Customer? customer,
    bool? isLoading,
    bool clearCustomer = false,
  }) {
    return AuthState(
      customer: clearCustomer ? null : (customer ?? this.customer),
      isLoading: isLoading ?? this.isLoading,
    );
  }

  static const initial = AuthState(customer: null, isLoading: true);
}

class AuthController extends StateNotifier<AuthState> {
  AuthController(this._ref) : super(AuthState.initial) {
    _restoreSession();
  }

  final Ref _ref;

  AuthService get _service => _ref.read(authServiceProvider);

  Future<void> _restoreSession() async {
    final tokenStorage = _ref.read(tokenStorageProvider);
    final token = await tokenStorage.readToken();
    if (token == null) {
      state = state.copyWith(isLoading: false);
      return;
    }

    final stored = await tokenStorage.readCustomer();
    if (stored != null) {
      state = AuthState(
        customer: Customer(
          id: int.parse(stored['id']!),
          name: stored['name']!,
          email: stored['email']!,
        ),
        isLoading: false,
      );
    } else {
      state = state.copyWith(isLoading: false);
    }
  }

  Future<void> signup({
    required String name,
    required String email,
    String? phone,
    required String password,
  }) async {
    final result = await _service.signup(
      name: name,
      email: email,
      phone: phone,
      password: password,
    );
    await _persist(result);
  }

  Future<void> login({required String email, required String password}) async {
    final result = await _service.login(email: email, password: password);
    await _persist(result);
  }

  Future<void> _persist(AuthResult result) async {
    await _ref
        .read(tokenStorageProvider)
        .saveSession(
          token: result.token,
          customerId: result.customer.id,
          name: result.customer.name,
          email: result.customer.email,
        );
    state = state.copyWith(customer: result.customer, isLoading: false);
  }

  Future<void> logout() async {
    await _ref.read(tokenStorageProvider).clear();
    state = state.copyWith(clearCustomer: true, isLoading: false);
  }
}

final authControllerProvider = StateNotifierProvider<AuthController, AuthState>(
  (ref) {
    final controller = AuthController(ref);
    // Any 401 from the API client clears the session so the UI/router react.
    ref.listen(unauthorizedEventProvider, (previous, next) {
      if (previous != null && next != previous) {
        controller.logout();
      }
    });
    return controller;
  },
);
