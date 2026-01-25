
import React, { useState, useMemo, useEffect } from 'react';
import { UserRole, FoodDrop } from './backend/types';
import { DIETARY_TAGS, CANADIAN_CITIES } from './constants';
import { Navbar } from './components/Navbar';
import { MapView } from './components/MapView';
import { FoodCard } from './components/FoodCard';
import { DonorDashboard } from './components/DonorDashboard';
import { SMSView } from './components/SMSView';
import { Button } from './components/Button';
import { AuthView } from './components/AuthView';
import { Logo } from './components/Logo';
import { BarakatBackend } from './backend/server';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('guest');
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [view, setView] = useState<string>('landing');
  const [drops, setDrops] = useState<FoodDrop[]>([]);
  const [selectedDrop, setSelectedDrop] = useState<FoodDrop | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  
  const [isReserving, setIsReserving] = useState(false);
  const [reserveName, setReserveName] = useState('');
  const [reservePhone, setReservePhone] = useState('');

  // Fetch drops from the "Backend"
  useEffect(() => {
    BarakatBackend.getDrops().then(setDrops);
  }, []);

  const filteredDrops = useMemo(() => {
    return drops.filter(d => {
      const cityMatch = selectedCity === 'All' || d.city === selectedCity;
      const tagMatch = filter === 'All' || d.tags.includes(filter);
      return cityMatch && tagMatch;
    });
  }, [drops, filter, selectedCity]);

  const handleAddDrop = async (partialDrop: Partial<FoodDrop>) => {
    try {
      const newDrop = await BarakatBackend.createDrop(
        partialDrop, 
        user?.email || 'guest', 
        user?.name || 'Community Donor'
      );
      setDrops(prev => [newDrop, ...prev]);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create drop");
    }
  };

  const handleLogin = async (chosenRole: UserRole, email: string) => {
    const userData = await BarakatBackend.login(email);
    setRole(chosenRole);
    setUser(userData);
    setView(chosenRole === 'donor' ? 'donor-dashboard' : 'map');
  };

  const finalizeReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrop) return;
    try {
      const updatedDrop = await BarakatBackend.reserveDrop(selectedDrop.id, reserveName, reservePhone);
      setDrops(prev => prev.map(d => d.id === updatedDrop.id ? updatedDrop : d));
      setSelectedDrop(updatedDrop);
      setIsReserving(false);
      setReserveName('');
      setReservePhone('');
    } catch (e) {
      alert("Reservation failed. It might have been claimed already.");
    }
  };

  const renderHero = () => (
    <div className="relative max-w-7xl mx-auto pt-40 pb-72 px-6">
      <div className="flex flex-col items-center text-center">
        <div className="fade-up inline-flex items-center space-x-3 px-10 py-5 rounded-[2rem] glass-light border border-amber-500/20 mb-16 shadow-[0_15px_40px_-10px_rgba(251,191,36,0.1)] group hover:scale-105 transition-transform">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_20px_#fbbf24] animate-pulse"></span>
          <span className="text-[11px] font-black text-amber-200 uppercase tracking-[0.5em]">Active Support in Kitchener-Waterloo</span>
        </div>
        
        {/* Font size reduced as requested: from 6/10/12 to 5/8/10 */}
        <h1 className="fade-up serif text-[5rem] md:text-[8rem] lg:text-[10rem] text-white mb-12 leading-[0.85] tracking-tighter select-none" style={{ animationDelay: '0.2s' }}>
          Share the <span className="italic text-amber-500 block text-glow-gold">Meal.</span>
        </h1>
        
        <p className="fade-up text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-24 px-4 opacity-80" style={{ animationDelay: '0.4s' }}>
          Bridging the gap between local food surplus and those who need it most. Simple, private, and community-driven.
        </p>

        <div className="fade-up flex flex-col sm:flex-row items-center justify-center gap-12 relative z-10" style={{ animationDelay: '0.6s' }}>
          <Button size="lg" className="px-24 py-10 text-xl shadow-[0_30px_100px_-20px_rgba(251,191,36,0.4)] hover:shadow-[0_40px_120px_-25px_rgba(251,191,36,0.6)]" onClick={() => setView('auth')}>
            Find Food
          </Button>
          <Button variant="outline" size="lg" className="px-20 py-10 text-lg text-white border-white/10 hover:bg-white/5" onClick={() => setView('sms')}>
            SMS Access
          </Button>
        </div>
      </div>

      <div className="mt-80 grid grid-cols-1 md:grid-cols-3 gap-24">
        {[
          { icon: '🌙', title: 'Food AI', desc: 'Our Gemini engine automatically detects dietary needs and optimizes food delivery with precision.' },
          { icon: '🛡️', title: 'Private Pickup', desc: 'Anonymous pickups secured by simple codes. No ID checks, no questions asked.' },
          { icon: '✨', title: 'Zero Waste', desc: 'Transforming surplus into community meals. Reducing waste while supporting those in need.' }
        ].map((item, idx) => (
          <div key={item.title} className="fade-up group relative p-12 rounded-[4rem] celestial-glass border border-white/5 hover:border-amber-400/30 transition-all duration-700 hover:-translate-y-6" style={{ animationDelay: `${0.8 + idx * 0.2}s` }}>
            <div className="absolute top-10 right-10 text-8xl opacity-10 group-hover:opacity-20 transition-opacity grayscale group-hover:grayscale-0">{item.icon}</div>
            <h3 className="serif text-5xl text-white mb-8 group-hover:text-amber-400 transition-colors">{item.title}</h3>
            <p className="text-slate-400 font-medium leading-relaxed text-xl">{item.desc}</p>
            <div className="mt-12 h-[1px] w-0 bg-amber-500 transition-all duration-700 group-hover:w-full opacity-30"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar 
        role={role} 
        onRoleChange={setRole} 
        onNavigate={setView}
        currentView={view}
      />

      <main className="max-w-7xl mx-auto px-6 py-12 pt-40 md:pt-56">
        {view === 'landing' && renderHero()}
        
        {view === 'auth' && (
          <div className="max-w-xl mx-auto py-20">
            <AuthView onLogin={handleLogin} onCancel={() => setView('landing')} />
          </div>
        )}

        {view === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="lg:col-span-8 space-y-24">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                <div className="space-y-4">
                  <h2 className="serif text-7xl md:text-9xl text-white tracking-tighter text-glow-gold">Pickups</h2>
                  <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 shadow-inner">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Location</span>
                    <select 
                      value={selectedCity} 
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="bg-transparent text-amber-400 font-black focus:outline-none cursor-pointer text-sm"
                    >
                      <option value="All">All Regions</option>
                      {CANADIAN_CITIES.map(c => <option key={c} value={c} className="bg-emerald-950">{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                  {['All', ...DIETARY_TAGS.slice(0, 4)].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setFilter(tag)}
                      className={`px-12 py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-700 ${filter === tag ? 'bg-amber-500 text-emerald-950 shadow-[0_0_40px_rgba(251,191,36,0.3)]' : 'bg-white/5 text-slate-400 border border-white/5 hover:border-white/20'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </header>

              <div className="h-[700px] rounded-[5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative group border-[20px] border-white/5 celestial-glass">
                <MapView drops={filteredDrops.filter(d => d.status === 'available')} onSelectDrop={setSelectedDrop} />
                <div className="absolute inset-0 pointer-events-none ring-1 ring-white/10 rounded-[4.2rem]"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {filteredDrops.map(drop => (
                  <FoodCard key={drop.id} drop={drop} onClick={setSelectedDrop} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-48">
                {selectedDrop ? (
                  <div className="celestial-glass p-14 rounded-[5rem] border border-white/10 animate-in slide-in-from-right-12 duration-1000 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
                    <div className="flex justify-between items-start mb-16">
                      <div className="space-y-4">
                        <span className="text-[12px] font-black text-amber-500 uppercase tracking-[0.6em] mb-4 block">{selectedDrop.city}</span>
                        <h3 className="serif text-7xl text-white leading-[0.8] tracking-tighter text-glow-gold">{selectedDrop.title}</h3>
                      </div>
                      <button onClick={() => {setSelectedDrop(null); setIsReserving(false);}} className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-rose-500/20 text-slate-400 hover:text-white transition-all shadow-xl group">
                        <svg className="w-8 h-8 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    
                    <div className="space-y-16">
                      {selectedDrop.status === 'available' && !isReserving && (
                        <>
                          <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 italic text-slate-300 text-2xl leading-relaxed shadow-inner">
                            "{selectedDrop.aiSummary}"
                          </div>
                          <div className="space-y-10">
                            <div className="flex justify-between items-center border-b border-white/5 pb-8">
                              <span className="text-slate-500 uppercase tracking-[0.5em] text-[11px] font-black">Pickup Window</span>
                              <div className="text-right">
                                <span className="text-3xl font-black text-white">{new Date(selectedDrop.pickupStartTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                <span className="mx-3 text-slate-700">—</span>
                                <span className="text-3xl font-black text-amber-500">{new Date(selectedDrop.availableUntil).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <span className="text-slate-500 uppercase tracking-[0.5em] text-[11px] font-black">Address</span>
                              <p className="text-2xl font-black text-white leading-tight tracking-tight">{selectedDrop.pickupAddress}</p>
                            </div>
                          </div>
                          <Button 
                            fullWidth 
                            size="lg" 
                            className="h-32 text-2xl rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(251,191,36,0.5)]" 
                            onClick={() => {
                              if (role === 'guest') {
                                setView('auth');
                              } else {
                                setIsReserving(true);
                              }
                            }}
                          >
                            Reserve Pickup
                          </Button>
                        </>
                      )}

                      {selectedDrop.status === 'available' && isReserving && (
                        <form onSubmit={finalizeReservation} className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
                          <p className="text-2xl font-medium text-slate-400 italic leading-snug">Secure this food anonymously. No identification is required for pickup.</p>
                          <div className="space-y-8">
                            <input 
                              type="text" required placeholder="Pickup Name (Alias)" 
                              value={reserveName} onChange={e => setReserveName(e.target.value)}
                              className="w-full px-10 py-7 bg-white/5 border border-white/10 rounded-[2.5rem] focus:bg-white/10 focus:border-amber-500/40 focus:ring-8 focus:ring-amber-500/5 font-black text-white outline-none text-2xl transition-all placeholder:text-slate-600" 
                            />
                            <input 
                              type="tel" required placeholder="Phone for SMS Code" 
                              value={reservePhone} onChange={e => setReservePhone(e.target.value)}
                              className="w-full px-10 py-7 bg-white/5 border border-white/10 rounded-[2.5rem] focus:bg-white/10 focus:border-amber-500/40 focus:ring-8 focus:ring-amber-500/5 font-black text-white outline-none text-2xl transition-all placeholder:text-slate-600" 
                            />
                          </div>
                          <div className="flex flex-col gap-6">
                             <Button type="submit" fullWidth className="h-28 text-xl">Confirm Pickup</Button>
                             <Button variant="ghost" fullWidth onClick={() => setIsReserving(false)} className="uppercase tracking-[0.6em] text-[12px] font-black text-slate-500 hover:text-white">Cancel</Button>
                          </div>
                        </form>
                      )}

                      {selectedDrop.status === 'claimed' && (
                        <div className="space-y-16 text-center py-10 animate-in zoom-in-90 duration-1000">
                          <div className="w-48 h-48 bg-amber-500 text-emerald-950 rounded-[4rem] flex items-center justify-center mx-auto shadow-[0_0_100px_rgba(251,191,36,0.3)] relative group">
                            <svg className="w-24 h-24 transform transition-transform group-hover:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                            <div className="absolute inset-0 rounded-[4rem] animate-ping bg-amber-500 opacity-20"></div>
                          </div>
                          <div>
                            <h4 className="serif text-7xl text-white mb-4">Confirmed.</h4>
                            <p className="text-2xl font-medium text-slate-500">Your food is ready for pickup.</p>
                          </div>
                          
                          <div className="px-12 py-6 bg-white/5 rounded-[3rem] border border-amber-500/30">
                            <span className="text-2xl font-black text-amber-500 uppercase tracking-[0.6em]">CODE: BRKT-{Math.floor(Math.random()*9000)+1000}</span>
                          </div>

                          <div className="text-left space-y-8">
                            <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10">
                              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] mb-4">Donor Information</p>
                              <div className="flex justify-between items-center">
                                <span className="text-2xl font-black text-white">{selectedDrop.donorName}</span>
                                <a href={`tel:${selectedDrop.donorPhone}`} className="px-8 py-3 bg-amber-500 text-emerald-950 rounded-2xl text-[12px] font-black uppercase tracking-[0.4em] shadow-2xl">Call Now</a>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" fullWidth onClick={() => setSelectedDrop(null)} className="h-20 rounded-full text-sm text-slate-400">Back to Map</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-32 rounded-[6rem] border-4 border-dashed border-white/5 text-center bg-emerald-950/20 group transition-all duration-1000 hover:bg-emerald-950/40 hover:border-white/10">
                    <div className="w-32 h-32 text-amber-500/20 mx-auto mb-16 transition-all duration-1000 group-hover:scale-110 group-hover:rotate-[22.5deg] group-hover:text-amber-500/40">
                       <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l-2 2h4l-2-2zm0 3c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm1-8h-2v4h2v-4z"/></svg>
                    </div>
                    <p className="serif text-5xl text-white/10 mb-8 group-hover:text-white/30 transition-colors">Select a point</p>
                    <p className="text-slate-600 font-bold text-2xl leading-relaxed max-w-[280px] mx-auto">Click on a map marker to view details and reserve your food.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'donor-dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <DonorDashboard 
              onAddDrop={handleAddDrop} 
              myDrops={drops.filter(d => d.donorId === user?.email || d.donorId === 'current-user')} 
            />
          </div>
        )}

        {view === 'sms' && (
          <div className="max-w-4xl mx-auto py-20 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <header className="text-center mb-40">
               {/* Font size reduced as requested: from 6/8 to 5/7 */}
               <h2 className="serif text-5xl md:text-7xl text-white mb-12 tracking-tighter text-glow-gold">SMS Access.</h2>
               <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed italic opacity-80">"Support is just a text message away, even without an internet connection."</p>
            </header>
            <SMSView drops={drops.filter(d => d.status === 'available')} />
          </div>
        )}
      </main>

      <footer className="py-72 mt-72 border-t border-white/5 bg-black/20 backdrop-blur-3xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Logo size="lg" className="justify-center mb-32" />
          <p className="text-amber-500 font-black text-[14px] uppercase tracking-[1.5em] mb-48 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">Community Food Support • Canada • 2025</p>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-12 md:space-y-0 md:space-x-32 opacity-30 text-[12px] font-black uppercase tracking-[1em] text-slate-500">
            <span className="hover:text-white cursor-default transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-default transition-colors">How it works</span>
            <span className="hover:text-white cursor-default transition-colors">Join us</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
