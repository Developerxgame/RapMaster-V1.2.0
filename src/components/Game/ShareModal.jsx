import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiShare2, FiTwitter, FiFacebook, FiInstagram, FiCopy, FiCheck, FiDownload } = FiIcons;

export default function ShareModal({ isOpen, onClose, shareData }) {
  const { state } = useGame();
  const { player } = state;
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  if (!shareData) return null;

  const generateShareText = (platform) => {
    const { type, title, achievement, stats } = shareData;
    const baseText = `🎤 ${player.stageName} `;

    switch (type) {
      case 'release':
        return {
          twitter: `${baseText}just dropped "${title}"! 🔥 Check it out on RapMaster Simulator! #RapMaster #NewMusic #RapGame`,
          facebook: `${baseText}just released "${title}"! Building my rap empire one track at a time. Playing RapMaster Simulator - the ultimate rap career game!`,
          instagram: `${baseText}📀 New release: "${title}"\n🎯 Fame: ${stats?.fame || player.fame}\n👥 Fans: ${(stats?.fans || player.fans).toLocaleString()}\n💰 Net Worth: $${(stats?.netWorth || player.netWorth).toLocaleString()}\n\n#RapMaster #MusicGame #RapSimulator`,
          generic: `🎤 ${player.stageName} just dropped "${title}"! 🔥 Playing RapMaster Simulator - build your rap empire!`
        };
      case 'achievement':
        return {
          twitter: `${baseText}just achieved "${achievement}"! 🏆 Living the rap dream in RapMaster Simulator! #RapMaster #Achievement #Success`,
          facebook: `${baseText}hit a major milestone: "${achievement}"! This rap simulation game is incredible - building my empire from the ground up!`,
          instagram: `${baseText}🏆 Achievement Unlocked!\n"${achievement}"\n\n🎯 Current Stats:\n💫 Fame: ${player.fame}\n👥 Fans: ${player.fans.toLocaleString()}\n💰 Net Worth: $${player.netWorth.toLocaleString()}\n\n#RapMaster #Achievement #RapSimulator`,
          generic: `🎤 ${player.stageName} achieved "${achievement}"! 🏆 Playing RapMaster Simulator!`
        };
      case 'milestone':
        return {
          twitter: `${baseText}reached ${stats?.fans?.toLocaleString() || player.fans.toLocaleString()} fans! 🚀 The grind never stops! #RapMaster #Milestone #RapGame`,
          facebook: `${baseText}career update: ${stats?.fans?.toLocaleString() || player.fans.toLocaleString()} fans and counting! RapMaster Simulator is the perfect game for music lovers!`,
          instagram: `${baseText}📈 Career Milestone!\n👥 ${(stats?.fans || player.fans).toLocaleString()} Fans\n💫 ${stats?.fame || player.fame} Fame\n💰 $${(stats?.netWorth || player.netWorth).toLocaleString()} Net Worth\n\n#RapMaster #Milestone #RapCareer`,
          generic: `🎤 ${player.stageName} reached ${(stats?.fans || player.fans).toLocaleString()} fans! 🚀 Playing RapMaster Simulator!`
        };
      case 'career':
        return {
          twitter: `${baseText}career stats: ${player.fame} Fame, ${player.fans.toLocaleString()} fans, $${player.netWorth.toLocaleString()} net worth! 💪 #RapMaster #RapCareer`,
          facebook: `${baseText}is building a rap empire! Current stats: ${player.fame} Fame, ${player.fans.toLocaleString()} fans, $${player.netWorth.toLocaleString()} net worth. Join me in RapMaster Simulator!`,
          instagram: `${baseText}📊 Career Stats:\n💫 Fame: ${player.fame}\n👥 Fans: ${player.fans.toLocaleString()}\n💰 Net Worth: $${player.netWorth.toLocaleString()}\n🎵 Age: ${player.age}\n📍 ${player.city}\n\n#RapMaster #CareerStats #RapSimulator`,
          generic: `🎤 ${player.stageName} - Fame: ${player.fame}, Fans: ${player.fans.toLocaleString()}, Net Worth: $${player.netWorth.toLocaleString()}! Playing RapMaster Simulator!`
        };
      default:
        return {
          twitter: `${baseText}is building a rap empire! 🎤 #RapMaster #RapGame`,
          facebook: `${baseText}is living the rap dream in RapMaster Simulator!`,
          instagram: `${baseText}🎤✨ #RapMaster #RapSimulator`,
          generic: `🎤 ${player.stageName} is building a rap empire! Playing RapMaster Simulator!`
        };
    }
  };

  const shareTexts = generateShareText();

  const handleShare = async (platform) => {
    setSelectedPlatform(platform);
    const shareText = shareTexts[platform] || shareTexts.generic;
    const gameUrl = 'https://rapmaster-simulator.com'; // Replace with actual game URL

    try {
      switch (platform) {
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(gameUrl)}`,
            '_blank',
            'width=550,height=420'
          );
          break;
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}&quote=${encodeURIComponent(shareText)}`,
            '_blank',
            'width=550,height=420'
          );
          break;
        case 'instagram':
          // Instagram doesn't support direct sharing, copy to clipboard
          await navigator.clipboard.writeText(shareText);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          break;
        case 'copy':
          await navigator.clipboard.writeText(shareText);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          break;
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: 'RapMaster Simulator',
              text: shareText,
              url: gameUrl
            });
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }

    setTimeout(() => setSelectedPlatform(null), 1000);
  };

  const generateImage = () => {
    // Create a canvas for sharing image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#6B46C1');
    gradient.addColorStop(1, '#1E293B');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('RapMaster Simulator', canvas.width / 2, 120);

    // Player name
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`🎤 ${player.stageName}`, canvas.width / 2, 200);

    // Stats
    ctx.font = '36px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    const stats = [
      `💫 Fame: ${player.fame}`,
      `👥 Fans: ${player.fans.toLocaleString()}`,
      `💰 Net Worth: $${player.netWorth.toLocaleString()}`,
      `🎵 Age: ${player.age}`,
      `📍 ${player.city}`
    ];

    stats.forEach((stat, index) => {
      ctx.fillText(stat, 100, 300 + (index * 50));
    });

    // Achievement/Release info
    if (shareData.title) {
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = '#FFD700';
      ctx.textAlign = 'center';
      ctx.fillText(`"${shareData.title}"`, canvas.width / 2, 580);
    }

    return canvas.toDataURL('image/png');
  };

  const downloadImage = () => {
    const dataUrl = generateImage();
    const link = document.createElement('a');
    link.download = `${player.stageName}-RapMaster-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const platforms = [
    { id: 'twitter', name: 'Twitter', icon: FiTwitter, color: 'bg-neon-cyan', description: 'Share on Twitter' },
    { id: 'facebook', name: 'Facebook', icon: FiFacebook, color: 'bg-neon-cyan', description: 'Share on Facebook' },
    { id: 'instagram', name: 'Instagram', icon: FiInstagram, color: 'bg-gradient-to-r from-neon-purple to-neon-pink', description: 'Copy for Instagram' },
    { id: 'copy', name: 'Copy Text', icon: copied ? FiCheck : FiCopy, color: copied ? 'bg-neon-green' : 'bg-text-muted', description: copied ? 'Copied!' : 'Copy to clipboard' }
  ];

  // Add native share if supported
  if (navigator.share) {
    platforms.unshift({
      id: 'native',
      name: 'Share',
      icon: FiShare2,
      color: 'bg-neon-cyan',
      description: 'Share via device'
    });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            className="game-card shadow-glow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-dark-border/30">
              <h2 className="text-lg font-bold text-text-primary">Share Achievement</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-dark-surface/50 rounded-game transition-colors"
              >
                <SafeIcon icon={FiX} className="text-lg text-text-muted" />
              </button>
            </div>

            {/* Content Preview */}
            <div className="p-4 border-b border-dark-border/30">
              <div className="bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 p-4 rounded-game text-text-primary mb-4 shadow-glow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-game flex items-center justify-center text-lg text-white shadow-glow">
                    🎤
                  </div>
                  <div>
                    <h3 className="font-bold text-base neon-text">{player.stageName}</h3>
                    <p className="text-text-secondary text-sm">{player.city}</p>
                  </div>
                </div>
                
                {shareData.type === 'release' && (
                  <div className="bg-dark-surface/30 p-3 rounded-game">
                    <p className="font-medium text-sm">🔥 New Release: "{shareData.title}"</p>
                  </div>
                )}
                
                {shareData.type === 'achievement' && (
                  <div className="bg-dark-surface/30 p-3 rounded-game">
                    <p className="font-medium text-sm">🏆 Achievement: "{shareData.achievement}"</p>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <div className="text-center">
                    <div className="font-bold text-neon-yellow animate-neon">{player.fame}</div>
                    <div className="text-text-muted">Fame</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-neon-green animate-neon">{player.fans.toLocaleString()}</div>
                    <div className="text-text-muted">Fans</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-neon-green animate-neon">${player.netWorth.toLocaleString()}</div>
                    <div className="text-text-muted">Net Worth</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-text-muted text-center">
                Share your rap career success with friends!
              </p>
            </div>

            {/* Platform Options */}
            <div className="p-4">
              <h3 className="font-bold text-text-primary mb-3 text-sm">Choose Platform</h3>
              <div className="space-y-3">
                {platforms.map((platform) => (
                  <motion.button
                    key={platform.id}
                    onClick={() => handleShare(platform.id)}
                    disabled={selectedPlatform === platform.id}
                    className={`w-full flex items-center space-x-4 p-3 rounded-game transition-all ${
                      selectedPlatform === platform.id
                        ? 'bg-dark-surface/50'
                        : 'bg-dark-surface/30 hover:bg-dark-surface/50 active:scale-95'
                    }`}
                    whileHover={{ scale: selectedPlatform === platform.id ? 1 : 1.01 }}
                    whileTap={{ scale: selectedPlatform === platform.id ? 1 : 0.98 }}
                  >
                    <div className={`w-10 h-10 ${platform.color} rounded-game flex items-center justify-center text-white shadow-glow`}>
                      {selectedPlatform === platform.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <SafeIcon icon={platform.icon} className="text-sm" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-text-primary text-sm">{platform.name}</div>
                      <div className="text-xs text-text-muted">{platform.description}</div>
                    </div>
                  </motion.button>
                ))}
                
                {/* Download Image Option */}
                <motion.button
                  onClick={downloadImage}
                  className="w-full flex items-center space-x-4 p-3 bg-dark-surface/30 hover:bg-dark-surface/50 rounded-game transition-all active:scale-95"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 bg-neon-purple rounded-game flex items-center justify-center text-white shadow-glow">
                    <SafeIcon icon={FiDownload} className="text-sm" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-text-primary text-sm">Download Image</div>
                    <div className="text-xs text-text-muted">Save as image to share anywhere</div>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Preview Text */}
            <div className="p-4 border-t border-dark-border/30">
              <h4 className="font-bold text-text-primary mb-2 text-sm">Preview Text</h4>
              <div className="bg-dark-surface/30 p-3 rounded-game text-xs text-text-secondary">
                {shareTexts.generic}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}