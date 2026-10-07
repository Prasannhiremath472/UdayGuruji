/// The lighter summary shape returned by GET /kundalis/mine and admin
/// search - not the full report shape (see kundali_model.dart).
class KundaliSummary {
  const KundaliSummary({
    required this.id,
    required this.fullName,
    required this.dateOfBirth,
    required this.placeOfBirth,
    this.rashi,
    required this.status,
  });

  final int id;
  final String fullName;
  final String dateOfBirth;
  final String placeOfBirth;
  final String? rashi;
  final String status;

  factory KundaliSummary.fromJson(Map<String, dynamic> json) {
    return KundaliSummary(
      id: json['id'] as int,
      fullName: json['full_name'] as String,
      dateOfBirth: json['date_of_birth'] as String,
      placeOfBirth: json['place_of_birth'] as String,
      rashi: json['rashi'] as String?,
      status: json['status'] as String,
    );
  }
}
