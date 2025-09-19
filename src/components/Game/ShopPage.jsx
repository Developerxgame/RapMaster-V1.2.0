import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCar, FiHome, FiShirt, FiWatch, FiSmartphone, FiMic, FiDollarSign } = FiIcons;

export default function ShopPage() {
  const { state, dispatch } = useGame();
  const { player } = state;
  const [activeCategory, setActiveCategory] = useState('cars');

  const categories = [
    { id: 'cars', name: 'Cars', icon: FiCar },
    { id: 'houses', name: 'Houses', icon: FiHome },
    { id: 'clothes', name: 'Clothes', icon: FiShirt },
    { id: 'accessories', name: 'Accessories', icon: FiWatch },
    { id: 'phones', name: 'Phones', icon: FiSmartphone },
    { id: 'studio', name: 'Studio', icon: FiMic }
  ];

  const items = {
    cars: [
      { id: 1, name: 'Used Honda Civic', price: 5000, fame: 2, reputation: 1, emoji: '🚗' },
      { id: 2, name: 'BMW 3 Series', price: 15000, fame: 5, reputation: 3, emoji: '🚙' },
      { id: 3, name: 'Mercedes C-Class', price: 30000, fame: 8, reputation: 5, emoji: '🚘' },
      { id: 4, name: 'Tesla Model S', price: 80000, fame: 15, reputation: 10, emoji: '🔋' },
      { id: 5, name: 'Lamborghini', price: 200000, fame: 30, reputation: 20, emoji: '🏎️' },
      { id: 6, name: 'Bugatti Chiron', price: 3000000, fame: 100, reputation: 50, emoji: '💎' }
    ],
    houses: [
      { id: 1, name: 'Studio Apartment', price: 50000, fame: 5, reputation: 3, emoji: '🏠' },
      { id: 2, name: 'City Condo', price: 150000, fame: 10, reputation: 8, emoji: '🏢' },
      { id: 3, name: 'Suburban House', price: 300000, fame: 20, reputation: 15, emoji: '🏡' },
      { id: 4, name: 'Luxury Villa', price: 1000000, fame: 50, reputation: 30, emoji: '🏰' },
      { id: 5, name: 'Beverly Hills Mansion', price: 5000000, fame: 150, reputation: 100, emoji: '🏛️' }
    ],
    clothes: [
      { id: 1, name: 'Basic Streetwear', price: 100, fame: 1, reputation: 1, emoji: '👕' },
      { id: 2, name: 'Designer Hoodie', price: 500, fame: 2, reputation: 2, emoji: '🧥' },
      { id: 3, name: 'Luxury Brand Set', price: 2000, fame: 5, reputation: 4, emoji: '👔' },
      { id: 4, name: 'Custom Diamond Chain', price: 10000, fame: 15, reputation: 10, emoji: '💎' },
      { id: 5, name: 'Red Carpet Outfit', price: 50000, fame: 40, reputation: 25, emoji: '🤵' }
    ],
    accessories: [
      { id: 1, name: 'Basic Watch', price: 200, fame: 1, reputation: 1, emoji: '⌚' },
      { id: 2, name: 'Gold Chain', price: 1000, fame: 3, reputation: 2, emoji: '📿' },
      { id: 3, name: 'Diamond Earrings', price: 5000, fame: 8, reputation: 5, emoji: '💍' },
      { id: 4, name: 'Rolex Watch', price: 25000, fame: 20, reputation: 15, emoji: '⌚' },
      { id: 5, name: 'Custom Grillz', price: 15000, fame: 25, reputation: 10, emoji: '😬' }
    ],
    phones: [
      { id: 1, name: 'Basic Smartphone', price: 300, fame: 1, reputation: 1, emoji: '📱' },
      { id: 2, name: 'iPhone Pro', price: 1200, fame: 3, reputation: 2, emoji: '📱' },
      { id: 3, name: 'Custom Gold iPhone', price: 5000, fame: 10, reputation: 5, emoji: '📱' },
      { id: 4, name: 'Diamond Encrusted Phone', price: 50000, fame: 30, reputation: 20, emoji: '💎' }
    ],
    studio: [
      { id: 1, name: 'Basic Microphone', price: 100, fame: 0, reputation: 1, emoji: '🎤' },
      { id: 2, name: 'Professional Mic', price: 500, fame: 2, reputation: 3, emoji: '🎙️' },
      { id: 3, name: 'Studio Monitors', price: 1000, fame: 3, reputation: 5, emoji: '🔊' },
      { id: 4, name: 'Mixing Console', price: 5000, fame: 8, reputation: 10, emoji: '🎛️' },
      { id: 5, name: 'Full Studio Setup', price: 50000, fame: 30, reputation: 40, emoji: '🏭' }
    ]
  };

  const buyItem = (item) => {
    if (player.netWorth >= item.price) {
      dispatch({
        type: 'UPDATE_PLAYER',
        payload: {
          netWorth: player.netWorth - item.price,
          fame: player.fame + item.fame,
          reputation: player.reputation + item.reputation
        }
      });
    }
  };

  const canAfford = (item) => player.netWorth >= item.price;

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(1)}K`;
    }
    return `$${price}`;
  };

  return (
    <div className="min-h-screen bg-dark-bg pb-24 pt-16">
      <div className="px-4 space-y-4 max-w-mobile mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-text-primary mb-2">Lifestyle Shop</h1>
          <p className="text-text-muted text-sm">Boost your fame and reputation</p>
          <div className="mt-3">
            <div className="flex items-center justify-center space-x-2 bg-neon-green/20 border border-neon-green/30 px-4 py-2 rounded-game inline-flex">
              <SafeIcon icon={FiDollarSign} className="text-neon-green" />
              <span className="text-neon-green font-semibold text-sm">
                Balance: ${player.netWorth.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-game whitespace-nowrap transition-all text-sm ${
                activeCategory === category.id
                  ? 'bg-neon-cyan text-white shadow-glow'
                  : 'game-card text-text-muted hover:text-text-primary'
              }`}
            >
              <SafeIcon icon={category.icon} className="text-sm" />
              <span className="font-semibold">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <motion.div
          key={activeCategory}
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {items[activeCategory].map((item) => {
            const affordable = canAfford(item);
            return (
              <motion.div
                key={item.id}
                className={`game-card p-4 shadow-dark ${
                  affordable ? 'hover:shadow-glow' : 'opacity-60'
                } transition-all`}
                whileHover={affordable ? { scale: 1.01 } : {}}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <h3 className="font-bold text-text-primary text-sm">{item.name}</h3>
                      <div className="flex items-center space-x-3 text-xs text-text-muted">
                        <span>+{item.fame} Fame</span>
                        <span>+{item.reputation} Rep</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-neon-green">
                      {formatPrice(item.price)}
                    </div>
                    {!affordable && (
                      <div className="text-xs text-neon-red">Can't afford</div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => buyItem(item)}
                  disabled={!affordable}
                  className={`w-full py-3 px-4 rounded-game font-semibold transition-all text-sm ${
                    affordable
                      ? 'game-button hover-glow'
                      : 'bg-dark-surface/50 text-text-disabled cursor-not-allowed'
                  }`}
                >
                  {affordable ? 'Buy Now' : 'Insufficient Funds'}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}