
import React, { useState, useMemo } from 'react';
import { UserRole, FoodDrop } from './types';
import { INITIAL_DROPS, DIETARY_TAGS, CANADIAN_CITIES } from './constants';
import { Navbar } from './components/Navbar';
import { MapView } from './components/MapView';
import { FoodCard } from './components/FoodCard';
import { DonorDashboard } from './components/DonorDashboard';
import { SMSView } from './components/SMSView';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('guest');
  const [view, setView] = useState<string>('landing');
  const [drops, setDrops] = useState<FoodDrop[]>(INITIAL_DROPS);
  const [selectedDrop, setSelectedDrop] = useState<FoodDrop | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  
  // Reservation Form State
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
      donorId: 'current-user',
      donorName: 'Your Organization',
      status: 'available',
      createdAt: new Date().toISOString(),
      ...partialDrop as any
    };
    setDrops(prev => [newDrop, ...prev]);
  };

  const finalizeReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrop) return;

    setDrops(prev => prev.map(d => 
      d.id === selectedDrop.id ? { 
        ...d, 
        status: 'claimed', 
        reservedBy: { name: reserveName, phone: reservePhone } 
      } : d
    ));

    // Update the local selectedDrop state to reflect claimed status immediately
    setSelectedDrop(prev => prev ? { 
      ...prev, 
      status: 'claimed', 
      reservedBy: { name: reserveName, phone: reservePhone } 
    } : null);

    setIsReserving(false);
    setReserveName('');
    setReservePhone('');
  };

  const renderLanding = () => (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-20 space-y-6">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          Serving Community across Canada
        </div>
        <h1 className="text-5xl md:text-7xl font-[800] text-slate-900 mb-6 tracking-tight leading-[1.1]">
          Sharing <span className="text-emerald-600">Blessings</span>,<br />
          Feeding <span className="text-amber-500">Community</span>.
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Barakat Meal is the digital bridge between surplus food and those who need it most. 
          Enter your details, claim a blessing, and connect with local donors.
        </p>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="px-10 h-14 rounded-2xl shadow-xl shadow-emerald-100" onClick={() => { setRole('recipient'); setView('map'); }}>
            Explore Local Blessings
          </Button>
          <Button size="lg" variant="outline" className="px-10 h-14 rounded-2xl bg-white border-2" onClick={() => setView('sms')}>
            SMS Micro-Logistics
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-12">
      <Navbar 
        role={role} 
        onRoleChange={setRole} 
        onNavigate={setView}
        currentView={view}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'landing' && renderLanding()}

        {view === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Offerings</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Region:</span>
                    <select 
                      value={selectedCity} 
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="bg-transparent text-xs font-bold text-emerald-600 focus:outline-none uppercase tracking-widest"
                    >
                      <option value="All">All Canada</option>
                      {CANADIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
                  {['All', ...DIETARY_TAGS.slice(0, 3)].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setFilter(tag)}
                      className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${filter === tag ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-white text-slate-600 border-slate-200'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="shadow-2xl shadow-slate-200 rounded-[2rem] overflow-hidden border border-slate-200/50 h-[400px]">
                <MapView drops={filteredDrops.filter(d => d.status === 'available')} onSelectDrop={setSelectedDrop} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDrops.map(drop => (
                  <FoodCard key={drop.id} drop={drop} onClick={setSelectedDrop} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-28">
                {selectedDrop ? (
                  <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <div className="flex justify-between items-start mb-6">
                      <div className="pr-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-2">{selectedDrop.city}</span>
                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{selectedDrop.title}</h3>
                      </div>
                      <button onClick={() => {setSelectedDrop(null); setIsReserving(false);}} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {selectedDrop.status === 'available' && !isReserving && (
                        <>
                          <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-[1.5rem] border border-emerald-100/50">
                            <p className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-2">Barakat Insight</p>
                            <p className="text-slate-700 font-medium italic leading-relaxed text-sm">"{selectedDrop.aiSummary}"</p>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-400 uppercase tracking-widest">Starts</span>
                              <span className="text-slate-900">{new Date(selectedDrop.pickupStartTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-400 uppercase tracking-widest">Expires</span>
                              <span className="text-rose-500">{new Date(selectedDrop.availableUntil).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-400 uppercase tracking-widest">Location</span>
                              <span className="text-slate-600">{selectedDrop.pickupAddress}</span>
                            </div>
                          </div>
                          <Button fullWidth size="lg" className="h-14 rounded-2xl" onClick={() => setIsReserving(true)}>
                            Reserve Now
                          </Button>
                        </>
                      )}

                      {selectedDrop.status === 'available' && isReserving && (
                        <form onSubmit={finalizeReservation} className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                          <h4 className="text-lg font-bold text-slate-900">Claim Blessing</h4>
                          <div className="space-y-4">
                            <input 
                              type="text" required placeholder="Your Full Name" 
                              value={reserveName} onChange={e => setReserveName(e.target.value)}
                              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm" 
                            />
                            <input 
                              type="tel" required placeholder="Mobile Number" 
                              value={reservePhone} onChange={e => setReservePhone(e.target.value)}
                              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm" 
                            />
                          </div>
                          <div className="flex gap-2">
                             <Button type="submit" className="flex-1 h-12 rounded-xl">Confirm Claim</Button>
                             <Button variant="outline" className="h-12 rounded-xl" onClick={() => setIsReserving(false)}>Cancel</Button>
                          </div>
                          <p className="text-[9px] text-slate-400 text-center font-bold uppercase tracking-widest">By confirming, you agree to pick up before the deadline.</p>
                        </form>
                      )}

                      {selectedDrop.status === 'claimed' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                          <div className="bg-amber-50 p-6 rounded-[1.5rem] border border-amber-100 text-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h4 className="text-lg font-bold text-amber-900">Blessing Reserved!</h4>
                            <p className="text-xs font-bold text-amber-700 tracking-widest uppercase mt-1">CODE: BRKT-{Math.floor(Math.random()*9000)+1000}</p>
                          </div>

                          <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Donor Contact Info</p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-700">{selectedDrop.donorName}</span>
                                <a href={`tel:${selectedDrop.donorPhone}`} className="text-emerald-600 font-black text-sm hover:underline">{selectedDrop.donorPhone}</a>
                              </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pickup Location</p>
                              <p className="text-sm font-bold text-slate-700">{selectedDrop.pickupAddress}, {selectedDrop.city}</p>
                            </div>
                          </div>

                          <Button variant="outline" fullWidth onClick={() => {setSelectedDrop(null); setIsReserving(false);}}>
                            Close & Return
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-100/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Find your Blessing</h3>
                    <p className="text-slate-400 font-medium">Select a meal to see the pickup timeline and secure your portion.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'donor-dashboard' && (
          <div className="max-w-5xl mx-auto py-4">
            <DonorDashboard 
              onAddDrop={handleAddDrop} 
              myDrops={drops.filter(d => d.donorId === 'current-user')} 
            />
          </div>
        )}

        {view === 'sms' && (
          <div className="max-w-4xl mx-auto py-8">
            <SMSView drops={drops.filter(d => d.status === 'available')} />
          </div>
        )}
      </main>

      <footer className="mt-20 py-12 border-t border-slate-200/50 text-center space-y-4">
        <span className="text-slate-900 font-extrabold tracking-tight">Barakat Meal Canada</span>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">© 2025 • Serving with Dignity</p>
      </footer>
    </div>
  );
};

export default App;
