import 'package:dio/dio.dart';
import '../storage/token_storage.dart';
import 'api_exception.dart';

/// Base URL, overridable at build/run time:
///   flutter run --dart-define=API_BASE_URL=http://10.0.2.2:5000/api/v1
///
/// Defaults to the Android emulator's alias for the host machine's
/// localhost (10.0.2.2) since plain "localhost" inside an emulator points
/// at the emulator itself, not the development machine running the
/// backend - a real Flutter/Android gotcha the web app never had to
/// handle. Physical devices need the host machine's LAN IP instead.
const _defaultBaseUrl = 'http://10.0.2.2:5000/api/v1';
const String apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: _defaultBaseUrl,
);

/// Called when the server reports the stored session is no longer valid
/// (401), so the router can redirect to the login screen.
typedef UnauthorizedCallback = void Function();

class ApiClient {
  ApiClient(this._tokenStorage, {UnauthorizedCallback? onUnauthorized})
    : _onUnauthorized = onUnauthorized {
    _dio = Dio(
      BaseOptions(
        baseUrl: apiBaseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 30),
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _tokenStorage.readToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            await _tokenStorage.clear();
            _onUnauthorized?.call();
          }
          handler.next(error);
        },
      ),
    );
  }

  final TokenStorage _tokenStorage;
  final UnauthorizedCallback? _onUnauthorized;
  late final Dio _dio;

  Dio get raw => _dio;

  /// Unwraps the standard { success, message, data, pagination } envelope
  /// and returns just `data`, converting any failure into an ApiException.
  Future<T> request<T>(
    Future<Response<dynamic>> Function(Dio dio) call, {
    required T Function(dynamic data) decode,
  }) async {
    try {
      final response = await call(_dio);
      final body = response.data as Map<String, dynamic>;
      return decode(body['data']);
    } on DioException catch (e) {
      if (e.response != null) {
        throw ApiException.fromResponseData(
          e.response!.data,
          statusCode: e.response!.statusCode,
        );
      }
      throw ApiException.network();
    }
  }

  /// Like [request], but also returns the pagination block for list
  /// endpoints that paginate (e.g. admin search - unused by the mobile
  /// app today, kept for parity with the web client's api contract).
  Future<({T data, Map<String, dynamic>? pagination})> requestPaginated<T>(
    Future<Response<dynamic>> Function(Dio dio) call, {
    required T Function(dynamic data) decode,
  }) async {
    try {
      final response = await call(_dio);
      final body = response.data as Map<String, dynamic>;
      return (
        data: decode(body['data']),
        pagination: body['pagination'] as Map<String, dynamic>?,
      );
    } on DioException catch (e) {
      if (e.response != null) {
        throw ApiException.fromResponseData(
          e.response!.data,
          statusCode: e.response!.statusCode,
        );
      }
      throw ApiException.network();
    }
  }
}
