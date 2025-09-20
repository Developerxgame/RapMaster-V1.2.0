import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/game_provider.dart';
import '../../utils/app_theme.dart';

class AwardsPage extends StatelessWidget {
  const AwardsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<GameProvider>(
      builder: (context, gameProvider, child) {
        final player = gameProvider.player!;
        final releases = gameProvider.releases;
        
        // Define achievements
        final achievements = [
          Achievement(
            id: 'first_1k_followers',
            title: 'First 1K Followers',
            description: 'Reach 1,000 followers',
            icon: Icons.people,
            color: AppTheme.neonGreen,
            isUnlocked: player.followers >= 1000,
          ),
          Achievement(
            id: 'first_release',
            title: 'First Release',
            description: 'Release your first track',
            icon: Icons.music_note,
            color: AppTheme.neonCyan,
            isUnlocked: releases.isNotEmpty,
          ),
          Achievement(
            id: 'first_album',
            title: 'Album Artist',
            description: 'Release your first album',
            icon: Icons.album,
            color: AppTheme.neonPurple,
            isUnlocked: releases.any((r) => r.type.name == 'Album'),
          ),
          Achievement(
            id: 'million_streams',
            title: '1 Million Streams',
            description: 'Get 1M streams on a single release',
            icon: Icons.play_arrow,
            color: AppTheme.neonOrange,
            isUnlocked: releases.any((r) => r.streams >= 1000000),
          ),
          Achievement(
            id: 'viral_hit',
            title: 'Viral Hit',
            description: 'Create a viral release',
            icon: Icons.trending_up,
            color: AppTheme.neonRed,
            isUnlocked: releases.any((r) => r.isViral),
          ),
          Achievement(
            id: 'global_icon',
            title: 'Global Icon',
            description: 'Reach Global Icon career level',
            icon: Icons.public,
            color: AppTheme.neonYellow,
            isUnlocked: player.careerLevel >= 7,
          ),
          Achievement(
            id: 'legend_status',
            title: 'Legend Status',
            description: 'Become a Legend',
            icon: Icons.emoji_events,
            color: AppTheme.neonYellow,
            isUnlocked: player.careerLevel >= 8,
          ),
          Achievement(
            id: 'millionaire',
            title: 'Millionaire',
            description: 'Earn \$1,000,000 net worth',
            icon: Icons.attach_money,
            color: AppTheme.neonGreen,
            isUnlocked: player.netWorth >= 1000000,
          ),
        ];
        
        final unlockedAchievements = achievements.where((a) => a.isUnlocked).toList();
        final lockedAchievements = achievements.where((a) => !a.isUnlocked).toList();
        
        return Scaffold(
          appBar: AppBar(
            title: const Text('Awards & Achievements'),
            backgroundColor: Colors.transparent,
            elevation: 0,
          ),
          body: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppTheme.darkBg,
                  AppTheme.darkSurface,
                ],
              ),
            ),
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Progress Overview
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: AppTheme.neonGradient.scale(0.2),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: AppTheme.neonCyan.withOpacity(0.3),
                      ),
                      boxShadow: AppTheme.cardShadow,
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              '🏆',
                              style: TextStyle(fontSize: 32),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Career Progress',
                                  style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.textPrimary,
                                  ),
                                ),
                                Text(
                                  '${unlockedAchievements.length}/${achievements.length} Achievements',
                                  style: const TextStyle(
                                    fontSize: 16,
                                    color: AppTheme.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        
                        const SizedBox(height: 16),
                        
                        LinearProgressIndicator(
                          value: unlockedAchievements.length / achievements.length,
                          backgroundColor: AppTheme.darkBorder,
                          valueColor: const AlwaysStoppedAnimation<Color>(
                            AppTheme.neonCyan,
                          ),
                        ),
                        
                        const SizedBox(height: 8),
                        
                        Text(
                          '${((unlockedAchievements.length / achievements.length) * 100).toStringAsFixed(1)}% Complete',
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppTheme.textMuted,
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Unlocked Achievements
                  if (unlockedAchievements.isNotEmpty) ...[
                    const Text(
                      'Unlocked Achievements',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    
                    const SizedBox(height: 16),
                    
                    ...unlockedAchievements.map(
                      (achievement) => _buildAchievementCard(achievement, true),
                    ),
                    
                    const SizedBox(height: 24),
                  ],
                  
                  // Locked Achievements
                  if (lockedAchievements.isNotEmpty) ...[
                    const Text(
                      'Locked Achievements',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    
                    const SizedBox(height: 16),
                    
                    ...lockedAchievements.map(
                      (achievement) => _buildAchievementCard(achievement, false),
                    ),
                  ],
                  
                  if (unlockedAchievements.isEmpty && lockedAchievements.isEmpty)
                    const Center(
                      child: Text(
                        'No achievements available',
                        style: TextStyle(
                          fontSize: 16,
                          color: AppTheme.textMuted,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
  
  Widget _buildAchievementCard(Achievement achievement, bool isUnlocked) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: isUnlocked 
            ? AppTheme.cardGradient
            : null,
        color: isUnlocked 
            ? null
            : AppTheme.darkSurface.withOpacity(0.3),
        borderRadius: BorderRadius.circular(16),
        border: isUnlocked 
            ? Border.all(color: achievement.color.withOpacity(0.3))
            : Border.all(color: AppTheme.textMuted.withOpacity(0.2)),
        boxShadow: isUnlocked ? AppTheme.cardShadow : null,
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isUnlocked 
                  ? achievement.color.withOpacity(0.2)
                  : AppTheme.textMuted.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              achievement.icon,
              color: isUnlocked ? achievement.color : AppTheme.textMuted,
              size: 24,
            ),
          ),
          
          const SizedBox(width: 16),
          
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  achievement.title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: isUnlocked ? AppTheme.textPrimary : AppTheme.textMuted,
                  ),
                ),
                Text(
                  achievement.description,
                  style: TextStyle(
                    fontSize: 14,
                    color: isUnlocked ? AppTheme.textSecondary : AppTheme.textMuted,
                  ),
                ),
              ],
            ),
          ),
          
          if (isUnlocked) ...[
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: AppTheme.neonGreen,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text(
                'UNLOCKED',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ] else ...[
            Icon(
              Icons.lock,
              color: AppTheme.textMuted,
              size: 20,
            ),
          ],
        ],
      ),
    );
  }
}

class Achievement {
  final String id;
  final String title;
  final String description;
  final IconData icon;
  final Color color;
  final bool isUnlocked;
  
  Achievement({
    required this.id,
    required this.title,
    required this.description,
    required this.icon,
    required this.color,
    required this.isUnlocked,
  });
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