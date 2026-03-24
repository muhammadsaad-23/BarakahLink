import React from 'react';
import { UserRole, FoodDrop } from '../types';
import { AppUser } from '../App';
import { DIETARY_TAGS, CANADIAN_CITIES } from '../constants';
import { Navbar } from '../components/Navbar';
import { MapView } from '../components/MapView';
import { FoodCard } from '../components/FoodCard';
import { DonorDashboard } from '../components/DonorDashboard';
import { SMSView } from '../components/SMSView';
import { Button } from '../components/Button';
import { AuthView } from '../components/AuthView';
import { Logo } from '../components/Logo';
import { ToastType } from '../components/Toast';

interface AppViewProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: AppUser | null;
  view: string;
  setView: (view: string) => void;
  drops: FoodDrop[];
  allDrops: FoodDrop[];
  dropsLoading: boolean;
  selectedDrop: FoodDrop | null;
  setSelectedDrop: (drop: FoodDrop | null) => void;
  filter: string;
  setFilter: (filter: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  isReserving: boolean;
  setIsReserving: (val: boolean) => void;
  reserveName: string;
  setReserveName: (val: string) => void;
  reservePhone: string;
  setReservePhone: (val: string) => void;
  onAddDrop: (drop: Partial<FoodDrop>) => Promise<void>;
  onLogin: (role: UserRole, email: string, password: string, mode: 'login' | 'signup') => Promise<void>;
  onReserve: (e: React.FormEvent) => Promise<void>;
  onLogout?: () => void;
  showToast?: (message: string, type?: ToastType) => void;
}

// ── Skeleton loader for food cards ────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="celestial-glass rounded-[3rem] p-8 md:p-10 border border-white/5">
    <div className="skeleton h-3 w-28 rounded-full mb-6" />
    <div className="skeleton h-8 w-4/5 rounded-xl mb-3" />
    <div className="skeleton h-6 w-2/3 rounded-xl mb-10" />
    <div className="skeleton h-2 w-full rounded-full mb-8" />
    <div className="flex gap-4">
      <div className="skeleton w-10 h-10 rounded-xl" />
      <div className="flex-1">
        <div className="skeleton h-4 w-3/4 rounded mb-2" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
    </div>
  </div>
);

export const AppView: React.FC<AppViewProps> = (props) => {
  const {
    role, setRole, user, view, setView,
    drops, allDrops, dropsLoading,
    selectedDrop, setSelectedDrop,
    filter, setFilter, selectedCity, setSelectedCity,
    isReserving, setIsReserving,
    reserveName, setReserveName, reservePhone, setReservePhone,
    onAddDrop, onLogin, onReserve, onLogout,
  } = props;

  const myDrops = allDrops.filter((d) => d.donorId === user?.id);

  const renderHero = () => (
    <div className="relative max-w-7xl mx-auto pt-36 pb-60 px-6">
      <div className="flex flex-col items-center text-center">
        <div className="fade-up inline-flex items-center space-x-3 px-8 py-4 rounded-[2rem] glass-light border border-amber-500/20 mb-14 group hover:scale-105 transition-transform">
          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_14px_#fbbf24] animate-pulse" />
          <span className="text-[11px] font-black text-amber-200 uppercase tracking-[0.45em]">Active Support in Kitchener-Waterloo</span>
        </div>

        <h1 className="fade-up serif text-[4.5rem] md:text-[7rem] lg:text-[9rem] text-white mb-10 leading-[0.85] tracking-tighter select-none" style={{ animationDelay: '0.15s' }}>
          Share the <span className="italic text-amber-500 block text-glow-gold">Meal.</span>
        </h1>

        <p className="fade-up text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-20 px-4" style={{ animationDelay: '0.3s' }}>
          Bridging the gap between local food surplus and those who need it most. Simple, private, and community-driven.
        </p>

        <div className="fade-up flex flex-col sm:flex-row items-center justify-center gap-8 relative z-10" style={{ animationDelay: '0.45s' }}>
          <Button size="lg" className="px-20 py-9 text-xl shadow-[0_24px_80px_-16px_rgba(251,191,36,0.4)] hover:shadow-[0_32px_100px_-20px_rgba(251,191,36,0.55)]" onClick={() => setView('auth')}>
            Find Food
          </Button>
          <Button variant="outline" size="lg" className="px-16 py-9 text-lg text-white border-white/10 hover:bg-white/5" onClick={() => setView('sms')}>
            SMS Access
          </Button>
        </div>

        {/* Quick stats */}
        <div className="fade-up flex items-center gap-10 mt-20 text-center" style={{ animationDelay: '0.6s' }}>
          <div>
            <p className="text-3xl font-black text-amber-400">{allDrops.filter(d => d.status === 'available').length}</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-black">Active drops</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <p className="text-3xl font-black text-amber-400">{allDrops.filter(d => d.status === 'claimed').length}</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-black">Meals claimed</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <p className="text-3xl font-black text-amber-400">{[...new Set(allDrops.map(d => d.city))].length || 7}</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-black">Cities</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar role={role} onRoleChange={setRole} onNavigate={setView} currentView={view} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 pt-36 md:pt-52">
        {view === 'landing' && renderHero()}

        {view === 'auth' && (
          <div className="max-w-xl mx-auto py-16">
            <AuthView onLogin={onLogin} onCancel={() => setView('landing')} />
          </div>
        )}

        {view === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Left column */}
            <div className="lg:col-span-8 space-y-10">
              {/* Header + filters */}
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                  <h2 className="serif text-6xl md:text-8xl text-white tracking-tighter text-glow-gold">Pickups</h2>
                  <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 w-fit">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Location</span>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="bg-transparent text-amber-400 font-black focus:outline-none cursor-pointer text-sm"
                    >
                      <option value="All">All Regions</option>
                      {CANADIAN_CITIES.map((c) => <option key={c} value={c} className="bg-emerald-950">{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Tag filters */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                  {['All', ...DIETARY_TAGS.slice(0, 4)].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setFilter(tag)}
                      className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.35em] transition-all duration-300 whitespace-nowrap ${
                        filter === tag
                          ? 'bg-amber-500 text-emerald-950 shadow-[0_0_30px_rgba(251,191,36,0.25)]'
                          : 'bg-white/5 text-slate-400 border border-white/5 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </header>

              {/* Map */}
              <div className="h-[480px] md:h-[560px] rounded-[3.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.7)] border-[14px] border-white/5 celestial-glass">
                <MapView drops={drops.filter((d) => d.status === 'available')} onSelectDrop={setSelectedDrop} />
              </div>

              {/* Cards */}
              {dropsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {[1, 2, 3, 4].map((n) => <CardSkeleton key={n} />)}
                </div>
              ) : drops.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-white/8 rounded-[2.5rem]">
                  <div className="text-5xl mb-4 opacity-20">🍽️</div>
                  <p className="serif text-3xl text-slate-700">No drops found</p>
                  <p className="text-slate-600 text-sm mt-2">
                    {filter !== 'All' || selectedCity !== 'All' ? 'Try clearing your filters.' : 'Check back soon.'}
                  </p>
                  {(filter !== 'All' || selectedCity !== 'All') && (
                    <button
                      onClick={() => { setFilter('All'); setSelectedCity('All'); }}
                      className="mt-5 text-amber-500 text-sm font-black uppercase tracking-widest hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {drops.map((drop) => <FoodCard key={drop.id} drop={drop} onClick={setSelectedDrop} />)}
                </div>
              )}
            </div>

            {/* Right panel — drop detail */}
            <div className="lg:col-span-4">
              <div className="sticky top-44">
                {selectedDrop ? (
                  <div className="celestial-glass p-10 rounded-[3.5rem] border border-white/10 animate-in slide-in-from-right-8 duration-500 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]">
                    <div className="flex justify-between items-start mb-10">
                      <div className="space-y-3 pr-3">
                        <span className="text-[11px] font-black text-amber-500 uppercase tracking-[0.5em]">{selectedDrop.city}</span>
                        <h3 className="serif text-5xl md:text-6xl text-white leading-[0.85] tracking-tighter text-glow-gold">{selectedDrop.title}</h3>
                      </div>
                      <button
                        onClick={() => { setSelectedDrop(null); setIsReserving(false); }}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-rose-500/15 text-slate-400 hover:text-white transition-all shrink-0"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-8">
                      {selectedDrop.status === 'available' && !isReserving && (
                        <>
                          {selectedDrop.aiSummary && (
                            <div className="p-7 bg-white/5 rounded-[2rem] border border-white/8 italic text-slate-300 text-lg leading-relaxed">
                              "{selectedDrop.aiSummary}"
                            </div>
                          )}

                          <div className="space-y-1.5">
                            <span className="text-slate-500 uppercase tracking-[0.45em] text-[10px] font-black">Address</span>
                            <p className="text-xl font-black text-white leading-tight">{selectedDrop.pickupAddress}</p>
                          </div>

                          {selectedDrop.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {selectedDrop.tags.map((t) => (
                                <span key={t} className="px-4 py-1.5 bg-white/5 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400">{t}</span>
                              ))}
                            </div>
                          )}

                          <Button
                            fullWidth size="lg"
                            className="h-16 text-base rounded-[2rem]"
                            onClick={() => role === 'guest' ? setView('auth') : setIsReserving(true)}
                          >
                            {role === 'guest' ? 'Sign in to Reserve' : 'Reserve Pickup'}
                          </Button>
                        </>
                      )}

                      {selectedDrop.status === 'available' && isReserving && (
                        <form onSubmit={onReserve} className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                          <p className="text-slate-400 text-sm">Your name and number will be shared with the donor.</p>
                          <input
                            type="text" required
                            placeholder="Your name"
                            value={reserveName}
                            onChange={(e) => setReserveName(e.target.value)}
                            className="w-full px-7 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-white text-lg outline-none focus:border-amber-500/30 focus:ring-2 focus:ring-amber-500/10 transition-all"
                          />
                          <input
                            type="tel" required
                            placeholder="Phone number"
                            value={reservePhone}
                            onChange={(e) => setReservePhone(e.target.value)}
                            className="w-full px-7 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-white text-lg outline-none focus:border-amber-500/30 focus:ring-2 focus:ring-amber-500/10 transition-all"
                          />
                          <Button type="submit" fullWidth className="h-14 text-base">Confirm Pickup</Button>
                          <button type="button" onClick={() => setIsReserving(false)} className="w-full text-center text-xs text-slate-600 hover:text-white transition-colors font-black uppercase tracking-widest">
                            Cancel
                          </button>
                        </form>
                      )}

                      {selectedDrop.status === 'claimed' && (
                        <div className="text-center py-6 animate-in zoom-in-90 duration-700">
                          <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
                            </svg>
                          </div>
                          <h4 className="serif text-5xl text-white mb-3">Confirmed.</h4>
                          <p className="text-sm text-slate-500 mb-2">Show this code at pickup</p>
                          <span className="text-xl font-black text-amber-500 tracking-[0.4em]">
                            BKL-{selectedDrop.id.slice(-4).toUpperCase()}
                          </span>
                          <Button variant="outline" fullWidth onClick={() => setSelectedDrop(null)} className="h-12 rounded-full text-xs text-slate-400 mt-8">
                            Back to Map
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-20 rounded-[4rem] border-2 border-dashed border-white/5 text-center bg-emerald-950/10">
                    <p className="serif text-3xl text-white/8">Select a drop</p>
                    <p className="text-[10px] text-slate-700 uppercase tracking-widest mt-2 font-black">from the map or cards</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'donor-dashboard' && (
          <DonorDashboard onAddDrop={onAddDrop} myDrops={myDrops} />
        )}
        {view === 'sms' && (
          <SMSView drops={allDrops.filter((d) => d.status === 'available')} />
        )}
      </main>

      <footer className="py-40 mt-40 border-t border-white/5 bg-black/20 text-center">
        <Logo size="lg" className="justify-center mb-10" />
        <p className="text-amber-500 font-black text-[13px] uppercase tracking-[1.4em]">BarakahLink · 2026</p>
        <p className="text-slate-700 text-xs mt-4 tracking-wider">Community food sharing · Kitchener-Waterloo</p>
      </footer>
    </div>
  );
};
