import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/game_provider.dart';
import '../utils/app_theme.dart';
import '../widgets/quick_action_menu.dart';
import 'home_page.dart';
import 'work_page.dart';
import 'studio_page.dart';
import 'social_page.dart';
import 'shop_page.dart';

class MainGame extends StatefulWidget {
  const MainGame({super.key});

  @override
  State<MainGame> createState() => _MainGameState();
}

class _MainGameState extends State<MainGame> {
  int _currentIndex = 0;
  
  final List<Widget> _pages = [
    const HomePage(),
    const WorkPage(),
    const StudioPage(),
    const SocialPage(),
    const ShopPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Consumer<GameProvider>(
      builder: (context, gameProvider, child) {
        if (gameProvider.isLoading) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(
                color: AppTheme.neonCyan,
              ),
            ),
          );
        }
        
        if (!gameProvider.hasPlayer) {
          return const Scaffold(
            body: Center(
              child: Text(
                'No player data found',
                style: TextStyle(color: AppTheme.textPrimary),
              ),
            ),
          );
        }

        return Scaffold(
          body: Stack(
            children: [
              _pages[_currentIndex],
              const QuickActionMenu(),
            ],
          ),
          bottomNavigationBar: Container(
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppTheme.darkSurface, AppTheme.darkBg],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.3),
                  blurRadius: 10,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildNavItem(0, Icons.home, 'Home'),
                    _buildNavItem(1, Icons.work, 'Work'),
                    _buildNavItem(2, Icons.music_note, 'Studio'),
                    _buildNavItem(3, Icons.people, 'Social'),
                    _buildNavItem(4, Icons.shopping_bag, 'Shop'),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
  
  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = _currentIndex == index;
    
    return GestureDetector(
      onTap: () {
        setState(() {
          _currentIndex = index;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          gradient: isSelected ? AppTheme.neonGradient : null,
          borderRadius: BorderRadius.circular(20),
          boxShadow: isSelected ? AppTheme.neonGlow : null,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: isSelected ? Colors.white : AppTheme.textMuted,
              size: 24,
            ),
            if (index != 0) // No text for Home button as requested
              const SizedBox(height: 4),
            if (index != 0)
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: isSelected ? Colors.white : AppTheme.textMuted,
                ),
              ),
          ],
        ),
      ),
    );
  }
}