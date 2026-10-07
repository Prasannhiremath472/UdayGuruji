import 'package:dio/dio.dart';
import '../../../core/network/api_client.dart';
import 'kundali_model.dart';
import 'kundali_summary.dart';

class KundaliService {
  KundaliService(this._client);

  final ApiClient _client;

  Future<Kundali> create({
    required String fullName,
    String? gender,
    required String dateOfBirth,
    required String timeOfBirth,
    required String placeOfBirth,
    String languagePreference = 'en',
  }) {
    return _client.request(
      (dio) => dio.post(
        '/kundalis',
        data: {
          'fullName': fullName,
          if (gender != null) 'gender': gender,
          'dateOfBirth': dateOfBirth,
          'timeOfBirth': timeOfBirth,
          'placeOfBirth': placeOfBirth,
          'languagePreference': languagePreference,
        },
      ),
      decode: (data) => Kundali.fromJson(data as Map<String, dynamic>),
    );
  }

  Future<Kundali> getById(int id, {String? accessToken}) {
    return _client.request(
      (dio) => dio.get(
        '/kundalis/$id',
        queryParameters: accessToken != null
            ? {'accessToken': accessToken}
            : null,
      ),
      decode: (data) => Kundali.fromJson(data as Map<String, dynamic>),
    );
  }

  Future<List<KundaliSummary>> mine() {
    return _client.request(
      (dio) => dio.get('/kundalis/mine'),
      decode: (data) => (data as List)
          .cast<Map<String, dynamic>>()
          .map(KundaliSummary.fromJson)
          .toList(),
    );
  }

  /// Downloads the PDF report as raw bytes - a binary response, not the
  /// standard JSON envelope, so it bypasses ApiClient.request/decode.
  Future<List<int>> downloadPdf(int id, {String? accessToken}) async {
    final response = await _client.raw.get<List<int>>(
      '/kundalis/$id/pdf',
      queryParameters: accessToken != null
          ? {'accessToken': accessToken}
          : null,
      options: Options(responseType: ResponseType.bytes),
    );
    return response.data!;
  }
}
