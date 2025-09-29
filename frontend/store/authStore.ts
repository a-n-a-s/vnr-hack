// stores/useAuthStore.ts

import { create } from 'zustand';

type User = {
  email: string;
  id: string;
};

type AuthStore = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    try {
      const res = await fetch('http://localhost:8000/user/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        set({ user: data, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      set({ user: null, loading: false });
    }
  },
}));
