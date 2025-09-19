import React from 'react';
import {useNavigate,useLocation} from 'react-router-dom';
import {useGame} from '../../context/GameContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiHome,FiBriefcase,FiMusic,FiGlobe,FiShoppingBag,FiBarChart3,FiTrendingUp,FiMic,FiAward}=FiIcons;

export default function BottomNav() {
const navigate=useNavigate();
const location=useLocation();
const {dispatch}=useGame();

const navItems=[ 
{icon: FiHome,path: '/game/home',label: 'Home'},
{icon: FiBriefcase,path: '/game/job',label: 'Work'},
{icon: FiMusic,path: '/game/studio',label: 'Studio'},
{icon: FiMic,path: '/game/concerts',label: 'Shows'},
{icon: FiGlobe,path: '/game/social',label: 'Social'},
{icon: FiShoppingBag,path: '/game/shop',label: 'Shop'},
{icon: FiBarChart3,path: '/game/stats',label: 'Stats'},
{icon: FiTrendingUp,path: '/game/skills',label: 'Skills'},
{icon: FiAward,path: '/game/awards',label: 'Awards'} 
];

const handleNavigation=(path)=> {
navigate(path);
dispatch({type: 'SET_CURRENT_PAGE',payload: path.split('/').pop()});
};

return ( 
<div className="fixed bottom-0 left-0 right-0 bg-dark-bg/95 backdrop-blur-xl border-t border-dark-border/30"> 
<div className="flex items-center justify-around px-1 py-2 pb-8 overflow-x-auto max-w-mobile mx-auto"> 
{navItems.map((item)=> {
const isActive=location.pathname===item.path;
return ( 
<button key={item.path} 
onClick={()=> handleNavigation(item.path)} 
className={`flex flex-col items-center py-2 px-2 rounded-game transition-all duration-300 min-w-0 flex-shrink-0 ${isActive ? 'text-neon-cyan bg-neon-cyan/10 shadow-glow' : 'text-text-muted hover:text-text-primary hover:bg-dark-surface/30'}`} 
> 
<div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-neon-cyan/20 shadow-neon' : 'hover:bg-dark-surface/20'}`}> 
<SafeIcon icon={item.icon} className="text-sm" /> 
</div> 
<span className="text-xs font-medium mt-1 truncate max-w-12">{item.label}</span> 
</button> 
);})} 
</div> 
</div> 
);
}