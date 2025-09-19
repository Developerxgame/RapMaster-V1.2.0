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
    { id: 1, name: 'Street Style', emoji: '👨‍🎤', gender: 'male' },
    { id: 2, name: 'Classic Rapper', emoji: '🕺', gender: 'male' },
    { id: 3, name: 'Modern Artist', emoji: '👨‍🎨', gender: 'male' },
    { id: 4, name: 'Underground', emoji: '🎭', gender: 'male' },
    { id: 5, name: 'Female MC', emoji: '👩‍🎤', gender: 'female' },
    { id: 6, name: 'Rising Star', emoji: '💃', gender: 'female' },
    { id: 7, name: 'Luxury Rap', emoji: '💎', gender: 'unisex' },
    { id: 8, name: 'Veteran', emoji: '🎯', gender: 'unisex' }
  ];

  const cities = [
    { name: 'Los Angeles', boost: 'Fame Boost', flag: '🌴', color: 'bg-gradient-to-br from-orange-400 to-red-500' },
    { name: 'New York', boost: 'Reputation Boost', flag: '🗽', color: 'bg-gradient-to-br from-cyan-400 to-blue-500' },
    { name: 'Atlanta', boost: 'Fan Growth', flag: '🍑', color: 'bg-gradient-to-br from-green-400 to-emerald-500' },
    { name: 'Chicago', boost: 'Business Boost', flag: '🏙️', color: 'bg-gradient-to-br from-purple-400 to-pink-500' }
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between pt-8">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/menu')}
            className="p-2 hover:bg-white/10 rounded-2xl transition-colors"
          >
            <SafeIcon icon={FiChevronLeft} className="text-xl text-cyan-400" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-white">Create Artist</h1>
            <div className="flex justify-center space-x-2 mt-2">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step >= num ? 'bg-cyan-400 shadow-lg' : 'bg-gray-600'
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
              <SafeIcon icon={FiUser} className="text-4xl text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Avatar</h2>
              <p className="text-gray-300">Pick your rap style</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {avatars.map((avatar) => (
                <motion.button
                  key={avatar.id}
                  onClick={() => setCharacter({ ...character, avatar: avatar.id })}
                  className={`p-6 rounded-3xl transition-all ${
                    character.avatar === avatar.id
                      ? 'bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border-2 border-cyan-400/50 shadow-xl'
                      : 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-4xl mb-3">{avatar.emoji}</div>
                  <div className={`text-sm font-medium ${
                    character.avatar === avatar.id ? 'text-cyan-400' : 'text-white'
                  }`}>
                    {avatar.name}
                  </div>
                  <div className="text-xs text-gray-400 capitalize mt-1">{avatar.gender}</div>
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
              <h2 className="text-2xl font-bold text-white mb-2">Stage Name</h2>
              <p className="text-gray-300">How will fans know you?</p>
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
                <input
                  type="text"
                  value={character.stageName}
                  onChange={(e) => setCharacter({ ...character, stageName: e.target.value })}
                  placeholder="Enter your stage name"
                  className="w-full text-lg font-medium text-white placeholder-gray-400 bg-transparent border-none outline-none"
                  maxLength={20}
                />
              </div>
              <button
                onClick={generateRandomName}
                className="w-full flex items-center justify-center space-x-2 p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 hover:bg-white/20 transition-colors"
              >
                <SafeIcon icon={FiShuffle} className="text-lg text-gray-300" />
                <span className="font-medium text-gray-300">Generate Random Name</span>
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
              <SafeIcon icon={FiMapPin} className="text-4xl text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your City</h2>
              <p className="text-gray-300">Each city provides unique benefits</p>
            </div>
            <div className="space-y-3">
              {cities.map((city) => (
                <motion.button
                  key={city.name}
                  onClick={() => setCharacter({ ...character, city: city.name })}
                  className={`w-full flex items-center justify-between p-4 rounded-3xl transition-all ${
                    character.city === city.name
                      ? 'bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border-2 border-cyan-400/50 shadow-xl'
                      : 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${city.color} rounded-2xl flex items-center justify-center text-xl shadow-lg`}>
                      {city.flag}
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${
                        character.city === city.name ? 'text-cyan-400' : 'text-white'
                      }`}>
                        {city.name}
                      </div>
                      <div className={`text-sm ${
                        character.city === city.name ? 'text-cyan-300' : 'text-gray-300'
                      }`}>
                        {city.boost}
                      </div>
                    </div>
                  </div>
                  {character.city === city.name && (
                    <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Character Preview */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
              <h3 className="font-semibold text-white mb-3">Preview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Avatar:</span>
                  <span className="font-medium text-white">
                    {avatars.find(a => a.id === character.avatar)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Stage Name:</span>
                  <span className="font-medium text-cyan-400">
                    {character.stageName || 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">City:</span>
                  <span className="font-medium text-white">{character.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Starting Age:</span>
                  <span className="font-medium text-white">20 years</span>
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
            className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-3xl font-semibold text-white transition-all ${
              (step === 2 && !character.stageName.trim())
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-purple-500 shadow-xl hover:shadow-2xl'
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