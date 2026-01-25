
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

  const getStatusConfig = () => {
    if (drop.status === 'claimed') return { label: 'Secured', class: 'bg-amber-100 text-amber-800 border-amber-200' };
    if (isEnded) return { label: 'Expired', class: 'bg-slate-100 text-slate-400 border-slate-200' };
    if (!isStarted) return { label: 'Upcoming', class: 'bg-blue-50 text-blue-600 border-blue-100' };
    return { label: 'Live Now', class: 'bg-emerald-950 text-amber-400 border-emerald-950 shadow-lg shadow-emerald-900/20' };
  };

  const status = getStatusConfig();

  return (
    <div 
      onClick={() => onClick(drop)}
      className={`group relative bg-white p-12 rounded-[4rem] border border-emerald-900/5 premium-shadow hover:translate-y-[-12px] transition-all duration-700 cursor-pointer overflow-hidden ${drop.status === 'claimed' ? 'opacity-80 grayscale-[0.3]' : ''}`}
    >
      <div className="absolute top-0 right-0 p-10">
        <span className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border transition-all duration-700 group-hover:scale-110 ${status.class}`}>
          {status.label}
        </span>
      </div>

      <div className="mb-12 pt-6">
        <div className="flex items-center space-x-3 mb-6">
           <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
           <p className="text-[12px] font-black text-amber-600 uppercase tracking-[0.5em]">{drop.donorName}</p>
        </div>
        <h3 className="serif text-6xl text-slate-950 leading-[0.85] tracking-tighter transition-all duration-700 group-hover:text-emerald-900 group-hover:tracking-normal">{drop.title}</h3>
      </div>

      <div className="space-y-10">
        <div className="flex items-center text-lg text-slate-500 font-bold tracking-tight">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mr-5 text-emerald-900 shadow-sm border border-emerald-100 transition-transform group-hover:rotate-12">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
          </div>
          <span className="text-slate-900 font-black mr-2">{drop.city}</span>
          <span className="opacity-40">•</span>
          <span className="ml-2 font-medium">{drop.pickupAddress.split(',')[0]}</span>
        </div>

        <div className="p-10 bg-slate-50 rounded-[3rem] border border-emerald-900/5 transition-all duration-700 group-hover:bg-white group-hover:shadow-inner">
          <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">
            <span>Preservation</span>
            <span className="text-emerald-900">{Math.round(100 - progress)}% Vitality</span>
          </div>
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-[2000ms] gold-shimmer ${progress > 80 ? 'bg-amber-600' : 'bg-emerald-900'}`} 
              style={{ width: `${100 - progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-6 text-[13px] font-black text-slate-950">
            <span className="opacity-40">{start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            <span className="px-3 py-1 bg-white rounded-lg shadow-sm">{drop.quantity}</span>
            <span className="opacity-40">{end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-12">
        {drop.tags.map(tag => (
          <span key={tag} className="px-6 py-2.5 bg-white border border-emerald-100/50 rounded-2xl text-[10px] font-black text-emerald-900 uppercase tracking-[0.25em] transition-all duration-500 group-hover:border-emerald-900/20 group-hover:shadow-lg shadow-sm">
            {tag}
          </span>
        ))}
      </div>
      
      {/* Decorative Shimmering Background Mask */}
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-900/05 rounded-full blur-3xl group-hover:bg-emerald-900/10 transition-all duration-1000"></div>
    </div>
  );
};
