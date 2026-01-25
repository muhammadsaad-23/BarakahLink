
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', showText = true, light = false }) => {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', sub: 'text-[7px]' },
    md: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-[9px]' },
    lg: { icon: 'w-20 h-20', text: 'text-4xl', sub: 'text-[11px]' },
    xl: { icon: 'w-32 h-32', text: 'text-6xl', sub: 'text-[14px]' },
  };

  const currentSize = sizes[size];
  const primaryColor = light ? 'text-white' : 'text-emerald-950';
  const secondaryColor = 'text-amber-500';

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* The Emblem */}
      <div className={`relative ${currentSize.icon} flex-shrink-0 group`}>
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Main Background Container */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-2xl shadow-xl transform transition-transform duration-500 group-hover:rotate-[15deg] group-hover:scale-110 overflow-hidden ring-2 ring-amber-500/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent)]"></div>
          
          {/* SVG Symbol */}
          <svg viewBox="0 0 100 100" className="w-full h-full p-2 text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            {/* The Crescent */}
            <path 
              fill="currentColor" 
              d="M75,50 c0,13.8 -11.2,25 -25,25 s-25-11.2 -25-25 s11.2-25,25-25 c4.2,0,8.1,1,11.6,2.8 c-8.5,2.5-14.6,10.4-14.6,19.7 c0,11.3,9.2,20.5,20.5,20.5 c3.7,0,7.1-1,10.1-2.7 C72.5,43.3,75,46.4,75,50z" 
            />
            {/* The 8-pointed Star (Mashrabiya Star) */}
            <path 
              fill="white" 
              fillOpacity="0.8"
              d="M50 20l3.5 13.5h13.5l-10.5 8 4 13.5-10.5-8.5-10.5 8.5 4-13.5-10.5-8h13.5z"
              className="animate-pulse"
              style={{ animationDuration: '4s' }}
            />
            {/* The Provision Bowl Curve */}
            <path 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none" 
              d="M30,75 q20,10 40,0" 
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`serif font-bold tracking-tight leading-none ${currentSize.text} ${primaryColor}`}>
            Barakat <span className="italic text-amber-500">Meal</span>
          </span>
          <div className="flex items-center space-x-2 mt-1.5 opacity-80">
            <div className="h-[1px] w-4 bg-amber-500/50"></div>
            <span className={`font-black uppercase tracking-[0.4em] ${currentSize.sub} ${light ? 'text-amber-200' : 'text-amber-600'}`}>
              Community Sadaqah
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
