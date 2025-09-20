import React from 'react';
import { GetStarted } from '@questlabs/react-sdk';
import { questConfig } from '../../config/questConfig';
import { useGame } from '../../context/GameContext';
import { useNavigate } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft } = FiIcons;

export default function GetStartedPage() {
  const { state } = useGame();
  const navigate = useNavigate();

  // Use stored userId or fallback to config
  const userId = localStorage.getItem('userId') || questConfig.USER_ID;

  return (
    <div className="min-h-screen bg-dark-bg pb-24 pt-16">
      <div className="px-4 space-y-4 max-w-mobile mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-dark-surface/50 rounded-game transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-xl text-neon-cyan" />
          </button>
          <h1 className="text-xl font-semibold text-text-primary">Get Started</h1>
          <div className="w-10"></div>
        </div>

        {/* Quest GetStarted Component */}
        <div className="game-card p-4 shadow-dark">
          <GetStarted 
            questId={questConfig.GET_STARTED_QUESTID}
            uniqueUserId={userId}
            autoHide={false}
          >
            <GetStarted.Header />
            <GetStarted.Progress />
            <GetStarted.Content />
            <GetStarted.Footer />
          </GetStarted>
        </div>
      </div>
    </div>
  );
}