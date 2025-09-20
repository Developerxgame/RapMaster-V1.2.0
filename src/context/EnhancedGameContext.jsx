import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { StatFormulas, CareerProgression, WeeklyProgression } from '../utils/careerSystem';

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
    inventory: [],
    careerLevel: 1,
    levelProgress: 0,
    weeklyStats: {
      fameGain: 0,
      reputationGain: 0,
      fanGrowth: 0,
      earningsGain: 0
    }
  },
  tracks: [],
  albums: [],
  musicVideos: [],
  concerts: [],
  collaborations: [],
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

function enhancedGameReducer(state, action) {
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
      return { ...initialState };

    case 'UPDATE_PLAYER':
      const updatedPlayer = { ...state.player, ...action.payload };
      
      // Update career level based on new stats
      const currentLevel = CareerProgression.getCurrentLevel(
        updatedPlayer.fame, 
        updatedPlayer.reputation
      );
      updatedPlayer.careerLevel = currentLevel.id;

      // Calculate progress to next level
      const nextLevelReq = CareerProgression.getNextLevelRequirements(currentLevel);
      if (nextLevelReq) {
        const fameProgress = (updatedPlayer.fame / nextLevelReq.fameRequired) * 100;
        const repProgress = (updatedPlayer.reputation / nextLevelReq.reputationRequired) * 100;
        updatedPlayer.levelProgress = Math.min(fameProgress, repProgress);
      } else {
        updatedPlayer.levelProgress = 100; // Max level
      }

      const newState = {
        ...state,
        player: updatedPlayer
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

    case 'ADD_COLLABORATION':
      return {
        ...state,
        collaborations: [...state.collaborations, action.payload]
      };

    case 'ADD_CONCERT':
      // Enhanced concert system with level-based multipliers
      const currentConcertLevel = CareerProgression.getCurrentLevel(state.player.fame, state.player.reputation);
      const concertMultipliers = CareerProgression.getLevelMultipliers(currentConcertLevel);
      
      const enhancedConcert = {
        ...action.payload,
        earnings: Math.floor(action.payload.earnings * concertMultipliers.earnings),
        fanGrowth: Math.floor((action.payload.attendance || 0) * 0.1 * concertMultipliers.fanGrowth)
      };

      return {
        ...state,
        concerts: [...state.concerts, enhancedConcert],
        player: {
          ...state.player,
          fans: state.player.fans + enhancedConcert.fanGrowth,
          fame: state.player.fame + StatFormulas.calculateFameGain('concert', enhancedConcert.performanceQuality || 5)
        },
        earnings: {
          ...state.earnings,
          concerts: state.earnings.concerts + enhancedConcert.earnings,
          total: state.earnings.total + enhancedConcert.earnings
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
      // Enhanced social media system
      const currentSocialLevel = CareerProgression.getCurrentLevel(state.player.fame, state.player.reputation);
      const socialMultipliers = CareerProgression.getLevelMultipliers(currentSocialLevel);
      
      const enhancedEngagement = Math.floor(action.payload.likes * socialMultipliers.fanGrowth);
      const followerGrowth = StatFormulas.calculateContentFollowers(
        'social_post',
        enhancedEngagement,
        50
      );

      return {
        ...state,
        socialPosts: [...state.socialPosts, action.payload],
        player: {
          ...state.player,
          fans: state.player.fans + Math.floor(followerGrowth * 0.1),
          fame: state.player.fame + Math.floor(enhancedEngagement / 1000),
          socialMedia: {
            ...state.player.socialMedia,
            [action.payload.platform]: {
              ...state.player.socialMedia[action.payload.platform],
              posts: (state.player.socialMedia[action.payload.platform].posts || 0) + 1,
              followers: (state.player.socialMedia[action.payload.platform].followers || 0) + followerGrowth
            }
          }
        }
      };

    case 'RELEASE_CONTENT':
      // Enhanced release system with new formulas
      const { contentId, type, title, quality, platform } = action.payload;
      const currentReleaseLevel = CareerProgression.getCurrentLevel(state.player.fame, state.player.reputation);
      const releaseMultipliers = CareerProgression.getLevelMultipliers(currentReleaseLevel);

      // Calculate enhanced initial metrics using new formulas
      const baseStreams = StatFormulas.calculateStreams(
        state.player.fame,
        state.player.reputation,
        state.player.fans,
        quality
      );

      const levelAdjustedStreams = Math.floor(baseStreams * releaseMultipliers.fanGrowth);
      const initialEarnings = StatFormulas.calculateEarnings(levelAdjustedStreams, type, quality);
      const fanGrowth = StatFormulas.calculateNewFans(
        state.player.fame,
        state.player.reputation,
        releaseMultipliers.fanGrowth
      );

      // Enhanced release object
      const enhancedRelease = {
        ...action.payload,
        id: Date.now(),
        releaseDate: `${state.player.week}/${state.player.year}`,
        releaseWeek: state.player.week,
        views: levelAdjustedStreams,
        streams: type !== 'video' ? Math.floor(levelAdjustedStreams * 1.2) : 0,
        earnings: initialEarnings,
        fanGrowth: fanGrowth,
        trending: levelAdjustedStreams > 50000,
        isViral: levelAdjustedStreams > 100000,
        chartPosition: levelAdjustedStreams > 200000 ? Math.floor(Math.random() * 20) + 1 : null,
        weeklyViews: levelAdjustedStreams,
        peakWeeklyViews: levelAdjustedStreams,
        ageMultiplier: 1.0,
        qualityScore: quality,
        levelAtRelease: currentReleaseLevel.id
      };

      return {
        ...state,
        releases: [...state.releases, enhancedRelease],
        tracks: state.tracks.map(track =>
          track.id === contentId
            ? { ...track, released: true, releaseId: enhancedRelease.id }
            : track
        ),
        albums: state.albums.map(album =>
          album.id === contentId
            ? { ...album, released: true, releaseId: enhancedRelease.id }
            : album
        ),
        musicVideos: state.musicVideos.map(video =>
          video.id === contentId
            ? { ...video, released: true, releaseId: enhancedRelease.id }
            : video
        ),
        player: {
          ...state.player,
          netWorth: state.player.netWorth + initialEarnings,
          fans: state.player.fans + Math.floor(fanGrowth * 0.1),
          fame: state.player.fame + StatFormulas.calculateFameGain('track_release', quality),
          reputation: state.player.reputation + (quality >= 7 ? StatFormulas.calculateReputationGain('high_quality_content', quality) : 0)
        },
        earnings: {
          ...state.earnings,
          total: state.earnings.total + initialEarnings,
          thisWeek: state.earnings.thisWeek + initialEarnings,
          [type === 'video' ? 'youtube' : 'streaming']: state.earnings[type === 'video' ? 'youtube' : 'streaming'] + initialEarnings
        }
      };

    case 'ANNOUNCE_RELEASE':
      // Enhanced announcement system
      const { releaseId } = action.payload;
      const announcementLevel = CareerProgression.getCurrentLevel(state.player.fame, state.player.reputation);
      const announcementMultipliers = CareerProgression.getLevelMultipliers(announcementLevel);

      const release = state.releases.find(r => r.id === releaseId);
      if (!release) return state;

      const baseReach = StatFormulas.calculateNewFollowers(
        state.player.fame,
        state.player.reputation,
        'rapgram'
      );
      const announcementViews = Math.floor(baseReach * announcementMultipliers.fanGrowth);
      const announcementEarnings = StatFormulas.calculateEarnings(announcementViews, 'social_media', 5);

      return {
        ...state,
        releases: state.releases.map(rel =>
          rel.id === releaseId
            ? {
                ...rel,
                announced: true,
                views: rel.views + announcementViews,
                earnings: rel.earnings + announcementEarnings,
                weeklyViews: rel.weeklyViews + announcementViews
              }
            : rel
        ),
        player: {
          ...state.player,
          netWorth: state.player.netWorth + announcementEarnings,
          fans: state.player.fans + Math.floor(announcementViews / 200),
          fame: state.player.fame + Math.floor(announcementViews / 1000)
        }
      };

    case 'ADVANCE_WEEK':
      // Enhanced weekly progression using new system
      const newWeek = state.player.week + 1;
      const newYear = newWeek > 52 ? state.player.year + 1 : state.player.year;
      const resetWeek = newWeek > 52 ? 1 : newWeek;
      const newAge = newYear - 2020 + 20;

      const weekLevel = CareerProgression.getCurrentLevel(state.player.fame, state.player.reputation);
      const weeklyUpdates = WeeklyProgression.processWeeklyUpdate(
        state.player,
        state.releases,
        weekLevel
      );

      // Enhanced social media growth using new formulas
      const socialGrowth = weeklyUpdates.socialMediaGrowth;
      const newSocialMedia = {
        rapgram: {
          ...state.player.socialMedia.rapgram,
          followers: state.player.socialMedia.rapgram.followers + socialGrowth.rapgram
        },
        raptube: {
          ...state.player.socialMedia.raptube,
          subscribers: state.player.socialMedia.raptube.subscribers + socialGrowth.raptube,
          totalViews: state.player.socialMedia.raptube.totalViews + weeklyUpdates.earnings
        },
        rapify: {
          ...state.player.socialMedia.rapify,
          listeners: state.player.socialMedia.rapify.listeners + socialGrowth.rapify,
          streams: state.player.socialMedia.rapify.streams + Math.floor(weeklyUpdates.earnings * 1.5)
        },
        riktok: {
          ...state.player.socialMedia.riktok,
          followers: state.player.socialMedia.riktok.followers + socialGrowth.riktok
        }
      };

      const enhancedWeeklyState = {
        ...state,
        player: {
          ...state.player,
          week: resetWeek,
          year: newYear,
          age: newAge,
          energy: 100, // Refill energy
          netWorth: Math.max(0, state.player.netWorth + weeklyUpdates.earnings),
          fans: state.player.fans + weeklyUpdates.fanGrowth,
          fame: Math.min(100, Math.max(0, state.player.fame + weeklyUpdates.fameChange)),
          reputation: Math.min(100, Math.max(0, state.player.reputation + weeklyUpdates.reputationChange)),
          socialMedia: newSocialMedia,
          weeklyStats: {
            fameGain: weeklyUpdates.fameChange,
            reputationGain: weeklyUpdates.reputationChange,
            fanGrowth: weeklyUpdates.fanGrowth,
            earningsGain: weeklyUpdates.earnings
          }
        },
        earnings: {
          ...state.earnings,
          total: state.earnings.total + weeklyUpdates.earnings,
          thisWeek: weeklyUpdates.earnings,
          streaming: state.earnings.streaming + weeklyUpdates.earnings * 0.6,
          youtube: state.earnings.youtube + weeklyUpdates.earnings * 0.4
        },
        notifications: [
          ...weeklyUpdates.notifications.map(notif => ({
            id: Date.now() + Math.random(),
            type: notif.type || 'info',
            title: notif.type === 'viral' ? 'Viral Hit! 🔥' : 
                   notif.type === 'reputation' ? 'Reputation Boost! 📈' : 
                   'Weekly Update',
            message: notif.message,
            timestamp: new Date().toISOString()
          })),
          ...(weeklyUpdates.earnings > 500 ? [{
            id: Date.now(),
            type: 'earnings',
            title: 'Weekly Earnings',
            message: `You earned $${Math.floor(weeklyUpdates.earnings)} this week!`,
            timestamp: new Date().toISOString()
          }] : []),
          ...state.notifications.slice(0, 6)
        ]
      };

      // Auto-save
      if (enhancedWeeklyState.slot) {
        localStorage.setItem(`rapCareer_slot_${enhancedWeeklyState.slot}`, JSON.stringify(enhancedWeeklyState));
      }

      return enhancedWeeklyState;

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

    case 'UPGRADE_SKILL':
      // Enhanced skill system with level bonuses
      const skillCosts = {
        1: 2, 2: 2, 3: 4, 4: 4, 5: 6, 6: 6, 7: 8, 8: 8, 9: 12, 10: 16
      };
      
      const currentSkillLevel = Math.floor(state.player.skills[action.payload.skill] / 10);
      const cost = skillCosts[currentSkillLevel + 1] || 20;

      if (state.player.energy < cost) return state;

      const updatedSkills = {
        ...state.player.skills,
        [action.payload.skill]: Math.min(100, state.player.skills[action.payload.skill] + 1)
      };

      return {
        ...state,
        player: {
          ...state.player,
          energy: state.player.energy - cost,
          skills: updatedSkills
        }
      };

    default:
      return state;
  }
}

export function EnhancedGameProvider({ children }) {
  const [state, dispatch] = useReducer(enhancedGameReducer, initialState);

  // Auto-save effect
  useEffect(() => {
    if (!state.gameStarted || !state.slot) return;

    const interval = setInterval(() => {
      const currentState = {
        ...state,
        lastPlayed: new Date().toISOString()
      };
      localStorage.setItem(`rapCareer_slot_${state.slot}`, JSON.stringify(currentState));
    }, 30000); // Auto-save every 30 seconds

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
    throw new Error('useGame must be used within an EnhancedGameProvider');
  }
  return context;
}