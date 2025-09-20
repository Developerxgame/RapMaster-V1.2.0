import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/player_model.dart';

class SaveService {
  static const String _playerKey = 'player_data';
  
  static Future<void> savePlayer(Player player) async {
    final prefs = await SharedPreferences.getInstance();
    final playerJson = jsonEncode(player.toMap());
    await prefs.setString(_playerKey, playerJson);
  }
  
  static Future<Player?> loadPlayer() async {
    final prefs = await SharedPreferences.getInstance();
    final playerJson = prefs.getString(_playerKey);
    
    if (playerJson == null) return null;
    
    try {
      final playerMap = jsonDecode(playerJson) as Map<String, dynamic>;
      return Player.fromMap(playerMap);
    } catch (e) {
      return null;
    }
  }
  
  static Future<void> clearSave() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_playerKey);
  }
  
  static Future<bool> hasSave() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey(_playerKey);
  }
}