import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import ShareModal from './ShareModal';
import ShareButton from './ShareButton';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiUsers, FiTrendingUp, FiDollarSign, FiZap, FiCalendar, FiBriefcase, FiMusic, FiGlobe, FiEye, FiPlay, FiActivity, FiBarChart } = FiIcons;

export default function HomePage() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { player, tracks, albums, musicVideos, releases, earnings } = state;
  const [shareModal, setShareModal] = useState({ isOpen: false, data: null });

  const formatNumber = (num) => {
    if (num >= 1000000000000) {
      return `${(num / 1000000000000).toFixed(1)}T`;
    } else if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatMoney = (amount) => {
    const wholeAmount = Math.floor(amount);
    if (wholeAmount >= 1000000) {
      return `$${(wholeAmount / 1000000).toFixed(1)}M`;
    } else if (wholeAmount >= 1000) {
      return `$${(wholeAmount / 1000).toFixed(1)}K`;
    }
    return `$${wholeAmount}`;
  };

  const handleShareCareer = () => {
    setShareModal({
      isOpen: true,
      data: {
        type: 'career',
        stats: {
          fame: player.fame,
          fans: player.fans,
          netWorth: player.netWorth
        }
      }
    });
  };

  const handleShareMilestone = (milestone) => {
    setShareModal({
      isOpen: true,
      data: {
        type: 'milestone',
        achievement: milestone,
        stats: {
          fame: player.fame,
          fans: player.fans,
          netWorth: player.netWorth
        }
      }
    });
  };

  const stats = [
    { icon: FiStar, label: 'Fame', value: player.fame, color: 'text-neon-yellow', bgColor: 'bg-gradient-to-br from-neon-yellow/20 to-warning/20', borderColor: 'border-neon-yellow/30' },
    { icon: FiTrendingUp, label: 'Reputation', value: player.reputation, color: 'text-neon-cyan', bgColor: 'bg-gradient-to-br from-neon-cyan/20 to-info/20', borderColor: 'border-neon-cyan/30' },
    { icon: FiUsers, label: 'Fans', value: formatNumber(player.fans), color: 'text-neon-green', bgColor: 'bg-gradient-to-br from-neon-green/20 to-success/20', borderColor: 'border-neon-green/30' },
    { icon: FiDollarSign, label: 'Net Worth', value: formatMoney(player.netWorth), color: 'text-neon-green', bgColor: 'bg-gradient-to-br from-neon-green/20 to-success/20', borderColor: 'border-neon-green/30' }
  ];

  const quickActions = [
    { title: 'Find Work', description: 'Earn money and gain experience', icon: FiBriefcase, color: 'bg-gradient-to-r from-neon-cyan to-info', action: () => navigate('/game/job') },
    { title: 'Create Music', description: 'Record your next hit track', icon: FiMusic, color: 'bg-gradient-to-r from-neon-purple to-neon-pink', action: () => navigate('/game/studio') },
    { title: 'Social Media', description: 'Connect with your fans', icon: FiGlobe, color: 'bg-gradient-to-r from-neon-pink to-neon-red', action: () => navigate('/game/social') }
  ];

  const topReleases = releases
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  const totalViews = releases.reduce((sum, release) => sum + release.views, 0);
  const thisWeekViews = releases.reduce((sum, release) => sum + (release.weeklyViews || 0), 0);
  const viralHits = releases.filter(r => r.isViral).length;
  const trendingReleases = releases.filter(r => r.trending).length;
  const chartHits = releases.filter(r => r.chartPosition && r.chartPosition <= 10).length;

  const yearsLeft = 60 - player.age;

  // Check for milestones that could be shared
  const checkMilestones = () => {
    const milestones = [];
    if (player.fans >= 1000000 && player.fans < 1001000) milestones.push('1 Million Fans!');
    if (player.fame >= 1000 && player.fame < 1010) milestones.push('Rap Legend Status!');
    if (player.netWorth >= 1000000 && player.netWorth < 1010000) milestones.push('Millionaire Status!');
    if (viralHits >= 5 && viralHits < 6) milestones.push('5 Viral Hits!');
    if (chartHits >= 10 && chartHits < 11) milestones.push('10 Chart Hits!');
    return milestones;
  };

  const recentMilestones = checkMilestones();

  return (
    <div className="min-h-screen bg-dark-bg pb-24 pt-16">
      <div className="px-4 space-y-4 max-w-mobile mx-auto">
        {/* Welcome Section */}
        <motion.div
          className="game-card glow-border p-4 text-text-primary shadow-glow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold mb-2 neon-text">Welcome back, {player.stageName}!</h1>
              <p className="text-text-secondary mb-3 text-sm">
                Age {player.age} • Week {player.week} of {player.year}
              </p>
            </div>
            <ShareButton onShare={handleShareCareer} size="small" />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiZap} className="text-neon-orange" />
              <span className="font-medium text-text-primary">{player.energy}/100 Energy</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCalendar} className="text-neon-cyan" />
              <span className="font-medium text-text-primary">{yearsLeft} years left</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Milestones */}
        {recentMilestones.length > 0 && (
          <motion.div
            className="game-card bg-gradient-to-r from-neon-orange/20 to-warning/20 border-neon-orange/30 p-4 text-text-primary shadow-glow"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="font-bold text-base mb-2">🎉 Recent Milestones</h3>
            <div className="space-y-2">
              {recentMilestones.map((milestone, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-text-primary">{milestone}</span>
                  <button
                    onClick={() => handleShareMilestone(milestone)}
                    className="text-xs bg-neon-orange/20 hover:bg-neon-orange/30 text-neon-orange px-2 py-1 rounded-game transition-colors"
                  >
                    Share
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`stat-card ${stat.borderColor} p-3 shadow-dark`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 bg-dark-surface/30 rounded-game">
                  <SafeIcon icon={stat.icon} className={`text-sm ${stat.color}`} />
                </div>
                <span className="text-xs font-medium text-text-secondary">{stat.label}</span>
              </div>
              <div className={`text-lg font-bold ${stat.color} animate-neon`}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Performance Dashboard */}
        <div className="game-card p-4 shadow-dark">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-text-primary flex items-center space-x-2">
              <SafeIcon icon={FiBarChart} className="text-neon-cyan" />
              <span>Performance Dashboard</span>
            </h2>
            {totalViews > 100000 && (
              <ShareButton
                onShare={() => setShareModal({
                  isOpen: true,
                  data: {
                    type: 'milestone',
                    achievement: `${formatNumber(totalViews)} Total Views`,
                    stats: { fame: player.fame, fans: player.fans, netWorth: player.netWorth }
                  }
                })}
                size="small"
                className="text-xs py-1 px-2"
              />
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="text-center p-2 bg-dark-surface/30 rounded-game">
              <div className="text-lg font-bold text-neon-cyan animate-neon">{formatNumber(totalViews)}</div>
              <div className="text-xs text-text-muted">Total Views</div>
            </div>
            <div className="text-center p-2 bg-dark-surface/30 rounded-game">
              <div className="text-lg font-bold text-neon-green animate-neon">{formatNumber(thisWeekViews)}</div>
              <div className="text-xs text-text-muted">This Week</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-neon-red/10 border border-neon-red/30 rounded-game">
              <div className="text-base font-bold text-neon-red animate-neon">{viralHits}</div>
              <div className="text-xs text-text-muted">Viral</div>
            </div>
            <div className="p-2 bg-neon-orange/10 border border-neon-orange/30 rounded-game">
              <div className="text-base font-bold text-neon-orange animate-neon">{trendingReleases}</div>
              <div className="text-xs text-text-muted">Trending</div>
            </div>
            <div className="p-2 bg-neon-purple/10 border border-neon-purple/30 rounded-game">
              <div className="text-base font-bold text-neon-purple animate-neon">{chartHits}</div>
              <div className="text-xs text-text-muted">Chart Hits</div>
            </div>
          </div>
        </div>

        {/* Social Media Growth */}
        <div className="game-card p-4 shadow-dark">
          <h2 className="text-base font-bold text-text-primary mb-3">Social Media Growth</h2>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-neon-pink animate-neon">{formatNumber(player.socialMedia.rapgram.followers)}</div>
              <div className="text-xs text-text-muted">RapGram</div>
            </div>
            <div>
              <div className="text-lg font-bold text-neon-red animate-neon">{formatNumber(player.socialMedia.raptube.subscribers)}</div>
              <div className="text-xs text-text-muted">RapTube</div>
            </div>
            <div>
              <div className="text-lg font-bold text-neon-green animate-neon">{formatNumber(player.socialMedia.rapify.listeners)}</div>
              <div className="text-xs text-text-muted">Rapify</div>
            </div>
            <div>
              <div className="text-lg font-bold text-neon-purple animate-neon">{formatNumber(player.socialMedia.riktok.followers)}</div>
              <div className="text-xs text-text-muted">RikTok</div>
            </div>
          </div>
          <div className="mt-3 p-2 bg-dark-surface/30 rounded-game text-center">
            <div className="text-sm text-text-secondary">
              Auto-growth based on <span className="font-medium text-neon-cyan">{formatNumber(player.fans)} fans</span>
            </div>
          </div>
        </div>

        {/* Weekly Earnings */}
        {earnings.thisWeek > 0 && (
          <motion.div
            className="game-card bg-gradient-to-r from-neon-green/20 to-success/20 border-neon-green/30 p-4 text-text-primary shadow-glow"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Weekly Earnings</h3>
                <p className="text-text-secondary text-sm">From your releases</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-neon-green animate-neon">${Math.floor(earnings.thisWeek)}</div>
                <div className="text-xs text-text-muted">This week</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                onClick={action.action}
                className="w-full game-card p-3 hover:bg-dark-surface/80 transition-all active:scale-98 hover-glow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${action.color} rounded-game shadow-glow`}>
                    <SafeIcon icon={action.icon} className="text-lg text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-text-primary text-sm">{action.title}</div>
                    <div className="text-xs text-text-muted">{action.description}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Career Summary */}
        <div className="game-card p-4 shadow-dark">
          <h2 className="text-base font-bold text-text-primary mb-3">Career Summary</h2>
          <div className="grid grid-cols-3 gap-3 text-center mb-3">
            <div>
              <div className="text-xl font-bold text-neon-cyan animate-neon">{tracks.length}</div>
              <div className="text-xs text-text-muted">Tracks</div>
            </div>
            <div>
              <div className="text-xl font-bold text-neon-purple animate-neon">{albums.length}</div>
              <div className="text-xs text-text-muted">Albums</div>
            </div>
            <div>
              <div className="text-xl font-bold text-neon-pink animate-neon">{musicVideos.length}</div>
              <div className="text-xs text-text-muted">Videos</div>
            </div>
          </div>
          {releases.length > 0 && (
            <div className="grid grid-cols-2 gap-3 text-center pt-3 border-t border-dark-border/30">
              <div>
                <div className="text-lg font-bold text-neon-green animate-neon">{formatNumber(totalViews)}</div>
                <div className="text-xs text-text-muted">Total Views</div>
              </div>
              <div>
                <div className="text-lg font-bold text-neon-orange animate-neon">${Math.floor(earnings.total)}</div>
                <div className="text-xs text-text-muted">Total Earnings</div>
              </div>
            </div>
          )}
        </div>

        {/* Top Releases */}
        {topReleases.length > 0 && (
          <div className="game-card p-4 shadow-dark">
            <h2 className="text-base font-bold text-text-primary mb-3">Top Performing Releases</h2>
            <div className="space-y-2">
              {topReleases.map((release, index) => (
                <motion.div
                  key={release.id}
                  className="flex items-center justify-between p-2 bg-dark-surface/30 rounded-game"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                      index === 0 ? 'bg-gradient-to-r from-neon-yellow to-warning shadow-glow' :
                      index === 1 ? 'bg-gradient-to-r from-text-muted to-text-disabled' :
                      'bg-gradient-to-r from-neon-orange to-warning'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary text-sm flex items-center space-x-1">
                        <span className="truncate max-w-24">{release.title}</span>
                        {release.isViral && <span className="text-xs">🔥</span>}
                        {release.trending && <span className="text-xs">📈</span>}
                        {release.chartPosition && release.chartPosition <= 10 && (
                          <span className="text-xs bg-neon-yellow/20 text-neon-yellow px-1 rounded">#{release.chartPosition}</span>
                        )}
                      </div>
                      <div className="text-xs text-text-muted">
                        {release.type === 'video' ? 'RapTube Video' : 'Rapify ' + release.type}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-neon-cyan">
                      <SafeIcon icon={FiEye} className="text-xs" />
                      <span className="font-bold text-xs animate-neon">{formatNumber(release.views)}</span>
                    </div>
                    <div className="text-xs text-neon-green">${Math.floor(release.earnings)}</div>
                    {release.weeklyViews && (
                      <div className="text-xs text-neon-purple">+{formatNumber(release.weeklyViews)} this week</div>
                    )}
                    {release.isViral && (
                      <button
                        onClick={() => setShareModal({
                          isOpen: true,
                          data: {
                            type: 'release',
                            title: release.title,
                            stats: { fame: player.fame, fans: player.fans, netWorth: player.netWorth }
                          }
                        })}
                        className="text-xs bg-neon-red/20 text-neon-red px-1 py-0.5 rounded mt-1 hover:bg-neon-red/30 transition-colors"
                      >
                        Share Viral Hit
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Next Week Button */}
        <motion.button
          onClick={() => dispatch({ type: 'ADVANCE_WEEK' })}
          className="w-full game-button hover-glow animate-glow"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <SafeIcon icon={FiPlay} />
            <span className="text-sm">Advance to Next Week (Refill Energy)</span>
          </div>
        </motion.button>

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