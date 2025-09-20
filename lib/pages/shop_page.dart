import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/game_provider.dart';
import '../utils/app_theme.dart';

class ShopPage extends StatefulWidget {
  const ShopPage({super.key});

  @override
  State<ShopPage> createState() => _ShopPageState();
}

class _ShopPageState extends State<ShopPage> {
  int _selectedCategory = 0;
  
  final List<String> _categories = [
    'Cars',
    'Houses', 
    'Jewelry',
    'Clothes',
    'Boosts',
  ];
  
  final Map<String, List<ShopItem>> _items = {
    'Cars': [
      ShopItem('Used Honda Civic', 5000, 2, 1, '🚗'),
      ShopItem('BMW 3 Series', 15000, 5, 3, '🚙'),
      ShopItem('Mercedes C-Class', 30000, 8, 5, '🚘'),
      ShopItem('Tesla Model S', 80000, 15, 10, '🔋'),
      ShopItem('Lamborghini', 200000, 30, 20, '🏎️'),
    ],
    'Houses': [
      ShopItem('Studio Apartment', 50000, 5, 3, '🏠'),
      ShopItem('City Condo', 150000, 10, 8, '🏢'),
      ShopItem('Suburban House', 300000, 20, 15, '🏡'),
      ShopItem('Luxury Villa', 1000000, 50, 30, '🏰'),
      ShopItem('Beverly Hills Mansion', 5000000, 150, 100, '🏛️'),
    ],
    'Jewelry': [
      ShopItem('Basic Chain', 200, 1, 1, '📿'),
      ShopItem('Gold Watch', 1000, 3, 2, '⌚'),
      ShopItem('Diamond Ring', 5000, 8, 5, '💍'),
      ShopItem('Custom Grillz', 15000, 25, 10, '😬'),
      ShopItem('Diamond Chain', 50000, 40, 25, '💎'),
    ],
    'Clothes': [
      ShopItem('Basic Streetwear', 100, 1, 1, '👕'),
      ShopItem('Designer Hoodie', 500, 2, 2, '🧥'),
      ShopItem('Luxury Brand Set', 2000, 5, 4, '👔'),
      ShopItem('Custom Outfit', 10000, 15, 10, '🤵'),
      ShopItem('Red Carpet Look', 50000, 40, 25, '🎭'),
    ],
    'Boosts': [
      ShopItem('Energy Drink', 50, 0, 0, '⚡', energyBoost: 20),
      ShopItem('Fame Boost', 1000, 5, 0, '⭐'),
      ShopItem('Rep Boost', 1500, 0, 5, '📈'),
      ShopItem('Mega Boost', 5000, 10, 10, '🚀', energyBoost: 50),
      ShopItem('Legend Package', 25000, 25, 25, '👑', energyBoost: 100),
    ],
  };

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
              child: Column(
                children: [
                  // Header
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Lifestyle Shop',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                        
                        const SizedBox(height: 8),
                        
                        const Text(
                          'Boost your fame and reputation with luxury items',
                          style: TextStyle(
                            fontSize: 16,
                            color: AppTheme.textMuted,
                          ),
                        ),
                        
                        const SizedBox(height: 16),
                        
                        // Net Worth Display
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            gradient: AppTheme.neonGradient.scale(0.2),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: AppTheme.neonGreen.withOpacity(0.3),
                            ),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.account_balance_wallet,
                                color: AppTheme.neonGreen,
                                size: 24,
                              ),
                              const SizedBox(width: 12),
                              Text(
                                'Balance: \$${_formatMoney(player.netWorth)}',
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.neonGreen,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  // Category Tabs
                  Container(
                    height: 50,
                    margin: const EdgeInsets.symmetric(horizontal: 16),
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _categories.length,
                      itemBuilder: (context, index) {
                        final isSelected = _selectedCategory == index;
                        return GestureDetector(
                          onTap: () {
                            setState(() {
                              _selectedCategory = index;
                            });
                          },
                          child: Container(
                            margin: const EdgeInsets.only(right: 12),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 20,
                              vertical: 12,
                            ),
                            decoration: BoxDecoration(
                              gradient: isSelected 
                                  ? AppTheme.neonGradient
                                  : null,
                              color: isSelected 
                                  ? null
                                  : AppTheme.darkSurface.withOpacity(0.6),
                              borderRadius: BorderRadius.circular(25),
                              border: isSelected 
                                  ? Border.all(color: AppTheme.neonCyan)
                                  : null,
                            ),
                            child: Center(
                              child: Text(
                                _categories[index],
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: isSelected 
                                      ? Colors.white
                                      : AppTheme.textPrimary,
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Items Grid
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: GridView.builder(
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                          childAspectRatio: 0.75,
                        ),
                        itemCount: _items[_categories[_selectedCategory]]?.length ?? 0,
                        itemBuilder: (context, index) {
                          final item = _items[_categories[_selectedCategory]]![index];
                          final canAfford = player.netWorth >= item.price;
                          
                          return GestureDetector(
                            onTap: canAfford 
                                ? () => _purchaseItem(context, gameProvider, item)
                                : null,
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                gradient: canAfford 
                                    ? AppTheme.cardGradient
                                    : null,
                                color: canAfford 
                                    ? null
                                    : AppTheme.darkSurface.withOpacity(0.3),
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: canAfford 
                                    ? AppTheme.cardShadow
                                    : null,
                                border: !canAfford 
                                    ? Border.all(
                                        color: AppTheme.textMuted.withOpacity(0.3),
                                      )
                                    : null,
                              ),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    item.emoji,
                                    style: TextStyle(
                                      fontSize: 40,
                                      color: canAfford 
                                          ? null
                                          : AppTheme.textMuted.withOpacity(0.5),
                                    ),
                                  ),
                                  
                                  const SizedBox(height: 12),
                                  
                                  Text(
                                    item.name,
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.bold,
                                      color: canAfford 
                                          ? AppTheme.textPrimary
                                          : AppTheme.textMuted,
                                    ),
                                  ),
                                  
                                  const SizedBox(height: 8),
                                  
                                  Text(
                                    '\$${_formatMoney(item.price)}',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                      color: canAfford 
                                          ? AppTheme.neonGreen
                                          : AppTheme.textMuted,
                                    ),
                                  ),
                                  
                                  const SizedBox(height: 8),
                                  
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      if (item.fameBoost > 0) ...[
                                        Icon(
                                          Icons.star,
                                          color: AppTheme.neonYellow,
                                          size: 16,
                                        ),
                                        Text(
                                          ' +${item.fameBoost}',
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: canAfford 
                                                ? AppTheme.neonYellow
                                                : AppTheme.textMuted,
                                          ),
                                        ),
                                      ],
                                      
                                      if (item.fameBoost > 0 && item.repBoost > 0)
                                        const SizedBox(width: 8),
                                      
                                      if (item.repBoost > 0) ...[
                                        Icon(
                                          Icons.trending_up,
                                          color: AppTheme.neonCyan,
                                          size: 16,
                                        ),
                                        Text(
                                          ' +${item.repBoost}',
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: canAfford 
                                                ? AppTheme.neonCyan
                                                : AppTheme.textMuted,
                                          ),
                                        ),
                                      ],
                                      
                                      if (item.energyBoost > 0) ...[
                                        if (item.fameBoost > 0 || item.repBoost > 0)
                                          const SizedBox(width: 8),
                                        Icon(
                                          Icons.battery_charging_full,
                                          color: AppTheme.neonOrange,
                                          size: 16,
                                        ),
                                        Text(
                                          ' +${item.energyBoost}',
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: canAfford 
                                                ? AppTheme.neonOrange
                                                : AppTheme.textMuted,
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                  
                                  const SizedBox(height: 12),
                                  
                                  Container(
                                    width: double.infinity,
                                    padding: const EdgeInsets.symmetric(vertical: 8),
                                    decoration: BoxDecoration(
                                      color: canAfford 
                                          ? AppTheme.neonCyan
                                          : AppTheme.textMuted,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      canAfford ? 'BUY' : 'LOCKED',
                                      textAlign: TextAlign.center,
                                      style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 100), // Bottom padding for FAB
                ],
              ),
            ),
          ),
        );
      },
    );
  }
  
  void _purchaseItem(
    BuildContext context,
    GameProvider gameProvider,
    ShopItem item,
  ) async {
    try {
      await gameProvider.purchaseItem(
        itemName: item.name,
        price: item.price,
        fameBoost: item.fameBoost,
        repBoost: item.repBoost,
      );
      
      // Apply energy boost if applicable
      if (item.energyBoost > 0) {
        final player = gameProvider.player!;
        final updatedPlayer = Player(
          id: player.id,
          stageName: player.stageName,
          avatar: player.avatar,
          city: player.city,
          age: player.age,
          year: player.year,
          week: player.week,
          fame: player.fame,
          reputation: player.reputation,
          fans: player.fans,
          followers: player.followers,
          netWorth: player.netWorth,
          energy: (player.energy + item.energyBoost).clamp(0, 100),
          songwriting: player.songwriting,
          rapping: player.rapping,
          stagePerformance: player.stagePerformance,
          socialMedia: player.socialMedia,
          careerLevel: player.careerLevel,
          achievements: player.achievements,
          lastPlayed: DateTime.now(),
        );
        
        await gameProvider.updatePlayer(updatedPlayer);
      }
      
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Purchased ${item.name}!'),
            backgroundColor: AppTheme.neonGreen,
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to purchase item: $e'),
            backgroundColor: AppTheme.neonRed,
          ),
        );
      }
    }
  }
  
  String _formatMoney(double amount) {
    if (amount >= 1000000) {
      return '${(amount / 1000000).toStringAsFixed(1)}M';
    } else if (amount >= 1000) {
      return '${(amount / 1000).toStringAsFixed(1)}K';
    }
    return amount.toStringAsFixed(0);
  }
}

class ShopItem {
  final String name;
  final double price;
  final int fameBoost;
  final int repBoost;
  final String emoji;
  final int energyBoost;
  
  ShopItem(
    this.name,
    this.price,
    this.fameBoost,
    this.repBoost,
    this.emoji, {
    this.energyBoost = 0,
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