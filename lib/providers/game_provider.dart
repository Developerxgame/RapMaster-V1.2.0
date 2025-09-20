import 'package:flutter/material.dart';
import '../models/player_model.dart';
import '../models/release_model.dart';
import '../services/database_service.dart';
import '../services/save_service.dart';

class GameProvider with ChangeNotifier {
  Player? _player;
  List<Release> _releases = [];
  bool _isLoading = true;
  
  // Getters
  Player? get player => _player;
  List<Release> get releases => _releases;
  bool get isLoading => _isLoading;
  bool get hasPlayer => _player != null;
  
  // Initialize game
  Future<void> init() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      // Load saved player
      _player = await SaveService.loadPlayer();
      
      // Load releases
      _releases = await DatabaseService.instance.getAllReleases();
      
      // Process weekly updates if needed
      if (_player != null) {
        await _processWeeklyUpdates();
      }
    } catch (e) {
      debugPrint('Error initializing game: $e');
    }
    
    _isLoading = false;
    notifyListeners();
  }
  
  // Create new player
  Future<void> createPlayer({
    required String stageName,
    required String avatar,
    required String city,
  }) async {
    _player = Player(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      stageName: stageName,
      avatar: avatar,
      city: city,
    );
    
    await SaveService.savePlayer(_player!);
    notifyListeners();
  }
  
  // Update player stats
  Future<void> updatePlayer(Player updatedPlayer) async {
    _player = updatedPlayer;
    await SaveService.savePlayer(_player!);
    notifyListeners();
  }
  
  // Release content
  Future<void> releaseContent({
    required String title,
    required ReleaseType type,
    required int quality,
  }) async {
    if (_player == null) return;
    
    final release = Release(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title,
      type: type,
      quality: quality,
      releaseDate: DateTime.now(),
    );
    
    // Calculate performance
    release.calculateInitialPerformance(
      _player!.fame,
      _player!.reputation,
      _player!.fans,
    );
    
    // Add to database
    await DatabaseService.instance.insertRelease(release);
    _releases.add(release);
    
    // Update player stats
    _updatePlayerFromRelease(release);
    
    notifyListeners();
  }
  
  // Update player stats from release
  void _updatePlayerFromRelease(Release release) {
    if (_player == null) return;
    
    // Fame boost
    int fameBoost = 0;
    switch (release.type) {
      case ReleaseType.track:
        fameBoost = 2 + (release.quality ~/ 3);
        break;
      case ReleaseType.musicVideo:
        fameBoost = 4 + (release.quality ~/ 2);
        break;
      case ReleaseType.album:
        fameBoost = 6 + release.quality;
        break;
    }
    
    // Reputation boost for high quality
    int repBoost = release.quality >= 7 ? release.quality ~/ 2 : 0;
    
    // Fan growth
    int fanGrowth = (release.streams / 100).round();
    
    // Follower growth
    int followerGrowth = (release.views / 50).round();
    
    _player = Player(
      id: _player!.id,
      stageName: _player!.stageName,
      avatar: _player!.avatar,
      city: _player!.city,
      age: _player!.age,
      year: _player!.year,
      week: _player!.week,
      fame: (_player!.fame + fameBoost).clamp(0, 100),
      reputation: (_player!.reputation + repBoost).clamp(0, 100),
      fans: _player!.fans + fanGrowth,
      followers: _player!.followers + followerGrowth,
      netWorth: _player!.netWorth + release.earnings,
      energy: (_player!.energy - 20).clamp(0, 100),
      songwriting: _player!.songwriting,
      rapping: _player!.rapping,
      stagePerformance: _player!.stagePerformance,
      socialMedia: _player!.socialMedia,
      careerLevel: _player!.careerLevel,
      achievements: _player!.achievements,
      lastPlayed: _player!.lastPlayed,
    );
    
    // Check for level up
    if (_player!.canLevelUp()) {
      _player!.levelUp();
      _checkAchievements();
    }
    
    SaveService.savePlayer(_player!);
  }
  
  // Advance week
  Future<void> advanceWeek() async {
    if (_player == null) return;
    
    int newWeek = _player!.week + 1;
    int newYear = _player!.year;
    
    if (newWeek > 52) {
      newWeek = 1;
      newYear++;
    }
    
    _player = Player(
      id: _player!.id,
      stageName: _player!.stageName,
      avatar: _player!.avatar,
      city: _player!.city,
      age: _player!.age + (newYear > _player!.year ? 1 : 0),
      year: newYear,
      week: newWeek,
      fame: _player!.fame,
      reputation: _player!.reputation,
      fans: _player!.fans,
      followers: _player!.followers,
      netWorth: _player!.netWorth,
      energy: 100, // Refill energy
      songwriting: _player!.songwriting,
      rapping: _player!.rapping,
      stagePerformance: _player!.stagePerformance,
      socialMedia: _player!.socialMedia,
      careerLevel: _player!.careerLevel,
      achievements: _player!.achievements,
      lastPlayed: DateTime.now(),
    );
    
    await SaveService.savePlayer(_player!);
    await _processWeeklyReleaseUpdates();
    notifyListeners();
  }
  
  // Process weekly updates for existing releases
  Future<void> _processWeeklyReleaseUpdates() async {
    for (var release in _releases) {
      final weeksSinceRelease = DateTime.now().difference(release.releaseDate).inDays ~/ 7;
      
      if (weeksSinceRelease < 12) {
        // Decay factor
        final decayFactor = (1.0 - (weeksSinceRelease * 0.1)).clamp(0.1, 1.0);
        
        // Weekly streams
        final weeklyStreams = (release.streams * 0.1 * decayFactor).round();
        release.streams += weeklyStreams;
        
        // Weekly earnings
        final weeklyEarnings = weeklyStreams * release._getEarningsRate();
        release.earnings += weeklyEarnings;
        
        // Update player net worth
        _player = Player(
          id: _player!.id,
          stageName: _player!.stageName,
          avatar: _player!.avatar,
          city: _player!.city,
          age: _player!.age,
          year: _player!.year,
          week: _player!.week,
          fame: _player!.fame,
          reputation: _player!.reputation,
          fans: _player!.fans,
          followers: _player!.followers,
          netWorth: _player!.netWorth + weeklyEarnings,
          energy: _player!.energy,
          songwriting: _player!.songwriting,
          rapping: _player!.rapping,
          stagePerformance: _player!.stagePerformance,
          socialMedia: _player!.socialMedia,
          careerLevel: _player!.careerLevel,
          achievements: _player!.achievements,
          lastPlayed: _player!.lastPlayed,
        );
        
        // Update release in database
        await DatabaseService.instance.updateRelease(release);
      }
    }
    
    await SaveService.savePlayer(_player!);
  }
  
  // Process weekly updates (inactivity penalties)
  Future<void> _processWeeklyUpdates() async {
    if (_player == null) return;
    
    final daysSinceLastPlayed = DateTime.now().difference(_player!.lastPlayed).inDays;
    final weeksSinceLastPlayed = daysSinceLastPlayed ~/ 7;
    
    if (weeksSinceLastPlayed >= 12) {
      // Apply inactivity penalties
      final famePenalty = (weeksSinceLastPlayed - 11) * 2;
      final repPenalty = (weeksSinceLastPlayed - 11) * 1;
      final fanPenalty = (weeksSinceLastPlayed - 11) * 1000;
      
      _player = Player(
        id: _player!.id,
        stageName: _player!.stageName,
        avatar: _player!.avatar,
        city: _player!.city,
        age: _player!.age,
        year: _player!.year,
        week: _player!.week,
        fame: (_player!.fame - famePenalty).clamp(0, 100),
        reputation: (_player!.reputation - repPenalty).clamp(0, 100),
        fans: (_player!.fans - fanPenalty).clamp(0, _player!.fans),
        followers: _player!.followers,
        netWorth: _player!.netWorth,
        energy: _player!.energy,
        songwriting: _player!.songwriting,
        rapping: _player!.rapping,
        stagePerformance: _player!.stagePerformance,
        socialMedia: _player!.socialMedia,
        careerLevel: _player!.careerLevel,
        achievements: _player!.achievements,
        lastPlayed: DateTime.now(),
      );
      
      await SaveService.savePlayer(_player!);
    }
  }
  
  // Train skill
  Future<void> trainSkill(String skillName) async {
    if (_player == null || _player!.energy < 20) return;
    
    int newSongwriting = _player!.songwriting;
    int newRapping = _player!.rapping;
    int newStagePerformance = _player!.stagePerformance;
    
    switch (skillName) {
      case 'songwriting':
        newSongwriting = (newSongwriting + 1).clamp(1, 100);
        break;
      case 'rapping':
        newRapping = (newRapping + 1).clamp(1, 100);
        break;
      case 'stagePerformance':
        newStagePerformance = (newStagePerformance + 1).clamp(1, 100);
        break;
    }
    
    _player = Player(
      id: _player!.id,
      stageName: _player!.stageName,
      avatar: _player!.avatar,
      city: _player!.city,
      age: _player!.age,
      year: _player!.year,
      week: _player!.week,
      fame: _player!.fame,
      reputation: _player!.reputation,
      fans: _player!.fans,
      followers: _player!.followers,
      netWorth: _player!.netWorth,
      energy: (_player!.energy - 20).clamp(0, 100),
      songwriting: newSongwriting,
      rapping: newRapping,
      stagePerformance: newStagePerformance,
      socialMedia: _player!.socialMedia,
      careerLevel: _player!.careerLevel,
      achievements: _player!.achievements,
      lastPlayed: DateTime.now(),
    );
    
    await SaveService.savePlayer(_player!);
    notifyListeners();
  }
  
  // Check for new achievements
  void _checkAchievements() {
    if (_player == null) return;
    
    List<String> newAchievements = [];
    
    // Check various achievement conditions
    if (_player!.followers >= 1000 && !_player!.achievements.contains('first_1k_followers')) {
      newAchievements.add('first_1k_followers');
    }
    
    if (_releases.isNotEmpty && !_player!.achievements.contains('first_release')) {
      newAchievements.add('first_release');
    }
    
    if (_releases.any((r) => r.type == ReleaseType.album) && !_player!.achievements.contains('first_album')) {
      newAchievements.add('first_album');
    }
    
    if (_releases.any((r) => r.streams >= 1000000) && !_player!.achievements.contains('million_streams')) {
      newAchievements.add('million_streams');
    }
    
    if (_player!.careerLevel >= 7 && !_player!.achievements.contains('global_icon')) {
      newAchievements.add('global_icon');
    }
    
    // Add new achievements
    _player!.achievements.addAll(newAchievements);
  }
  
  // Purchase item
  Future<void> purchaseItem({
    required String itemName,
    required double price,
    required int fameBoost,
    required int repBoost,
  }) async {
    if (_player == null || _player!.netWorth < price) return;
    
    _player = Player(
      id: _player!.id,
      stageName: _player!.stageName,
      avatar: _player!.avatar,
      city: _player!.city,
      age: _player!.age,
      year: _player!.year,
      week: _player!.week,
      fame: (_player!.fame + fameBoost).clamp(0, 100),
      reputation: (_player!.reputation + repBoost).clamp(0, 100),
      fans: _player!.fans,
      followers: _player!.followers,
      netWorth: _player!.netWorth - price,
      energy: _player!.energy,
      songwriting: _player!.songwriting,
      rapping: _player!.rapping,
      stagePerformance: _player!.stagePerformance,
      socialMedia: _player!.socialMedia,
      careerLevel: _player!.careerLevel,
      achievements: _player!.achievements,
      lastPlayed: DateTime.now(),
    );
    
    await SaveService.savePlayer(_player!);
    notifyListeners();
  }
  
  // Reset game
  Future<void> resetGame() async {
    _player = null;
    _releases.clear();
    await SaveService.clearSave();
    await DatabaseService.instance.clearDatabase();
    notifyListeners();
  }
}