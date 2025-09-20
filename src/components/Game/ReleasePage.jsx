import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiMegaphone, FiTrendingUp, FiEye, FiDollarSign, FiCalendar, FiStar, FiMusic, FiVideo, FiDisc, FiPlay } = FiIcons;

export default function ReleasePage() {
  const { state, dispatch } = useGame();
  const { tracks = [], albums = [], musicVideos = [], releases = [], player } = state;
  const [isReleasing, setIsReleasing] = useState(false);
  const [releasingContentId, setReleasingContentId] = useState(null);

  // Get unreleased content with null checks
  const unreleasedTracks = tracks.filter(track => track && !track.released && !track.inAlbum);
  const unreleasedAlbums = albums.filter(album => album && !album.released);
  const unreleasedVideos = musicVideos.filter(video => video && !video.released);

  // Get released content that hasn't been announced with null checks
  const unannouncedReleases = releases.filter(release => release && !release.announced);

  const handleRelease = async (content, type) => {
    if (isReleasing || releasingContentId === content.id || !content) return;
    
    setIsReleasing(true);
    setReleasingContentId(content.id);

    // Determine platform based on content type
    const platform = type === 'video' ? 'RapTube' : 'Rapify';

    try {
      // Simulate release process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      dispatch({
        type: 'RELEASE_CONTENT',
        payload: {
          contentId: content.id,
          type: type,
          title: content.title,
          quality: content.quality || 5,
          platform: platform
        }
      });

      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'success',
          title: `Released on ${platform}!`,
          message: `"${content.title}" is now live on ${platform} and earning views!`,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error releasing content:', error);
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'error',
          title: 'Release Failed',
          message: 'There was an error releasing your content. Please try again.',
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      setIsReleasing(false);
      setReleasingContentId(null);
    }
  };

  const handleAnnounce = (release) => {
    if (!release) return;
    
    try {
      dispatch({
        type: 'ANNOUNCE_RELEASE',
        payload: {
          releaseId: release.id
        }
      });

      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'success',
          title: 'Release Announced!',
          message: `"${release.title}" has been announced on RapGram and RikTok!`,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error announcing release:', error);
    }
  };

  const formatNumber = (num) => {
    if (!num || isNaN(num)) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Loading screen during release
  if (isReleasing && releasingContentId) {
    const selectedContent = [...unreleasedTracks, ...unreleasedAlbums, ...unreleasedVideos]
      .find(content => content.id === releasingContentId);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
        <motion.div
          className="text-center bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-xl font-bold text-white mb-2">
            Releasing "{selectedContent?.title || 'Content'}"
          </h2>
          <p className="text-gray-300 mb-6">Going live on the platform...</p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pb-24 pt-16">
      <div className="px-4 space-y-4 max-w-mobile mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Release Center</h1>
          <p className="text-gray-300 text-sm">Share your music with the world</p>
        </div>

        {/* Release Process Info */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 p-4 rounded-3xl text-white shadow-xl">
          <h3 className="font-bold text-base mb-2">📈 Release Process</h3>
          <div className="text-sm text-gray-200 space-y-1">
            <p>1. Release your content on streaming platforms</p>
            <p>2. Announce on social media for extra boost</p>
            <p>3. Watch your views and earnings grow!</p>
          </div>
        </div>

        {/* Ready to Announce Section */}
        {unannouncedReleases.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-3">🔥 Ready for Social Media</h2>
            <div className="space-y-3">
              {unannouncedReleases.map((release) => (
                <motion.div
                  key={release.id}
                  className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-base">{release.title || 'Unknown Title'}</h4>
                      <div className="text-sm text-gray-300">
                        {release.type === 'video' ? 'Released on RapTube' : 'Released on Rapify'}
                      </div>
                      <p className="text-xs text-gray-400">Released: {release.releaseDate || 'Unknown'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-cyan-400">{formatNumber(release.views)} views</div>
                      <div className="text-sm text-green-400">${Math.floor(release.earnings || 0)} earned</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleAnnounce(release)}
                    className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-4 rounded-2xl font-semibold hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <SafeIcon icon={FiMegaphone} />
                      <span>Announce on RapGram & RikTok</span>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Unreleased Tracks */}
        {unreleasedTracks.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
              <SafeIcon icon={FiMusic} className="text-cyan-400" />
              <span>Unreleased Tracks</span>
            </h2>
            <div className="space-y-3">
              {unreleasedTracks.map((track) => (
                <motion.div
                  key={track.id}
                  className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-base">{track.title || 'Unknown Track'}</h4>
                      <div className="text-sm text-gray-300">
                        Producer: {track.producer || 'Unknown'} • Lyrics: {track.lyrics || 'Unknown'}
                      </div>
                      <p className="text-xs text-gray-400">Created: {track.createdAt || 'Unknown'}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <SafeIcon
                            key={i}
                            icon={FiStar}
                            className={`text-xs ${i < (track.quality || 0) ? 'text-orange-400' : 'text-gray-500'}`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-gray-300">Quality: {track.quality || 0}/10</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRelease(track, 'track')}
                    disabled={isReleasing && releasingContentId === track.id}
                    className={`w-full py-3 px-4 rounded-2xl font-semibold transition-all ${
                      isReleasing && releasingContentId === track.id
                        ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-xl'
                    }`}
                  >
                    {isReleasing && releasingContentId === track.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Releasing on Rapify...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <SafeIcon icon={FiUpload} />
                        <span>Release on Rapify</span>
                      </div>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Unreleased Albums */}
        {unreleasedAlbums.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
              <SafeIcon icon={FiDisc} className="text-purple-400" />
              <span>Unreleased Albums</span>
            </h2>
            <div className="space-y-3">
              {unreleasedAlbums.map((album) => (
                <motion.div
                  key={album.id}
                  className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-base">{album.title || 'Unknown Album'}</h4>
                      <div className="text-sm text-gray-300">
                        {(album.tracks && album.tracks.length) || 0} tracks
                      </div>
                      <p className="text-xs text-gray-400">Created: {album.createdAt || 'Unknown'}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <SafeIcon
                            key={i}
                            icon={FiStar}
                            className={`text-xs ${i < (album.quality || 0) ? 'text-orange-400' : 'text-gray-500'}`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-gray-300">Quality: {album.quality || 0}/10</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRelease(album, 'album')}
                    disabled={isReleasing && releasingContentId === album.id}
                    className={`w-full py-3 px-4 rounded-2xl font-semibold transition-all ${
                      isReleasing && releasingContentId === album.id
                        ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl'
                    }`}
                  >
                    {isReleasing && releasingContentId === album.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Releasing on Rapify...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <SafeIcon icon={FiUpload} />
                        <span>Release on Rapify</span>
                      </div>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Unreleased Music Videos */}
        {unreleasedVideos.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
              <SafeIcon icon={FiVideo} className="text-red-400" />
              <span>Unreleased Music Videos</span>
            </h2>
            <div className="space-y-3">
              {unreleasedVideos.map((video) => (
                <motion.div
                  key={video.id}
                  className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-base">{video.title || 'Unknown Video'}</h4>
                      <div className="text-sm text-gray-300">
                        Track: {video.trackTitle || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-400">
                        Director: {video.director || 'Unknown'} • Studio: {video.studio || 'Unknown'}
                      </div>
                      <p className="text-xs text-gray-400">Created: {video.createdAt || 'Unknown'}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <SafeIcon
                            key={i}
                            icon={FiStar}
                            className={`text-xs ${i < (video.quality || 0) ? 'text-orange-400' : 'text-gray-500'}`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-gray-300">Quality: {video.quality || 0}/10</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRelease(video, 'video')}
                    disabled={isReleasing && releasingContentId === video.id}
                    className={`w-full py-3 px-4 rounded-2xl font-semibold transition-all ${
                      isReleasing && releasingContentId === video.id
                        ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-xl'
                    }`}
                  >
                    {isReleasing && releasingContentId === video.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Releasing on RapTube...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <SafeIcon icon={FiUpload} />
                        <span>Release on RapTube</span>
                      </div>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* No Content Message */}
        {unreleasedTracks.length === 0 && unreleasedAlbums.length === 0 && unreleasedVideos.length === 0 && unannouncedReleases.length === 0 && (
          <div className="text-center py-12 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl">
            <SafeIcon icon={FiMusic} className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Content Ready for Release</h3>
            <p className="text-gray-300 text-sm mb-4">Create tracks, albums, or music videos in the studio first!</p>
            <button
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-2 px-6 rounded-2xl font-semibold hover:shadow-xl transition-all"
            >
              Go to Studio
            </button>
          </div>
        )}

        {/* Release Stats */}
        {releases.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-xl">
            <h3 className="font-bold text-white mb-3 text-base">📊 Release Statistics</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-xl font-bold text-cyan-400">{releases.length}</div>
                <div className="text-xs text-gray-300">Total Releases</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-400">
                  {formatNumber(releases.reduce((sum, r) => sum + (r.views || 0), 0))}
                </div>
                <div className="text-xs text-gray-300">Total Views</div>
              </div>
              <div>
                <div className="text-xl font-bold text-red-400">
                  {releases.filter(r => r.isViral).length}
                </div>
                <div className="text-xs text-gray-300">Viral Hits</div>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-400">
                  ${Math.floor(releases.reduce((sum, r) => sum + (r.earnings || 0), 0))}
                </div>
                <div className="text-xs text-gray-300">Total Earnings</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}