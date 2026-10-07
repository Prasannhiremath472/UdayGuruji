class Koota {
  const Koota({
    required this.name,
    required this.maxScore,
    required this.score,
    required this.description,
  });

  final String name;
  final num maxScore;
  final num score;
  final String description;

  factory Koota.fromJson(Map<String, dynamic> json) {
    return Koota(
      name: json['name'] as String,
      maxScore: json['maxScore'] as num,
      score: json['score'] as num,
      description: json['description'] as String,
    );
  }
}

class KundaliMatch {
  const KundaliMatch({
    required this.id,
    required this.groomName,
    required this.groomMoonSign,
    required this.groomNakshatra,
    required this.brideName,
    required this.brideMoonSign,
    required this.brideNakshatra,
    required this.totalScore,
    required this.maxScore,
    required this.verdict,
    required this.kootaBreakdown,
    this.accessToken,
  });

  final int id;
  final String groomName;
  final String groomMoonSign;
  final String groomNakshatra;
  final String brideName;
  final String brideMoonSign;
  final String brideNakshatra;
  final num totalScore;
  final int maxScore;
  final String verdict;
  final List<Koota> kootaBreakdown;
  final String? accessToken;

  /// Derived client-side rather than trusted from the API, since the
  /// backend only includes hasNadiDosha/hasBhakootDosha on the POST
  /// response, not on GET /:id or /mine (a confirmed API inconsistency).
  bool get hasNadiDosha =>
      kootaBreakdown.any((k) => k.name == 'Nadi' && k.score == 0);
  bool get hasBhakootDosha =>
      kootaBreakdown.any((k) => k.name == 'Bhakoot' && k.score == 0);

  factory KundaliMatch.fromJson(Map<String, dynamic> json) {
    final rawBreakdown = json['koota_breakdown'];
    final breakdown = (rawBreakdown is List ? rawBreakdown : <dynamic>[])
        .cast<Map<String, dynamic>>()
        .map(Koota.fromJson)
        .toList();

    return KundaliMatch(
      id: json['id'] as int,
      groomName: json['groom_name'] as String,
      groomMoonSign: json['groom_moon_sign'] as String,
      groomNakshatra: json['groom_nakshatra'] as String,
      brideName: json['bride_name'] as String,
      brideMoonSign: json['bride_moon_sign'] as String,
      brideNakshatra: json['bride_nakshatra'] as String,
      totalScore: json['total_score'] as num,
      maxScore: json['max_score'] as int,
      verdict: json['verdict'] as String,
      kootaBreakdown: breakdown,
      accessToken: json['accessToken'] as String?,
    );
  }
}

class MatchSummary {
  const MatchSummary({
    required this.id,
    required this.groomName,
    required this.brideName,
    required this.totalScore,
    required this.maxScore,
    required this.verdict,
  });

  final int id;
  final String groomName;
  final String brideName;
  final num totalScore;
  final int maxScore;
  final String verdict;

  factory MatchSummary.fromJson(Map<String, dynamic> json) {
    return MatchSummary(
      id: json['id'] as int,
      groomName: json['groom_name'] as String,
      brideName: json['bride_name'] as String,
      totalScore: json['total_score'] as num,
      maxScore: json['max_score'] as int,
      verdict: json['verdict'] as String,
    );
  }
}
