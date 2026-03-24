/** Thin wrapper around localStorage for JWT token management */

const TOKEN_KEY = 'barakahlink_token';
const USER_KEY = 'barakahlink_user';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: 'DONOR' | 'RECIPIENT' | 'ADMIN';
}

export const authToken = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const storedUser = {
  get(): StoredUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredUser;
    } catch {
      return null;
    }
  },
  set(user: StoredUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
};
