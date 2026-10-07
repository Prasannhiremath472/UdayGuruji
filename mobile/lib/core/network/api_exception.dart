/// A single {field, message} validation error, as returned in the
/// `details` array of a VALIDATION_ERROR response from the backend.
class ValidationFieldError {
  const ValidationFieldError({required this.field, required this.message});

  final String field;
  final String message;

  factory ValidationFieldError.fromJson(Map<String, dynamic> json) {
    return ValidationFieldError(
      field: json['field'] as String? ?? '',
      message: json['message'] as String? ?? '',
    );
  }
}

/// Typed wrapper around the backend's standard error envelope:
/// { success: false, message, errorCode, details? }
///
/// See backend/src/utils/apiResponse.js and middleware/validate.js for the
/// exact shapes this mirrors.
class ApiException implements Exception {
  ApiException({
    required this.message,
    required this.errorCode,
    this.statusCode,
    this.validationErrors = const [],
  });

  final String message;
  final String errorCode;
  final int? statusCode;
  final List<ValidationFieldError> validationErrors;

  bool get isValidationError => errorCode == 'VALIDATION_ERROR';

  factory ApiException.fromResponseData(dynamic data, {int? statusCode}) {
    if (data is! Map<String, dynamic>) {
      return ApiException(
        message: 'Something went wrong. Please try again.',
        errorCode: 'UNKNOWN_ERROR',
        statusCode: statusCode,
      );
    }

    final errorCode = data['errorCode'] as String? ?? 'UNKNOWN_ERROR';
    final message =
        data['message'] as String? ?? 'Something went wrong. Please try again.';
    final rawDetails = data['details'];

    final validationErrors = <ValidationFieldError>[];
    if (errorCode == 'VALIDATION_ERROR' && rawDetails is List) {
      for (final entry in rawDetails) {
        if (entry is Map<String, dynamic>) {
          validationErrors.add(ValidationFieldError.fromJson(entry));
        }
      }
    }

    return ApiException(
      message: message,
      errorCode: errorCode,
      statusCode: statusCode,
      validationErrors: validationErrors,
    );
  }

  factory ApiException.network() => ApiException(
    message: 'Could not reach the server. Check your connection and try again.',
    errorCode: 'NETWORK_ERROR',
  );

  @override
  String toString() => message;
}
