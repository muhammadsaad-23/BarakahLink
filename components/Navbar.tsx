
import React from 'react';
import { UserRole } from '../types';

interface NavbarProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ role, onRoleChange, onNavigate, currentView }) => {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex items-center cursor-pointer space-x-3 group" 
            onClick={() => onNavigate('landing')}
          >
            <div className="w-10 h-10 bg-[#064e3b] rounded-xl flex items-center justify-center text-white font-bold transition-transform group-hover:rotate-12">
              <span className="serif text-xl">B</span>
            </div>
            <div className="flex flex-col">
              <span className="serif text-2xl font-bold text-[#064e3b] tracking-tight leading-none">Barakat Meal</span>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">Community Support</span>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => onNavigate('map')}
                className={`text-sm font-semibold transition-colors ${currentView === 'map' ? 'text-[#064e3b]' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Find Food
              </button>
              <button 
                onClick={() => onNavigate('sms')}
                className={`text-sm font-semibold transition-colors ${currentView === 'sms' ? 'text-[#064e3b]' : 'text-slate-500 hover:text-slate-900'}`}
              >
                SMS Portal
              </button>
              {role === 'donor' && (
                <button 
                  onClick={() => onNavigate('donor-dashboard')}
                  className={`text-sm font-semibold transition-colors ${currentView === 'donor-dashboard' ? 'text-[#064e3b]' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Dashboard
                </button>
              )}
            </div>
            
            <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

            {role === 'guest' ? (
              <button 
                onClick={() => onNavigate('auth')}
                className="px-6 py-2.5 rounded-2xl bg-[#064e3b] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#065f46] transition-all shadow-lg shadow-emerald-900/10"
              >
                Login
              </button>
            ) : (
              <button 
                onClick={() => {
                  onRoleChange('guest');
                  onNavigate('landing');
                }}
                className="px-4 py-1.5 rounded-full border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
