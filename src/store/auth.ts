import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  setToken: (t: string | null) => void;
  setUser: (u: User | null) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (t) => {
        set({ token: t });
        // Simulate setting user data when token is set
        if (t) {
          set({
            user: {
              id: '1',
              name: 'Nguyễn Văn A',
              email: 'admin@example.com',
              avatar: 'https://i.pravatar.cc/150?img=1',
              role: 'Admin'
            }
          });
        } else {
          set({ user: null });
        }
      },
      setUser: (u) => set({ user: u }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
