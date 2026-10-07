import '../../../core/network/api_client.dart';

/// Panchang/Muhurat response fields come straight from a third-party
/// provider's JSON with no normalization on the backend, so they're
/// modeled as dynamic maps rather than strict classes (per the API
/// contract research) - the internal shape isn't controlled by this
/// backend and could change without notice.
class PanchangResult {
  const PanchangResult({
    required this.date,
    required this.place,
    required this.fields,
  });

  final String date;
  final String place;

  /// Everything except date/place/location - tithi, nakshatra, yoga,
  /// karana, weekday, sunrise, sunset (panchang) or abhijit, rahu_kalam,
  /// etc. (muhurat) - rendered generically as label/value pairs.
  final Map<String, dynamic> fields;

  factory PanchangResult.fromJson(Map<String, dynamic> json) {
    final fields = Map<String, dynamic>.from(json)
      ..remove('date')
      ..remove('place')
      ..remove('location');
    return PanchangResult(
      date: json['date'] as String? ?? '',
      place: json['place'] as String? ?? '',
      fields: fields,
    );
  }
}

class PanchangService {
  PanchangService(this._client);

  final ApiClient _client;

  Future<PanchangResult> getPanchang({
    required String date,
    String? time,
    required String place,
  }) {
    return _client.request(
      (dio) => dio.get(
        '/panchang',
        queryParameters: {
          'date': date,
          if (time != null) 'time': time,
          'place': place,
        },
      ),
      decode: (data) => PanchangResult.fromJson(data as Map<String, dynamic>),
    );
  }

  Future<PanchangResult> getMuhurat({
    required String date,
    String? time,
    required String place,
  }) {
    return _client.request(
      (dio) => dio.get(
        '/muhurat',
        queryParameters: {
          'date': date,
          if (time != null) 'time': time,
          'place': place,
        },
      ),
      decode: (data) => PanchangResult.fromJson(data as Map<String, dynamic>),
    );
  }
}
