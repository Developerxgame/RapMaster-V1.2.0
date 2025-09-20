class Player {
  final String id;
  String stageName;
  String avatar;
  String city;
  int age;
  int year;
  int week;
  int fame;
  int reputation;
  int fans;
  int followers;
  double netWorth;
  int energy;
  
  // Skills
  int songwriting;
  int rapping;
  int stagePerformance;
  
  // Social Media
  Map<String, int> socialMedia;
  
  // Career
  int careerLevel;
  List<String> achievements;
  DateTime lastPlayed;
  
  Player({
    required this.id,
    required this.stageName,
    this.avatar = 'male_1',
    this.city = 'Los Angeles',
    this.age = 20,
    this.year = 2024,
    this.week = 1,
    this.fame = 0,
    this.reputation = 0,
    this.fans = 0,
    this.followers = 0,
    this.netWorth = 100.0,
    this.energy = 100,
    this.songwriting = 1,
    this.rapping = 1,
    this.stagePerformance = 1,
    Map<String, int>? socialMedia,
    this.careerLevel = 1,
    List<String>? achievements,
    DateTime? lastPlayed,
  }) : socialMedia = socialMedia ?? {
          'rapgram': 0,
          'raptube': 0,
          'rapify': 0,
          'riktok': 0,
        },
        achievements = achievements ?? [],
        lastPlayed = lastPlayed ?? DateTime.now();
  
  // Career Level Names
  String get careerLevelName {
    const levels = [
      'Rookie Musician',
      'Local Performer', 
      'Underground Artist',
      'Rising Star',
      'Mainstream Artist',
      'Hitmaker',
      'Global Icon',
      'Legend'
    ];
    return levels[careerLevel - 1];
  }
  
  // Career Level Emoji
  String get careerEmoji {
    const emojis = ['🎵', '🎤', '🎭', '⭐', '🌟', '🔥', '🌍', '👑'];
    return emojis[careerLevel - 1];
  }
  
  // Calculate new fans based on fame and reputation
  int calculateNewFans() {
    return (fame * 100) + (reputation * 50);
  }
  
  // Calculate new followers based on fame and reputation  
  int calculateNewFollowers() {
    return (fame * 200) + (reputation * 100);
  }
  
  // Calculate streams based on stats
  int calculateStreams() {
    return (fame * 10000) + (reputation * 5000) + (fans ~/ 2);
  }
  
  // Check if can level up
  bool canLevelUp() {
    if (careerLevel >= 8) return false; // Max level
    
    const levelRequirements = [
      [0, 0],    // Level 1: 0-10 fame/rep
      [10, 10],  // Level 2: 10-20 fame/rep  
      [20, 20],  // Level 3: 20-30 fame/rep
      [30, 30],  // Level 4: 30-50 fame/rep
      [50, 40],  // Level 5: 50-70 fame, 40-70 rep
      [70, 50],  // Level 6: 70-85 fame, 50-80 rep
      [85, 70],  // Level 7: 85-95 fame, 70-90 rep
      [95, 90],  // Level 8: 95-100 fame, 90-100 rep
    ];
    
    final nextLevel = levelRequirements[careerLevel];
    return fame >= nextLevel[0] && reputation >= nextLevel[1];
  }
  
  // Level up the player
  void levelUp() {
    if (canLevelUp() && careerLevel < 8) {
      careerLevel++;
    }
  }
  
  // Convert to Map for database
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'stageName': stageName,
      'avatar': avatar,
      'city': city,
      'age': age,
      'year': year,
      'week': week,
      'fame': fame,
      'reputation': reputation,
      'fans': fans,
      'followers': followers,
      'netWorth': netWorth,
      'energy': energy,
      'songwriting': songwriting,
      'rapping': rapping,
      'stagePerformance': stagePerformance,
      'socialMedia': socialMedia.toString(),
      'careerLevel': careerLevel,
      'achievements': achievements.join(','),
      'lastPlayed': lastPlayed.millisecondsSinceEpoch,
    };
  }
  
  // Create from Map
  factory Player.fromMap(Map<String, dynamic> map) {
    return Player(
      id: map['id'],
      stageName: map['stageName'],
      avatar: map['avatar'],
      city: map['city'],
      age: map['age'],
      year: map['year'],
      week: map['week'],
      fame: map['fame'],
      reputation: map['reputation'],
      fans: map['fans'],
      followers: map['followers'],
      netWorth: map['netWorth'].toDouble(),
      energy: map['energy'],
      songwriting: map['songwriting'],
      rapping: map['rapping'],
      stagePerformance: map['stagePerformance'],
      socialMedia: _parseSocialMedia(map['socialMedia']),
      careerLevel: map['careerLevel'],
      achievements: map['achievements'].split(',').where((a) => a.isNotEmpty).toList(),
      lastPlayed: DateTime.fromMillisecondsSinceEpoch(map['lastPlayed']),
    );
  }
  
  static Map<String, int> _parseSocialMedia(String socialMediaStr) {
    // Simple parsing - in real app you'd use JSON
    return {
      'rapgram': 0,
      'raptube': 0, 
      'rapify': 0,
      'riktok': 0,
    };
  }
}