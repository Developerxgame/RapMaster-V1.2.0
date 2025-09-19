import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import ShareModal from './ShareModal';
import ShareButton from './ShareButton';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiTrendingUp, FiUsers, FiDollarSign, FiMusic, FiDisc, FiVideo, FiCalendar, FiTarget, FiEye, FiPlay, FiYoutube, FiAward, FiCrown, FiBarChart, FiActivity } = FiIcons;

export default function StatsPage() {
  const { state } = useGame();
  const { player, tracks, albums, musicVideos, releases, earnings } = state;
  const [shareModal, setShareModal] = useState({ isOpen: false, data: null });

  const mainStats = [
    { icon: FiStar, label: 'Fame', value: player.fame, color: 'text-neon-yellow', description: 'Your popularity in the rap scene' },
    { icon: FiTrendingUp, label: 'Reputation', value: player.reputation, color: 'text-neon-cyan', description: 'How respected you are in the industry' },
    { icon: FiUsers, label: 'Fans', value: player.fans.toLocaleString(), color: 'text-neon-green', description: 'Your loyal fanbase' },
    { icon: FiDollarSign, label: 'Net Worth', value: `$${player.netWorth.toLocaleString()}`, color: 'text-neon-green', description: 'Your total wealth' }
  ];

  const careerStats = [
    { icon: FiMusic, label: 'Tracks Created', value: tracks.length, color: 'text-neon-purple' },
    { icon: FiDisc, label: 'Albums Released', value: albums.filter(a => a.released).length, color: 'text-neon-orange' },
    { icon: FiVideo, label: 'Music Videos', value: musicVideos.length, color: 'text-neon-red' },
    { icon: FiPlay, label: 'Total Releases', value: releases.length, color: 'text-neon-pink' }
  ];

  const earningsStats = [
    { icon: FiDollarSign, label: 'Total Earnings', value: `$${earnings.total.toFixed(2)}`, color: 'text-neon-green' },
    { icon: FiTrendingUp, label: 'This Week', value: `$${earnings.thisWeek.toFixed(2)}`, color: 'text-neon-cyan' },
    { icon: FiMusic, label: 'Streaming', value: `$${earnings.streaming.toFixed(2)}`, color: 'text-neon-purple' },
    { icon: FiYoutube, label: 'YouTube', value: `$${earnings.youtube.toFixed(2)}`, color: 'text-neon-red' }
  ];

  const socialStats = [
    { platform: 'RapGram', followers: player.socialMedia.rapgram.followers, color: 'text-neon-pink' },
    { platform: 'RapTube', followers: player.socialMedia.raptube.subscribers, color: 'text-neon-red' },
    { platform: 'Rapify', followers: player.socialMedia.rapify.listeners, color: 'text-neon-green' },
    { platform: 'RikTok', followers: player.socialMedia.riktok.followers, color: 'text-neon-purple' }
  ];

  const skillLevels = [
    { name: 'Lyrics', value: player.skills.lyrics, max: 100, color: 'bg-neon-cyan' },
    { name: 'Flow', value: player.skills.flow, max: 100, color: 'bg-neon-green' },
    { name: 'Charisma', value: player.skills.charisma, max: 100, color: 'bg-neon-yellow' },
    { name: 'Business', value: player.skills.business, max: 100, color: 'bg-neon-purple' },
    { name: 'Production', value: player.skills.production, max: 100, color: 'bg-neon-red' }
  ];

  const getProgressColor = (value, max) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'bg-neon-green';
    if (percentage >= 60) return 'bg-neon-yellow';
    if (percentage >= 40) return 'bg-neon-orange';
    return 'bg-neon-red';
  };

  const getCareerLevel = () => {
    const totalFame = player.fame;
    if (totalFame >= 1000) return { level: 'Rap Legend', icon: '👑', color: 'text-neon-yellow', description: 'Hall of Fame Status' };
    if (totalFame >= 500) return { level: 'Superstar', icon: '⭐', color: 'text-neon-yellow', description: 'Mainstream Success' };
    if (totalFame >= 200) return { level: 'Rising Star', icon: '🌟', color: 'text-neon-cyan', description: 'Breaking Through' };
    if (totalFame >= 50) return { level: 'Known Artist', icon: '🎤', color: 'text-neon-green', description: 'Industry Recognition' };
    if (totalFame >= 10) return { level: 'Underground', icon: '🎭', color: 'text-neon-purple', description: 'Building Buzz' };
    return { level: 'Rookie', icon: '🎯', color: 'text-text-muted', description: 'Starting Out' };
  };

  const totalViews = releases.reduce((sum, release) => sum + release.views, 0);
  const totalStreams = releases.reduce((sum, release) => sum + (release.streams || 0), 0);
  const avgViewsPerRelease = releases.length > 0 ? Math.floor(totalViews / releases.length) : 0;
  const trendingReleases = releases.filter(r => r.trending).length;
  const chartHits = releases.filter(r => r.chartPosition && r.chartPosition <= 10).length;
  const viralHits = releases.filter(r => r.isViral).length;

  const careerLevel = getCareerLevel();

  // Enhanced performance metrics
  const thisWeekViews = releases.reduce((sum, release) => sum + (release.weeklyViews || 0), 0);
  const peakWeeklyViews = Math.max(...releases.map(r => r.peakWeeklyViews || 0), 0);
  const avgWeeklyViews = releases.length > 0 ? releases.reduce((sum, release) => sum + (release.avgWeeklyViews || 0), 0) / releases.length : 0;

  // Calculate milestones
  const milestones = [
    { achieved: player.fame >= 50, title: 'Known Artist', description: 'Reach 50 fame', icon: FiStar },
    { achieved: player.fans >= 1000, title: 'Fan Base', description: 'Get 1,000 fans', icon: FiUsers },
    { achieved: tracks.length >= 10, title: 'Prolific Creator', description: 'Create 10 tracks', icon: FiMusic },
    { achieved: albums.length >= 3, title: 'Album Artist', description: 'Release 3 albums', icon: FiDisc },
    { achieved: totalViews >= 100000, title: 'Viral Success', description: '100K total views', icon: FiEye },
    { achieved: earnings.total >= 10000, title: 'Money Maker', description: 'Earn $10,000', icon: FiDollarSign },
    { achieved: chartHits >= 1, title: 'Chart Success', description: 'Get a top 10 hit', icon: FiAward },
    { achieved: player.netWorth >= 100000, title: 'Wealthy Artist', description: 'Net worth $100K', icon: FiCrown },
    { achieved: viralHits >= 1, title: 'Viral Star', description: 'Get a viral hit', icon: FiActivity },
    { achieved: totalViews >= 1000000, title: 'Million Views', description: '1M total views', icon: FiBarChart }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleShareStats = () => {
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
        type: 'achievement',
        achievement: milestone.title,
        stats: {
          fame: player.fame,
          fans: player.fans,
          netWorth: player.netWorth
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg pb-24 pt-16">
      <div className="px-4 space-y-4 max-w-mobile mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-text-primary mb-2">Career Statistics</h1>
          <p className="text-text-muted text-sm">Track your rise to fame</p>
        </div>

        {/* Career Level */}
        <motion.div
          className="bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 p-4 rounded-game-lg text-center text-text-primary shadow-glow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="text-3xl mb-2">{careerLevel.icon}</div>
              <h2 className="text-lg font-bold mb-1 neon-text">{careerLevel.level}</h2>
              <p className="text-text-secondary text-sm mb-2">{careerLevel.description}</p>
              <p className="text-text-muted text-xs mb-3">
                {player.stageName} • Age {player.age} • {player.city}
              </p>
            </div>
            <ShareButton onShare={handleShareStats} size="small" />
          </div>
          <div className="flex items-center justify-center space-x-6 text-xs">
            <div>
              <div className="font-bold text-text-primary">{player.week}</div>
              <div className="text-text-muted">Week</div>
            </div>
            <div>
              <div className="font-bold text-text-primary">{player.year}</div>
              <div className="text-text-muted">Year</div>
            </div>
            <div>
              <div className="font-bold text-text-primary">{60 - player.age}</div>
              <div className="text-text-muted">Years Left</div>
            </div>
          </div>
        </motion.div>

        {/* Main Stats */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">Main Statistics</h2>
          <div className="grid grid-cols-2 gap-3">
            {mainStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="game-card p-3 shadow-dark"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <SafeIcon icon={stat.icon} className={`text-lg ${stat.color}`} />
                  <span className="text-xs font-medium text-text-muted">{stat.label}</span>
                </div>
                <div className={`text-lg font-bold ${stat.color} mb-1 animate-neon`}>{stat.value}</div>
                <p className="text-xs text-text-muted">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enhanced Performance Metrics */}
        <div className="game-card p-4 shadow-dark">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-text-primary flex items-center space-x-2">
              <SafeIcon icon={FiBarChart} className="text-neon-cyan" />
              <span>Performance Analytics</span>
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
              <div className="text-lg font-bold text-neon-green animate-neon">{formatNumber(totalStreams)}</div>
              <div className="text-xs text-text-muted">Total Streams</div>
            </div>
            <div className="text-center p-2 bg-dark-surface/30 rounded-game">
              <div className="text-lg font-bold text-neon-orange animate-neon">{formatNumber(thisWeekViews)}</div>
              <div className="text-xs text-text-muted">This Week Views</div>
            </div>
            <div className="text-center p-2 bg-dark-surface/30 rounded-game">
              <div className="text-lg font-bold text-neon-purple animate-neon">{formatNumber(peakWeeklyViews)}</div>
              <div className="text-xs text-text-muted">Peak Weekly Views</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-base font-bold text-neon-red animate-neon">{viralHits}</div>
              <div className="text-xs text-text-muted">Viral Hits</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-neon-cyan animate-neon">{chartHits}</div>
              <div className="text-xs text-text-muted">Chart Hits</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-neon-green animate-neon">{trendingReleases}</div>
              <div className="text-xs text-text-muted">Trending Now</div>
            </div>
          </div>
        </div>

        {/* Social Media Overview */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">Social Media Following</h2>
          <div className="game-card p-4 shadow-dark">
            <div className="grid grid-cols-2 gap-3">
              {socialStats.map((social, index) => (
                <motion.div
                  key={social.platform}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`text-lg font-bold ${social.color} animate-neon`}>
                    {social.followers.toLocaleString()}
                  </div>
                  <div className="text-xs text-text-muted">{social.platform}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Earnings Overview */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">Earnings Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            {earningsStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="game-card p-3 shadow-dark text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SafeIcon icon={stat.icon} className={`text-lg ${stat.color} mx-auto mb-2`} />
                <div className={`text-base font-bold ${stat.color} animate-neon`}>{stat.value}</div>
                <div className="text-xs text-text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Career Stats */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">Content Statistics</h2>
          <div className="grid grid-cols-2 gap-3">
            {careerStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="game-card p-3 shadow-dark text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SafeIcon icon={stat.icon} className={`text-lg ${stat.color} mx-auto mb-2`} />
                <div className={`text-base font-bold ${stat.color} animate-neon`}>{stat.value}</div>
                <div className="text-xs text-text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skills Overview */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">Skills Overview</h2>
          <div className="space-y-3">
            {skillLevels.map((skill, index) => (
              <motion.div
                key={skill.name}
                className="game-card p-3 shadow-dark"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-text-primary text-sm">{skill.name}</span>
                  <span className="text-xs text-text-muted">{skill.value}/{skill.max}</span>
                </div>
                <div className="w-full bg-dark-surface/50 rounded-full h-2">
                  <motion.div
                    className={`${getProgressColor(skill.value, skill.max)} h-2 rounded-full shadow-glow`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(skill.value / skill.max) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Releases with Enhanced Stats */}
        {releases.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-text-primary mb-3">Top Performing Releases</h2>
            <div className="space-y-2">
              {releases
                .sort((a, b) => b.views - a.views)
                .slice(0, 5)
                .map((release, index) => (
                  <motion.div
                    key={release.id}
                    className="game-card p-3 shadow-dark"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2 flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                          index === 0 ? 'bg-neon-yellow shadow-glow' :
                          index === 1 ? 'bg-text-muted' :
                          'bg-neon-orange'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-text-primary flex items-center space-x-1 mb-1 text-sm">
                            <span className="truncate max-w-20">{release.title}</span>
                            {release.isViral && <span className="text-xs">🔥</span>}
                            {release.trending && <span className="text-xs">📈</span>}
                            {release.chartPosition && release.chartPosition <= 10 && (
                              <span className="text-xs bg-neon-yellow/20 text-neon-yellow px-1 rounded">
                                #{release.chartPosition}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-text-muted capitalize mb-1">{release.type}</div>
                          <div className="flex items-center space-x-3 text-xs text-text-muted">
                            <span>Weekly: {formatNumber(release.weeklyViews || 0)}</span>
                            <span>Peak: {formatNumber(release.peakWeeklyViews || 0)}</span>
                            {release.growthRate && (
                              <span className={release.growthRate > 0 ? 'text-neon-green' : 'text-neon-red'}>
                                {release.growthRate > 0 ? '↗' : '↘'} {Math.abs(release.growthRate).toFixed(1)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-neon-cyan mb-1">
                          <SafeIcon icon={FiEye} className="text-xs" />
                          <span className="font-bold text-xs animate-neon">{formatNumber(release.views)}</span>
                        </div>
                        <div className="text-xs text-neon-green">${release.earnings.toFixed(2)}</div>
                        {release.streams && (
                          <div className="text-xs text-neon-purple">{formatNumber(release.streams)} streams</div>
                        )}
                        {release.isViral && (
                          <ShareButton
                            onShare={() => setShareModal({
                              isOpen: true,
                              data: {
                                type: 'release',
                                title: release.title,
                                stats: { fame: player.fame, fans: player.fans, netWorth: player.netWorth }
                              }
                            })}
                            size="small"
                            className="text-xs py-1 px-2 mt-1"
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Performance indicators */}
                    <div className="flex items-center space-x-2 text-xs">
                      <div className={`px-2 py-1 rounded-full ${
                        release.ageMultiplier > 0.8 ? 'bg-neon-green/10 text-neon-green' :
                        release.ageMultiplier > 0.5 ? 'bg-neon-orange/10 text-neon-orange' :
                        'bg-neon-red/10 text-neon-red'
                      }`}>
                        {release.ageMultiplier > 0.8 ? 'Fresh' : release.ageMultiplier > 0.5 ? 'Aging' : 'Old'}
                      </div>
                      <div className="text-text-muted">
                        Quality: {release.quality}/10
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* Milestones */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">Career Milestones</h2>
          <div className="grid grid-cols-1 gap-2">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.title}
                className={`p-3 rounded-game shadow-dark flex items-center space-x-3 ${
                  milestone.achieved
                    ? 'game-card border border-neon-green/30 shadow-glow'
                    : 'game-card'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`p-2 rounded-game ${
                  milestone.achieved ? 'bg-neon-green/20' : 'bg-dark-surface/50'
                }`}>
                  <SafeIcon icon={milestone.icon} className={`${
                    milestone.achieved ? 'text-neon-green' : 'text-text-muted'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-xs ${
                    milestone.achieved ? 'text-text-primary' : 'text-text-muted'
                  }`}>
                    {milestone.title}
                  </div>
                  <div className={`text-xs ${
                    milestone.achieved ? 'text-text-secondary' : 'text-text-muted'
                  }`}>
                    {milestone.description}
                  </div>
                </div>
                {milestone.achieved ? (
                  <div className="flex items-center space-x-2">
                    <div className="text-neon-green text-base">✓</div>
                    <ShareButton
                      onShare={() => handleShareMilestone(milestone)}
                      size="small"
                      className="text-xs py-1 px-2"
                    />
                  </div>
                ) : (
                  <div className="w-6"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">Next Goals</h2>
          <div className="space-y-2">
            {player.fame < 50 && (
              <div className="game-card p-3 shadow-dark flex items-center space-x-3">
                <SafeIcon icon={FiTarget} className="text-neon-orange" />
                <span className="text-xs text-text-secondary">Reach 50 fame to become a known artist</span>
              </div>
            )}
            {player.fans < 1000 && (
              <div className="game-card p-3 shadow-dark flex items-center space-x-3">
                <SafeIcon icon={FiUsers} className="text-neon-green" />
                <span className="text-xs text-text-secondary">Get 1,000 fans</span>
              </div>
            )}
            {tracks.length < 10 && (
              <div className="game-card p-3 shadow-dark flex items-center space-x-3">
                <SafeIcon icon={FiMusic} className="text-neon-purple" />
                <span className="text-xs text-text-secondary">Create 10 tracks</span>
              </div>
            )}
            {albums.length === 0 && (
              <div className="game-card p-3 shadow-dark flex items-center space-x-3">
                <SafeIcon icon={FiDisc} className="text-neon-cyan" />
                <span className="text-xs text-text-secondary">Release your first album</span>
              </div>
            )}
            {totalViews < 100000 && (
              <div className="game-card p-3 shadow-dark flex items-center space-x-3">
                <SafeIcon icon={FiEye} className="text-neon-pink" />
                <span className="text-xs text-text-secondary">Reach 100,000 total views</span>
              </div>
            )}
            {chartHits === 0 && (
              <div className="game-card p-3 shadow-dark flex items-center space-x-3">
                <SafeIcon icon={FiAward} className="text-neon-yellow" />
                <span className="text-xs text-text-secondary">Get your first top 10 hit</span>
              </div>
            )}
            {viralHits === 0 && (
              <div className="game-card p-3 shadow-dark flex items-center space-x-3">
                <SafeIcon icon={FiActivity} className="text-neon-red" />
                <span className="text-xs text-text-secondary">Create your first viral hit</span>
              </div>
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