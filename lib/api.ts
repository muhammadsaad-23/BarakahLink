import { authToken } from './auth';
import type { FoodDrop } from '../types';

// In dev, Vite proxies /api → http://localhost:5001.
// In production, set VITE_API_BASE_URL to the deployed backend URL.
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

// ── Core fetch helper ─────────────────────────────────────────────────────────

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Array<{ field: string; message: string }>;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = authToken.get();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error ?? `Request failed: ${res.status}`);
  }

  return json.data as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'DONOR' | 'RECIPIENT' | 'ADMIN';
  };
}

export const auth = {
  signup(email: string, password: string, name: string, role: 'DONOR' | 'RECIPIENT'): Promise<AuthResult> {
    return request<AuthResult>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
  },

  login(email: string, password: string): Promise<AuthResult> {
    return request<AuthResult>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  me(): Promise<AuthResult['user']> {
    return request<AuthResult['user']>('/api/auth/me');
  },
};

// ── Food Drops ────────────────────────────────────────────────────────────────

export interface GetDropsParams {
  city?: string;
  tag?: string;
  status?: 'available' | 'claimed' | 'expired';
  search?: string;
}

export interface CreateDropInput {
  title: string;
  description: string;
  donorPhone: string;
  pickupAddress: string;
  city: string;
  quantity: string;
  pickupStartTime: string;
  availableUntil: string;
  lat: number;
  lng: number;
}

export const drops = {
  getAll(params: GetDropsParams = {}): Promise<FoodDrop[]> {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== 'All')
        .map(([k, v]) => [k, v as string]),
    ).toString();
    return request<FoodDrop[]>(`/api/drops${qs ? `?${qs}` : ''}`);
  },

  getOne(id: string): Promise<FoodDrop> {
    return request<FoodDrop>(`/api/drops/${id}`);
  },

  create(input: CreateDropInput): Promise<FoodDrop> {
    return request<FoodDrop>('/api/drops', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  reserve(id: string, name: string, phone: string): Promise<FoodDrop> {
    return request<FoodDrop>(`/api/drops/${id}/reserve`, {
      method: 'POST',
      body: JSON.stringify({ name, phone }),
    });
  },

  release(id: string): Promise<FoodDrop> {
    return request<FoodDrop>(`/api/drops/${id}/release`, { method: 'POST' });
  },

  update(id: string, data: Partial<CreateDropInput>): Promise<FoodDrop> {
    return request<FoodDrop>(`/api/drops/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return request<void>(`/api/drops/${id}`, { method: 'DELETE' });
  },
};
