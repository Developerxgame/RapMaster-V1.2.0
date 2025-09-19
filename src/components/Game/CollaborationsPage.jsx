import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiStar, FiDollarSign, FiZap, FiMusic, FiTrendingUp, FiCheck, FiX, FiClock, FiAward } = FiIcons;

export default function CollaborationsPage() {
  const { state, dispatch } = useGame();
  const { player, collaborations = [] } = state;
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [collaborating, setCollaborating] = useState(false);

  const artists = [
    {
      id: 1,
      name: 'MC Flash',
      fame: 25,
      genre: 'Old School',
      cost: 2000,
      energy: 25,
      fameBoost: 15,
      qualityBonus: 2,
      requirements: { fame: 10 },
      avatar: '🎤',
      bio: 'Veteran rapper with classic flow',
      specialty: 'Storytelling'
    },
    {
      id: 2,
      name: 'Lil Phoenix',
      fame: 50,
      genre: 'Trap',
      cost: 5000,
      energy: 30,
      fameBoost: 25,
      qualityBonus: 3,
      requirements: { fame: 30 },
      avatar: '🔥',
      bio: 'Rising star in the trap scene',
      specialty: 'Melodic hooks'
    },
    {
      id: 3,
      name: 'Queen Lyric',
      fame: 75,
      genre: 'Conscious Rap',
      cost: 10000,
      energy: 35,
      fameBoost: 40,
      qualityBonus: 4,
      requirements: { fame: 50 },
      avatar: '👑',
      bio: 'Powerful female MC with deep lyrics',
      specialty: 'Social commentary'
    },
    {
      id: 4,
      name: 'DJ Thunder',
      fame: 100,
      genre: 'Producer',
      cost: 25000,
      energy: 40,
      fameBoost: 60,
      qualityBonus: 5,
      requirements: { fame: 75 },
      avatar: '🎧',
      bio: 'Grammy-winning producer',
      specialty: 'Beat production'
    },
    {
      id: 5,
      name: 'Rap Legend',
      fame: 200,
      genre: 'Hip-Hop Icon',
      cost: 100000,
      energy: 50,
      fameBoost: 150,
      qualityBonus: 7,
      requirements: { fame: 150 },
      avatar: '🏆',
      bio: 'Hall of Fame rapper',
      specialty: 'Industry connections'
    }
  ];

  const handleCollaborate = async (artist) => {
    if (player.energy < artist.energy || player.netWorth < artist.cost) return;

    setCollaborating(true);
    setSelectedArtist(artist);

    setTimeout(() => {
      const collaborationTitle = generateCollabTitle(artist);
      const baseQuality = 6 + artist.qualityBonus;
      const skillBonus = Math.floor((player.skills.lyrics + player.skills.flow + player.skills.charisma) / 30);
      const finalQuality = Math.min(10, baseQuality + skillBonus);

      const newCollaboration = {
        id: Date.now(),
        title: collaborationTitle,
        artist: artist.name,
        artistAvatar: artist.avatar,
        quality: finalQuality,
        createdAt: `${player.week}/${player.year}`,
        cost: artist.cost,
        type: 'collaboration',
        released: false
      };

      dispatch({ type: 'ADD_COLLABORATION', payload: newCollaboration });
      dispatch({
        type: 'UPDATE_PLAYER',
        payload: {
          energy: player.energy - artist.energy,
          netWorth: player.netWorth - artist.cost,
          fame: player.fame + artist.fameBoost,
          reputation: player.reputation + Math.floor(artist.fameBonus / 2)
        }
      });

      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'success',
          title: 'Collaboration Complete!',
          message: `"${collaborationTitle}" with ${artist.name} is ready! Quality: ${finalQuality}/10`,
          timestamp: new Date().toISOString()
        }
      });

      setCollaborating(false);
      setSelectedArtist(null);
    }, 3000);
  };

  const generateCollabTitle = (artist) => {
    const titles = [
      `${player.stageName} x ${artist.name}`,
      'Fire Collab',
      'Double Impact',
      'Legends Unite',
      'Power Duo',
      'Dream Team',
      'Unstoppable',
      'Elite Connection',
      'Perfect Match',
      'Dynamic Duo'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const canCollaborate = (artist) => {
    return player.fame >= artist.requirements.fame && player.energy >= artist.energy && player.netWorth >= artist.cost;
  };

  const formatPrice = (price) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(1)}K`;
    return `$${price}`;
  };

  if (collaborating && selectedArtist) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
        <motion.div
          className="text-center game-card p-8 shadow-glow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">{selectedArtist.avatar}</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Collaborating with {selectedArtist.name}
          </h2>
          <p className="text-text-muted mb-6">Creating something amazing together...</p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-3 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-24 pt-16">
      <div className="px-4 space-y-4 max-w-mobile mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-text-primary mb-2">Collaborations</h1>
          <p className="text-text-muted text-sm">Work with other artists to create hits</p>
        </div>

        {/* Player Status */}
        <div className="game-card p-4 shadow-dark">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-neon-orange animate-neon">{player.energy}/100</div>
              <div className="text-xs text-text-muted">Energy</div>
            </div>
            <div>
              <div className="text-lg font-bold text-neon-cyan animate-neon">{player.fame}</div>
              <div className="text-xs text-text-muted">Fame</div>
            </div>
            <div>
              <div className="text-lg font-bold text-neon-green animate-neon">{formatPrice(player.netWorth)}</div>
              <div className="text-xs text-text-muted">Net Worth</div>
            </div>
          </div>
        </div>

        {/* Collaboration Benefits */}
        <div className="bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 border border-neon-purple/30 p-4 rounded-game-lg text-text-primary shadow-glow">
          <h3 className="font-bold text-sm mb-2">🤝 Collaboration Benefits</h3>
          <div className="text-xs text-text-secondary space-y-1">
            <p>• Higher quality tracks than solo work</p>
            <p>• Massive fame and reputation boost</p>
            <p>• Access to new audiences</p>
            <p>• Unlock special collaboration bonuses</p>
          </div>
        </div>

        {/* Available Artists */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">Available Artists</h2>
          <div className="space-y-3">
            {artists.map((artist, index) => {
              const available = canCollaborate(artist);
              
              return (
                <motion.div
                  key={artist.id}
                  className={`game-card transition-all ${
                    available ? 'hover:shadow-glow' : 'opacity-60'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-game flex items-center justify-center text-xl shadow-glow">
                          {artist.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-text-primary text-sm">{artist.name}</h3>
                          <p className="text-neon-cyan font-medium text-xs">{artist.genre}</p>
                          <p className="text-xs text-text-muted mb-2">{artist.bio}</p>
                          <div className="flex items-center space-x-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon
                                key={i}
                                icon={FiStar}
                                className={`text-xs ${
                                  i < Math.floor(artist.fame / 20) ? 'text-neon-orange' : 'text-text-disabled'
                                }`}
                              />
                            ))}
                            <span className="text-xs text-text-muted ml-2">{artist.fame} Fame</span>
                          </div>
                          <div className="text-xs text-neon-purple">
                            Specialty: {artist.specialty}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="text-center p-2 bg-dark-surface/30 rounded-game">
                        <SafeIcon icon={FiDollarSign} className="text-neon-green mx-auto mb-1 text-sm" />
                        <div className="text-sm font-bold text-text-primary">{formatPrice(artist.cost)}</div>
                        <div className="text-xs text-text-muted">Cost</div>
                      </div>
                      <div className="text-center p-2 bg-dark-surface/30 rounded-game">
                        <SafeIcon icon={FiZap} className="text-neon-orange mx-auto mb-1 text-sm" />
                        <div className="text-sm font-bold text-text-primary">{artist.energy}</div>
                        <div className="text-xs text-text-muted">Energy</div>
                      </div>
                      <div className="text-center p-2 bg-dark-surface/30 rounded-game">
                        <SafeIcon icon={FiTrendingUp} className="text-neon-cyan mx-auto mb-1 text-sm" />
                        <div className="text-sm font-bold text-text-primary">+{artist.fameBoost}</div>
                        <div className="text-xs text-text-muted">Fame</div>
                      </div>
                      <div className="text-center p-2 bg-dark-surface/30 rounded-game">
                        <SafeIcon icon={FiAward} className="text-neon-purple mx-auto mb-1 text-sm" />
                        <div className="text-sm font-bold text-text-primary">+{artist.qualityBonus}</div>
                        <div className="text-xs text-text-muted">Quality</div>
                      </div>
                    </div>

                    {/* Requirements */}
                    {!available && (
                      <div className="mb-3 p-3 bg-neon-red/10 border border-neon-red/30 rounded-game">
                        <p className="text-xs text-neon-red font-medium">Requirements not met:</p>
                        <div className="text-xs text-neon-red mt-1">
                          {player.fame < artist.requirements.fame && (
                            <span>• Need {artist.requirements.fame} fame (you have {player.fame})</span>
                          )}
                          {player.energy < artist.energy && (
                            <span>• Need {artist.energy} energy (you have {player.energy})</span>
                          )}
                          {player.netWorth < artist.cost && (
                            <span>• Need {formatPrice(artist.cost)} (you have {formatPrice(player.netWorth)})</span>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleCollaborate(artist)}
                      disabled={!available}
                      className={`w-full py-3 px-4 rounded-game font-semibold transition-all text-sm ${
                        available
                          ? 'game-button hover-glow'
                          : 'bg-dark-surface/50 text-text-disabled cursor-not-allowed'
                      }`}
                    >
                      {available ? 'Collaborate Now' : 'Requirements Not Met'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* My Collaborations */}
        {collaborations.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-text-primary mb-3">My Collaborations</h2>
            <div className="space-y-2">
              {collaborations.map((collab) => (
                <div key={collab.id} className="game-card p-4 shadow-dark">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{collab.artistAvatar}</div>
                      <div>
                        <h4 className="font-bold text-text-primary text-sm">{collab.title}</h4>
                        <p className="text-xs text-text-muted">with {collab.artist}</p>
                        <p className="text-xs text-text-muted">Created: {collab.createdAt}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <SafeIcon
                            key={i}
                            icon={FiStar}
                            className={`text-xs ${
                              i < collab.quality ? 'text-neon-orange' : 'text-text-disabled'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-text-muted">Quality: {collab.quality}/10</div>
                    </div>
                  </div>
                  {!collab.released && (
                    <button
                      onClick={() => {
                        dispatch({
                          type: 'RELEASE_CONTENT',
                          payload: {
                            contentId: collab.id,
                            type: 'collaboration',
                            title: collab.title,
                            quality: collab.quality,
                            platform: 'Rapify'
                          }
                        });
                      }}
                      className="w-full game-button hover-glow text-sm"
                    >
                      <SafeIcon icon={FiMusic} className="inline mr-2" />
                      Release Collaboration
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}