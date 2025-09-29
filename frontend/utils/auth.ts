// utils/auth.ts
import { useAuthStore } from '@/store/authStore';

export const getUser = async () => {
  try {
    const res = await fetch('http://localhost:8000/me', {
      method: 'GET',
      credentials: 'include', // IMPORTANT: sends cookie to FastAPI
    });

    if (!res.ok) return null;

    const user = await res.json();
    return user;
  } catch (error) {
    return null;
  }
};


export const logout = async () => {
  try {
    const res = await fetch('http://localhost:8000/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (res.ok) {
      // Clear Zustand state
      useAuthStore.getState().setUser(null);

      // Redirect to login page
      window.location.href = '/login';
    } else {
      console.error('Failed to logout');
    }
  } catch (err) {
    console.error('Logout error:', err);
  }
};
