import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMic, FiUsers, FiDollarSign, FiZap, FiStar, FiMapPin, FiClock, FiTrendingUp, FiMusic } = FiIcons;

export default function ConcertsPage() {
  const { state, dispatch } = useGame();
  const { player, concerts = [] } = state;
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [performing, setPerforming] = useState(false);

  const venues = [
    {
      id: 1,
      name: 'Local Bar',
      capacity: 50,
      prestige: 1,
      pay: 500,
      energy: 20,
      fameBoost: 5,
      requirements: { fame: 0 },
      location: 'Downtown',
      emoji: '🍺',
      description: 'Small intimate venue for beginners'
    },
    {
      id: 2,
      name: 'Underground Club',
      capacity: 200,
      prestige: 2,
      pay: 1500,
      energy: 30,
      fameBoost: 15,
      requirements: { fame: 20 },
      location: 'City Center',
      emoji: '🎭',
      description: 'Hip underground scene'
    },
    {
      id: 3,
      name: 'Music Festival',
      capacity: 1000,
      prestige: 3,
      pay: 5000,
      energy: 40,
      fameBoost: 50,
      requirements: { fame: 75 },
      location: 'Festival Grounds',
      emoji: '🎪',
      description: 'Major music festival stage'
    },
    {
      id: 4,
      name: 'Concert Hall',
      capacity: 2500,
      prestige: 4,
      pay: 15000,
      energy: 50,
      fameBoost: 100,
      requirements: { fame: 150 },
      location: 'Uptown',
      emoji: '🎵',
      description: 'Prestigious concert hall'
    },
    {
      id: 5,
      name: 'Arena',
      capacity: 10000,
      prestige: 5,
      pay: 50000,
      energy: 60,
      fameBoost: 250,
      requirements: { fame: 300 },
      location: 'Sports Complex',
      emoji: '🏟️',
      description: 'Massive arena for superstars'
    },
    {
      id: 6,
      name: 'Stadium',
      capacity: 50000,
      prestige: 6,
      pay: 200000,
      energy: 80,
      fameBoost: 500,
      requirements: { fame: 500 },
      location: 'Stadium District',
      emoji: '🏟️',
      description: 'Legendary stadium shows'
    }
  ];

  const handlePerform = async (venue) => {
    if (player.energy < venue.energy) return;

    setPerforming(true);
    setSelectedVenue(venue);

    // Use setTimeout to simulate performance
    setTimeout(() => {
      try {
        // Calculate performance success based on skills and audience
        const charismaBonus = (player.skills?.charisma || 1) / 10;
        const flowBonus = (player.skills?.flow || 1) / 10;
        const performanceQuality = Math.min(10, (charismaBonus + flowBonus) / 2);

        // Audience reaction multiplier
        const audienceMultiplier = Math.max(0.5, performanceQuality / 10);
        const actualPay = Math.floor(venue.pay * audienceMultiplier);
        const actualFameBoost = Math.floor(venue.fameBoost * audienceMultiplier);

        // Bonus for sold out shows
        const fanRatio = player.fans / venue.capacity;
        const soldOut = fanRatio >= 1;
        const soldOutBonus = soldOut ? 1.5 : Math.max(0.3, fanRatio);

        const finalPay = Math.floor(actualPay * soldOutBonus);
        const finalFameBoost = Math.floor(actualFameBoost * soldOutBonus);

        const newConcert = {
          id: Date.now(),
          venue: venue.name,
          date: `${player.week}/${player.year}`,
          capacity: venue.capacity,
          attendance: Math.min(venue.capacity, Math.floor(player.fans * 0.8)),
          earnings: finalPay,
          performanceQuality: Math.floor(performanceQuality),
          soldOut: soldOut
        };

        dispatch({ type: 'ADD_CONCERT', payload: newConcert });
        dispatch({
          type: 'UPDATE_PLAYER',
          payload: {
            energy: Math.max(0, player.energy - venue.energy),
            netWorth: player.netWorth + finalPay,
            fame: player.fame + finalFameBoost,
            reputation: player.reputation + Math.floor(finalFameBoost / 3)
          }
        });

        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now(),
            type: 'success',
            title: soldOut ? '🎉 SOLD OUT SHOW!' : '🎤 Concert Complete!',
            message: `${venue.name}: ${newConcert.attendance}/${venue.capacity} attendance. Earned $${finalPay}!`,
            timestamp: new Date().toISOString()
          }
        });

        setPerforming(false);
        setSelectedVenue(null);
      } catch (error) {
        console.error('Error in handlePerform:', error);
        setPerforming(false);
        setSelectedVenue(null);
      }
    }, 3000);
  };

  const canPerform = (venue) => {
    return player.fame >= venue.requirements.fame && player.energy >= venue.energy;
  };

  const getAttendanceEstimate = (venue) => {
    const fanRatio = player.fans / venue.capacity;
    if (fanRatio >= 1) return 'SOLD OUT';
    if (fanRatio >= 0.8) return 'Nearly Full';
    if (fanRatio >= 0.5) return 'Good Crowd';
    if (fanRatio >= 0.3) return 'Moderate';
    return 'Small Crowd';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Performance screen with proper error handling
  if (performing && selectedVenue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
        <motion.div
          className="text-center bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">{selectedVenue.emoji}</div>
          <h2 className="text-xl font-bold text-white mb-2">
            Performing at {selectedVenue.name}
          </h2>
          <p className="text-gray-300 mb-6">The crowd is loving it!</p>
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-sm text-gray-400">
            Estimated attendance: {getAttendanceEstimate(selectedVenue)}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pb-24 pt-16">
      <div className="px-4 space-y-4 max-w-mobile mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Live Concerts</h1>
          <p className="text-gray-300 text-sm">Perform live and connect with your fans</p>
        </div>

        {/* Player Status */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-orange-400">{player.energy}/100</div>
              <div className="text-xs text-gray-300">Energy</div>
            </div>
            <div>
              <div className="text-lg font-bold text-cyan-400">{formatNumber(player.fans)}</div>
              <div className="text-xs text-gray-300">Fans</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">{player.skills?.charisma || 1}/100</div>
              <div className="text-xs text-gray-300">Charisma</div>
            </div>
          </div>
        </div>

        {/* Concert Tips */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 p-4 rounded-2xl text-white shadow-xl">
          <h3 className="font-bold text-sm mb-2">🎤 Concert Tips</h3>
          <div className="text-xs text-gray-200 space-y-1">
            <p>• Higher charisma and flow = better performances</p>
            <p>• More fans = higher attendance and pay</p>
            <p>• Sold out shows give bonus fame and earnings</p>
            <p>• Build your skills to unlock bigger venues</p>
          </div>
        </div>

        {/* Available Venues */}
        <div>
          <h2 className="text-base font-bold text-white mb-3">Available Venues</h2>
          <div className="space-y-3">
            {venues.map((venue, index) => {
              const available = canPerform(venue);
              const attendanceEstimate = getAttendanceEstimate(venue);

              return (
                <motion.div
                  key={venue.id}
                  className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl transition-all ${
                    available ? 'hover:bg-white/20' : 'opacity-60'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center text-xl shadow-lg">
                          {venue.emoji}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-sm">{venue.name}</h3>
                          <div className="flex items-center space-x-2 text-cyan-400 text-xs">
                            <SafeIcon icon={FiMapPin} className="text-xs" />
                            <span>{venue.location}</span>
                          </div>
                          <p className="text-xs text-gray-300 mb-2">{venue.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-300">
                            <span>Capacity: {formatNumber(venue.capacity)}</span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <SafeIcon icon={FiStar} className="text-orange-400" />
                              <span>Prestige: {venue.prestige}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expected Attendance */}
                    <div className="mb-4 p-3 bg-black/20 rounded-2xl">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-white">Expected Attendance:</span>
                        <span className={`text-xs font-bold ${
                          attendanceEstimate === 'SOLD OUT' ? 'text-green-400' :
                          attendanceEstimate === 'Nearly Full' ? 'text-cyan-400' :
                          attendanceEstimate === 'Good Crowd' ? 'text-orange-400' : 'text-red-400'
                        }`}>
                          {attendanceEstimate}
                        </span>
                      </div>
                      <div className="w-full bg-black/30 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            attendanceEstimate === 'SOLD OUT' ? 'bg-green-400' :
                            attendanceEstimate === 'Nearly Full' ? 'bg-cyan-400' :
                            attendanceEstimate === 'Good Crowd' ? 'bg-orange-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${Math.min(100, (player.fans / venue.capacity) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 bg-black/20 rounded-2xl">
                        <SafeIcon icon={FiDollarSign} className="text-green-400 mx-auto mb-1 text-sm" />
                        <div className="text-sm font-bold text-white">${formatNumber(venue.pay)}</div>
                        <div className="text-xs text-gray-300">Base Pay</div>
                      </div>
                      <div className="text-center p-2 bg-black/20 rounded-2xl">
                        <SafeIcon icon={FiZap} className="text-orange-400 mx-auto mb-1 text-sm" />
                        <div className="text-sm font-bold text-white">{venue.energy}</div>
                        <div className="text-xs text-gray-300">Energy</div>
                      </div>
                      <div className="text-center p-2 bg-black/20 rounded-2xl">
                        <SafeIcon icon={FiTrendingUp} className="text-cyan-400 mx-auto mb-1 text-sm" />
                        <div className="text-sm font-bold text-white">+{venue.fameBoost}</div>
                        <div className="text-xs text-gray-300">Fame</div>
                      </div>
                    </div>

                    {/* Requirements */}
                    {!available && (
                      <div className="mb-3 p-3 bg-red-500/10 border border-red-400/30 rounded-2xl">
                        <p className="text-xs text-red-400 font-medium">Requirements:</p>
                        <div className="text-xs text-red-400 mt-1">
                          {player.fame < venue.requirements.fame && (
                            <span>• Need {venue.requirements.fame} fame (you have {player.fame})</span>
                          )}
                          {player.energy < venue.energy && (
                            <span>• Need {venue.energy} energy (you have {player.energy})</span>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handlePerform(venue)}
                      disabled={!available}
                      className={`w-full py-3 px-4 rounded-2xl font-semibold transition-all text-sm ${
                        available
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <SafeIcon icon={FiMic} className="inline mr-2" />
                      {available ? 'Perform Here' : 'Requirements Not Met'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Concert History */}
        {concerts.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-white mb-3">Concert History</h2>
            <div className="space-y-2">
              {concerts.slice(-5).reverse().map((concert) => (
                <div key={concert.id} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{concert.venue}</h4>
                      <p className="text-xs text-gray-300">{concert.date}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-300 mt-1">
                        <span>{concert.attendance}/{concert.capacity} attendance</span>
                        {concert.soldOut && (
                          <span className="text-green-400 font-medium">SOLD OUT!</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-green-400">
                        ${formatNumber(concert.earnings)}
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <SafeIcon
                            key={i}
                            icon={FiStar}
                            className={`text-xs ${
                              i < (concert.performanceQuality || 0) ? 'text-orange-400' : 'text-gray-500'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}