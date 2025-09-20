// Enhanced Career System with 8 Levels and Mathematical Formulas
export const CAREER_LEVELS = [
  {
    id: 1,
    title: 'Rookie Musician',
    fameRange: [0, 10],
    reputationRange: [0, 10],
    fansGrowth: [50, 200],
    followersGrowth: [0, 100],
    streams: [100, 500],
    unlocks: ['Small gigs', 'street shows'],
    description: 'Starting your musical journey',
    emoji: '🎵',
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/20'
  },
  {
    id: 2,
    title: 'Local Performer',
    fameRange: [10, 20],
    reputationRange: [10, 20],
    fansGrowth: [200, 1000],
    followersGrowth: [100, 500],
    streams: [500, 2000],
    unlocks: ['Local concerts'],
    description: 'Building local recognition',
    emoji: '🎤',
    color: 'text-green-400',
    bgColor: 'bg-green-400/20'
  },
  {
    id: 3,
    title: 'Underground Artist',
    fameRange: [20, 30],
    reputationRange: [20, 30],
    fansGrowth: [1000, 5000],
    followersGrowth: [500, 2000],
    streams: [2000, 10000],
    unlocks: ['Mixtape release'],
    description: 'Underground scene recognition',
    emoji: '🎭',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/20'
  },
  {
    id: 4,
    title: 'Rising Star',
    fameRange: [30, 50],
    reputationRange: [30, 50],
    fansGrowth: [5000, 50000],
    followersGrowth: [2000, 20000],
    streams: [10000, 200000],
    unlocks: ['Viral singles', 'media buzz'],
    description: 'Breaking into mainstream',
    emoji: '⭐',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/20'
  },
  {
    id: 5,
    title: 'Mainstream Artist',
    fameRange: [50, 70],
    reputationRange: [40, 70],
    fansGrowth: [50000, 200000],
    followersGrowth: [20000, 100000],
    streams: [200000, 1000000],
    unlocks: ['Albums', 'TV interviews'],
    description: 'Mainstream success achieved',
    emoji: '🌟',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20'
  },
  {
    id: 6,
    title: 'Hitmaker',
    fameRange: [70, 85],
    reputationRange: [50, 80],
    fansGrowth: [200000, 1000000],
    followersGrowth: [100000, 500000],
    streams: [1000000, 10000000],
    unlocks: ['World tours', 'endorsements'],
    description: 'Creating chart-topping hits',
    emoji: '🔥',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/20'
  },
  {
    id: 7,
    title: 'Global Icon',
    fameRange: [85, 95],
    reputationRange: [70, 90],
    fansGrowth: [1000000, 5000000],
    followersGrowth: [500000, 5000000],
    streams: [10000000, 50000000],
    unlocks: ['International collabs'],
    description: 'International superstar status',
    emoji: '🌍',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/20'
  },
  {
    id: 8,
    title: 'Legend',
    fameRange: [95, 100],
    reputationRange: [90, 100],
    fansGrowth: [5000000, Infinity],
    followersGrowth: [5000000, Infinity],
    streams: [50000000, Infinity],
    unlocks: ['Legacy features', 'Hall of Fame'],
    description: 'Legendary status achieved',
    emoji: '👑',
    color: 'text-gold-400',
    bgColor: 'bg-gold-400/20'
  }
];

// Enhanced stat calculation formulas
export const StatFormulas = {
  // Fame calculation (0-100)
  calculateFameGain: (action, quality = 1, multiplier = 1) => {
    const baseGains = {
      track_release: 5,
      album_release: 10,
      collaboration: 15,
      concert: 20,
      viral_moment: 25
    };
    
    const qualityBonus = Math.floor(quality / 2); // Quality 1-10 gives 0-5 bonus
    const totalGain = (baseGains[action] || 0) + qualityBonus;
    
    return Math.floor(totalGain * multiplier);
  },

  // Fame decay for inactivity
  calculateFameDecay: (weeksInactive) => {
    if (weeksInactive >= 24) return -5; // 6 months = -5 fame
    return 0;
  },

  // Reputation calculation (0-100)
  calculateReputationGain: (action, quality = 1, consistency = 1) => {
    const baseGains = {
      consistent_releases: 5,
      high_quality_content: 10, // Quality > 7
      fan_interaction: 5,
      charity_work: 3
    };

    let gain = baseGains[action] || 0;
    
    if (action === 'high_quality_content' && quality > 7) {
      gain = 10;
    } else if (action === 'consistent_releases' && consistency > 0.8) {
      gain = 5;
    }

    return gain;
  },

  // Reputation penalty
  calculateReputationPenalty: (action, quality = 1) => {
    const penalties = {
      low_quality_content: -10, // Quality < 4
      long_inactivity: -5 // 12+ months inactive
    };

    if (action === 'low_quality_content' && quality < 4) {
      return penalties.low_quality_content;
    }

    return penalties[action] || 0;
  },

  // New Fans calculation
  calculateNewFans: (fame, reputation, bonusMultiplier = 1) => {
    const baseFans = (fame * 100) + (reputation * 50);
    return Math.floor(baseFans * bonusMultiplier);
  },

  // Concert-based fan growth
  calculateConcertFans: (venueSize, performance, currentLevel) => {
    const baseRange = [1000, 50000];
    const levelMultiplier = Math.max(0.1, currentLevel / 8);
    const performanceMultiplier = Math.max(0.3, performance / 10);
    
    const fanGain = Math.floor(
      (baseRange[0] + (venueSize * 0.1)) * levelMultiplier * performanceMultiplier
    );

    return Math.min(fanGain, baseRange[1]);
  },

  // Album-based fan growth
  calculateAlbumFans: (quality, marketing, currentFans) => {
    const baseRange = [5000, 100000];
    const qualityMultiplier = Math.max(0.2, quality / 10);
    const marketingMultiplier = Math.max(0.5, marketing / 10);
    const fanBaseMultiplier = Math.max(0.1, Math.log10(currentFans + 1) / 6);
    
    const fanGain = Math.floor(
      baseRange[0] * qualityMultiplier * marketingMultiplier * fanBaseMultiplier
    );

    return Math.min(fanGain, baseRange[1]);
  },

  // New Followers calculation (Social Media)
  calculateNewFollowers: (fame, reputation, platform = 'default') => {
    const basePlatformMultipliers = {
      rapgram: 2.0,
      riktok: 2.5,
      raptube: 1.5,
      rapify: 1.8,
      default: 2.0
    };

    const multiplier = basePlatformMultipliers[platform] || basePlatformMultipliers.default;
    const baseFollowers = (fame * 200) + (reputation * 100);
    
    return Math.floor(baseFollowers * multiplier);
  },

  // Content-based follower growth
  calculateContentFollowers: (contentType, views, engagement) => {
    const contentMultipliers = {
      single: { base: 1000, max: 10000 },
      album: { base: 10000, max: 100000 },
      concert: { base: 500, max: 50000 },
      collaboration: { base: 2000, max: 25000 }
    };

    const config = contentMultipliers[contentType] || contentMultipliers.single;
    const viewMultiplier = Math.max(0.1, Math.log10(views + 1) / 7);
    const engagementMultiplier = Math.max(0.3, engagement / 100);

    const followerGain = Math.floor(
      config.base * viewMultiplier * engagementMultiplier
    );

    return Math.min(followerGain, config.max);
  },

  // Streams/Sales calculation
  calculateStreams: (fame, reputation, fans, quality = 1) => {
    const baseStreams = (fame * 10000) + (reputation * 5000) + Math.floor(fans / 2);
    const qualityMultiplier = Math.max(0.3, quality / 10);
    
    return Math.floor(baseStreams * qualityMultiplier);
  },

  // Album sales from streams
  calculateAlbumSales: (streams) => {
    return Math.floor(streams / 10);
  },

  // Enhanced earnings calculation
  calculateEarnings: (streams, contentType, quality, marketingSpend = 0) => {
    const baseRates = {
      single: 0.003,
      album: 0.008,
      video: 0.001,
      concert: 0.05,
      merchandise: 0.15
    };

    const rate = baseRates[contentType] || baseRates.single;
    const qualityBonus = Math.max(0, (quality - 5) * 0.001); // Bonus for quality > 5
    const marketingBonus = Math.min(0.002, marketingSpend * 0.00001); // Diminishing returns

    const totalRate = rate + qualityBonus + marketingBonus;
    return streams * totalRate;
  }
};

// Career progression logic
export const CareerProgression = {
  // Get current career level
  getCurrentLevel: (fame, reputation) => {
    for (let i = CAREER_LEVELS.length - 1; i >= 0; i--) {
      const level = CAREER_LEVELS[i];
      if (fame >= level.fameRange[0] && reputation >= level.reputationRange[0]) {
        return level;
      }
    }
    return CAREER_LEVELS[0]; // Default to Rookie
  },

  // Check if player can level up
  canLevelUp: (currentLevel, fame, reputation) => {
    const nextLevelIndex = CAREER_LEVELS.findIndex(l => l.id === currentLevel.id) + 1;
    
    if (nextLevelIndex >= CAREER_LEVELS.length) return false; // Already at max level
    
    const nextLevel = CAREER_LEVELS[nextLevelIndex];
    return fame >= nextLevel.fameRange[0] && reputation >= nextLevel.reputationRange[0];
  },

  // Get next level requirements
  getNextLevelRequirements: (currentLevel) => {
    const currentIndex = CAREER_LEVELS.findIndex(l => l.id === currentLevel.id);
    
    if (currentIndex >= CAREER_LEVELS.length - 1) return null; // Already at max
    
    const nextLevel = CAREER_LEVELS[currentIndex + 1];
    return {
      level: nextLevel,
      fameRequired: nextLevel.fameRange[0],
      reputationRequired: nextLevel.reputationRange[0]
    };
  },

  // Check for level decline (performance drop)
  checkLevelDecline: (currentLevel, fame, reputation) => {
    const currentLevelData = CAREER_LEVELS.find(l => l.id === currentLevel.id);
    
    if (!currentLevelData) return false;
    
    // Check if stats dropped below current level minimum
    return fame < currentLevelData.fameRange[0] || reputation < currentLevelData.reputationRange[0];
  },

  // Get level-based multipliers
  getLevelMultipliers: (level) => {
    const multipliers = {
      1: { earnings: 1.0, fanGrowth: 1.0, opportunities: 1.0 },
      2: { earnings: 1.1, fanGrowth: 1.2, opportunities: 1.1 },
      3: { earnings: 1.3, fanGrowth: 1.5, opportunities: 1.2 },
      4: { earnings: 1.6, fanGrowth: 2.0, opportunities: 1.4 },
      5: { earnings: 2.0, fanGrowth: 3.0, opportunities: 1.7 },
      6: { earnings: 2.5, fanGrowth: 4.0, opportunities: 2.0 },
      7: { earnings: 3.2, fanGrowth: 5.5, opportunities: 2.5 },
      8: { earnings: 4.0, fanGrowth: 7.0, opportunities: 3.0 }
    };

    return multipliers[level.id] || multipliers[1];
  }
};

// Enhanced weekly progression system
export const WeeklyProgression = {
  // Process weekly stat changes
  processWeeklyUpdate: (playerStats, releases, level) => {
    const multipliers = CareerProgression.getLevelMultipliers(level);
    const updates = {
      fameChange: 0,
      reputationChange: 0,
      fanGrowth: 0,
      earnings: 0,
      socialMediaGrowth: {},
      notifications: []
    };

    // Process each release
    releases.forEach(release => {
      if (!release.views) return;

      // Calculate weekly performance
      const weeklyViews = this.calculateWeeklyViews(release, playerStats, level);
      const weeklyEarnings = StatFormulas.calculateEarnings(
        weeklyViews, 
        release.type, 
        release.quality
      );

      // Apply level multipliers
      const adjustedEarnings = weeklyEarnings * multipliers.earnings;
      const fanGrowth = StatFormulas.calculateContentFollowers(
        release.type,
        weeklyViews,
        release.engagement || 50
      ) * multipliers.fanGrowth;

      updates.earnings += adjustedEarnings;
      updates.fanGrowth += fanGrowth;

      // Check for viral moments
      if (weeklyViews > 100000) {
        updates.fameChange += StatFormulas.calculateFameGain('viral_moment', release.quality);
        updates.notifications.push({
          type: 'viral',
          message: `"${release.title}" went viral with ${weeklyViews.toLocaleString()} views!`
        });
      }

      // Update release stats
      release.weeklyViews = weeklyViews;
      release.totalViews = (release.totalViews || 0) + weeklyViews;
      release.totalEarnings = (release.totalEarnings || 0) + adjustedEarnings;
    });

    // Calculate social media growth
    updates.socialMediaGrowth = this.calculateSocialMediaGrowth(
      playerStats, 
      updates.fanGrowth, 
      level
    );

    // Check for consistency bonuses
    const recentReleases = releases.filter(r => 
      r.releaseWeek && (playerStats.week - r.releaseWeek) <= 8
    );

    if (recentReleases.length >= 2) {
      updates.reputationChange += StatFormulas.calculateReputationGain('consistent_releases');
      updates.notifications.push({
        type: 'reputation',
        message: 'Consistency bonus! Your regular releases are building your reputation.'
      });
    }

    // Check for quality bonuses
    const highQualityReleases = releases.filter(r => r.quality >= 8);
    if (highQualityReleases.length > 0) {
      updates.reputationChange += StatFormulas.calculateReputationGain('high_quality_content', 9);
    }

    return updates;
  },

  // Calculate weekly views for a release
  calculateWeeklyViews: (release, playerStats, level) => {
    const baseViews = 1000;
    const ageWeeks = playerStats.week - (release.releaseWeek || 0);
    
    // Age decay (content gets less views over time)
    const ageDecay = Math.max(0.1, 1 - (ageWeeks * 0.08));
    
    // Quality multiplier
    const qualityMultiplier = Math.max(0.3, release.quality / 10);
    
    // Level multiplier
    const levelMultiplier = CareerProgression.getLevelMultipliers(level).fanGrowth;
    
    // Fame and reputation influence
    const fameMultiplier = Math.max(0.2, playerStats.fame / 100);
    const reputationMultiplier = Math.max(0.2, playerStats.reputation / 100);
    
    // Random factor for organic growth
    const randomFactor = 0.7 + (Math.random() * 0.6); // 0.7 to 1.3
    
    const weeklyViews = Math.floor(
      baseViews * 
      ageDecay * 
      qualityMultiplier * 
      levelMultiplier * 
      fameMultiplier * 
      reputationMultiplier * 
      randomFactor
    );

    return Math.max(100, weeklyViews); // Minimum 100 views
  },

  // Calculate social media growth
  calculateSocialMediaGrowth: (playerStats, weeklyFanGrowth, level) => {
    const baseGrowthRate = 0.1; // 10% of fan growth becomes followers
    const levelMultiplier = CareerProgression.getLevelMultipliers(level).fanGrowth;
    
    return {
      rapgram: Math.floor(weeklyFanGrowth * baseGrowthRate * 0.8 * levelMultiplier),
      riktok: Math.floor(weeklyFanGrowth * baseGrowthRate * 1.2 * levelMultiplier),
      raptube: Math.floor(weeklyFanGrowth * baseGrowthRate * 0.6 * levelMultiplier),
      rapify: Math.floor(weeklyFanGrowth * baseGrowthRate * 0.9 * levelMultiplier)
    };
  }
};

// Opportunity system based on career level
export const OpportunitySystem = {
  // Get available opportunities based on level
  getAvailableOpportunities: (level, playerStats) => {
    const opportunities = [];

    // Level-based opportunities
    switch (level.id) {
      case 1: // Rookie
        opportunities.push(
          { type: 'small_gig', name: 'Coffee Shop Performance', reward: 'Small fame boost' },
          { type: 'street_show', name: 'Street Corner Performance', reward: 'Fan growth' }
        );
        break;
      
      case 2: // Local Performer
        opportunities.push(
          { type: 'local_concert', name: 'Local Venue Concert', reward: 'Moderate fame & earnings' },
          { type: 'radio_interview', name: 'Local Radio Interview', reward: 'Reputation boost' }
        );
        break;

      case 3: // Underground Artist
        opportunities.push(
          { type: 'mixtape_deal', name: 'Mixtape Distribution Deal', reward: 'Wider audience reach' },
          { type: 'underground_festival', name: 'Underground Music Festival', reward: 'Industry connections' }
        );
        break;

      case 4: // Rising Star
        opportunities.push(
          { type: 'viral_campaign', name: 'Social Media Campaign', reward: 'Viral potential boost' },
          { type: 'music_blog', name: 'Music Blog Feature', reward: 'Media buzz' }
        );
        break;

      case 5: // Mainstream Artist
        opportunities.push(
          { type: 'album_deal', name: 'Major Label Album Deal', reward: 'Massive distribution' },
          { type: 'tv_interview', name: 'TV Talk Show Interview', reward: 'Mainstream exposure' }
        );
        break;

      case 6: // Hitmaker
        opportunities.push(
          { type: 'world_tour', name: 'International World Tour', reward: 'Global fanbase' },
          { type: 'brand_endorsement', name: 'Major Brand Endorsement', reward: 'Huge earnings' }
        );
        break;

      case 7: // Global Icon
        opportunities.push(
          { type: 'international_collab', name: 'Cross-Cultural Collaboration', reward: 'Legendary status progress' },
          { type: 'charity_concert', name: 'Global Charity Concert', reward: 'Reputation & legacy' }
        );
        break;

      case 8: // Legend
        opportunities.push(
          { type: 'hall_of_fame', name: 'Hall of Fame Induction', reward: 'Immortal legacy' },
          { type: 'mentor_program', name: 'Artist Mentorship Program', reward: 'Industry influence' }
        );
        break;
    }

    return opportunities;
  }
};

export default {
  CAREER_LEVELS,
  StatFormulas,
  CareerProgression,
  WeeklyProgression,
  OpportunitySystem
};