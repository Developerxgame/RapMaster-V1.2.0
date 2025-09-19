import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMapPin, FiArrowRight, FiShuffle, FiChevronLeft } = FiIcons;

export default function CharacterCreation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useGame();
  const [step, setStep] = useState(1);
  const [character, setCharacter] = useState({
    stageName: '',
    avatar: 1,
    city: 'Los Angeles'
  });

  // Get slot from navigation state (for new careers from save page)
  const targetSlot = location.state?.slot;

  const avatars = [
    { id: 1, name: 'Street Style', emoji: '🎤' },
    { id: 2, name: 'Classic Rapper', emoji: '👨‍🎤' },
    { id: 3, name: 'Modern Artist', emoji: '🕺' },
    { id: 4, name: 'Underground', emoji: '🎭' },
    { id: 5, name: 'Luxury Rap', emoji: '💎' },
    { id: 6, name: 'Female MC', emoji: '👩‍🎤' },
    { id: 7, name: 'Rising Star', emoji: '⭐' },
    { id: 8, name: 'Veteran', emoji: '🎯' }
  ];

  const cities = [
    { name: 'Los Angeles', boost: 'Fame Boost', flag: '🌴', color: 'bg-neon-orange' },
    { name: 'New York', boost: 'Reputation Boost', flag: '🗽', color: 'bg-neon-cyan' },
    { name: 'Atlanta', boost: 'Fan Growth', flag: '🍑', color: 'bg-neon-green' },
    { name: 'Chicago', boost: 'Business Boost', flag: '🏙️', color: 'bg-neon-purple' }
  ];

  const randomNames = [
    'Lil Cipher', 'MC Thunder', 'Rap Phantom', 'Young Legend', 'Flow Master',
    'Beat King', 'Rhyme Slayer', 'Street Prophet', 'Golden Voice', 'Mic Drop'
  ];

  const generateRandomName = () => {
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    setCharacter({ ...character, stageName: randomName });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleStartCareer();
    }
  };

  const findAvailableSlot = () => {
    // If we have a target slot, use it
    if (targetSlot) return targetSlot;
    
    // Otherwise find first available slot
    for (let i = 1; i <= 3; i++) {
      const save = localStorage.getItem(`rapCareer_slot_${i}`);
      if (!save) return i;
    }
    return null; // No slots available
  };

  const handleStartCareer = () => {
    const slot = findAvailableSlot();
    if (!slot) {
      alert('No available slots! This should not happen.');
      return;
    }

    // Create initial game state
    const gameState = {
      player: {
        stageName: character.stageName,
        avatar: character.avatar,
        city: character.city,
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
      gameStarted: true,
      currentPage: 'home',
      notifications: [],
      randomEvents: [],
      lastPlayed: new Date().toISOString(),
      slot: slot
    };

    // Save to specific slot
    localStorage.setItem(`rapCareer_slot_${slot}`, JSON.stringify(gameState));

    // Load into current game state
    dispatch({ type: 'LOAD_GAME_STATE', payload: gameState });
    navigate('/game/home');
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="game-card px-6 py-4 shadow-dark border-0 border-b border-dark-border/30 rounded-none">
        <div className="flex items-center justify-between pt-8">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/menu')}
            className="p-2 hover:bg-dark-surface/50 rounded-game transition-colors"
          >
            <SafeIcon icon={FiChevronLeft} className="text-xl text-neon-cyan" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-text-primary">Create Artist</h1>
            <div className="flex justify-center space-x-2 mt-2">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step >= num ? 'bg-neon-cyan shadow-neon' : 'bg-text-disabled'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-mobile mx-auto">
        {/* Step 1: Avatar Selection */}
        {step === 1 && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <div className="text-center">
              <SafeIcon icon={FiUser} className="text-4xl text-neon-cyan mx-auto mb-4 animate-glow" />
              <h2 className="text-2xl font-bold text-text-primary mb-2 neon-text">Choose Your Avatar</h2>
              <p className="text-text-muted">Pick your rap style</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {avatars.map((avatar) => (
                <motion.button
                  key={avatar.id}
                  onClick={() => setCharacter({ ...character, avatar: avatar.id })}
                  className={`p-6 rounded-game-lg transition-all ${
                    character.avatar === avatar.id
                      ? 'bg-neon-cyan/20 shadow-glow border-2 border-neon-cyan/50'
                      : 'game-card hover:shadow-glow'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-4xl mb-3">{avatar.emoji}</div>
                  <div className={`text-sm font-medium ${
                    character.avatar === avatar.id ? 'text-neon-cyan animate-neon' : 'text-text-primary'
                  }`}>
                    {avatar.name}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Stage Name */}
        {step === 2 && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🎤</div>
              <h2 className="text-2xl font-bold text-text-primary mb-2 neon-text">Stage Name</h2>
              <p className="text-text-muted">How will fans know you?</p>
            </div>

            <div className="space-y-4">
              <div className="game-card p-4">
                <input
                  type="text"
                  value={character.stageName}
                  onChange={(e) => setCharacter({ ...character, stageName: e.target.value })}
                  placeholder="Enter your stage name"
                  className="w-full text-lg font-medium text-text-primary placeholder-text-muted bg-transparent border-none outline-none"
                  maxLength={20}
                />
              </div>

              <button
                onClick={generateRandomName}
                className="w-full flex items-center justify-center space-x-2 p-4 bg-dark-surface/60 rounded-game-lg hover:bg-dark-surface/80 transition-colors"
              >
                <SafeIcon icon={FiShuffle} className="text-lg text-text-muted" />
                <span className="font-medium text-text-muted">Generate Random Name</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: City Selection */}
        {step === 3 && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <div className="text-center">
              <SafeIcon icon={FiMapPin} className="text-4xl text-neon-cyan mx-auto mb-4 animate-glow" />
              <h2 className="text-2xl font-bold text-text-primary mb-2 neon-text">Choose Your City</h2>
              <p className="text-text-muted">Each city provides unique benefits</p>
            </div>

            <div className="space-y-3">
              {cities.map((city) => (
                <motion.button
                  key={city.name}
                  onClick={() => setCharacter({ ...character, city: city.name })}
                  className={`w-full flex items-center justify-between p-4 rounded-game-lg transition-all ${
                    character.city === city.name
                      ? 'bg-neon-cyan/20 shadow-glow border border-neon-cyan/50'
                      : 'game-card hover:shadow-glow'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${city.color} rounded-game flex items-center justify-center text-xl shadow-glow`}>
                      {city.flag}
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${
                        character.city === city.name ? 'text-neon-cyan animate-neon' : 'text-text-primary'
                      }`}>
                        {city.name}
                      </div>
                      <div className={`text-sm ${
                        character.city === city.name ? 'text-neon-cyan/80' : 'text-text-muted'
                      }`}>
                        {city.boost}
                      </div>
                    </div>
                  </div>
                  {character.city === city.name && (
                    <div className="w-6 h-6 bg-neon-cyan rounded-full flex items-center justify-center shadow-neon">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Character Preview */}
            <div className="game-card p-4">
              <h3 className="font-semibold text-text-primary mb-3">Preview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Avatar:</span>
                  <span className="font-medium text-text-primary">
                    {avatars.find(a => a.id === character.avatar)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Stage Name:</span>
                  <span className="font-medium text-neon-cyan animate-neon">
                    {character.stageName || 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">City:</span>
                  <span className="font-medium text-text-primary">{character.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Starting Age:</span>
                  <span className="font-medium text-text-primary">20 years</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Next Button */}
        <div className="fixed bottom-8 left-6 right-6 max-w-mobile mx-auto">
          <button
            onClick={handleNext}
            disabled={step === 2 && !character.stageName.trim()}
            className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-game-lg font-semibold text-white transition-all ${
              (step === 2 && !character.stageName.trim())
                ? 'bg-text-disabled cursor-not-allowed'
                : 'game-button hover-glow'
            }`}
          >
            <span>{step === 3 ? 'Start Career' : 'Continue'}</span>
            <SafeIcon icon={FiArrowRight} className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}