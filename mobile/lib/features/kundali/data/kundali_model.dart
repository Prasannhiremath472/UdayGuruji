class PlanetPosition {
  const PlanetPosition({
    required this.planet,
    required this.sign,
    required this.degree,
    required this.house,
    this.nakshatra,
    this.nakshatraPada,
    required this.retrograde,
  });

  final String planet;
  final String sign;
  final double degree;
  final int house;
  final String? nakshatra;
  final int? nakshatraPada;
  final bool retrograde;

  factory PlanetPosition.fromJson(Map<String, dynamic> json) {
    return PlanetPosition(
      planet: json['planet'] as String,
      sign: json['sign'] as String,
      degree: (json['degree'] as num).toDouble(),
      house: json['house'] as int,
      nakshatra: json['nakshatra'] as String?,
      nakshatraPada: json['nakshatra_pada'] as int?,
      retrograde: json['retrograde'] == 1 || json['retrograde'] == true,
    );
  }
}

class DivisionalChart {
  const DivisionalChart({required this.chartType, required this.houses});

  final String chartType;
  final List<Map<String, dynamic>> houses;

  factory DivisionalChart.fromJson(Map<String, dynamic> json) {
    final raw = json['chart_json'];
    final houses = raw is List
        ? raw.cast<Map<String, dynamic>>()
        : <Map<String, dynamic>>[];
    return DivisionalChart(
      chartType: json['chart_type'] as String,
      houses: houses,
    );
  }
}

class DashaPeriod {
  const DashaPeriod({
    required this.id,
    required this.level,
    required this.planet,
    required this.startDate,
    required this.endDate,
    this.aiNarrative,
    this.parentDashaId,
  });

  final int id;
  final int level;
  final String planet;
  final String startDate;
  final String endDate;
  final String? aiNarrative;
  final int? parentDashaId;

  factory DashaPeriod.fromJson(Map<String, dynamic> json) {
    return DashaPeriod(
      id: json['id'] as int,
      level: json['dasha_level'] as int,
      planet: json['planet'] as String,
      startDate: json['start_date'] as String,
      endDate: json['end_date'] as String,
      aiNarrative: json['ai_narrative'] as String?,
      parentDashaId: json['parent_dasha_id'] as int?,
    );
  }
}

class Yoga {
  const Yoga({
    required this.name,
    required this.description,
    this.aiExplanation,
  });

  final String name;
  final String description;
  final String? aiExplanation;

  factory Yoga.fromJson(Map<String, dynamic> json) {
    return Yoga(
      name: json['yoga_name'] as String,
      description: json['description'] as String,
      aiExplanation: json['ai_explanation'] as String?,
    );
  }
}

class Dosha {
  const Dosha({
    required this.name,
    required this.present,
    required this.description,
    this.aiExplanation,
  });

  final String name;
  final bool present;
  final String description;
  final String? aiExplanation;

  factory Dosha.fromJson(Map<String, dynamic> json) {
    return Dosha(
      name: json['dosha_name'] as String,
      present: json['present'] == 1 || json['present'] == true,
      description: json['description'] as String,
      aiExplanation: json['ai_explanation'] as String?,
    );
  }
}

class AshtakavargaEntry {
  const AshtakavargaEntry({
    required this.planet,
    required this.house,
    required this.points,
  });

  final String planet;
  final int house;
  final int points;

  factory AshtakavargaEntry.fromJson(Map<String, dynamic> json) {
    return AshtakavargaEntry(
      planet: json['planet'] as String,
      house: json['house'] as int,
      points: json['points'] as int,
    );
  }
}

/// The full kundali report shape, returned by POST /kundalis and
/// GET /kundalis/:id. `accessToken` is only ever populated on the POST
/// response (the backend never returns it again afterward) - capture and
/// persist it locally for guest (non-logged-in) users.
class Kundali {
  const Kundali({
    required this.id,
    required this.fullName,
    this.gender,
    required this.dateOfBirth,
    required this.timeOfBirth,
    required this.placeOfBirth,
    this.lagna,
    this.rashi,
    this.nakshatra,
    this.nakshatraPada,
    this.personalitySummary,
    required this.status,
    this.accessToken,
    this.planets = const [],
    this.charts = const [],
    this.dashas = const [],
    this.yogas = const [],
    this.doshas = const [],
    this.ashtakavarga = const [],
  });

  final int id;
  final String fullName;
  final String? gender;
  final String dateOfBirth;
  final String timeOfBirth;
  final String placeOfBirth;
  final String? lagna;
  final String? rashi;
  final String? nakshatra;
  final int? nakshatraPada;
  final String? personalitySummary;
  final String status;
  final String? accessToken;
  final List<PlanetPosition> planets;
  final List<DivisionalChart> charts;
  final List<DashaPeriod> dashas;
  final List<Yoga> yogas;
  final List<Dosha> doshas;
  final List<AshtakavargaEntry> ashtakavarga;

  /// Mahadasha (level 1) periods only, for a simplified timeline view.
  List<DashaPeriod> get mahadashas =>
      dashas.where((d) => d.level == 1).toList();

  factory Kundali.fromJson(Map<String, dynamic> json) {
    return Kundali(
      id: json['id'] as int,
      fullName: json['full_name'] as String,
      gender: json['gender'] as String?,
      dateOfBirth: json['date_of_birth'] as String,
      timeOfBirth: json['time_of_birth'] as String,
      placeOfBirth: json['place_of_birth'] as String,
      lagna: json['lagna'] as String?,
      rashi: json['rashi'] as String?,
      nakshatra: json['nakshatra'] as String?,
      nakshatraPada: json['nakshatra_pada'] as int?,
      personalitySummary: json['personality_summary'] as String?,
      status: json['status'] as String,
      accessToken: json['accessToken'] as String?,
      planets: (json['planets'] as List? ?? [])
          .cast<Map<String, dynamic>>()
          .map(PlanetPosition.fromJson)
          .toList(),
      charts: (json['charts'] as List? ?? [])
          .cast<Map<String, dynamic>>()
          .map(DivisionalChart.fromJson)
          .toList(),
      dashas: (json['dashas'] as List? ?? [])
          .cast<Map<String, dynamic>>()
          .map(DashaPeriod.fromJson)
          .toList(),
      yogas: (json['yogas'] as List? ?? [])
          .cast<Map<String, dynamic>>()
          .map(Yoga.fromJson)
          .toList(),
      doshas: (json['doshas'] as List? ?? [])
          .cast<Map<String, dynamic>>()
          .map(Dosha.fromJson)
          .toList(),
      ashtakavarga: (json['ashtakavarga'] as List? ?? [])
          .cast<Map<String, dynamic>>()
          .map(AshtakavargaEntry.fromJson)
          .toList(),
    );
  }
}
