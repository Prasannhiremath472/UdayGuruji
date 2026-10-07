import '../../../core/network/api_client.dart';

class NumerologyNumber {
  const NumerologyNumber({
    required this.number,
    required this.label,
    required this.isMasterNumber,
    required this.meaning,
  });

  final int number;
  final String label;
  final bool isMasterNumber;
  final String meaning;

  factory NumerologyNumber.fromJson(Map<String, dynamic> json) {
    return NumerologyNumber(
      number: json['number'] as int,
      label: json['label'] as String,
      isMasterNumber: json['isMasterNumber'] as bool,
      meaning: json['meaning'] as String,
    );
  }
}

class NumerologyResult {
  const NumerologyResult({
    required this.lifePath,
    required this.destiny,
    required this.soulUrge,
  });

  final NumerologyNumber lifePath;
  final NumerologyNumber destiny;
  final NumerologyNumber soulUrge;

  factory NumerologyResult.fromJson(Map<String, dynamic> json) {
    return NumerologyResult(
      lifePath: NumerologyNumber.fromJson(
        json['lifePath'] as Map<String, dynamic>,
      ),
      destiny: NumerologyNumber.fromJson(
        json['destiny'] as Map<String, dynamic>,
      ),
      soulUrge: NumerologyNumber.fromJson(
        json['soulUrge'] as Map<String, dynamic>,
      ),
    );
  }
}

class NumerologyService {
  NumerologyService(this._client);

  final ApiClient _client;

  Future<NumerologyResult> calculate({
    required String fullName,
    required String dateOfBirth,
  }) {
    return _client.request(
      (dio) => dio.post(
        '/numerology',
        data: {'fullName': fullName, 'dateOfBirth': dateOfBirth},
      ),
      decode: (data) => NumerologyResult.fromJson(data as Map<String, dynamic>),
    );
  }
}
