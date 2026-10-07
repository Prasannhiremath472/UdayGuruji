import '../../../core/network/api_client.dart';

class Horoscope {
  const Horoscope({
    required this.rashi,
    required this.period,
    required this.periodKey,
    required this.categories,
  });

  final String rashi;
  final String period;
  final String periodKey;
  final Map<String, String> categories;

  factory Horoscope.fromJson(Map<String, dynamic> json) {
    final rawCategories = (json['categories'] as Map<String, dynamic>? ?? {});
    return Horoscope(
      rashi: json['rashi'] as String,
      period: json['period'] as String,
      periodKey: json['periodKey'] as String,
      categories: rawCategories.map((k, v) => MapEntry(k, v as String)),
    );
  }
}

class HoroscopeService {
  HoroscopeService(this._client);

  final ApiClient _client;

  Future<List<String>> listRashis() {
    return _client.request(
      (dio) => dio.get('/horoscope'),
      decode: (data) => (data as List).cast<String>(),
    );
  }

  Future<Horoscope> getHoroscope(String rashi, {String period = 'daily'}) {
    return _client.request(
      (dio) =>
          dio.get('/horoscope/$rashi', queryParameters: {'period': period}),
      decode: (data) => Horoscope.fromJson(data as Map<String, dynamic>),
    );
  }
}
