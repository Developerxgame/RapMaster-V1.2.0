import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiBriefcase, FiMusic, FiGlobe, FiShoppingBag } = FiIcons;

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useGame();

  const navItems = [
    { icon: FiHome, path: '/game/home', label: 'Home' },
    { icon: FiBriefcase, path: '/game/job', label: 'Work' },
    { icon: FiMusic, path: '/game/studio', label: 'Studio' },
    { icon: FiGlobe, path: '/game/social', label: 'Social' },
    { icon: FiShoppingBag, path: '/game/shop', label: 'Shop' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    dispatch({ type: 'SET_CURRENT_PAGE', payload: path.split('/').pop() });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-xl border-t border-white/10 pb-6">
      <div className="flex items-center justify-around px-2 py-3 max-w-mobile mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-2xl transition-all duration-300 min-w-0 flex-shrink-0 ${
                isActive 
                  ? 'bg-gradient-to-b from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 shadow-lg' 
                  : 'hover:bg-white/10'
              }`}
            >
              <div className={`p-2.5 rounded-xl transition-all ${
                isActive 
                  ? 'bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg' 
                  : 'bg-white/10'
              }`}>
                <SafeIcon 
                  icon={item.icon} 
                  className={`text-lg ${isActive ? 'text-white' : 'text-gray-300'}`} 
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}