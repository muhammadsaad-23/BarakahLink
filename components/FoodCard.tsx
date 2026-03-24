import React, { useMemo } from 'react';
import { FoodDrop } from '../types';

interface FoodCardProps {
  drop: FoodDrop;
  onClick: (drop: FoodDrop) => void;
}

function formatTimeLeft(end: Date): string {
  const diff = end.getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

export const FoodCard: React.FC<FoodCardProps> = ({ drop, onClick }) => {
  const end       = useMemo(() => new Date(drop.availableUntil), [drop.availableUntil]);
  const start     = useMemo(() => new Date(drop.pickupStartTime), [drop.pickupStartTime]);
  const now       = Date.now();
  const elapsed   = now - start.getTime();
  const total     = end.getTime() - start.getTime();
  const progress  = Math.min(Math.max((elapsed / total) * 100, 0), 100);
  const remaining = Math.max(100 - progress, 0);
  const isAvailable = drop.status === 'available' && now < end.getTime();

  const statusLabel = drop.status === 'claimed' ? 'Claimed' : isAvailable ? 'Available' : 'Expired';
  const statusClass = drop.status === 'claimed'
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    : isAvailable
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

  return (
    <div
      onClick={() => onClick(drop)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(drop)}
      aria-label={`${drop.title} — ${statusLabel}`}
      className="group relative cursor-pointer fade-up focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 rounded-[3rem]"
    >
      <div className={`relative overflow-hidden rounded-[3rem] border border-white/5 transition-all duration-500 celestial-glass p-8 md:p-10 hover:border-amber-400/30 hover:-translate-y-2 hover:shadow-[0_30px_80px_-15px_rgba(0,0,0,0.5)] ${drop.status !== 'available' ? 'opacity-55 saturate-[0.3]' : ''}`}>

        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Corner motif */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.07] text-amber-400 translate-x-10 -translate-y-10 group-hover:translate-x-5 group-hover:-translate-y-5 transition-transform duration-700 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0L55 45L100 50L55 55L50 100L45 55L0 50L45 45Z"/></svg>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="space-y-3 pr-3 min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#fbbf24] shrink-0" />
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.45em] truncate">{drop.donorName}</p>
            </div>
            <h3 className="serif text-4xl md:text-5xl text-white tracking-tight leading-[0.9] text-glow-gold">{drop.title}</h3>
          </div>
          <span className={`px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border shrink-0 ${statusClass}`}>
            {statusLabel}
          </span>
        </div>

        <div className="space-y-6 relative z-10">
          {/* Time window bar */}
          {isAvailable && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-amber-200/40 uppercase tracking-[0.25em]">
                <span>Pickup window</span>
                <span className="text-amber-400/70">{formatTimeLeft(end)}</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-700 to-amber-400 rounded-full transition-all duration-[3000ms] ease-out"
                  style={{ width: `${remaining}%` }}
                />
              </div>
            </div>
          )}

          {/* Address */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-base tracking-tight truncate">{drop.pickupAddress}</p>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">{drop.city}</p>
            </div>
          </div>

          {/* Quantity + tags */}
          <div className="flex justify-between items-end">
            <div className="bg-emerald-950/50 px-5 py-3 rounded-2xl border border-white/5">
              <span className="text-[8px] uppercase font-black text-amber-500/50 tracking-widest block mb-0.5">Qty</span>
              <span className="text-base font-black text-white">{drop.quantity}</span>
            </div>
            <div className="flex gap-2 flex-wrap justify-end max-w-[55%]">
              {drop.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-4 py-1.5 bg-white/5 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
