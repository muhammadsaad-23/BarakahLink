
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
    <nav className="sticky top-0 z-50 glass-effect border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => onNavigate('landing')}
          >
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-400 p-2.5 rounded-2xl mr-3 shadow-lg shadow-emerald-200 transition-transform group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 21l-8-9 8-9 8 9-8 9z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">Barakat Meal</span>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-0.5">Kitchener-Waterloo</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-6">
            {(role === 'recipient' || role === 'guest') && (
              <div className="hidden md:flex items-center space-x-1">
                <button 
                  onClick={() => onNavigate('map')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${currentView === 'map' ? 'text-emerald-700 bg-emerald-50 shadow-sm' : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'}`}
                >
                  Find Food
                </button>
                <button 
                  onClick={() => onNavigate('sms')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${currentView === 'sms' ? 'text-emerald-700 bg-emerald-50 shadow-sm' : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'}`}
                >
                  SMS Access
                </button>
              </div>
            )}
            
            {role === 'donor' && (
              <button 
                onClick={() => onNavigate('donor-dashboard')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${currentView === 'donor-dashboard' ? 'text-emerald-700 bg-emerald-50 shadow-sm' : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'}`}
              >
                Donor Dashboard
              </button>
            )}

            <button 
              onClick={() => onRoleChange(role === 'donor' ? 'recipient' : 'donor')}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/50 transition-colors shadow-sm"
            >
              Mode: {role === 'donor' ? 'Donor' : 'Recipient'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
