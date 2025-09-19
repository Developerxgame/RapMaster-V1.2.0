import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import Header from './Game/Header';
import BottomNav from './Game/BottomNav';
import QuickActionMenu from './Game/QuickActionMenu';
import HomePage from './Game/HomePage';
import JobPage from './Game/JobPage';
import MusicStudioPage from './Game/MusicStudioPage';
import SocialMediaPage from './Game/SocialMediaPage';
import ShopPage from './Game/ShopPage';
import StatsPage from './Game/StatsPage';
import SkillsPage from './Game/SkillsPage';
import ConcertsPage from './Game/ConcertsPage';
import AwardsPage from './Game/AwardsPage';
import CollaborationsPage from './Game/CollaborationsPage';

export default function GameLayout() {
  const { state } = useGame();

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
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/concerts" element={<ConcertsPage />} />
          <Route path="/awards" element={<AwardsPage />} />
          <Route path="/collaborations" element={<CollaborationsPage />} />
        </Routes>
      </main>
      <BottomNav />
      <QuickActionMenu />
    </div>
  );
}