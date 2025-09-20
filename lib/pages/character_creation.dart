import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/game_provider.dart';
import '../utils/app_theme.dart';
import 'main_game.dart';

class CharacterCreation extends StatefulWidget {
  const CharacterCreation({super.key});

  @override
  State<CharacterCreation> createState() => _CharacterCreationState();
}

class _CharacterCreationState extends State<CharacterCreation> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  
  String _selectedAvatar = 'male_1';
  String _stageName = '';
  String _selectedCity = 'Los Angeles';
  
  final List<Map<String, String>> _avatars = [
    {'id': 'male_1', 'name': 'Street Style', 'emoji': '👨‍🎤'},
    {'id': 'male_2', 'name': 'Classic Rapper', 'emoji': '🕺'},
    {'id': 'female_1', 'name': 'Female MC', 'emoji': '👩‍🎤'},
    {'id': 'female_2', 'name': 'Rising Star', 'emoji': '💃'},
  ];
  
  final List<Map<String, String>> _cities = [
    {'name': 'Los Angeles', 'boost': 'Fame Boost', 'emoji': '🌴'},
    {'name': 'New York', 'boost': 'Reputation Boost', 'emoji': '🗽'},
    {'name': 'Atlanta', 'boost': 'Fan Growth', 'emoji': '🍑'},
    {'name': 'Chicago', 'boost': 'Business Boost', 'emoji': '🏙️'},
  ];

  void _nextPage() {
    if (_currentPage < 2) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _createCharacter();
    }
  }
  
  void _previousPage() {
    if (_currentPage > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }
  
  void _createCharacter() async {
    if (_stageName.isEmpty) return;
    
    await context.read<GameProvider>().createPlayer(
      stageName: _stageName,
      avatar: _selectedAvatar,
      city: _selectedCity,
    );
    
    if (mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (context) => const MainGame(),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppTheme.darkBg,
              AppTheme.darkSurface,
              AppTheme.neonPurple,
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    if (_currentPage > 0)
                      IconButton(
                        onPressed: _previousPage,
                        icon: const Icon(
                          Icons.arrow_back_ios,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                    
                    Expanded(
                      child: Column(
                        children: [
                          const Text(
                            'Create Artist',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          
                          const SizedBox(height: 8),
                          
                          // Progress Indicators
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: List.generate(3, (index) {
                              return Container(
                                margin: const EdgeInsets.symmetric(horizontal: 4),
                                width: 8,
                                height: 8,
                                decoration: BoxDecoration(
                                  color: index <= _currentPage 
                                      ? AppTheme.neonCyan 
                                      : AppTheme.textMuted,
                                  shape: BoxShape.circle,
                                ),
                              );
                            }),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              
              // Page Content
              Expanded(
                child: PageView(
                  controller: _pageController,
                  onPageChanged: (page) {
                    setState(() {
                      _currentPage = page;
                    });
                  },
                  children: [
                    _buildAvatarPage(),
                    _buildNamePage(),
                    _buildCityPage(),
                  ],
                ),
              ),
              
              // Continue Button
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _canContinue() ? _nextPage : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.neonCyan,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: Text(
                      _currentPage == 2 ? 'Start Career' : 'Continue',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
  
  bool _canContinue() {
    switch (_currentPage) {
      case 0:
        return _selectedAvatar.isNotEmpty;
      case 1:
        return _stageName.isNotEmpty;
      case 2:
        return _selectedCity.isNotEmpty;
      default:
        return false;
    }
  }
  
  Widget _buildAvatarPage() {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        children: [
          const Text(
            'Choose Your Avatar',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
            ),
          ),
          
          const SizedBox(height: 16),
          
          const Text(
            'Pick your rap style',
            style: TextStyle(
              fontSize: 16,
              color: AppTheme.textMuted,
            ),
          ),
          
          const SizedBox(height: 32),
          
          Expanded(
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 0.8,
              ),
              itemCount: _avatars.length,
              itemBuilder: (context, index) {
                final avatar = _avatars[index];
                final isSelected = avatar['id'] == _selectedAvatar;
                
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedAvatar = avatar['id']!;
                    });
                  },
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: isSelected 
                          ? AppTheme.neonGradient
                          : AppTheme.cardGradient,
                      borderRadius: BorderRadius.circular(20),
                      border: isSelected 
                          ? Border.all(color: AppTheme.neonCyan, width: 2)
                          : null,
                      boxShadow: isSelected 
                          ? AppTheme.neonGlow
                          : AppTheme.cardShadow,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          avatar['emoji']!,
                          style: const TextStyle(fontSize: 48),
                        ),
                        
                        const SizedBox(height: 16),
                        
                        Text(
                          avatar['name']!,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: isSelected 
                                ? Colors.white 
                                : AppTheme.textPrimary,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildNamePage() {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        children: [
          const Text(
            '🎤',
            style: TextStyle(fontSize: 64),
          ),
          
          const SizedBox(height: 24),
          
          const Text(
            'Stage Name',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
            ),
          ),
          
          const SizedBox(height: 16),
          
          const Text(
            'How will fans know you?',
            style: TextStyle(
              fontSize: 16,
              color: AppTheme.textMuted,
            ),
          ),
          
          const SizedBox(height: 32),
          
          Container(
            decoration: BoxDecoration(
              color: AppTheme.darkSurface.withOpacity(0.6),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: AppTheme.darkBorder,
                width: 1,
              ),
            ),
            child: TextField(
              onChanged: (value) {
                setState(() {
                  _stageName = value;
                });
              },
              style: const TextStyle(
                fontSize: 18,
                color: AppTheme.textPrimary,
              ),
              decoration: const InputDecoration(
                hintText: 'Enter your stage name',
                hintStyle: TextStyle(color: AppTheme.textMuted),
                border: InputBorder.none,
                contentPadding: EdgeInsets.all(20),
              ),
              maxLength: 20,
            ),
          ),
          
          const SizedBox(height: 24),
          
          ElevatedButton(
            onPressed: () {
              final randomNames = [
                'Lil Cipher', 'MC Thunder', 'Rap Phantom',
                'Young Legend', 'Flow Master', 'Beat King',
              ];
              setState(() {
                _stageName = randomNames[
                    DateTime.now().millisecond % randomNames.length
                ];
              });
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.darkSurface,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
            child: const Text(
              'Generate Random Name',
              style: TextStyle(color: AppTheme.textPrimary),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildCityPage() {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        children: [
          const Text(
            'Choose Your City',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
            ),
          ),
          
          const SizedBox(height: 16),
          
          const Text(
            'Each city provides unique benefits',
            style: TextStyle(
              fontSize: 16,
              color: AppTheme.textMuted,
            ),
          ),
          
          const SizedBox(height: 32),
          
          Expanded(
            child: ListView.builder(
              itemCount: _cities.length,
              itemBuilder: (context, index) {
                final city = _cities[index];
                final isSelected = city['name'] == _selectedCity;
                
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16.0),
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedCity = city['name']!;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: isSelected 
                            ? AppTheme.neonGradient
                            : AppTheme.cardGradient,
                        borderRadius: BorderRadius.circular(16),
                        border: isSelected 
                            ? Border.all(color: AppTheme.neonCyan, width: 2)
                            : null,
                        boxShadow: isSelected 
                            ? AppTheme.neonGlow
                            : AppTheme.cardShadow,
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Center(
                              child: Text(
                                city['emoji']!,
                                style: const TextStyle(fontSize: 24),
                              ),
                            ),
                          ),
                          
                          const SizedBox(width: 16),
                          
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  city['name']!,
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: isSelected 
                                        ? Colors.white 
                                        : AppTheme.textPrimary,
                                  ),
                                ),
                                Text(
                                  city['boost']!,
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: isSelected 
                                        ? Colors.white.withOpacity(0.8)
                                        : AppTheme.textMuted,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          
                          if (isSelected)
                            const Icon(
                              Icons.check_circle,
                              color: Colors.white,
                            ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}