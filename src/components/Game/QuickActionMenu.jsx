import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiPlus, 
  FiX, 
  FiTarget, 
  FiAward, 
  FiBarChart, 
  FiMusic, 
  FiVideo, 
  FiDisc, 
  FiMic, 
  FiCalendar,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiEdit3,
  FiUpload,
  FiPlay
} = FiIcons;

export default function QuickActionMenu() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    {
      id: 'skills',
      title: 'Skills',
      description: 'Improve your abilities',
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
      id: 'release-track',
      title: 'Release Track',
      description: 'Quick track release',
      icon: FiMusic,
      color: 'bg-gradient-to-br from-indigo-400 to-purple-500',
      action: () => handleQuickRelease('track')
    },
    {
      id: 'release-video',
      title: 'Music Video',
      description: 'Quick video release',
      icon: FiVideo,
      color: 'bg-gradient-to-br from-red-500 to-orange-500',
      action: () => handleQuickRelease('video')
    },
    {
      id: 'release-album',
      title: 'Album',
      description: 'Quick album release',
      icon: FiDisc,
      color: 'bg-gradient-to-br from-violet-400 to-purple-500',
      action: () => handleQuickRelease('album')
    }
  ];

  const handleQuickRelease = (type) => {
    // Navigate to studio with specific tab
    navigate('/game/studio');
    setIsOpen(false);
    
    // Add notification for guidance
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        type: 'info',
        title: `${type === 'track' ? 'Track' : type === 'video' ? 'Music Video' : 'Album'} Release`,
        message: `Navigate to the ${type === 'track' ? 'Create Track' : type === 'video' ? 'Music Video' : 'Create Album'} tab to create and release your content.`,
        timestamp: new Date().toISOString()
      }
    });
  };

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
        <SafeIcon 
          icon={isOpen ? FiX : FiPlus} 
          className="text-2xl text-white" 
        />
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

      {/* Quick Action Grid */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-44 right-6 z-40"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-4">
                <h3 className="text-white font-bold text-sm mb-1">Quick Actions</h3>
                <p className="text-gray-300 text-xs">Tap to access features</p>
              </div>

              {/* Action Grid */}
              <div className="grid grid-cols-2 gap-3 w-64">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    onClick={() => handleActionClick(action)}
                    className="flex flex-col items-center p-3 rounded-2xl transition-all active:scale-95"
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
                    <span className="text-white font-semibold text-xs text-center leading-tight">
                      {action.title}
                    </span>
                    <span className="text-white/80 text-xs text-center mt-1 leading-tight">
                      {action.description}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="grid grid-cols-3 gap-2 text-center">
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