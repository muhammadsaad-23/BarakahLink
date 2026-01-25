
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
    <div className="max-w-6xl mx-auto py-24 px-6 text-center">
      <div className="inline-block px-4 py-1 rounded-full bg-emerald-50 text-[#064e3b] text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-emerald-100">
        Feed the Soul • Protect the Planet
      </div>
      <h1 className="serif text-7xl md:text-9xl text-slate-900 mb-8 leading-[0.9] tracking-tight">
        Sharing <span className="italic text-amber-600">Blessings</span>,<br />
        Preserving <span className="italic text-[#064e3b]">Dignity</span>.
      </h1>
      <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
        A professional bridge between surplus and community needs. Local, anonymous, and beautifully simple.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <Button size="lg" className="px-12 py-5 shadow-2xl" onClick={() => setView('auth')}>
          Get Started
        </Button>
        <Button variant="outline" size="lg" className="px-12 py-5" onClick={() => setView('sms')}>
          Access Offline via SMS
        </Button>
      </div>

      <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
        {[
          { title: 'Live Timeline', desc: 'Track pickup windows in real-time to ensure food safety and freshness.' },
          { title: 'Privacy First', desc: 'Secure pickup codes mean no personal ID is required for community support.' },
          { title: 'AI Optimized', desc: 'Gemini AI automatically categorizes and summarizes drops for fast discovery.' }
        ].map(item => (
          <div key={item.title} className="group">
            <h3 className="serif text-3xl text-slate-900 mb-3 group-hover:text-[#064e3b] transition-colors">{item.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfcf9]">
      <Navbar 
        role={role} 
        onRoleChange={setRole} 
        onNavigate={setView}
        currentView={view}
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {view === 'landing' && renderHero()}
        
        {view === 'auth' && (
          <AuthView onLogin={handleLogin} onCancel={() => setView('landing')} />
        )}

        {view === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="serif text-5xl text-slate-900 mb-2">Offerings</h2>
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                    <span>Browsing</span>
                    <select 
                      value={selectedCity} 
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="bg-transparent text-[#064e3b] font-black focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Regions</option>
                      {CANADIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {['All', ...DIETARY_TAGS.slice(0, 4)].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setFilter(tag)}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === tag ? 'bg-[#064e3b] text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </header>

              <div className="h-[450px] rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-premium">
                <MapView drops={filteredDrops.filter(d => d.status === 'available')} onSelectDrop={setSelectedDrop} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredDrops.map(drop => (
                  <FoodCard key={drop.id} drop={drop} onClick={setSelectedDrop} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-32">
                {selectedDrop ? (
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 block">{selectedDrop.city}</span>
                        <h3 className="serif text-4xl text-slate-900 leading-none">{selectedDrop.title}</h3>
                      </div>
                      <button onClick={() => {setSelectedDrop(null); setIsReserving(false);}} className="text-slate-300 hover:text-slate-900 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    
                    <div className="space-y-8">
                      {selectedDrop.status === 'available' && !isReserving && (
                        <>
                          <div className="p-6 bg-[#fdfcf9] rounded-2xl border border-slate-100 italic text-slate-700 text-sm leading-relaxed">
                            "{selectedDrop.aiSummary}"
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between text-xs font-bold border-b border-slate-50 pb-3">
                              <span className="text-slate-400 uppercase tracking-widest text-[10px]">Pickup Starts</span>
                              <span className="text-slate-900">{new Date(selectedDrop.pickupStartTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold border-b border-slate-50 pb-3">
                              <span className="text-slate-400 uppercase tracking-widest text-[10px]">Deadline</span>
                              <span className="text-rose-600 font-black">{new Date(selectedDrop.availableUntil).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-slate-400 uppercase tracking-widest text-[10px]">Location</span>
                              <span className="text-slate-600 text-right max-w-[60%]">{selectedDrop.pickupAddress}</span>
                            </div>
                          </div>
                          <Button 
                            fullWidth 
                            size="lg" 
                            className="rounded-2xl h-16" 
                            onClick={() => {
                              if (role === 'guest') {
                                setView('auth');
                              } else {
                                setIsReserving(true);
                              }
                            }}
                          >
                            Claim this Blessing
                          </Button>
                        </>
                      )}

                      {selectedDrop.status === 'available' && isReserving && (
                        <form onSubmit={finalizeReservation} className="space-y-6">
                          <p className="text-sm font-medium text-slate-600">Please provide contact details to finalize the reservation.</p>
                          <div className="space-y-4">
                            <input 
                              type="text" required placeholder="Full Name" 
                              value={reserveName} onChange={e => setReserveName(e.target.value)}
                              className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#064e3b] font-medium transition-all outline-none text-slate-900" 
                            />
                            <input 
                              type="tel" required placeholder="Mobile Number" 
                              value={reservePhone} onChange={e => setReservePhone(e.target.value)}
                              className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#064e3b] font-medium transition-all outline-none text-slate-900" 
                            />
                          </div>
                          <div className="flex flex-col gap-3">
                             <Button type="submit" fullWidth className="h-14">Confirm Reservation</Button>
                             <Button variant="ghost" fullWidth onClick={() => setIsReserving(false)}>Cancel</Button>
                          </div>
                        </form>
                      )}

                      {selectedDrop.status === 'claimed' && (
                        <div className="space-y-8 text-center">
                          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <div>
                            <h4 className="serif text-3xl text-slate-900 mb-1">Blessing Secured</h4>
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Code: BRKT-{Math.floor(Math.random()*9000)+1000}</p>
                          </div>

                          <div className="text-left space-y-4">
                            <div className="p-6 bg-[#fdfcf9] rounded-2xl border border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Donor Direct Contact</p>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-900">{selectedDrop.donorName}</span>
                                <a href={`tel:${selectedDrop.donorPhone}`} className="text-[#064e3b] font-black text-sm">{selectedDrop.donorPhone}</a>
                              </div>
                            </div>
                            <div className="p-6 bg-[#fdfcf9] rounded-2xl border border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pickup Address</p>
                              <p className="text-sm font-bold text-slate-900 leading-relaxed">{selectedDrop.pickupAddress}, {selectedDrop.city}</p>
                            </div>
                          </div>
                          <Button variant="outline" fullWidth onClick={() => setSelectedDrop(null)}>Back to Map</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-16 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center bg-slate-50/50">
                    <p className="serif text-3xl text-slate-400 mb-2">Select a Drop</p>
                    <p className="text-slate-400 font-medium text-sm">Review details and secure your meal from the map or list.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'donor-dashboard' && (
          <div className="py-8">
            <DonorDashboard 
              onAddDrop={handleAddDrop} 
              myDrops={drops.filter(d => d.donorId === userEmail || d.donorId === 'current-user')} 
            />
          </div>
        )}

        {view === 'sms' && (
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-16">
               <h2 className="serif text-6xl text-slate-900 mb-4">SMS Micro-Logistics</h2>
               <p className="text-slate-500 font-medium text-lg">Access blessings without an internet connection.</p>
            </header>
            <SMSView drops={drops.filter(d => d.status === 'available')} />
          </div>
        )}
      </main>

      <footer className="py-24 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="serif text-3xl text-[#064e3b] mb-4">Barakat Meal Canada</p>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Built for Social Impact • 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
