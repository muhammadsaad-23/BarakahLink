
import React from 'react';
import { FoodDrop } from '../types';

interface FoodCardProps {
  drop: FoodDrop;
  onClick: (drop: FoodDrop) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ drop, onClick }) => {
  const now = new Date();
  const start = new Date(drop.pickupStartTime);
  const end = new Date(drop.availableUntil);
  
  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  const progress = Math.min(Math.max((elapsed / total) * 100, 0), 100);
  
  const isStarted = now >= start;
  const isEnded = now >= end;

  const getStatusColor = () => {
    if (drop.status === 'claimed') return 'bg-amber-100 text-amber-800';
    if (isEnded) return 'bg-slate-100 text-slate-500';
    if (!isStarted) return 'bg-blue-50 text-blue-600';
    return 'bg-emerald-50 text-emerald-700';
  };

  return (
    <div 
      onClick={() => onClick(drop)}
      className={`group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-premium hover:shadow-emerald-900/10 hover:translate-y-[-4px] transition-all duration-300 cursor-pointer ${drop.status === 'claimed' ? 'opacity-75 grayscale-[0.3]' : ''}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">{drop.donorName}</p>
          <h3 className="serif text-2xl text-slate-900 leading-tight group-hover:text-[#064e3b] transition-colors">{drop.title}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-current ${getStatusColor()}`}>
          {drop.status === 'claimed' ? 'RESERVED' : (isEnded ? 'EXPIRED' : (isStarted ? 'LIVE' : 'UPCOMING'))}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center text-xs text-slate-500 font-medium">
          <svg className="w-4 h-4 mr-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
          {drop.city} • {drop.pickupAddress.split(',')[0]}
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            <span>Pickup window</span>
            <span>{Math.round(100 - progress)}% time left</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${progress > 80 ? 'bg-amber-500' : 'bg-[#064e3b]'}`} 
              style={{ width: `${100 - progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-black text-slate-900">
            <span>{start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            <span>{end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {drop.tags.map(tag => (
          <span key={tag} className="px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-bold text-slate-600 uppercase tracking-wider">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
