import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiZap, FiDollarSign, FiStar, FiClock } = FiIcons;

export default function JobPage() {
  const { state, dispatch } = useGame();
  const { player } = state;
  const [selectedJob, setSelectedJob] = useState(null);
  const [working, setWorking] = useState(false);

  const jobs = [
    {
      id: 1,
      title: 'Fast Food Worker',
      category: 'Entry Level',
      pay: 50,
      energy: 15,
      fame: 0,
      time: '4 hours',
      description: 'Work at a local fast food restaurant',
      emoji: '🍔',
      requirements: { fame: 0 },
      color: 'bg-neon-orange'
    },
    {
      id: 2,
      title: 'Delivery Driver',
      category: 'Entry Level',
      pay: 80,
      energy: 20,
      fame: 1,
      time: '6 hours',
      description: 'Deliver food around the city',
      emoji: '🚗',
      requirements: { fame: 0 },
      color: 'bg-neon-cyan'
    },
    {
      id: 3,
      title: 'Retail Associate',
      category: 'Entry Level',
      pay: 70,
      energy: 18,
      fame: 0,
      time: '5 hours',
      description: 'Work at a clothing store',
      emoji: '👕',
      requirements: { fame: 0 },
      color: 'bg-neon-purple'
    },
    {
      id: 4,
      title: 'Bartender',
      category: 'Mid Level',
      pay: 120,
      energy: 25,
      fame: 3,
      time: '6 hours',
      description: 'Mix drinks at a local bar',
      emoji: '🍸',
      requirements: { fame: 10 },
      color: 'bg-neon-pink'
    },
    {
      id: 5,
      title: 'Club DJ',
      category: 'Mid Level',
      pay: 200,
      energy: 30,
      fame: 8,
      time: '8 hours',
      description: 'DJ at nightclubs and events',
      emoji: '🎧',
      requirements: { fame: 25 },
      color: 'bg-neon-purple'
    },
    {
      id: 6,
      title: 'Studio Assistant',
      category: 'Music Industry',
      pay: 150,
      energy: 20,
      fame: 5,
      time: '6 hours',
      description: 'Help out at a recording studio',
      emoji: '🎙️',
      requirements: { fame: 15 },
      color: 'bg-neon-green'
    },
    {
      id: 7,
      title: 'Ghostwriter',
      category: 'Music Industry',
      pay: 300,
      energy: 25,
      fame: 2,
      time: '4 hours',
      description: 'Write lyrics for other artists',
      emoji: '✍️',
      requirements: { fame: 50 },
      color: 'bg-neon-green'
    },
    {
      id: 8,
      title: 'Music Producer',
      category: 'Music Industry',
      pay: 500,
      energy: 35,
      fame: 15,
      time: '8 hours',
      description: 'Produce beats for other artists',
      emoji: '🎹',
      requirements: { fame: 100 },
      color: 'bg-neon-yellow'
    }
  ];

  const handleWork = async (job) => {
    if (player.energy < job.energy) return;

    setWorking(true);
    setSelectedJob(job);

    setTimeout(() => {
      dispatch({
        type: 'UPDATE_PLAYER',
        payload: {
          netWorth: player.netWorth + job.pay,
          energy: player.energy - job.energy,
          fame: player.fame + job.fame,
          reputation: player.reputation + Math.floor(job.fame / 2)
        }
      });

      setWorking(false);
      setSelectedJob(null);
    }, 2000);
  };

  const canWork = (job) => {
    return player.fame >= job.requirements.fame && player.energy >= job.energy;
  };

  const getJobsByCategory = (category) => {
    return jobs.filter(job => job.category === category);
  };

  const categories = ['Entry Level', 'Mid Level', 'Music Industry'];

  if (working && selectedJob) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
        <motion.div
          className="text-center game-card p-8 shadow-glow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">{selectedJob.emoji}</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Working as {selectedJob.title}</h2>
          <p className="text-text-muted mb-6">Earning money and experience...</p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-3 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-24 pt-16">
      <div className="px-4 space-y-4 max-w-mobile mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-text-primary mb-2">Find Work</h1>
          <p className="text-text-muted text-sm">Earn money and build your reputation</p>
        </div>

        {/* Player Status */}
        <div className="game-card p-4 shadow-dark">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-neon-orange/20 rounded-game">
                <SafeIcon icon={FiZap} className="text-neon-orange" />
              </div>
              <span className="font-medium text-text-primary text-sm">Energy: {player.energy}/100</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-neon-yellow/20 rounded-game">
                <SafeIcon icon={FiStar} className="text-neon-yellow" />
              </div>
              <span className="font-medium text-text-primary text-sm">Fame: {player.fame}</span>
            </div>
          </div>
        </div>

        {/* Job Categories */}
        {categories.map((category) => (
          <div key={category}>
            <h2 className="text-base font-bold text-text-primary mb-3">{category}</h2>
            <div className="space-y-3">
              {getJobsByCategory(category).map((job) => {
                const available = canWork(job);
                return (
                  <motion.div
                    key={job.id}
                    className={`game-card transition-all ${
                      available ? 'hover:shadow-glow' : 'opacity-60'
                    }`}
                    whileHover={available ? { scale: 1.01 } : {}}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 ${job.color} rounded-game flex items-center justify-center text-xl shadow-glow`}>
                            {job.emoji}
                          </div>
                          <div>
                            <h3 className="font-bold text-text-primary text-sm">{job.title}</h3>
                            <p className="text-xs text-text-muted">{job.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiDollarSign} className="text-neon-green text-sm" />
                          <span className="text-xs font-medium text-text-primary">${job.pay}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiZap} className="text-neon-orange text-sm" />
                          <span className="text-xs font-medium text-text-primary">-{job.energy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiStar} className="text-neon-yellow text-sm" />
                          <span className="text-xs font-medium text-text-primary">+{job.fame}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiClock} className="text-neon-purple text-sm" />
                          <span className="text-xs font-medium text-text-primary">{job.time}</span>
                        </div>
                      </div>
                      
                      {!available && (
                        <p className="text-xs text-neon-red mb-3">
                          {player.energy < job.energy 
                            ? `Need ${job.energy} energy` 
                            : `Need ${job.requirements.fame} fame`
                          }
                        </p>
                      )}
                      
                      <button
                        onClick={() => handleWork(job)}
                        disabled={!available}
                        className={`w-full py-3 px-4 rounded-game font-semibold transition-all text-sm ${
                          available
                            ? 'game-button hover-glow'
                            : 'bg-dark-surface/50 text-text-disabled cursor-not-allowed'
                        }`}
                      >
                        {available ? 'Work Now' : 'Unavailable'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}