import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/game_provider.dart';
import '../utils/app_theme.dart';
import '../pages/quick_actions/skills_page.dart';
import '../pages/quick_actions/awards_page.dart';
import '../pages/quick_actions/stats_page.dart';

class QuickActionMenu extends StatefulWidget {
  const QuickActionMenu({super.key});

  @override
  State<QuickActionMenu> createState() => _QuickActionMenuState();
}

class _QuickActionMenuState extends State<QuickActionMenu>
    with SingleTickerProviderStateMixin {
  bool _isExpanded = false;
  late AnimationController _animationController;
  late Animation<double> _expandAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _expandAnimation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _toggleMenu() {
    setState(() {
      _isExpanded = !_isExpanded;
    });
    
    if (_isExpanded) {
      _animationController.forward();
    } else {
      _animationController.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: 100,
      right: 16,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // Quick Action Buttons
          AnimatedBuilder(
            animation: _expandAnimation,
            builder: (context, child) {
              return Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  if (_expandAnimation.value > 0) ...[
                    Transform.scale(
                      scale: _expandAnimation.value,
                      child: Opacity(
                        opacity: _expandAnimation.value,
                        child: _buildActionButton(
                          'Skills',
                          Icons.fitness_center,
                          AppTheme.neonCyan,
                          () => _navigateToPage(context, const SkillsPage()),
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 12),
                    
                    Transform.scale(
                      scale: _expandAnimation.value,
                      child: Opacity(
                        opacity: _expandAnimation.value,
                        child: _buildActionButton(
                          'Awards',
                          Icons.emoji_events,
                          AppTheme.neonYellow,
                          () => _navigateToPage(context, const AwardsPage()),
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 12),
                    
                    Transform.scale(
                      scale: _expandAnimation.value,
                      child: Opacity(
                        opacity: _expandAnimation.value,
                        child: _buildActionButton(
                          'Stats',
                          Icons.bar_chart,
                          AppTheme.neonPurple,
                          () => _navigateToPage(context, const StatsPage()),
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 16),
                  ],
                ],
              );
            },
          ),
          
          // Main FAB
          FloatingActionButton(
            onPressed: _toggleMenu,
            backgroundColor: AppTheme.neonCyan,
            child: AnimatedRotation(
              turns: _isExpanded ? 0.125 : 0, // 45 degree rotation
              duration: const Duration(milliseconds: 300),
              child: Icon(
                _isExpanded ? Icons.close : Icons.add,
                color: Colors.white,
                size: 28,
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildActionButton(
    String label,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Label
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface.withOpacity(0.9),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: color.withOpacity(0.3),
              ),
            ),
            child: Text(
              label,
              style: TextStyle(
                color: color,
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          
          const SizedBox(width: 12),
          
          // Button
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [color, color.withOpacity(0.8)],
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: color.withOpacity(0.3),
                  blurRadius: 8,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: Icon(
              icon,
              color: Colors.white,
              size: 24,
            ),
          ),
        ],
      ),
    );
  }
  
  void _navigateToPage(BuildContext context, Widget page) {
    _toggleMenu();
    Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => page),
    );
  }
}