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
    // Fetch the session on initial load
    const fetchSession = async () => {
      const { data: session, error } = await supabase.auth.getSession();

      if (error || !session?.session?.user?.id) {
        // If no session is found, check localStorage for user data
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        if (token && userId && username && email && role) {
          // Restore user state from localStorage
          setUser({
            userId,
            username,
            email,
            isAuthenticated: true,
            role,
          });
        } else {
          // No session or localStorage data found, set user as unauthenticated
          setUser({
            userId: null,
            username: null,
            email: null,
            isAuthenticated: false,
            role: null,
          });
        }
        return;
      }

      // If a session is found, restore user state from Supabase
      setUser({
        userId: session.session.user.id,
        username: session.session.user.email || null,
        email: session.session.user.email || null,
        isAuthenticated: true,
        role: 'admin', // Assuming the user is an admin
      });

      // Save session data to localStorage
      localStorage.setItem('userId', session.session.user.id);
      localStorage.setItem('username', session.session.user.email || '');
      localStorage.setItem('email', session.session.user.email || '');
      localStorage.setItem('role', 'admin'); // Assuming the user is an admin
      localStorage.setItem('token', session.session.access_token);
    };

    fetchSession();

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

        // Save session data to localStorage
        localStorage.setItem('userId', session.user.id);
        localStorage.setItem('username', session.user.email || '');
        localStorage.setItem('email', session.user.email || '');
        localStorage.setItem('role', 'admin'); // Assuming the user is an admin
        localStorage.setItem('token', session.access_token);
      } else if (event === 'SIGNED_OUT') {
        setUser({ userId: null, username: null, email: null, isAuthenticated: false, role: null });

        // Clear localStorage on sign-out
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

      // Clear localStorage on logout
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