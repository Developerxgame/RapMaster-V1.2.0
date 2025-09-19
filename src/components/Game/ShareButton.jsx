import React from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShare2 } = FiIcons;

export default function ShareButton({ onShare, className = '', size = 'default' }) {
  const sizeClasses = {
    small: 'p-2 text-sm',
    default: 'p-3 text-base',
    large: 'p-4 text-lg'
  };

  return (
    <button
      onClick={onShare}
      className={`flex items-center justify-center space-x-2 bg-gradient-to-r from-ios-blue to-ios-purple text-white rounded-ios font-semibold hover:shadow-ios transition-all active:scale-95 ${sizeClasses[size]} ${className}`}
    >
      <SafeIcon icon={FiShare2} />
      <span>Share</span>
    </button>
  );
}