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
    {
      icon: FiStar,
      label: 'Fame',
      value: player.fame,
      color: 'text-yellow-400',
      bgColor: 'bg-gradient-to-br from-yellow-400/20 to-orange-400/20',
      borderColor: 'border-yellow-400/30'
    },
    {
      icon: FiTrendingUp,
      label: 'Reputation',
      value: player.reputation,
      color: 'text-cyan-400',
      bgColor: 'bg-gradient-to-br from-cyan-400/20 to-blue-400/20',
      borderColor: 'border-cyan-400/30'
    },
    {
      icon: FiUsers,
      label: 'Fans',
      value: formatNumber(player.fans),
      color: 'text-green-400',
      bgColor: 'bg-gradient-to-br from-green-400/20 to-emerald-400/20',
      borderColor: 'border-green-400/30'
    },
    {
      icon: FiDollarSign,
      label: 'Net Worth',
      value: formatMoney(player.netWorth),
      color: 'text-green-400',
      bgColor: 'bg-gradient-to-br from-green-400/20 to-emerald-400/20',
      borderColor: 'border-green-400/30'
    }
  ];

  const quickActions = [
    {
      title: 'Find Work',
      description: 'Earn money and gain experience',
      icon: FiBriefcase,
      color: 'bg-gradient-to-br from-cyan-400 to-blue-500',
      action: () => navigate('/game/job')
    },
    {
      title: 'Create Music',
      description: 'Record your next hit track',
      icon: FiMusic,
      color: 'bg-gradient-to-br from-purple-400 to-pink-500',
      action: () => navigate('/game/studio')
    },
    {
      title: 'Social Media',
      description: 'Connect with your fans',
      icon: FiGlobe,
      color: 'bg-gradient-to-br from-pink-400 to-red-500',
      action: () => navigate('/game/social')
    }
  ];

  const topReleases = releases
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  const totalViews = releases.reduce((sum, release) => sum + release.views, 0);
  const thisWeekViews = releases.reduce((sum, release) => sum + (release.weeklyViews || 0), 0);
  const viralHits = releases.filter(r => r.isViral).length;
  const trendingReleases = releases.filter(r => r.trending).length;
  const chartHits = releases.filter(r => r.chartPosition && r.chartPosition <= 10).length;

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pb-24 pt-16">
      <div className="px-4 space-y-4 max-w-mobile mx-auto">
        {/* Welcome Section */}
        <motion.div
          className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Welcome back, {player.stageName}!
              </h1>
              <p className="text-gray-300 mb-3 text-sm">
                Age {player.age} • Week {player.week} of {player.year}
              </p>
            </div>
            <ShareButton onShare={handleShareCareer} size="small" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiZap} className="text-orange-400" />
              <span className="font-medium text-white">{player.energy}/100 Energy</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCalendar} className="text-cyan-400" />
              <span className="font-medium text-white">Week {player.week}</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Milestones */}
        {recentMilestones.length > 0 && (
          <motion.div
            className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 p-4 rounded-3xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="font-bold text-base mb-2 text-white">🎉 Recent Milestones</h3>
            <div className="space-y-2">
              {recentMilestones.map((milestone, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-white">{milestone}</span>
                  <button
                    onClick={() => handleShareMilestone(milestone)}
                    className="text-xs bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-2 py-1 rounded-xl transition-colors"
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
              className={`${stat.bgColor} border ${stat.borderColor} p-3 rounded-2xl shadow-xl backdrop-blur-md`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 bg-black/20 rounded-xl">
                  <SafeIcon icon={stat.icon} className={`text-sm ${stat.color}`} />
                </div>
                <span className="text-xs font-medium text-gray-200">{stat.label}</span>
              </div>
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Performance Dashboard */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <SafeIcon icon={FiBarChart} className="text-cyan-400" />
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
            <div className="text-center p-2 bg-black/20 rounded-2xl">
              <div className="text-lg font-bold text-cyan-400">{formatNumber(totalViews)}</div>
              <div className="text-xs text-gray-300">Total Views</div>
            </div>
            <div className="text-center p-2 bg-black/20 rounded-2xl">
              <div className="text-lg font-bold text-green-400">{formatNumber(thisWeekViews)}</div>
              <div className="text-xs text-gray-300">This Week</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-red-500/10 border border-red-400/30 rounded-2xl">
              <div className="text-base font-bold text-red-400">{viralHits}</div>
              <div className="text-xs text-gray-300">Viral</div>
            </div>
            <div className="p-2 bg-orange-500/10 border border-orange-400/30 rounded-2xl">
              <div className="text-base font-bold text-orange-400">{trendingReleases}</div>
              <div className="text-xs text-gray-300">Trending</div>
            </div>
            <div className="p-2 bg-purple-500/10 border border-purple-400/30 rounded-2xl">
              <div className="text-base font-bold text-purple-400">{chartHits}</div>
              <div className="text-xs text-gray-300">Chart Hits</div>
            </div>
          </div>
        </div>

        {/* Social Media Growth */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-2xl">
          <h2 className="text-base font-bold text-white mb-3">Social Media Following</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-pink-400">{formatNumber(player.socialMedia.rapgram.followers)}</div>
              <div className="text-xs text-gray-300">RapGram</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">{formatNumber(player.socialMedia.raptube.subscribers)}</div>
              <div className="text-xs text-gray-300">RapTube</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{formatNumber(player.socialMedia.rapify.listeners)}</div>
              <div className="text-xs text-gray-300">Rapify</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">{formatNumber(player.socialMedia.riktok.followers)}</div>
              <div className="text-xs text-gray-300">RikTok</div>
            </div>
          </div>
          <div className="mt-3 p-2 bg-black/20 rounded-2xl text-center">
            <div className="text-sm text-gray-200">
              Auto-growth based on <span className="font-medium text-cyan-400">{formatNumber(player.fans)} fans</span>
            </div>
          </div>
        </div>

        {/* Weekly Earnings */}
        {earnings.thisWeek > 0 && (
          <motion.div
            className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 p-4 rounded-3xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Weekly Earnings</h3>
                <p className="text-gray-200 text-sm">From your releases</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-400">${Math.floor(earnings.thisWeek)}</div>
                <div className="text-xs text-gray-300">This week</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions - Icon Only */}
        <div>
          <h2 className="text-base font-bold text-white mb-3">Quick Actions</h2>
          <div className="flex justify-center space-x-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                onClick={action.action}
                className="p-4 rounded-2xl shadow-xl transition-all active:scale-95 hover:scale-105"
                style={{ background: action.color }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={action.icon} className="text-2xl text-white" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Career Summary */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-2xl">
          <h2 className="text-base font-bold text-white mb-3">Career Summary</h2>
          <div className="grid grid-cols-3 gap-3 text-center mb-3">
            <div>
              <div className="text-xl font-bold text-cyan-400">{tracks.length}</div>
              <div className="text-xs text-gray-300">Tracks</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-400">{albums.length}</div>
              <div className="text-xs text-gray-300">Albums</div>
            </div>
            <div>
              <div className="text-xl font-bold text-pink-400">{musicVideos.length}</div>
              <div className="text-xs text-gray-300">Videos</div>
            </div>
          </div>
          {releases.length > 0 && (
            <div className="grid grid-cols-2 gap-3 text-center pt-3 border-t border-white/10">
              <div>
                <div className="text-lg font-bold text-green-400">{formatNumber(totalViews)}</div>
                <div className="text-xs text-gray-300">Total Views</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-400">${Math.floor(earnings.total)}</div>
                <div className="text-xs text-gray-300">Total Earnings</div>
              </div>
            </div>
          )}
        </div>

        {/* Top Releases */}
        {topReleases.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-3">Top Performing Releases</h2>
            <div className="space-y-2">
              {topReleases.map((release, index) => (
                <motion.div
                  key={release.id}
                  className="flex items-center justify-between p-2 bg-black/20 rounded-2xl"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                      'bg-gradient-to-r from-orange-400 to-red-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm flex items-center space-x-1">
                        <span className="truncate max-w-24">{release.title}</span>
                        {release.isViral && <span className="text-xs">🔥</span>}
                        {release.trending && <span className="text-xs">📈</span>}
                        {release.chartPosition && release.chartPosition <= 10 && (
                          <span className="text-xs bg-yellow-400/20 text-yellow-400 px-1 rounded">
                            #{release.chartPosition}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-300">
                        {release.type === 'video' ? 'RapTube Video' : 'Rapify ' + release.type}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-cyan-400">
                      <SafeIcon icon={FiEye} className="text-xs" />
                      <span className="font-bold text-xs">{formatNumber(release.views)}</span>
                    </div>
                    <div className="text-xs text-green-400">${Math.floor(release.earnings)}</div>
                    {release.weeklyViews && (
                      <div className="text-xs text-purple-400">+{formatNumber(release.weeklyViews)} this week</div>
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
                        className="text-xs bg-red-400/20 text-red-400 px-1 py-0.5 rounded mt-1 hover:bg-red-400/30 transition-colors"
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
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-4 px-6 rounded-3xl font-bold shadow-xl hover:shadow-2xl transition-all"
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