import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/game_provider.dart';
import '../../utils/app_theme.dart';

class SkillsPage extends StatelessWidget {
  const SkillsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<GameProvider>(
      builder: (context, gameProvider, child) {
        final player = gameProvider.player!;
        
        return Scaffold(
          appBar: AppBar(
            title: const Text('Skills Training'),
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
                  // Energy Status
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: AppTheme.cardGradient,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: AppTheme.cardShadow,
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.battery_charging_full,
                          color: AppTheme.neonOrange,
                          size: 24,
                        ),
                        const SizedBox(width: 12),
                        Text(
                          'Energy: ${player.energy}/100',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          'Training costs 20 energy',
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppTheme.textMuted,
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Skills
                  _buildSkillCard(
                    context,
                    gameProvider,
                    'Songwriting',
                    player.songwriting,
                    Icons.edit,
                    AppTheme.neonCyan,
                    'songwriting',
                    'Improves track quality and earnings',
                  ),
                  
                  const SizedBox(height: 16),
                  
                  _buildSkillCard(
                    context,
                    gameProvider,
                    'Rapping',
                    player.rapping,
                    Icons.mic,
                    AppTheme.neonGreen,
                    'rapping',
                    'Boosts performance and fan growth',
                  ),
                  
                  const SizedBox(height: 16),
                  
                  _buildSkillCard(
                    context,
                    gameProvider,
                    'Stage Performance',
                    player.stagePerformance,
                    Icons.stage,
                    AppTheme.neonPink,
                    'stagePerformance',
                    'Increases concert success and reputation',
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
  
  Widget _buildSkillCard(
    BuildContext context,
    GameProvider gameProvider,
    String skillName,
    int skillLevel,
    IconData icon,
    Color color,
    String skillKey,
    String description,
  ) {
    final player = gameProvider.player!;
    final canTrain = player.energy >= 20 && skillLevel < 100;
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppTheme.cardGradient,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: color,
                  size: 24,
                ),
              ),
              
              const SizedBox(width: 16),
              
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      skillName,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    Text(
                      description,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              
              Text(
                '$skillLevel/100',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 16),
          
          // Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: skillLevel / 100,
              backgroundColor: AppTheme.darkBorder,
              valueColor: AlwaysStoppedAnimation<Color>(color),
              minHeight: 8,
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Train Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: canTrain 
                  ? () => _trainSkill(context, gameProvider, skillKey, skillName)
                  : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: canTrain ? color : AppTheme.textMuted,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Text(
                skillLevel >= 100 
                    ? 'MASTERED'
                    : canTrain 
                        ? 'Train Skill (-20 Energy)'
                        : 'Need Energy',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  void _trainSkill(
    BuildContext context,
    GameProvider gameProvider,
    String skillKey,
    String skillName,
  ) async {
    try {
      await gameProvider.trainSkill(skillKey);
      
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('$skillName improved!'),
            backgroundColor: AppTheme.neonGreen,
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to train skill: $e'),
            backgroundColor: AppTheme.neonRed,
          ),
        );
      }
    }
  }
}