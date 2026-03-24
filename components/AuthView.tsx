import React, { useState } from 'react';
import { Button } from './Button';
import { UserRole } from '../types';
import { Logo } from './Logo';

interface AuthViewProps {
  onLogin: (role: UserRole, email: string, password: string, mode: 'login' | 'signup') => Promise<void>;
  onCancel: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, onCancel }) => {
  const [mode, setMode]       = useState<'login' | 'signup'>('login');
  const [role, setRole]       = useState<UserRole>('recipient');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onLogin(role, email, password, mode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-12 flex flex-col items-center">
        <Logo size="lg" className="mb-8" showText={false} />
        <h2 className="serif text-5xl text-white mb-3 tracking-tight">Join BarakahLink</h2>
        <p className="text-slate-500 font-medium">Connecting surplus food with local need.</p>
      </div>

      <div className="celestial-glass p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#064e3b] via-amber-400 to-[#064e3b]" />

        {/* Role */}
        <div className="flex p-1.5 bg-white/5 rounded-2xl mb-10 border border-white/5">
          {(['recipient', 'donor'] as UserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                role === r ? 'bg-amber-500 text-emerald-950 shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              {r === 'recipient' ? 'I need help' : 'I want to donate'}
            </button>
          ))}
        </div>

        {/* Login / Signup tab */}
        <div className="flex justify-center space-x-12 mb-10 border-b border-white/5">
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(''); }}
              className={`pb-5 text-[11px] font-black uppercase tracking-[0.3em] transition-all border-b-2 ${
                mode === m ? 'text-amber-500 border-amber-500' : 'text-slate-500 border-transparent hover:text-white'
              }`}
            >
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 px-5 py-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300">
            <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
            </svg>
            <p className="text-rose-300 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-8 py-5 bg-white/5 border border-white/5 rounded-[1.5rem] focus:bg-white/10 focus:border-amber-500/20 focus:ring-4 focus:ring-amber-500/5 font-bold text-white placeholder:text-slate-600 transition-all outline-none disabled:opacity-50"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-8 py-5 bg-white/5 border border-white/5 rounded-[1.5rem] focus:bg-white/10 focus:border-amber-500/20 focus:ring-4 focus:ring-amber-500/5 font-bold text-white placeholder:text-slate-600 transition-all outline-none disabled:opacity-50"
              placeholder="••••••••"
            />
            {mode === 'signup' && (
              <p className="text-[10px] text-slate-600 px-2 pt-1">Minimum 6 characters</p>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            className="rounded-[1.5rem] h-20 mt-6 shadow-2xl relative overflow-hidden"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                {mode === 'login' ? 'Signing in…' : 'Creating account…'}
              </span>
            ) : (
              mode === 'login' ? 'Welcome Back' : 'Create Account'
            )}
          </Button>

          <p className="text-center text-[10px] text-slate-600 font-medium pt-1">
            {mode === 'login' ? (
              <>No account?{' '}
                <button type="button" onClick={() => { setMode('signup'); setError(''); }} className="text-amber-500 hover:underline">Sign up free</button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button type="button" onClick={() => { setMode('login'); setError(''); }} className="text-amber-500 hover:underline">Sign in</button>
              </>
            )}
          </p>
        </form>
      </div>

      <button
        onClick={onCancel}
        className="w-full mt-10 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 hover:text-white transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};
