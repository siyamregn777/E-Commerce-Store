"use client"; // Mark this as a Client Component

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface User {
  userId: string | null;
  username: string | null;
  email: string | null;
  isAuthenticated: boolean;
  role: string | null;
}

interface UserContextProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>({
    userId: null,
    username: null,
    email: null,
    isAuthenticated: false,
    role: null,
  });

  useEffect(() => {
    // Check if token and other user data are in localStorage
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (token && userId && username && email && role) {
      // If token and user data exist in localStorage, restore the session
      setUser({
        userId,
        username,
        email,
        isAuthenticated: true,
        role,
      });
    } else {
      setUser({
        userId: null,
        username: null,
        email: null,
        isAuthenticated: false,
        role: null,
      });
    }

    // Listen for auth state changes (e.g., sign-in, sign-out)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.id) {
        setUser({
          userId: session.user.id,
          username: session.user.email || null,
          email: session.user.email || null,
          isAuthenticated: true,
          role: 'admin',
        });
      } else if (event === 'SIGNED_OUT') {
        setUser({ userId: null, username: null, email: null, isAuthenticated: false, role: null });
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      setUser({ userId: null, username: null, email: null, isAuthenticated: false, role: null });
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
