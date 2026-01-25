
import React from 'react';
import { UserRole } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ role, onRoleChange, onNavigate, currentView }) => {
  return (
    <div className="fixed top-8 left-0 right-0 z-[100] px-6 pointer-events-none">
      <nav className="max-w-7xl mx-auto celestial-glass rounded-[2.5rem] border border-amber-500/10 pointer-events-auto h-20 md:h-24 flex items-center justify-between px-8 md:px-12 shadow-[0_15px_60px_-15px_rgba(6,78,59,0.15)]">
        <div 
          className="cursor-pointer pointer-events-auto" 
          onClick={() => onNavigate('landing')}
        >
          <Logo size="md" />
        </div>

        <div className="flex items-center space-x-8 lg:space-x-12">
          <div className="hidden md:flex items-center space-x-10">
            {[
              { name: 'Abundance Map', view: 'map' },
              { name: 'Silent Support', view: 'sms' }
            ].map((item) => (
              <button 
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all relative group py-2 ${currentView === item.view ? 'text-emerald-900' : 'text-slate-400 hover:text-emerald-800'}`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 transition-transform duration-500 origin-left ${currentView === item.view ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`}></span>
              </button>
            ))}
            {role === 'donor' && (
              <button 
                onClick={() => onNavigate('donor-dashboard')}
                className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all relative group py-2 ${currentView === 'donor-dashboard' ? 'text-emerald-900' : 'text-slate-400 hover:text-emerald-800'}`}
              >
                Stewardship
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 transition-transform duration-500 origin-left ${currentView === 'donor-dashboard' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`}></span>
              </button>
            )}
          </div>
          
          <div className="h-10 w-[1px] bg-emerald-900/5 hidden md:block"></div>

          {role === 'guest' ? (
            <button 
              onClick={() => onNavigate('auth')}
              className="group relative px-10 py-4 overflow-hidden rounded-2xl bg-emerald-900 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-105 active:scale-95 border-b-4 border-emerald-950"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10">Get Started</span>
            </button>
          ) : (
            <button 
              onClick={() => {
                onRoleChange('guest');
                onNavigate('landing');
              }}
              className="px-6 py-2.5 rounded-full border border-rose-100 text-rose-500 text-[9px] font-black uppercase tracking-widest hover:bg-rose-50 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};
