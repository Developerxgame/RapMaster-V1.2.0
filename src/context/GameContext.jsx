import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

const initialState = {
  player: {
    stageName: '',
    avatar: 1,
    city: 'Los Angeles',
    age: 20,
    year: 2020,
    week: 1,
    fame: 0,
    reputation: 0,
    fans: 0,
    netWorth: 100,
    energy: 100,
    skills: {
      lyrics: 1,
      flow: 1,
      charisma: 1,
      business: 1,
      production: 1
    },
    socialMedia: {
      rapgram: { followers: 0, posts: 0 },
      raptube: { subscribers: 0, videos: 0, totalViews: 0 },
      rapify: { listeners: 0, streams: 0 },
      riktok: { followers: 0, videos: 0 }
    },
    achievements: [],
    inventory: []
  },
  tracks: [],
  albums: [],
  musicVideos: [],
  concerts: [],
  socialPosts: [],
  releases: [],
  earnings: {
    total: 0,
    thisWeek: 0,
    streaming: 0,
    youtube: 0,
    concerts: 0,
    merchandise: 0
  },
  gameStarted: false,
  currentPage: 'home',
  notifications: [],
  slot: null
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'CREATE_CHARACTER':
      return {
        ...state,
        player: {
          ...state.player,
          ...action.payload
        },
        gameStarted: true
      };

    case 'LOAD_GAME_STATE':
      return {
        ...action.payload,
        lastPlayed: new Date().toISOString()
      };

    case 'RESET_GAME':
      return {
        ...initialState
      };

    case 'UPDATE_PLAYER':
      const newState = {
        ...state,
        player: {
          ...state.player,
          ...action.payload
        }
      };
      // Auto-save when player data changes
      if (newState.slot) {
        localStorage.setItem(`rapCareer_slot_${newState.slot}`, JSON.stringify(newState));
      }
      return newState;

    case 'ADD_TRACK':
      return {
        ...state,
        tracks: [...state.tracks, action.payload]
      };

    case 'ADD_ALBUM':
      return {
        ...state,
        albums: [...state.albums, action.payload]
      };

    case 'ADD_MUSIC_VIDEO':
      return {
        ...state,
        musicVideos: [...state.musicVideos, action.payload]
      };

    case 'ADD_CONCERT':
      return {
        ...state,
        concerts: [...state.concerts, action.payload],
        earnings: {
          ...state.earnings,
          concerts: state.earnings.concerts + action.payload.earnings
        }
      };

    case 'MARK_TRACKS_IN_ALBUM':
      return {
        ...state,
        tracks: state.tracks.map(track =>
          action.payload.trackIds.includes(track.id)
            ? { ...track, inAlbum: true }
            : track
        )
      };

    case 'MARK_TRACK_HAS_VIDEO':
      return {
        ...state,
        tracks: state.tracks.map(track =>
          track.id === action.payload.trackId
            ? { ...track, hasVideo: true }
            : track
        )
      };

    case 'ADD_SOCIAL_POST':
      const engagementBonus = Math.floor(action.payload.likes / 100);
      return {
        ...state,
        socialPosts: [...state.socialPosts, action.payload],
        player: {
          ...state.player,
          fans: state.player.fans + engagementBonus,
          fame: state.player.fame + Math.floor(engagementBonus / 10),
          socialMedia: {
            ...state.player.socialMedia,
            [action.payload.platform]: {
              ...state.player.socialMedia[action.payload.platform],
              posts: state.player.socialMedia[action.payload.platform].posts + 1,
              followers: state.player.socialMedia[action.payload.platform].followers + engagementBonus
            }
          }
        }
      };

    case 'RELEASE_CONTENT':
      // Enhanced release system with initial views based on quality and fame
      const { contentId, type, title, quality, platform } = action.payload;
      
      // Calculate initial views boost based on player stats
      const fameBoost = Math.floor(state.player.fame * 2);
      const fanBoost = Math.floor(state.player.fans * 0.1);
      const socialBoost = type === 'video' 
        ? Math.floor(state.player.socialMedia.raptube.subscribers * 0.05)
        : Math.floor(state.player.socialMedia.rapify.listeners * 0.03);
      
      // Quality multiplier for initial views
      const qualityMultiplier = Math.max(0.5, quality / 10);
      
      // Base initial views
      const baseInitialViews = type === 'video' ? 500 : 
                              type === 'album' ? 300 : 200;
      
      // Calculate total initial views
      const initialViews = Math.floor(
        (baseInitialViews + fameBoost + fanBoost + socialBoost) * qualityMultiplier
      );
      
      // Calculate initial earnings
      const viewValue = type === 'video' ? 0.08 : 
                       type === 'album' ? 0.20 : 0.15;
      const initialEarnings = initialViews * viewValue;

      const newRelease = {
        ...action.payload,
        id: Date.now(),
        releaseDate: `${state.player.week}/${state.player.year}`,
        views: initialViews,
        streams: type !== 'video' ? Math.floor(initialViews * 1.2) : 0,
        earnings: initialEarnings,
        trending: false,
        peakPosition: null,
        announced: false,
        platforms: type === 'video' ? ['raptube'] : ['rapify'],
        // Enhanced tracking
        dailyViews: initialViews,
        weeklyViews: initialViews,
        monthlyViews: initialViews,
        viewsHistory: [{ week: state.player.week, views: initialViews }],
        peakWeeklyViews: initialViews,
        chartPosition: null,
        isViral: initialViews > 10000,
        releaseWeek: state.player.week,
        ageMultiplier: 1.0
      };
      
      return {
        ...state,
        releases: [...state.releases, newRelease],
        tracks: state.tracks.map(track => 
          track.id === contentId 
            ? { ...track, released: true, releaseId: newRelease.id }
            : track
        ),
        albums: state.albums.map(album => 
          album.id === contentId 
            ? { ...album, released: true, releaseId: newRelease.id }
            : album
        ),
        musicVideos: state.musicVideos.map(video => 
          video.id === contentId 
            ? { ...video, released: true, releaseId: newRelease.id }
            : video
        ),
        player: {
          ...state.player,
          netWorth: state.player.netWorth + initialEarnings,
          fame: state.player.fame + Math.floor(initialViews / 500),
          socialMedia: {
            ...state.player.socialMedia,
            [type === 'video' ? 'raptube' : 'rapify']: {
              ...state.player.socialMedia[type === 'video' ? 'raptube' : 'rapify'],
              [type === 'video' ? 'totalViews' : 'streams']: 
                state.player.socialMedia[type === 'video' ? 'raptube' : 'rapify'][type === 'video' ? 'totalViews' : 'streams'] + initialViews
            }
          }
        },
        earnings: {
          ...state.earnings,
          total: state.earnings.total + initialEarnings,
          thisWeek: state.earnings.thisWeek + initialEarnings,
          [type === 'video' ? 'youtube' : 'streaming']: 
            state.earnings[type === 'video' ? 'youtube' : 'streaming'] + initialEarnings
        }
      };

    case 'ANNOUNCE_RELEASE':
      const { releaseId } = action.payload;
      
      const baseReach = Math.floor(state.player.fans * 0.4 + state.player.socialMedia.rapgram.followers * 0.3);
      const announcementViews = Math.floor(baseReach * (0.5 + Math.random() * 0.8));
      const announcementEarnings = announcementViews * 0.12;
      
      const release = state.releases.find(r => r.id === releaseId);
      const announcementPost = {
        id: Date.now(),
        platform: 'rapgram',
        content: `🔥 NEW RELEASE ALERT! 🔥\n\n"${release.title}" is now live on ${release.type === 'video' ? 'RapTube' : 'Rapify'}! Go check it out and let me know what you think! 🎵\n\n#NewMusic #${release.type === 'video' ? 'MusicVideo' : 'NewTrack'} #RapLife`,
        likes: Math.floor(announcementViews * 0.15),
        comments: Math.floor(announcementViews * 0.05),
        shares: Math.floor(announcementViews * 0.03),
        createdAt: `${state.player.week}/${state.player.year}`,
        contentId: release.id,
        isViral: announcementViews > 10000,
        isAnnouncement: true
      };

      const rikTokPost = {
        ...announcementPost,
        id: Date.now() + 1,
        platform: 'riktok'
      };
      
      return {
        ...state,
        releases: state.releases.map(rel =>
          rel.id === releaseId
            ? {
                ...rel,
                announced: true,
                views: rel.views + announcementViews,
                earnings: rel.earnings + announcementEarnings,
                weeklyViews: rel.weeklyViews + announcementViews,
                dailyViews: rel.dailyViews + Math.floor(announcementViews * 0.3),
                peakWeeklyViews: Math.max(rel.peakWeeklyViews, rel.weeklyViews + announcementViews)
              }
            : rel
        ),
        socialPosts: [...state.socialPosts, announcementPost, rikTokPost],
        player: {
          ...state.player,
          netWorth: state.player.netWorth + announcementEarnings,
          fans: state.player.fans + Math.floor(announcementViews / 150),
          fame: state.player.fame + Math.floor(announcementViews / 800),
          socialMedia: {
            ...state.player.socialMedia,
            rapgram: {
              ...state.player.socialMedia.rapgram,
              posts: state.player.socialMedia.rapgram.posts + 1,
              followers: state.player.socialMedia.rapgram.followers + Math.floor(announcementViews / 200)
            },
            riktok: {
              ...state.player.socialMedia.riktok,
              posts: (state.player.socialMedia.riktok.posts || 0) + 1,
              followers: state.player.socialMedia.riktok.followers + Math.floor(announcementViews / 200)
            }
          }
        },
        earnings: {
          ...state.earnings,
          total: state.earnings.total + announcementEarnings,
          thisWeek: state.earnings.thisWeek + announcementEarnings
        }
      };

    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications.slice(0, 9)]
      };

    case 'ADVANCE_WEEK':
      const newWeek = state.player.week + 1;
      const newYear = newWeek > 52 ? state.player.year + 1 : state.player.year;
      const resetWeek = newWeek > 52 ? 1 : newWeek;
      const newAge = newYear - 2020 + 20;

      // Enhanced fan-based social media growth
      const fanGrowthMultiplier = Math.max(1, state.player.fans / 1000);
      const viewsMultiplier = state.releases.reduce((sum, release) => sum + release.views, 0) / 10000;

      // Enhanced views system with realistic decay and viral potential
      let weeklyEarnings = 0;
      let weeklyViews = 0;
      const updatedReleasesWeek = state.releases.map(release => {
        if (release.views === 0) return release;
        
        // Age factor - content gets less views over time
        const weeksOld = state.player.week - (release.releaseWeek || 0);
        const ageDecay = Math.max(0.1, 1 - (weeksOld * 0.05)); // 5% decay per week
        
        // Base views calculation with multiple factors
        const baseViews = Math.floor(Math.random() * 2000) + 500;
        const qualityMultiplier = Math.max(0.3, release.quality / 10);
        const fameMultiplier = Math.max(0.2, state.player.fame / 200);
        const fanMultiplier = Math.max(0.1, state.player.fans / 3000);
        
        // Viral potential based on current performance
        const viralChance = release.peakWeeklyViews > 50000 ? 0.15 : 0.05;
        const isViralWeek = Math.random() < viralChance;
        const viralMultiplier = isViralWeek ? (2 + Math.random() * 3) : 1;
        
        // Platform-specific multipliers
        const platformMultiplier = release.type === 'video' ? 1.2 : 
                                 release.type === 'album' ? 1.5 : 1.0;
        
        // Calculate final weekly views
        const weeklyViewGain = Math.floor(
          baseViews * 
          qualityMultiplier * 
          fameMultiplier * 
          fanMultiplier * 
          ageDecay * 
          viralMultiplier * 
          platformMultiplier
        );
        
        // Earnings calculation with platform-specific rates
        const viewValue = release.type === 'video' ? 0.08 : 
                         release.type === 'album' ? 0.20 : 0.15;
        const earnings = weeklyViewGain * viewValue;
        
        weeklyEarnings += earnings;
        weeklyViews += weeklyViewGain;
        
        // Update view statistics
        const newTotalViews = release.views + weeklyViewGain;
        const newWeeklyViews = weeklyViewGain;
        const newPeakWeekly = Math.max(release.peakWeeklyViews, newWeeklyViews);
        
        // Chart position calculation
        let chartPosition = release.chartPosition;
        if (newTotalViews > 1000000 && !chartPosition) {
          chartPosition = Math.floor(Math.random() * 20) + 1; // Top 20
        } else if (newTotalViews > 500000 && (!chartPosition || chartPosition > 50)) {
          chartPosition = Math.floor(Math.random() * 50) + 1; // Top 50
        }
        
        // Trending status
        const trending = newWeeklyViews > 25000 && newWeeklyViews < 100000;
        const isViral = newTotalViews > 1000000 || newWeeklyViews > 100000;
        
        return {
          ...release,
          views: newTotalViews,
          earnings: release.earnings + earnings,
          weeklyViews: newWeeklyViews,
          peakWeeklyViews: newPeakWeekly,
          dailyViews: Math.floor(newWeeklyViews / 7),
          monthlyViews: release.monthlyViews ? release.monthlyViews + newWeeklyViews : newWeeklyViews,
          viewsHistory: [
            ...(release.viewsHistory || []),
            { week: state.player.week, views: newWeeklyViews, total: newTotalViews }
          ].slice(-12), // Keep last 12 weeks
          trending: trending,
          isViral: isViral,
          chartPosition: chartPosition,
          ageMultiplier: ageDecay,
          releaseWeek: release.releaseWeek || state.player.week,
          // Performance metrics
          avgWeeklyViews: release.viewsHistory ? 
            release.viewsHistory.reduce((sum, h) => sum + h.views, 0) / release.viewsHistory.length : 
            newWeeklyViews,
          growthRate: release.weeklyViews ? 
            ((newWeeklyViews - release.weeklyViews) / release.weeklyViews * 100) : 0
        };
      });

      // Enhanced social media growth based on fans and content performance
      const totalReleaseViews = updatedReleasesWeek.reduce((sum, release) => sum + (release.weeklyViews || 0), 0);
      
      const newSocialMedia = {
        ...state.player.socialMedia,
        rapgram: {
          ...state.player.socialMedia.rapgram,
          followers: Math.floor(state.player.socialMedia.rapgram.followers + 
            (state.player.fans * 0.6) + (fanGrowthMultiplier * 50) + (totalReleaseViews * 0.01))
        },
        raptube: {
          ...state.player.socialMedia.raptube,
          subscribers: Math.floor(state.player.socialMedia.raptube.subscribers + 
            (state.player.fans * 0.4) + (viewsMultiplier * 20)),
          totalViews: state.player.socialMedia.raptube.totalViews + weeklyViews,
          videos: state.musicVideos.filter(v => v.released).length
        },
        rapify: {
          ...state.player.socialMedia.rapify,
          listeners: Math.floor(state.player.socialMedia.rapify.listeners + 
            (state.player.fans * 0.8) + (fanGrowthMultiplier * 100)),
          streams: state.player.socialMedia.rapify.streams + Math.floor(weeklyViews * 1.2)
        },
        riktok: {
          ...state.player.socialMedia.riktok,
          followers: Math.floor(state.player.socialMedia.riktok.followers + 
            (state.player.fans * 0.7) + (fanGrowthMultiplier * 80))
        }
      };

      // Check for milestones and achievements
      const milestoneNotifications = [];
      const viralReleases = updatedReleasesWeek.filter(r => r.isViral && !r.viralNotified);
      const chartHits = updatedReleasesWeek.filter(r => r.chartPosition && r.chartPosition <= 10 && !r.chartNotified);
      
      if (viralReleases.length > 0) {
        viralReleases.forEach(release => {
          milestoneNotifications.push({
            id: Date.now() + Math.random(),
            type: 'success',
            title: 'VIRAL HIT! 🔥',
            message: `"${release.title}" has gone viral with ${release.views.toLocaleString()} views!`,
            timestamp: new Date().toISOString()
          });
          release.viralNotified = true;
        });
      }
      
      if (chartHits.length > 0) {
        chartHits.forEach(release => {
          milestoneNotifications.push({
            id: Date.now() + Math.random(),
            type: 'success',
            title: `CHART SUCCESS! 📈`,
            message: `"${release.title}" hit #${release.chartPosition} on the charts!`,
            timestamp: new Date().toISOString()
          });
          release.chartNotified = true;
        });
      }

      const newStateWeek = {
        ...state,
        player: {
          ...state.player,
          week: resetWeek,
          year: newYear,
          age: newAge,
          energy: 100,
          netWorth: Math.max(0, state.player.netWorth + weeklyEarnings),
          socialMedia: newSocialMedia
        },
        releases: updatedReleasesWeek,
        earnings: {
          ...state.earnings,
          total: state.earnings.total + weeklyEarnings,
          thisWeek: weeklyEarnings,
          streaming: state.earnings.streaming + weeklyEarnings * 0.6,
          youtube: state.earnings.youtube + weeklyEarnings * 0.4
        },
        notifications: [
          ...(weeklyEarnings > 100 ? [{
            id: Date.now(),
            type: 'earnings',
            title: 'Weekly Earnings',
            message: `You earned $${Math.floor(weeklyEarnings)} this week from ${weeklyViews.toLocaleString()} views!`,
            timestamp: new Date().toISOString()
          }] : []),
          ...milestoneNotifications,
          ...(fanGrowthMultiplier > 2 ? [{
            id: Date.now() + 2,
            type: 'success',
            title: 'Social Media Boom!',
            message: `Your ${state.player.fans.toLocaleString()} fans are driving massive social media growth!`,
            timestamp: new Date().toISOString()
          }] : []),
          ...state.notifications.slice(0, 6)
        ]
      };

      if (newStateWeek.slot) {
        localStorage.setItem(`rapCareer_slot_${newStateWeek.slot}`, JSON.stringify(newStateWeek));
      }

      return newStateWeek;

    case 'PURCHASE_ITEM':
      return {
        ...state,
        player: {
          ...state.player,
          netWorth: state.player.netWorth - action.payload.price,
          fame: state.player.fame + action.payload.fame,
          reputation: state.player.reputation + action.payload.reputation,
          inventory: [...state.player.inventory, action.payload]
        }
      };

    case 'UPGRADE_SKILL':
      // Calculate escalating energy cost
      const getUpgradeCost = (currentLevel) => {
        if (currentLevel < 25) return 2;
        if (currentLevel < 50) return 4;
        if (currentLevel < 75) return 6;
        if (currentLevel < 90) return 8;
        if (currentLevel < 95) return 12;
        if (currentLevel < 98) return 16;
        if (currentLevel < 99) return 25;
        return 100;
      };

      const cost = getUpgradeCost(state.player.skills[action.payload.skill]);
      return {
        ...state,
        player: {
          ...state.player,
          energy: state.player.energy - cost,
          skills: {
            ...state.player.skills,
            [action.payload.skill]: state.player.skills[action.payload.skill] + 1
          }
        }
      };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (!state.gameStarted || !state.slot) return;

    const interval = setInterval(() => {
      const currentState = { ...state, lastPlayed: new Date().toISOString() };
      localStorage.setItem(`rapCareer_slot_${state.slot}`, JSON.stringify(currentState));
    }, 30000);

    return () => clearInterval(interval);
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}