import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import ShareModal from './ShareModal';
import ShareButton from './ShareButton';
import { CareerProgression, CAREER_LEVELS } from '../../utils/careerSystem';
import * as FiIcons from 'react-icons/fi';

const {
  FiStar, FiTrendingUp, FiUsers, FiDollarSign, FiMusic, FiDisc, FiVideo,
  FiCalendar, FiTarget, FiEye, FiPlay, FiYoutube, FiAward, FiCrown,
  FiBarChart, FiActivity, FiArrowUp, FiArrowDown, FiMinus, FiZap,
  FiHeart, FiBriefcase, FiMic
} = FiIcons;

export default function EnhancedStatsPage() {
  const { state } = useGame();
  const { player, tracks, albums, musicVideos, releases, earnings } = state;
  const [shareModal, setShareModal] = useState({ isOpen: false, data: null });
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  // Get current career level using the new system
  const currentLevel = CareerProgression.getCurrentLevel(player.fame, player.reputation);
  const nextLevelReq = CareerProgression.getNextLevelRequirements(currentLevel);
  const levelMultipliers = CareerProgression.getLevelMultipliers(currentLevel);

  // Enhanced main stats with trend indicators
  const mainStats = [
    {
      icon: FiStar,
      label: 'Fame',
      value: player.fame,
      max: 100,
      color: 'text-neon-yellow',
      bgColor: 'bg-neon-yellow',
      description: 'Your popularity in the music scene',
      trend: calculateTrend('fame'),
      nextMilestone: nextLevelReq ? nextLevelReq.fameRequired : 100
    },
    {
      icon: FiTrendingUp,
      label: 'Reputation',
      value: player.reputation,
      max: 100,
      color: 'text-neon-cyan',
      bgColor: 'bg-neon-cyan',
      description: 'How respected you are in the industry',
      trend: calculateTrend('reputation'),
      nextMilestone: nextLevelReq ? nextLevelReq.reputationRequired : 100
    },
    {
      icon: FiUsers,
      label: 'Fans',
      value: player.fans,
      color: 'text-neon-green',
      bgColor: 'bg-neon-green',
      description: 'Your loyal fanbase',
      trend: calculateTrend('fans'),
      formatted: formatNumber(player.fans)
    },
    {
      icon: FiDollarSign,
      label: 'Net Worth',
      value: player.netWorth,
      color: 'text-neon-green',
      bgColor: 'bg-neon-green',
      description: 'Your total wealth',
      trend: calculateTrend('netWorth'),
      formatted: formatMoney(player.netWorth)
    }
  ];

  // Enhanced career progression stats
  const careerStats = [
    {
      icon: FiMusic,
      label: 'Tracks Created',
      value: tracks.length,
      color: 'text-neon-purple',
      multiplier: levelMultipliers.opportunities
    },
    {
      icon: FiDisc,
      label: 'Albums Released',
      value: albums.filter(a => a.released).length,
      color: 'text-neon-orange',
      multiplier: levelMultipliers.earnings
    },
    {
      icon: FiVideo,
      label: 'Music Videos',
      value: musicVideos.length,
      color: 'text-neon-red',
      multiplier: levelMultipliers.fanGrowth
    },
    {
      icon: FiPlay,
      label: 'Total Releases',
      value: releases.length,
      color: 'text-neon-pink',
      multiplier: levelMultipliers.earnings
    }
  ];

  // Enhanced performance metrics
  const totalViews = releases.reduce((sum, release) => sum + release.views, 0);
  const totalStreams = releases.reduce((sum, release) => sum + (release.streams || 0), 0);
  const thisWeekViews = releases.reduce((sum, release) => sum + (release.weeklyViews || 0), 0);
  const peakWeeklyViews = Math.max(...releases.map(r => r.peakWeeklyViews || 0), 0);
  const viralHits = releases.filter(r => r.isViral).length;
  const chartHits = releases.filter(r => r.chartPosition && r.chartPosition <= 10).length;
  const trendingReleases = releases.filter(r => r.trending).length;

  // Level progress calculation
  const levelProgress = calculateLevelProgress();

  // Skills overview with level impact
  const skillsOverview = [
    {
      name: 'Lyrics',
      value: player.skills.lyrics,
      max: 100,
      color: 'bg-neon-cyan',
      impact: 'Content Quality',
      levelBonus: Math.floor(currentLevel.id * 2)
    },
    {
      name: 'Flow',
      value: player.skills.flow,
      max: 100,
      color: 'bg-neon-green',
      impact: 'Performance',
      levelBonus: Math.floor(currentLevel.id * 2)
    },
    {
      name: 'Charisma',
      value: player.skills.charisma,
      max: 100,
      color: 'bg-neon-pink',
      impact: 'Fan Growth',
      levelBonus: Math.floor(currentLevel.id * 3)
    },
    {
      name: 'Business',
      value: player.skills.business,
      max: 100,
      color: 'bg-neon-orange',
      impact: 'Earnings',
      levelBonus: Math.floor(currentLevel.id * 4)
    },
    {
      name: 'Production',
      value: player.skills.production,
      max: 100,
      color: 'bg-neon-purple',
      impact: 'Quality',
      levelBonus: Math.floor(currentLevel.id * 2)
    }
  ];

  // Calculate trend for stats (mock implementation)
  function calculateTrend(statName) {
    // This would typically compare current vs previous week/month
    // For now, return random trend for demonstration
    const trends = ['up', 'down', 'stable'];
    return trends[Math.floor(Math.random() * trends.length)];
  }

  function calculateLevelProgress() {
    if (!nextLevelReq) return 100; // Max level reached

    const fameProgress = (player.fame / nextLevelReq.fameRequired) * 100;
    const repProgress = (player.reputation / nextLevelReq.reputationRequired) * 100;
    
    return Math.min(fameProgress, repProgress);
  }

  function formatNumber(num) {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }

  function formatMoney(amount) {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${Math.floor(amount)}`;
  }

  function getTrendIcon(trend) {
    switch (trend) {
      case 'up': return { icon: FiArrowUp, color: 'text-neon-green' };
      case 'down': return { icon: FiArrowDown, color: 'text-neon-red' };
      default: return { icon: FiMinus, color: 'text-text-muted' };
    }
  }

  const handleShareStats = () => {
    setShareModal({
      isOpen: true,
      data: {
        type: 'career',
        stats: {
          fame: player.fame,
          fans: player.fans,
          netWorth: player.netWorth,
          level: currentLevel.title
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg pb-24 pt-16">
      <div className="px-4 space-y-4 max-w-mobile mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-text-primary mb-2">Enhanced Career Statistics</h1>
          <p className="text-text-muted text-sm">Track your journey to musical legend</p>
        </div>

        {/* Enhanced Career Level Display */}
        <motion.div 
          className="bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 p-4 rounded-game-lg text-text-primary shadow-glow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="text-3xl mb-2">{currentLevel.emoji}</div>
              <h2 className="text-lg font-bold mb-1 neon-text">{currentLevel.title}</h2>
              <p className="text-text-secondary text-sm mb-2">{currentLevel.description}</p>
              <div className="flex items-center space-x-4 text-xs text-text-muted">
                <span>Level {currentLevel.id}/8</span>
                <span>•</span>
                <span>{player.stageName} • Age {player.age}</span>
              </div>
            </div>
            <ShareButton onShare={handleShareStats} size="small" />
          </div>

          {/* Level Progress */}
          {nextLevelReq && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-text-secondary">Progress to {nextLevelReq.level.title}</span>
                <span className="text-sm text-neon-cyan font-medium">{levelProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-dark-surface/50 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full shadow-glow"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>Fame: {player.fame}/{nextLevelReq.fameRequired}</span>
                <span>Rep: {player.reputation}/{nextLevelReq.reputationRequired}</span>
              </div>
            </div>
          )}

          {/* Level Benefits */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-dark-surface/30 p-2 rounded-game">
              <div className="font-bold text-neon-green">+{((levelMultipliers.earnings - 1) * 100).toFixed(0)}%</div>
              <div className="text-text-muted">Earnings</div>
            </div>
            <div className="bg-dark-surface/30 p-2 rounded-game">
              <div className="font-bold text-neon-cyan">+{((levelMultipliers.fanGrowth - 1) * 100).toFixed(0)}%</div>
              <div className="text-text-muted">Fan Growth</div>
            </div>
            <div className="bg-dark-surface/30 p-2 rounded-game">
              <div className="font-bold text-neon-purple">+{((levelMultipliers.opportunities - 1) * 100).toFixed(0)}%</div>
              <div className="text-text-muted">Opportunities</div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Main Stats with Trends */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">Core Statistics</h2>
          <div className="grid grid-cols-2 gap-3">
            {mainStats.map((stat, index) => {
              const trendInfo = getTrendIcon(stat.trend);
              return (
                <motion.div
                  key={stat.label}
                  className="game-card p-3 shadow-dark"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={stat.icon} className={`text-lg ${stat.color}`} />
                      <span className="text-xs font-medium text-text-muted">{stat.label}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={trendInfo.icon} className={`text-xs ${trendInfo.color}`} />
                    </div>
                  </div>
                  
                  <div className={`text-lg font-bold ${stat.color} mb-1 animate-neon`}>
                    {stat.formatted || stat.value}
                  </div>

                  {/* Progress bar for Fame and Reputation */}
                  {stat.max && (
                    <div className="mb-2">
                      <div className="w-full bg-dark-surface/50 rounded-full h-1.5">
                        <motion.div
                          className={`h-1.5 ${stat.bgColor} rounded-full shadow-glow`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                      {stat.nextMilestone && (
                        <div className="text-xs text-text-muted mt-1">
                          Next: {stat.nextMilestone}
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-text-muted">{stat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Performance Analytics */}
        <div className="game-card p-4 shadow-dark">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-text-primary flex items-center space-x-2">
              <SafeIcon icon={FiBarChart} className="text-neon-cyan" />
              <span>Performance Analytics</span>
            </h2>
            <div className="flex space-x-2">
              {['week', 'month', 'all'].map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-2 py-1 rounded-game text-xs font-medium transition-all ${
                    selectedTimeframe === timeframe
                      ? 'bg-neon-cyan text-white'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-3 bg-dark-surface/30 rounded-game">
              <div className="text-lg font-bold text-neon-cyan animate-neon">
                {formatNumber(totalViews)}
              </div>
              <div className="text-xs text-text-muted">Total Views</div>
              <div className="text-xs text-neon-green">
                +{formatNumber(thisWeekViews)} this week
              </div>
            </div>
            <div className="text-center p-3 bg-dark-surface/30 rounded-game">
              <div className="text-lg font-bold text-neon-green animate-neon">
                {formatNumber(totalStreams)}
              </div>
              <div className="text-xs text-text-muted">Total Streams</div>
              <div className="text-xs text-neon-orange">
                Peak: {formatNumber(peakWeeklyViews)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-neon-red/10 border border-neon-red/30 rounded-game">
              <div className="text-base font-bold text-neon-red animate-neon">{viralHits}</div>
              <div className="text-xs text-text-muted">Viral Hits</div>
            </div>
            <div className="text-center p-2 bg-neon-yellow/10 border border-neon-yellow/30 rounded-game">
              <div className="text-base font-bold text-neon-yellow animate-neon">{chartHits}</div>
              <div className="text-xs text-text-muted">Chart Hits</div>
            </div>
            <div className="text-center p-2 bg-neon-green/10 border border-neon-green/30 rounded-game">
              <div className="text-base font-bold text-neon-green animate-neon">{trendingReleases}</div>
              <div className="text-xs text-text-muted">Trending</div>
            </div>
          </div>
        </div>

        {/* Enhanced Skills Overview with Level Bonuses */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">Skills & Level Bonuses</h2>
          <div className="space-y-3">
            {skillsOverview.map((skill, index) => (
              <motion.div
                key={skill.name}
                className="game-card p-3 shadow-dark"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-text-primary text-sm">{skill.name}</span>
                    <span className="text-xs text-text-muted">({skill.impact})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-text-muted">{skill.value}/100</span>
                    <div className="text-xs text-neon-green">+{skill.levelBonus} level bonus</div>
                  </div>
                </div>
                <div className="w-full bg-dark-surface/50 rounded-full h-2 mb-1">
                  <motion.div
                    className={`${skill.color} h-2 rounded-full shadow-glow`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.value}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
                <div className="text-xs text-text-muted">
                  Effective Level: {Math.min(100, skill.value + skill.levelBonus)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Career Milestones & Achievements */}
        <div className="game-card p-4 shadow-dark">
          <h2 className="text-base font-bold text-text-primary mb-3 flex items-center space-x-2">
            <SafeIcon icon={FiAward} className="text-neon-yellow" />
            <span>Career Milestones</span>
          </h2>
          
          <div className="space-y-2">
            {CAREER_LEVELS.slice(0, currentLevel.id).map((level, index) => (
              <div key={level.id} className="flex items-center space-x-3 p-2 bg-neon-green/10 border border-neon-green/30 rounded-game">
                <div className="text-lg">{level.emoji}</div>
                <div className="flex-1">
                  <div className="font-semibold text-text-primary text-sm">{level.title}</div>
                  <div className="text-xs text-neon-green">✓ Achieved</div>
                </div>
                <div className="text-xs text-text-muted">
                  Level {level.id}
                </div>
              </div>
            ))}
            
            {nextLevelReq && (
              <div className="flex items-center space-x-3 p-2 bg-dark-surface/30 rounded-game border-2 border-dashed border-neon-cyan/30">
                <div className="text-lg">{nextLevelReq.level.emoji}</div>
                <div className="flex-1">
                  <div className="font-semibold text-text-primary text-sm">{nextLevelReq.level.title}</div>
                  <div className="text-xs text-neon-cyan">Next Goal - {levelProgress.toFixed(1)}% complete</div>
                </div>
                <div className="text-xs text-text-muted">
                  Level {nextLevelReq.level.id}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Level Unlocks */}
        <div className="bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 border border-neon-purple/30 p-4 rounded-game-lg shadow-glow">
          <h3 className="font-bold text-text-primary mb-3 text-sm flex items-center space-x-2">
            <SafeIcon icon={FiTarget} className="text-neon-purple" />
            <span>Current Level Unlocks</span>
          </h3>
          <div className="space-y-2">
            {currentLevel.unlocks.map((unlock, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <SafeIcon icon={FiStar} className="text-neon-yellow text-xs" />
                <span className="text-text-secondary">{unlock}</span>
              </div>
            ))}
          </div>
          
          {nextLevelReq && (
            <div className="mt-4 pt-3 border-t border-neon-purple/30">
              <h4 className="font-medium text-text-primary mb-2 text-sm">Next Level Unlocks:</h4>
              <div className="space-y-1">
                {nextLevelReq.level.unlocks.map((unlock, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-text-muted">
                    <SafeIcon icon={FiTarget} className="text-xs" />
                    <span>{unlock}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Share Modal */}
        <ShareModal
          isOpen={shareModal.isOpen}
          onClose={() => setShareModal({ isOpen: false, data: null })}
          shareData={shareModal.data}
        />
      </div>
    </div>
  );
}