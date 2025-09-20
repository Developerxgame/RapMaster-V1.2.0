import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import SafeIcon from '../../common/SafeIcon';
import { CAREER_LEVELS, CareerProgression } from '../../utils/careerSystem';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiStar, FiTrendingUp, FiUsers, FiDollarSign, FiAward, FiZap } = FiIcons;

export default function LevelUpModal({ isOpen, onClose, newLevel, previousLevel }) {
  const { state } = useGame();
  const { player } = state;

  // Move the early return after all hooks
  if (!isOpen || !newLevel || !previousLevel) return null;

  const levelMultipliers = CareerProgression.getLevelMultipliers(newLevel);
  const previousMultipliers = CareerProgression.getLevelMultipliers(previousLevel);

  const improvements = [
    {
      label: 'Earnings Boost',
      icon: FiDollarSign,
      previous: `+${((previousMultipliers.earnings - 1) * 100).toFixed(0)}%`,
      new: `+${((levelMultipliers.earnings - 1) * 100).toFixed(0)}%`,
      color: 'text-neon-green'
    },
    {
      label: 'Fan Growth',
      icon: FiUsers,
      previous: `+${((previousMultipliers.fanGrowth - 1) * 100).toFixed(0)}%`,
      new: `+${((levelMultipliers.fanGrowth - 1) * 100).toFixed(0)}%`,
      color: 'text-neon-cyan'
    },
    {
      label: 'Opportunities',
      icon: FiTrendingUp,
      previous: `+${((previousMultipliers.opportunities - 1) * 100).toFixed(0)}%`,
      new: `+${((levelMultipliers.opportunities - 1) * 100).toFixed(0)}%`,
      color: 'text-neon-purple'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-dark-bg/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-gradient-to-br from-dark-surface to-dark-card border-2 border-neon-yellow/50 rounded-game-xl p-6 w-full max-w-sm shadow-glow-xl"
            initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: 180 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-dark-surface/50 rounded-game transition-colors"
            >
              <SafeIcon icon={FiX} className="text-lg text-text-muted" />
            </button>

            {/* Celebration Animation */}
            <div className="text-center mb-6">
              <motion.div
                className="text-6xl mb-4"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {newLevel.emoji}
              </motion.div>
              
              <motion.h2
                className="text-2xl font-bold text-neon-yellow mb-2 animate-neon"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                LEVEL UP!
              </motion.h2>
              
              <motion.p
                className="text-text-secondary mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {player.stageName} is now a
              </motion.p>
              
              <motion.h3
                className="text-xl font-bold text-text-primary mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {newLevel.title}
              </motion.h3>
              
              <motion.p
                className="text-sm text-text-muted"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {newLevel.description}
              </motion.p>
            </div>

            {/* Level Progress */}
            <motion.div
              className="mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-text-secondary">Level Progress</span>
                <span className="text-sm text-neon-cyan font-medium">
                  Level {newLevel.id}/8
                </span>
              </div>
              <div className="w-full bg-dark-surface/50 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-3 bg-gradient-to-r from-neon-cyan to-neon-yellow rounded-full shadow-glow"
                  initial={{ width: `${(previousLevel.id / 8) * 100}%` }}
                  animate={{ width: `${(newLevel.id / 8) * 100}%` }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                />
              </div>
            </motion.div>

            {/* Improvements */}
            <motion.div
              className="mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <h4 className="text-sm font-bold text-text-primary mb-3 flex items-center space-x-2">
                <SafeIcon icon={FiZap} className="text-neon-orange" />
                <span>New Bonuses</span>
              </h4>
              <div className="space-y-2">
                {improvements.map((improvement, index) => (
                  <motion.div
                    key={improvement.label}
                    className="flex items-center justify-between p-2 bg-dark-surface/30 rounded-game"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={improvement.icon} className={`text-sm ${improvement.color}`} />
                      <span className="text-sm text-text-secondary">{improvement.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-text-muted line-through">{improvement.previous}</div>
                      <div className={`text-sm font-bold ${improvement.color} animate-neon`}>
                        {improvement.new}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* New Unlocks */}
            <motion.div
              className="mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <h4 className="text-sm font-bold text-text-primary mb-3 flex items-center space-x-2">
                <SafeIcon icon={FiAward} className="text-neon-purple" />
                <span>New Unlocks</span>
              </h4>
              <div className="space-y-2">
                {newLevel.unlocks.map((unlock, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2 p-2 bg-neon-purple/10 border border-neon-purple/30 rounded-game"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                  >
                    <SafeIcon icon={FiStar} className="text-neon-yellow text-sm animate-pulse" />
                    <span className="text-sm text-text-primary">{unlock}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats Display */}
            <motion.div
              className="bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/30 p-3 rounded-game mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div>
                  <div className="font-bold text-neon-yellow animate-neon">{player.fame}</div>
                  <div className="text-text-muted">Fame</div>
                </div>
                <div>
                  <div className="font-bold text-neon-cyan animate-neon">{player.reputation}</div>
                  <div className="text-text-muted">Reputation</div>
                </div>
              </div>
            </motion.div>

            {/* Continue Button */}
            <motion.button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple text-white py-3 px-6 rounded-game font-bold hover:shadow-glow-lg transition-all active:scale-95"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue Your Journey
            </motion.button>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-game-xl">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-neon-yellow rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}