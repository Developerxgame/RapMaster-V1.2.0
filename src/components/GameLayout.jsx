import React from 'react';
import {Routes,Route} from 'react-router-dom';
import {useGame} from '../context/GameContext';
import Header from './game/Header';
import BottomNav from './game/BottomNav';
import HomePage from './game/HomePage';
import JobPage from './game/JobPage';
import MusicStudioPage from './game/MusicStudioPage';
import SocialMediaPage from './game/SocialMediaPage';
import ShopPage from './game/ShopPage';
import StatsPage from './game/StatsPage';
import SkillsPage from './game/SkillsPage';
import ConcertsPage from './game/ConcertsPage';
import AwardsPage from './game/AwardsPage';

export default function GameLayout() {
const {state}=useGame();

return ( 
<div className="min-h-screen bg-dark-bg text-text-primary flex flex-col font-game"> 
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
</Routes> 
</main> 
<BottomNav /> 
</div> 
);
}