import React, { useState } from 'react';
import { Button } from './Button';
import { FoodDrop } from '../types';
import { CANADIAN_CITIES } from '../constants';

interface DonorDashboardProps {
  onAddDrop: (drop: Partial<FoodDrop>) => Promise<void>;
  myDrops: FoodDrop[];
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({ onAddDrop, myDrops }) => {
  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone]           = useState('');
  const [address, setAddress]       = useState('');
  const [city, setCity]             = useState(CANADIAN_CITIES[0]);
  const [quantity, setQuantity]     = useState('');
  const [startTime, setStartTime]   = useState('');
  const [endTime, setEndTime]       = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError]   = useState('');
  const [showForm, setShowForm]     = useState(false);

  const resetForm = () => {
    setTitle(''); setDescription(''); setPhone(''); setAddress('');
    setQuantity(''); setStartTime(''); setEndTime(''); setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    const now   = new Date();
    const start = startTime ? new Date(`${now.toDateString()} ${startTime}`) : now;
    const end   = endTime
      ? new Date(`${now.toDateString()} ${endTime}`)
      : new Date(now.getTime() + 4 * 3_600_000);

    if (end <= start) {
      setFormError('Pickup end time must be after start time.');
      setIsSubmitting(false);
      return;
    }

    try {
      await onAddDrop({
        title, description,
        donorPhone: phone,
        pickupAddress: address,
        city, quantity,
        pickupStartTime: start.toISOString(),
        availableUntil:  end.toISOString(),
        lat: 43.45 + (Math.random() * 0.05 - 0.025),
        lng: -80.49 + (Math.random() * 0.05 - 0.025),
      });
      resetForm();
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to post donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="serif text-6xl md:text-7xl text-white mb-2 tracking-tight">My Listings</h2>
          <p className="text-slate-500 font-medium">Manage your active donations.</p>
        </div>
        <Button
          size="lg"
          className="rounded-2xl"
          onClick={() => { setShowForm(!showForm); resetForm(); }}
        >
          {showForm ? 'Cancel' : '+ Post Donation'}
        </Button>
      </header>

      {showForm && (
        <div className="celestial-glass p-10 rounded-[2.5rem] border border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
          {formError && (
            <div className="mb-8 px-5 py-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3">
              <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"/>
              </svg>
              <p className="text-rose-300 text-sm font-medium">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field label="Food Title">
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  className={input} placeholder="e.g. Fresh Bread Basket" />
              </Field>
              <Field label="Contact Phone">
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                  className={input} placeholder="519-XXX-XXXX" />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Field label="City">
                <select value={city} onChange={(e) => setCity(e.target.value)} className={input + ' appearance-none'}>
                  {CANADIAN_CITIES.map((c) => <option key={c} value={c} className="bg-emerald-950">{c}</option>)}
                </select>
              </Field>
              <div className="md:col-span-2">
                <Field label="Pickup Address">
                  <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
                    className={input} placeholder="Street address for pickup" />
                </Field>
              </div>
            </div>

            <Field label="Quantity">
              <input type="text" required value={quantity} onChange={(e) => setQuantity(e.target.value)}
                className={input} placeholder="e.g. 10 portions, 5 boxes" />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field label="Pickup Start">
                <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className={input} />
              </Field>
              <Field label="Pickup End">
                <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className={input} />
              </Field>
            </div>

            <Field label="Description">
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)}
                className={input + ' h-28 resize-none'}
                placeholder="Describe the food: ingredients, dietary info, condition…"
              />
            </Field>

            <div className="pt-2 flex items-center gap-4">
              <Button type="submit" fullWidth size="lg" className="h-16 text-base rounded-2xl" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                    Analysing &amp; posting…
                  </span>
                ) : 'Post Donation'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Listings grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myDrops.map((drop) => (
          <div key={drop.id} className="celestial-glass p-7 rounded-[2rem] border border-white/5 hover:border-amber-400/20 transition-all">
            <div className="flex justify-between items-start mb-5">
              <h4 className="serif text-2xl text-white leading-tight">{drop.title}</h4>
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ml-3 shrink-0 ${
                drop.status === 'claimed'
                  ? 'bg-amber-500/15 text-amber-400'
                  : drop.status === 'expired'
                  ? 'bg-rose-500/15 text-rose-400'
                  : 'bg-emerald-500/15 text-emerald-400'
              }`}>
                {drop.status}
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">{drop.city} · {drop.pickupAddress}</p>

            {drop.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {drop.tags.slice(0, 3).map((t) => (
                  <span key={t} className="px-2.5 py-0.5 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-wider text-slate-500 border border-white/5">{t}</span>
                ))}
              </div>
            )}

            {drop.aiSummary && (
              <p className="text-xs text-slate-400 italic leading-relaxed mb-4 line-clamp-2">"{drop.aiSummary}"</p>
            )}

            {drop.reservedBy ? (
              <div className="mt-2 p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Claimed By</p>
                <p className="text-sm font-bold text-white">{drop.reservedBy.name}</p>
                <p className="text-sm text-amber-500 font-black mt-0.5">{drop.reservedBy.phone}</p>
              </div>
            ) : (
              drop.status === 'available' && (
                <p className="text-xs text-slate-600 italic">Waiting for someone to claim.</p>
              )
            )}
          </div>
        ))}

        {myDrops.length === 0 && !showForm && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/8 rounded-[2.5rem]">
            <div className="text-5xl mb-4 opacity-20">🍱</div>
            <p className="serif text-3xl text-slate-700">No listings yet</p>
            <p className="text-slate-600 text-sm font-medium mt-2">Post your first donation above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Micro helpers ─────────────────────────────────────────────────────────────

const input = 'w-full px-5 py-3.5 bg-white/5 border border-white/5 rounded-xl focus:ring-2 focus:ring-amber-500/40 font-medium text-white outline-none transition-all placeholder:text-slate-600';

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">{label}</label>
    {children}
  </div>
);
