/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Theme Primary Colors
        'dark-bg': '#0F0F23',
        'dark-surface': '#1A1A2E',
        'dark-card': '#16213E',
        'dark-border': '#2A2A5C',
        
        // Neon Accent Colors
        'neon-purple': '#8B5CF6',
        'neon-cyan': '#06B6D4',
        'neon-pink': '#EC4899',
        'neon-green': '#10B981',
        'neon-orange': '#F59E0B',
        'neon-red': '#EF4444',
        'neon-yellow': '#EAB308',
        
        // Glow Colors
        'glow-purple': '#A855F7',
        'glow-cyan': '#22D3EE',
        'glow-pink': '#F472B6',
        'glow-green': '#34D399',
        
        // Text Colors
        'text-primary': '#F8FAFC',
        'text-secondary': '#CBD5E1',
        'text-muted': '#64748B',
        'text-disabled': '#475569',
        
        // Status Colors
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
        'info': '#06B6D4',
        
        // Legacy colors for backward compatibility
        'rap-gold': '#FFD700',
        'rap-purple': '#8B5CF6',
        'rap-dark': '#0F0F23',
      },
      fontFamily: {
        'game': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'game': '12px',
        'game-lg': '16px',
        'game-xl': '20px',
        'game-2xl': '24px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.4)',
        'glow-xl': '0 0 60px rgba(139, 92, 246, 0.5)',
        'neon': '0 0 10px currentColor',
        'neon-lg': '0 0 20px currentColor',
        'neon-xl': '0 0 30px currentColor',
        'dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'neon-glow': 'neon-glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'bounce-glow': 'bounce-glow 1s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)' },
        },
        'neon-glow': {
          '0%': { textShadow: '0 0 10px currentColor' },
          '100%': { textShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-glow': {
          '0%, 100%': { 
            transform: 'scale(1)',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
          },
          '50%': { 
            transform: 'scale(1.05)',
            boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)'
          },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
      },
      screens: {
        'xs': '375px',
        'mobile': '428px',
      },
    },
  },
  plugins: [],
}