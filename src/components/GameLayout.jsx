import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { CareerProgression } from '../utils/careerSystem';
import Header from './Game/Header';
import BottomNav from './Game/BottomNav';
import LevelUpModal from './Game/LevelUpModal';
import HomePage from './Game/HomePage';
import JobPage from './Game/JobPage';
import MusicStudioPage from './Game/MusicStudioPage';
import SocialMediaPage from './Game/SocialMediaPage';
import ShopPage from './Game/ShopPage';
import EnhancedStatsPage from './Game/EnhancedStatsPage';
import SkillsPage from './Game/SkillsPage';
import ConcertsPage from './Game/ConcertsPage';
import AwardsPage from './Game/AwardsPage';
import CollaborationsPage from './Game/CollaborationsPage';
import ReleasePage from './Game/ReleasePage';

export default function GameLayout() {
  const { state } = useGame();
  const [levelUpModal, setLevelUpModal] = useState({
    isOpen: false,
    newLevel: null,
    previousLevel: null
  });
  const [previousLevel, setPreviousLevel] = useState(null);

  // Monitor level changes
  useEffect(() => {
    const currentLevel = CareerProgression.getCurrentLevel(
      state.player.fame,
      state.player.reputation
    );

    if (previousLevel && currentLevel.id > previousLevel.id) {
      // Level up detected!
      setLevelUpModal({
        isOpen: true,
        newLevel: currentLevel,
        previousLevel: previousLevel
      });
    }

    setPreviousLevel(currentLevel);
  }, [state.player.fame, state.player.reputation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex flex-col">
      <Header />
      <main className="flex-1 pb-20 pt-12">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/job" element={<JobPage />} />
          <Route path="/studio" element={<MusicStudioPage />} />
          <Route path="/social" element={<SocialMediaPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/stats" element={<EnhancedStatsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/concerts" element={<ConcertsPage />} />
          <Route path="/awards" element={<AwardsPage />} />
          <Route path="/collaborations" element={<CollaborationsPage />} />
          <Route path="/releases" element={<ReleasePage />} />
        </Routes>
      </main>
      <BottomNav />

      {/* Level Up Modal */}
      <LevelUpModal
        isOpen={levelUpModal.isOpen}
        onClose={() => setLevelUpModal({ isOpen: false, newLevel: null, previousLevel: null })}
        newLevel={levelUpModal.newLevel}
        previousLevel={levelUpModal.previousLevel}
      />
    </div>
  );
}