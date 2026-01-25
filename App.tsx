
import React, { useState, useMemo } from 'react';
import { UserRole, FoodDrop } from './types';
import { INITIAL_DROPS, DIETARY_TAGS, CANADIAN_CITIES } from './constants';
import { Navbar } from './components/Navbar';
import { MapView } from './components/MapView';
import { FoodCard } from './components/FoodCard';
import { DonorDashboard } from './components/DonorDashboard';
import { SMSView } from './components/SMSView';
import { Button } from './components/Button';
import { AuthView } from './components/AuthView';
import { Logo } from './components/Logo';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('guest');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [view, setView] = useState<string>('landing');
  const [drops, setDrops] = useState<FoodDrop[]>(INITIAL_DROPS);
  const [selectedDrop, setSelectedDrop] = useState<FoodDrop | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  
  const [isReserving, setIsReserving] = useState(false);
  const [reserveName, setReserveName] = useState('');
  const [reservePhone, setReservePhone] = useState('');

  const filteredDrops = useMemo(() => {
    return drops.filter(d => {
      const cityMatch = selectedCity === 'All' || d.city === selectedCity;
      const tagMatch = filter === 'All' || d.tags.includes(filter);
      return cityMatch && tagMatch;
    });
  }, [drops, filter, selectedCity]);

  const handleAddDrop = (partialDrop: Partial<FoodDrop>) => {
    const newDrop: FoodDrop = {
      id: Date.now().toString(),
      donorId: userEmail || 'current-user',
      donorName: userEmail?.split('@')[0] || 'Your Organization',
      status: 'available',
      createdAt: new Date().toISOString(),
      ...partialDrop as any
    };
    setDrops(prev => [newDrop, ...prev]);
  };

  const handleLogin = (chosenRole: UserRole, email: string) => {
    setRole(chosenRole);
    setUserEmail(email);
    setView(chosenRole === 'donor' ? 'donor-dashboard' : 'map');
  };

  const finalizeReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrop) return;
    setDrops(prev => prev.map(d => 
      d.id === selectedDrop.id ? { 
        ...d, status: 'claimed', reservedBy: { name: reserveName, phone: reservePhone } 
      } : d
    ));
    setSelectedDrop(prev => prev ? { 
      ...prev, status: 'claimed', reservedBy: { name: reserveName, phone: reservePhone } 
    } : null);
    setIsReserving(false);
    setReserveName('');
    setReservePhone('');
  };

  const renderHero = () => (
    <div className="relative max-w-7xl mx-auto pt-48 pb-64 px-6 text-center">
      {/* Background Decorative Motifs */}
      <div className="absolute top-20 left-0 w-96 h-96 opacity-[0.03] text-emerald-900 pointer-events-none -rotate-12">
        <svg viewBox="0 0 100 100" className="w-full h-full"><path fill="currentColor" d="M50 0L55 45L100 50L55 55L50 100L45 55L0 50L45 45Z"/></svg>
      </div>
      <div className="absolute bottom-20 right-0 w-[500px] h-[500px] opacity-[0.03] text-amber-500 pointer-events-none rotate-12">
        <svg viewBox="0 0 100 100" className="w-full h-full"><path fill="currentColor" d="M50 0L55 45L100 50L55 55L50 100L45 55L0 50L45 45Z"/></svg>
      </div>

      <div className="inline-flex items-center space-x-3 px-8 py-3 rounded-full celestial-glass border border-emerald-100/30 mb-16 animate-stagger-1 shadow-xl">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981] animate-pulse"></span>
        <span className="text-[12px] font-black text-emerald-900 uppercase tracking-[0.4em]">Propagating Abundance in KW</span>
      </div>
      
      <h1 className="serif text-[9rem] md:text-[16rem] text-slate-950 mb-12 leading-[0.7] tracking-tighter animate-stagger-2">
        Share the <span className="italic text-amber-600">Light.</span>
      </h1>
      
      <p className="text-2xl md:text-4xl text-slate-500 max-w-4xl mx-auto font-medium leading-[1.3] mb-24 px-4 animate-stagger-3">
        Where extra becomes enough. A sanctuary connecting local surplus with those who deserve it most.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-12 relative z-10 animate-stagger-3">
        <Button size="lg" className="px-24 py-9 text-xl shadow-[0_30px_60px_-15px_rgba(6,78,59,0.4)]" onClick={() => setView('auth')}>
          Enter Sanctuary
        </Button>
        <Button variant="outline" size="lg" className="px-20 py-9 celestial-glass text-emerald-900 text-lg hover:shadow-2xl" onClick={() => setView('sms')}>
          Silent Access (SMS)
        </Button>
      </div>

      <div className="mt-72 grid grid-cols-1 md:grid-cols-3 gap-32 text-left border-t border-emerald-900/10 pt-32">
        {[
          { icon: '🌙', title: 'Sacred Flow', desc: 'Transforming food waste into "Barakah" (Divine Blessing) through hyper-local logistics.' },
          { icon: '🛡️', title: 'Veiled Dignity', desc: 'Zero ID required. Anonymous pickup codes ensure the heart remains light and the hands stay hidden.' },
          { icon: '✨', title: 'Ethical Vision', desc: 'Our Gemini AI ensures Halal compliance and dietary safety with clinical precision.' }
        ].map(item => (
          <div key={item.title} className="group relative">
            <span className="text-6xl mb-8 block transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12">{item.icon}</span>
            <h3 className="serif text-5xl text-slate-900 mb-6 group-hover:text-emerald-800 transition-colors">{item.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-xl group-hover:text-slate-700 transition-colors">{item.desc}</p>
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

      <main className="max-w-7xl mx-auto px-6 py-12 pt-32 md:pt-40">
        {view === 'landing' && renderHero()}
        
        {view === 'auth' && (
          <AuthView onLogin={handleLogin} onCancel={() => setView('landing')} />
        )}

        {view === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="lg:col-span-8 space-y-24">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                <div className="space-y-4">
                  <h2 className="serif text-9xl text-slate-950 tracking-tighter">Harvest</h2>
                  <div className="flex items-center space-x-4 celestial-glass px-8 py-3.5 rounded-full border border-emerald-100/50 shadow-lg">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Region:</span>
                    <select 
                      value={selectedCity} 
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="bg-transparent text-emerald-900 font-black focus:outline-none cursor-pointer text-sm"
                    >
                      <option value="All">Worldwide (All Cities)</option>
                      {CANADIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3">
                  {['All', ...DIETARY_TAGS.slice(0, 4)].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setFilter(tag)}
                      className={`px-12 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700 ${filter === tag ? 'bg-emerald-900 text-amber-400 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.4)] translate-y-[-4px]' : 'celestial-glass text-slate-400 hover:text-emerald-900'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </header>

              <div className="h-[650px] rounded-[5rem] overflow-hidden premium-shadow relative group border-[12px] border-white/60 celestial-glass">
                <MapView drops={filteredDrops.filter(d => d.status === 'available')} onSelectDrop={setSelectedDrop} />
                <div className="absolute inset-0 pointer-events-none ring-1 ring-emerald-900/10 rounded-[4.2rem]"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {filteredDrops.map(drop => (
                  <FoodCard key={drop.id} drop={drop} onClick={setSelectedDrop} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-40">
                {selectedDrop ? (
                  <div className="celestial-glass p-14 rounded-[5rem] border-2 border-white premium-shadow animate-in slide-in-from-right-12 duration-700">
                    <div className="flex justify-between items-start mb-16">
                      <div className="space-y-4">
                        <span className="text-[12px] font-black text-amber-600 uppercase tracking-[0.5em] mb-4 block drop-shadow-sm">{selectedDrop.city}</span>
                        <h3 className="serif text-7xl text-slate-950 leading-[0.85] tracking-tighter">{selectedDrop.title}</h3>
                      </div>
                      <button onClick={() => {setSelectedDrop(null); setIsReserving(false);}} className="w-14 h-14 flex items-center justify-center rounded-full bg-white hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition-all shadow-md group">
                        <svg className="w-7 h-7 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    
                    <div className="space-y-16">
                      {selectedDrop.status === 'available' && !isReserving && (
                        <>
                          <div className="p-10 bg-white/50 rounded-[3rem] border border-emerald-900/5 italic text-slate-700 text-xl leading-relaxed shadow-inner font-medium">
                            "{selectedDrop.aiSummary}"
                          </div>
                          <div className="space-y-10">
                            <div className="flex justify-between items-center border-b border-emerald-900/5 pb-8">
                              <span className="text-slate-400 uppercase tracking-[0.4em] text-[11px] font-black">Divine Window</span>
                              <div className="text-right">
                                <span className="text-2xl font-black text-emerald-950">{new Date(selectedDrop.pickupStartTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                <span className="mx-2 text-slate-300">—</span>
                                <span className="text-2xl font-black text-rose-600">{new Date(selectedDrop.availableUntil).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <span className="text-slate-400 uppercase tracking-[0.4em] text-[11px] font-black">Sanctuary Address</span>
                              <p className="text-2xl font-black text-slate-950 leading-tight">{selectedDrop.pickupAddress}</p>
                            </div>
                          </div>
                          <Button 
                            fullWidth 
                            size="lg" 
                            className="h-28 text-xl rounded-[2.5rem]" 
                            onClick={() => {
                              if (role === 'guest') {
                                setView('auth');
                              } else {
                                setIsReserving(true);
                              }
                            }}
                          >
                            Receive Blessing
                          </Button>
                        </>
                      )}

                      {selectedDrop.status === 'available' && isReserving && (
                        <form onSubmit={finalizeReservation} className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
                          <p className="text-2xl font-medium text-slate-500 italic leading-snug px-2">"True wealth is sharing what remains." - Provide details to secure this gift.</p>
                          <div className="space-y-8">
                            <input 
                              type="text" required placeholder="Your Name / Organization" 
                              value={reserveName} onChange={e => setReserveName(e.target.value)}
                              className="w-full px-12 py-7 bg-white/60 border-2 border-transparent rounded-[2.5rem] focus:bg-white focus:border-emerald-500/20 focus:ring-8 focus:ring-emerald-900/5 font-black text-slate-950 transition-all outline-none text-xl placeholder:text-slate-300" 
                            />
                            <input 
                              type="tel" required placeholder="Active Phone Number" 
                              value={reservePhone} onChange={e => setReservePhone(e.target.value)}
                              className="w-full px-12 py-7 bg-white/60 border-2 border-transparent rounded-[2.5rem] focus:bg-white focus:border-emerald-500/20 focus:ring-8 focus:ring-emerald-900/5 font-black text-slate-950 transition-all outline-none text-xl placeholder:text-slate-300" 
                            />
                          </div>
                          <div className="flex flex-col gap-6">
                             <Button type="submit" fullWidth className="h-24 text-lg">Confirm Receipt</Button>
                             <Button variant="ghost" fullWidth onClick={() => setIsReserving(false)} className="uppercase tracking-[0.5em] text-[11px] font-black opacity-50">Go Back</Button>
                          </div>
                        </form>
                      )}

                      {selectedDrop.status === 'claimed' && (
                        <div className="space-y-16 text-center animate-in zoom-in-90 duration-700">
                          <div className="w-40 h-40 bg-emerald-950 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-2xl relative ring-[12px] ring-emerald-900/5">
                            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                            <div className="absolute inset-0 rounded-full animate-ping bg-emerald-900 opacity-20"></div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="serif text-6xl text-slate-950 leading-none">Alhamdulillah.</h4>
                            <p className="text-lg font-medium text-slate-400">Blessing secured successfully.</p>
                          </div>
                          
                          <div className="inline-block px-12 py-5 bg-amber-50 rounded-[2.5rem] border border-amber-200/50 shadow-inner">
                            <span className="text-xl font-black text-amber-700 uppercase tracking-[0.5em]">Code: BRKT-{Math.floor(Math.random()*9000)+1000}</span>
                          </div>

                          <div className="text-left space-y-8">
                            <div className="p-10 bg-white/60 rounded-[3rem] border border-emerald-900/5 shadow-sm">
                              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Direct Link</p>
                              <div className="flex justify-between items-center">
                                <span className="text-2xl font-black text-slate-900">{selectedDrop.donorName}</span>
                                <a href={`tel:${selectedDrop.donorPhone}`} className="px-6 py-2.5 rounded-full bg-emerald-900 text-amber-400 text-sm font-black shadow-lg">{selectedDrop.donorPhone}</a>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" fullWidth onClick={() => setSelectedDrop(null)} className="h-20 rounded-full text-sm border-2">Return Home</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-32 rounded-[6rem] border-4 border-dashed border-emerald-900/10 text-center bg-white/10 relative group overflow-hidden animate-in fade-in duration-1500">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/[0.03] transition-colors"></div>
                    <div className="w-32 h-32 text-amber-300 mx-auto mb-12 opacity-40 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-1000">
                       <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l-2 2h4l-2-2zm0 3c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm1-8h-2v4h2v-4z"/></svg>
                    </div>
                    <p className="serif text-6xl text-slate-200 mb-8 transition-colors duration-700 group-hover:text-emerald-900/30">Awaiting Ritual</p>
                    <p className="text-slate-400 font-semibold text-xl leading-relaxed max-w-xs mx-auto">Select a gift on the map to begin the ceremony of stewardship.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'donor-dashboard' && (
          <div className="py-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <DonorDashboard 
              onAddDrop={handleAddDrop} 
              myDrops={drops.filter(d => d.donorId === userEmail || d.donorId === 'current-user')} 
            />
          </div>
        )}

        {view === 'sms' && (
          <div className="max-w-4xl mx-auto py-32 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <header className="text-center mb-40 relative">
               <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-32 h-32 opacity-10 text-emerald-900"><svg viewBox="0 0 100 100"><path fill="currentColor" d="M50 0L100 50L50 100L0 50Z"/></svg></div>
               <h2 className="serif text-[10rem] text-slate-950 mb-12 tracking-tighter">Silent Support.</h2>
               <p className="text-3xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed italic">"For those whose connection is thin, but whose need is heavy. We reach across the void."</p>
            </header>
            <SMSView drops={drops.filter(d => d.status === 'available')} />
          </div>
        )}
      </main>

      <footer className="py-64 mt-64 border-t border-emerald-900/5 bg-white/40 celestial-glass relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="mx-auto mb-20">
            <Logo size="lg" className="justify-center" />
          </div>
          <p className="text-amber-600 font-black text-[12px] uppercase tracking-[0.8em] mb-32">Canada • Sharing the Abundance • 2025</p>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-20 opacity-40 text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">
            <span className="hover:text-emerald-900 cursor-default transition-colors">Privacy as Proxy</span>
            <span className="hover:text-emerald-900 cursor-default transition-colors">Digital Sadaqah</span>
            <span className="hover:text-emerald-900 cursor-default transition-colors">Open Abundance</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
