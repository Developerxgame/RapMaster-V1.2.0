import 'package:flutter/material.dart';
import '../models/player_model.dart';
import '../utils/app_theme.dart';

class LevelProgressCard extends StatelessWidget {
  final Player player;

  const LevelProgressCard({
    super.key,
    required this.player,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppTheme.neonGradient.scale(0.2),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: AppTheme.neonCyan.withOpacity(0.3),
        ),
        boxShadow: AppTheme.neonGlow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                player.careerEmoji,
                style: const TextStyle(fontSize: 32),
              ),
              
              const SizedBox(width: 12),
              
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      player.careerLevelName,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    Text(
                      'Level ${player.careerLevel}/8',
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              
              Text(
                '${player.city}',
                style: const TextStyle(
                  fontSize: 14,
                  color: AppTheme.textMuted,
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 16),
          
          // Progress to next level
          if (player.careerLevel < 8) ...[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Progress to next level',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppTheme.textSecondary,
                  ),
                ),
                Text(
                  _getProgressText(),
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.neonCyan,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 8),
            
            LinearProgressIndicator(
              value: _getProgressValue(),
              backgroundColor: AppTheme.darkBorder,
              valueColor: const AlwaysStoppedAnimation<Color>(
                AppTheme.neonCyan,
              ),
            ),
          ] else ...[
            const Text(
              '🏆 Maximum Level Reached!',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppTheme.neonYellow,
              ),
            ),
          ],
        ],
      ),
    );
  }
  
  String _getProgressText() {
    const levelRequirements = [
      [0, 0],    // Level 1
      [10, 10],  // Level 2  
      [20, 20],  // Level 3
      [30, 30],  // Level 4
      [50, 40],  // Level 5
      [70, 50],  // Level 6
      [85, 70],  // Level 7
      [95, 90],  // Level 8
    ];
    
    if (player.careerLevel >= 8) return '100%';
    
    final nextLevel = levelRequirements[player.careerLevel];
    final fameNeeded = nextLevel[0] - player.fame;
    final repNeeded = nextLevel[1] - player.reputation;
    
    if (fameNeeded <= 0 && repNeeded <= 0) {
      return 'Ready to level up!';
    }
    
    return 'Fame: ${fameNeeded > 0 ? '+$fameNeeded' : '✓'} | Rep: ${repNeeded > 0 ? '+$repNeeded' : '✓'}';
  }
  
  double _getProgressValue() {
    const levelRequirements = [
      [0, 0],    // Level 1
      [10, 10],  // Level 2  
      [20, 20],  // Level 3
      [30, 30],  // Level 4
      [50, 40],  // Level 5
      [70, 50],  // Level 6
      [85, 70],  // Level 7
      [95, 90],  // Level 8
    ];
    
    if (player.careerLevel >= 8) return 1.0;
    
    final currentLevel = levelRequirements[player.careerLevel - 1];
    final nextLevel = levelRequirements[player.careerLevel];
    
    final fameProgress = (player.fame - currentLevel[0]) / (nextLevel[0] - currentLevel[0]);
    final repProgress = (player.reputation - currentLevel[1]) / (nextLevel[1] - currentLevel[1]);
    
    return ((fameProgress + repProgress) / 2).clamp(0.0, 1.0);
  }
}

extension LinearGradientScale on LinearGradient {
  LinearGradient scale(double opacity) {
    return LinearGradient(
      colors: colors.map((color) => color.withOpacity(opacity)).toList(),
      begin: begin,
      end: end,
    );
  }
}