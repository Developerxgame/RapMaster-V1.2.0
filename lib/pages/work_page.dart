import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/game_provider.dart';
import '../models/release_model.dart';
import '../utils/app_theme.dart';

class WorkPage extends StatefulWidget {
  const WorkPage({super.key});

  @override
  State<WorkPage> createState() => _WorkPageState();
}

class _WorkPageState extends State<WorkPage> {
  final TextEditingController _titleController = TextEditingController();
  ReleaseType _selectedType = ReleaseType.track;
  int _selectedQuality = 5;
  bool _isReleasing = false;

  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<GameProvider>(
      builder: (context, gameProvider, child) {
        final player = gameProvider.player!;
        
        return Scaffold(
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
            child: SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    const Text(
                      'Release System',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    
                    const SizedBox(height: 8),
                    
                    const Text(
                      'Create and release your music to gain fame and fans',
                      style: TextStyle(
                        fontSize: 16,
                        color: AppTheme.textMuted,
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Energy Check
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
                            'Need 20 energy to release',
                            style: const TextStyle(
                              fontSize: 14,
                              color: AppTheme.textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Release Form
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: AppTheme.cardGradient,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: AppTheme.cardShadow,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Create New Release',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          
                          const SizedBox(height: 20),
                          
                          // Title Input
                          const Text(
                            'Title',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          
                          const SizedBox(height: 8),
                          
                          TextField(
                            controller: _titleController,
                            style: const TextStyle(color: AppTheme.textPrimary),
                            decoration: InputDecoration(
                              hintText: 'Enter title...',
                              hintStyle: const TextStyle(color: AppTheme.textMuted),
                              filled: true,
                              fillColor: AppTheme.darkSurface.withOpacity(0.6),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: const EdgeInsets.all(16),
                            ),
                          ),
                          
                          const SizedBox(height: 20),
                          
                          // Type Selection
                          const Text(
                            'Type',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          
                          const SizedBox(height: 12),
                          
                          Row(
                            children: ReleaseType.values.map((type) {
                              final isSelected = _selectedType == type;
                              return Expanded(
                                child: GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _selectedType = type;
                                    });
                                  },
                                  child: Container(
                                    margin: const EdgeInsets.symmetric(horizontal: 4),
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      gradient: isSelected 
                                          ? AppTheme.neonGradient
                                          : null,
                                      color: isSelected 
                                          ? null
                                          : AppTheme.darkSurface.withOpacity(0.6),
                                      borderRadius: BorderRadius.circular(12),
                                      border: isSelected 
                                          ? Border.all(color: AppTheme.neonCyan)
                                          : null,
                                    ),
                                    child: Column(
                                      children: [
                                        Text(
                                          type.emoji,
                                          style: const TextStyle(fontSize: 24),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          type.name,
                                          style: TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w600,
                                            color: isSelected 
                                                ? Colors.white
                                                : AppTheme.textPrimary,
                                          ),
                                          textAlign: TextAlign.center,
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                          
                          const SizedBox(height: 20),
                          
                          // Quality Slider
                          const Text(
                            'Quality',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          
                          const SizedBox(height: 8),
                          
                          Row(
                            children: [
                              Expanded(
                                child: Slider(
                                  value: _selectedQuality.toDouble(),
                                  min: 1,
                                  max: 10,
                                  divisions: 9,
                                  activeColor: AppTheme.neonCyan,
                                  inactiveColor: AppTheme.darkBorder,
                                  onChanged: (value) {
                                    setState(() {
                                      _selectedQuality = value.round();
                                    });
                                  },
                                ),
                              ),
                              
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: AppTheme.neonCyan.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  '$_selectedQuality/10',
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.neonCyan,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          
                          const SizedBox(height: 24),
                          
                          // Release Button
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: _canRelease(player) ? _releaseContent : null,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _canRelease(player) 
                                    ? AppTheme.neonCyan
                                    : AppTheme.textMuted,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: _isReleasing
                                  ? const SizedBox(
                                      width: 20,
                                      height: 20,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        valueColor: AlwaysStoppedAnimation<Color>(
                                          Colors.white,
                                        ),
                                      ),
                                    )
                                  : const Text(
                                      'Release Content (-20 Energy)',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Recent Releases
                    if (gameProvider.releases.isNotEmpty) ...[
                      const Text(
                        'Your Releases',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                      
                      const SizedBox(height: 16),
                      
                      ...gameProvider.releases.map(
                        (release) => Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            gradient: AppTheme.cardGradient,
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: AppTheme.cardShadow,
                          ),
                          child: Column(
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: AppTheme.neonPurple.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      release.type.emoji,
                                      style: const TextStyle(fontSize: 20),
                                    ),
                                  ),
                                  
                                  const SizedBox(width: 12),
                                  
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          release.title,
                                          style: const TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w600,
                                            color: AppTheme.textPrimary,
                                          ),
                                        ),
                                        Text(
                                          release.type.name,
                                          style: const TextStyle(
                                            fontSize: 14,
                                            color: AppTheme.textMuted,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Text(
                                        'Quality: ${release.quality}/10',
                                        style: const TextStyle(
                                          fontSize: 14,
                                          color: AppTheme.textMuted,
                                        ),
                                      ),
                                      if (release.isViral)
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 8,
                                            vertical: 2,
                                          ),
                                          decoration: BoxDecoration(
                                            color: AppTheme.neonRed,
                                            borderRadius: BorderRadius.circular(10),
                                          ),
                                          child: const Text(
                                            'VIRAL',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.white,
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                ],
                              ),
                              
                              const SizedBox(height: 12),
                              
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceAround,
                                children: [
                                  _buildStatItem(
                                    'Streams',
                                    _formatNumber(release.streams),
                                    Icons.play_arrow,
                                  ),
                                  _buildStatItem(
                                    'Views',
                                    _formatNumber(release.views),
                                    Icons.visibility,
                                  ),
                                  _buildStatItem(
                                    'Earnings',
                                    '\$${release.earnings.toStringAsFixed(0)}',
                                    Icons.attach_money,
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                    
                    const SizedBox(height: 100), // Bottom padding for FAB
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
  
  Widget _buildStatItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(
          icon,
          color: AppTheme.neonCyan,
          size: 20,
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppTheme.textPrimary,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: AppTheme.textMuted,
          ),
        ),
      ],
    );
  }
  
  bool _canRelease(player) {
    return _titleController.text.isNotEmpty && 
           player.energy >= 20 && 
           !_isReleasing;
  }
  
  void _releaseContent() async {
    if (!_canRelease(context.read<GameProvider>().player!)) return;
    
    setState(() {
      _isReleasing = true;
    });
    
    try {
      await context.read<GameProvider>().releaseContent(
        title: _titleController.text,
        type: _selectedType,
        quality: _selectedQuality,
      );
      
      _titleController.clear();
      setState(() {
        _selectedQuality = 5;
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Released "${_titleController.text}" successfully!'),
            backgroundColor: AppTheme.neonGreen,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to release content: $e'),
            backgroundColor: AppTheme.neonRed,
          ),
        );
      }
    }
    
    setState(() {
      _isReleasing = false;
    });
  }
  
  String _formatNumber(int number) {
    if (number >= 1000000) {
      return '${(number / 1000000).toStringAsFixed(1)}M';
    } else if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(1)}K';
    }
    return number.toString();
  }
}