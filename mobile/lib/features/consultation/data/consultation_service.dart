import '../../../core/network/api_client.dart';

class ConsultationService {
  ConsultationService(this._client);

  final ApiClient _client;

  /// Submits a question. Per the API contract, there is no customer-facing
  /// endpoint to list past consultations - admin/staff only - so this
  /// screen is submit-only, matching current backend capability (a
  /// confirmed backend gap, not something the client works around).
  Future<void> submit({
    required String fullName,
    String? email,
    String? phone,
    int? kundaliId,
    required String question,
  }) {
    return _client.request(
      (dio) => dio.post(
        '/consultations',
        data: {
          'fullName': fullName,
          if (email != null && email.isNotEmpty) 'email': email,
          if (phone != null && phone.isNotEmpty) 'phone': phone,
          if (kundaliId != null) 'kundaliId': kundaliId,
          'question': question,
        },
      ),
      decode: (_) {},
    );
  }
}
