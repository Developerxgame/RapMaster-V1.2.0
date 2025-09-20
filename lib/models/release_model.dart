class Release {
  final String id;
  final String title;
  final ReleaseType type;
  final int quality;
  final DateTime releaseDate;
  int streams;
  int views;
  double earnings;
  bool isViral;
  int chartPosition;
  
  Release({
    required this.id,
    required this.title,
    required this.type,
    required this.quality,
    required this.releaseDate,
    this.streams = 0,
    this.views = 0,
    this.earnings = 0.0,
    this.isViral = false,
    this.chartPosition = 0,
  });
  
  // Calculate initial performance based on quality and player stats
  void calculateInitialPerformance(int fame, int reputation, int fans) {
    final baseStreams = (fame * 1000) + (reputation * 500) + (fans ~/ 10);
    final qualityMultiplier = quality / 10.0;
    
    streams = (baseStreams * qualityMultiplier * _getTypeMultiplier()).round();
    views = type == ReleaseType.musicVideo ? streams : (streams * 0.8).round();
    earnings = streams * _getEarningsRate();
    
    // Viral potential
    isViral = streams > 100000 && quality >= 8;
    
    // Chart position
    if (streams > 500000) {
      chartPosition = (101 - (streams / 10000).round()).clamp(1, 100);
    }
  }
  
  double _getTypeMultiplier() {
    switch (type) {
      case ReleaseType.track:
        return 1.0;
      case ReleaseType.musicVideo:
        return 1.5;
      case ReleaseType.album:
        return 2.0;
    }
  }
  
  double _getEarningsRate() {
    switch (type) {
      case ReleaseType.track:
        return 0.003;
      case ReleaseType.musicVideo:
        return 0.001;
      case ReleaseType.album:
        return 0.008;
    }
  }
  
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'type': type.index,
      'quality': quality,
      'releaseDate': releaseDate.millisecondsSinceEpoch,
      'streams': streams,
      'views': views,
      'earnings': earnings,
      'isViral': isViral ? 1 : 0,
      'chartPosition': chartPosition,
    };
  }
  
  factory Release.fromMap(Map<String, dynamic> map) {
    return Release(
      id: map['id'],
      title: map['title'],
      type: ReleaseType.values[map['type']],
      quality: map['quality'],
      releaseDate: DateTime.fromMillisecondsSinceEpoch(map['releaseDate']),
      streams: map['streams'],
      views: map['views'],
      earnings: map['earnings'].toDouble(),
      isViral: map['isViral'] == 1,
      chartPosition: map['chartPosition'],
    );
  }
}

enum ReleaseType {
  track,
  musicVideo,
  album,
}

extension ReleaseTypeExtension on ReleaseType {
  String get name {
    switch (this) {
      case ReleaseType.track:
        return 'Track';
      case ReleaseType.musicVideo:
        return 'Music Video';
      case ReleaseType.album:
        return 'Album';
    }
  }
  
  String get emoji {
    switch (this) {
      case ReleaseType.track:
        return '🎵';
      case ReleaseType.musicVideo:
        return '🎬';
      case ReleaseType.album:
        return '💿';
    }
  }
}