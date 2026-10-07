import '../../../core/network/api_client.dart';
import 'match_model.dart';

class PersonBirthDetails {
  const PersonBirthDetails({
    required this.fullName,
    required this.dateOfBirth,
    required this.timeOfBirth,
    required this.placeOfBirth,
  });

  final String fullName;
  final String dateOfBirth;
  final String timeOfBirth;
  final String placeOfBirth;

  Map<String, dynamic> toJson() => {
    'fullName': fullName,
    'dateOfBirth': dateOfBirth,
    'timeOfBirth': timeOfBirth,
    'placeOfBirth': placeOfBirth,
  };
}

class MatchingService {
  MatchingService(this._client);

  final ApiClient _client;

  Future<KundaliMatch> create({
    required PersonBirthDetails groom,
    required PersonBirthDetails bride,
  }) {
    return _client.request(
      (dio) => dio.post(
        '/matching',
        data: {'groom': groom.toJson(), 'bride': bride.toJson()},
      ),
      decode: (data) => KundaliMatch.fromJson(data as Map<String, dynamic>),
    );
  }

  Future<KundaliMatch> getById(int id, {String? accessToken}) {
    return _client.request(
      (dio) => dio.get(
        '/matching/$id',
        queryParameters: accessToken != null
            ? {'accessToken': accessToken}
            : null,
      ),
      decode: (data) => KundaliMatch.fromJson(data as Map<String, dynamic>),
    );
  }

  Future<List<MatchSummary>> mine() {
    return _client.request(
      (dio) => dio.get('/matching/mine'),
      decode: (data) => (data as List)
          .cast<Map<String, dynamic>>()
          .map(MatchSummary.fromJson)
          .toList(),
    );
  }
}
