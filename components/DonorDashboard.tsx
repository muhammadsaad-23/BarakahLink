
import React, { useState } from 'react';
import { Button } from './Button';
import { analyzeFoodDescription } from '../services/geminiService';
import { FoodDrop } from '../types';
import { DIETARY_TAGS, CANADIAN_CITIES } from '../constants';

interface DonorDashboardProps {
  onAddDrop: (drop: Partial<FoodDrop>) => void;
  myDrops: FoodDrop[];
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({ onAddDrop, myDrops }) => {
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(CANADIAN_CITIES[0]);
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    const analysis = await analyzeFoodDescription(description);
    
    if (!analysis.isAppropriate) {
      alert("Please review your description. Content should be appropriate for our community.");
      setIsAnalyzing(false);
      return;
    }

    const now = new Date();
    const start = startTime ? new Date(`${now.toDateString()} ${startTime}`) : now;
    const end = endTime ? new Date(`${now.toDateString()} ${endTime}`) : new Date(now.getTime() + 4 * 60 * 60 * 1000);

    onAddDrop({
      title,
      description,
      donorPhone: phone,
      pickupAddress: address,
      city,
      quantity,
      tags: analysis.tags,
      aiSummary: analysis.summary,
      pickupStartTime: start.toISOString(),
      availableUntil: end.toISOString(),
      lat: 43.45 + (Math.random() * 0.05 - 0.025),
      lng: -80.49 + (Math.random() * 0.05 - 0.025),
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setAddress('');
    setPhone('');
    setQuantity('');
    setStartTime('');
    setEndTime('');
    setShowForm(false);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Your Barakat</h2>
          <p className="text-slate-500 font-medium">Manage surplus and set pickup timelines.</p>
        </div>
        <Button size="lg" className="rounded-2xl h-14 px-8 shadow-xl shadow-emerald-100" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create New Drop'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 animate-in fade-in slide-in-from-top-6 duration-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Meal Title</label>
                <input 
                  type="text" required value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500/20 transition-all outline-none font-medium"
                  placeholder="What are you sharing?"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Donor Phone Number (For coordination)</label>
                <input 
                  type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500/20 transition-all outline-none font-medium"
                  placeholder="e.g. 519-555-XXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">City</label>
                <select 
                  value={city} onChange={e => setCity(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500/20 transition-all outline-none font-medium"
                >
                  {CANADIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Address</label>
                <input 
                  type="text" required value={address} onChange={e => setAddress(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500/20 transition-all outline-none font-medium"
                  placeholder="Pickup Location"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Starts At</label>
                <input type="time" required value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Deadline</label>
                <input type="time" required value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
              <textarea 
                required value={description} onChange={e => setDescription(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl h-32 outline-none font-medium resize-none"
                placeholder="Include ingredients and dietary info..."
              ></textarea>
            </div>

            <Button type="submit" fullWidth className="h-16 rounded-2xl text-lg font-bold" disabled={isAnalyzing}>
              {isAnalyzing ? "AI Analyzing..." : 'Post Blessing'}
            </Button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myDrops.map(drop => (
          <div key={drop.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-extrabold text-lg text-slate-900">{drop.title}</h4>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${drop.status === 'claimed' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {drop.status}
                </span>
              </div>
              {drop.reservedBy && (
                <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Claimed By</p>
                  <p className="text-xs font-bold text-slate-700">{drop.reservedBy.name}</p>
                  <p className="text-xs text-emerald-600 font-bold">{drop.reservedBy.phone}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
