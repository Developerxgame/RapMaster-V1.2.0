import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiSettings, FiFolderOpen, FiMic, FiPlus, FiTrash2, FiEdit3, FiUser, FiChevronLeft } = FiIcons;

export default function MainMenu() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [showSaves, setShowSaves] = useState(false);
  const [savedCareers, setSavedCareers] = useState([]);

  useEffect(() => {
    loadSavedCareers();
  }, []);

  const loadSavedCareers = () => {
    const saves = [];
    for (let i = 1; i <= 3; i++) {
      const save = localStorage.getItem(`rapCareer_slot_${i}`);
      if (save) {
        try {
          const careerData = JSON.parse(save);
          saves.push({
            slot: i,
            ...careerData,
            lastPlayed: new Date(careerData.lastPlayed || Date.now()).toLocaleDateString()
          });
        } catch (error) {
          console.error(`Error loading save slot ${i}:`, error);
        }
      } else {
        saves.push({ slot: i, empty: true });
      }
    }
    setSavedCareers(saves);
  };

  const handleStartNewGame = () => {
    const emptySlots = savedCareers.filter(save => save.empty);
    if (emptySlots.length === 0) {
      alert('Maximum 3 careers allowed! Please delete a career to create a new one.');
      return;
    }
    navigate('/character-creation');
  };

  const handleContinue = () => {
    setShowSaves(true);
  };

  const loadCareer = (career) => {
    if (career.empty) {
      navigate('/character-creation', { state: { slot: career.slot } });
      return;
    }

    try {
      dispatch({ type: 'LOAD_GAME_STATE', payload: career });
      navigate('/game/home');
    } catch (error) {
      console.error('Failed to load career:', error);
      alert('Failed to load career. The save file may be corrupted.');
    }
  };

  const deleteCareer = (slot) => {
    if (window.confirm('Are you sure you want to delete this career? This action cannot be undone.')) {
      localStorage.removeItem(`rapCareer_slot_${slot}`);
      loadSavedCareers();
    }
  };

  const hasAnyCareers = savedCareers.some(save => !save.empty);

  const menuItems = [
    {
      icon: FiPlus,
      label: 'New Career',
      action: handleStartNewGame,
      primary: true,
      color: 'bg-gradient-to-r from-neon-cyan to-info'
    },
    {
      icon: FiFolderOpen,
      label: 'Continue',
      action: handleContinue,
      primary: false,
      disabled: !hasAnyCareers,
      color: 'bg-gradient-to-r from-neon-green to-success'
    },
    {
      icon: FiSettings,
      label: 'Settings',
      action: () => navigate('/settings'),
      primary: false,
      color: 'bg-gradient-to-r from-text-muted to-text-disabled'
    }
  ];

  if (showSaves) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <div className="max-w-mobile mx-auto px-4 py-8">
          <div className="h-8"></div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowSaves(false)}
              className="p-2 hover:bg-dark-surface/50 rounded-game transition-colors"
            >
              <SafeIcon icon={FiChevronLeft} className="text-xl text-neon-cyan" />
            </button>
            <h1 className="text-xl font-semibold text-text-primary">Select Career</h1>
            <div className="w-10"></div>
          </div>

          {/* Career Slots */}
          <div className="space-y-3">
            {savedCareers.map((career, index) => (
              <motion.div
                key={career.slot}
                className={`game-card p-4 shadow-dark ${
                  career.empty ? 'border-2 border-dashed border-dark-border/50' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {career.empty ? (
                  <button
                    onClick={() => loadCareer(career)}
                    className="w-full flex flex-col items-center justify-center py-6 text-text-muted hover:text-text-primary transition-colors"
                  >
                    <SafeIcon icon={FiPlus} className="text-3xl mb-2" />
                    <span className="text-sm font-medium">Create New Career</span>
                    <span className="text-xs">Slot {career.slot}</span>
                  </button>
                ) : (
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-game-lg flex items-center justify-center text-lg text-white shadow-glow">
                        🎤
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-text-primary">
                          {career.player?.stageName || 'Unknown Artist'}
                        </h3>
                        <p className="text-xs text-text-muted">
                          Age {career.player?.age || 20} • {career.player?.city || 'Unknown City'}
                        </p>
                      </div>
                    </div>
                    <div className="bg-dark-surface/50 p-3 rounded-game mb-3">
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                          <div className="font-medium text-text-primary">{career.lastPlayed}</div>
                          <div className="text-text-muted">Date</div>
                        </div>
                        <div>
                          <div className="font-medium text-neon-yellow animate-neon">{career.player?.fame || 0}</div>
                          <div className="text-text-muted">Fame</div>
                        </div>
                        <div>
                          <div className="font-medium text-neon-cyan animate-neon">
                            {career.player?.week || 1}/{career.player?.year || 2020}
                          </div>
                          <div className="text-text-muted">Week</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => loadCareer(career)}
                        className="flex-1 bg-gradient-to-r from-neon-cyan to-info text-white py-2 px-4 rounded-game font-semibold hover:shadow-glow transition-all text-sm"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deleteCareer(career.slot)}
                        className="bg-gradient-to-r from-neon-red to-error text-white py-2 px-3 rounded-game hover:shadow-glow transition-all"
                      >
                        <SafeIcon icon={FiTrash2} className="text-sm" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Career Counter */}
          <div className="text-center text-text-muted text-xs mt-4">
            {savedCareers.filter(save => !save.empty).length} / 3 careers created
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-mobile mx-auto px-4 py-8 flex flex-col min-h-screen">
        {/* Status Bar Spacer */}
        <div className="h-8"></div>

        {/* Logo Section */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-center"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-game-xl shadow-glow-xl flex items-center justify-center mb-4 animate-glow">
            <SafeIcon icon={FiMic} className="text-2xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2 neon-text">RapMaster</h1>
          <p className="text-base text-text-secondary mb-8">Build your rap empire</p>

          {/* Menu Items */}
          <div className="w-full space-y-3">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.label}
                onClick={item.action}
                disabled={item.disabled}
                className={`w-full flex items-center justify-center space-x-3 py-3 px-6 rounded-game-lg font-semibold text-white transition-all duration-200 ${
                  item.disabled
                    ? 'bg-dark-surface/50 text-text-disabled cursor-not-allowed'
                    : `${item.color} shadow-glow hover:shadow-glow-lg active:scale-95 hover-glow`
                }`}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={!item.disabled ? { scale: 1.02 } : {}}
                whileTap={!item.disabled ? { scale: 0.98 } : {}}
              >
                <SafeIcon icon={item.icon} className="text-lg" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center text-text-muted text-xs pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p>Version 1.2.0</p>
          <p className="mt-1">© 2024 FHX Studios</p>
        </motion.div>
      </div>
    </div>
  );
}