
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

  return (
    <div 
      onClick={() => onClick(drop)}
      className={`bg-white rounded-[1.75rem] shadow-sm border border-slate-200/60 hover:shadow-xl hover:shadow-emerald-50 hover:translate-y-[-2px] transition-all duration-300 cursor-pointer p-6 group flex flex-col h-full ${drop.status === 'claimed' ? 'opacity-60 grayscale-[0.5]' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.15em] mb-1">{drop.donorName}</span>
          <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight">{drop.title}</h3>
        </div>
        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${drop.status === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
          {drop.status === 'claimed' ? 'RESERVED' : drop.status}
        </span>
      </div>

      {/* Timeline Visual */}
      <div className="mb-4">
        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
          <span>{start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          <span className={isEnded ? 'text-rose-500' : 'text-emerald-600'}>
            {isEnded ? 'Expired' : !isStarted ? 'Pending' : 'Pickup Open'}
          </span>
          <span>{end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${isEnded ? 'bg-slate-300' : 'bg-emerald-500'}`} 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-4 leading-relaxed italic">
        "{drop.aiSummary || drop.description}"
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-lg border border-emerald-100">
          {drop.city}
        </span>
        {drop.tags.map(tag => (
          <span key={tag} className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-100 group-hover:border-emerald-100 transition-colors">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center text-xs font-bold text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-emerald-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="truncate">{drop.pickupAddress}</span>
        </div>
      </div>
    </div>
  );
};
