import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSettings, FiDollarSign, FiZap, FiPlus, FiBookOpen } = FiIcons;

export default function Header() {
  const navigate = useNavigate();
  const { state } = useGame();
  const { player } = state;

  const getWeekProgress = () => {
    const progress = (player.week / 52) * 100;
    return Math.min(progress, 100);
  };

  const formatMoney = (amount) => {
    const wholeAmount = Math.floor(amount);
    if (wholeAmount >= 1000000000000) {
      return `$${(wholeAmount / 1000000000000).toFixed(1)}T`;
    } else if (wholeAmount >= 1000000000) {
      return `$${(wholeAmount / 1000000000).toFixed(1)}B`;
    } else if (wholeAmount >= 1000000) {
      return `$${(wholeAmount / 1000000).toFixed(1)}M`;
    } else if (wholeAmount >= 1000) {
      return `$${(wholeAmount / 1000).toFixed(1)}K`;
    }
    return `$${wholeAmount}`;
  };

  const getMonthName = (week) => {
    const month = Math.ceil(week / 4.33);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[(month - 1) % 12];
  };

  const yearsLeft = 60 - player.age;

  return (
    <div className="fixed top-0 left-0 right-0 bg-dark-bg/95 backdrop-blur-xl border-b border-dark-border/30 px-4 py-3 z-50">
      <div className="flex items-center justify-between max-w-mobile mx-auto">
        {/* Date and Progress */}
        <div className="flex items-center space-x-3">
          <div className="text-left">
            <div className="text-sm font-semibold text-text-primary">
              {getMonthName(player.week)} {player.year}
            </div>
            <div className="text-xs text-text-muted">
              Age {player.age}
            </div>
          </div>
          <div className="w-16 h-2 progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getWeekProgress()}%` }} 
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gradient-to-r from-neon-green/20 to-success/20 border border-neon-green/30 px-3 py-1.5 rounded-game backdrop-blur-sm">
            <SafeIcon icon={FiDollarSign} className="text-neon-green text-sm" />
            <span className="text-sm font-semibold text-neon-green">
              {formatMoney(player.netWorth)}
            </span>
            <button className="ml-1 p-0.5 hover:bg-neon-green/20 rounded transition-colors">
              <SafeIcon icon={FiPlus} className="text-xs text-neon-green/70" />
            </button>
          </div>

          <div className="flex items-center space-x-1 bg-gradient-to-r from-neon-orange/20 to-warning/20 border border-neon-orange/30 px-3 py-1.5 rounded-game backdrop-blur-sm">
            <SafeIcon icon={FiZap} className="text-neon-orange text-sm" />
            <span className="text-sm font-semibold text-neon-orange">{player.energy}</span>
            <button className="ml-1 p-0.5 hover:bg-neon-orange/20 rounded transition-colors">
              <SafeIcon icon={FiPlus} className="text-xs text-neon-orange/70" />
            </button>
          </div>

          {/* Get Started Button */}
          <button
            onClick={() => navigate('/game/get-started')}
            className="p-2 hover:bg-neon-cyan/20 rounded-game transition-colors"
            title="Get Started Guide"
          >
            <SafeIcon icon={FiBookOpen} className="text-neon-cyan text-lg hover:text-neon-cyan" />
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-dark-surface/50 rounded-game transition-colors"
          >
            <SafeIcon icon={FiSettings} className="text-text-muted text-lg hover:text-text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}