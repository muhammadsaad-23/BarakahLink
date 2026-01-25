
import React, { useState } from 'react';
import { Button } from './Button';
import { UserRole } from '../types';

interface AuthViewProps {
  onLogin: (role: UserRole, email: string) => void;
  onCancel: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, onCancel }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>('recipient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful auth
    onLogin(role, email);
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  return (
    <div className="max-w-md mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-[#064e3b] rounded-2xl flex items-center justify-center text-white font-bold mx-auto mb-6 shadow-xl shadow-emerald-900/10">
          <span className="serif text-3xl">B</span>
        </div>
        <h2 className="serif text-4xl text-slate-900 mb-2">Join Barakat Meal</h2>
        <p className="text-slate-500 font-medium">Sharing blessings, preserving dignity.</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-premium">
        {/* Role Selection */}
        <div className="flex p-1 bg-slate-50 rounded-2xl mb-8">
          <button
            type="button"
            onClick={() => setRole('recipient')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              role === 'recipient' ? 'bg-white text-[#064e3b] shadow-sm' : 'text-slate-400'
            }`}
          >
            I need food
          </button>
          <button
            type="button"
            onClick={() => setRole('donor')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              role === 'donor' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400'
            }`}
          >
            I want to donate
          </button>
        </div>

        {/* Tab Selection for Login vs Signup */}
        <div className="flex justify-center space-x-8 mb-8 border-b border-slate-50">
          <button 
            type="button"
            onClick={() => setMode('login')}
            className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${mode === 'login' ? 'text-[#064e3b] border-[#064e3b]' : 'text-slate-300 border-transparent hover:text-slate-500'}`}
          >
            Login
          </button>
          <button 
            type="button"
            onClick={() => setMode('signup')}
            className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${mode === 'signup' ? 'text-[#064e3b] border-[#064e3b]' : 'text-slate-300 border-transparent hover:text-slate-500'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#064e3b]/20 focus:ring-4 focus:ring-[#064e3b]/5 font-semibold text-slate-900 placeholder:text-slate-300 transition-all outline-none"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#064e3b]/20 focus:ring-4 focus:ring-[#064e3b]/5 font-semibold text-slate-900 placeholder:text-slate-300 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" fullWidth size="lg" className="rounded-2xl h-16 mt-4 shadow-xl shadow-emerald-900/10">
            {mode === 'login' ? 'Login to Account' : 'Create New Account'}
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-50"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="px-3 bg-white text-slate-300">Fast Access</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onLogin(role, 'google-user@gmail.com')}
            className="w-full flex items-center justify-center px-5 py-4 border border-slate-100 rounded-2xl font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>
      </div>

      <button
        onClick={onCancel}
        className="w-full mt-8 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors"
      >
        Return to Landing Page
      </button>
    </div>
  );
};
