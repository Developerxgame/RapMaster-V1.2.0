import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiZap, FiTrendingUp, FiBook, FiMic, FiHeart, FiBriefcase, FiMusic } = FiIcons;

export default function SkillsPage() {
  const { state, dispatch } = useGame();
  const { player } = state;

  const skills = [
    {
      id: 'lyrics',
      name: 'Lyrics',
      icon: FiBook,
      color: 'text-neon-cyan',
      bgColor: 'bg-neon-cyan',
      description: 'Improve your wordplay and storytelling',
      benefits: 'Better track quality, higher sales',
      current: player.skills.lyrics,
      max: 100
    },
    {
      id: 'flow',
      name: 'Flow',
      icon: FiMusic,
      color: 'text-neon-green',
      bgColor: 'bg-neon-green',
      description: 'Master your rhythm and delivery',
      benefits: 'More engaging performances, viral potential',
      current: player.skills.flow,
      max: 100
    },
    {
      id: 'charisma',
      name: 'Charisma',
      icon: FiHeart,
      color: 'text-neon-pink',
      bgColor: 'bg-neon-pink',
      description: 'Build your stage presence and personality',
      benefits: 'Faster fan growth, better collaborations',
      current: player.skills.charisma,
      max: 100
    },
    {
      id: 'business',
      name: 'Business',
      icon: FiBriefcase,
      color: 'text-neon-yellow',
      bgColor: 'bg-neon-orange',
      description: 'Learn the music industry and marketing',
      benefits: 'Higher profits, better deals',
      current: player.skills.business,
      max: 100
    },
    {
      id: 'production',
      name: 'Production',
      icon: FiMic,
      color: 'text-neon-purple',
      bgColor: 'bg-neon-purple',
      description: 'Create your own beats and mix tracks',
      benefits: 'Lower costs, unique sound',
      current: player.skills.production,
      max: 100
    }
  ];

  // Calculate upgrade cost based on current level - escalating system
  const getUpgradeCost = (currentLevel) => {
    if (currentLevel < 25) return 2; // 0-24: 2 energy
    if (currentLevel < 50) return 4; // 25-49: 4 energy
    if (currentLevel < 75) return 6; // 50-74: 6 energy
    if (currentLevel < 90) return 8; // 75-89: 8 energy
    if (currentLevel < 95) return 12; // 90-94: 12 energy
    if (currentLevel < 98) return 16; // 95-97: 16 energy
    if (currentLevel < 99) return 25; // 98: 25 energy
    return 100; // 99-100: 100 energy (max level)
  };

  const upgradeSkill = (skillId) => {
    const skill = skills.find(s => s.id === skillId);
    const cost = getUpgradeCost(skill.current);

    if (player.energy >= cost && skill.current < skill.max) {
      dispatch({
        type: 'UPDATE_PLAYER',
        payload: {
          energy: player.energy - cost,
          skills: {
            ...player.skills,
            [skillId]: player.skills[skillId] + 1
          }
        }
      });

      // Add notification for milestone achievements
      const newLevel = player.skills[skillId] + 1;
      if (newLevel === 25 || newLevel === 50 || newLevel === 75 || newLevel === 90 || newLevel === 95 || newLevel === 100) {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now(),
            type: 'success',
            title: `${skill.name} Milestone!`,
            message: `Your ${skill.name.toLowerCase()} skill reached level ${newLevel}! ${newLevel === 100 ? 'MASTERED!' : 'Energy cost increases next upgrade.'}`,
            timestamp: new Date().toISOString()
          }
        });
      }
    }
  };

  const canUpgrade = (skill) => {
    const cost = getUpgradeCost(skill.current);
    return player.energy >= cost && skill.current < skill.max;
  };

  const getSkillLevel = (value) => {
    if (value >= 95) return { name: 'Legendary', color: 'text-neon-yellow' };
    if (value >= 90) return { name: 'Master', color: 'text-neon-purple' };
    if (value >= 75) return { name: 'Expert', color: 'text-neon-cyan' };
    if (value >= 50) return { name: 'Advanced', color: 'text-neon-green' };
    if (value >= 25) return { name: 'Intermediate', color: 'text-neon-orange' };
    return { name: 'Beginner', color: 'text-text-muted' };
  };

  const getNextMilestone = (currentLevel) => {
    const milestones = [25, 50, 75, 90, 95, 100];
    return milestones.find(milestone => milestone > currentLevel) || 100;
  };

  return (
    <div className="min-h-screen bg-dark-bg pb-24 pt-16">
      <div className="px-4 space-y-4 max-w-mobile mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-text-primary mb-2">Skills Training</h1>
          <p className="text-text-muted text-sm">Invest energy to improve your abilities</p>
        </div>

        {/* Energy Status */}
        <div className="game-card p-4 shadow-dark">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-neon-orange/20 rounded-game">
                <SafeIcon icon={FiZap} className="text-neon-orange" />
              </div>
              <span className="font-medium text-text-primary text-sm">Energy: {player.energy}/100</span>
            </div>
            <span className="text-xs text-text-muted">Escalating energy costs</span>
          </div>
        </div>

        {/* Energy Cost System Explanation */}
        <div className="game-card p-4 shadow-dark">
          <h3 className="font-bold text-text-primary mb-3 text-sm">Energy Cost System</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-text-muted">Levels 0-24:</span>
              <span className="font-medium text-neon-orange">2 Energy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Levels 25-49:</span>
              <span className="font-medium text-neon-orange">4 Energy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Levels 50-74:</span>
              <span className="font-medium text-neon-orange">6 Energy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Levels 75-89:</span>
              <span className="font-medium text-neon-orange">8 Energy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Levels 90-94:</span>
              <span className="font-medium text-neon-red">12 Energy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Levels 95-97:</span>
              <span className="font-medium text-neon-red">16 Energy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Level 98:</span>
              <span className="font-medium text-neon-red">25 Energy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Level 99:</span>
              <span className="font-medium text-neon-yellow">100 Energy</span>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="space-y-3">
          {skills.map((skill, index) => {
            const cost = getUpgradeCost(skill.current);
            const canUpgradeSkill = canUpgrade(skill);
            const skillLevel = getSkillLevel(skill.current);
            const progress = (skill.current / skill.max) * 100;
            const nextMilestone = getNextMilestone(skill.current);

            return (
              <motion.div
                key={skill.id}
                className="game-card p-4 shadow-dark"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Skill Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 ${skill.bgColor}/20 rounded-game`}>
                      <SafeIcon icon={skill.icon} className={`text-lg ${skill.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary text-sm">{skill.name}</h3>
                      <p className={`text-xs font-medium ${skillLevel.color}`}>{skillLevel.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-text-primary">{skill.current}/{skill.max}</div>
                    <div className="text-xs text-text-muted">Level</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="w-full bg-dark-surface/50 rounded-full h-2 mb-2 relative">
                    <motion.div
                      className={`h-2 rounded-full ${
                        progress >= 95 ? 'bg-neon-yellow' :
                        progress >= 90 ? 'bg-neon-purple' :
                        progress >= 75 ? 'bg-neon-cyan' :
                        progress >= 50 ? 'bg-neon-green' :
                        progress >= 25 ? 'bg-neon-orange' : 'bg-text-muted'
                      } shadow-glow`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                    {/* Milestone markers */}
                    {[25, 50, 75, 90, 95].map((milestone) => (
                      <div
                        key={milestone}
                        className="absolute top-0 bottom-0 w-0.5 bg-dark-border"
                        style={{ left: `${milestone}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>{progress.toFixed(1)}% Complete</span>
                    <span>Next milestone: {nextMilestone}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3 p-3 bg-dark-surface/30 rounded-game">
                  <p className="text-xs text-text-secondary mb-1">{skill.description}</p>
                  <p className="text-xs text-text-muted">Benefits: {skill.benefits}</p>
                </div>

                {/* Upgrade Section */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-text-muted">
                    Upgrade cost: <span className={`font-medium ${
                      cost <= 6 ? 'text-neon-orange' : 
                      cost <= 16 ? 'text-neon-red' : 
                      'text-neon-yellow'
                    }`}>
                      {cost} energy
                    </span>
                    {cost > 6 && (
                      <div className="text-xs text-neon-red mt-1">
                        {cost === 100 ? '⚠️ Final upgrade requires full energy!' : '⚠️ High energy cost'}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => upgradeSkill(skill.id)}
                    disabled={!canUpgradeSkill}
                    className={`px-3 py-2 rounded-game font-semibold transition-all text-xs ${
                      canUpgradeSkill
                        ? `${skill.bgColor} text-white shadow-glow hover:shadow-glow-lg active:scale-95`
                        : 'bg-dark-surface/50 text-text-disabled cursor-not-allowed'
                    }`}
                  >
                    {skill.current >= skill.max ? 'MASTERED' :
                     player.energy < cost ? 'Need Energy' :
                     cost === 100 ? 'FINAL UPGRADE' : 'Upgrade'}
                  </button>
                </div>

                {/* Progress to next milestone */}
                {skill.current < 100 && (
                  <div className="mt-2 p-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-game">
                    <div className="text-xs text-neon-cyan text-center">
                      {nextMilestone - skill.current} levels to next milestone ({nextMilestone})
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Training Tips */}
        <div className="game-card p-4 shadow-dark">
          <h3 className="font-bold text-text-primary mb-3 flex items-center space-x-2 text-sm">
            <SafeIcon icon={FiTrendingUp} className="text-neon-cyan" />
            <span>Training Tips</span>
          </h3>
          <div className="space-y-2 text-xs text-text-secondary">
            <p>• Energy costs increase as skills get higher</p>
            <p>• Reaching level 100 requires 100 energy (full bar)</p>
            <p>• Plan your upgrades around energy availability</p>
            <p>• Higher skills dramatically improve content quality</p>
            <p>• Mastered skills (100) unlock special bonuses</p>
          </div>
        </div>

        {/* Skill Synergies */}
        <div className="game-card p-4 shadow-dark">
          <h3 className="font-bold text-text-primary mb-3 text-sm">Skill Synergies</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-game">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-neon-cyan font-medium">Lyrics</span>
                <span className="text-text-muted">+</span>
                <span className="text-neon-green font-medium">Flow</span>
              </div>
              <div className="text-xs text-neon-yellow font-medium">Elite track quality</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-neon-pink/10 border border-neon-pink/30 rounded-game">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-neon-pink font-medium">Charisma</span>
                <span className="text-text-muted">+</span>
                <span className="text-neon-orange font-medium">Business</span>
              </div>
              <div className="text-xs text-neon-yellow font-medium">Maximum earnings</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-neon-purple/10 border border-neon-purple/30 rounded-game">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-neon-purple font-medium">Production</span>
                <span className="text-text-muted">+</span>
                <span className="text-neon-cyan font-medium">Lyrics</span>
              </div>
              <div className="text-xs text-neon-yellow font-medium">Signature sound</div>
            </div>
          </div>
        </div>

        {/* Mastery Rewards */}
        <div className="bg-gradient-to-r from-neon-yellow/20 to-neon-orange/20 border border-neon-yellow/30 p-4 rounded-game-lg text-text-primary shadow-glow">
          <h3 className="font-bold mb-3 text-sm">🏆 Mastery Rewards</h3>
          <div className="space-y-1 text-xs text-text-secondary">
            <p><span className="font-semibold text-neon-cyan">Lyrics 100:</span> Write legendary verses</p>
            <p><span className="font-semibold text-neon-green">Flow 100:</span> Perfect rhythm mastery</p>
            <p><span className="font-semibold text-neon-pink">Charisma 100:</span> Instant viral potential</p>
            <p><span className="font-semibold text-neon-yellow">Business 100:</span> Maximum profit margins</p>
            <p><span className="font-semibold text-neon-purple">Production 100:</span> Studio ownership unlock</p>
          </div>
        </div>
      </div>
    </div>
  );
}