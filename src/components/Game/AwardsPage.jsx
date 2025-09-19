import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import ShareModal from './ShareModal';
import ShareButton from './ShareButton';
import * as FiIcons from 'react-icons/fi';

const { FiAward, FiStar, FiTrendingUp, FiMusic, FiUsers, FiDollarSign, FiCrown, FiTarget } = FiIcons;

export default function AwardsPage() {
  const { state } = useGame();
  const { player, releases, earnings } = state;
  const [selectedCategory, setSelectedCategory] = useState('achievements');
  const [shareModal, setShareModal] = useState({ isOpen: false, data: null });

  // Calculate achievements
  const achievements = [
    {
      id: 'first_track',
      title: 'First Steps',
      description: 'Create your first track',
      icon: FiMusic,
      achieved: state.tracks.length > 0,
      reward: 'Unlocked studio recording',
      rarity: 'Common',
      color: 'bg-text-muted'
    },
    {
      id: 'viral_hit',
      title: 'Viral Sensation',
      description: 'Get a track with 1M+ views',
      icon: FiTrendingUp,
      achieved: releases.some(r => r.views >= 1000000),
      reward: '+50 Fame bonus',
      rarity: 'Rare',
      color: 'bg-neon-cyan'
    },
    {
      id: 'chart_topper',
      title: 'Chart Domination',
      description: 'Reach #1 on the charts',
      icon: FiCrown,
      achieved: releases.some(r => r.chartPosition === 1),
      reward: 'Industry Legend status',
      rarity: 'Legendary',
      color: 'bg-neon-yellow'
    },
    {
      id: 'millionaire',
      title: 'Millionaire Status',
      description: 'Accumulate $1,000,000 net worth',
      icon: FiDollarSign,
      achieved: player.netWorth >= 1000000,
      reward: 'Luxury lifestyle unlocked',
      rarity: 'Epic',
      color: 'bg-neon-purple'
    },
    {
      id: 'fan_army',
      title: 'Fan Army',
      description: 'Gain 100,000 fans',
      icon: FiUsers,
      achieved: player.fans >= 100000,
      reward: 'Massive social media boost',
      rarity: 'Epic',
      color: 'bg-neon-green'
    },
    {
      id: 'skill_master',
      title: 'Skill Master',
      description: 'Max out any skill to 100',
      icon: FiTarget,
      achieved: Object.values(player.skills).some(skill => skill >= 100),
      reward: 'Elite performance bonus',
      rarity: 'Legendary',
      color: 'bg-neon-orange'
    }
  ];

  // Calculate awards/records
  const awards = [
    {
      title: 'Most Viewed Release',
      value: Math.max(...releases.map(r => r.views), 0).toLocaleString(),
      release: releases.find(r => r.views === Math.max(...releases.map(rel => rel.views), 0))?.title || 'None',
      icon: FiTrendingUp,
      color: 'text-neon-cyan'
    },
    {
      title: 'Highest Chart Position',
      value: releases.filter(r => r.chartPosition).length > 0 
        ? `#${Math.min(...releases.filter(r => r.chartPosition).map(r => r.chartPosition))}` 
        : 'No chart entries',
      release: releases.find(r => r.chartPosition === Math.min(...releases.filter(rel => rel.chartPosition).map(rel => rel.chartPosition)))?.title || 'None',
      icon: FiCrown,
      color: 'text-neon-yellow'
    },
    {
      title: 'Total Career Earnings',
      value: `$${earnings.total.toLocaleString()}`,
      release: 'All releases combined',
      icon: FiDollarSign,
      color: 'text-neon-green'
    },
    {
      title: 'Peak Weekly Views',
      value: Math.max(...releases.map(r => r.peakWeeklyViews || 0), 0).toLocaleString(),
      release: releases.find(r => r.peakWeeklyViews === Math.max(...releases.map(rel => rel.peakWeeklyViews || 0), 0))?.title || 'None',
      icon: FiStar,
      color: 'text-neon-orange'
    }
  ];

  const categories = [
    { id: 'achievements', name: 'Achievements', icon: FiAward },
    { id: 'records', name: 'Records', icon: FiCrown }
  ];

  const handleShareAchievement = (achievement) => {
    setShareModal({
      isOpen: true,
      data: {
        type: 'achievement',
        achievement: achievement.title,
        stats: {
          fame: player.fame,
          fans: player.fans,
          netWorth: player.netWorth
        }
      }
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const achievedCount = achievements.filter(a => a.achieved).length;
  const totalAchievements = achievements.length;
  const completionPercentage = (achievedCount / totalAchievements) * 100;

  return (
    <div className="min-h-screen bg-dark-bg pb-24 pt-16">
      <div className="px-4 space-y-4 max-w-mobile mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-text-primary mb-2">Awards & Achievements</h1>
          <p className="text-text-muted text-sm">Track your career milestones</p>
        </div>

        {/* Progress Overview */}
        <motion.div
          className="bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 p-4 rounded-game-lg text-text-primary shadow-glow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="text-3xl mb-2">🏆</div>
              <h2 className="text-lg font-bold mb-1 neon-text">Career Progress</h2>
              <p className="text-text-secondary text-sm mb-2">{achievedCount}/{totalAchievements} Achievements Unlocked</p>
            </div>
            {achievedCount > 0 && (
              <ShareButton
                onShare={() => setShareModal({
                  isOpen: true,
                  data: {
                    type: 'milestone',
                    achievement: `${achievedCount}/${totalAchievements} Achievements Unlocked`,
                    stats: { fame: player.fame, fans: player.fans, netWorth: player.netWorth }
                  }
                })}
                size="small"
              />
            )}
          </div>
          
          <div className="w-full bg-dark-surface/50 rounded-full h-3 mb-2">
            <motion.div
              className="h-3 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full shadow-glow"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="text-center text-text-primary text-sm font-medium">
            {completionPercentage.toFixed(1)}% Complete
          </div>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex bg-dark-surface/60 backdrop-blur-sm rounded-game-lg p-1 shadow-dark">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-game transition-all ${
                selectedCategory === category.id
                  ? 'bg-neon-cyan text-white shadow-glow'
                  : 'text-text-muted hover:text-text-primary hover:bg-dark-surface/30'
              }`}
            >
              <SafeIcon icon={category.icon} className="text-lg" />
              <span className="font-medium text-sm">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Achievements Tab */}
        {selectedCategory === 'achievements' && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className={`game-card p-4 shadow-dark ${
                  achievement.achieved ? 'border border-neon-green/30 shadow-glow' : ''
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4 mb-3">
                  <div className={`w-14 h-14 ${
                    achievement.achieved ? achievement.color : 'bg-dark-surface/50'
                  } rounded-game flex items-center justify-center text-white text-xl relative shadow-glow`}>
                    <SafeIcon icon={achievement.icon} />
                    {achievement.achieved && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-neon-green rounded-full flex items-center justify-center">
                        <SafeIcon icon={FiStar} className="text-white text-xs" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-bold text-sm ${
                        achievement.achieved ? 'text-text-primary' : 'text-text-muted'
                      }`}>
                        {achievement.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        achievement.rarity === 'Common' ? 'bg-text-muted/20 text-text-muted' :
                        achievement.rarity === 'Rare' ? 'bg-neon-cyan/20 text-neon-cyan' :
                        achievement.rarity === 'Epic' ? 'bg-neon-purple/20 text-neon-purple' :
                        'bg-neon-yellow/20 text-neon-yellow'
                      }`}>
                        {achievement.rarity}
                      </span>
                    </div>
                    <p className={`text-xs ${
                      achievement.achieved ? 'text-text-secondary' : 'text-text-muted'
                    } mb-2`}>
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${
                        achievement.achieved ? 'text-neon-green' : 'text-text-muted'
                      }`}>
                        Reward: {achievement.reward}
                      </span>
                      {achievement.achieved ? (
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-neon-green">
                            <SafeIcon icon={FiStar} className="text-xs" />
                            <span className="text-xs font-medium">Unlocked</span>
                          </div>
                          <ShareButton
                            onShare={() => handleShareAchievement(achievement)}
                            size="small"
                            className="text-xs py-1 px-2"
                          />
                        </div>
                      ) : (
                        <div className="text-text-muted text-xs">Locked</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {achievement.achieved && (
                  <div className="bg-neon-green/10 px-3 py-2 border-t border-neon-green/20 rounded-b-game">
                    <div className="text-neon-green text-xs font-medium">
                      🎉 Achievement Unlocked! Bonus rewards activated.
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Records Tab */}
        {selectedCategory === 'records' && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {awards.map((award, index) => (
              <motion.div
                key={award.title}
                className="game-card p-4 shadow-dark"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-game flex items-center justify-center text-white shadow-glow">
                    <SafeIcon icon={award.icon} className="text-lg" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-text-primary mb-1 text-sm">{award.title}</h3>
                    <div className={`text-lg font-bold ${award.color} mb-1 animate-neon`}>
                      {award.value}
                    </div>
                    <p className="text-xs text-text-muted">
                      {award.release !== 'None' && award.release !== 'All releases combined' && (
                        <>From: "{award.release}"</>
                      )}
                      {award.release === 'All releases combined' && award.release}
                      {award.release === 'None' && 'No records set yet'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Career Stats Summary */}
        <div className="game-card p-4 shadow-dark">
          <h3 className="font-bold text-text-primary mb-3 text-sm">Career Statistics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-dark-surface/30 rounded-game">
              <div className="text-lg font-bold text-neon-cyan animate-neon">{state.tracks.length}</div>
              <div className="text-xs text-text-muted">Tracks Created</div>
            </div>
            <div className="text-center p-3 bg-dark-surface/30 rounded-game">
              <div className="text-lg font-bold text-neon-purple animate-neon">{releases.length}</div>
              <div className="text-xs text-text-muted">Releases</div>
            </div>
            <div className="text-center p-3 bg-dark-surface/30 rounded-game">
              <div className="text-lg font-bold text-neon-green animate-neon">
                {releases.filter(r => r.isViral).length}
              </div>
              <div className="text-xs text-text-muted">Viral Hits</div>
            </div>
            <div className="text-center p-3 bg-dark-surface/30 rounded-game">
              <div className="text-lg font-bold text-neon-yellow animate-neon">
                {releases.filter(r => r.chartPosition && r.chartPosition <= 10).length}
              </div>
              <div className="text-xs text-text-muted">Top 10 Hits</div>
            </div>
          </div>
        </div>

        {/* Next Achievements */}
        <div className="bg-gradient-to-r from-neon-orange/20 to-neon-red/20 border border-neon-orange/30 p-4 rounded-game-lg text-text-primary shadow-glow">
          <h3 className="font-bold text-sm mb-2">🎯 Next Goals</h3>
          <div className="text-xs text-text-secondary space-y-1">
            {!achievements.find(a => a.id === 'viral_hit')?.achieved && (
              <p>• Get 1M views on a single release</p>
            )}
            {!achievements.find(a => a.id === 'chart_topper')?.achieved && (
              <p>• Reach #1 on the music charts</p>
            )}
            {!achievements.find(a => a.id === 'millionaire')?.achieved && (
              <p>• Become a millionaire ($1M net worth)</p>
            )}
            {!achievements.find(a => a.id === 'fan_army')?.achieved && (
              <p>• Build an army of 100K fans</p>
            )}
          </div>
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