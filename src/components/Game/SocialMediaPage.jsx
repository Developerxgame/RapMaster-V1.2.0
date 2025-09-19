import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiInstagram, FiYoutube, FiMusic, FiTrendingUp, FiUsers, FiHeart, FiMessageCircle, FiShare, FiPlus, FiPlay, FiEye, FiZap } = FiIcons;

export default function SocialMediaPage() {
  const { state, dispatch } = useGame();
  const { player, socialPosts, releases, tracks, albums, musicVideos } = state;
  const [activeApp, setActiveApp] = useState('rapgram');
  const [postContent, setPostContent] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);

  const socialApps = [
    { id: 'rapgram', name: 'RapGram', icon: FiInstagram, color: 'bg-neon-pink' },
    { id: 'raptube', name: 'RapTube', icon: FiYoutube, color: 'bg-neon-red' },
    { id: 'rapify', name: 'Rapify', icon: FiMusic, color: 'bg-neon-green' },
    { id: 'riktok', name: 'RikTok', icon: FiTrendingUp, color: 'bg-neon-purple' }
  ];

  const formatFollowers = (amount) => {
    if (amount >= 1000000000000) {
      return `${(amount / 1000000000000).toFixed(1)}T`;
    } else if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  };

  const postTemplates = [
    "Just dropped a new track! 🔥 #NewMusic #RapLife",
    "In the studio working on something special... 👀 #StudioLife",
    "Thanks to all my fans for the love! ❤️ #Grateful #FanLove",
    "Behind the scenes at the video shoot 🎬 #MusicVideo",
    "Blessed to be living my dream 🙏 #Grateful #RapDream",
    "Can't wait for you to hear what's coming next! 🎵 #ComingSoon",
    "Grinding every day to perfect my craft 💪 #NeverStop",
    "Shoutout to my team for making this possible! 🤝 #TeamWork",
    "From the streets to the charts! 📈 #RiseUp",
    "New music dropping soon! Who's ready? 🚀 #GetReady"
  ];

  const createPost = () => {
    if (!postContent.trim() || player.energy < 5) return;

    const baseReach = Math.floor(player.fans * 0.3 + player.socialMedia[activeApp]?.followers * 0.4);
    const engagementRate = Math.random() * 0.15 + 0.02; // 2-17% engagement
    const qualityMultiplier = selectedContent ? 1.5 : 1;
    const likes = Math.floor(baseReach * engagementRate * qualityMultiplier);
    const comments = Math.floor(likes * 0.25);
    const shares = Math.floor(likes * 0.15);

    // Viral potential for high-quality content
    const viralChance = player.fame > 100 ? 0.1 : 0.05;
    const isViral = Math.random() < viralChance;
    const finalLikes = isViral ? likes * (2 + Math.random() * 3) : likes;
    const finalComments = isViral ? comments * (2 + Math.random() * 3) : comments;
    const finalShares = isViral ? shares * (2 + Math.random() * 3) : shares;

    const newPost = {
      id: Date.now(),
      platform: activeApp,
      content: postContent,
      likes: Math.floor(finalLikes),
      comments: Math.floor(finalComments),
      shares: Math.floor(finalShares),
      createdAt: `${player.week}/${player.year}`,
      contentId: selectedContent,
      isViral: isViral
    };

    dispatch({ type: 'ADD_SOCIAL_POST', payload: newPost });
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        energy: player.energy - 5
      }
    });

    if (isViral) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'success',
          title: 'Viral Post! 🔥',
          message: `Your post went viral with ${Math.floor(finalLikes).toLocaleString()} likes!`,
          timestamp: new Date().toISOString()
        }
      });
    }

    setPostContent('');
    setSelectedContent(null);
  };

  const canPost = () => {
    return postContent.trim() && player.energy >= 5;
  };

  const getRandomTemplate = () => {
    const template = postTemplates[Math.floor(Math.random() * postTemplates.length)];
    setPostContent(template);
  };

  // Get only released content for posting
  const getPostableContent = () => {
    return [
      ...tracks.filter(t => t.released),
      ...albums.filter(a => a.released),
      ...musicVideos.filter(v => v.released)
    ];
  };

  const postableContent = getPostableContent();

  // Get released content by platform
  const getRapifyContent = () => {
    return releases.filter(r => r.type === 'track' || r.type === 'album');
  };

  const getRapTubeContent = () => {
    return releases.filter(r => r.type === 'video');
  };

  return (
    <div className="min-h-screen bg-dark-bg pb-24 pt-16">
      <div className="px-4 space-y-4 max-w-mobile mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-text-primary mb-2">Social Media</h1>
          <p className="text-text-muted text-sm">Connect with your fans and grow your audience</p>
        </div>

        {/* Stats Overview */}
        <div className="game-card p-3 shadow-dark">
          <h3 className="font-bold text-text-primary mb-2 text-sm">Social Media Stats</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center">
              <div className="text-base font-bold text-neon-pink animate-neon">{formatFollowers(player.socialMedia.rapgram.followers)}</div>
              <div className="text-text-muted">RapGram Followers</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-neon-red animate-neon">{formatFollowers(player.socialMedia.raptube.subscribers)}</div>
              <div className="text-text-muted">RapTube Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-neon-green animate-neon">{formatFollowers(player.socialMedia.rapify.listeners)}</div>
              <div className="text-text-muted">Rapify Listeners</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-neon-purple animate-neon">{formatFollowers(player.socialMedia.riktok.followers)}</div>
              <div className="text-text-muted">RikTok Followers</div>
            </div>
          </div>
        </div>

        {/* Energy Status */}
        <div className="game-card p-3 shadow-dark">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiZap} className="text-neon-orange" />
              <span className="text-sm font-medium text-text-primary">Energy: {player.energy}/100</span>
            </div>
            <span className="text-xs text-text-muted">Social media activities cost energy</span>
          </div>
        </div>

        {/* App Selection */}
        <div className="grid grid-cols-2 gap-3">
          {socialApps.map((app) => (
            <motion.button
              key={app.id}
              onClick={() => setActiveApp(app.id)}
              className={`${app.color} p-3 rounded-game text-white text-center shadow-glow ${
                activeApp === app.id ? 'ring-2 ring-white ring-opacity-50 scale-105' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={app.icon} className="text-lg mx-auto mb-1" />
              <div className="font-bold text-xs">{app.name}</div>
              <div className="text-xs opacity-80 mt-1">
                {app.id === 'rapgram' && `${formatFollowers(player.socialMedia.rapgram.followers)} followers`}
                {app.id === 'raptube' && `${formatFollowers(player.socialMedia.raptube.subscribers)} subscribers`}
                {app.id === 'rapify' && `${formatFollowers(player.socialMedia.rapify.listeners)} listeners`}
                {app.id === 'riktok' && `${formatFollowers(player.socialMedia.riktok.followers)} followers`}
              </div>
            </motion.button>
          ))}
        </div>

        {/* RapGram & RikTok - Only these platforms allow posting */}
        {(activeApp === 'rapgram' || activeApp === 'riktok') && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Create Post */}
            <div className="game-card p-3 shadow-dark">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-text-primary text-sm">Create Post</h3>
                <div className="text-xs text-text-muted">-5 Energy</div>
              </div>
              <div className="space-y-2">
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's happening in your music career?"
                  className="w-full p-2 bg-dark-surface/60 border border-dark-border text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple/50 rounded-game resize-none text-sm"
                  rows={3}
                  maxLength={280}
                />
                
                {/* Released Content Selection */}
                {postableContent.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Attach Released Content (Optional)
                    </label>
                    <select
                      value={selectedContent || ''}
                      onChange={(e) => setSelectedContent(e.target.value || null)}
                      className="w-full p-2 bg-dark-surface/60 border border-dark-border text-text-primary focus:outline-none focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple/50 rounded-game text-xs"
                    >
                      <option value="">No attachment</option>
                      {postableContent.map((content) => (
                        <option key={content.id} value={content.id}>
                          {content.title} ({content.type})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={getRandomTemplate}
                    className="flex-1 p-2 bg-dark-surface/60 rounded-game hover:bg-dark-surface/80 transition-colors"
                  >
                    <span className="text-xs font-medium text-text-muted">Use Template</span>
                  </button>
                  <button
                    onClick={createPost}
                    disabled={!canPost()}
                    className={`flex-1 p-2 rounded-game font-semibold transition-all text-xs ${
                      canPost()
                        ? activeApp === 'rapgram'
                          ? 'bg-neon-pink text-white hover:shadow-glow active:scale-95'
                          : 'bg-neon-purple text-white hover:shadow-glow active:scale-95'
                        : 'bg-dark-surface/50 text-text-disabled cursor-not-allowed'
                    }`}
                  >
                    Post (-5 Energy)
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="space-y-2">
              <h3 className="font-bold text-text-primary text-sm">Recent Posts</h3>
              {socialPosts
                .filter(post => post.platform === activeApp)
                .slice(0, 3)
                .map((post) => (
                  <div key={post.id} className="game-card p-3 shadow-dark">
                    <div className="flex items-start space-x-2 mb-2">
                      <div className={`w-8 h-8 ${
                        activeApp === 'rapgram' 
                          ? 'bg-gradient-to-r from-neon-pink to-neon-purple' 
                          : 'bg-gradient-to-r from-neon-purple to-neon-cyan'
                      } rounded-full flex items-center justify-center text-white font-bold text-xs shadow-glow`}>
                        {player.stageName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="font-semibold text-text-primary text-sm">{player.stageName}</div>
                          {post.isViral && (
                            <span className="text-xs bg-neon-red/20 text-neon-red px-1 py-0.5 rounded-full border border-neon-red/30">🔥 VIRAL</span>
                          )}
                        </div>
                        <div className="text-xs text-text-muted">{post.createdAt}</div>
                      </div>
                    </div>
                    <p className="text-text-primary mb-2 text-sm">{post.content}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-dark-border/30">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 text-neon-red">
                          <SafeIcon icon={FiHeart} className="text-xs" />
                          <span className="text-xs font-medium">{formatFollowers(post.likes)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-neon-cyan">
                          <SafeIcon icon={FiMessageCircle} className="text-xs" />
                          <span className="text-xs font-medium">{formatFollowers(post.comments)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-neon-green">
                          <SafeIcon icon={FiShare} className="text-xs" />
                          <span className="text-xs font-medium">{formatFollowers(post.shares)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {socialPosts.filter(post => post.platform === activeApp).length === 0 && (
                <div className="text-center py-6 game-card shadow-dark">
                  <SafeIcon icon={activeApp === 'rapgram' ? FiInstagram : FiTrendingUp} className="text-3xl text-text-muted mx-auto mb-2" />
                  <p className="text-text-muted text-sm">No posts yet. Create your first post!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Rapify - Show Released Tracks & Albums */}
        {activeApp === 'rapify' && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="game-card p-4 shadow-dark">
              <div className="text-center mb-4">
                <SafeIcon icon={FiMusic} className="text-4xl text-text-muted mx-auto mb-2" />
                <h3 className="font-bold text-text-primary mb-1 text-sm">Rapify</h3>
                <p className="text-text-muted text-xs mb-3">
                  Your music streams automatically on Rapify. Use RapGram and RikTok for promotion.
                </p>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-neon-green animate-neon">
                      {formatFollowers(player.socialMedia.rapify.listeners)}
                    </div>
                    <div className="text-xs text-text-muted">Listeners</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-neon-cyan animate-neon">
                      {formatFollowers(player.socialMedia.rapify.streams)}
                    </div>
                    <div className="text-xs text-text-muted">Total Streams</div>
                  </div>
                </div>
              </div>
              
              {/* Released Content on Rapify */}
              <div>
                <h4 className="font-bold text-text-primary mb-2 text-sm">Released on Rapify</h4>
                <div className="space-y-2">
                  {getRapifyContent().map((release) => (
                    <div key={release.id} className="flex items-center justify-between p-2 bg-dark-surface/30 rounded-game">
                      <div>
                        <div className="font-semibold text-text-primary text-sm">{release.title}</div>
                        <div className="text-xs text-text-muted capitalize">{release.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-neon-green animate-neon">{formatFollowers(release.views)} streams</div>
                        <div className="text-xs text-neon-cyan">${Math.floor(release.earnings)}</div>
                      </div>
                    </div>
                  ))}
                  {getRapifyContent().length === 0 && (
                    <div className="text-center py-4 text-text-muted text-sm">
                      No content released on Rapify yet. Go to the studio to create and release music!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* RapTube - Show Released Music Videos */}
        {activeApp === 'raptube' && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="game-card p-4 shadow-dark">
              <div className="text-center mb-4">
                <SafeIcon icon={FiYoutube} className="text-4xl text-text-muted mx-auto mb-2" />
                <h3 className="font-bold text-text-primary mb-1 text-sm">RapTube</h3>
                <p className="text-text-muted text-xs mb-3">
                  Music videos automatically get views when released. Promotion is available on RapGram and RikTok.
                </p>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-neon-red animate-neon">
                      {formatFollowers(player.socialMedia.raptube.subscribers)}
                    </div>
                    <div className="text-xs text-text-muted">Subscribers</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-neon-orange animate-neon">
                      {formatFollowers(player.socialMedia.raptube.totalViews)}
                    </div>
                    <div className="text-xs text-text-muted">Total Views</div>
                  </div>
                </div>
              </div>
              
              {/* Released Content on RapTube */}
              <div>
                <h4 className="font-bold text-text-primary mb-2 text-sm">Released on RapTube</h4>
                <div className="space-y-2">
                  {getRapTubeContent().map((release) => (
                    <div key={release.id} className="flex items-center justify-between p-2 bg-dark-surface/30 rounded-game">
                      <div>
                        <div className="font-semibold text-text-primary text-sm">{release.title}</div>
                        <div className="text-xs text-text-muted">Music Video</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-neon-red animate-neon">{formatFollowers(release.views)} views</div>
                        <div className="text-xs text-neon-green">${Math.floor(release.earnings)}</div>
                      </div>
                    </div>
                  ))}
                  {getRapTubeContent().length === 0 && (
                    <div className="text-center py-4 text-text-muted text-sm">
                      No music videos released on RapTube yet. Go to the studio to create and release videos!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}