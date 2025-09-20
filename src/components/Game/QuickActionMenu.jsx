import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiX, FiTarget, FiAward, FiBarChart, FiMic, FiUsers, FiUpload } = FiIcons;

export default function QuickActionMenu() {
  const navigate = useNavigate();
  const { state } = useGame();
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    {
      id: 'skills',
      title: 'Skills',
      description: 'Improve abilities',
      icon: FiTarget,
      color: 'bg-gradient-to-br from-cyan-400 to-blue-500',
      action: () => navigate('/game/skills')
    },
    {
      id: 'awards',
      title: 'Awards',
      description: 'View achievements',
      icon: FiAward,
      color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      action: () => navigate('/game/awards')
    },
    {
      id: 'stats',
      title: 'Stats',
      description: 'Career statistics',
      icon: FiBarChart,
      color: 'bg-gradient-to-br from-purple-400 to-pink-500',
      action: () => navigate('/game/stats')
    },
    {
      id: 'concerts',
      title: 'Concerts',
      description: 'Live performances',
      icon: FiMic,
      color: 'bg-gradient-to-br from-red-400 to-pink-500',
      action: () => navigate('/game/concerts')
    },
    {
      id: 'collaborations',
      title: 'Collabs',
      description: 'Work with artists',
      icon: FiUsers,
      color: 'bg-gradient-to-br from-green-400 to-emerald-500',
      action: () => navigate('/game/collaborations')
    },
    {
      id: 'releases',
      title: 'Releases',
      description: 'Publish content',
      icon: FiUpload,
      color: 'bg-gradient-to-br from-indigo-400 to-purple-500',
      action: () => navigate('/game/releases')
    }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleActionClick = (action) => {
    action.action();
    setIsOpen(false);
  };

  return (
    <>
      {/* Quick Action Button */}
      <motion.button
        onClick={toggleMenu}
        className={`fixed bottom-28 right-6 w-14 h-14 rounded-2xl shadow-2xl z-40 flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-gradient-to-br from-red-500 to-pink-500 rotate-45'
            : 'bg-gradient-to-br from-cyan-400 to-purple-500'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        <SafeIcon icon={isOpen ? FiX : FiPlus} className="text-2xl text-white" />
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Quick Action Grid - Optimized for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-44 right-4 left-4 z-40"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-2xl max-w-mobile mx-auto">
              {/* Header */}
              <div className="text-center mb-4">
                <h3 className="text-white font-bold text-sm mb-1">Quick Actions</h3>
                <p className="text-gray-300 text-xs">Tap any action to access</p>
              </div>

              {/* Action Grid - Responsive 2x3 layout for 6 items */}
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    onClick={() => handleActionClick(action)}
                    className="flex flex-col items-center p-4 rounded-2xl transition-all active:scale-95 min-h-[80px]"
                    style={{ background: action.color }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                      <SafeIcon icon={action.icon} className="text-white text-lg" />
                    </div>
                    <span className="text-white font-semibold text-xs text-center leading-tight mb-1">
                      {action.title}
                    </span>
                    <span className="text-white/80 text-xs text-center leading-tight">
                      {action.description}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-sm font-bold text-cyan-400">{state.player.fame}</div>
                    <div className="text-xs text-gray-300">Fame</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-green-400">{state.player.fans}</div>
                    <div className="text-xs text-gray-300">Fans</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-orange-400">{state.player.energy}</div>
                    <div className="text-xs text-gray-300">Energy</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}