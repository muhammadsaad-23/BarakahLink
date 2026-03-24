import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { auth, drops as dropsApi } from './lib/api';
import { authToken, storedUser } from './lib/auth';
import type { FoodDrop, UserRole } from './types';
import { AppView } from './frontend/index.tsx';
import { Toast, ToastType } from './components/Toast';

export interface AppUser {
  id: string;
  email: string;
  name: string;
}

interface ToastState {
  message: string;
  type: ToastType;
  key: number;
}

const App: React.FC = () => {
  const [role, setRole]                     = useState<UserRole>('guest');
  const [user, setUser]                     = useState<AppUser | null>(null);
  const [view, setView]                     = useState<string>('landing');
  const [drops, setDrops]                   = useState<FoodDrop[]>([]);
  const [dropsLoading, setDropsLoading]     = useState(true);
  const [selectedDrop, setSelectedDrop]     = useState<FoodDrop | null>(null);
  const [filter, setFilter]                 = useState<string>('All');
  const [selectedCity, setSelectedCity]     = useState<string>('All');
  const [isReserving, setIsReserving]       = useState(false);
  const [reserveName, setReserveName]       = useState('');
  const [reservePhone, setReservePhone]     = useState('');
  const [toast, setToast]                   = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type, key: Date.now() });
  }, []);

  // ── Restore session ────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = storedUser.get();
    if (saved && authToken.get()) {
      setUser({ id: saved.id, email: saved.email, name: saved.name });
      setRole(saved.role === 'DONOR' ? 'donor' : 'recipient');
    }
  }, []);

  // ── Load & auto-refresh drops ──────────────────────────────────────────────
  const fetchDrops = useCallback(async () => {
    try {
      const data = await dropsApi.getAll();
      setDrops(data);
    } catch {
      // Silently fail on background refresh; show error only on first load
    } finally {
      setDropsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrops();
    // Refresh every 60 s so listings stay current
    const id = setInterval(fetchDrops, 60_000);
    return () => clearInterval(id);
  }, [fetchDrops]);

  const filteredDrops = useMemo(() => {
    return drops.filter((d) => {
      const cityMatch = selectedCity === 'All' || d.city === selectedCity;
      const tagMatch  = filter === 'All' || d.tags.includes(filter);
      return cityMatch && tagMatch;
    });
  }, [drops, filter, selectedCity]);

  // ── Auth ───────────────────────────────────────────────────────────────────
  const handleLogin = useCallback(async (
    chosenRole: UserRole,
    email: string,
    password: string,
    mode: 'login' | 'signup',
  ) => {
    let result;
    if (mode === 'signup') {
      result = await auth.signup(email, password, email.split('@')[0], chosenRole === 'donor' ? 'DONOR' : 'RECIPIENT');
    } else {
      result = await auth.login(email, password);
    }

    authToken.set(result.token);
    storedUser.set(result.user);
    setUser({ id: result.user.id, email: result.user.email, name: result.user.name });
    setRole(result.user.role === 'DONOR' ? 'donor' : 'recipient');
    setView(result.user.role === 'DONOR' ? 'donor-dashboard' : 'map');
    showToast(`Welcome, ${result.user.name.split(' ')[0]}!`);
  }, [showToast]);

  const handleLogout = useCallback(() => {
    authToken.clear();
    setUser(null);
    setRole('guest');
    setView('landing');
  }, []);

  // ── Create drop ────────────────────────────────────────────────────────────
  const handleAddDrop = useCallback(async (partialDrop: Partial<FoodDrop>) => {
    const newDrop = await dropsApi.create({
      title:           partialDrop.title!,
      description:     partialDrop.description!,
      donorPhone:      partialDrop.donorPhone!,
      pickupAddress:   partialDrop.pickupAddress!,
      city:            partialDrop.city!,
      quantity:        partialDrop.quantity!,
      pickupStartTime: partialDrop.pickupStartTime!,
      availableUntil:  partialDrop.availableUntil!,
      lat:             partialDrop.lat ?? 43.45,
      lng:             partialDrop.lng ?? -80.49,
    });
    setDrops((prev) => [newDrop, ...prev]);
    showToast('Donation posted successfully!');
  }, [showToast]);

  // ── Reserve drop ───────────────────────────────────────────────────────────
  const handleReserve = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrop) return;
    const updatedDrop = await dropsApi.reserve(selectedDrop.id, reserveName, reservePhone);
    setDrops((prev) => prev.map((d) => (d.id === updatedDrop.id ? updatedDrop : d)));
    setSelectedDrop(updatedDrop);
    setIsReserving(false);
    setReserveName('');
    setReservePhone('');
    showToast('Pickup reserved! Show this confirmation at pickup.');
  }, [selectedDrop, reserveName, reservePhone, showToast]);

  return (
    <>
      <AppView
        role={role}           setRole={setRole}
        user={user}           view={view}           setView={setView}
        drops={filteredDrops} allDrops={drops}      dropsLoading={dropsLoading}
        selectedDrop={selectedDrop}                 setSelectedDrop={setSelectedDrop}
        filter={filter}       setFilter={setFilter}
        selectedCity={selectedCity}                 setSelectedCity={setSelectedCity}
        isReserving={isReserving}                   setIsReserving={setIsReserving}
        reserveName={reserveName}                   setReserveName={setReserveName}
        reservePhone={reservePhone}                 setReservePhone={setReservePhone}
        onAddDrop={handleAddDrop}
        onLogin={handleLogin}
        onReserve={handleReserve}
        onLogout={handleLogout}
        showToast={showToast}
      />
      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  );
};

export default App;
